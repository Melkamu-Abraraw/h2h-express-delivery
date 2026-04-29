"use client";

import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="relative bg-gradient-to-r from-[rgb(var(--color-brand-light))] to-[rgb(var(--color-brand-dark))] text-white overflow-hidden"
    >
      {/* ── Curved top ── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-[80px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C240,120 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z"
            fill="#fff7f0"
          />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12 grid md:grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>
          <div className="bg-white text-black font-bold px-4 py-2 rounded-full inline-block mb-4">
            <img
              src="/images/h2h-logo.png"
              alt="delivery"
              className="h-[50px] object-contain"
            />{" "}
          </div>

          <p className="text-sm opacity-90 mb-3">
            <strong>{t("tel")}</strong>
            <br />
            +251 994 104 901
          </p>

          <p className="text-sm opacity-90 mb-3">
            <strong>{t("email")}</strong>
            <br />
            info@h2hexpress.com
          </p>

          <p className="text-sm opacity-90 mb-2">
            <strong>{t("social")}</strong>
          </p>

          <div className="flex gap-3 mt-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              f
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              in
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              ig
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>{t("links.home")}</li>
            <li>{t("links.services")}</li>
            <li>{t("links.about")}</li>
            <li>{t("links.contact")}</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-semibold mb-4">{t("contactUs")}</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>{t("links.email")}</li>
            <li>{t("links.careers")}</li>
            <li>{t("links.help")}</li>
            <li>{t("links.contact")}</li>
          </ul>
        </div>
      </div>
      <div className="hidden md:block absolute bottom-0 right-90">
        <img
          src="/images/footer-image.png"
          alt="delivery"
          className="h-[400px] object-contain"
        />{" "}
      </div>
      {/* ── Right Image ── */}
    </footer>
  );
}
