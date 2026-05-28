import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendPatientConfirmation, sendDoctorNotification } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;

    // 1. Verify Razorpay signature
    const isValid = verifyRazorpaySignature({
      orderId:   razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      await supabaseAdmin
        .from("bookings")
        .update({ payment_status: "failed" })
        .eq("id", bookingId);
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Fetch booking details
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 3. Create Google Calendar event with Meet link
    const { eventId, meetLink } = await createCalendarEvent({
      summary:      `Online Consultation — ${booking.patient_name}`,
      description:  `Patient: ${booking.patient_name}\nPhone: ${booking.patient_phone}\nEmail: ${booking.patient_email}\n\nBooking ID: ${bookingId}`,
      startISO:     booking.slot_start,
      endISO:       booking.slot_end,
      patientEmail: booking.patient_email,
      doctorEmail:  "consultdrhuddar@gmail.com",
    });

    // 4. Update Supabase booking to confirmed
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_status:     "paid",
        booking_status:     "confirmed",
        razorpay_payment_id: razorpay_payment_id,
        google_event_id:    eventId,
        meet_link:          meetLink,
      })
      .eq("id", bookingId);

    if (updateError) throw updateError;

    // 5. Send emails (non-blocking — don't fail if email fails)
    try {
      await Promise.all([
        sendPatientConfirmation({
          patientName:  booking.patient_name,
          patientEmail: booking.patient_email,
          slotStart:    booking.slot_start,
          slotEnd:      booking.slot_end,
          meetLink,
          bookingId,
        }),
        sendDoctorNotification({
          patientName:  booking.patient_name,
          patientEmail: booking.patient_email,
          patientPhone: booking.patient_phone,
          slotStart:    booking.slot_start,
          meetLink,
          bookingId,
        }),
      ]);
    } catch (emailErr) {
      console.error("Email send error (non-fatal):", emailErr);
    }

    return NextResponse.json({ success: true, bookingId, meetLink });
  } catch (err) {
    console.error("Verify booking error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
