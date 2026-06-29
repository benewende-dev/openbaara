"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/shared/AnimatedSection";
import { TECH_STACK } from "@/lib/constants";
import { User, MapPin, Quote } from "lucide-react";

const stackCategories = Object.keys(TECH_STACK) as (keyof typeof TECH_STACK)[];

export default function AboutPage() {
  const t = useTranslations("founder");
  const tStack = useTranslations("techStack");

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Founder section */}
        <AnimatedSection className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Photo placeholder */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 aspect-[3/4] flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-xl font-black mb-1">{t("name")}</h2>
                <p className="text-primary font-semibold mb-3">{t("role")}</p>
                <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark">
                  <MapPin className="w-4 h-4" />
                  <span>{t("location")}</span>
                </div>
                <p className="text-xs text-muted dark:text-muted-dark mt-1">{t("origin")}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
                {t("name")}
              </h1>
              <p className="text-primary font-semibold text-lg mb-6">{t("role")}</p>
              
              <div className="text-muted dark:text-muted-dark leading-relaxed space-y-4 mb-8 whitespace-pre-line">
                {t("longBio")}
              </div>

              {/* Quote */}
              <div className="relative rounded-2xl bg-primary/5 border border-primary/20 p-6 md:p-8">
                <Quote className="w-8 h-8 text-primary/30 absolute top-4 left-4" />
                <blockquote className="pl-8 text-lg font-medium italic leading-relaxed">
                  &ldquo;{t("quote")}&rdquo;
                </blockquote>
                <p className="mt-4 pl-8 text-sm font-bold text-primary">
                  — {t("name")}
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Tech stack */}
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">Stack & Compétences</h2>
          <div className="space-y-8">
            {stackCategories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted dark:text-muted-dark mb-3">
                  {tStack(category)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TECH_STACK[category].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-surface dark:bg-[#1A1A1A] border border-border dark:border-border-dark text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
