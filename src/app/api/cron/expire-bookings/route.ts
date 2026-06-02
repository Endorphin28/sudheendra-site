import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ payment_status: "failed", booking_status: "cancelled" })
    .eq("payment_status", "pending")
    .lt("created_at", cutoff)
    .select("id");

  if (error) {
    console.error("Expire bookings error:", error);
    return NextResponse.json({ error: "Failed to expire bookings" }, { status: 500 });
  }

  return NextResponse.json({ expired: data?.length ?? 0 });
}
