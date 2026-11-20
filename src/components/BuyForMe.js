"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  House,
  Link2,
  LoaderCircle,
  Minus,
  Package,
  PencilLine,
  Plus,
  RotateCw,
  Receipt,
  X,
} from "lucide-react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { checkStoreLink, shortStoreUrl, STORE_NAMES } from "@/lib/stores";
import Recaptcha from "@/components/Recaptcha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PREVIEW_IDLE = { status: "idle", product: null, switching: false };

function formatPrice(price, currency, locale) {
  if (price == null) return null;
  try {
    return new Intl.NumberFormat(locale === "en" ? "en-CA" : locale, {
      style: "currency",
      currency: currency || "CAD",
      currencyDisplay: "narrowSymbol",
    }).format(price) + (currency ? ` ${currency}` : "");
  } catch {
    return `${price}${currency ? ` ${currency}` : ""}`;
  }
}

const STORES = [
  { name: "Amazon", href: "https://www.amazon.ca", src: "/images/stores/amazon-logo.png", width: 508, height: 159, className: "h-5 translate-y-[3px]" },
  { name: "SHEIN", href: "https://ca.shein.com", src: "/images/stores/shein-logo.png", width: 451, height: 96, className: "h-3" },
  { name: "Walmart", href: "https://www.walmart.ca", src: "/images/stores/walmart-logo.png", width: 615, height: 156, className: "h-4" },
  { name: "eBay", href: "https://www.ebay.ca", src: "/images/stores/ebay-logo.png", width: 708, height: 282, className: "h-5" },
  { name: "AliExpress", href: "https://www.aliexpress.com", src: "/images/stores/aliexpress-logo.png", width: 720, height: 157, className: "h-4" },
];

const STEP_ICONS = [Link2, Receipt, Package, House];

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  productLink: "",
  productDetails: "",
  color: "",
  size: "",
  price: "",
  quantity: "1",
  city: "",
  contactMethod: "",
};

// Requests are sent as a chat message to this number: +1 (437) 997-7533.
// Change it here when the business number changes.
const REQUEST_PHONE = "14379977533";

// reCAPTCHA v2 site key (public). Without it the checkbox is hidden and the
// server skips the reCAPTCHA step (handy for local development).
const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

// How the customer wants us to chat with them (required before sending).
const CHAT_OPTIONS = [
  { value: "WhatsApp", Icon: FaWhatsapp },
  { value: "Telegram", Icon: FaTelegramPlane },
];

// Stored in English (for the email); labels come from translations.
const DESTINATIONS = ["Canada", "Ethiopia", "Uganda"];

