// Approved stores for Buy for Me. Shared by the form (what customers may
// submit, when to request a preview) and the preview API (what the server may
// fetch, including every redirect hop).
//
// Matching is exact domain or subdomain (host === domain or *.domain), so
// lookalikes such as "amaz0n.ca" or "amazon.ca.evil.com" never match.
// `short: true` marks share/short-link domains: they are only accepted after
// the server resolves them to a full store link.
export const STORE_DOMAINS = [
  { domain: "amazon.ca", id: "amazon", name: "Amazon" },
  { domain: "amazon.com", id: "amazon", name: "Amazon" },
  { domain: "amzn.to", id: "amazon", name: "Amazon", short: true },
  { domain: "a.co", id: "amazon", name: "Amazon", short: true },
  { domain: "shein.com", id: "shein", name: "SHEIN" },
  { domain: "walmart.ca", id: "walmart", name: "Walmart" },
  { domain: "walmart.com", id: "walmart", name: "Walmart" },
  { domain: "ebay.ca", id: "ebay", name: "eBay" },
  { domain: "ebay.com", id: "ebay", name: "eBay" },
  { domain: "ebay.us", id: "ebay", name: "eBay", short: true },
  { domain: "temu.com", id: "temu", name: "Temu" },
  { domain: "temu.to", id: "temu", name: "Temu", short: true },
  // Listed before aliexpress.com so these share hosts are marked as short.
  { domain: "a.aliexpress.com", id: "aliexpress", name: "AliExpress", short: true },
  { domain: "s.click.aliexpress.com", id: "aliexpress", name: "AliExpress", short: true },
  { domain: "aliexpress.com", id: "aliexpress", name: "AliExpress" },
  { domain: "aliexpress.us", id: "aliexpress", name: "AliExpress" },
  { domain: "costco.ca", id: "costco", name: "Costco" },
  { domain: "costco.com", id: "costco", name: "Costco" },
  { domain: "bestbuy.ca", id: "bestbuy", name: "Best Buy" },
  { domain: "bestbuy.com", id: "bestbuy", name: "Best Buy" },
  { domain: "etsy.com", id: "etsy", name: "Etsy" },
  { domain: "etsy.me", id: "etsy", name: "Etsy", short: true },
  { domain: "nike.com", id: "nike", name: "Nike" },
];

/** Store names for messages, e.g. "Amazon, SHEIN, Walmart, …". */
export const STORE_NAMES = [...new Set(STORE_DOMAINS.map((s) => s.name))];

const MAX_URL_LENGTH = 2048;
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

function findStore(host) {
  return STORE_DOMAINS.find(
    ({ domain }) => host === domain || host.endsWith(`.${domain}`),
  );
}

/**
 * Checks a product link and normalizes it.
 * Returns { ok: true, url, store: { id, name }, short } or
 *         { ok: false, reason: "invalid" | "unsafe" | "store" }.
 * - only http/https (http is upgraded to https)
 * - no user:pass@, no explicit port, no IP-address hosts, max 2048 chars
 * - host must be an approved store (exact domain or subdomain)
 * - the #fragment is removed
 */
export function checkStoreLink(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw.length > MAX_URL_LENGTH) return { ok: false, reason: "invalid" };

  let url;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "invalid" };
  }

  const host = url.hostname.toLowerCase();
  if (url.username || url.password || url.port) return { ok: false, reason: "unsafe" };
  if (IPV4.test(host) || host.startsWith("[")) return { ok: false, reason: "unsafe" };

  const match = findStore(host);
  if (!match) return { ok: false, reason: "store" };

  url.protocol = "https:";
  url.hash = "";
  return {
    ok: true,
    url: url.href,
    store: { id: match.id, name: match.name },
    short: Boolean(match.short),
  };
}

/** Returns { id, name } for an approved store URL, otherwise null. */
export function getStore(value) {
  const res = checkStoreLink(value);
  return res.ok ? res.store : null;
}

// Query parameters that only track where a click came from. Dropped by
// shortStoreUrl for stores without a known short product address.
const TRACKING_PARAMS =
  /^(utm_.*|ref|ref_|refRID|tag|linkCode|linkId|psc|th|crid|keywords|qid|sprefix|sr|content-id|pd_rd_.*|pf_rd_.*|fbclid|gclid|msclkid|mkevt|mkcid|mkrid|campid|toolid|customid|spm|scm|algo_.*|aff_.*|sk|_randl_.*|share_.*|social_.*|from|source|src|sid|athena.*|clickid|irclickid|irgwc|cid|ici|icid|_branch_.*)$/i;

/**
 * Shortens an approved store link to that store's own product address,
 * removing tracking. Always stays on the real store domain (no third-party
 * shortener). Falls back to the link minus tracking parameters.
 *   amazon.ca/Some-Name/dp/B09B8V1LZ3/ref=…?…  ->  amazon.ca/dp/B09B8V1LZ3
 */
export function shortStoreUrl(value) {
  const check = checkStoreLink(value);
  if (!check.ok) return String(value ?? "").trim();
  const url = new URL(check.url);
  const host = url.hostname.replace(/^(www|m)\./, "");
  const path = url.pathname;
  const origin = `https://${url.hostname}`;
  let m;

  switch (check.store.id) {
    case "amazon":
      if ((m = /\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i.exec(path))) {
        return `${origin}/dp/${m[1].toUpperCase()}`;
      }
      break;
    case "ebay":
      if ((m = /\/itm\/(?:[^/]+\/)?(\d{9,})/.exec(path))) {
        const variant = url.searchParams.get("var");
        return `${origin}/itm/${m[1]}${variant ? `?var=${variant}` : ""}`;
      }
      break;
    case "aliexpress":
      if ((m = /\/item\/(\d+)\.html/.exec(path))) {
        return `https://www.${host}/item/${m[1]}.html`;
      }
      break;
    case "etsy":
      if ((m = /\/listing\/(\d+)/.exec(path))) {
        return `${origin}/listing/${m[1]}`;
      }
      break;
    case "temu": {
      const id = url.searchParams.get("goods_id");
      if (id) return `${origin}/goods.html?goods_id=${id}`;
      break;
    }
    default:
      // SHEIN, Walmart, Costco, Best Buy, Nike: the product ID is in the path.
      return `${origin}${path}`;
  }

  // Unknown layout: keep the page, drop tracking parameters only.
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.test(key)) url.searchParams.delete(key);
  }
  return url.href;
}
