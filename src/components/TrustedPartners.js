// components/TrustedPartners.jsx
import Image from "next/image";
import { useTranslations } from "next-intl";

const partners = [
  { id: 1, name: "DHL", logo: "/images/wado-logo-3.jpg" },
  { id: 2, name: "FedEx", logo: "/images/wado-logo-3.jpg" },
  { id: 3, name: "UPS", logo: "/images/wado-logo-3.jpg" },
  { id: 4, name: "Maersk", logo: "/images/wado-logo-3.jpg" },
  { id: 5, name: "Aramex", logo: "/images/wado-logo-3.jpg" },
  { id: 6, name: "Kuehne Nagel", logo: "/images/wado-logo-3.jpg" },
];

export default function TrustedPartners() {
  const t = useTranslations("trustedPartners");

  return (
    <section className="w-full py-14 bg-white overflow-hidden">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
          gap: 2.5rem;
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
        <h2 className="text-3xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-gray-500 text-base mt-3 max-w-xl mx-auto leading-relaxed">
          {t("description")}
        </p>
      </div>

      {/* Scrolling track */}
      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 min-w-[200px] h-36 hover:border-[rgb(var(--color-brand))] transition-all duration-200 group"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={80}
                height={80}
                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
