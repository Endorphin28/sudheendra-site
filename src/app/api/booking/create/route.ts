import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, patientEmail, patientPhone, slotStart, slotEnd } = body;

    if (!patientName || !patientEmail || !patientPhone || !slotStart || !slotEnd) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Double-check slot is still available (prevent race conditions)
    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("slot_start", slotStart)
      .in("payment_status", ["paid", "pending"])
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount:   120000, // ₹1200 in paise
      currency: "INR",
      notes: {
        patientName,
        patientEmail,
        slotStart,
      },
    });

    // Save pending booking to Supabase
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        patient_name:     patientName,
        patient_email:    patientEmail,
        patient_phone:    patientPhone,
        appointment_type: "Online Consultation",
        slot_start:       slotStart,
        slot_end:         slotEnd,
        amount:           1200,
        payment_status:   "pending",
        booking_status:   "pending",
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
