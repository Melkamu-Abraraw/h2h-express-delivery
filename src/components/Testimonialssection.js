"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

// ─── useInView ────────────────────────────────────────────────────────────────
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

// ─── Star rating ──────────────────────────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${i < count ? "text-[rgb(var(--color-brand))]" : "text-gray-200"}`}
          fill="currentColor"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Quote icon ───────────────────────────────────────────────────────────────
const QuoteIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002-.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.498 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1.01-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002-.003z" />
  </svg>
);

// ─── Avatar initials ──────────────────────────────────────────────────────────
function Avatar({ name, color }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors = [
    "from-orange-400 to-rose-400",
    "from-sky-400 to-indigo-400",
    "from-emerald-400 to-teal-400",
    "from-violet-400 to-purple-400",
    "from-amber-400 to-orange-400",
    "from-pink-400 to-rose-400",
  ];
  const bg = colors[color % colors.length];
  return (
    <div
      className={`w-11 h-11 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md`}
    >
      {initials}
    </div>
  );
}

// ─── Marquee card (compact, for scrolling rows) ───────────────────────────────
function MarqueeCard({ item, colorIdx }) {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 mx-3 hover:shadow-[0_6px_28px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
      <QuoteIcon className="w-6 h-6 text-[rgb(var(--color-brand))]/25 mb-3" />
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
        {item.text}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar name={item.name} color={colorIdx} />
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">
              {item.name}
            </p>
            <p className="text-xs text-gray-400">{item.role}</p>
          </div>
        </div>
        <Stars count={item.stars} />
      </div>
    </div>
  );
}

// ─── Marquee row ──────────────────────────────────────────────────────────────
function MarqueeRow({ items, reverse = false, speed = 40 }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div
        className={`flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-speed": `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <MarqueeCard key={i} item={item} colorIdx={i % items.length} />
        ))}
      </div>
    </div>
  );
}

// ─── Featured card (large hero testimonial) ───────────────────────────────────
function FeaturedCard({ item, isRtl, inView }) {
  return (
    <div
      className="relative bg-gradient-to-br from-[rgb(var(--color-brand))] to-[rgb(var(--color-brand-dark))] rounded-3xl p-8 md:p-10 shadow-2xl shadow-[rgb(var(--color-brand))]/30 overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(40px) scale(0.97)",
        transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
      }}
    >
      {/* Background quote watermark */}
      <QuoteIcon className="absolute -top-4 -right-4 w-32 h-32 text-white/10" />

      {/* Stars */}
      <div className="flex gap-1 mb-5">
        {Array.from({ length: item.stars }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="w-5 h-5 text-white/90"
            fill="currentColor"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      <p className="text-white text-lg md:text-xl leading-relaxed font-medium mb-7">
        "{item.text}"
      </p>

      <div className="flex items-center gap-4">
        <Avatar name={item.name} color={0} />
        <div>
          <p className="text-white font-bold text-base leading-none mb-1">
            {item.name}
          </p>
          <p className="text-white/70 text-sm">{item.role}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatBar({ stats, inView }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="text-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
          }}
        >
          <p className="text-3xl font-black text-[rgb(var(--color-brand))] leading-none mb-1">
            {s.value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const items = t.raw("items");
  const featured = t.raw("featured");
  const stats = t.raw("stats");

  // Split items into two rows for marquee
  const mid = Math.ceil(items.length / 2);
  const row1 = items.slice(0, mid);
  const row2 = items.slice(mid);

  const [headerRef, headerInView] = useInView(0.2);
  const [featuredRef, featuredInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.2);

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#fdf8f5] py-24"
    >
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-[rgb(var(--color-brand))]/5 rounded-full blur-3xl" />
      </div>

      {/* ── Header ── */}
      <div
        ref={headerRef}
        className="text-center px-4 mb-14"
        style={{
          opacity: headerInView ? 1 : 0,
          transform: headerInView ? "none" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--color-brand-light))]/20 text-[rgb(var(--color-brand-dark))] text-xs font-bold tracking-widest uppercase mb-5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-brand))] animate-pulse" />
          {t("badge")}
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
          {t("heading")}
        </h2>
        <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
          {t("subheading")}
        </p>
      </div>

      {/* ── Featured + Stats ── */}
      <div ref={featuredRef} className="max-w-5xl mx-auto px-4 sm:px-6 mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <FeaturedCard item={featured} isRtl={isRtl} inView={featuredInView} />

          <div
            className="flex flex-col gap-8"
            style={{
              opacity: featuredInView ? 1 : 0,
              transform: featuredInView
                ? "none"
                : `translate(${isRtl ? "-30px" : "30px"}, 0)`,
              transition: "opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s",
            }}
          >
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                {t("sideTitle")}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t("sideText")}
              </p>
            </div>

            <div ref={statsRef}>
              <StatBar stats={stats} inView={statsInView} />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {t.raw("badges").map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-brand))]" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee rows ── */}
      <div className="flex flex-col gap-5">
        <MarqueeRow items={row1} reverse={false} speed={50} />
      </div>

      {/* fade edges */}
      <div className="pointer-events-none absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#fdf8f5] to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#fdf8f5] to-transparent z-10" />
    </section>
  );
}
