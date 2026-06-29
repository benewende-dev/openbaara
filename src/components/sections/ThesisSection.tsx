"use client";

import { useTranslations } from "next-intl";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedItem,
} from "@/components/shared/AnimatedSection";
import { AlertTriangle, MapPin, Code2, Workflow } from "lucide-react";

const items = [
  { key: "void", Icon: AlertTriangle },
  { key: "anchor", Icon: MapPin },
  { key: "opensource", Icon: Code2 },
  { key: "execution", Icon: Workflow },
] as const;

export function ThesisSection() {
  const t = useTranslations("thesis");

  return (
    <section className="section-padding bg-surface dark:bg-surface-dark">
      <div className="container-wide mx-auto">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted dark:text-muted-dark max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(({ key, Icon }) => (
            <AnimatedItem key={key}>
              <div className="card-hover gradient-border rounded-2xl p-6 md:p-8 bg-white dark:bg-[#141414] border border-border dark:border-border-dark">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {t(`${key}.title`)}
                    </h3>
                    <p className="text-muted dark:text-muted-dark leading-relaxed">
                      {t(`${key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
