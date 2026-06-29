"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ArrowRight, Users } from "lucide-react";

export function CTARecruitSection() {
  const t = useTranslations("ctaRecruit");

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-bg opacity-5" />

      <div className="relative container-wide mx-auto text-center">
        <AnimatedSection>
          <Users className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted dark:text-muted-dark max-w-2xl mx-auto leading-relaxed mb-8">
            {t("subtitle")}
          </p>
          <Link
            href="/carrieres"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/20"
            id="cta-recruit-positions"
          >
            {t("cta")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
