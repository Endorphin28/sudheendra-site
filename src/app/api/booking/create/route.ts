import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { supabaseAdmin } from "@/lib/supabase";
import { getAvailableSlots, istDateOf } from "@/lib/availability";
import { CONSULT_TYPES, isConsultType } from "@/lib/consultations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, patientEmail, patientPhone, consultType, slotStart } = body;

    if (!patientName || !patientEmail || !patientPhone || !slotStart || !isConsultType(consultType)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Price, duration and end time come from the server, never the client.
    // Re-checking availability here also prevents two patients taking the same slot.
    const consult = CONSULT_TYPES[consultType];
    const slots = await getAvailableSlots(istDateOf(slotStart), consultType);
    const slot = slots.find((s) => s.startISO === new Date(slotStart).toISOString());
    if (!slot) {
      return NextResponse.json(
        { error: "This slot is no longer available. Please choose another time." },
        { status: 409 },
      );
    }

    const order = await razorpay.orders.create({
      amount:   consult.fee * 100, // paise
      currency: "INR",
      notes: {
        patientName,
        patientEmail,
        consultType,
        slotStart: slot.startISO,
      },
    });

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        patient_name:      patientName,
        patient_email:     patientEmail,
        patient_phone:     patientPhone,
        appointment_type:  consult.name,
        slot_start:        slot.startISO,
        slot_end:          slot.endISO,
        amount:            consult.fee,
        payment_status:    "pending",
        booking_status:    "pending",
        razorpay_order_id: order.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      orderId:   order.id,
      amount:    order.amount,
      currency:  order.currency,
      bookingId: booking.id,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
