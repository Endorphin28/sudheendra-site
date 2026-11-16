// Pure schedule helpers, safe to import from client components.

/** Weekly online-consultation schedule. Days use JS numbering (0 = Sun … 6 = Sat). */
export type Schedule = {
  days: number[];
  windowStart: string; // "HH:MM", IST
  windowEnd: string;   // "HH:MM", IST
};

export const DEFAULT_SCHEDULE: Schedule = { days: [1, 3, 5], windowStart: "14:30", windowEnd: "15:45" };

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/** Mon-first order for display. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function isValidTime(time: unknown): time is string {
  return typeof time === "string" && TIME_RE.test(time);
}

/** "14:30" → "2:30 PM" */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** [1,3,5] → "Mon, Wed & Fri" */
export function formatDays(days: number[]) {
  const names = WEEK_ORDER.filter((d) => days.includes(d)).map((d) => WEEKDAYS[d]);
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

/** Every 15 minutes across the day, "00:00" … "23:45". */
export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) =>
  `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`,
);

/** Returns an error message, or null if the schedule is valid. */
export function validateSchedule(s: Partial<Schedule>): string | null {
  if (!Array.isArray(s.days) || s.days.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) {
    return "Days must be a list of weekdays";
  }
  if (!isValidTime(s.windowStart) || !isValidTime(s.windowEnd)) {
    return "Times must be in HH:MM format";
  }
  if (toMinutes(s.windowEnd) - toMinutes(s.windowStart) < 15) {
    return "End time must be at least 15 minutes after start time";
  }
  return null;
}
