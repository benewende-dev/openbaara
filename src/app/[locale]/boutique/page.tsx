"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useCart } from "@/features/store/CartContext";
import { products, pickLocale, type ProductCategory } from "@/data/products";
import { formatXOF, formatUSD } from "@/lib/utils";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  Search,
  ShoppingCart,
  ArrowRight,
  Phone,
  Sparkles,
  Clock,
  Star,
  GraduationCap,
  Wrench,
  Briefcase,
  BarChart3,
  PlayCircle,
} from "lucide-react";

const categoryIcons: Record<ProductCategory, typeof GraduationCap> = {
  course: GraduationCap,
  tool: Wrench,
  service: Briefcase,
};

export default function StorePage() {
  const t = useTranslations("store");
  const locale = useLocale();
  const { addItem } = useCart();
  const [filter, setFilter] = useState<ProductCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchCategory = filter === "all" || p.category === filter;
    const q = search.toLowerCase();
    const matchSearch =
      search === "" ||
      pickLocale(p.name, locale).toLowerCase().includes(q) ||
      pickLocale(p.description, locale).toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const badgeMap: Record<string, { label: string; color: string; Icon: typeof Star }> = {
    new: { label: t("new"), color: "bg-secondary/10 text-secondary", Icon: Sparkles },
    popular: { label: t("popular"), color: "bg-primary/10 text-primary", Icon: Star },
    "coming-soon": { label: t("comingSoon"), color: "bg-muted/10 text-muted", Icon: Clock },
  };

  const filters = [
    { key: "all" as const, label: t("filterAll") },
    { key: "course" as const, label: t("filterCourses") },
    { key: "tool" as const, label: t("filterTools") },
    { key: "service" as const, label: t("filterServices") },
  ];

  const categoryLabels: Record<ProductCategory, string> = {
    course: t("catCourse"),
    tool: t("catTool"),
    service: t("catService"),
  };

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Filters & search */}
        <AnimatedSection delay={0.1} className="mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f.key
                      ? "bg-primary text-black"
                      : "bg-surface dark:bg-[#111111] text-muted dark:text-muted-dark hover:bg-primary/10 hover:text-primary"
                  }`}
                  id={`store-filter-${f.key}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="store-search"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted dark:text-muted-dark py-20">
            {t("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, index) => {
              const CatIcon = categoryIcons[product.category];
              const badge = product.badge ? badgeMap[product.badge] : null;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(index * 0.04, 0.4) }}
                  className="h-full"
                >
                  <div className="card-hover group rounded-2xl bg-white dark:bg-[#111111] border border-border dark:border-border-dark p-6 flex flex-col h-full">
                    {/* Top row: category + badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
                        <CatIcon className="w-4 h-4" />
                        <span className="uppercase tracking-wider font-medium">
                          {categoryLabels[product.category]}
                        </span>
                      </div>
                      {badge && (
                        <span
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}
                        >
                          <badge.Icon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      )}
                    </div>

                    {/* Product info */}
                    <h3 className="text-lg font-bold mb-2">{pickLocale(product.name, locale)}</h3>
                    <p className="text-sm text-muted dark:text-muted-dark leading-relaxed flex-1 mb-4">
                      {pickLocale(product.description, locale)}
                    </p>

                    {/* Course meta: level · duration · lessons */}
                    {(product.level || product.duration || product.lessons) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-muted dark:text-muted-dark">
                        {product.level && (
                          <span className="inline-flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5 text-primary" />
                            {pickLocale(product.level, locale)}
                          </span>
                        )}
                        {product.duration && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {pickLocale(product.duration, locale)}
                          </span>
                        )}
                        {product.lessons && (
                          <span className="inline-flex items-center gap-1">
                            <PlayCircle className="w-3.5 h-3.5 text-primary" />
                            {product.lessons} {t("lessonsLabel")}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tools covered */}
                    {product.tools && product.tools.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[11px] uppercase tracking-wider font-medium text-muted dark:text-muted-dark mb-1.5">
                          {t("toolsLabel")}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {product.priceXOF !== null ? (
                        <div>
                          <span className="text-2xl font-black text-primary">
                            {formatXOF(product.priceXOF)}
                          </span>
                          {product.isMonthly && (
                            <span className="text-sm text-muted dark:text-muted-dark">
                              {t("perMonth")}
                            </span>
                          )}
                          <p className="text-sm text-muted dark:text-muted-dark">
                            {formatUSD(product.priceUSD!)}
                            {product.isMonthly && t("perMonth")}
                          </p>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-muted dark:text-muted-dark">
                          {t("onQuote")}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    {product.cta === "buy" && (
                      <button
                        onClick={() =>
                          addItem({
                            id: product.id,
                            name: pickLocale(product.name, locale),
                            priceXOF: product.priceXOF!,
                            priceUSD: product.priceUSD!,
                            quantity: 1,
                          })
                        }
                        className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-black rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                        id={`store-buy-${product.id}`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t("addToCart")}
                      </button>
                    )}
                    {product.cta === "try-free" && (
                      <Link
                        href="/cv-generator"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-black rounded-xl font-semibold hover:bg-secondary-dark transition-colors"
                        id={`store-try-${product.id}`}
                      >
                        {t("tryFree")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                    {product.cta === "book-call" && (
                      <Link
                        href="/contact"
                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-black transition-colors"
                        id={`store-book-${product.id}`}
                      >
                        <Phone className="w-4 h-4" />
                        {t("bookCall")}
                      </Link>
                    )}
                    {product.cta === "pre-register" && (
                      <button
                        className="flex items-center justify-center gap-2 w-full py-3 bg-muted/10 text-muted dark:text-muted-dark rounded-xl font-semibold cursor-not-allowed"
                        disabled
                        id={`store-pre-${product.id}`}
                      >
                        <Clock className="w-4 h-4" />
                        {t("preRegister")}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
