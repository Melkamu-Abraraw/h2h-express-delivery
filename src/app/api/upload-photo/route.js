// Uploads a customer's item photo (Buy for Me, manual entry) to Google Drive
// through the Apps Script web app in scripts/google-drive-upload.gs, and
// returns the Drive view link for the WhatsApp/Telegram message.
//
// Env:
//   DRIVE_UPLOAD_URL     the Apps Script "Web app URL" (…/exec)
//   DRIVE_UPLOAD_SECRET  same value as SECRET in the Apps Script

const MAX_BYTES = 3 * 1024 * 1024;
const TIMEOUT_MS = 20000;
const RATE_LIMIT = 10; // uploads per IP per minute
const RATE_WINDOW_MS = 60 * 1000;
const IMAGE_RE = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/;

const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

export async function POST(req) {
  const endpoint = process.env.DRIVE_UPLOAD_URL;
  const secret = process.env.DRIVE_UPLOAD_SECRET;
  if (!endpoint || !secret) {
    return Response.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const image = String(body?.image ?? "");
  const m = IMAGE_RE.exec(image);
  if (!m || Buffer.from(m[2], "base64").length > MAX_BYTES) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  try {
    // Apps Script answers with a redirect to the result; fetch follows it.
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, image }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const data = await res.json();
    const url = String(data?.url || "");
    if (!data?.ok || !/^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view$/.test(url)) {
      console.error("Drive upload failed:", data?.error || res.status);
      return Response.json({ ok: false, reason: "upload_failed" }, { status: 502 });
    }
    return Response.json({ ok: true, url });
  } catch (err) {
    console.error("Drive upload error:", err?.message || err);
    return Response.json({ ok: false, reason: "upload_failed" }, { status: 502 });
  }
}
