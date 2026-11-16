import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export const dynamic = "force-dynamic";
import { isConsultType } from "@/lib/consultations";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const type = req.nextUrl.searchParams.get("type");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }
  if (!isConsultType(type)) {
    return NextResponse.json({ error: "valid type required" }, { status: 400 });
  }
  try {
    const slots = await getAvailableSlots(date, type);
    return NextResponse.json({ date, type, slots });
  } catch (err) {
    console.error("Slots error:", err);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
