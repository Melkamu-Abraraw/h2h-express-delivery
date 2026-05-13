"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRef } from "react";
import {
  Package,
  ShieldCheck,
  Globe,
  Users,
  Zap,
  UserCheck,
  Clock,
  TrendingUp,
  Flag,
  Rocket,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");
  const teamRef = useRef(null);

  const scrollTeam = (direction) => {
    if (teamRef.current) {
      teamRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const stats = [
    { icon: Package, number: "10K+", label: t("stats.packages.label") },
    { icon: Users, number: "5K+", label: t("stats.customers.label") },
    { icon: Globe, number: "20+", label: t("stats.countries.label") },
    { icon: ShieldCheck, number: "98%", label: t("stats.delivery.label") },
  ];

  const features = [
    { icon: Zap, title: t("hero.features.fast") },
    { icon: Globe, title: t("hero.features.international") },
    { icon: ShieldCheck, title: t("hero.features.secure") },
    { icon: UserCheck, title: t("hero.features.customer") },
  ];

  const storySteps = [
    {
      icon: Flag,
      number: "01",
      title: t("story.steps.beginning.title"),
      description: t("story.steps.beginning.description"),
    },
    {
      icon: Users,
      number: "02",
      title: t("story.steps.growing.title"),
      description: t("story.steps.growing.description"),
    },
    {
      icon: Rocket,
      number: "03",
      title: t("story.steps.future.title"),
      description: t("story.steps.future.description"),
    },
  ];

  const team = [
    {
      name: "Mustefa Wado",
      role: t("team.roles.founder"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: "Sara Tesfaye",
      role: t("team.roles.operations"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: "Dawit Mehari",
      role: t("team.roles.logistics"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: "Emily Chen",
      role: t("team.roles.marketing"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: "James Williams",
      role: t("team.roles.customer"),
      image: "/images/muste-brand.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel label={t("hero.label")} />

            <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")}
              <br />
              <span className="text-[#f5b400]">{t("hero.titleHighlight")}</span>
            </h1>

            {/* one-liner punch — no wall of text */}
            <p className="mt-6 max-w-md text-lg font-medium leading-8 text-gray-500">
              {t("hero.description")}
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-4">
              {features.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff3c4]">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* image side — unchanged from your original */}
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border-4 border-[#f5b400]" />
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src="/images/truck image.png"
                alt={t("hero.imageAlt")}
                className="h-[460px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
            </div>

            {/* floating mission card */}
            <div className="absolute left-4 top-14 w-[200px] rounded-[1.5rem] bg-white p-6 text-center shadow-2xl sm:left-[-40px]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-[#f5b400]">
                <Package size={26} />
              </div>
              <h3 className="mt-4 text-base font-black">
                {t("mission.title")}
              </h3>
              <p className="mt-3 text-xs leading-6 text-gray-500">
                {t("mission.description")}
              </p>
              <div className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#f5b400] shadow-lg">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-4 py-14 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 md:grid-cols-4 md:divide-y-0">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2 py-10">
                  <Icon size={22} className="text-[#f5b400]" />
                  <p className="text-4xl font-black">{s.number}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="px-4 pb-16 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* tight header */}
          <div className="mb-12 max-w-lg">
            <SectionLabel label={t("story.label")} />
            <h2 className="mt-4 text-4xl font-black leading-tight">
              {t("story.titleLine1")}{" "}
              <span className="text-[#f5b400]">
                {t("story.titleHighlight")}
              </span>
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              {t("story.description")}
            </p>
          </div>

          {/* steps */}
          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 top-12 hidden h-px w-full border-t-2 border-dashed border-[#f5b400]/50 md:block" />
            {storySteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative text-center">
                  <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#f5b400] bg-black text-[#f5b400]">
                    <Icon size={34} />
                  </div>
                  <p className="mt-5 text-2xl font-black">{step.number}</p>
                  <h4 className="mt-2 text-lg font-black">{step.title}</h4>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-gray-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#f7edd8] p-6 lg:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <SectionLabel label={t("team.label")} />
              <h2 className="mt-3 text-3xl font-black">{t("team.title")}</h2>
              <p className="mt-1 max-w-sm text-sm text-gray-600">
                {t("team.description")}
              </p>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <button
                onClick={() => scrollTeam("left")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollTeam("right")}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5b400] hover:opacity-80"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={teamRef}
            className="mt-7 flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {team.map((member, i) => (
              <div
                key={i}
                className="w-44 flex-shrink-0 overflow-hidden rounded-2xl bg-white text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-sm font-black">{member.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[#f5b400]">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-black uppercase tracking-widest text-[#f5b400]">
        {label}
      </span>
      <span className="h-[2px] w-8 bg-[#f5b400]" />
    </div>
  );
}
