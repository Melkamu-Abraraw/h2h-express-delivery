"use client";

import { useState } from "react";

// ── replace this with the WhatsApp number that receives the info
// format: country code + number, no + or spaces, e.g. "12895551234"
const WHATSAPP_NUMBER = "14379977533";

// ── Validation ────────────────────────────────────────────────────────────────
function validate(f) {
  const errors = {};

  if (!f.fullName.trim() || f.fullName.trim().length < 2)
    errors.fullName = "Full name is required.";

  const phoneRegex = /^\+?[1-9]\d{0,3}[\s.\-()]?(\d[\s.\-()]?){6,14}\d$/;
  if (!f.phone.trim()) errors.phone = "Phone number is required.";
  else if (!phoneRegex.test(f.phone.trim()))
    errors.phone =
      "Enter a valid international phone number (e.g. +1 416 555 0100).";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (f.email.trim() && !emailRegex.test(f.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!f.departure.trim()) errors.departure = "Departure date is required.";

  if (!f.arrival.trim()) errors.arrival = "Arrival date is required.";

  if (f.departure && f.arrival && f.arrival < f.departure)
    errors.arrival = "Arrival must be after departure.";

  if (!f.from.trim()) errors.from = "Travelling from is required.";

  if (!f.to.trim()) errors.to = "Travelling to is required.";

  if (!f.kg || isNaN(f.kg) || Number(f.kg) <= 0)
    errors.kg = "Enter how many bags you can carry.";
  else if (Number(f.kg) > 500) errors.kg = "Please enter a realistic weight.";

  return errors;
}

// ── Build WhatsApp message ─────────────────────────────────────────────────────
function buildMessage(f) {
  return (
    `🚚 *New Carrier Registration*\n\n` +
    `👤 *Name:* ${f.fullName}\n` +
    `📞 *Phone:* ${f.phone}\n` +
    `📧 *Email:* ${f.email || "—"}\n\n` +
    `✈️ *Route:* ${f.from} → ${f.to}\n` +
    `📅 *Departure:* ${f.departure}\n` +
    `📅 *Arrival:* ${f.arrival}\n\n` +
    `⚖️ *Available Capacity:* ${f.kg} bags\n` +
    `📝 *Notes:* ${f.notes || "—"}`
  );
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function Field({ label, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
        {label}
        {required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 -mt-1">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
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

const ic = (hasErr) =>
  `w-full rounded-xl border ${hasErr ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-400/20" : "border-gray-200 bg-gray-50 focus:border-orange-400 focus:ring-orange-400/20"} px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 transition-all duration-200`;

const PACKAGE_OPTIONS = [
  "Documents",
  "Clothes",
  "Electronics",
  "Medicine",
  "Food items",
  "Gifts",
  "Other",
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CarrierForm() {
  const today = new Date().toISOString().split("T")[0];

  const EMPTY = {
    fullName: "",
    phone: "",
    email: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    kg: "",
    packageTypes: [],
    notes: "",
  };

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validate({ ...form, [name]: value })[name],
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(form)[name] }));
  }

  function togglePackageType(type) {
    setForm((s) => ({
      ...s,
      packageTypes: s.packageTypes.includes(type)
        ? s.packageTypes.filter((t) => t !== type)
        : [...s.packageTypes, type],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const allTouched = Object.fromEntries(
      Object.keys(EMPTY).map((k) => [k, true]),
    );
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const message = buildMessage(form);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(url, "_blank");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            You're registered!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your details have been sent to Us via WhatsApp. They'll be in touch
            with you shortly.
          </p>
          <button
            onClick={() => {
              setForm(EMPTY);
              setTouched({});
              setErrors({});
              setSubmitted(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-4 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Carrier Registration
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Travelling with space?
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Fill in your travel details below. We will match you with packages
            along your route.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-7 flex flex-col gap-5"
        >
          {/* Personal Details */}
          <div>
            <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">
              Personal details
            </p>
            <div className="flex flex-col gap-4">
              <Field
                label="Full name"
                required
                error={touched.fullName && errors.fullName}
              >
                <input
                  name="fullName"
                  type="text"
                  placeholder="e.g. Abebe Bekele"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={ic(touched.fullName && errors.fullName)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Phone number"
                  required
                  error={touched.phone && errors.phone}
                  hint="Include country code"
                >
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+1 416 555 0100"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={ic(touched.phone && errors.phone)}
                  />
                </Field>

                <Field
                  label="Email"
                  error={touched.email && errors.email}
                  hint="Optional"
                >
                  <input
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={ic(touched.email && errors.email)}
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Travel Details */}
          <div>
            <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">
              Travel details
            </p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Travelling from"
                  required
                  error={touched.from && errors.from}
                >
                  <input
                    name="from"
                    type="text"
                    placeholder="e.g. Toronto, Canada"
                    value={form.from}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={ic(touched.from && errors.from)}
                  />
                </Field>

                <Field
                  label="Travelling to"
                  required
                  error={touched.to && errors.to}
                >
                  <input
                    name="to"
                    type="text"
                    placeholder="e.g. Addis Ababa, Ethiopia"
                    value={form.to}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={ic(touched.to && errors.to)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Departure date"
                  required
                  error={touched.departure && errors.departure}
                >
                  <input
                    name="departure"
                    type="date"
                    min={today}
                    value={form.departure}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={ic(touched.departure && errors.departure)}
                  />
                </Field>

                <Field
                  label="Arrival date"
                  required
                  error={touched.arrival && errors.arrival}
                >
                  <input
                    name="arrival"
                    type="date"
                    min={form.departure || today}
                    value={form.arrival}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={ic(touched.arrival && errors.arrival)}
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Capacity */}
          <div>
            <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">
              Capacity
            </p>
            <div className="flex flex-col gap-4">
              <Field
                label="Laggage capacity"
                required
                error={touched.kg && errors.kg}
                hint="How many bags can you carry?"
              >
                <input
                  name="kg"
                  type="number"
                  min="0.5"
                  max="500"
                  step="0.5"
                  placeholder="e.g. 10"
                  value={form.kg}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={ic(touched.kg && errors.kg)}
                />
              </Field>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Notes */}
          <Field label="Additional notes" hint="Anything We  should know">
            <textarea
              name="notes"
              rows={3}
              placeholder="e.g. I can only carry small boxes, no liquids..."
              value={form.notes}
              onChange={handleChange}
              className={`${ic(false)} resize-none`}
            />
          </Field>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-black shadow-md shadow-green-200 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            Send to Us via WhatsApp
          </button>

          <p className="text-center text-xs text-gray-400">
            Tapping the button will open WhatsApp with your details pre-filled.
            Just hit send.
          </p>
        </form>
      </div>
    </div>
  );
}
