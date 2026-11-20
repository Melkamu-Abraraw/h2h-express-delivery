"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);

  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="relative max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center">
        {/* LEFT NAV (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href={`/${locale}`}>{t("home")}</Link>
          <Link href={`/${locale}`}>{t("about")}</Link>
          <Link href={`/${locale}/services`}>{t("services")}</Link>
          <Link href={`/${locale}/contact-us`}>{t("contact")}</Link>
        </nav>

        {/* LOGO: left on mobile, true center on desktop */}
        <div className="flex items-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link href={`/${locale}`}>
            <Image
              src="/images/hand-to-hand-balck.png"
              alt="Logo"
              width={75}
              height={75}
              priority
              className="object-contain w-[55px] h-[55px] md:w-[75px] md:h-[75px]"
            />
          </Link>
        </div>

        {/* RIGHT ACTIONS (DESKTOP) */}
        <div className="hidden md:flex ml-auto items-center gap-4 text-sm">
          {/* LANGUAGE */}
          <div className="flex gap-1 border px-2 py-1 rounded-md">
            {["en", "am", "ti"].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`cursor-pointer px-2 py-1 text-xs rounded ${
                  locale === lng
                    ? "bg-[rgb(var(--color-brand))] text-white"
                    : "text-gray-600"
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            href={`/${locale}/buy-for-me`}
            onClick={() => setOpen(false)}
            className="cursor-pointer bg-[rgb(var(--color-brand))] text-black font-medium px-2.5 py-2 rounded flex items-center gap-1.5">
            <ShoppingCart size={16} strokeWidth={2.25} aria-hidden="true" />
            {t("buyForMe")}
            <ArrowRight size={14} strokeWidth={3} aria-hidden="true" />
          </Link>
        </div>

        {/* RIGHT ACTIONS (MOBILE) */}
        <div className="md:hidden ml-auto z-20 flex items-center gap-3">
          <Link
            href={`/${locale}/buy-for-me`}
            onClick={() => setOpen(false)}
            className="cursor-pointer bg-[rgb(var(--color-brand))] text-black font-medium text-sm px-2.5 py-1.5 rounded flex items-center gap-1">
            <ShoppingCart size={15} strokeWidth={2.25} aria-hidden="true" />
            {t("buyForMe")}
            <ArrowRight size={13} strokeWidth={3} aria-hidden="true" />
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="cursor-pointer relative w-6 h-6"
            aria-label="Menu"
          >
            <span
              className={`absolute left-0 w-6 h-0.5 bg-gray-900 transition-all ${open ? "rotate-45 top-3" : "top-1"}`}
            />
            <span
              className={`absolute left-0 w-6 h-0.5 bg-gray-900 transition-all ${open ? "opacity-0" : "top-3"}`}
            />
            <span
              className={`absolute left-0 w-6 h-0.5 bg-gray-900 transition-all ${open ? "-rotate-45 top-3" : "top-5"}`}
            />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-2 shadow-lg">
          {/* NAV LINKS */}
          {[
            { name: t("home"), href: "/" },
            { name: t("about"), href: "/" },
            { name: t("services"), href: "/services" },
            { name: t("contact"), href: "/contact-us" },
          ].map((item, i) => (
            <Link
              key={i}
              href={`/${locale}${item.href}`}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-md text-right text-gray-700 hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}

          {/* 🔥 LANGUAGE SWITCHER (MOBILE FIX) */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {["en", "am", "ti"].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`cursor-pointer px-3 py-2 text-sm rounded border ${
                  locale === lng
                    ? "bg-[rgb(var(--color-brand))] text-white border-[rgb(var(--color-brand))]"
                    : "text-gray-700"
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
