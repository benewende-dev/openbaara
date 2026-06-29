"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { LINKS } from "@/lib/constants";
import { CheckCircle2, ArrowUpRight } from "lucide-react";

export function OutioSpotlight() {
  const t = useTranslations("outioSpotlight");
  const features = t.raw("features") as string[];

  return (
    <section className="section-padding">
      <div className="container-wide mx-auto">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl border border-border dark:border-border-dark bg-surface dark:bg-[#111111] p-8 md:p-12 lg:p-16">
            {/* Subtle brand glow */}
            <div
              className="glow-orb -top-24 -right-10 w-80 h-80"
              style={{ background: "radial-gradient(circle, rgba(0,217,90,0.16), transparent 70%)" }}
            />

            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Copy */}
              <div>
                <span className="kicker text-primary">{t("kicker")}</span>
                <p className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
                  {t("name")}
                </p>
                <h2 className="mt-2 font-display text-xl md:text-2xl font-semibold tracking-tight text-muted dark:text-muted-dark">
                  {t("title")}
                </h2>
                <p className="mt-5 leading-relaxed text-muted dark:text-muted-dark max-w-xl">
                  {t("description")}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={LINKS.outio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group btn-glow inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-black rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                    id="outio-spotlight-cta"
                  >
                    {t("cta")}
                    <ArrowUpRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <span className="text-xs text-muted dark:text-muted-dark">{t("note")}</span>
                </div>
              </div>

              {/* Feature checklist */}
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-border dark:border-border-dark bg-surface-elevated dark:bg-[#0A0A0A] p-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
