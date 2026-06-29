"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { motion } from "framer-motion";
import { DoorOpen, Brain, CheckCircle2 } from "lucide-react";

const steps = ["step1", "step2", "step3", "step4", "step5"] as const;

export function SequenceSection() {
  const t = useTranslations("sequence");

  return (
    <section className="section-padding bg-surface dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-white overflow-hidden">
      <div className="container-wide mx-auto">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm font-medium text-primary mb-6">
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted dark:text-white/50 max-w-3xl mx-auto leading-relaxed mb-6">
            {t("subtitle")}
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary tracking-wider">
              {t("sameBrain")}
            </span>
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative">
          {/* Central line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-primary/10 md:transform md:-translate-x-px" />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, i) => {
              const isActive = step === "step1";
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft
                      ? "md:flex-row"
                      : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-10">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        isActive
                          ? "bg-primary border-primary animate-pulse-glow"
                          : "bg-white dark:bg-[#1A1A1A] border-[#0A0A0A]/20 dark:border-white/20"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}
                  >
                    <div
                      className={`p-5 md:p-6 rounded-2xl border ${
                        isActive
                          ? "bg-primary/5 border-primary/30"
                          : "bg-white/80 dark:bg-white/[0.03] border-border dark:border-white/[0.06]"
                      }`}
                    >
                      {/* Step header */}
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">
                          {t(`steps.${step}.horizon`)}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            {t(`steps.${step}.status`)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-1">
                        {t(`steps.${step}.title`)}
                        <span className="text-primary ml-2 text-base font-medium">
                          ({t(`steps.${step}.entity`)})
                        </span>
                      </h3>

                      <p className="text-sm text-muted dark:text-white/50 mb-4 leading-relaxed">
                        {t(`steps.${step}.description`)}
                      </p>

                      {/* Gate */}
                      <div className={`flex items-start gap-2 text-sm text-muted dark:text-white/40 ${isLeft ? "md:justify-end" : ""}`}>
                        <DoorOpen className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
                        <span>🚪 {t(`steps.${step}.gate`)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
