import { supabaseAdmin } from "@/lib/supabase";
import { DEFAULT_SCHEDULE, type Schedule } from "@/lib/schedule-shared";

export * from "@/lib/schedule-shared";

/** Weekly schedule, editable from /admin (single row in availability_settings). */
export async function getSchedule(): Promise<Schedule> {
  const { data, error } = await supabaseAdmin
    .from("availability_settings")
    .select("days, window_start, window_end")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_SCHEDULE;
  return { days: data.days, windowStart: data.window_start, windowEnd: data.window_end };
}

export async function saveSchedule(s: Schedule) {
  const days = Array.from(new Set(s.days)).sort((a, b) => a - b);
  const { error } = await supabaseAdmin.from("availability_settings").upsert({
    id: 1,
    days,
    window_start: s.windowStart,
    window_end: s.windowEnd,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
