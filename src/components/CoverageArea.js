// components/CoverageArea.jsx
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CoverageArea() {
  const t = useTranslations("coverageArea");

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left: Text content */}
        <div className="flex-1 max-w-lg">
          <span className="inline-block bg-[rgb(var(--color-brand))] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            {t("badge")}
          </span>

          <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
            {t("title")}
          </h2>

          <p className="text-gray-500 text-base leading-relaxed mb-8">
            {t("description")}
          </p>
        </div>

        {/* Right: Map image */}
        <div className="flex-1 flex justify-center items-center">
          <Image
            src="/images/delivery-destinations-image.png"
            alt={t("mapAlt")}
            width={500}
            height={400}
            className="w-full max-w-xl object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
