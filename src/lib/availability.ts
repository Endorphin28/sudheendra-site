import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { getBusySlots } from "@/lib/google-calendar";
import { supabaseAdmin } from "@/lib/supabase";
import { CONSULT_TYPES, type ConsultTypeKey } from "@/lib/consultations";

const TZ = "Asia/Kolkata";
const ALLOWED_DAYS = [1, 3, 5]; // Mon, Wed, Fri
const WINDOW_START = "14:30"; // online consultation window, IST
const WINDOW_END = "15:45";
const STEP_MINUTES = 15;   // candidate start times every 15 min
const BUFFER_MINUTES = 15; // gap kept between consecutive appointments
const MIN_NOTICE_MINUTES = 60;
const PENDING_HOLD_MINUTES = 30; // unpaid bookings hold their slot this long

export type Slot = {
  label: string;
  startISO: string;
  endISO: string;
};

const MINUTE = 60 * 1000;

function istTime(date: string, time: string) {
  return new Date(`${date}T${time.length === 5 ? `${time}:00` : time}+05:30`);
}

function overlaps(s1: Date, e1: Date, s2: Date, e2: Date) {
  return s1 < e2 && e1 > s2;
}

function timeLabel(d: Date) {
  return format(toZonedTime(d, TZ), "h:mm a");
}

export function istDateOf(iso: string) {
  return format(toZonedTime(new Date(iso), TZ), "yyyy-MM-dd");
}

export function isBookableDay(date: string) {
  return ALLOWED_DAYS.includes(istTime(date, "12:00").getDay());
}

/** Free start times on `date` (yyyy-MM-dd, IST) for the given consultation type. */
export async function getAvailableSlots(date: string, type: ConsultTypeKey): Promise<Slot[]> {
  if (!isBookableDay(date)) return [];

  const minutes = CONSULT_TYPES[type].minutes;
  const dayStart = istTime(date, "00:00").toISOString();
  const dayEnd = istTime(date, "23:59:59").toISOString();
  const pendingCutoff = new Date(Date.now() - PENDING_HOLD_MINUTES * MINUTE).toISOString();

  const [calendarBusy, bookings, blocked] = await Promise.all([
    getBusySlots(date),
    supabaseAdmin
      .from("bookings")
      .select("slot_start, slot_end")
      .gte("slot_start", dayStart)
      .lte("slot_start", dayEnd)
      .or(`payment_status.eq.paid,and(payment_status.eq.pending,created_at.gt.${pendingCutoff})`),
    supabaseAdmin
      .from("blocked_slots")
      .select("slot_start, slot_end")
      .eq("date", date),
  ]);
  if (bookings.error) throw bookings.error;
  if (blocked.error) throw blocked.error;

  if (blocked.data.some((b) => !b.slot_start)) return []; // full day blocked

  const blockedRanges = blocked.data.map((b) => ({
    start: istTime(date, b.slot_start),
    end: istTime(date, b.slot_end),
  }));
  const busyRanges = [
    ...calendarBusy,
    ...bookings.data.map((b) => ({ start: b.slot_start, end: b.slot_end })),
  ].map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));

  const windowEnd = istTime(date, WINDOW_END);
  const earliest = new Date(Date.now() + MIN_NOTICE_MINUTES * MINUTE);
  const slots: Slot[] = [];

  for (
    let start = istTime(date, WINDOW_START);
    start.getTime() + minutes * MINUTE <= windowEnd.getTime();
    start = new Date(start.getTime() + STEP_MINUTES * MINUTE)
  ) {
    const end = new Date(start.getTime() + minutes * MINUTE);
    if (start < earliest) continue;

    // Keep a buffer either side of existing appointments and calendar events
    const paddedStart = new Date(start.getTime() - BUFFER_MINUTES * MINUTE);
    const paddedEnd = new Date(end.getTime() + BUFFER_MINUTES * MINUTE);
    const clash =
      busyRanges.some((b) => overlaps(paddedStart, paddedEnd, b.start, b.end)) ||
      blockedRanges.some((b) => overlaps(start, end, b.start, b.end));
    if (clash) continue;

    slots.push({
      label: `${timeLabel(start)} – ${timeLabel(end)}`,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
    });
  }

  return slots;
}
