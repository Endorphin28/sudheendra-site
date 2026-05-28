import { Resend } from "resend";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const resend = new Resend(process.env.RESEND_API_KEY);
const DOCTOR_EMAIL = "consultdrhuddar@gmail.com";
const FROM_EMAIL = "Sukhibhava Healthcare <appointments@doctorhuddar.com>";
const TZ = "Asia/Kolkata";

function formatIST(isoStr: string) {
  return format(toZonedTime(new Date(isoStr), TZ), "EEEE, d MMMM yyyy 'at' h:mm a 'IST'");
}

export async function sendPatientConfirmation(params: {
  patientName:  string;
  patientEmail: string;
  slotStart:    string;
  slotEnd:      string;
  meetLink:     string;
  bookingId:    string;
}) {
  const { patientName, patientEmail, slotStart, meetLink } = params;
  const slotDisplay = formatIST(slotStart);

  await resend.emails.send({
    from: FROM_EMAIL,
    to:   patientEmail,
    subject: `Your appointment with Dr. Sudheendra Huddar is confirmed`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1917">
        <div style="background:#2d6a4f;padding:32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:24px">Appointment Confirmed ✓</h1>
          <p style="color:#b7e4c7;margin:8px 0 0">Sukhibhava Healthcare · Online Consultation</p>
        </div>
        <div style="padding:32px;background:#fdfcfa;border:1px solid #ede9e1;border-top:none;border-radius:0 0 12px 12px">
          <p style="font-size:16px">Dear <strong>${patientName}</strong>,</p>
          <p>Your online consultation with <strong>Dr. Sudheendra Huddar</strong> has been confirmed.</p>

          <div style="background:#f7f5f0;border-radius:8px;padding:20px;margin:24px 0">
            <p style="margin:0 0 8px"><strong>📅 Date & Time</strong><br>${slotDisplay}</p>
            <p style="margin:8px 0"><strong>⏱ Duration</strong><br>30 minutes</p>
            <p style="margin:8px 0"><strong>💻 Type</strong><br>Online Consultation (Google Meet)</p>
            <p style="margin:8px 0 0"><strong>💰 Amount Paid</strong><br>₹700</p>
          </div>

          <div style="background:#2d6a4f;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
            <p style="color:white;margin:0 0 12px;font-size:14px">Join your consultation on Google Meet</p>
            <a href="${meetLink}"
               style="background:white;color:#2d6a4f;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:600;display:inline-block">
              Join Google Meet →
            </a>
          </div>

          <div style="border-top:1px solid #ede9e1;padding-top:20px;margin-top:20px">
            <p style="font-weight:600;margin-bottom:8px">📋 Please keep ready for your consultation:</p>
            <ul style="color:#6b6a65;padding-left:20px;line-height:1.8">
              <li>A quiet, private space with good internet connection</li>
              <li>Any previous medical records or prescriptions</li>
              <li>A list of current medications (if any)</li>
              <li>Notes on your symptoms or concerns</li>
            </ul>
          </div>

          <div style="border-top:1px solid #ede9e1;padding-top:20px;margin-top:20px;color:#6b6a65;font-size:14px">
            <p>For queries or rescheduling, contact us at:</p>
            <p>📞 80733 98651 / 0836-3509005<br>
               ✉️ consultdrhuddar@gmail.com</p>
            <p style="margin-top:16px;color:#9c9b95">
              Sukhibhava Healthcare · #17, 18, Ramdhoot Apartment Complex,
              Deshpande Nagar, Hubballi – 580029
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendDoctorNotification(params: {
  patientName:  string;
  patientEmail: string;
  patientPhone: string;
  slotStart:    string;
  meetLink:     string;
  bookingId:    string;
}) {
  const { patientName, patientEmail, patientPhone, slotStart, meetLink, bookingId } = params;
  const slotDisplay = formatIST(slotStart);

  await resend.emails.send({
    from: FROM_EMAIL,
    to:   DOCTOR_EMAIL,
    subject: `New booking: ${patientName} — ${slotDisplay}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1917">
        <div style="background:#1b4332;padding:24px;border-radius:12px 12px 0 0">
          <h2 style="color:white;margin:0">New Appointment Booking</h2>
          <p style="color:#b7e4c7;margin:4px 0 0">doctorhuddar.com · Online Consultation</p>
        </div>
        <div style="padding:24px;background:#fdfcfa;border:1px solid #ede9e1;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#6b6a65;width:140px">Patient Name</td><td style="padding:8px 0;font-weight:600">${patientName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b6a65">Phone</td><td style="padding:8px 0;font-weight:600">${patientPhone}</td></tr>
            <tr><td style="padding:8px 0;color:#6b6a65">Email</td><td style="padding:8px 0">${patientEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#6b6a65">Slot</td><td style="padding:8px 0;font-weight:600">${slotDisplay}</td></tr>
            <tr><td style="padding:8px 0;color:#6b6a65">Amount</td><td style="padding:8px 0">₹700 (paid)</td></tr>
            <tr><td style="padding:8px 0;color:#6b6a65">Booking ID</td><td style="padding:8px 0;font-size:12px;color:#9c9b95">${bookingId}</td></tr>
          </table>
          <div style="margin-top:20px">
            <a href="${meetLink}"
               style="background:#2d6a4f;color:white;padding:10px 20px;border-radius:50px;text-decoration:none;font-size:14px">
              Join Google Meet →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}
