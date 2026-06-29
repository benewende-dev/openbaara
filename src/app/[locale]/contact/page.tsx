"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { LINKS } from "@/lib/constants";
import { Mail, MapPin, Send, Bell } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterErrorMsg, setNewsletterErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMsg(data.error || tCommon("formError"));
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(tCommon("formError"));
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus("loading");
    setNewsletterErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewsletterStatus("success");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setNewsletterErrorMsg(data.error || tCommon("formError"));
      }
    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterErrorMsg(tCommon("formError"));
    }
  };

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            <Mail className="w-4 h-4" />
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-2xl mx-auto">{t("subtitle")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact form */}
          <AnimatedSection>
            <div className="rounded-2xl bg-white dark:bg-[#111111] border border-border dark:border-border-dark p-8">
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
                    placeholder={t("formName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    id="contact-form-name"
                    disabled={status === "loading"}
                  />
                  <input
                    type="email"
                    placeholder={t("formEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    id="contact-form-email"
                    disabled={status === "loading"}
                  />
                </div>
                <input
                  type="text"
                  placeholder={t("formSubject")}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="contact-form-subject"
                  disabled={status === "loading"}
                />
                <textarea
                  placeholder={t("formMessage")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  id="contact-form-message"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !name || !email || !message}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-black rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  id="contact-form-submit"
                >
                  <Send className="w-4 h-4" />
                  {status === "loading" ? tCommon("loading") : t("formSubmit")}
                </button>
              </form>
            </div>
          </AnimatedSection>

          {/* Info + newsletter */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              {/* Contact info */}
              <div className="rounded-2xl bg-white dark:bg-[#111111] border border-border dark:border-border-dark p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold mb-1">{t("location")}</p>
                      <p className="text-sm text-muted dark:text-muted-dark">Afrique de l&apos;Ouest · UEMOA</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold mb-1">Email</p>
                      <a href={`mailto:${LINKS.email}`} className="text-sm text-primary hover:underline">
                        {t("email")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="rounded-2xl bg-surface dark:bg-[#111111] border border-border dark:border-border-dark p-8">
                <div className="flex items-center gap-3 mb-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">{t("newsletter")}</h3>
                </div>
                <p className="text-muted dark:text-muted-dark text-sm mb-5">{t("newsletterDesc")}</p>
                {newsletterStatus === "success" && (
                  <div className="mb-4 p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold">
                    {tCommon("formSuccess")}
                  </div>
                )}
                {newsletterStatus === "error" && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                    {newsletterErrorMsg}
                  </div>
                )}
                <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    placeholder={t("newsletterPlaceholder")}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-border dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    id="contact-newsletter-email"
                    disabled={newsletterStatus === "loading"}
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === "loading" || !newsletterEmail}
                    className="px-6 py-3 bg-primary text-black rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    id="contact-newsletter-submit"
                  >
                    {newsletterStatus === "loading" ? tCommon("loading") : t("newsletterSubmit")}
                  </button>
                </form>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
