/**
 * Creates an "Appointments" calendar on consultdrhuddar@gmail.com
 * and prints its calendar ID.
 * Run: node scripts/create-appointments-calendar.mjs
 */

import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
    .filter(([k, v]) => k && v)
);

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/google/callback"
);

oauth2Client.setCredentials({ refresh_token: env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

try {
  // Check if "Appointments" calendar already exists
  const { data: list } = await calendar.calendarList.list();
  const existing = list.items.find((c) => c.summary === "Appointments");

  if (existing) {
    console.log("\n✅ Appointments calendar already exists!");
    console.log("Calendar ID:", existing.id);
    console.log("\nPaste this into .env.local as GOOGLE_CALENDAR_ID=", existing.id);
  } else {
    const { data: newCal } = await calendar.calendars.insert({
      requestBody: {
        summary: "Appointments",
        description: "doctorhuddar.com — patient appointment bookings",
        timeZone: "Asia/Kolkata",
      },
    });
    console.log("\n✅ Appointments calendar created!");
    console.log("Calendar ID:", newCal.id);
    console.log("\nPaste this into .env.local as:");
    console.log(`GOOGLE_CALENDAR_ID=${newCal.id}`);
  }
} catch (err) {
  console.error("❌ Error:", err.message);
}
