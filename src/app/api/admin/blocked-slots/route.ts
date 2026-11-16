import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";
import { isValidTime, toMinutes } from "@/lib/schedule-shared";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// GET — list upcoming blocked dates/times
export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const today = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10); // IST date
  const { data, error } = await supabaseAdmin
    .from("blocked_slots")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .order("slot_start", { ascending: true, nullsFirst: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — block a full day ({date}) or a time range ({date, slot_start: "HH:MM", slot_end: "HH:MM"})
export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { date, slot_start, slot_end, reason } = await req.json().catch(() => ({}));
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const partial = slot_start || slot_end;
  if (partial) {
    if (!isValidTime(slot_start) || !isValidTime(slot_end)) {
      return NextResponse.json({ error: "Invalid time" }, { status: 400 });
    }
    if (toMinutes(slot_end) <= toMinutes(slot_start)) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }
  }

  const { data, error } = await supabaseAdmin
    .from("blocked_slots")
    .insert({
      date,
      slot_start: partial ? `${slot_start}:00` : null,
      slot_end: partial ? `${slot_end}:00` : null,
      reason: typeof reason === "string" ? reason.slice(0, 200) : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — unblock
export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { error } = await supabaseAdmin.from("blocked_slots").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
