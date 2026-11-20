// Bot check for the Buy for Me form, run before the WhatsApp/Telegram chat opens.
//  - honeypot: a hidden field real visitors never fill
//  - time trap: real visitors take more than a few seconds to fill the form
//  - reCAPTCHA v2 ("I'm not a robot"), verified with Google
//
// Env:
//   RECAPTCHA_SECRET_KEY  secret key from google.com/recaptcha/admin (v2 Checkbox).
//   When it isn't set (e.g. local development) the reCAPTCHA step is skipped.

const MIN_FILL_MS = 3000;
const RATE_LIMIT = 15; // checks per IP per minute
const RATE_WINDOW_MS = 60 * 1000;

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
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "";
  if (rateLimited(ip || "local")) {
    return Response.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  // Honeypot filled or form submitted impossibly fast -> treat as a bot.
  if (String(body?.hp ?? "").trim() !== "") {
    return Response.json({ ok: false, reason: "bot" }, { status: 400 });
  }
  if (!(Number(body?.elapsed) >= MIN_FILL_MS)) {
    return Response.json({ ok: false, reason: "too_fast" }, { status: 400 });
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return Response.json({ ok: true, captcha: "not_configured" });
  }

  const token = String(body?.token ?? "");
  if (!token || token.length > 4000) {
    return Response.json({ ok: false, reason: "captcha" }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (ip) params.set("remoteip", ip);
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const data = await res.json();
    if (!data.success) {
      return Response.json({ ok: false, reason: "captcha" }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("reCAPTCHA verify error:", err?.message || err);
    return Response.json({ ok: false, reason: "verify_failed" }, { status: 502 });
  }
}
