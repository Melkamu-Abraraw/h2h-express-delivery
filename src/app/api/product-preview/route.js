import { checkStoreLink, getStore } from "@/lib/stores";
import { fetchViaScraper, scraperEnabled } from "@/lib/scraper";

// Paid fallback fetches can take 5–20s (longer with JavaScript rendering).
export const maxDuration = 60;

const MAX_REDIRECTS = 3;
const MAX_BYTES = 3 * 1024 * 1024;
const TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 60 * 60 * 1000; // successful previews
const FAIL_TTL_MS = 5 * 60 * 1000; // failures (often temporary blocks)
const RATE_LIMIT = 40; // requests per IP per window (variant switches count)
const RATE_WINDOW_MS = 60 * 1000;

// Best-effort, per-instance memory. Resets on redeploy, which is fine.
const cache = new Map();
const hits = new Map();

// Direct fetches identify honestly as a link-preview client. If a store blocks
// them, the optional paid fallback in lib/scraper.js (chosen by the site owner)
// fetches the page instead. Without it, blocked stores just return "unavailable".
const HEADERS = {
  "User-Agent": "H2HExpressLinkPreview/1.0 (+https://handtohandexpress.com)",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-CA,en;q=0.9",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
};

function decode(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z0-9#]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

function absolute(src, base) {
  if (!src) return null;
  try {
    const u = new URL(decode(src), base);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

async function readLimited(res) {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks = [];
  let total = 0;
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  reader.cancel().catch(() => {});
  return new TextDecoder().decode(Buffer.concat(chunks));
}

// Follows up to MAX_REDIRECTS redirects. Every hop must pass checkStoreLink
// (approved store, https, no IPs/ports/credentials). Returns the last URL
// reached on an approved store and the HTML when the final page is HTML.
async function fetchStorePage(startUrl) {
  let url = startUrl;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const hop = checkStoreLink(url);
    if (!hop.ok) return { url: null, html: null }; // left the approved stores
    url = hop.url;
    const res = await fetch(url, {
      headers: HEADERS,
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return { url, html: null };
      url = new URL(location, url).href;
      continue;
    }
    if (!res.ok) return { url, html: null };
    const type = res.headers.get("content-type") || "";
    if (!type.includes("text/html")) return { url, html: null };
    return { url, html: await readLimited(res) };
  }
  return { url: null, html: null };
}

// ─── parsing ──────────────────────────────────────────────────────────────────

function findProduct(node) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const n of node) {
      const p = findProduct(n);
      if (p) return p;
    }
    return null;
  }
  const type = node["@type"];
  const types = Array.isArray(type) ? type : [type];
  if (types.some((t) => /^(Product|ProductGroup)$/i.test(String(t)))) {
    return node;
  }
  if (node["@graph"]) return findProduct(node["@graph"]);
  return null;
}

function fromJsonLd(html) {
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    let data;
    try {
      data = JSON.parse(m[1].trim());
    } catch {
      continue;
    }
    const p = findProduct(data);
    if (!p) continue;

    let image = p.image;
    if (Array.isArray(image)) image = image[0];
    if (image && typeof image === "object") image = image.url || image.contentUrl;

    let offers = p.offers || p.hasVariant?.[0]?.offers;
    if (Array.isArray(offers)) offers = offers[0];
    const price = offers?.price ?? offers?.lowPrice ?? offers?.priceSpecification?.price;
    const currency =
      offers?.priceCurrency ?? offers?.priceSpecification?.priceCurrency;

    return {
      title: p.name,
      image,
      price,
      currency,
      ...jsonLdVariants(p),
    };
  }
  return {};
}

// Variants from a schema.org ProductGroup / hasVariant list (Walmart, eBay, …).
function jsonLdVariants(p) {
  const list = Array.isArray(p.hasVariant) ? p.hasVariant : [];
  if (list.length < 2) return {};
  const keys = ["color", "size"];
  const variants = list.slice(0, 200).map((v) => {
    let image = Array.isArray(v.image) ? v.image[0] : v.image;
    if (image && typeof image === "object") image = image.url;
    const offer = Array.isArray(v.offers) ? v.offers[0] : v.offers;
    return {
      id: String(v.sku || v.productID || v.url || ""),
      url: v.url || offer?.url || null,
      image: image || null,
      values: Object.fromEntries(
        keys.filter((k) => v[k]).map((k) => [k, decode(v[k])]),
      ),
    };
  });
  const options = keys
    .map((key) => ({
      key,
      values: [...new Set(variants.map((v) => v.values[key]).filter(Boolean))],
      selected: null,
    }))
    .filter((o) => o.values.length > 1);
  return options.length ? { options, variants } : {};
}

function meta(html, key) {
  const k = key.replace(/[:]/g, "\\:");
  const a = new RegExp(
    `<meta[^>]+(?:property|name|itemprop)=["']${k}["'][^>]*content=["']([^"']*)["']`,
    "i",
  ).exec(html);
  if (a) return a[1];
  const b = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name|itemprop)=["']${k}["']`,
    "i",
  ).exec(html);
  return b ? b[1] : null;
}

