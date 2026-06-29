"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedItem,
} from "@/components/shared/AnimatedSection";
import {
  Zap,
  GraduationCap,
  Building2,
  Wrench,
  FlaskConical,
  ArrowRight,
} from "lucide-react";

const divisions = [
  {
    key: "outio",
    Icon: Zap,
    href: "#",
    external: true,
    gradient: "from-orange-500 to-amber-400",
  },
  {
    key: "academy",
    Icon: GraduationCap,
    href: "/academy",
    external: false,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    key: "solutions",
    Icon: Building2,
    href: "/solutions",
    external: false,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    key: "studio",
    Icon: Wrench,
    href: "/boutique",
    external: false,
    gradient: "from-purple-500 to-violet-400",
  },
  {
    key: "labs",
    Icon: FlaskConical,
    href: "/baarali-labs",
    external: false,
    gradient: "from-rose-500 to-pink-400",
  },
] as const;

export function DivisionsSection() {
  const t = useTranslations("divisions");

  return (
    <section className="section-padding">
      <div className="container-wide mx-auto">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 text-sm font-medium text-secondary mb-6">
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted dark:text-muted-dark max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisions.map(({ key, Icon, href, external, gradient }) => (
            <AnimatedItem key={key} className={key === "outio" ? "md:col-span-2 lg:col-span-1" : ""}>
              <div className="card-hover group relative rounded-2xl p-6 md:p-8 bg-white dark:bg-[#141414] border border-border dark:border-border-dark h-full flex flex-col">
                {/* Status badge */}
                <span className="absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {t(`${key}.status`)}
                </span>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-1">{t(`${key}.name`)}</h3>
                <p className="text-sm text-primary font-medium mb-3">
                  {t(`${key}.tagline`)}
                </p>
                <p className="text-sm text-muted dark:text-muted-dark leading-relaxed flex-1">
                  {t(`${key}.description`)}
                </p>

                {/* CTA */}
                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    id={`div-cta-${key}`}
                  >
                    {t(`${key}.cta`)}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <Link
                    href={href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    id={`div-cta-${key}`}
                  >
                    {t(`${key}.cta`)}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
