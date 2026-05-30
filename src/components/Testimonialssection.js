"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

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

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${
            i < count ? "text-[rgb(var(--color-brand))]" : "text-gray-200"
          }`}
          fill="currentColor"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Quote Icon ───────────────────────────────────────────────────────────────
const QuoteIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002-.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.498 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-.94 2.69-.273 1.01-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002-.003z" />
  </svg>
);

// ─── Avatar (NOW WITH IMAGE SUPPORT) ─────────────────────────────────────────
function Avatar({ name, image }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const colors = [
    "from-orange-400 to-rose-400",
    "from-sky-400 to-indigo-400",
    "from-emerald-400 to-teal-400",
    "from-violet-400 to-purple-400",
  ];

  const bg = colors[Math.floor(Math.random() * colors.length)];

  // ✅ If image exists
  if (image) {
    return (
      <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  // fallback initials
  return (
    <div
      className={`w-11 h-11 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-white font-bold`}
    >
      {initials}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function MarqueeCard({ item, i }) {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mx-3">
      <QuoteIcon className="w-6 h-6 text-[rgb(var(--color-brand))]/30 mb-3" />

      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
        {item.text}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* ✅ UPDATED */}
          <Avatar name={item.name} image={item.image} />

          <div>
            <p className="text-sm font-bold">{item.name}</p>
            <p className="text-xs text-gray-400">{item.role}</p>
          </div>
        </div>

        <Stars count={item.stars} />
      </div>
    </div>
  );
}

// ─── SINGLE MARQUEE ROW ───────────────────────────────────────────────────────
function MarqueeRow({ items }) {
  const looped = [...items, ...items];

  return (
    <div className="overflow-hidden w-full">
      <div className="flex animate-marquee">
        {looped.map((item, i) => (
          <MarqueeCard key={`${item.name}-${i}`} item={item} i={i} />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const items = t.raw("items");

  return (
    <section className="py-20 bg-[#fdf8f5] overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black">What Our Clients Say</h2>
      </div>

      {/* ONE LINE ONLY */}
      <MarqueeRow items={items} />
    </section>
  );
}
