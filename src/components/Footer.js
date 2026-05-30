"use client";

import { useTranslations, useLocale } from "next-intl";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";

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
          <div className="mb-0 h-[140px]">
            <img
              src="/images/logo_footer.png"
              alt="logo"
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
              href="https://www.tiktok.com/@handtohandexpress2"
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

        {/* Column 2 - Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <Link href="/" className="hover:underline">
                {t("links.home")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/services`} className="hover:underline">
                {t("links.services")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about-us`} className="hover:underline">
                {t("links.about")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/contact-us`} className="hover:underline">
                {t("links.contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 - Contact */}
        <div>
          <h4 className="font-semibold mb-4">{t("contactUs")}</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <a href="mailto:info@h2hexpress.com" className="hover:underline">
                {t("links.email")}
              </a>
            </li>

            <li>
              <Link href={`/${locale}/contact-us`} className="hover:underline">
                {t("links.contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="font-semibold mb-4">{t("aboutCompany")}</h4>
          <p className="text-sm opacity-90 mb-4">{t("companyDescription")}</p>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="relative border-t border-white/20 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:px-4 justify-between items-center text-sm opacity-85">
          <p>{t("allRightsReserved", { year: currentYear })}</p>

          <div className="flex gap-6">
            <Link href="#" className="hover:opacity-100 transition">
              {t("privacyPolicy")}
            </Link>

            <Link href="#" className="hover:opacity-100 transition">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
