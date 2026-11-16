import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getSchedule, saveSchedule, validateSchedule, type Schedule } from "@/lib/schedule";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    return NextResponse.json(await getSchedule());
  } catch {
    return NextResponse.json({ error: "Failed to load schedule" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Partial<Schedule>;
  const err = validateSchedule(body);
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  try {
    await saveSchedule(body as Schedule);
    return NextResponse.json(await getSchedule());
  } catch {
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}
