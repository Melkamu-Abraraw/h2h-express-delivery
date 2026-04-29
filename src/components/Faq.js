"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FAQSection() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState(1);

  const faqs = [
    {
      id: 1,
      q: t("questions.q1"),
      a: t("answers.a1"),
    },
    {
      id: 2,
      q: t("questions.q2"),
      a: t("answers.a2"),
    },
    {
      id: 3,
      q: t("questions.q3"),
      a: t("answers.a3"),
    },
    {
      id: 4,
      q: t("questions.q4"),
      a: t("answers.a4"),
    },
  ];

  return (
    <section className="relative py-24 text-white overflow-hidden">
      {/* ✅ BACKGROUND IMAGE */}
      <Image
        src="/images/h2h-map.png" // <-- put your image here
        alt="FAQ background"
        fill
        className="object-cover"
        priority
      />

      {/* ✅ DARK BRAND OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="bg-[rgb(var(--color-brand-dark))] px-4 py-1 rounded-full text-sm font-semibold">
            {t("label")}
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-6">
            {t("title.line1")}
            <br />
            {t("title.line2")}
          </h2>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-6">
          {faqs.map((item) => {
            const isOpen = open === item.id;

            return (
              <div
                key={item.id}
                className="border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur"
              >
                <div
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="grid md:grid-cols-2 gap-6 cursor-pointer"
                >
                  {/* LEFT */}
                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                        isOpen
                          ? "bg-[rgb(var(--color-brand))] text-white"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {item.id}
                    </div>

                    <h3 className="text-lg">{item.q}</h3>
                  </div>

                  {/* RIGHT */}
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-gray-300">{item.a}</p>

                    <ChevronDown
                      className={`transition-transform ${
                        isOpen ? "rotate-180 text-orange-400" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
