import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendPatientConfirmation, sendDoctorNotification } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    // Find booking by order ID
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("razorpay_order_id", orderId)
      .maybeSingle();

    if (!booking || booking.payment_status === "paid") {
      return NextResponse.json({ received: true });
    }

    try {
      const { eventId, meetLink } = await createCalendarEvent({
        summary:      `Online Consultation — ${booking.patient_name}`,
        description:  `Patient: ${booking.patient_name}\nPhone: ${booking.patient_phone}\nEmail: ${booking.patient_email}`,
        startISO:     booking.slot_start,
        endISO:       booking.slot_end,
        patientEmail: booking.patient_email,
        doctorEmail:  "consultdrhuddar@gmail.com",
      });

      await supabaseAdmin
        .from("bookings")
        .update({
          payment_status:      "paid",
          booking_status:      "confirmed",
          razorpay_payment_id: paymentId,
          google_event_id:     eventId,
          meet_link:           meetLink,
        })
        .eq("id", booking.id);

      await Promise.allSettled([
        sendPatientConfirmation({
          patientName:  booking.patient_name,
          patientEmail: booking.patient_email,
          slotStart:    booking.slot_start,
          slotEnd:      booking.slot_end,
          meetLink,
          bookingId:    booking.id,
        }),
        sendDoctorNotification({
          patientName:  booking.patient_name,
          patientEmail: booking.patient_email,
          patientPhone: booking.patient_phone,
          slotStart:    booking.slot_start,
          meetLink,
          bookingId:    booking.id,
        }),
      ]);
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