function fromMeta(html) {
  return {
    title: meta(html, "og:title") || meta(html, "twitter:title"),
    image: meta(html, "og:image") || meta(html, "twitter:image"),
    price:
      meta(html, "product:price:amount") ||
      meta(html, "og:price:amount") ||
      meta(html, "price"),
    currency:
      meta(html, "product:price:currency") ||
      meta(html, "og:price:currency") ||
      meta(html, "priceCurrency"),
  };
}

function fromAmazon(html) {
  const title = /<span[^>]+id=["']productTitle["'][^>]*>([\s\S]*?)<\/span>/i.exec(
    html,
  )?.[1];
  const img =
    /<img[^>]+id=["']landingImage["'][^>]*>/i.exec(html)?.[0] ||
    /<img[^>]+id=["']imgBlkFront["'][^>]*>/i.exec(html)?.[0] ||
    "";
  const image =
    /data-old-hires=["']([^"']+)["']/i.exec(img)?.[1] ||
    /\ssrc=["'](https:[^"']+)["']/i.exec(img)?.[1];
  const priceText = /<span[^>]+class=["'][^"']*a-offscreen[^"']*["'][^>]*>([^<]+)<\/span>/i.exec(
    html,
  )?.[1];
  let price;
  let currency;
  // Prefer the separate whole/fraction parts: some Amazon pages drop the
  // decimal point from the hidden price text (e.g. "$4499" for $44.99).
  const parts =
    /a-price-whole["'][^>]*>([\d.,\s]+)[\s\S]{0,120}?a-price-fraction["'][^>]*>(\d{2})/i.exec(
      html,
    );
  if (parts) {
    price = `${parts[1].replace(/[^\d]/g, "")}.${parts[2]}`;
  }
  if (priceText) {
    const t = decode(priceText);
    price ??= t.replace(/[^\d.,]/g, "").replace(/,(?=\d{3}\b)/g, "");
    if (/CDN|CA\$|C\$/i.test(t)) currency = "CAD";
    else if (/US\$|USD/i.test(t)) currency = "USD";
  }
  return { title, image, price, currency };
}

// Parse the JSON value that starts at `start` (object, array or string),
// tracking strings so braces inside them are ignored.
function jsonAt(html, start) {
  const open = html[start];
  if (open === '"') {
    const m = /^"(?:[^"\\]|\\.)*"/.exec(html.slice(start, start + 2000));
    return m ? JSON.parse(m[0]) : undefined;
  }
  if (open !== "{" && open !== "[") return undefined;
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inStr = false;
  const limit = Math.min(html.length, start + 500000);
  for (let i = start; i < limit; i++) {
    const c = html[i];
    if (inStr) {
      if (c === "\\") i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) {
      return JSON.parse(html.slice(start, i + 1));
    }
  }
  return undefined;
}

// First occurrence of "key": <valid JSON> in the page.
function findJson(html, key) {
  const re = new RegExp(`"${key}"\\s*:\\s*`, "g");
  let m;
  while ((m = re.exec(html))) {
    try {
      const v = jsonAt(html, m.index + m[0].length);
      if (v !== undefined) return v;
    } catch {
      // not JSON here (e.g. inside JS); try the next occurrence
    }
  }
  return undefined;
}

function largeImages(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((x) => x?.hiRes || x?.large || x?.mainUrl)
    .filter((u) => typeof u === "string" && u.startsWith("https://"));
}

