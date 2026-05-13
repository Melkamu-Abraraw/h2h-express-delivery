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

  // 🔁 Language switch handler
  const changeLanguage = (newLocale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* LEFT (Desktop) */}
        <nav className="hidden md:flex flex-1 gap-6 text-sm font-medium text-gray-700">
          <Link
            href={`/${locale}`}
            className="hover:text-[rgb(var(--color-brand-dark))]"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/about-us`}
            className="hover:text-[rgb(var(--color-brand-dark))]"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${locale}/services`}
            className="hover:text-[rgb(var(--color-brand-dark))]"
          >
            {t("services")}
          </Link>
          <Link
            href={`/${locale}/contact-us`}
            className="hover:text-[rgb(var(--color-brand-dark))]"
          >
            {t("contact")}
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative w-6 h-6"
        >
          <span
            className={`absolute left-0 w-6 h-0.5 bg-[rgb(var(--color-brand))] transition ${open ? "rotate-45 top-3" : "top-1"}`}
          ></span>
          <span
            className={`absolute left-0 w-6 h-0.5 bg-[rgb(var(--color-brand))] transition ${open ? "opacity-0" : "top-3"}`}
          ></span>
          <span
            className={`absolute left-0 w-6 h-0.5 bg-[rgb(var(--color-brand))] transition ${open ? "-rotate-45 top-3" : "top-5"}`}
          ></span>
        </button>

        {/* CENTER LOGO */}
        {/* CENTER LOGO */}
        {/* CENTER LOGO */}
        {/* CENTER LOGO */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 md:bottom-6 translate-y-1/2 z-70">
          <Link href={`/${locale}`}>
            <div className="flex flex-col items-center gap-3 ">
              <Image
                src="/images/H2H_Logo.png"
                alt="Logo"
                width={100}
                height={100}
                loading="eager"
                className="object-contain w-[60px] h-[60px] md:w-[100px] md:h-[100px]"
              />
              <div className="flex flex-col items-center leading-tight -mt-3">
                <span className="text-[9px] md:text-[11px] font-bold tracking-[2px] text-black">
                  HAND TO HAND
                </span>
                <span className="text-[7px] md:text-[9px] font-medium tracking-[1.5px] text-black">
                  EXPRESS DELIVERY
                </span>
              </div>
            </div>
          </Link>
        </div>
        {/* RIGHT (Desktop) */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-4 text-sm">
          {/* 🌍 Language Switcher */}
          <div className="flex gap-2 border px-2 py-1 rounded-md">
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

          <button
            type="button"
            className="text-gray-700 hover:text-[rgb(var(--color-brand-dark))]"
          >
            {t("login")}
          </button>

          <button
            type="button"
            className="bg-[rgb(var(--color-brand))] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[rgb(var(--color-brand-light))] transition"
          >
            {t("signup")} <span className="text-black">👤</span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-1">
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
              className="block w-full px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}

          {/* 🌍 Mobile Language Switcher */}
          <div className="flex gap-2 pt-3 border-t mt-3">
            {["en", "am", "ti"].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className="px-3 py-1 border rounded text-sm"
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t mt-3">
            <button
              type="button"
              className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {t("login")}
            </button>

            <button
              type="button"
              className="bg-[rgb(var(--color-brand))] text-white px-4 py-2 rounded-md"
            >
              {t("signup")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
