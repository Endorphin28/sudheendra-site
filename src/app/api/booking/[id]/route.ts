import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("id, patient_name, patient_email, appointment_type, slot_start, slot_end, amount, booking_status, meet_link, created_at")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
