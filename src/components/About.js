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
  Handshake,
  Clock,
  TrendingUp,
  Flag,
  Rocket,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");
  const teamRef = useRef(null);
  const workplaceRef = useRef(null);

  const scrollTeam = (direction) => {
    if (teamRef.current) {
      const scrollAmount = 300; // Adjust based on card width
      teamRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollWorkplace = (direction) => {
    if (workplaceRef.current) {
      const scrollAmount = 200; // Adjust based on image width
      workplaceRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const stats = [
    {
      icon: Package,
      number: t("stats.packages.number"),
      label: t("stats.packages.label"),
    },
    {
      icon: Users,
      number: t("stats.customers.number"),
      label: t("stats.customers.label"),
    },
    {
      icon: Globe,
      number: t("stats.countries.number"),
      label: t("stats.countries.label"),
    },
    {
      icon: ShieldCheck,
      number: t("stats.delivery.number"),
      label: t("stats.delivery.label"),
    },
  ];

  const features = [
    {
      icon: Zap,
      title: t("hero.features.fast"),
    },
    {
      icon: Globe,
      title: t("hero.features.international"),
    },
    {
      icon: ShieldCheck,
      title: t("hero.features.secure"),
    },
    {
      icon: UserCheck,
      title: t("hero.features.customer"),
    },
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
      name: "Sarah Johnson",
      role: t("team.roles.operations"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: "David Lee",
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
    {
      name: "Jennifer Davis",
      role: t("team.roles.manager"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: "Mustefa Wado",
      role: t("team.roles.founder"),
      image: "/images/muste-brand.jpg",
    },
  ];

  const workplaceImages = [
    "/images/Next-Day Delivery.jpg",
    "/images/Next-Day Delivery.jpg",
    "/images/Next-Day Delivery.jpg",
    "/images/Next-Day Delivery.jpg",
    "/images/Next-Day Delivery.jpg",
    "/images/Next-Day Delivery.jpg",
    "/images/Next-Day Delivery.jpg",
  ];

  const commitments = [
    {
      icon: ShieldCheck,
      title: t("commitment.items.trust.title"),
      description: t("commitment.items.trust.description"),
    },
    {
      icon: Clock,
      title: t("commitment.items.reliability.title"),
      description: t("commitment.items.reliability.description"),
    },
    {
      icon: Users,
      title: t("commitment.items.care.title"),
      description: t("commitment.items.care.description"),
    },
    {
      icon: TrendingUp,
      title: t("commitment.items.growth.title"),
      description: t("commitment.items.growth.description"),
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
      <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel label={t("hero.label")} />

            <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight tracking-tight text-black sm:text-5xl lg:text-6xl">
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")}
              <br />
              <span className="text-[#f5b400]">{t("hero.titleHighlight")}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600">
              {t("hero.description")}
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3c4] text-black">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

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

            <div className="absolute left-4 top-14 w-[220px] rounded-[2rem] bg-white p-7 text-center shadow-2xl sm:left-[-40px]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-[#f5b400]">
                <Package size={30} />
              </div>

              <h3 className="mt-5 text-xl font-black">{t("mission.title")}</h3>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                {t("mission.description")}
              </p>

              <div className="absolute -bottom-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-[#f5b400] text-black shadow-lg">
                <ChevronDown size={22} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[300px_1fr]">
          <div>
            <SectionLabel label={t("story.label")} />

            <h2 className="mt-4 text-4xl font-black leading-tight">
              {t("story.titleLine1")}
              <br />
              {t("story.titleLine2")}{" "}
              <span className="text-[#f5b400]">
                {t("story.titleHighlight")}
              </span>
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-600">
              {t("story.description")}
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 top-12 hidden h-[2px] w-full border-t-2 border-dashed border-[#f5b400]/60 md:block" />

            {storySteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={index} className="relative text-center">
                  <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#f5b400] bg-black text-[#f5b400] shadow-lg">
                    <Icon size={36} />
                  </div>

                  <h3 className="mt-5 text-2xl font-black">{step.number}</h3>
                  <h4 className="mt-3 text-lg font-black">{step.title}</h4>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#f7edd8] p-6 text-black shadow-2xl lg:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <SectionLabel label={t("team.label")} dark />

              <h2 className="mt-3 text-3xl font-black">{t("team.title")}</h2>

              <p className="mt-2 text-sm text-gray-600">
                {t("team.description")}
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <button
                onClick={() => scrollTeam("left")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-black hover:bg-white hover:text-black"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scrollTeam("right")}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5b400] text-black hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={teamRef}
            className="mt-7 flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {team.map((member, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 overflow-hidden rounded-2xl bg-white text-center text-black"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-50 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="text-sm font-black">{member.name}</h3>
                  <p className="mt-1 text-xs font-bold text-[#f5b400]">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center gap-2">
            <span className="h-2 w-6 rounded-full bg-[#f5b400]" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </div>
        </div>
      </section>
      {/* 
      <section className="px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionLabel label={t("workplace.label")} />

          <div className="relative mt-5">
            <button
              onClick={() => scrollWorkplace("left")}
              className="absolute left-[-18px] top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={workplaceRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {workplaceImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={t("workplace.imageAlt")}
                  className="flex-shrink-0 h-36 w-48 rounded-2xl object-cover shadow-md"
                />
              ))}
            </div>

            <button
              onClick={() => scrollWorkplace("right")}
              className="absolute right-[-18px] top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section> */}
    </main>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-black uppercase tracking-wide text-[#f5b400]">
        {label}
      </span>
      <span className="h-[2px] w-10 bg-[#f5b400]" />
    </div>
  );
}
