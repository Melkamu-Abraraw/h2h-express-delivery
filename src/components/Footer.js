"use client";

import { useTranslations, useLocale } from "next-intl";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const currentYear = new Date().getFullYear();

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
      <div className="relative max-w-6xl mx-auto px-6 pt-18 pb-5 grid md:grid-cols-4 gap-10">
        {/* Column 1 */}
        <div>
          <div className="mb-0  h-[140px] ">
            <img
              src="/images/logo_footer.png"
              alt="delivery"
              className="h-[90px] object-contain"
            />
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
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition"
            >
              <FaFacebook size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition"
            >
              <FaTiktok size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition"
            >
              <FaInstagram size={16} />
            </a>
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

        {/* Column 4 - About Company */}
        <div>
          <h4 className="font-semibold mb-4">{t("aboutCompany")}</h4>
          <p className="text-sm opacity-90 mb-4">{t("companyDescription")}</p>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="relative border-t border-white/20 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row  md:px-4 justify-between items-center text-sm opacity-85">
          <p>{t("allRightsReserved", { year: currentYear })}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-100 transition">
              {t("privacyPolicy")}
            </a>
            <a href="#" className="hover:opacity-100 transition">
              {t("termsOfService")}
            </a>
          </div>
        </div>
      </div>

      {/* ── Right Image ── */}
    </footer>
  );
}
