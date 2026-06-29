"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/shared/AnimatedSection";
import { TrendingUp, Rocket, Layers, Target, Calendar, Mail, CheckCircle2, BarChart3 } from "lucide-react";

const highlights = [
  { key: "product", Icon: Rocket },
  { key: "platform", Icon: Layers },
  { key: "sequence", Icon: Target },
  { key: "opportunity", Icon: TrendingUp },
] as const;

export default function InvestorsPage() {
  const t = useTranslations("investors");

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            <TrendingUp className="w-4 h-4" />
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-3xl mx-auto mb-6">{t("subtitle")}</p>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary font-bold animate-pulse-glow">
            <CheckCircle2 className="w-5 h-5" />
            {t("status")}: {t("statusDescription")}
          </span>
        </AnimatedSection>

        {/* Highlights */}
        <AnimatedStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map(({ key, Icon }) => (
            <AnimatedItem key={key}>
              <div className="card-hover rounded-2xl p-6 bg-white dark:bg-[#141414] border border-border dark:border-border-dark text-center h-full">
                <div className="p-3 rounded-xl bg-primary/10 text-primary mx-auto w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm">{t(`highlights.${key}`)}</p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* The Ask */}
        <AnimatedSection className="mb-16">
          <div className="rounded-2xl bg-[#0A0A0A] text-white p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-4">L&apos;opportunité</h2>
            <p className="text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">{t("ask")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
                id="investors-book-call"
              >
                <Calendar className="w-5 h-5" />
                {t("ctaBookCall")}
              </Link>
              <a
                href="mailto:contact@openbaara.com"
                className="flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white rounded-xl font-bold hover:bg-white/5 transition-colors"
              >
                <Mail className="w-5 h-5" />
                {t("ctaEmail")}
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* Traction placeholder */}
        <AnimatedSection>
          <div className="rounded-2xl border-2 border-dashed border-border dark:border-border-dark p-8 md:p-12 text-center">
            <BarChart3 className="w-12 h-12 text-muted/30 dark:text-muted-dark/30 mx-auto mb-4" />
            <p className="text-muted dark:text-muted-dark font-medium">{t("tractionPlaceholder")}</p>
            <p className="text-xs text-muted/50 dark:text-muted-dark/50 mt-2">({t("marketNote")})</p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
