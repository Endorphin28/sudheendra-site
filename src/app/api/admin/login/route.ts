import { NextRequest, NextResponse } from "next/server";
import { checkPassword, endSession, startSession } from "@/lib/admin-auth";

// Simple in-memory throttle against password guessing (per server instance).
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const entry = attempts.get(ip);
  if (entry && entry.count >= MAX_ATTEMPTS && entry.until > Date.now()) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const { password } = await req.json().catch(() => ({}));
  if (!checkPassword(password)) {
    const count = entry && entry.until > Date.now() ? entry.count + 1 : 1;
    attempts.set(ip, { count, until: Date.now() + LOCK_MS });
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  attempts.delete(ip);
  await startSession();
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  await endSession();
  return NextResponse.json({ success: true });
}
