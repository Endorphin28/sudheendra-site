import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const SESSION_HOURS = 12;

function secret() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD not configured");
  // Changing ADMIN_PASSWORD signs everyone out.
  return createHmac("sha256", "doctorhuddar-admin").update(pw).digest();
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(password: unknown) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || typeof password !== "string") return false;
  // Compare hashes so length differences don't leak through timing.
  const h = (s: string) => createHmac("sha256", "cmp").update(s).digest("hex");
  return safeEqual(h(password), h(pw));
}

export async function startSession() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const token = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_HOURS * 60 * 60,
    path: "/",
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthenticated() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, sign(expires));
}
