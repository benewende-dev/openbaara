"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/shared/AnimatedSection";
import { FlaskConical, Eye, Box, Bot, Cpu, Car, Code2, Database } from "lucide-react";

const areas = [
  { key: "vision", Icon: Eye },
  { key: "scanning", Icon: Box },
  { key: "robotics", Icon: Bot },
  { key: "edge", Icon: Cpu },
  { key: "mobility", Icon: Car },
] as const;

export default function BaaraliLabsPage() {
  const t = useTranslations("labs");

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            <FlaskConical className="w-4 h-4" />
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-3xl mx-auto mb-6">{t("subtitle")}</p>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
            {t("status")}
          </span>
        </AnimatedSection>

        {/* Research areas */}
        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {areas.map(({ key, Icon }) => (
            <AnimatedItem key={key}>
              <div className="card-hover rounded-2xl p-6 bg-white dark:bg-[#111111] border border-border dark:border-border-dark h-full">
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t(`areas.${key}.title`)}</h3>
                <p className="text-sm text-muted dark:text-muted-dark leading-relaxed">
                  {t(`areas.${key}.description`)}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* Foundations & moat */}
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8 bg-surface dark:bg-[#111111] border border-border dark:border-border-dark">
              <Code2 className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">{t("foundations")}</h3>
              <p className="text-muted dark:text-muted-dark leading-relaxed">{t("foundationsList")}</p>
            </div>
            <div className="rounded-2xl p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <Database className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">{t("moat")}</h3>
              <p className="text-muted dark:text-muted-dark leading-relaxed">{t("moatDescription")}</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
