// components/WhyChooseUs.tsx
"use client";

import { useTranslations } from "next-intl";

const icons = ["⚡", "📍", "🛡️", "🎧"];

export default function WhyChooseUs() {
  const t = useTranslations("whyChooseUs");

  // next-intl returns raw arrays via t.raw()
  const features = t.raw("features");

  return (
    <section className="bg-[#0a0a0a] px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Tag */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-orange-400">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
          {t("tag")}
        </div>

        {/* Headline */}
        <h2 className="max-w-xl text-4xl font-bold leading-tight text-white md:text-5xl">
          {t("headline1")}{" "}
          <span className="text-orange-500">{t("headline2")}</span>
        </h2>

        {/* Divider */}
        <div className="my-6 h-0.5 w-8 rounded-full bg-orange-500" />

        {/* Subtext */}
        <p className="mb-14 max-w-md text-sm leading-relaxed text-neutral-500">
          {t("sub")}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 divide-x divide-y divide-neutral-800 overflow-hidden rounded-2xl border border-neutral-800 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#0f0f0f] p-8 transition-colors duration-200 hover:bg-[#141414]"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-lg">
                {icons[i]}
              </div>
              <p className="mb-2 text-sm font-semibold text-white">{f.title}</p>
              <p className="text-sm leading-relaxed text-neutral-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
