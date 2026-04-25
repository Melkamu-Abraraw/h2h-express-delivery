"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.9}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.9}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.9}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);
const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-4 h-4"
    stroke="currentColor"
    strokeWidth={2}
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-4 h-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Reusable field components ────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 tracking-wide">
        {label}{" "}
        {required && <span className="text-[rgb(var(--color-brand))]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[rgb(var(--color-brand))] focus:ring-2 focus:ring-[rgb(var(--color-brand))]/20 transition-all duration-200";

const selectCls =
  "w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[rgb(var(--color-brand))] focus:ring-2 focus:ring-[rgb(var(--color-brand))]/20 transition-all duration-200 cursor-pointer";

// ─── Info row ────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[rgb(var(--color-brand))] text-white flex items-center justify-center shadow-md shadow-[rgb(var(--color-brand))]/30">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 leading-snug mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [headerRef, headerInView] = useInView(0.2);
  const [leftRef, leftInView] = useInView(0.1);
  const [rightRef, rightInView] = useInView(0.1);

  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setFormState((s) => ({ ...s, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#fdf8f5] py-24 px-4 sm:px-6"
    >
      {/* ── Background decorations ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[rgb(var(--color-brand-light))]/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[rgb(var(--color-brand-light))]/10 blur-3xl" />
        {/* Side accent bars */}
        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[rgb(var(--color-brand))] via-[rgb(var(--color-brand-light))] to-transparent opacity-60" />
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[rgb(var(--color-brand))] via-[rgb(var(--color-brand-light))] to-transparent opacity-60" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div
          ref={headerRef}
          className="text-center mb-14"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "none" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-[rgb(var(--color-brand))] uppercase tracking-tight mb-4">
            {t("heading")}
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {t("subheading")}
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Left: Info card + WhatsApp ── */}
          <div
            ref={leftRef}
            className="flex flex-col gap-5"
            style={{
              opacity: leftInView ? 1 : 0,
              transform: leftInView
                ? "none"
                : `translate(${isRtl ? "30px" : "-30px"}, 0)`,
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            {/* Contact info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.07)] p-7 flex flex-col gap-6">
              <InfoRow
                icon={<PhoneIcon />}
                label={t("phone.label")}
                value={t("phone.value")}
              />
              <div className="h-px bg-gray-100" />
              <InfoRow
                icon={<MailIcon />}
                label={t("email.label")}
                value={t("email.value")}
              />
              <div className="h-px bg-gray-100" />
              <InfoRow
                icon={<MapPinIcon />}
                label={t("address.label")}
                value={t("address.value")}
              />
            </div>

            {/* WhatsApp card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.07)] p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-green-200 flex-shrink-0">
                  <WhatsappIcon />
                </div>
                <p className="text-sm font-bold text-gray-800 leading-snug">
                  {t("whatsapp.label")}
                </p>
              </div>
              <a
                href={`https://wa.me/${t("whatsapp.number")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-5 py-2 rounded-xl border-2 border-[rgb(var(--color-brand))] text-[rgb(var(--color-brand))] text-sm font-bold hover:bg-[rgb(var(--color-brand))] hover:text-white transition-all duration-200"
              >
                {t("whatsapp.cta")}
              </a>
            </div>
          </div>

          {/* ── Right: Contact form ── */}
          <div
            ref={rightRef}
            style={{
              opacity: rightInView ? 1 : 0,
              transform: rightInView
                ? "none"
                : `translate(${isRtl ? "-30px" : "30px"}, 0)`,
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.07)] p-7 flex flex-col gap-5"
            >
              {/* Row 1: Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t("form.name")} required>
                  <input
                    name="name"
                    type="text"
                    placeholder={t("form.namePlaceholder")}
                    value={formState.name}
                    onChange={handleChange}
                    className={inputCls}
                    required
                  />
                </Field>
                <Field label={t("form.phone")} required>
                  <input
                    name="phone"
                    type="tel"
                    placeholder={t("form.phonePlaceholder")}
                    value={formState.phone}
                    onChange={handleChange}
                    className={inputCls}
                    required
                  />
                </Field>
              </div>

              {/* Row 2: Email */}
              <Field label={t("form.email")} required>
                <input
                  name="email"
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  value={formState.email}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </Field>

              {/* Row 3: Subject + Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t("form.subject")} required>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className={selectCls}
                      required
                    >
                      <option value="">{t("form.selectPlaceholder")}</option>
                      {t.raw("form.subjectOptions").map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                </Field>
                <Field label={t("form.service")} required>
                  <div className="relative">
                    <select
                      name="service"
                      value={formState.service}
                      onChange={handleChange}
                      className={selectCls}
                      required
                    >
                      <option value="">{t("form.selectPlaceholder")}</option>
                      {t.raw("form.serviceOptions").map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                </Field>
              </div>

              {/* Row 4: Message */}
              <Field label={t("form.message")} required>
                <textarea
                  name="message"
                  rows={4}
                  placeholder={t("form.messagePlaceholder")}
                  value={formState.message}
                  onChange={handleChange}
                  className={`${inputCls} resize-none`}
                  required
                />
              </Field>

              {/* Submit */}
              <button
                type="submit"
                className="self-start inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[rgb(var(--color-brand))] to-[rgb(var(--color-brand-dark))] text-white text-sm font-bold shadow-md shadow-[rgb(var(--color-brand))]/30 hover:shadow-lg hover:shadow-[rgb(var(--color-brand))]/40 hover:scale-105 active:scale-100 transition-all duration-200"
              >
                {submitted ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t("form.sent")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("form.submit")}
                    <SendIcon />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
