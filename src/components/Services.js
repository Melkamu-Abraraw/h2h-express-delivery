"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const t = useTranslations("Services");
  const t1 = useTranslations("about-us");

  // Reusable animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="max-w-6xl mx-auto py-16 px-6 md:px-12">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h1 className="text-2xl md:text-5xl font-extrabold">
          {t("heading")} <br /> {t("highlight")}
        </h1>
      </motion.div>

      {/* Express */}
      <div className="grid md:grid-cols-2 gap-14 items-center mb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeLeft}
        >
          <h2 className="text-xl font-bold mb-3">{t("express.title")}</h2>
          <p className="text-gray-600 leading-relaxed max-w-lg">
            {t("express.description")}
          </p>
        </motion.div>

        <motion.div
          className="flex justify-start md:justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeRight}
        >
          <img src="/images/van_3.png" className="w-full max-w-full h-auto" />
        </motion.div>
      </div>

      {/* Same Day */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <motion.div
          className="flex justify-start md:justify-center order-2 md:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeLeft}
        >
          <img
            src="/images/service_step_2.jpg"
            className="w-full max-w-full h-auto"
          />
        </motion.div>

        <motion.div
          className="order-1 md:order-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeRight}
        >
          <h2 className="text-xl font-bold mb-3">{t("sameDay.title")}</h2>
          <p className="text-gray-600 leading-relaxed max-w-lg">
            {t("sameDay.description")}
          </p>
        </motion.div>
      </div>

      {/* Next Day */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeLeft}
        >
          <h2 className="text-xl font-bold mb-3">{t("nextDay.title")}</h2>
          <p className="text-gray-600 leading-relaxed max-w-lg">
            {t("nextDay.description")}
          </p>
        </motion.div>

        <motion.div
          className="flex justify-start md:justify-center order-2 md:order-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeRight}
        >
          <img
            src="/images/service_step_4.jpg"
            className="w-full max-w-full h-auto"
          />
        </motion.div>
      </div>

      {/* Additional */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          className="flex justify-start md:justify-center order-2 md:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeLeft}
        >
          <img
            src="/images/service_step_final.jpg"
            className="w-full max-w-full h-auto"
          />
        </motion.div>

        <motion.div
          className="order-1 md:order-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeRight}
        >
          <h2 className="text-xl font-bold mb-3">{t("additional.title")}</h2>
          <p className="text-gray-600 leading-relaxed max-w-lg">
            {t("additional.description")}
          </p>
        </motion.div>
      </div>
      <section className="bg-white px-5 py-20">
        <div className="max-w-4xl mx-auto rounded-3xl border border-yellow-200 bg-yellow-50/40 p-12 md:p-16 text-center">
          <h2
            className="font-black text-gray-900 mb-4"
            style={{
              fontSize: "clamp(1.8rem,4vw,3rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {t1("cta.heading")}
          </h2>

          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-10">
            {t1("cta.text")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="brand-bg text-white font-bold text-sm px-8 py-4 rounded-xl hover:scale-105 transition-all">
              {t1("cta.primary")}
            </button>

            <button className="text-gray-700 font-bold text-sm px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-yellow-300 transition-all">
              {t1("cta.secondary")}
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
