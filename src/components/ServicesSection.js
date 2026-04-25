"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

// ─── Icons ──────────────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const TruckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 5v4h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const HeadsetIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-3.5 h-3.5"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ArrowIcon = ({ rtl }) => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={{ transform: rtl ? "scaleX(-1)" : "none" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
);

const STEP_ICONS = [BellIcon, TruckIcon, ShieldIcon, HeadsetIcon];

// ─── useInView ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
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

// ─── StepCard ────────────────────────────────────────────────────────────────
function StepCard({ step, index, isRtl, inView, stepLabel, cta }) {
  const Icon = STEP_ICONS[index];
  const isEven = index % 2 === 0;
  const delay = `${index * 160}ms`;

  return (
    <div className="relative flex flex-col lg:flex-row items-center gap-0">
      {/* ── Card column ── */}
      <div
        className={`w-full lg:w-[calc(50%-2.5rem)] flex ${
          isEven ? "lg:justify-end" : "lg:order-2 lg:justify-start"
        }`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView
            ? "none"
            : `translate(${isEven ? "-40px" : "40px"}, 20px)`,
          transition: `opacity 0.65s ease ${delay}, transform 0.65s ease ${delay}`,
        }}
      >
        <div className="group relative bg-white rounded-2xl border border-[rgb(var(--color-brand-light))] shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-7 max-w-[420px] w-full hover:shadow-[0_8px_40px_rgba(var(--color-brand),0.15)] hover:-translate-y-1.5 transition-all duration-300">
          {/* Ghost number */}
          <span
            className="absolute -top-4 select-none text-[5rem] font-black leading-none text-[rgb(var(--color-brand))]/[0.07] pointer-events-none"
            style={{ [isRtl ? "right" : "left"]: "1.25rem" }}
            aria-hidden="true"
          >
            {step.number}
          </span>

          {/* Hover top-border accent */}
          <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r from-[rgb(var(--color-brand-light))] to-[rgb(var(--color-brand-dark))] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon + step label */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--color-brand))] to-[rgb(var(--color-brand-dark))] text-white shadow-md shadow-[rgb(var(--color-brand-light))]/50 flex-shrink-0">
              <Icon />
            </div>
            <span className="text-xs font-bold tracking-[0.16em] text-[rgb(var(--color-brand))] uppercase">
              {stepLabel} {step.number}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
            {step.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Bullets */}
          {step.bullets && step.bullets.length > 0 && (
            <ul className="space-y-2 mb-5">
              {step.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-gray-600"
                >
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[rgb(var(--color-brand-light))]/20 text-[rgb(var(--color-brand-dark))] flex items-center justify-center">
                    <CheckIcon />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA on first step only */}
          {index === 0 && cta && (
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[rgb(var(--color-brand))] to-[rgb(var(--color-brand-dark))] text-white text-sm font-semibold shadow-md shadow-[rgb(var(--color-brand-light))]/40 hover:shadow-lg hover:shadow-[rgb(var(--color-brand))]/30 hover:scale-105 active:scale-100 transition-all duration-200">
              {cta}
              <ArrowIcon rtl={isRtl} />
            </button>
          )}
        </div>
      </div>

      {/* ── Spine node ── */}
      <div className="hidden lg:flex flex-col items-center z-10 w-20 flex-shrink-0">
        <div
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgb(var(--color-brand))] to-[rgb(var(--color-brand-dark))] text-white flex items-center justify-center shadow-lg shadow-[rgb(var(--color-brand-light))]/50 ring-4 ring-white"
          style={{
            transform: inView ? "scale(1)" : "scale(0)",
            transition: `transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}`,
          }}
        >
          <Icon />
        </div>
      </div>

      {/* ── Empty opposite column ── */}
      <div
        className={`hidden lg:block w-[calc(50%-2.5rem)] ${isEven ? "" : "lg:order-1"}`}
      />
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ServicesSection() {
  const t = useTranslations("services");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // t.raw() returns the raw array from your JSON messages
  const steps = t.raw("steps");

  const [headerRef, headerInView] = useInView(0.2);
  const [bodyRef, bodyInView] = useInView(0.05);

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#fdf8f5] py-24 px-4 sm:px-6"
    >
      {/* ── Background decorations ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[rgb(var(--color-brand-light))]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[rgb(var(--color-brand-light))]/10 blur-2xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]">
          <defs>
            <pattern
              id="svc-grid"
              width="44"
              height="44"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 44 0 L 0 0 0 44"
                fill="none"
                stroke="rgb(var(--color-brand))"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#svc-grid)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* ── Section header ── */}
        <div
          ref={headerRef}
          className="text-center mb-20"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "none" : "translateY(28px)",
            transition: "opacity 0.75s ease, transform 0.75s ease",
          }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--color-brand-light))]/20 text-[rgb(var(--color-brand-dark))] text-xs font-bold tracking-widest uppercase mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-brand))] animate-pulse" />
            {t("badge")}
          </span>

          <h2 className="text-4xl md:text-[2.75rem] font-black text-gray-900 leading-tight mb-4">
            {t("heading")}
          </h2>

          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            {t("subheading")}
          </p>
        </div>

        {/* ── Timeline ── */}
        <div ref={bodyRef} className="relative">
          {/* Vertical spine line */}
          <div
            className="hidden lg:block absolute left-1/2 -translate-x-px top-7 bottom-7 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgb(var(--color-brand-light)) 10%, rgb(var(--color-brand)) 50%, rgb(var(--color-brand-light)) 90%, transparent)",
            }}
            aria-hidden="true"
          />

          <div className="flex flex-col gap-14">
            {steps.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                index={i}
                isRtl={isRtl}
                inView={bodyInView}
                stepLabel={t("stepLabel")}
                cta={t("cta")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
