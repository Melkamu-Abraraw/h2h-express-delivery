"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
        {/* MOBILE MENU */}
        <div className="md:hidden z-20">
          <button onClick={() => setOpen(!open)} className="relative w-6 h-6">
            <span
              className={`absolute w-6 h-0.5 bg-[rgb(var(--color-brand))] transition-all ${open ? "rotate-45 top-3" : "top-1"}`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-[rgb(var(--color-brand))] transition-all ${open ? "opacity-0" : "top-3"}`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-[rgb(var(--color-brand))] transition-all ${open ? "-rotate-45 top-3" : "top-5"}`}
            />
          </button>
        </div>

        {/* LEFT NAV (DESKTOP) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href={`/${locale}`}>{t("home")}</Link>
          <Link href={`/${locale}/about-us`}>{t("about")}</Link>
          <Link href={`/${locale}/services`}>{t("services")}</Link>
          <Link href={`/${locale}/contact-us`}>{t("contact")}</Link>
        </nav>

        {/* CENTER LOGO (TRUE CENTER) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link href={`/${locale}`}>
            <Image
              src="/images/Logo_Header.png"
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
                className={`px-2 py-1 text-xs rounded ${
                  locale === lng
                    ? "bg-[rgb(var(--color-brand))] text-white"
                    : "text-gray-600"
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="text-gray-700">{t("login")}</button>

          <button className="bg-[rgb(var(--color-brand))] text-white px-3 py-2 rounded-md">
            {t("signup")} 👤
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-2 shadow-lg">
          {[
            { name: t("home"), href: "/" },
            { name: t("about"), href: "/about-us" },
            { name: t("services"), href: "/services" },
            { name: t("contact"), href: "/contact-us" },
          ].map((item, i) => (
            <Link
              key={i}
              href={`/${locale}${item.href}`}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
