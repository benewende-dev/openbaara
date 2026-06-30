"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, MessageSquare } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden noise">
      {/* Mesh background */}
      <div className="absolute inset-0 -z-0">
        <div
          className="glow-orb top-[-8%] left-[14%] w-[440px] h-[440px] animate-float"
          style={{ background: "radial-gradient(circle, rgba(0,217,90,0.22), transparent 70%)" }}
        />
        <div
          className="glow-orb bottom-[0%] right-[10%] w-[400px] h-[400px] animate-float"
          style={{
            background: "radial-gradient(circle, rgba(0,217,90,0.16), transparent 70%)",
            animationDelay: "3s",
          }}
        />
        <div className="absolute inset-0 dot-grid" />
      </div>

      <div className="relative z-10 container-wide mx-auto px-4 md:px-6 text-center">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#000000]/10 dark:border-white/12 bg-white/50 dark:bg-white/5 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="kicker text-[#000000]/65 dark:text-white/65">{t("badge")}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-[#000000] dark:text-white max-w-5xl mx-auto mb-4"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-6"
        >
          {t("titleHighlight")}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-[#000000]/60 dark:text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
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
            className="group btn-glow flex items-center gap-2 px-7 py-3.5 bg-primary text-black rounded-xl font-semibold text-lg hover:bg-primary-dark transition-all"
            id="hero-cta-join"
          >
            <Rocket className="w-5 h-5" />
            {t("ctaJoin")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/investisseurs"
            className="flex items-center gap-2 px-7 py-3.5 border border-[#000000]/20 dark:border-white/20 text-[#000000] dark:text-white rounded-xl font-semibold text-lg hover:bg-[#000000]/5 dark:hover:bg-white/5 transition-all"
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