// Accepts international (+251 91 234 5678, 00256…) and local numbers with a
// leading 0 (0994104901, 0772…): digits with optional spaces, dots, dashes or
// brackets, 9–15 digits in total.
const PHONE_RE = /^(\+|00)?[\d\s.\-()]+$/;
function isValidPhone(value) {
  const v = value.trim();
  if (!PHONE_RE.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error text for a link that failed checkStoreLink (or is an unresolved short link).
function linkErrorText(reason, t) {
  if (reason === "store") {
    return t("form.errors.linkStore", { stores: STORE_NAMES.join(", ") });
  }
  if (reason === "short") return t("form.errors.linkShort");
  return t("form.errors.link");
}

// `needsDetails`: the item description is only required when there is no preview.
function validate(form, t, needsDetails) {
  const errors = {};
  const required = ["name", "phone", "email", "productLink", "quantity", "city", "contactMethod"];
  if (needsDetails) required.push("productDetails");
  for (const key of required) {
    if (!String(form[key]).trim()) errors[key] = t("form.errors.required");
  }
  if (!errors.phone && !isValidPhone(form.phone)) {
    errors.phone = t("form.errors.phone");
  }
  if (!errors.email && !EMAIL_RE.test(form.email.trim())) {
    errors.email = t("form.errors.email");
  }
  if (!errors.productLink) {
    // Only approved stores, https, no IPs/ports/credentials (lib/stores.js).
    const link = checkStoreLink(form.productLink);
    if (!link.ok) errors.productLink = linkErrorText(link.reason, t);
    else if (link.short) errors.productLink = linkErrorText("short", t);
  }
  if (!errors.quantity && !(Number(form.quantity) >= 1)) {
    errors.quantity = t("form.errors.quantity");
  }
  return errors;
}

// "color_name" -> "Color" (used in the email, which is always English)
function humanKey(key) {
  return key
    .replace(/_name$/, "")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function optionLabel(key, t) {
  const k = key.replace(/_name$/, "").toLowerCase();
  if (k === "color" || k === "colour") return t("form.options.color");
  if (k === "size") return t("form.options.size");
  if (k === "style") return t("form.options.style");
  return humanKey(key);
}

const isColorKey = (key) => /colou?r/i.test(key);

const inputBase =
  "w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:bg-white";
const inputOk =
  "border-gray-200 focus:border-[rgb(var(--color-brand))] focus:ring-2 focus:ring-[rgb(var(--color-brand))]/20";
const inputErr = "border-red-400 focus:ring-2 focus:ring-red-400/20";

function Field({ label, optional, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700">
        {label}
        {optional ? (
          <span className="font-normal text-gray-400"> ({optional})</span>
        ) : (
          <span className="text-[rgb(var(--color-brand-dark))]"> *</span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function QuantityStepper({ value, onChange, t, error }) {
  const n = Math.max(1, Number(value) || 1);
  const btn =
    "cursor-pointer w-9 h-9 flex items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div>
      <p className="text-xs font-semibold text-gray-700">{t("form.quantity")}</p>
      <div className="mt-1.5 inline-flex items-center rounded border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => onChange(String(Math.max(1, n - 1)))}
          disabled={n <= 1}
          aria-label={t("form.qtyDecrease")}
          className={btn}
        >
          <Minus size={14} aria-hidden="true" />
        </button>
        <input
          type="number"
          min="1"
          max="99"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={t("form.quantity")}
          className="w-12 h-9 border-x border-gray-200 text-center text-sm font-semibold text-gray-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(String(Math.min(99, n + 1)))}
          disabled={n >= 99}
          aria-label={t("form.qtyIncrease")}
          className={btn}
        >
          <Plus size={14} aria-hidden="true" />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function BuyForMe() {
  const t = useTranslations("BuyForMe");
  const locale = useLocale();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success
  // Bot filters: reCAPTCHA token, hidden honeypot field, and form-open time.
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaKey, setCaptchaKey] = useState(0); // bump to reset the widget
  const [botError, setBotError] = useState("");
  const honeypotRef = useRef(null);
  const formShownAt = useRef(0);

  // Product preview: idle | loading | ok | unavailable | manual | rejected (bad link)
  const [preview, setPreview] = useState(PREVIEW_IDLE);
  const [selected, setSelected] = useState({}); // chosen option per key
  const [activeImage, setActiveImage] = useState(0);
  const [showForm, setShowForm] = useState(false); // contact form after "Yes, send request"
  const formRef = useRef(null);
  // Dropdown menus render inside <main> so they keep the page font.
  const [portalEl, setPortalEl] = useState(null);
  const previewTimer = useRef(null);
  const previewAbort = useRef(null);

  const product = preview.status === "ok" ? preview.product : null;
  const needsDetails = !product;
  const visibleErrors = submitted ? errors : {};
  // Link problems show as soon as typing pauses, not only after submitting.
  const linkError =
    preview.status === "rejected"
      ? linkErrorText(preview.reason, t)
      : visibleErrors.productLink;

  useEffect(
    () => () => {
      clearTimeout(previewTimer.current);
      previewAbort.current?.abort();
    },
    [],
  );

  // Time trap: remember when the contact form became visible.
  const formVisible = (!product || showForm) && status !== "success";
  useEffect(() => {
    if (formVisible) formShownAt.current = Date.now();
  }, [formVisible]);

  // Fetch a product preview. Typing is debounced; "Find item" and variant
  // switches run immediately. A failed variant switch keeps the current item.
  function requestPreview(link, { immediate = false, variant = false } = {}) {
    clearTimeout(previewTimer.current);
    previewAbort.current?.abort();

    if (!String(link).trim()) {
      setPreview(PREVIEW_IDLE);
      return;
    }
    const check = checkStoreLink(link);
    if (check.ok) {
      if (variant) setPreview((p) => ({ ...p, switching: true }));
      else setPreview({ ...PREVIEW_IDLE, status: "loading" });
    }

    previewTimer.current = setTimeout(
      async () => {
        // Rejected links show their error once typing pauses (not mid-typing).
        if (!check.ok) {
          setPreview({ ...PREVIEW_IDLE, status: "rejected", reason: check.reason });
          return;
        }
        const ctrl = new AbortController();
        previewAbort.current = ctrl;
        try {
          const res = await fetch("/api/product-preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: check.url }),
            signal: ctrl.signal,
          });
          const data = await res.json();
          // Short links (amzn.to, a.co…) are swapped for the full store link.
          if (check.short && data.resolvedUrl) {
            setForm((f) => ({ ...f, productLink: data.resolvedUrl }));
          }
          if (!data.ok) {
            if (["store", "unsafe", "invalid", "short"].includes(data.reason)) {
              setPreview({ ...PREVIEW_IDLE, status: "rejected", reason: data.reason });
              return;
            }
            throw new Error(data.reason || "unavailable");
          }
          setPreview({ status: "ok", product: data.product, switching: false });
          if (!variant) setShowForm(false);
          setSelected(
            Object.fromEntries(
              (data.product.options || [])
                .filter((o) => o.selected)
                .map((o) => [o.key, o.selected]),
            ),
          );
          setActiveImage(0);
          setErrors(({ productDetails, ...rest }) => rest);
        } catch (err) {
          if (err.name === "AbortError") return;
          if (variant) setPreview((p) => ({ ...p, switching: false }));
          else setPreview({ ...PREVIEW_IDLE, status: "unavailable" });
        }
      },
      immediate || variant ? 0 : 600,
    );
  }

  function handleChange(e) {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (e.target.name === "productLink") {
      requestPreview(e.target.value);
      if (submitted) setErrors(validate(next, t, true));
      return;
    }
    if (submitted) setErrors(validate(next, t, needsDetails));
  }

  function setField(name, value) {
    const next = { ...form, [name]: value };
    setForm(next);
    if (submitted) setErrors(validate(next, t, needsDetails));
  }

  const setQuantity = (value) => setField("quantity", value);

  // Is there a variant with this value that also matches the other choices?
  function isAvailable(key, value) {
    const variants = product?.variants || [];
    if (!variants.length) return true;
    return variants.some(
      (v) =>
        v.values[key] === value &&
        Object.entries(selected).every(([k, val]) => k === key || v.values[k] === val),
    );
  }

  function swatchFor(key, value) {
    return product?.variants?.find((v) => v.values[key] === value && v.image)?.image;
  }

  function chooseOption(key, value) {
    let next = { ...selected, [key]: value };
    const variants = product?.variants || [];
    const match =
      variants.find((v) => Object.entries(next).every(([k, val]) => v.values[k] === val)) ||
      variants.find((v) => v.values[key] === value);
    if (match) next = { ...next, ...match.values };
    setSelected(next);

    if (match?.image) {
      setPreview((p) => ({ ...p, product: { ...p.product, images: [match.image] } }));
      setActiveImage(0);
    }
    if (match?.url && match.url !== product.url) {
      setForm((f) => ({ ...f, productLink: match.url }));
      requestPreview(match.url, { variant: true });
    }
  }

  // Switch from a fetched product to typing the details by hand,
  // carrying over what we already know.
  function enterManually() {
    if (product) {
      const pick = (re) =>
        Object.entries(selected).find(([k]) => re.test(k))?.[1] || "";
      setForm((f) => ({
        ...f,
        productDetails: f.productDetails.trim() || product.title,
        color: f.color || pick(/colou?r/i),
        size: f.size || pick(/size/i),
        price:
          f.price ||
          (product.price != null
            ? formatPrice(product.price, product.currency, locale)
            : ""),
      }));
    }
    setShowForm(false);
    setPreview({ ...PREVIEW_IDLE, status: "manual" });
  }

  function openForm() {
    setShowForm(true);
    setTimeout(() => {
      // The product card collapses, so bring the summary + form into view.
      document
        .getElementById("request")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current?.querySelector("input")?.focus({ preventScroll: true });
    }, 50);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    setSubmitted(true);
    setBotError("");
    const errs = validate(form, t, needsDetails);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      if (errs.productLink) {
        document.getElementById("productLink")?.focus();
      }
      return;
    }

    // Honeypot filled: almost certainly a bot. Pretend it worked, send nothing.
    const hp = honeypotRef.current?.value || "";
    if (hp) {
      setStatus("success");
      return;
    }
    if (CAPTCHA_SITE_KEY && !captchaToken) {
      setBotError(t("form.captchaRequired"));
      return;
    }

    // Open the chat tab now (inside the click) so pop-up blockers allow it;
    // it's pointed at WhatsApp/Telegram once the server check passes.
    const chatTab = window.open("", "_blank");
    setStatus("sending");
    let verified = false;
    try {
      const res = await fetch("/api/verify-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: captchaToken,
          hp,
          elapsed: Date.now() - formShownAt.current,
        }),
      });
      verified = (await res.json()).ok === true;
    } catch {
      verified = false;
    }
    if (!verified) {
      chatTab?.close();
      setStatus("idle");
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1); // tokens are single-use: show a fresh checkbox
      setBotError(t("form.verifyError"));
      return;
    }

    const options = product
      ? Object.entries(selected)
          .map(([k, v]) => `${humanKey(k)}: ${v}`)
          .join(", ")
      : [
          form.color.trim() && `Colour: ${form.color.trim()}`,
          form.size.trim() && `Size: ${form.size.trim()}`,
        ]
          .filter(Boolean)
          .join(", ");

    // Image: the store's own picture when the product was loaded.
    const productImage = product ? product.images?.[0] || product.image || "" : "";

    const itemName = form.productDetails.trim() || product?.title || "";
    const storePrice = product?.price != null
      ? formatPrice(product.price, product.currency, locale)
      : form.price.trim();
    const message = [
      "Hi H2H Express, I'd like to request an item (Buy for Me).",
      "",
      `Item: ${itemName}`,
      `Link: ${shortStoreUrl(form.productLink)}`,
      productImage && `Image: ${productImage}`,
      options && `Options: ${options}`,
      `Quantity: ${form.quantity}`,
      storePrice && `Store price: ${storePrice}`,
      "",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Email: ${form.email.trim()}`,
      `Destination: ${form.city}`,
    ]
      .filter((line) => typeof line === "string")
      .join("\n");

    const app = form.contactMethod;
    // Both apps pre-fill the message (Telegram: t.me/+<phone>?text=…).
    const url =
      app === "WhatsApp"
        ? `https://wa.me/${REQUEST_PHONE}?text=${encodeURIComponent(message)}`
        : `https://t.me/+${REQUEST_PHONE}?text=${encodeURIComponent(message)}`;
    if (app === "Telegram") {
      // Backup: older Telegram apps may ignore ?text=, so also copy it.
      navigator.clipboard?.writeText(message).catch(() => {});
    }
    if (chatTab && !chatTab.closed) {
      chatTab.opener = null;
      chatTab.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }

    setForm(EMPTY);
    setPreview(PREVIEW_IDLE);
    setSelected({});
    setShowForm(false);
    setSubmitted(false);
    setErrors({});
    setCaptchaToken(null);
    setStatus("success");
  }

  const cls = (name) =>
    `${inputBase} ${visibleErrors[name] ? inputErr : inputOk}`;

  const images = product
    ? product.images?.length
      ? product.images
      : [product.image].filter(Boolean)
    : [];
  const shownImage = images[Math.min(activeImage, images.length - 1)];

  // How to show each option: one value -> text, picture swatches or short
  // lists -> buttons, long text lists (e.g. 19 sizes) -> dropdown.
  const optionGroups = (product?.options || []).map((o) => {
    const hasSwatches =
      isColorKey(o.key) && o.values.some((v) => swatchFor(o.key, v));
    const mode =
      o.values.length <= 1
        ? "single"
        : !hasSwatches && o.values.length > 6
          ? "select"
          : "chips";
    return { ...o, mode };
  });

  return (
    <main ref={setPortalEl}>
      {/* ── HOW IT WORKS + FORM ──────────────────────────────── */}
      <section className="bg-[#fdf8f5] px-4 pt-10 pb-12 md:pt-12 md:pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          {/* Left: intro + link */}
          <div className="lg:sticky lg:top-28">
            {/* Banner: title + description sit over the photo's empty left side
                at every size; text scales with the banner width. */}
            <div className="relative">
              <Image
                src="/images/buy-for-me-banner.png"
                alt=""
                width={2172}
                height={724}
                priority
                sizes="(min-width: 1024px) 600px, 100vw"
                className="h-auto w-full"
              />
              {/* Text stays within the left ~42% so it never reaches the store
                  bubbles or the woman, and sits above the yellow swoosh. */}
              <div className="absolute left-[4%] top-[7%] w-[40%] sm:top-[9%] sm:w-[38%]">
                <h1 className="font-(family-name:--font-hero) [font-variation-settings:'opsz'_96] text-sm min-[380px]:text-[15px] sm:text-2xl md:text-[28px] lg:text-xl xl:text-[23px] font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                  {t("hero.title")}{" "}
                  <span className="text-[rgb(var(--color-brand))]">
                    {t("hero.titleHighlight")}
                  </span>
                </h1>
                <p className="mt-1 text-[10px] leading-snug text-gray-600 sm:mt-1.5 sm:text-xs md:text-sm lg:text-[11px] xl:text-xs">
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>

            {/* Steps */}
            <ol className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-px border border-gray-200 bg-gray-200">
              {t.raw("steps.items").map((step, i) => {
                const Icon = STEP_ICONS[i] ?? Check;
                return (
                  <li key={i} className="bg-white px-3.5 py-2.5">
                    <div className="flex items-center justify-between">
                      <Icon
                        size={18}
                        strokeWidth={2.25}
                        className="text-[rgb(var(--color-brand))]"
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-medium tracking-widest text-gray-300">
                        0{i + 1}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-gray-900 leading-snug">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 leading-snug">
                      {step.text}
                    </p>
                  </li>
                );
              })}
            </ol>

            {/* Supported stores: auto-scrolling, pauses on hover; each logo opens the store */}
            <div className="mt-10 flex items-center gap-4">
              <span className="shrink-0 text-xs font-medium text-gray-500">
                {t("stores.label")}
              </span>
              <div className="relative min-w-0 flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] motion-reduce:overflow-x-auto">
                <div
                  className="animate-marquee items-center motion-reduce:animate-none!"
                  style={{ "--marquee-speed": "22s" }}
                >
                  {/* Two identical halves so the loop is seamless; only the
                      first set of logos is reachable by keyboard / screen readers. */}
                  {[0, 1].map((half) =>
                    [...STORES, ...STORES].map((store, i) => {
                      const hidden = half === 1 || i >= STORES.length;
                      return (
                        <a
                          key={`${half}-${i}`}
                          href={store.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={store.name}
                          aria-hidden={hidden || undefined}
                          tabIndex={hidden ? -1 : undefined}
                          className="cursor-pointer flex shrink-0 items-center px-4 opacity-90 transition-opacity hover:opacity-100"
                        >
                          <Image
                            src={store.src}
                            alt=""
                            width={store.width}
                            height={store.height}
                            className={`${store.className} w-auto`}
                          />
                        </a>
                      );
                    }),
                  )}
                </div>
              </div>
            </div>

            {/* Product link */}
            <div className="mt-8">
              <label
                htmlFor="productLink"
                className="text-sm font-semibold text-gray-900"
              >
                {t("form.linkLabel")}
                <span className="text-[rgb(var(--color-brand-dark))]"> *</span>
              </label>
              <div
                className={`mt-2 flex items-stretch rounded border bg-white transition-colors focus-within:ring-2 ${
                  linkError
                    ? "border-red-400 focus-within:ring-red-400/20"
                    : "border-gray-300 focus-within:border-[rgb(var(--color-brand))] focus-within:ring-[rgb(var(--color-brand))]/20"
                }`}
              >
                <span className="flex items-center pl-3 text-gray-400">
                  <Link2 size={18} aria-hidden="true" />
                </span>
                <input
                  id="productLink"
                  name="productLink"
                  type="url"
                  inputMode="url"
                  placeholder="https://www.amazon.ca/..."
                  value={form.productLink}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      requestPreview(form.productLink, { immediate: true });
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    requestPreview(form.productLink, { immediate: true })
                  }
                  className="cursor-pointer m-1 inline-flex items-center gap-1.5 rounded bg-[rgb(var(--color-brand))] px-4 text-sm font-semibold text-black transition-colors hover:bg-[rgb(var(--color-brand-dark))]"
                >
                  {t("form.linkButton")}
                  <ArrowRight size={14} strokeWidth={3} aria-hidden="true" />
                </button>
              </div>
              {linkError && (
                <p className="mt-1.5 text-xs text-red-500" role="alert">
                  {linkError}
                </p>
              )}
            </div>
          </div>

          {/* Right: product + request form */}
          <div id="request" className="scroll-mt-24 flex flex-col gap-5">
            {status === "success" ? (
              <div className="bg-white border border-gray-200 p-10 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <CircleCheck size={28} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {t("form.chatSuccessTitle")}
                </h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                  {t("form.chatSuccess")}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="cursor-pointer mt-6 text-sm font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900"
                >
                  {t("form.another")}
                </button>
              </div>
            ) : (
              <>
                {/* ── Product panel ── */}
                <div aria-live="polite">
                  {preview.status === "idle" && (
                    <div className="flex items-center gap-4 border border-dashed border-gray-300 bg-white px-4 py-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-brand))]/15 text-gray-900">
                        <Package size={20} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {t("panel.emptyTitle")}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                          {t("panel.emptyText")}
                        </p>
                      </div>
                    </div>
                  )}

                  {preview.status === "loading" && (
                    <div className="overflow-hidden border border-gray-200 bg-white animate-pulse">
                      <div className="h-36 sm:h-44 bg-gray-100" />
                      <div className="space-y-3 p-5">
                        <div className="h-2.5 w-1/5 rounded bg-gray-100" />
                        <div className="h-4 w-full rounded bg-gray-100" />
                        <div className="h-4 w-3/4 rounded bg-gray-100" />
                        <div className="h-7 w-1/3 rounded bg-gray-100" />
                        <div className="h-11 w-full rounded bg-gray-100" />
                      </div>
                      <span className="sr-only">{t("form.preview.loading")}</span>
                    </div>
                  )}

                  {product && showForm && (
                    <div className="flex items-center gap-3 border border-gray-200 bg-white p-3">
                      {shownImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={shownImage}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 shrink-0 rounded object-contain"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-gray-50 text-gray-300">
                          <Package size={20} aria-hidden="true" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {product.title}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {[
                            product.price != null &&
                              formatPrice(product.price, product.currency, locale),
                            ...Object.entries(selected).map(([, v]) => v),
                            `${t("form.quantity")}: ${form.quantity}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="cursor-pointer shrink-0 text-xs font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
                      >
                        {t("panel.change")}
                      </button>
                    </div>
                  )}

                  {product && !showForm && (
                    <div className="border border-gray-200 bg-white">
                      {/* Gallery */}
                      <div className="p-3 pb-2">
                        <div className="relative flex h-36 sm:h-44 items-center justify-center">
                          {shownImage ? (
                            // Store image hosts vary, so a plain <img> is used here.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={shownImage}
                              alt={product.title}
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Package
                              size={40}
                              className="text-gray-300"
                              aria-hidden="true"
                            />
                          )}
                          {preview.switching && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                              <LoaderCircle
                                size={24}
                                className="animate-spin text-gray-500"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>
                        {images.length > 1 && (
                          <div className="mt-2 flex justify-center gap-1.5 overflow-x-auto pb-1">
                            {images.map((src, i) => (
                              <button
                                key={src}
                                type="button"
                                onClick={() => setActiveImage(i)}
                                aria-label={`${i + 1}`}
                                className={`cursor-pointer h-9 w-9 shrink-0 rounded-md border bg-white p-0.5 transition-colors ${
                                  src === shownImage
                                    ? "border-[rgb(var(--color-brand))] ring-1 ring-[rgb(var(--color-brand))]"
                                    : "border-gray-200 hover:border-gray-400"
                                }`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={src}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-contain"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="border-t border-gray-200 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                            {product.store}
                          </span>
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900"
                          >
                            {t("form.preview.viewOnStore")}
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </a>
                        </div>

                        <h3 className="mt-2 text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                          {product.title}
                        </h3>

                        <div className="mt-1.5">
                          {product.price != null ? (
                            <p
                              className={`text-2xl font-bold tracking-tight text-gray-900 transition-opacity ${
                                preview.switching ? "opacity-40" : ""
                              }`}
                            >
                              {formatPrice(product.price, product.currency, locale)}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {t("form.preview.noPrice")}
                            </p>
                          )}
                          <p className="mt-0.5 text-[11px] text-gray-400 leading-snug">
                            {t("form.preview.priceNote")}
                          </p>
                        </div>

                        {optionGroups.length > 0 && (
                          <div className="mt-3 flex flex-col gap-2.5">
                            {/* Long lists (e.g. sizes) as dropdowns, side by side */}
                            {optionGroups.some((o) => o.mode === "select") && (
                              <div className="grid grid-cols-2 gap-3">
                                {optionGroups
                                  .filter((o) => o.mode === "select")
                                  .map((o) => (
                                    <label key={o.key} className="block min-w-0">
                                      <span className="text-xs text-gray-500">
                                        {optionLabel(o.key, t)}
                                      </span>
                                      <span className="mt-1 block">
                                        <Select
                                          value={selected[o.key] ?? ""}
                                          onValueChange={(v) => chooseOption(o.key, v)}
                                        >
                                          <SelectTrigger className="cursor-pointer w-full rounded-md border-gray-200 bg-white font-medium text-gray-900 focus-visible:border-[rgb(var(--color-brand))] focus-visible:ring-[rgb(var(--color-brand))]/20">
                                            <SelectValue placeholder="—" />
                                          </SelectTrigger>
                                          <SelectContent
                                            container={portalEl}
                                            className="max-h-72 rounded-md border-gray-200 bg-white"
                                          >
                                            {o.values.map((v) => {
                                              const available = isAvailable(o.key, v);
                                              return (
                                                <SelectItem
                                                  key={v}
                                                  value={v}
                                                  className={`cursor-pointer focus:bg-[rgb(var(--color-brand))]/15 ${available ? "text-gray-900" : "text-gray-400"}`}
                                                >
                                                  {v}
                                                  {!available && (
                                                    <span className="ml-1 text-[11px]">
                                                      ({t("form.options.unavailable")})
                                                    </span>
                                                  )}
                                                </SelectItem>
                                              );
                                            })}
                                          </SelectContent>
                                        </Select>
                                      </span>
                                    </label>
                                  ))}
                              </div>
                            )}
                            {optionGroups
                              .filter((o) => o.mode === "chips")
                              .map((o) => (
                                <div key={o.key}>
                                  <p className="text-xs text-gray-500">
                                    {optionLabel(o.key, t)}:{" "}
                                    <span className="font-semibold text-gray-900">
                                      {selected[o.key] || "—"}
                                    </span>
                                  </p>
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {o.values.map((v) => {
                                      const active = selected[o.key] === v;
                                      const available = isAvailable(o.key, v);
                                      const swatch = isColorKey(o.key)
                                        ? swatchFor(o.key, v)
                                        : null;
                                      const state = active
                                        ? "border-[rgb(var(--color-brand))] ring-2 ring-[rgb(var(--color-brand))]/40 text-gray-900"
                                        : available
                                          ? "border-gray-200 text-gray-700 hover:border-gray-500"
                                          : "border-dashed border-gray-300 text-gray-400 hover:border-gray-500";
                                      return swatch ? (
                                        <button
                                          key={v}
                                          type="button"
                                          onClick={() => chooseOption(o.key, v)}
                                          aria-pressed={active}
                                          aria-label={v}
                                          title={v}
                                          className={`cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg border bg-white p-0.5 transition ${state}`}
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={swatch}
                                            alt=""
                                            referrerPolicy="no-referrer"
                                            className={`h-full w-full object-contain ${available ? "" : "opacity-50"}`}
                                          />
                                        </button>
                                      ) : (
                                        <button
                                          key={v}
                                          type="button"
                                          onClick={() => chooseOption(o.key, v)}
                                          aria-pressed={active}
                                          className={`cursor-pointer rounded-lg border bg-white px-2.5 py-1 text-xs transition ${state} ${active ? "font-semibold" : ""}`}
                                        >
                                          {v}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            {optionGroups
                              .filter((o) => o.mode === "single")
                              .map((o) => (
                                <p key={o.key} className="text-xs text-gray-500">
                                  {optionLabel(o.key, t)}:{" "}
                                  <span className="font-semibold text-gray-900">
                                    {o.values[0]}
                                  </span>
                                </p>
                              ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={enterManually}
                          className="cursor-pointer mt-3 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-900"
                        >
                          {t("manual.enterManually")}
                        </button>

                        {/* Quantity + ask before showing the contact form.
                            Sticky so it stays on screen when the card is tall. */}
                        <div className="sticky bottom-0 z-10 -mx-4 -mb-3 mt-3 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-8px_16px_-12px_rgba(0,0,0,0.15)]">
                          {!showForm && (
                            <p className="mb-2 text-sm font-semibold text-gray-900">
                              {t("panel.ctaQuestion")}
                            </p>
                          )}
                          <div className="flex items-end gap-3">
                            <QuantityStepper
                              value={form.quantity}
                              onChange={setQuantity}
                              t={t}
                              error={visibleErrors.quantity}
                            />
                            {!showForm && (
                              <button
                                type="button"
                                onClick={openForm}
                                className="cursor-pointer inline-flex h-9 flex-1 items-center justify-center gap-2 rounded bg-[rgb(var(--color-brand))] px-4 text-sm font-semibold text-black transition-colors hover:bg-[rgb(var(--color-brand-dark))]"
                              >
                                {t("panel.ctaButton")}
                                <ArrowRight size={15} strokeWidth={3} aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {["unavailable", "manual"].includes(
                    preview.status,
                  ) && (
                    <div className="flex flex-col gap-4 border border-gray-200 bg-white p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-brand))]/15 text-gray-900">
                          <PencilLine size={18} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {t(`manual.${preview.status}Title`)}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                            {preview.status === "manual"
                              ? t("manual.manualText")
                              : t("form.preview.unavailable")}
                          </p>
                          {preview.status === "unavailable" && (
                            <button
                              type="button"
                              onClick={() =>
                                requestPreview(form.productLink, { immediate: true })
                              }
                              className="cursor-pointer mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900"
                            >
                              <RotateCw size={12} aria-hidden="true" />
                              {t("manual.retry")}
                            </button>
                          )}
                        </div>
                      </div>

                      <Field
                        label={t("form.productDetails")}
                        error={visibleErrors.productDetails}
                      >
                        <input
                          name="productDetails"
                          type="text"
                          placeholder={t("form.productDetailsPlaceholder")}
                          value={form.productDetails}
                          onChange={handleChange}
                          className={cls("productDetails")}
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label={t("form.color")} optional={t("form.optional")}>
                          <input
                            name="color"
                            type="text"
                            placeholder={t("form.colorPlaceholder")}
                            value={form.color}
                            onChange={handleChange}
                            className={cls("color")}
                          />
                        </Field>
                        <Field label={t("form.size")} optional={t("form.optional")}>
                          <input
                            name="size"
                            type="text"
                            placeholder={t("form.sizePlaceholder")}
                            value={form.size}
                            onChange={handleChange}
                            className={cls("size")}
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 items-end gap-3">
                        <Field label={t("form.price")} optional={t("form.optional")}>
                          <input
                            name="price"
                            type="text"
                            inputMode="decimal"
                            placeholder={t("form.pricePlaceholder")}
                            value={form.price}
                            onChange={handleChange}
                            className={cls("price")}
                          />
                        </Field>
                        <QuantityStepper
                          value={form.quantity}
                          onChange={setQuantity}
                          t={t}
                          error={visibleErrors.quantity}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Contact form (after the customer confirms when a product is shown) ── */}
                {(!product || showForm) && (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  className="scroll-mt-24 bg-white border border-gray-200 p-6 md:p-7 flex flex-col gap-5"
                >
                  {/* Honeypot: off-screen field people never see. Bots that fill
                      every input fill this too. Odd name + autocomplete off +
                      password-manager ignore flags keep autofill away from it. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
                  >
                    <label htmlFor="bfm_hp_ref">Leave this field empty</label>
                    <input
                      ref={honeypotRef}
                      id="bfm_hp_ref"
                      name="bfm_hp_ref"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      data-1p-ignore="true"
                      data-lpignore="true"
                      data-bwignore="true"
                      data-form-type="other"
                      defaultValue=""
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {t("form.contactGroup")}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {t("form.subheading")}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t("form.name")} error={visibleErrors.name}>
                      <input
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder={t("form.namePlaceholder")}
                        value={form.name}
                        onChange={handleChange}
                        className={cls("name")}
                      />
                    </Field>
                    <Field label={t("form.phone")} error={visibleErrors.phone}>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+251 91 234 5678"
                        value={form.phone}
                        onChange={handleChange}
                        className={cls("phone")}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t("form.email")} error={visibleErrors.email}>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={t("form.emailPlaceholder")}
                        value={form.email}
                        onChange={handleChange}
                        className={cls("email")}
                      />
                    </Field>
                    <Field label={t("form.city")} error={visibleErrors.city}>
                      <Select
                        value={form.city}
                        onValueChange={(v) => setField("city", v)}
                      >
                        <SelectTrigger
                          aria-invalid={Boolean(visibleErrors.city)}
                          className={`cursor-pointer h-auto! w-full rounded-lg px-4 py-2.5 text-sm ${
                            visibleErrors.city
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200 bg-gray-50 focus-visible:border-[rgb(var(--color-brand))] focus-visible:ring-[rgb(var(--color-brand))]/20"
                          } data-placeholder:text-gray-400 text-gray-800`}
                        >
                          <SelectValue placeholder={t("form.cityPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent
                          container={portalEl}
                          className="rounded-md border-gray-200 bg-white"
                        >
                          {DESTINATIONS.map((d) => (
                            <SelectItem
                              key={d}
                              value={d}
                              className="cursor-pointer focus:bg-[rgb(var(--color-brand))]/15"
                            >
                              {t(`form.destinations.${d}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  {CAPTCHA_SITE_KEY && (
                    <div>
                      <Recaptcha
                        key={captchaKey}
                        siteKey={CAPTCHA_SITE_KEY}
                        hl={locale === "am" ? "am" : "en"}
                        onToken={setCaptchaToken}
                        failedText={t("form.captchaFailed")}
                      />
                    </div>
                  )}
                  {botError && (
                    <p className="-mt-2 text-xs text-red-500" role="alert">
                      {botError}
                    </p>
                  )}

                  {/* Preferred chat app (required before sending) + submit, side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                    <Field label={t("form.contactVia")} error={visibleErrors.contactMethod}>
                      <Select
                        value={form.contactMethod}
                        onValueChange={(v) => setField("contactMethod", v)}
                      >
                        <SelectTrigger
                          aria-invalid={Boolean(visibleErrors.contactMethod)}
                          className="cursor-pointer h-auto! w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 data-placeholder:text-gray-400 focus-visible:border-[rgb(var(--color-brand))] focus-visible:ring-[rgb(var(--color-brand))]/20"
                        >
                          <SelectValue placeholder={t("form.contactViaPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent
                          container={portalEl}
                          className="rounded-md border-gray-200 bg-white"
                        >
                          {CHAT_OPTIONS.map(({ value, Icon }) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="cursor-pointer focus:bg-[rgb(var(--color-brand))]/15"
                            >
                              <span className="flex items-center gap-2">
                                <Icon size={14} className="shrink-0 text-gray-600" aria-hidden="true" />
                                {value}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <div>
                      <button
                        type="submit"
                        disabled={
                          !form.contactMethod ||
                          status === "sending" ||
                          (Boolean(CAPTCHA_SITE_KEY) && !captchaToken)
                        }
                        className="cursor-pointer inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-[rgb(var(--color-brand))] px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[rgb(var(--color-brand-dark))] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
                      >
                        {status === "sending" ? (
                          <>
                            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
                            {t("form.sending")}
                          </>
                        ) : (
                          <>
                            {t("form.submit")}
                            <ArrowRight size={16} strokeWidth={3} aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
