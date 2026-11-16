import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Without this, Next.js caches the response at build time and the job never touches the database
export const dynamic = "force-dynamic";

export async function GET() {
  // Heartbeat write so Supabase's free tier never pauses the project for inactivity
  await supabaseAdmin.from("keepalive").upsert({ id: 1, pinged_at: new Date().toISOString() });

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
