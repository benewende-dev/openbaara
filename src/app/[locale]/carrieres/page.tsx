"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/shared/AnimatedSection";
import { jobs } from "@/data/jobs";
import { useLocale } from "next-intl";
import { Users, DollarSign, Code2, MapPin, Rocket, Upload } from "lucide-react";

const values = [
  { key: "revenue", Icon: DollarSign },
  { key: "noNIH", Icon: Code2 },
  { key: "local", Icon: MapPin },
  { key: "ambition", Icon: Rocket },
] as const;

export default function CareersPage() {
  const t = useTranslations("careers");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      let cvPayload: { name: string; type: string; content: string } | null = null;
      if (cvFile) {
        if (cvFile.size > 5 * 1024 * 1024) {
          setStatus("error");
          setErrorMsg(locale === "fr" ? "Le CV dépasse 5 Mo." : "The CV exceeds 5 MB.");
          return;
        }
        cvPayload = {
          name: cvFile.name,
          type: cvFile.type,
          content: await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
            reader.onerror = () => reject(new Error("read_error"));
            reader.readAsDataURL(cvFile);
          }),
        };
      }

      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          linkedin,
          github,
          message,
          cvFile: cvPayload,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setLinkedin("");
        setGithub("");
        setMessage("");
        setCvFile(null);
      } else {
        setStatus("error");
        setErrorMsg(data.error || tCommon("formError"));
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(tCommon("formError"));
    }
  };

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            <Users className="w-4 h-4" />
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-3xl mx-auto">{t("subtitle")}</p>
        </AnimatedSection>

        {/* Values */}
        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {values.map(({ key, Icon }) => (
            <AnimatedItem key={key}>
              <div className="card-hover rounded-2xl p-6 bg-white dark:bg-[#141414] border border-border dark:border-border-dark">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{t(`values.${key}.title`)}</h3>
                    <p className="text-sm text-muted dark:text-muted-dark leading-relaxed">{t(`values.${key}.description`)}</p>
                  </div>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* Open positions */}
        <AnimatedSection className="mb-16">
          <h2 className="text-2xl font-black mb-8 text-center">
            {jobs.length > 0 ? (locale === "fr" ? "Postes ouverts" : "Open positions") : ""}
          </h2>
          {jobs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted dark:text-muted-dark mb-2">{t("noPositions")}</p>
              <p className="text-primary font-bold text-lg">{t("spontaneous")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-2xl p-6 bg-white dark:bg-[#141414] border border-border dark:border-border-dark flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{locale === "fr" ? job.titleFr : job.titleEn}</h3>
                    <p className="text-sm text-muted dark:text-muted-dark">{job.location} · {job.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* Application form */}
        <AnimatedSection>
          <div className="max-w-2xl mx-auto rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border-dark p-8">
            <h2 className="text-2xl font-black mb-6 text-center">{t("spontaneous")}</h2>
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
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="careers-form-name"
                />
                <input
                  type="email"
                  placeholder={t("formEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="careers-form-email"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t("formLinkedin")}
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="careers-form-linkedin"
                />
                <input
                  type="text"
                  placeholder={t("formGithub")}
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="careers-form-github"
                />
              </div>
              <textarea
                placeholder={t("formMessage")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading"}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                id="careers-form-message"
              />
              
              {/* Custom file upload */}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                disabled={status === "loading"}
              />
              <div
                onClick={() => status !== "loading" && fileInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border dark:border-border-dark cursor-pointer hover:border-primary transition-colors bg-surface dark:bg-[#0A0A0A]"
              >
                <Upload className="w-5 h-5 text-muted" />
                <span className="text-sm text-muted dark:text-muted-dark truncate">
                  {cvFile ? cvFile.name : t("formCv")}
                </span>
              </div>

              <button
                type="submit"
                disabled={status === "loading" || !name || !email}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                id="careers-form-submit"
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
