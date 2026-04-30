"use client";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [loaded, setLoaded] = useState(false);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Trigger stats counter animation when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.5 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .hero-fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hero-fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-fade-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .hero-fade-right.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }
        .delay-500 { transition-delay: 0.5s; }

        .float-badge {
          animation: floatBadge 3s ease-in-out infinite;
        }
        .float-badge-alt {
          animation: floatBadge 3s ease-in-out infinite reverse;
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .hero-circle {
          animation: pulseCircle 4s ease-in-out infinite;
        }
        @keyframes pulseCircle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        .stat-count {
          display: inline-block;
          transition: transform 0.4s ease;
        }
        .stat-count.pop {
          animation: statPop 0.5s ease forwards;
        }
        @keyframes statPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <section className="rounded-2xl overflow-hidden max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between gap-4 min-h-[300px] relative">
        {/* LEFT — Text */}
        <div className="flex-1 max-w-xl z-10">
          <p
            className={`hero-fade-up delay-100 text-xs font-semibold text-[rgb(var(--color-brand))] uppercase tracking-widest mb-2 ${loaded ? "visible" : ""}`}
          >
            {t("tagline")}
          </p>

          <h1
            className={`hero-fade-up delay-200 text-5xl font-extrabold text-gray-900 leading-tight mb-3 ${loaded ? "visible" : ""}`}
          >
            {t("title")}{" "}
            <span className="text-[rgb(var(--color-brand))]">
              {t("titleAccent")}
            </span>
          </h1>

          <p
            className={`hero-fade-up delay-300 text-lg text-gray-600 mb-2 ${loaded ? "visible" : ""}`}
          >
            {t("subtitle")}
          </p>

          <p
            className={`hero-fade-up delay-400 text-sm text-gray-400 mb-8 ${loaded ? "visible" : ""}`}
          >
            {t("description")}
          </p>

          <div
            className={`hero-fade-up delay-500 flex gap-3 flex-wrap ${loaded ? "visible" : ""}`}
          >
            <Link
              href={`/`}
              className="bg-[rgb(var(--color-brand))] hover:bg-[rgb(var(--color-brand-light))] hover:scale-105 active:scale-95 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              {t("requestDelivery")}
            </Link>
            <Link
              href={`/${locale}/contact-us`}
              className="border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {t("contactUs")}
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex gap-8 mt-8">
            {[
              { value: "10K+", label: t("stat1"), delay: "delay-100" },
              { value: "24/7", label: t("stat2"), delay: "delay-200" },
              { value: "50+", label: t("stat3"), delay: "delay-300" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p
                  className={`stat-count text-2xl font-extrabold text-gray-900 ${statsVisible ? "pop" : ""} ${s.delay}`}
                >
                  {s.value}
                </p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Illustration */}
        <div
          className={`hero-fade-right delay-300 relative w-110 md:w-120 h-120 flex-shrink-0 flex items-center justify-center ${loaded ? "visible" : ""}`}
        >
          <img
            src="/images/hero-image-2.jpg"
            alt="Delivery"
            className="relative z-10 h-400 object-contain px-2 md:p-0"
          />
        </div>
      </section>
    </>
  );
}
