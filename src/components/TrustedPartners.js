// components/TrustedPartners.jsx

import Image from "next/image";
import { useTranslations } from "next-intl";

const partners = [
  { id: 1, name: "DHL", logo: "/images/wado-logo-3.jpg" },
  { id: 2, name: "FedEx", logo: "/images/4kilo_butcher.jpg" },
  { id: 3, name: "UPS", logo: "/images/BeluPrintings.jpg" },
  { id: 4, name: "Maersk", logo: "/images/goldbeamstudio_dark.jpg" },
];

export default function TrustedPartners() {
  const t = useTranslations("trustedPartners");

  return (
    <section className="w-full bg-white overflow-hidden py-16">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          display: flex;
          width: max-content;
          gap: 2.5rem;
          animation: marquee 30s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Heading */}
      <div className="px-6 md:px-12 lg:px-20 mb-10 text-center">
        <span className="inline-block bg-[rgb(var(--color-brand))] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide">
          {t("badge")}
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t("title")}
        </h2>

        <p className="text-gray-500 text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          {t("description")}
        </p>
      </div>

      {/* Logo Marquee */}
      <div className="relative">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Right Fade */}
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex items-center justify-center bg-white border border-gray-200 rounded-2xl px-8 py-3 min-w-[120px] h-28 shadow-sm hover:shadow-md hover:border-[rgb(var(--color-brand))] transition-all duration-300"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={180}
                height={60}
                className="object-contain max-h-20 w-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