function fromAmazonVariants(html, url) {
  const out = {};

  // Gallery for the current variant: 'colorImages': { 'initial': A.$.parseJSON('[...]')
  const g = /'colorImages'\s*:\s*\{\s*'initial'\s*:\s*[^']*'(\[[\s\S]*?\])'\s*\)/.exec(html);
  if (g) {
    try {
      out.images = largeImages(JSON.parse(g[1])).slice(0, 7);
    } catch {
      // ignore
    }
  }

  const dims = findJson(html, "dimensions");
  const display = findJson(html, "dimensionValuesDisplayData");
  if (!Array.isArray(dims) || !dims.length || !display || typeof display !== "object") {
    return out;
  }
  const values = findJson(html, "variationValues") || {};
  const current = findJson(html, "currentAsin");
  const colorImages = findJson(html, "colorImages") || {};
  const origin = new URL(url).origin;

  out.variants = Object.entries(display)
    .slice(0, 200)
    .filter(([asin, vals]) => /^[A-Z0-9]{10}$/.test(asin) && Array.isArray(vals))
    .map(([asin, vals]) => ({
      id: asin,
      url: `${origin}/dp/${asin}`,
      image: largeImages(colorImages[vals.join(" ")])[0] || null,
      values: Object.fromEntries(dims.map((k, i) => [k, decode(vals[i])])),
    }));

  const currentVals = typeof current === "string" ? display[current] : null;
  out.options = dims
    .map((key, i) => ({
      key,
      values: (Array.isArray(values[key])
        ? values[key]
        : [...new Set(out.variants.map((v) => v.values[key]))]
      ).map(decode),
      selected: currentVals ? decode(currentVals[i]) : null,
    }))
    .filter((o) => o.values.length > 0);
  return out;
}

const BLOCK_TITLE =
  /robot check|verify your identity|access denied|are you a human|captcha|pardon our interruption|security check/i;

function isBlocked(html, url) {
  if (/\/(blocked|captcha|challenge)\b/i.test(new URL(url).pathname)) return true;
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || "";
  return BLOCK_TITLE.test(title) || /api-services-support@amazon\.com/i.test(html);
}

function currencyFor(url) {
  const host = new URL(url).hostname;
  if (/\.ca$/i.test(host)) return "CAD";
  if (/\.com$/i.test(host)) return "USD";
  return null;
}

function parse(html, url, store) {
  if (isBlocked(html, url)) return null;

  const sources = [fromJsonLd(html), fromMeta(html)];
  if (store.id === "amazon") {
    sources.unshift(fromAmazonVariants(html, url));
    sources.push(fromAmazon(html));
  }
  const pick = (key) => sources.map((s) => s[key]).find((v) => v != null && v !== "");

  let title = decode(pick("title") || /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]);
  title = title.replace(/\s*[|:-]\s*(Amazon\.c\w+|Walmart\.c\w+|eBay|SHEIN.*)$/i, "");
  if (!title || title.length < 3) return null;
  if (title.length > 200) title = `${title.slice(0, 197)}…`;

  const rawPrice = pick("price");
  const priceNum = rawPrice != null ? Number(String(rawPrice).replace(/[^\d.]/g, "")) : NaN;

  const image = absolute(pick("image"), url);
  const price = Number.isFinite(priceNum) && priceNum > 0 ? priceNum : null;
  // A real product page has at least an image or a price; skip home/category pages.
  if (!image && price == null) return null;

  const currency = pick("currency")
    ? decode(pick("currency")).toUpperCase().slice(0, 3)
    : price != null
      ? currencyFor(url)
      : null;

  const images = [...new Set([image, ...(pick("images") || [])].filter(Boolean))]
    .map((u) => absolute(u, url))
    .filter(Boolean)
    .slice(0, 7);

  // Only keep variant links that stay on an allowed store.
  const variants = (pick("variants") || [])
    .map((v) => ({ ...v, url: v.url ? absolute(v.url, url) : null, image: absolute(v.image, url) }))
    .map((v) => ({ ...v, url: v.url && getStore(v.url) ? v.url : null }));

  return {
    title,
    image: images[0] || null,
    images,
    price,
    currency,
    store: store.name,
    url,
    options: pick("options") || [],
    variants,
  };
}

// ─── handler ──────────────────────────────────────────────────────────────────

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  // Only approved stores, https, no IPs/ports/credentials (see lib/stores.js).
  const check = checkStoreLink(body?.url);
  if (!check.ok) {
    return Response.json({ ok: false, reason: check.reason }, { status: 400 });
  }
  const input = check.url;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  const cached = cache.get(input);
  if (cached && Date.now() - cached.at < (cached.data.ok ? CACHE_TTL_MS : FAIL_TTL_MS)) {
    return Response.json(cached.data);
  }

  let data;
  try {
    const page = await fetchStorePage(input);
    // Where the link really leads (used to expand short links like amzn.to).
    const final = page.url ? checkStoreLink(page.url) : null;
    // A store homepage or block/captcha page is not a product page.
    const finalPath = final?.ok ? new URL(final.url).pathname : "/";
    const isProductPage =
      finalPath !== "/" && !/\/(blocked|captcha|challenge)\b/i.test(finalPath);
    const resolvedUrl = final?.ok && !final.short && isProductPage ? final.url : null;

    if (check.short && !resolvedUrl) {
      data = { ok: false, reason: "short" };
    } else {
      const store = final?.store || check.store;
      let product =
        page.html && isProductPage ? parse(page.html, page.url, store) : null;

      // Blocked or unreadable directly (e.g. Amazon from Vercel): try the paid
      // service. Use the product page we reached, or — if we were bounced to
      // a block page — the customer's own (already checked) full link.
      if (!product && scraperEnabled()) {
        const target = isProductPage && final?.ok ? final.url : check.short ? null : input;
        if (target) {
          const html = await fetchViaScraper(target, store.id);
          if (html) product = parse(html, target, store);
        }
      }

      data = product
        ? { ok: true, product, resolvedUrl }
        : { ok: false, reason: "unavailable", resolvedUrl };
    }
  } catch (err) {
    console.error("Product preview error:", err?.message || err);
    data = { ok: false, reason: "unavailable" };
  }

  cache.set(input, { at: Date.now(), data });
  if (cache.size > 1000) cache.delete(cache.keys().next().value);

  return Response.json(data);
}
