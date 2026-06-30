"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedItem,
} from "@/components/shared/AnimatedSection";
import {
  Search,
  Settings,
  Workflow,
  Shield,
  ArrowRight,
  CheckCircle2,
  Building2,
} from "lucide-react";

const services = [
  { key: "audit", Icon: Search },
  { key: "integration", Icon: Settings },
  { key: "automation", Icon: Workflow },
  { key: "sovereign", Icon: Shield },
] as const;

const processSteps = ["step1", "step2", "step3", "step4"] as const;
const processIcons = [Search, Settings, Workflow, CheckCircle2];

export default function SolutionsPage() {
  const t = useTranslations("solutions");
  const tCommon = useTranslations("common");

  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !name || !email || !sector) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, name, email, sector, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setCompany("");
        setName("");
        setEmail("");
        setSector("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMsg(data.error || tCommon("formError"));
      }
    } catch {
      setStatus("error");
      setErrorMsg(tCommon("formError"));
    }
  };

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 text-sm font-medium text-secondary mb-6">
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Services grid */}
        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {services.map(({ key, Icon }) => (
            <AnimatedItem key={key}>
              <div className="card-hover rounded-2xl p-6 md:p-8 bg-white dark:bg-[#111111] border border-border dark:border-border-dark">
                <div className="p-3 rounded-xl bg-secondary/10 text-secondary w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {t(`services.${key}.title`)}
                </h3>
                <p className="text-muted dark:text-muted-dark leading-relaxed">
                  {t(`services.${key}.description`)}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* Process flow */}
        <AnimatedSection className="mb-20">
          <h2 className="text-2xl font-black text-center mb-10">{t("processTitle")}</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {processSteps.map((step, i) => {
              const Icon = processIcons[i];
              return (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center text-center px-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">{t(`process.${step}`)}</span>
                  </div>
                  {i < processSteps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-muted hidden md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Targets */}
        <AnimatedSection className="text-center mb-16">
          <p className="text-muted dark:text-muted-dark font-medium flex items-center justify-center gap-2 flex-wrap">
            <Building2 className="w-4 h-4" />
            {t("targets")}
          </p>
        </AnimatedSection>

        {/* B2B Contact form */}
        <AnimatedSection>
          <div className="max-w-2xl mx-auto rounded-2xl bg-white dark:bg-[#111111] border border-border dark:border-border-dark p-8">
            <h2 className="text-2xl font-black mb-6 text-center">{t("ctaAudit")}</h2>
            {status === "success" && (
              <div className="mb-6 p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold">
                {tCommon("formSuccess")}
              </div>
            )}
            {status === "error" && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold">
                {errorMsg}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t("formCompany")}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="solutions-form-company"
                />
                <input
                  type="text"
                  placeholder={t("formName")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="solutions-form-name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder={t("formEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="solutions-form-email"
                />
                <input
                  type="text"
                  placeholder={t("formSector")}
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="solutions-form-sector"
                />
              </div>
              <textarea
                placeholder={t("formMessage")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading"}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                id="solutions-form-message"
              />
              <button
                type="submit"
                disabled={status === "loading" || !company || !name || !email || !sector}
                className="w-full py-3.5 bg-primary text-black rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                id="solutions-form-submit"
              >
                {status === "loading" ? tCommon("loading") : t("formSubmit")}
              </button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
