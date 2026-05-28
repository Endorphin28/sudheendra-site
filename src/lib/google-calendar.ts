import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/google/callback"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;

/**
 * Returns booked time ranges for a given date (ISO date string: "2024-12-16")
 */
export async function getBusySlots(dateStr: string): Promise<{ start: string; end: string }[]> {
  const dayStart = new Date(`${dateStr}T00:00:00+05:30`).toISOString();
  const dayEnd   = new Date(`${dateStr}T23:59:59+05:30`).toISOString();

  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart,
      timeMax: dayEnd,
      timeZone: "Asia/Kolkata",
      items: [{ id: CALENDAR_ID }],
    },
  });

  const busy = data.calendars?.[CALENDAR_ID]?.busy ?? [];
  return busy
    .filter((b) => b.start != null && b.end != null)
    .map((b) => ({ start: b.start as string, end: b.end as string }));
}

/**
 * Creates a Google Calendar event with Google Meet link.
 * Returns { eventId, meetLink }
 */
export async function createCalendarEvent(params: {
  summary: string;
  description: string;
  startISO: string;   // UTC ISO string
  endISO: string;     // UTC ISO string
  patientEmail: string;
  doctorEmail: string;
}): Promise<{ eventId: string; meetLink: string }> {
  const { summary, description, startISO, endISO, patientEmail, doctorEmail } = params;

  const { data: event } = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary,
      description,
      start: { dateTime: startISO, timeZone: "Asia/Kolkata" },
      end:   { dateTime: endISO,   timeZone: "Asia/Kolkata" },
      attendees: [
        { email: patientEmail },
        { email: doctorEmail, organizer: true },
      ],
      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email",  minutes: 60 },
          { method: "popup",  minutes: 15 },
        ],
      },
    },
  });

  const meetLink = event.conferenceData?.entryPoints?.find(
    (ep) => ep.entryPointType === "video"
  )?.uri ?? "";

  return { eventId: event.id!, meetLink };
}
