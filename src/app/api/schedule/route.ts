import { NextResponse } from "next/server";
import { getSchedule, DEFAULT_SCHEDULE } from "@/lib/schedule";

export const dynamic = "force-dynamic";

// Public: which weekdays online consultations run, for the booking calendar.
export async function GET() {
  try {
    return NextResponse.json(await getSchedule());
  } catch {
    return NextResponse.json(DEFAULT_SCHEDULE);
  }
}
