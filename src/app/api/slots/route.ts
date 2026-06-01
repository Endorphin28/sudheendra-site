import { NextRequest, NextResponse } from "next/server";
import { getBusySlots } from "@/lib/google-calendar";
import { supabaseAdmin } from "@/lib/supabase";

const SLOTS = [
  { label: "2:30 PM – 3:00 PM", startTime: "14:30", endTime: "15:00" },
  { label: "3:15 PM – 3:45 PM", startTime: "15:15", endTime: "15:45" },
];

function toISO(dateStr: string, timeStr: string): string {
  return new Date(`${dateStr}T${timeStr}:00+05:30`).toISOString();
}

function slotsOverlap(s1: Date, e1: Date, s2: Date, e2: Date): boolean {
  return s1 < e2 && e1 > s2;
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  const day = new Date(`${date}T12:00:00+05:30`).getDay();
  if (![1, 3, 5].includes(day)) {
    return NextResponse.json({ error: "No slots on this day" }, { status: 400 });
  }

  try {
    const dayStart = new Date(`${date}T00:00:00+05:30`).toISOString();
    const dayEnd   = new Date(`${date}T23:59:59+05:30`).toISOString();

    // Run all queries in parallel
    const [busy, dbBookingsResult, blockedResult] = await Promise.all([
      getBusySlots(date),
      supabaseAdmin
        .from("bookings")
        .select("slot_start, slot_end")
        .gte("slot_start", dayStart)
        .lte("slot_start", dayEnd)
        .in("payment_status", ["paid", "pending"]),
      supabaseAdmin
        .from("blocked_slots")
        .select("date, slot_start, slot_end")
        .eq("date", date),
    ]);

    // Check if full day is blocked
    const fullDayBlocked = blockedResult.data?.some(
      (b) => b.slot_start === null || b.slot_start === undefined
    ) ?? false;

    const allBusy = [
      ...busy,
      ...(dbBookingsResult.data?.map((b) => ({ start: b.slot_start, end: b.slot_end })) ?? []),
    ];

    const slots = SLOTS.map((slot) => {
      const slotStart = new Date(toISO(date, slot.startTime));
      const slotEnd   = new Date(toISO(date, slot.endTime));

      // Check against blocked slots (specific slot blocks)
      const specificBlocked = blockedResult.data?.some((b) => {
        if (!b.slot_start) return false;
        const bs = new Date(`${date}T${b.slot_start}+05:30`);
        const be = new Date(`${date}T${b.slot_end}+05:30`);
        return slotsOverlap(slotStart, slotEnd, bs, be);
      }) ?? false;

      const isBooked = fullDayBlocked || specificBlocked || allBusy.some((b) =>
        slotsOverlap(slotStart, slotEnd, new Date(b.start), new Date(b.end))
      );

      return {
        label:     slot.label,
        startISO:  slotStart.toISOString(),
        endISO:    slotEnd.toISOString(),
        available: !isBooked,
      };
    });

    return NextResponse.json({ date, slots });
  } catch (err) {
    console.error("Slots error:", err);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
