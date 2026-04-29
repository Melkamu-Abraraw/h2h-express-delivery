"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const t = useTranslations("Services");

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
        <h1 className="text-4xl md:text-5xl font-extrabold">
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
          className="flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeRight}
        >
          <img src="/images/service_1.png" className="max-w-xl" />
        </motion.div>
      </div>

      {/* Same Day */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <motion.div
          className="flex justify-center md:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeLeft}
        >
          <img src="/images/service_2.png" className="max-w-xl" />
        </motion.div>

        <motion.div
          className="md:order-2"
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
          className="flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeRight}
        >
          <img src="/images/service_3.png" className="max-w-xl" />
        </motion.div>
      </div>

      {/* Additional */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          className="flex justify-center md:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeLeft}
        >
          <img src="/images/service_4.png" className="max-w-xl" />
        </motion.div>

        <motion.div
          className="md:order-2"
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
    </section>
  );
}
