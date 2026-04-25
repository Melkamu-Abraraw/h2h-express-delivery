"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

// ─── useInView ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const icons = {
  pickup: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M5 8h14M5 8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  ),
  storage: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
  callcenter: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  contact: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="8" cy="10" r="1" fill="currentColor" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  delivery: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  ),
  funds: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="12" cy="15" r="2" />
    </svg>
  ),
  packaging: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  ),
  returns: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  tracking: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-7 h-7"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
};

const ICON_KEYS = [
  "pickup",
  "storage",
  "callcenter",
  "contact",
  "delivery",
  "funds",
  "packaging",
  "returns",
  "tracking",
];

// ─── ServiceCard ─────────────────────────────────────────────────────────────
function ServiceCard({ service, iconKey, index, inView }) {
  const delay = `${(index % 3) * 100 + Math.floor(index / 3) * 200}ms`;

  return (
    <div
      className="relative flex flex-col items-center pt-10 group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(50px) scale(0.95)",
        transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
      }}
    >
      {/* Floating icon circle */}
      <div
        className="absolute -top-6 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[rgb(var(--color-brand))] text-white shadow-lg shadow-[rgb(var(--color-brand-dark))]/30 ring-4 ring-[rgb(var(--color-brand-light))]/30 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
        aria-hidden="true"
      >
        {icons[iconKey]}
      </div>

      {/* Card body */}
      <div className="w-full h-full bg-white rounded-2xl px-6 pt-12 pb-7 text-center shadow-[0_4px_24px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_36px_rgba(0,0,0,0.14)] group-hover:-translate-y-1 transition-all duration-300">
        {/* Top accent bar on hover */}
        <div className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full bg-[rgb(var(--color-brand))] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-center" />

        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
          {service.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ServicesGrid() {
  const t = useTranslations("servicesGrid");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const services = t.raw("items");

  const [headerRef, headerInView] = useInView(0.2);
  const [gridRef, gridInView] = useInView(0.05);

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative overflow-hidden py-20 px-4 sm:px-6 bg-[rgb(var(--color-brand))]"
    >
      {/* Subtle pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      >
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="srv-dots"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#srv-dots)" />
        </svg>
      </div>

      {/* Glow blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[rgb(var(--color-brand-dark))]/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[rgb(var(--color-brand-dark))]/30 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div
          ref={headerRef}
          className="text-center "
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "none" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wide mb-5">
            {t("heading")}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t("subheading")}
          </p>
        </div>

        {/* ── 3×3 Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14"
        >
          {services.map((service, i) => (
            <ServiceCard
              key={i}
              service={service}
              iconKey={ICON_KEYS[i] || "pickup"}
              index={i}
              inView={gridInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
