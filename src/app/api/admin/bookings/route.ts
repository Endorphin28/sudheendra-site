import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.ADMIN_PASSWORD;
}

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
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ booking_status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
