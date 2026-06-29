"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/shared/AnimatedSection";
import { products } from "@/data/products";
import { CLI_TOOLS } from "@/lib/constants";
import { GraduationCap, ArrowRight, Terminal, BookOpen, ChevronRight } from "lucide-react";

const levels = ["pathBeginner", "pathIntermediate", "pathAdvanced", "pathPro"] as const;

export default function AcademyPage() {
  const t = useTranslations("academy");
  const courses = products.filter((p) => p.category === "course");

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 text-sm font-medium text-secondary mb-6">
            <GraduationCap className="w-4 h-4" />
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-3xl mx-auto">{t("subtitle")}</p>
        </AnimatedSection>

        {/* Learning path */}
        <AnimatedSection className="mb-16">
          <h2 className="text-2xl font-black text-center mb-8">{t("pathTitle")}</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
            {levels.map((level, i) => (
              <div key={level} className="flex items-center">
                <span className={`px-5 py-2.5 rounded-full text-sm font-bold ${
                  i === 0
                    ? "bg-primary text-black"
                    : "bg-surface dark:bg-[#111111] text-muted dark:text-muted-dark border border-border dark:border-border-dark"
                }`}>
                  {t(level)}
                </span>
                {i < levels.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted mx-1 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Courses grid */}
        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {courses.map((course) => (
            <AnimatedItem key={course.id}>
              <div className="card-hover rounded-2xl p-6 bg-white dark:bg-[#111111] border border-border dark:border-border-dark">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{course.nameKey}</h3>
                    <p className="text-sm text-muted dark:text-muted-dark mb-3">{course.descriptionKey}</p>
                    <p className="font-bold text-primary">
                      {course.priceXOF?.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* CLI/IDE Tools section */}
        <AnimatedSection className="mb-16">
          <div className="rounded-2xl bg-surface dark:bg-[#111111] border border-border dark:border-border-dark p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-black">{t("cliTools")}</h2>
            </div>
            <p className="text-muted dark:text-muted-dark mb-8 max-w-2xl">{t("cliDescription")}</p>
            <div className="flex flex-wrap gap-3">
              {CLI_TOOLS.map((tool) => (
                <span key={tool.name} className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 text-sm font-medium">
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="text-center">
          <Link
            href="/boutique"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-black rounded-xl font-bold text-lg hover:bg-primary-dark transition-all"
            id="academy-cta"
          >
            {t("ctaCourses")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}
