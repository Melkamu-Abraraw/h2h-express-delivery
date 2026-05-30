"use client";

import { useTranslations } from "next-intl";

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS_KEYS = [
  { value: "10K+", key: "deliveries" },
  { value: "50+", key: "cities" },
  { value: "98%", key: "ontime" },
  { value: "6+", key: "years" },
];

export default function AboutUs() {
  const t = useTranslations("about-us");

  const values = [
    {
      icon: "⚡",
      title: t("values.items.0.title"),
      desc: t("values.items.0.desc"),
    },
    {
      icon: "🔒",
      title: t("values.items.1.title"),
      desc: t("values.items.1.desc"),
    },
    {
      icon: "🤝",
      title: t("values.items.2.title"),
      desc: t("values.items.2.desc"),
    },
    {
      icon: "📍",
      title: t("values.items.3.title"),
      desc: t("values.items.3.desc"),
    },
  ];

  const members = [
    {
      name: t("team.members.0.name"),
      role: t("team.members.0.role"),
      bio: t("team.members.0.bio"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: t("team.members.1.name"),
      role: t("team.members.1.role"),
      bio: t("team.members.1.bio"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: t("team.members.2.name"),
      role: t("team.members.2.role"),
      bio: t("team.members.2.bio"),
      image: "/images/muste-brand.jpg",
    },
    {
      name: t("team.members.3.name"),
      role: t("team.members.3.role"),
      bio: t("team.members.3.bio"),
      image: "/images/muste-brand.jpg",
    },
  ];

  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}
    >
      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --color-brand: 249 192 60;
        }

        .brand-bg {
          background-color: rgb(var(--color-brand));
        }

        .brand-text {
          color: rgb(var(--color-brand));
        }

        .hero-dots {
          background-color: #fff;
          background-image: radial-gradient(
            rgba(249,192,60,0.15) 1.5px,
            transparent 1.5px
          );
          background-size: 28px 28px;
        }

        .h2h-card {
          border: 1.5px solid #efefef;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .h2h-card:hover {
          transform: translateY(-5px);
          border-color: rgb(var(--color-brand));
          box-shadow: 0 18px 44px rgba(249,192,60,0.16);
        }

        .stat-num {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1;
          color: rgb(var(--color-brand));
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgb(var(--color-brand));
          margin-bottom: 10px;
        }

        .section-label::before {
          content: '';
          width: 22px;
          height: 2px;
          border-radius: 999px;
          background: rgb(var(--color-brand));
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-up {
          animation: fadeUp 0.7s ease both;
        }
      `}</style>

      {/* HERO */}
      <section
        className="relative w-full min-h-px py-28 bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          backgroundImage: "url('/images/about_us_banner.png')",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* content container */}
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-5">
            <h1
              className="fade-up font-black leading-none mb-6 max-w-3xl text-white"
              style={{
                fontSize: "clamp(2rem,6vw,4.5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              <span className="block">{t("hero.title_line1")}</span>

              <span className="block brand-text">{t("hero.title_line2")}</span>
            </h1>

            <p className="fade-up text-gray-200 text-lg md:text-xl max-w-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>
      {/* STATS */}
      <section className="bg-white px-5 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS_KEYS.map(({ value, key }) => (
            <div
              key={key}
              className="h2h-card rounded-2xl px-6 py-8 text-center bg-white"
            >
              <div className="stat-num mb-1">{value}</div>

              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                {t(`stats.${key}`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-gray-50 px-5 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="h2h-card rounded-3xl p-8 bg-white relative overflow-hidden">
            <div className="text-3xl mb-5">🎯</div>

            <div className="section-label">{t("mission.label")}</div>

            <p className="text-gray-600 leading-relaxed text-[15px]">
              {t("mission.text")}
            </p>
          </div>

          <div className="h2h-card rounded-3xl p-8 bg-white relative overflow-hidden">
            <div className="text-3xl mb-5">🌍</div>

            <div className="section-label">{t("vision.label")}</div>

            <p className="text-gray-600 leading-relaxed text-[15px]">
              {t("vision.text")}
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white px-5 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label mx-auto justify-center">
              {t("values.label")}
            </div>

            <h2
              className="font-black text-gray-900"
              style={{
                fontSize: "clamp(2rem,5vw,3.2rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {t("values.heading")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div key={i} className="h2h-card rounded-2xl p-6 bg-white">
                <div className="text-3xl mb-4">{v.icon}</div>

                <h3 className="font-bold text-gray-900 text-base mb-2">
                  {v.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-[32px] p-8 md:p-14 shadow-sm border border-gray-100">
            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-10 h-[2px] bg-yellow-500"></span>

                <span className="uppercase tracking-[0.2em] text-sm font-bold text-yellow-500">
                  {t("our_story.label")}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                {t("our_story.title")}
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                {t("our_story.paragraph1")}
              </p>

              <p className="text-gray-600 text-lg leading-relaxed">
                {t("our_story.paragraph2")}
              </p>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="absolute -inset-4 bg-yellow-400/20 rounded-[30px] blur-2xl"></div>

              <img
                src="/images/h2h2.jpg"
                alt="Company Story"
                className="relative w-full h-[600px] object-cover rounded-[28px]"
              />
            </div>
          </div>
        </div>
      </section>
      {/* TEAM */}
      <section className="bg-gray-50 px-5 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label mx-auto justify-center">
              {t("team.label")}
            </div>

            <h2
              className="font-black text-gray-900 mb-3"
              style={{
                fontSize: "clamp(2rem,5vw,3.2rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {t("team.heading")}
            </h2>

            <p className="text-gray-400 text-base max-w-xl mx-auto">
              {t("team.subheading")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {members.map((m, i) => (
              <div
                key={i}
                className="h2h-card rounded-2xl p-6 bg-white flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="font-bold text-gray-900 text-base">
                    {m.name}
                  </div>

                  <div className="brand-text text-xs font-bold mb-1 uppercase tracking-wide">
                    {m.role}
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-5 py-20">
        <div className="max-w-4xl mx-auto rounded-3xl border border-yellow-200 bg-yellow-50/40 p-12 md:p-16 text-center">
          <h2
            className="font-black text-gray-900 mb-4"
            style={{
              fontSize: "clamp(1.8rem,4vw,3rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {t("cta.heading")}
          </h2>

          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-10">
            {t("cta.text")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="brand-bg text-white font-bold text-sm px-8 py-4 rounded-xl hover:scale-105 transition-all">
              {t("cta.primary")}
            </button>

            <button className="text-gray-700 font-bold text-sm px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-yellow-300 transition-all">
              {t("cta.secondary")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
