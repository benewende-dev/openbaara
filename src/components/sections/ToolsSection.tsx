"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { motion } from "framer-motion";
import { CLI_TOOLS } from "@/lib/constants";
import { Terminal } from "lucide-react";

export function ToolsSection() {
  const t = useTranslations("tools");

  return (
    <section className="section-padding bg-surface dark:bg-surface-dark overflow-hidden">
      <div className="container-wide mx-auto">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            <Terminal className="w-4 h-4" />
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted dark:text-muted-dark max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Infinite scrolling marquee */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface dark:from-surface-dark to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface dark:from-surface-dark to-transparent z-10" />

          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{
              x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" },
            }}
            className="flex gap-6 py-4"
          >
            {[...CLI_TOOLS, ...CLI_TOOLS, ...CLI_TOOLS].map((tool, i) => (
              <div
                key={`${tool.name}-${i}`}
                className="shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border-dark"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm whitespace-nowrap">{tool.name}</p>
                  <p className="text-xs text-muted dark:text-muted-dark">{tool.category}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
