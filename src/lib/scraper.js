// Paid scraping/proxy fallback for product previews (server only).
//
// Stores like Amazon block requests from cloud hosts (Vercel/AWS). When our
// direct fetch is blocked, the preview API asks one of these services to fetch
// the page through residential proxies and return the HTML, which the normal
// parser then reads. Only links that already passed checkStoreLink are sent.
//
// Env (set on Vercel and in .env):
//   SCRAPER_PROVIDER      "scraperapi" | "scrapingbee" | "zenrows"
//   SCRAPER_API_KEY       the provider's API key
//   SCRAPER_PREMIUM       "true" to use premium/residential proxies (more
//                         reliable for Amazon, costs more credits). Default false.
//   SCRAPER_JS_STORES     comma list of store ids to render with JavaScript
//                         (slower, costs more). Default "shein,temu,aliexpress,bestbuy".
//   SCRAPER_DAILY_LIMIT   max paid lookups per server instance per day. Default 300.
// Without SCRAPER_PROVIDER + SCRAPER_API_KEY the fallback is simply off.

const TIMEOUT_MS = 45000;

let day = "";
let usedToday = 0;

export function scraperEnabled() {
  return Boolean(process.env.SCRAPER_PROVIDER && process.env.SCRAPER_API_KEY);
}

function jsStores() {
  return new Set(
    (process.env.SCRAPER_JS_STORES ?? "shein,temu,aliexpress,bestbuy")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

// Best-effort spending guard (per server instance). Also set a usage alert
// or cap in the provider's dashboard.
function takeBudget() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    usedToday = 0;
  }
  const limit = Number(process.env.SCRAPER_DAILY_LIMIT) || 300;
  if (usedToday >= limit) return false;
  usedToday += 1;
  return true;
}

function providerUrl(target, storeId) {
  const key = process.env.SCRAPER_API_KEY;
  const premium = process.env.SCRAPER_PREMIUM === "true";
  const render = jsStores().has(storeId);
  const q = new URLSearchParams();

  switch ((process.env.SCRAPER_PROVIDER || "").toLowerCase()) {
    case "scraperapi":
      q.set("api_key", key);
      q.set("url", target);
      if (render) q.set("render", "true");
      if (premium) q.set("premium", "true");
      return `https://api.scraperapi.com/?${q}`;
    case "scrapingbee":
      q.set("api_key", key);
      q.set("url", target);
      q.set("render_js", render ? "true" : "false");
      if (premium) q.set("premium_proxy", "true");
      return `https://app.scrapingbee.com/api/v1/?${q}`;
    case "zenrows":
      q.set("apikey", key);
      q.set("url", target);
      if (render) q.set("js_render", "true");
      if (premium) q.set("premium_proxy", "true");
      return `https://api.zenrows.com/v1/?${q}`;
    default:
      return null;
  }
}

/**
 * Fetches a store page's HTML through the configured provider.
 * Returns the HTML string, or null (not configured, over budget, or failed).
 */
export async function fetchViaScraper(target, storeId) {
  if (!scraperEnabled()) return null;
  const endpoint = providerUrl(target, storeId);
  if (!endpoint) {
    console.error("Unknown SCRAPER_PROVIDER:", process.env.SCRAPER_PROVIDER);
    return null;
  }
  if (!takeBudget()) {
    console.warn("Scraper daily limit reached");
    return null;
  }
  try {
    const res = await fetch(endpoint, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      // Never log the endpoint: it contains the API key.
      console.error("Scraper request failed:", res.status);
      return null;
    }
    const text = await res.text();
    return text.slice(0, 4 * 1024 * 1024);
  } catch (err) {
    console.error("Scraper error:", err?.name || err);
    return null;
  }
}
