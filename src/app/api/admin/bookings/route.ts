import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
const BOOKING_STATUSES = ["confirmed", "pending", "cancelled", "completed"];

// GET — list all bookings
export async function GET(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");
  let query = supabaseAdmin
    .from("bookings")
    .select("*")
    .order("slot_start", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("booking_status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// PATCH — update booking status
export async function PATCH(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id, booking_status } = await req.json();
  if (typeof id !== "string" || !BOOKING_STATUSES.includes(booking_status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ booking_status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
