"use client";

import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin } from "lucide-react";

// ─── Types partagés ───
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}
export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}
export interface CVData {
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
export type CVLayout = "classic" | "sidebar" | "modern";
export interface CVTemplate {
  id: string;
  name: string;
  free: boolean;
  accent: string;
  layout: CVLayout;
}

// ─── Palettes (couleurs inline = PDF-safe, pas d'oklch) ───
type Palette = {
  band: string;
  bandText: string;
  bandSub: string;
  title: string;
  chipBg: string;
  chipText: string;
  ink: string;
  sub: string;
  muted: string;
  line: string;
};
const PALETTES: Record<string, Palette> = {
  matrix: {
    band: "#00D95A", bandText: "#06281A", bandSub: "rgba(6,40,26,0.75)",
    title: "#047857", chipBg: "#ECFDF5", chipText: "#047857",
    ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#E5E7EB",
  },
  noir: {
    band: "#111827", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.7)",
    title: "#111827", chipBg: "#F3F4F6", chipText: "#111827",
    ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#E5E7EB",
  },
  cosmos: {
    band: "#6366F1", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.75)",
    title: "#4F46E5", chipBg: "#EEF2FF", chipText: "#4338CA",
    ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#E5E7EB",
  },
};

export const CVPreview = forwardRef<HTMLDivElement, { data: CVData; template: CVTemplate }>(
  function CVPreview({ data, template }, ref) {
    const t = useTranslations("cv");
    const p = PALETTES[template.id] ?? PALETTES.matrix;

    const labels = {
      name: data.fullName || t("previewName"),
      role: data.jobTitle || t("previewRole"),
      profile: t("previewProfile"),
      experience: t("experience"),
      education: t("education"),
      skills: t("skills"),
      languages: t("languages"),
      contact: t("previewContact"),
    };

    // ── Briques réutilisables ──
    const SectionTitle = ({ children, color }: { children: React.ReactNode; color?: string }) => (
      <h3
        style={{ color: color ?? p.title, letterSpacing: "0.08em" }}
        className="text-xs font-bold uppercase mb-2"
      >
        {children}
      </h3>
    );

    const ExperienceList = () =>
      data.experiences.length > 0 ? (
        <div>
          <SectionTitle>{labels.experience}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {data.experiences.map((exp) => (
              <div key={exp.id} style={{ borderLeft: `2px solid ${p.line}`, paddingLeft: "0.75rem" }}>
                <p className="font-bold text-sm" style={{ color: p.ink }}>
                  {exp.position}
                  {exp.company ? ` — ${exp.company}` : ""}
                </p>
                <p className="text-xs mb-1" style={{ color: p.muted }}>
                  {[exp.startDate, exp.endDate].filter(Boolean).join(" — ")}
                </p>
                {exp.description && (
                  <p className="text-sm" style={{ color: p.sub, lineHeight: 1.5 }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null;

    const EducationList = () =>
      data.educations.length > 0 ? (
        <div>
          <SectionTitle>{labels.education}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {data.educations.map((edu) => (
              <div key={edu.id}>
                <p className="font-bold text-sm" style={{ color: p.ink }}>
                  {edu.degree}
                  {edu.field ? ` — ${edu.field}` : ""}
                </p>
                <p className="text-xs" style={{ color: p.muted }}>
                  {edu.school}
                  {edu.startDate || edu.endDate ? ` · ${[edu.startDate, edu.endDate].filter(Boolean).join(" — ")}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null;

    const SummaryBlock = () =>
      data.summary ? (
        <div>
          <SectionTitle>{labels.profile}</SectionTitle>
          <p className="text-sm" style={{ color: p.sub, lineHeight: 1.55 }}>{data.summary}</p>
        </div>
      ) : null;

    const SkillChips = ({ title }: { title?: string }) =>
      data.skills.length > 0 ? (
        <div>
          {title !== undefined && <SectionTitle>{labels.skills}</SectionTitle>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {data.skills.map((s, i) => (
              <span
                key={i}
                className="text-xs font-medium"
                style={{ backgroundColor: p.chipBg, color: p.chipText, padding: "0.2rem 0.55rem", borderRadius: "0.375rem" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null;

    const LanguagesBlock = () =>
      data.languages.length > 0 ? (
        <div>
          <SectionTitle>{labels.languages}</SectionTitle>
          <p className="text-sm" style={{ color: p.sub }}>{data.languages.join(" · ")}</p>
        </div>
      ) : null;

    const ContactRow = ({ color }: { color: string }) => (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color }}>
        {data.email && (
          <span className="inline-flex items-center gap-1"><Mail size={12} color={color} />{data.email}</span>
        )}
        {data.phone && (
          <span className="inline-flex items-center gap-1"><Phone size={12} color={color} />{data.phone}</span>
        )}
        {data.location && (
          <span className="inline-flex items-center gap-1"><MapPin size={12} color={color} />{data.location}</span>
        )}
      </div>
    );

    // ── Layout CLASSIC (bandeau) ──
    const Classic = () => (
      <>
        <div style={{ backgroundColor: p.band, padding: "1.75rem 2rem" }}>
          <h2 className="text-2xl font-black" style={{ color: p.bandText }}>{labels.name}</h2>
          <p className="font-medium" style={{ color: p.bandSub }}>{labels.role}</p>
          <div style={{ marginTop: "0.5rem" }}><ContactRow color={p.bandSub} /></div>
        </div>
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <SummaryBlock />
          <ExperienceList />
          <EducationList />
          <SkillChips title="" />
          <LanguagesBlock />
        </div>
      </>
    );

    // ── Layout SIDEBAR (deux colonnes, premium) ──
    const Sidebar = () => (
      <div style={{ display: "flex", minHeight: "600px" }}>
        {/* Colonne gauche */}
        <aside style={{ width: "34%", backgroundColor: p.band, color: p.bandText, padding: "1.75rem 1.4rem", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <div>
            <h2 className="text-xl font-black" style={{ color: p.bandText, lineHeight: 1.15 }}>{labels.name}</h2>
            <p className="text-sm" style={{ color: p.bandSub }}>{labels.role}</p>
          </div>
          {(data.email || data.phone || data.location) && (
            <div>
              <SectionTitle color={p.bandSub}>{labels.contact}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {data.email && <span className="inline-flex items-center gap-2 text-xs" style={{ color: p.bandText, wordBreak: "break-all" }}><Mail size={12} color={p.bandText} />{data.email}</span>}
                {data.phone && <span className="inline-flex items-center gap-2 text-xs" style={{ color: p.bandText }}><Phone size={12} color={p.bandText} />{data.phone}</span>}
                {data.location && <span className="inline-flex items-center gap-2 text-xs" style={{ color: p.bandText }}><MapPin size={12} color={p.bandText} />{data.location}</span>}
              </div>
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <SectionTitle color={p.bandSub}>{labels.skills}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {data.skills.map((s, i) => (
                  <span key={i} className="text-xs" style={{ color: p.bandText }}>• {s}</span>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <SectionTitle color={p.bandSub}>{labels.languages}</SectionTitle>
              <p className="text-xs" style={{ color: p.bandText, lineHeight: 1.6 }}>{data.languages.join(" · ")}</p>
            </div>
          )}
        </aside>
        {/* Colonne droite */}
        <div style={{ width: "66%", padding: "1.9rem 1.8rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <SummaryBlock />
          <ExperienceList />
          <EducationList />
        </div>
      </div>
    );

    // ── Layout MODERN (centré + corps 2 colonnes) ──
    const Modern = () => (
      <div style={{ padding: "2rem 2rem 2.25rem" }}>
        <div style={{ textAlign: "center", paddingBottom: "1.1rem", borderBottom: `2px solid ${p.band}`, marginBottom: "1.5rem" }}>
          <h2 className="text-3xl font-black" style={{ color: p.ink, letterSpacing: "-0.01em" }}>{labels.name}</h2>
          <p className="font-semibold" style={{ color: p.title, marginTop: "0.15rem" }}>{labels.role}</p>
          <div style={{ marginTop: "0.6rem", display: "flex", justifyContent: "center" }}><ContactRow color={p.muted} /></div>
        </div>
        <div style={{ display: "flex", gap: "1.75rem" }}>
          <div style={{ width: "62%", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            <SummaryBlock />
            <ExperienceList />
          </div>
          <div style={{ width: "38%", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            <EducationList />
            <SkillChips title="" />
            <LanguagesBlock />
          </div>
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: "#ffffff", color: p.ink, minHeight: "600px" }}
      >
        {template.layout === "sidebar" ? <Sidebar /> : template.layout === "modern" ? <Modern /> : <Classic />}
      </div>
    );
  }
);
