import { NextRequest, NextResponse } from "next/server";
import { getBusySlots } from "@/lib/google-calendar";
import { supabaseAdmin } from "@/lib/supabase";

// Slots in IST
const SLOTS = [
  { label: "2:30 PM – 3:00 PM", startTime: "14:30", endTime: "15:00" },
  { label: "3:15 PM – 3:45 PM", startTime: "15:15", endTime: "15:45" },
];

function toISO(dateStr: string, timeStr: string): string {
  // dateStr: "2024-12-16", timeStr: "14:30" — returns UTC ISO
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(`${dateStr}T00:00:00+05:30`);
  d.setHours(d.getHours() + h - (5), d.getMinutes() + m - 30);
  // Simpler: just build the IST string and let JS convert
  return new Date(`${dateStr}T${timeStr}:00+05:30`).toISOString();
}

function slotsOverlap(
  slotStart: Date, slotEnd: Date,
  busyStart: Date, busyEnd: Date
): boolean {
  return slotStart < busyEnd && slotEnd > busyStart;
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  // Validate it's Mon/Wed/Fri
  const day = new Date(`${date}T12:00:00+05:30`).getDay();
  if (![1, 3, 5].includes(day)) {
    return NextResponse.json({ error: "No slots on this day" }, { status: 400 });
  }

  try {
    // Get Google Calendar busy slots
    const busy = await getBusySlots(date);

    // Get already paid/pending bookings from Supabase for this date
    const dayStart = new Date(`${date}T00:00:00+05:30`).toISOString();
    const dayEnd   = new Date(`${date}T23:59:59+05:30`).toISOString();

    const { data: dbBookings } = await supabaseAdmin
      .from("bookings")
      .select("slot_start, slot_end")
      .gte("slot_start", dayStart)
      .lte("slot_start", dayEnd)
      .in("payment_status", ["paid", "pending"]);

    const allBusy = [
      ...busy,
      ...(dbBookings?.map((b) => ({ start: b.slot_start, end: b.slot_end })) ?? []),
    ];

    const slots = SLOTS.map((slot) => {
      const slotStart = new Date(toISO(date, slot.startTime));
      const slotEnd   = new Date(toISO(date, slot.endTime));

      const isBooked = allBusy.some((b) =>
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
