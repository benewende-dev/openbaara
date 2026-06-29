"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { FileText, Plus, X, Download, Lock, Mail } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface CVData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  languages: string[];
}

const templates = [
  { id: "abidjan", name: "Abidjan", free: true, accent: "#FF7A00" },
  { id: "sahel", name: "Sahel", free: false, accent: "#009E60" },
  { id: "cosmos", name: "Cosmos", free: false, accent: "#6366F1" },
] as const;

export default function CVGeneratorPage() {
  const t = useTranslations("cv");
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("abidjan");
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");

  const [data, setData] = useState<CVData>({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
  });

  const update = (field: keyof CVData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

  const addExperience = () =>
    setData((d) => ({
      ...d,
      experiences: [
        ...d.experiences,
        { id: crypto.randomUUID(), company: "", position: "", startDate: "", endDate: "", description: "" },
      ],
    }));

  const removeExperience = (id: string) =>
    setData((d) => ({ ...d, experiences: d.experiences.filter((e) => e.id !== id) }));

  const updateExperience = (id: string, field: keyof Experience, value: string) =>
    setData((d) => ({
      ...d,
      experiences: d.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));

  const addEducation = () =>
    setData((d) => ({
      ...d,
      educations: [
        ...d.educations,
        { id: crypto.randomUUID(), school: "", degree: "", field: "", startDate: "", endDate: "" },
      ],
    }));

  const removeEducation = (id: string) =>
    setData((d) => ({ ...d, educations: d.educations.filter((e) => e.id !== id) }));

  const updateEducation = (id: string, field: keyof Education, value: string) =>
    setData((d) => ({
      ...d,
      educations: d.educations.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));

  const addSkill = () => {
    if (skillInput.trim()) {
      setData((d) => ({ ...d, skills: [...d.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  const addLanguage = () => {
    if (langInput.trim()) {
      setData((d) => ({ ...d, languages: [...d.languages, langInput.trim()] }));
      setLangInput("");
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.fullName || "cv"}-openbaara.pdf`);
  };

  const currentTemplate = templates.find((t) => t.id === selectedTemplate)!;
  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            <FileText className="w-4 h-4" />
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-2xl mx-auto">{t("subtitle")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form panel */}
          <div className="space-y-6 order-2 lg:order-1">
            <h2 className="text-xl font-bold">{t("formTitle")}</h2>

            {/* Personal info */}
            <div className="space-y-3">
              <input type="text" placeholder={t("fullName")} value={data.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} id="cv-fullname" />
              <input type="text" placeholder={t("jobTitle")} value={data.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} className={inputClass} id="cv-jobtitle" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="email" placeholder={t("email")} value={data.email} onChange={(e) => update("email", e.target.value)} className={inputClass} id="cv-email" />
                <input type="tel" placeholder={t("phone")} value={data.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} id="cv-phone" />
              </div>
              <input type="text" placeholder={t("location")} value={data.location} onChange={(e) => update("location", e.target.value)} className={inputClass} id="cv-location" />
              <textarea placeholder={t("summary")} value={data.summary} onChange={(e) => update("summary", e.target.value)} rows={3} className={`${inputClass} resize-none`} id="cv-summary" />
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{t("experience")}</h3>
                <button onClick={addExperience} className="flex items-center gap-1 text-sm text-primary font-medium hover:underline" id="cv-add-exp">
                  <Plus className="w-4 h-4" /> {t("addExperience")}
                </button>
              </div>
              {data.experiences.map((exp) => (
                <div key={exp.id} className="relative p-4 mb-3 rounded-xl border border-border dark:border-border-dark space-y-2">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input placeholder={t("company")} value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className={inputClass} />
                    <input placeholder={t("position")} value={exp.position} onChange={(e) => updateExperience(exp.id, "position", e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder={t("startDate")} value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} className={inputClass} />
                    <input placeholder={t("endDate")} value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} className={inputClass} />
                  </div>
                  <textarea placeholder={t("description")} value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                </div>
              ))}
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{t("education")}</h3>
                <button onClick={addEducation} className="flex items-center gap-1 text-sm text-primary font-medium hover:underline" id="cv-add-edu">
                  <Plus className="w-4 h-4" /> {t("addEducation")}
                </button>
              </div>
              {data.educations.map((edu) => (
                <div key={edu.id} className="relative p-4 mb-3 rounded-xl border border-border dark:border-border-dark space-y-2">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                    <X className="w-4 h-4" />
                  </button>
                  <input placeholder={t("school")} value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} className={inputClass} />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder={t("degree")} value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className={inputClass} />
                    <input placeholder={t("field")} value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} className={inputClass} />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-bold mb-3">{t("skills")}</h3>
              <div className="flex gap-2 mb-2">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder={t("addSkill")} className={`${inputClass} flex-1`} id="cv-skill-input" />
                <button onClick={addSkill} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium" id="cv-add-skill">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {s}
                    <button onClick={() => setData((d) => ({ ...d, skills: d.skills.filter((_, j) => j !== i) }))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-bold mb-3">{t("languages")}</h3>
              <div className="flex gap-2 mb-2">
                <input value={langInput} onChange={(e) => setLangInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())} placeholder={t("addLanguage")} className={`${inputClass} flex-1`} id="cv-lang-input" />
                <button onClick={addLanguage} className="px-4 py-2 bg-secondary text-white rounded-xl text-sm font-medium" id="cv-add-lang">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((l, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                    {l}
                    <button onClick={() => setData((d) => ({ ...d, languages: d.languages.filter((_, j) => j !== i) }))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            {/* Template selector */}
            <div className="mb-4">
              <h3 className="font-bold mb-3">{t("templateSelect")}</h3>
              <div className="flex gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => tpl.free && setSelectedTemplate(tpl.id)}
                    className={`relative flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedTemplate === tpl.id
                        ? "border-primary bg-primary/5 text-primary"
                        : tpl.free
                        ? "border-border dark:border-border-dark hover:border-primary/50"
                        : "border-border dark:border-border-dark opacity-50 cursor-not-allowed"
                    }`}
                    id={`cv-tpl-${tpl.id}`}
                  >
                    {tpl.name}
                    {tpl.free ? (
                      <span className="block text-xs text-secondary">{t("templateFree")}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted"><Lock className="w-3 h-3" />{t("templatePremium")}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CV Preview */}
            <div ref={previewRef} className="bg-white text-black rounded-xl shadow-lg overflow-hidden" style={{ minHeight: "600px" }}>
              {/* Header bar */}
              <div className="px-8 py-6" style={{ backgroundColor: currentTemplate.accent }}>
                <h2 className="text-2xl font-black text-white">{data.fullName || "Votre Nom"}</h2>
                <p className="text-white/80 font-medium">{data.jobTitle || "Titre du poste"}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/70">
                  {data.email && <span>{data.email}</span>}
                  {data.phone && <span>{data.phone}</span>}
                  {data.location && <span>{data.location}</span>}
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Summary */}
                {data.summary && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: currentTemplate.accent }}>
                      Profil
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {data.experiences.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: currentTemplate.accent }}>
                      Expérience
                    </h3>
                    {data.experiences.map((exp) => (
                      <div key={exp.id} className="mb-4">
                        <p className="font-bold text-sm">{exp.position}{exp.company ? ` — ${exp.company}` : ""}</p>
                        <p className="text-xs text-gray-500 mb-1">{exp.startDate} — {exp.endDate}</p>
                        {exp.description && <p className="text-sm text-gray-600">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {data.educations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: currentTemplate.accent }}>
                      Formation
                    </h3>
                    {data.educations.map((edu) => (
                      <div key={edu.id} className="mb-3">
                        <p className="font-bold text-sm">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</p>
                        <p className="text-xs text-gray-500">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: currentTemplate.accent }}>
                      Compétences
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {data.skills.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: `${currentTemplate.accent}15`, color: currentTemplate.accent }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: currentTemplate.accent }}>
                      Langues
                    </h3>
                    <p className="text-sm text-gray-700">{data.languages.join(" · ")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Export button */}
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
              id="cv-export-pdf"
            >
              <Download className="w-5 h-5" />
              {t("exportPdf")}
            </button>

            {/* Email capture */}
            <div className="mt-4 flex gap-2">
              <input type="email" placeholder={t("emailPlaceholder")} className="flex-1 px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-[#141414] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" id="cv-email-capture" />
              <button className="px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary-dark transition-colors" id="cv-save">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
