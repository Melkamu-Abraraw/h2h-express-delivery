"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Truck, Shield, CheckCircle, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DeliveryProcess() {
  const t = useTranslations("Service");

  const steps = [
    {
      id: 1,
      image: "/images/steps/step_1.png",
      title: t("steps.step1.title"),
      desc: t("steps.step1.desc"),
      points: [t("steps.step1.points.0"), t("steps.step1.points.1")],
      icon: ShoppingCart,
    },
    {
      id: 2,
      image: "/images/steps/step_2.png",
      title: t("steps.step2.title"),
      desc: t("steps.step2.desc"),
      points: [t("steps.step2.points.0"), t("steps.step2.points.1")],
      icon: Truck,
    },
    {
      id: 3,
      image: "/images/steps/step_3.png",
      title: t("steps.step3.title"),
      desc: t("steps.step3.desc"),
      points: [t("steps.step3.points.0"), t("steps.step3.points.1")],
      icon: Shield,
    },
    {
      id: 4,
      image: "/images/steps/step_4.png",
      title: t("steps.step4.title"),
      desc: t("steps.step4.desc"),
      points: [t("steps.step4.points.0"), t("steps.step4.points.1")],
      icon: CheckCircle,
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev === steps.length ? 1 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-20 bg-[#f4f6fb]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="bg-yellow-400 px-4 py-1 rounded-full text-sm font-semibold">
            {t("label")}
          </span>

          <h2 className="text-4xl font-bold mt-4">{t("title")}</h2>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-10 items-center lg:grid-cols-2">
          <div className="relative order-2 lg:order-1 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={steps[currentStep - 1].image}
              alt="delivery"
              width={600}
              height={600}
              className="object-cover w-full h-[360px] md:h-[500px] lg:h-[800px]"
            />

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-semibold">
                {steps[currentStep - 1].title}
              </h3>

              <p className="text-sm text-gray-200 mt-2">
                {steps[currentStep - 1].desc}
              </p>

              <div className="flex gap-2 mt-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`h-1 w-8 rounded-full ${
                      currentStep === step.id ? "bg-yellow-400" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute left-5 top-0 h-[75%] w-[2px] bg-gray-200" />

            <div className="space-y-8">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-6 cursor-pointer"
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div
                    className={`z-10 w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                      currentStep === step.id
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.id.toString().padStart(2, "0")}
                  </div>

                  <Card
                    className={`w-full shadow-md rounded-xl transition ${
                      currentStep === step.id ? "border-yellow-400" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <step.icon className="w-6 h-6 text-yellow-500" />
                        <h4 className="font-semibold text-lg">{step.title}</h4>
                      </div>

                      <p className="text-gray-500 text-sm mt-1">{step.desc}</p>

                      <ul className="mt-3 space-y-1">
                        {step.points.map((p, i) => (
                          <li key={i} className="text-sm text-gray-600">
                            ✔ {p}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-20">
            <div className="flex items-start md:items-center gap-4">
              <Rocket className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold">
                  {t("cta.title")}
                </h3>
                <p className="text-sm md:text-base text-gray-500">
                  {t("cta.description")}
                </p>
              </div>
            </div>
            <button className="bg-yellow-400 text-black px-4 py-2 text-sm md:px-6 md:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
              {t("cta.button")}
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
