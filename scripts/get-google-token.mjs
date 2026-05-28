/**
 * One-time script to generate a Google OAuth2 refresh token.
 * Run: node scripts/get-google-token.mjs
 *
 * This starts a temporary HTTP server on port 3000 to capture
 * the OAuth callback. Make sure your Next.js dev server is STOPPED first.
 */

import { createServer } from "http";
import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
    .filter(([k, v]) => k && v)
    .map(([k, ...v]) => [k, v.join("=")])
);

const CLIENT_ID     = env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI  = "http://localhost:3000/api/auth/google/callback";

if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID.includes("PASTE")) {
  console.error("❌ GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set in .env.local");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
});

console.log("\n✅ Temporary server starting on http://localhost:3000");
console.log("\n👉 Open this URL in your browser (logged in as consultdrhuddar@gmail.com):\n");
console.log(authUrl);
console.log("\nWaiting for Google to redirect back...\n");

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:3000");
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400);
    res.end("No code found in URL.");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html><body style="font-family:sans-serif;padding:40px;max-width:600px">
        <h2>✅ Success! Refresh token generated.</h2>
        <p>Copy the token below and paste it into <code>.env.local</code> as <code>GOOGLE_REFRESH_TOKEN</code></p>
        <textarea rows="4" style="width:100%;padding:8px;font-family:monospace">${tokens.refresh_token}</textarea>
        <p style="margin-top:20px;color:#666">You can close this tab and stop the terminal process (Ctrl+C).</p>
      </body></html>
    `);

    console.log("\n✅ SUCCESS! Your refresh token:\n");
    console.log(tokens.refresh_token);
    console.log("\n📋 Paste this into .env.local as GOOGLE_REFRESH_TOKEN=<token>");
    console.log("\nPress Ctrl+C to stop the server.\n");

  } catch (err) {
    res.writeHead(500);
    res.end(`Error: ${err.message}`);
    console.error("❌ Error exchanging code:", err.message);
  }
});

server.listen(3000, () => {
  console.log("Server ready. Waiting for OAuth callback...");
});
