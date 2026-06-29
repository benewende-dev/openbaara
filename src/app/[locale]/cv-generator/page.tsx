"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { Link } from "@/i18n/routing";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { FileText, Plus, X, Download, Mail, Loader2, Check, Crown, ArrowRight, Upload, Trash2 } from "lucide-react";
import {
  CVPreview,
  TEMPLATES,
  type CVData,
  type Experience,
  type Education,
} from "@/components/cv/CVPreview";

type RefField = "name" | "role" | "contact";

const uid = () => crypto.randomUUID();

export default function CVGeneratorPage() {
  const t = useTranslations("cv");
  const tCommon = useTranslations("common");
  const previewRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [selectedTemplate, setSelectedTemplate] = useState("emeraude");
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const [captureEmail, setCaptureEmail] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const [data, setData] = useState<CVData>({
    fullName: "", jobTitle: "", email: "", phone: "", location: "",
    website: "", linkedin: "", github: "", photo: "",
    nationality: "", dateOfBirth: "", drivingLicense: "",
    summary: "",
    experiences: [], educations: [], skills: [], languages: [],
    certifications: [], projects: [], interests: [], references: [],
  });

  const update = (field: keyof CVData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

  // ── Photo ──
  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // 2 Mo max
    const reader = new FileReader();
    reader.onload = () => setData((d) => ({ ...d, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  // ── Expériences ──
  const addExperience = () =>
    setData((d) => ({ ...d, experiences: [...d.experiences, { id: uid(), company: "", position: "", startDate: "", endDate: "", description: "" }] }));
  const removeExperience = (id: string) =>
    setData((d) => ({ ...d, experiences: d.experiences.filter((e) => e.id !== id) }));
  const updateExperience = (id: string, field: keyof Experience, value: string) =>
    setData((d) => ({ ...d, experiences: d.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }));

  // ── Formations ──
  const addEducation = () =>
    setData((d) => ({ ...d, educations: [...d.educations, { id: uid(), school: "", degree: "", field: "", startDate: "", endDate: "" }] }));
  const removeEducation = (id: string) =>
    setData((d) => ({ ...d, educations: d.educations.filter((e) => e.id !== id) }));
  const updateEducation = (id: string, field: keyof Education, value: string) =>
    setData((d) => ({ ...d, educations: d.educations.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }));

  // ── Compétences (avec niveau 1-5) ──
  const addSkill = () => {
    if (skillInput.trim()) {
      setData((d) => ({ ...d, skills: [...d.skills, { id: uid(), name: skillInput.trim(), level: 3 }] }));
      setSkillInput("");
    }
  };
  const setSkillLevel = (id: string, level: number) =>
    setData((d) => ({ ...d, skills: d.skills.map((s) => (s.id === id ? { ...s, level } : s)) }));
  const removeSkill = (id: string) =>
    setData((d) => ({ ...d, skills: d.skills.filter((s) => s.id !== id) }));

  // ── Langues (nom + niveau libre) ──
  const addLanguage = () => {
    if (langInput.trim()) {
      setData((d) => ({ ...d, languages: [...d.languages, { id: uid(), name: langInput.trim(), level: "" }] }));
      setLangInput("");
    }
  };
  const updateLanguage = (id: string, field: "name" | "level", value: string) =>
    setData((d) => ({ ...d, languages: d.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)) }));
  const removeLanguage = (id: string) =>
    setData((d) => ({ ...d, languages: d.languages.filter((l) => l.id !== id) }));

  // ── Certifications ──
  const addCertification = () =>
    setData((d) => ({ ...d, certifications: [...d.certifications, { id: uid(), name: "", issuer: "", year: "" }] }));
  const updateCertification = (id: string, field: "name" | "issuer" | "year", value: string) =>
    setData((d) => ({ ...d, certifications: d.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)) }));
  const removeCertification = (id: string) =>
    setData((d) => ({ ...d, certifications: d.certifications.filter((c) => c.id !== id) }));

  // ── Projets ──
  const addProject = () =>
    setData((d) => ({ ...d, projects: [...d.projects, { id: uid(), name: "", description: "", link: "" }] }));
  const updateProject = (id: string, field: "name" | "description" | "link", value: string) =>
    setData((d) => ({ ...d, projects: d.projects.map((pr) => (pr.id === id ? { ...pr, [field]: value } : pr)) }));
  const removeProject = (id: string) =>
    setData((d) => ({ ...d, projects: d.projects.filter((pr) => pr.id !== id) }));

  // ── Centres d'intérêt ──
  const addInterest = () => {
    if (interestInput.trim()) {
      setData((d) => ({ ...d, interests: [...d.interests, interestInput.trim()] }));
      setInterestInput("");
    }
  };
  const removeInterest = (i: number) =>
    setData((d) => ({ ...d, interests: d.interests.filter((_, j) => j !== i) }));

  // ── Références ──
  const addReference = () =>
    setData((d) => ({ ...d, references: [...d.references, { id: uid(), name: "", role: "", contact: "" }] }));
  const updateReference = (id: string, field: RefField, value: string) =>
    setData((d) => ({ ...d, references: d.references.map((r) => (r.id === id ? { ...r, [field]: value } : r)) }));
  const removeReference = (id: string) =>
    setData((d) => ({ ...d, references: d.references.filter((r) => r.id !== id) }));

  const handleSaveEmail = async () => {
    const email = captureEmail.trim();
    if (!email) return;
    setSaveStatus("loading");
    setSaveError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSaveStatus("success");
        setCaptureEmail("");
      } else {
        setSaveStatus("error");
        setSaveError(json.error || tCommon("formError"));
      }
    } catch {
      setSaveStatus("error");
      setSaveError(tCommon("formError"));
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
    // Hauteur totale de l'image projetée à la largeur A4
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    // Découpage en pages A4 successives (multi-pages)
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position -= pageHeight; // décale l'image vers le haut pour la tranche suivante
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`${data.fullName || "cv"}-openbaara.pdf`);
  };

  const currentTemplate = TEMPLATES.find((tpl) => tpl.id === selectedTemplate)!;
  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-[#000000] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
            <FileText className="w-4 h-4" />
            {t("badge")}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">{t("title")}</h1>
          <p className="text-lg text-muted dark:text-muted-dark max-w-2xl mx-auto">{t("subtitle")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form panel */}
          <div className="space-y-8 order-2 lg:order-1">
            <h2 className="text-xl font-bold">{t("formTitle")}</h2>

            {/* Photo + Personal info */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-border dark:border-border-dark bg-surface dark:bg-[#111111] flex items-center justify-center shrink-0">
                  {data.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-5 h-5 text-muted" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhoto(e.target.files?.[0])} id="cv-photo-input" />
                  <button onClick={() => photoInputRef.current?.click()} className="px-3 py-2 rounded-xl border border-border dark:border-border-dark text-sm font-medium hover:border-primary/50" id="cv-photo-btn">
                    {t("addPhoto")}
                  </button>
                  {data.photo && (
                    <button onClick={() => update("photo", "")} className="px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> {t("removePhoto")}
                    </button>
                  )}
                </div>
              </div>
              <input type="text" placeholder={t("fullName")} value={data.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} id="cv-fullname" />
              <input type="text" placeholder={t("jobTitle")} value={data.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} className={inputClass} id="cv-jobtitle" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="email" placeholder={t("email")} value={data.email} onChange={(e) => update("email", e.target.value)} className={inputClass} id="cv-email" />
                <input type="tel" placeholder={t("phone")} value={data.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} id="cv-phone" />
              </div>
              <input type="text" placeholder={t("location")} value={data.location} onChange={(e) => update("location", e.target.value)} className={inputClass} id="cv-location" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="text" placeholder={t("nationality")} value={data.nationality} onChange={(e) => update("nationality", e.target.value)} className={inputClass} id="cv-nationality" />
                <input type="text" placeholder={t("dateOfBirth")} value={data.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} className={inputClass} id="cv-dob" />
                <input type="text" placeholder={t("drivingLicense")} value={data.drivingLicense} onChange={(e) => update("drivingLicense", e.target.value)} className={inputClass} id="cv-license" />
              </div>
              <textarea placeholder={t("summary")} value={data.summary} onChange={(e) => update("summary", e.target.value)} rows={3} className={`${inputClass} resize-none`} id="cv-summary" />
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold mb-3">{t("linksTitle")}</h3>
              <div className="space-y-3">
                <input type="text" placeholder={t("website")} value={data.website} onChange={(e) => update("website", e.target.value)} className={inputClass} id="cv-website" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder={t("linkedin")} value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} className={inputClass} id="cv-linkedin" />
                  <input type="text" placeholder={t("github")} value={data.github} onChange={(e) => update("github", e.target.value)} className={inputClass} id="cv-github" />
                </div>
              </div>
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
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"><X className="w-4 h-4" /></button>
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
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"><X className="w-4 h-4" /></button>
                  <input placeholder={t("school")} value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} className={inputClass} />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder={t("degree")} value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className={inputClass} />
                    <input placeholder={t("field")} value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder={t("startDate")} value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} className={inputClass} />
                    <input placeholder={t("endDate")} value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} className={inputClass} />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills (with level) */}
            <div>
              <h3 className="font-bold mb-3">{t("skills")}</h3>
              <div className="flex gap-2 mb-3">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder={t("addSkill")} className={`${inputClass} flex-1`} id="cv-skill-input" />
                <button onClick={addSkill} className="px-4 py-2 bg-primary text-black rounded-xl text-sm font-medium" id="cv-add-skill">+</button>
              </div>
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl border border-border dark:border-border-dark">
                    <span className="flex-1 text-sm font-medium truncate">{s.name}</span>
                    <div className="flex items-center gap-1" title={t("skillLevel")}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => setSkillLevel(s.id, n)} aria-label={`${t("skillLevel")} ${n}`}
                          className={`w-3.5 h-3.5 rounded-full transition-colors ${n <= s.level ? "bg-primary" : "bg-border dark:bg-border-dark"}`} />
                      ))}
                    </div>
                    <button onClick={() => removeSkill(s.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md p-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages (name + level) */}
            <div>
              <h3 className="font-bold mb-3">{t("languages")}</h3>
              <div className="flex gap-2 mb-3">
                <input value={langInput} onChange={(e) => setLangInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())} placeholder={t("addLanguage")} className={`${inputClass} flex-1`} id="cv-lang-input" />
                <button onClick={addLanguage} className="px-4 py-2 bg-secondary text-black rounded-xl text-sm font-medium" id="cv-add-lang">+</button>
              </div>
              <div className="space-y-2">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex items-center gap-2 p-2 rounded-xl border border-border dark:border-border-dark">
                    <input value={l.name} onChange={(e) => updateLanguage(l.id, "name", e.target.value)} className="flex-1 bg-transparent text-sm font-medium focus:outline-none px-1" />
                    <input value={l.level} onChange={(e) => updateLanguage(l.id, "level", e.target.value)} placeholder={t("langLevelPh")} className="w-40 bg-surface dark:bg-[#000000] rounded-lg border border-border dark:border-border-dark text-xs px-2 py-1.5 focus:outline-none" />
                    <button onClick={() => removeLanguage(l.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md p-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{t("certifications")}</h3>
                <button onClick={addCertification} className="flex items-center gap-1 text-sm text-primary font-medium hover:underline" id="cv-add-cert">
                  <Plus className="w-4 h-4" /> {t("addCertification")}
                </button>
              </div>
              {data.certifications.map((c) => (
                <div key={c.id} className="relative p-4 mb-3 rounded-xl border border-border dark:border-border-dark space-y-2">
                  <button onClick={() => removeCertification(c.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"><X className="w-4 h-4" /></button>
                  <input placeholder={t("certName")} value={c.name} onChange={(e) => updateCertification(c.id, "name", e.target.value)} className={inputClass} />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder={t("certIssuer")} value={c.issuer} onChange={(e) => updateCertification(c.id, "issuer", e.target.value)} className={inputClass} />
                    <input placeholder={t("certYear")} value={c.year} onChange={(e) => updateCertification(c.id, "year", e.target.value)} className={inputClass} />
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{t("projects")}</h3>
                <button onClick={addProject} className="flex items-center gap-1 text-sm text-primary font-medium hover:underline" id="cv-add-proj">
                  <Plus className="w-4 h-4" /> {t("addProject")}
                </button>
              </div>
              {data.projects.map((pr) => (
                <div key={pr.id} className="relative p-4 mb-3 rounded-xl border border-border dark:border-border-dark space-y-2">
                  <button onClick={() => removeProject(pr.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"><X className="w-4 h-4" /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input placeholder={t("projName")} value={pr.name} onChange={(e) => updateProject(pr.id, "name", e.target.value)} className={inputClass} />
                    <input placeholder={t("projLink")} value={pr.link} onChange={(e) => updateProject(pr.id, "link", e.target.value)} className={inputClass} />
                  </div>
                  <textarea placeholder={t("description")} value={pr.description} onChange={(e) => updateProject(pr.id, "description", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                </div>
              ))}
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-bold mb-3">{t("interests")}</h3>
              <div className="flex gap-2 mb-2">
                <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())} placeholder={t("interestsPh")} className={`${inputClass} flex-1`} id="cv-interest-input" />
                <button onClick={addInterest} className="px-4 py-2 bg-primary text-black rounded-xl text-sm font-medium" id="cv-add-interest">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((it, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {it}
                    <button onClick={() => removeInterest(i)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* References */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{t("references")}</h3>
                <button onClick={addReference} className="flex items-center gap-1 text-sm text-primary font-medium hover:underline" id="cv-add-ref">
                  <Plus className="w-4 h-4" /> {t("addReference")}
                </button>
              </div>
              {data.references.map((r) => (
                <div key={r.id} className="relative p-4 mb-3 rounded-xl border border-border dark:border-border-dark space-y-2">
                  <button onClick={() => removeReference(r.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"><X className="w-4 h-4" /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input placeholder={t("refName")} value={r.name} onChange={(e) => updateReference(r.id, "name", e.target.value)} className={inputClass} />
                    <input placeholder={t("refRole")} value={r.role} onChange={(e) => updateReference(r.id, "role", e.target.value)} className={inputClass} />
                  </div>
                  <input placeholder={t("refContact")} value={r.contact} onChange={(e) => updateReference(r.id, "contact", e.target.value)} className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Preview panel */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            {/* Template selector */}
            <div className="mb-4">
              <h3 className="font-bold mb-3">{t("templateSelect")}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`relative px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                      selectedTemplate === tpl.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border dark:border-border-dark hover:border-primary/50"
                    }`}
                    id={`cv-tpl-${tpl.id}`}
                  >
                    {!tpl.free && (
                      <span className="absolute -top-2 -right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-black">
                        <Crown className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tpl.c.band }} />
                      {tpl.name}
                    </span>
                    <span className="block text-[11px] text-muted dark:text-muted-dark">
                      {tpl.free ? t("templateFree") : t("templatePremium")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Premium CTA */}
            {!currentTemplate.free && (
              <Link href="/boutique" className="group mb-4 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3" id="cv-premium-cta">
                <span className="flex items-center gap-2 text-sm min-w-0">
                  <Crown className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted dark:text-muted-dark truncate">{t("premiumNote")}</span>
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-primary whitespace-nowrap">
                  {t("getTemplate")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            )}

            {/* CV Preview */}
            <CVPreview ref={previewRef} data={data} template={currentTemplate} />

            {/* Export */}
            <button onClick={handleExportPDF} className="flex items-center justify-center gap-2 w-full mt-4 py-3.5 bg-primary text-black rounded-xl font-bold hover:bg-primary-dark transition-colors" id="cv-export-pdf">
              <Download className="w-5 h-5" />
              {t("exportPdf")}
            </button>

            {/* Newsletter capture */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">{t("emailCapture")}</p>
              {saveStatus === "success" ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                  <Check className="w-4 h-4" />
                  {t("saveSuccess")}
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={captureEmail}
                      onChange={(e) => setCaptureEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSaveEmail())}
                      placeholder={t("emailPlaceholder")}
                      disabled={saveStatus === "loading"}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      id="cv-email-capture"
                    />
                    <button onClick={handleSaveEmail} disabled={saveStatus === "loading" || !captureEmail.trim()} aria-label={t("save")}
                      className="px-4 py-2.5 bg-secondary text-black rounded-xl text-sm font-medium hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center" id="cv-save">
                      {saveStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    </button>
                  </div>
                  {saveStatus === "error" && <p className="mt-2 text-xs font-semibold text-red-500">{saveError}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
