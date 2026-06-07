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

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ type, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white text-sm font-semibold transition-all duration-300 ${
        isSuccess ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {isSuccess ? (
        <svg
          className="w-5 h-5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(formState) {
  const errors = {};

  if (!formState.name.trim()) {
    errors.name = "Name is required.";
  } else if (formState.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  // E.164 international phone — allows +CountryCode then digits, spaces, dashes, parens
  const phoneRegex = /^\+?[1-9]\d{0,3}[\s.\-()]?(\d[\s.\-()]?){6,14}\d$/;
  if (!formState.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!phoneRegex.test(formState.phone.trim())) {
    errors.phone =
      "Enter a valid international phone number (e.g. +1 416 555 0100).";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formState.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(formState.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!formState.service) {
    errors.service = "Please select a service.";
  }

  if (!formState.message.trim()) {
    errors.message = "Message is required.";
  } else if (formState.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
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
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
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
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 tracking-wide">
        {label}{" "}
        {required && <span className="text-[rgb(var(--color-brand))]">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <svg
            className="w-3 h-3 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[rgb(var(--color-brand))] focus:ring-2 focus:ring-[rgb(var(--color-brand))]/20 transition-all duration-200";

const inputErrCls =
  "w-full rounded-xl border border-red-400 bg-red-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400/20 transition-all duration-200";

const selectCls =
  "w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[rgb(var(--color-brand))] focus:ring-2 focus:ring-[rgb(var(--color-brand))]/20 transition-all duration-200 cursor-pointer";

const selectErrCls =
  "w-full appearance-none rounded-xl border border-red-400 bg-red-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400/20 transition-all duration-200 cursor-pointer";

// ─── Info Row ─────────────────────────────────────────────────────────────────
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContactSection() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [headerRef, headerInView] = useInView(0.2);
  const [leftRef, leftInView] = useInView(0.1);
  const [rightRef, rightInView] = useInView(0.1);

  const EMPTY = { name: "", phone: "", email: "", service: "", message: "" };

  const [formState, setFormState] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", message: string }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
    // re-validate the field live once it has been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        ...validate({ ...formState, [name]: value }),
        // clear error for this field if it's now valid
        [name]: validate({ ...formState, [name]: value })[name],
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, ...validate(formState) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Mark everything touched and run full validation
    setTouched({
      name: true,
      phone: true,
      email: true,
      service: true,
      message: true,
    });
    const errs = validate(formState);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) throw new Error("Failed");

      setFormState(EMPTY);
      setTouched({});
      setErrors({});
      setToast({ type: "success", message: t("form.toastSuccess") });
    } catch {
      setToast({ type: "error", message: t("form.toastError") });
    } finally {
      setSubmitting(false);
    }
  }

  // helper: pick class based on whether field has a visible error
  function ic(name) {
    return touched[name] && errors[name] ? inputErrCls : inputCls;
  }

  function sc(name) {
    return touched[name] && errors[name] ? selectErrCls : selectCls;
  }

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#fdf8f5] py-24 px-4 sm:px-6"
    >
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[rgb(var(--color-brand-light))]/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[rgb(var(--color-brand-light))]/10 blur-3xl" />
        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[rgb(var(--color-brand))] via-[rgb(var(--color-brand-light))] to-transparent opacity-60" />
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[rgb(var(--color-brand))] via-[rgb(var(--color-brand-light))] to-transparent opacity-60" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left */}
          <div
            ref={leftRef}
            className="flex flex-col gap-5"
            style={{
              opacity: leftInView ? 1 : 0,
              transform: leftInView
                ? "none"
                : `translate(${isRtl ? "30px" : "-30px"},0)`,
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            {/* Contact Info */}
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

            {/* WhatsApp */}
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

            {/* Google Map */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("map.title")}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t("map.subtitle")}
                </p>
              </div>
              <div className="w-full h-[350px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.224313620947!2d-79.3141208!3d43.685099799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cd14f4ffe9fd%3A0x8b1e86376a80b6ea!2sHand%20to%20Hand%20Express!5e0!3m2!1sen!2snl!4v1779287749124!5m2!1sen!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div
            ref={rightRef}
            style={{
              opacity: rightInView ? 1 : 0,
              transform: rightInView
                ? "none"
                : `translate(${isRtl ? "-30px" : "30px"},0)`,
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.07)] p-7 flex flex-col gap-5"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label={t("form.name")}
                  required
                  error={touched.name && errors.name}
                >
                  <input
                    name="name"
                    type="text"
                    placeholder={t("form.namePlaceholder")}
                    value={formState.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={ic("name")}
                  />
                </Field>

                <Field
                  label={t("form.phone")}
                  required
                  error={touched.phone && errors.phone}
                >
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+1 416 555 0100"
                    value={formState.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={ic("phone")}
                  />
                </Field>
              </div>

              {/* Email */}
              <Field
                label={t("form.email")}
                required
                error={touched.email && errors.email}
              >
                <input
                  name="email"
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  value={formState.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={ic("email")}
                />
              </Field>

              {/* Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label={t("form.service")}
                  required
                  error={touched.service && errors.service}
                >
                  <div className="relative">
                    <select
                      name="service"
                      value={formState.service}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={sc("service")}
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

              {/* Message */}
              <Field
                label={t("form.message")}
                required
                error={touched.message && errors.message}
              >
                <textarea
                  name="message"
                  rows={4}
                  placeholder={t("form.messagePlaceholder")}
                  value={formState.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${ic("message")} resize-none`}
                />
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="self-start inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[rgb(var(--color-brand))] to-[rgb(var(--color-brand-dark))] text-white text-sm font-bold shadow-md shadow-[rgb(var(--color-brand))]/30 hover:shadow-lg hover:shadow-[rgb(var(--color-brand))]/40 hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    {t("form.sending")}
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
