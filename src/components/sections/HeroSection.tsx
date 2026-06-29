"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, MessageSquare } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-white dark:bg-[#0A0A0A]">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-float"
            style={{
              background:
                "radial-gradient(circle, rgba(255,122,0,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-float"
            style={{
              background:
                "radial-gradient(circle, rgba(0,158,96,0.12) 0%, transparent 70%)",
              animationDelay: "3s",
            }}
          />
        </div>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] hidden dark:block"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 container-wide mx-auto px-4 md:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A0A0A]/10 dark:border-white/10 bg-[#0A0A0A]/5 dark:bg-white/5 text-sm text-[#0A0A0A]/70 dark:text-white/70 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          {t("badge")}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-[#0A0A0A] dark:text-white max-w-5xl mx-auto mb-4"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text mb-6"
        >
          {t("titleHighlight")}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-[#0A0A0A]/60 dark:text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/carrieres"
            className="group flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/20"
            id="hero-cta-join"
          >
            <Rocket className="w-5 h-5" />
            {t("ctaJoin")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/investisseurs"
            className="flex items-center gap-2 px-7 py-3.5 border border-[#0A0A0A]/20 dark:border-white/20 text-[#0A0A0A] dark:text-white rounded-xl font-semibold text-lg hover:bg-[#0A0A0A]/5 dark:hover:bg-white/5 transition-all"
            id="hero-cta-invest"
          >
            <MessageSquare className="w-5 h-5" />
            {t("ctaInvest")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
