"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/shared/AnimatedSection";
import {
  TrendingUp,
  Rocket,
  Layers,
  Target,
  Calendar,
  Mail,
  CheckCircle2,
  BarChart3,
  Gauge,
  Network,
  CreditCard,
  ShieldCheck,
  Boxes,
  Zap,
  Palette,
  Building2,
  FlaskConical,
  FileText,
} from "lucide-react";

const highlights = [
  { key: "product", Icon: Rocket },
  { key: "platform", Icon: Layers },
  { key: "sequence", Icon: Target },
  { key: "opportunity", Icon: TrendingUp },
] as const;

const matrixIcons = [Zap, Palette, Building2, FlaskConical] as const;
const moatIcons = [Gauge, Network, CreditCard, ShieldCheck, Boxes] as const;

type MarketItem = { value: string; label: string; source: string };
type MatrixRow = { tool: string; market: string; detail: string };
type MoatItem = { title: string; description: string };

const DOSSIER_MAILTO =
  "mailto:contact@openbaara.com?subject=Dossier%20investisseur%20OpenBaara";

export default function InvestorsPage() {
  const t = useTranslations("investors");

  const markets = t.raw("markets.items") as MarketItem[];
  const matrixRows = t.raw("matrix.rows") as MatrixRow[];
  const moat = t.raw("moat.items") as MoatItem[];

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
              <div className="card-hover rounded-2xl p-6 bg-white dark:bg-[#111111] border border-border dark:border-border-dark text-center h-full">
                <div className="p-3 rounded-xl bg-primary/10 text-primary mx-auto w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm">{t(`highlights.${key}`)}</p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* Thesis */}
        <AnimatedSection className="mb-16">
          <div className="rounded-2xl bg-surface dark:bg-[#111111] border border-border dark:border-border-dark p-8 md:p-12">
            <span className="kicker text-primary">{t("thesis.kicker")}</span>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              {t("thesis.title")}
            </h2>
            <p className="text-muted dark:text-muted-dark leading-relaxed max-w-3xl mb-6">
              {t("thesis.body")}
            </p>
            <blockquote className="border-l-2 border-primary pl-4 font-display text-lg md:text-xl font-medium">
              {t("thesis.quote")}
            </blockquote>
          </div>
        </AnimatedSection>

        {/* Markets */}
        <AnimatedSection className="mb-16">
          <div className="text-center mb-8">
            <span className="kicker text-primary">{t("markets.kicker")}</span>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight">
              {t("markets.title")}
            </h2>
          </div>
          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {markets.map((m, i) => (
              <AnimatedItem key={i}>
                <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-[#111111] border border-border dark:border-border-dark h-full">
                  <div className="font-display text-3xl md:text-4xl font-bold gradient-text mb-3">
                    {m.value}
                  </div>
                  <p className="text-sm leading-relaxed mb-3">{m.label}</p>
                  <p className="text-xs text-muted dark:text-muted-dark">{m.source}</p>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
          <p className="text-xs text-muted/60 dark:text-muted-dark/60 text-center mt-4">
            {t("markets.note")}
          </p>
        </AnimatedSection>

        {/* Tools × Markets matrix */}
        <AnimatedSection className="mb-16">
          <div className="text-center mb-8">
            <span className="kicker text-primary">{t("matrix.kicker")}</span>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight">
              {t("matrix.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matrixRows.map((r, i) => {
              const Icon = matrixIcons[i] ?? Zap;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl p-6 bg-white dark:bg-[#111111] border border-border dark:border-border-dark"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{r.tool}</h3>
                    <p className="text-sm text-primary font-medium">{r.market}</p>
                    <p className="text-sm text-muted dark:text-muted-dark mt-1">{r.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Moat */}
        <AnimatedSection className="mb-16">
          <div className="text-center mb-8">
            <span className="kicker text-primary">{t("moat.kicker")}</span>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight">
              {t("moat.title")}
            </h2>
          </div>
          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moat.map((m, i) => {
              const Icon = moatIcons[i] ?? Gauge;
              return (
                <AnimatedItem key={i}>
                  <div className="card-hover rounded-2xl p-6 bg-white dark:bg-[#111111] border border-border dark:border-border-dark h-full">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">{m.title}</h3>
                    <p className="text-sm text-muted dark:text-muted-dark leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </AnimatedItem>
              );
            })}
          </AnimatedStagger>
        </AnimatedSection>

        {/* Sovereignty */}
        <AnimatedSection className="mb-16">
          <div className="rounded-2xl bg-surface dark:bg-[#111111] border border-border dark:border-border-dark p-8 md:p-12 text-center">
            <span className="kicker text-primary">{t("sovereignty.kicker")}</span>
            <blockquote className="mt-4 font-display text-2xl md:text-3xl font-bold tracking-tight max-w-3xl mx-auto">
              {t("sovereignty.quote")}
            </blockquote>
            <p className="mt-5 text-muted dark:text-muted-dark max-w-2xl mx-auto leading-relaxed">
              {t("sovereignty.body")}
            </p>
          </div>
        </AnimatedSection>

        {/* The Ask */}
        <AnimatedSection className="mb-16">
          <div className="rounded-2xl bg-surface dark:bg-[#111111] border border-border dark:border-border-dark p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-4">L&apos;opportunité</h2>
            <p className="text-muted dark:text-muted-dark max-w-2xl mx-auto leading-relaxed mb-8">{t("ask")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-2 px-8 py-3.5 bg-primary text-black rounded-xl font-bold hover:bg-primary-dark transition-colors"
                id="investors-book-call"
              >
                <Calendar className="w-5 h-5" />
                {t("ctaBookCall")}
              </Link>
              <a
                href="mailto:contact@openbaara.com"
                className="flex items-center gap-2 px-8 py-3.5 border border-border dark:border-white/20 text-[#000000] dark:text-white rounded-xl font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Mail className="w-5 h-5" />
                {t("ctaEmail")}
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* Dossier */}
        <AnimatedSection className="mb-16">
          <div className="rounded-2xl border border-border dark:border-border-dark p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-1">{t("dossier.title")}</h2>
              <p className="text-sm text-muted dark:text-muted-dark max-w-xl">{t("dossier.body")}</p>
            </div>
            <a
              href={DOSSIER_MAILTO}
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-black rounded-xl font-bold hover:bg-primary-dark transition-colors"
              id="investors-request-dossier"
            >
              <FileText className="w-5 h-5" />
              {t("dossier.cta")}
            </a>
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
