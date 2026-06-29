"use client";

import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Globe, Link2 } from "lucide-react";

// ─── Types partagés ───
export interface Experience {
  id: string; company: string; position: string; startDate: string; endDate: string; description: string;
}
export interface Education {
  id: string; school: string; degree: string; field: string; startDate: string; endDate: string;
}
export interface Skill { id: string; name: string; level: number }
export interface Language { id: string; name: string; level: string }
export interface Certification { id: string; name: string; issuer: string; year: string }
export interface Project { id: string; name: string; description: string; link: string }
export interface Reference { id: string; name: string; role: string; contact: string }

export interface CVData {
  fullName: string; jobTitle: string; email: string; phone: string; location: string;
  website: string; linkedin: string; github: string; photo: string;
  nationality: string; dateOfBirth: string; drivingLicense: string;
  summary: string;
  experiences: Experience[]; educations: Education[];
  skills: Skill[]; languages: Language[];
  certifications: Certification[]; projects: Project[]; interests: string[]; references: Reference[];
}

export type CVLayout =
  | "classic" | "sidebar" | "sidebarRight" | "modern" | "minimal" | "bold"
  | "elegant" | "compact" | "timeline" | "duo" | "stripe" | "executive" | "grid" | "banner";

export type Palette = {
  band: string; bandText: string; bandSub: string;
  title: string; accent: string; chipBg: string; chipText: string;
  ink: string; sub: string; muted: string; line: string;
};

export interface CVTemplate {
  id: string; name: string; free: boolean; layout: CVLayout; font: string; c: Palette;
}

// ─── Polices sûres (rendu + export PDF) ───
const SANS = "'Inter', system-ui, Arial, sans-serif";
const HUMANIST = "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const ELEGANT = "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif";
const MONO = "'Courier New', ui-monospace, monospace";

// ─── 15 templates ───
export const TEMPLATES: CVTemplate[] = [
  { id: "emeraude", name: "Émeraude", free: true, layout: "classic", font: SANS,
    c: { band: "#059669", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.85)", title: "#047857", accent: "#059669", chipBg: "#ECFDF5", chipText: "#047857", ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#E5E7EB" } },
  { id: "ardoise", name: "Ardoise", free: true, layout: "minimal", font: SERIF,
    c: { band: "#334155", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#334155", accent: "#475569", chipBg: "#F1F5F9", chipText: "#334155", ink: "#0f172a", sub: "#334155", muted: "#64748b", line: "#E2E8F0" } },
  { id: "terminal", name: "Terminal", free: true, layout: "compact", font: MONO,
    c: { band: "#0b3b2e", bandText: "#d1fae5", bandSub: "rgba(209,250,229,0.75)", title: "#047857", accent: "#059669", chipBg: "#ECFDF5", chipText: "#065f46", ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#D1FAE5" } },
  { id: "duo", name: "Duo", free: true, layout: "duo", font: SANS,
    c: { band: "#0D9488", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#0F766E", accent: "#0D9488", chipBg: "#F0FDFA", chipText: "#0F766E", ink: "#0f172a", sub: "#334155", muted: "#64748b", line: "#CCFBF1" } },
  { id: "onyx", name: "Onyx", free: false, layout: "sidebar", font: SANS,
    c: { band: "#111827", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.6)", title: "#111827", accent: "#111827", chipBg: "#F3F4F6", chipText: "#111827", ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#E5E7EB" } },
  { id: "azur", name: "Azur", free: false, layout: "sidebar", font: HUMANIST,
    c: { band: "#1D4ED8", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.75)", title: "#1D4ED8", accent: "#2563EB", chipBg: "#EFF6FF", chipText: "#1D4ED8", ink: "#0f172a", sub: "#334155", muted: "#64748b", line: "#E2E8F0" } },
  { id: "cosmos", name: "Cosmos", free: false, layout: "modern", font: SANS,
    c: { band: "#6366F1", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.75)", title: "#4F46E5", accent: "#6366F1", chipBg: "#EEF2FF", chipText: "#4338CA", ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#E5E7EB" } },
  { id: "corail", name: "Corail", free: false, layout: "bold", font: HUMANIST,
    c: { band: "#E11D48", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#BE123C", accent: "#E11D48", chipBg: "#FFF1F2", chipText: "#BE123C", ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#FECDD3" } },
  { id: "ivoire", name: "Ivoire", free: false, layout: "elegant", font: ELEGANT,
    c: { band: "#B45309", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#92400E", accent: "#B45309", chipBg: "#FEF3C7", chipText: "#92400E", ink: "#1c1917", sub: "#44403c", muted: "#78716c", line: "#E7E5E4" } },
  { id: "sienne", name: "Sienne", free: false, layout: "sidebarRight", font: SANS,
    c: { band: "#C2410C", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.75)", title: "#C2410C", accent: "#EA580C", chipBg: "#FFF7ED", chipText: "#C2410C", ink: "#1c1917", sub: "#44403c", muted: "#78716c", line: "#FED7AA" } },
  { id: "marine", name: "Marine", free: false, layout: "timeline", font: SANS,
    c: { band: "#0E7490", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#0E7490", accent: "#0891B2", chipBg: "#ECFEFF", chipText: "#155E75", ink: "#0f172a", sub: "#334155", muted: "#64748b", line: "#CFFAFE" } },
  { id: "lisere", name: "Liséré", free: false, layout: "stripe", font: HUMANIST,
    c: { band: "#7C3AED", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#6D28D9", accent: "#7C3AED", chipBg: "#F5F3FF", chipText: "#6D28D9", ink: "#1e1b4b", sub: "#3730a3", muted: "#6b7280", line: "#EDE9FE" } },
  { id: "monochrome", name: "Monochrome", free: false, layout: "executive", font: SERIF,
    c: { band: "#1f2937", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#1f2937", accent: "#374151", chipBg: "#F3F4F6", chipText: "#1f2937", ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#D1D5DB" } },
  { id: "prisme", name: "Prisme", free: false, layout: "grid", font: HUMANIST,
    c: { band: "#DB2777", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#BE185D", accent: "#DB2777", chipBg: "#FDF2F8", chipText: "#BE185D", ink: "#111827", sub: "#374151", muted: "#6b7280", line: "#FBCFE8" } },
  { id: "horizon", name: "Horizon", free: false, layout: "banner", font: SANS,
    c: { band: "#1E3A8A", bandText: "#ffffff", bandSub: "rgba(255,255,255,0.8)", title: "#1E40AF", accent: "#2563EB", chipBg: "#EFF6FF", chipText: "#1E40AF", ink: "#0f172a", sub: "#334155", muted: "#64748b", line: "#DBEAFE" } },
];

export const CVPreview = forwardRef<HTMLDivElement, { data: CVData; template: CVTemplate }>(
  function CVPreview({ data, template }, ref) {
    const t = useTranslations("cv");
    const p = template.c;
    const L = {
      name: data.fullName || t("previewName"),
      role: data.jobTitle || t("previewRole"),
      profile: t("previewProfile"), experience: t("experience"), education: t("education"),
      skills: t("skills"), languages: t("languages"), contact: t("previewContact"),
      certifications: t("certifications"), projects: t("projects"), interests: t("interests"),
      references: t("references"), details: t("personalDetails"),
      nationality: t("nationality"), dob: t("dateOfBirth"), license: t("drivingLicense"),
    };

    const Title = ({ children, color, center }: { children: React.ReactNode; color?: string; center?: boolean }) => (
      <h3 style={{ color: color ?? p.title, letterSpacing: "0.09em", textAlign: center ? "center" : "left" }}
        className="text-[11px] font-bold uppercase mb-2">{children}</h3>
    );
    const dates = (a: string, b: string) => [a, b].filter(Boolean).join(" — ");
    const col = (gap = "1.3rem") => ({ display: "flex", flexDirection: "column" as const, gap });
    const initials = (data.fullName || "")
      .split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

    const Photo = ({ size = 76, ring }: { size?: number; ring?: string }) =>
      data.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.photo} alt="" width={size} height={size}
          style={{ width: size, height: size, borderRadius: "9999px", objectFit: "cover", border: ring ? `3px solid ${ring}` : undefined }} />
      ) : null;

    const ContactItem = ({ icon, value, color }: { icon: React.ReactNode; value: string; color: string }) => (
      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color, wordBreak: "break-word" }}>{icon}{value}</span>
    );
    const Contacts = ({ color, dir = "col" }: { color: string; dir?: "row" | "col" }) => {
      const items = [
        data.email && <ContactItem key="e" icon={<Mail size={12} color={color} />} value={data.email} color={color} />,
        data.phone && <ContactItem key="p" icon={<Phone size={12} color={color} />} value={data.phone} color={color} />,
        data.location && <ContactItem key="l" icon={<MapPin size={12} color={color} />} value={data.location} color={color} />,
        data.website && <ContactItem key="w" icon={<Globe size={12} color={color} />} value={data.website} color={color} />,
        data.linkedin && <ContactItem key="in" icon={<Link2 size={12} color={color} />} value={data.linkedin} color={color} />,
        data.github && <ContactItem key="gh" icon={<Link2 size={12} color={color} />} value={data.github} color={color} />,
      ].filter(Boolean);
      if (!items.length) return null;
      return <div style={{ display: "flex", flexDirection: dir === "row" ? "row" : "column", flexWrap: "wrap", gap: dir === "row" ? "0.35rem 1rem" : "0.3rem", justifyContent: dir === "row" ? "center" : "flex-start" }}>{items}</div>;
    };

    const Details = ({ onDark }: { onDark?: boolean }) => {
      const rows = [
        data.nationality && [L.nationality, data.nationality],
        data.dateOfBirth && [L.dob, data.dateOfBirth],
        data.drivingLicense && [L.license, data.drivingLicense],
      ].filter(Boolean) as [string, string][];
      if (!rows.length) return null;
      const tc = onDark ? p.bandText : p.sub;
      return (
        <div>
          <Title color={onDark ? p.bandSub : p.title}>{L.details}</Title>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            {rows.map(([k, v], i) => (
              <p key={i} className="text-xs" style={{ color: tc }}>
                <span style={{ color: onDark ? p.bandSub : p.muted }}>{k} : </span>{v}
              </p>
            ))}
          </div>
        </div>
      );
    };

    const Summary = ({ center }: { center?: boolean }) => data.summary ? (
      <div><Title center={center}>{L.profile}</Title><p className="text-sm" style={{ color: p.sub, lineHeight: 1.55, textAlign: center ? "center" : "left" }}>{data.summary}</p></div>
    ) : null;

    const Experiences = ({ timeline }: { timeline?: boolean }) => data.experiences.length ? (
      <div><Title>{L.experience}</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", paddingLeft: timeline ? "1rem" : 0, borderLeft: timeline ? `2px solid ${p.line}` : undefined }}>
          {data.experiences.map((e) => (
            <div key={e.id} style={{ position: "relative", borderLeft: timeline ? undefined : `2px solid ${p.line}`, paddingLeft: timeline ? "0.4rem" : "0.75rem" }}>
              {timeline && <span style={{ position: "absolute", left: "-1.45rem", top: "0.25rem", width: 9, height: 9, borderRadius: 9999, backgroundColor: p.accent }} />}
              <p className="font-bold text-sm" style={{ color: p.ink }}>{e.position}{e.company ? ` — ${e.company}` : ""}</p>
              <p className="text-xs mb-1" style={{ color: p.muted }}>{dates(e.startDate, e.endDate)}</p>
              {e.description && <p className="text-sm" style={{ color: p.sub, lineHeight: 1.5 }}>{e.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null;

    const Educations = () => data.educations.length ? (
      <div><Title>{L.education}</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {data.educations.map((e) => (
            <div key={e.id}>
              <p className="font-bold text-sm" style={{ color: p.ink }}>{e.degree}{e.field ? ` — ${e.field}` : ""}</p>
              <p className="text-xs" style={{ color: p.muted }}>{e.school}{e.startDate || e.endDate ? ` · ${dates(e.startDate, e.endDate)}` : ""}</p>
            </div>
          ))}
        </div>
      </div>
    ) : null;

    const SkillBars = ({ onDark }: { onDark?: boolean }) => data.skills.length ? (
      <div><Title color={onDark ? p.bandSub : p.title}>{L.skills}</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.skills.map((s) => (
            <div key={s.id}>
              <span className="text-xs" style={{ color: onDark ? p.bandText : p.sub }}>{s.name}</span>
              <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: n <= (s.level || 3) ? (onDark ? p.bandText : p.accent) : (onDark ? "rgba(255,255,255,0.22)" : p.line) }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;

    const SkillChips = () => data.skills.length ? (
      <div><Title>{L.skills}</Title>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {data.skills.map((s) => (
            <span key={s.id} className="text-xs font-medium" style={{ backgroundColor: p.chipBg, color: p.chipText, padding: "0.2rem 0.55rem", borderRadius: "0.375rem" }}>{s.name}</span>
          ))}
        </div>
      </div>
    ) : null;

    const Languages = ({ onDark }: { onDark?: boolean }) => data.languages.length ? (
      <div><Title color={onDark ? p.bandSub : p.title}>{L.languages}</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {data.languages.map((l) => (
            <p key={l.id} className="text-xs" style={{ color: onDark ? p.bandText : p.sub }}>
              <span style={{ fontWeight: 600 }}>{l.name}</span>{l.level ? ` — ${l.level}` : ""}
            </p>
          ))}
        </div>
      </div>
    ) : null;

    const Certifications = () => data.certifications.length ? (
      <div><Title>{L.certifications}</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {data.certifications.map((c) => (
            <div key={c.id}>
              <p className="text-sm font-semibold" style={{ color: p.ink }}>{c.name}</p>
              <p className="text-xs" style={{ color: p.muted }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    ) : null;

    const Projects = () => data.projects.length ? (
      <div><Title>{L.projects}</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.projects.map((pr) => (
            <div key={pr.id}>
              <p className="text-sm font-semibold" style={{ color: p.ink }}>{pr.name}{pr.link ? <span style={{ color: p.accent, fontWeight: 400 }}>{` · ${pr.link}`}</span> : null}</p>
              {pr.description && <p className="text-xs" style={{ color: p.sub, lineHeight: 1.5 }}>{pr.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null;

    const References = () => data.references.length ? (
      <div><Title>{L.references}</Title>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem 1.2rem" }}>
          {data.references.map((r) => (
            <div key={r.id} style={{ minWidth: "45%" }}>
              <p className="text-sm font-semibold" style={{ color: p.ink }}>{r.name}</p>
              {r.role && <p className="text-xs" style={{ color: p.muted }}>{r.role}</p>}
              {r.contact && <p className="text-xs" style={{ color: p.sub }}>{r.contact}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null;

    const Interests = ({ onDark }: { onDark?: boolean }) => data.interests.length ? (
      <div><Title color={onDark ? p.bandSub : p.title}>{L.interests}</Title>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {data.interests.map((it, i) => (
            <span key={i} className="text-xs" style={onDark
              ? { color: p.bandText, border: "1px solid rgba(255,255,255,0.3)", padding: "0.15rem 0.5rem", borderRadius: "9999px" }
              : { backgroundColor: p.chipBg, color: p.chipText, padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>{it}</span>
          ))}
        </div>
      </div>
    ) : null;

    // ─── LAYOUTS ───
    const renderBody = () => {
      switch (template.layout) {
        case "sidebar":
        case "sidebarRight": {
          const aside = (
            <aside style={{ width: "35%", backgroundColor: p.band, color: p.bandText, padding: "1.6rem 1.3rem", ...col("1.25rem") }}>
              {data.photo && <div style={{ display: "flex", justifyContent: "center" }}><Photo size={88} ring="rgba(255,255,255,0.5)" /></div>}
              <div>
                <h2 className="text-xl font-black" style={{ color: p.bandText, lineHeight: 1.15 }}>{L.name}</h2>
                <p className="text-sm" style={{ color: p.bandSub }}>{L.role}</p>
              </div>
              {(data.email || data.phone || data.location || data.website || data.linkedin || data.github) && (
                <div><Title color={p.bandSub}>{L.contact}</Title><Contacts color={p.bandText} dir="col" /></div>
              )}
              <Details onDark />
              <SkillBars onDark /><Languages onDark /><Interests onDark />
            </aside>
          );
          const main = (
            <div style={{ width: "65%", padding: "1.7rem 1.6rem", ...col("1.35rem") }}>
              <Summary /><Experiences /><Educations /><Certifications /><Projects /><References />
            </div>
          );
          return <div style={{ display: "flex", minHeight: "600px" }}>{template.layout === "sidebarRight" ? <>{main}{aside}</> : <>{aside}{main}</>}</div>;
        }

        case "modern":
          return (
            <div style={{ padding: "1.9rem 2rem 2.2rem" }}>
              <div style={{ textAlign: "center", paddingBottom: "1rem", borderBottom: `2px solid ${p.band}`, marginBottom: "1.4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                {data.photo && <Photo size={84} ring={p.band} />}
                <div><h2 className="text-3xl font-black" style={{ color: p.ink, letterSpacing: "-0.01em" }}>{L.name}</h2><p className="font-semibold" style={{ color: p.title }}>{L.role}</p></div>
                <Contacts color={p.muted} dir="row" />
              </div>
              <div style={{ display: "flex", gap: "1.7rem" }}>
                <div style={{ width: "62%", ...col("1.3rem") }}><Summary /><Experiences /><Projects /><References /></div>
                <div style={{ width: "38%", ...col("1.3rem") }}><Details /><Educations /><SkillBars /><Languages /><Certifications /><Interests /></div>
              </div>
            </div>
          );

        case "bold":
          return (
            <>
              <div style={{ backgroundColor: p.band, padding: "2.2rem 2rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
                {data.photo && <Photo size={92} ring="rgba(255,255,255,0.6)" />}
                <div><h2 className="font-black" style={{ color: p.bandText, fontSize: "2.1rem", lineHeight: 1.05 }}>{L.name}</h2><p className="font-semibold" style={{ color: p.bandSub, fontSize: "1.05rem" }}>{L.role}</p></div>
              </div>
              <div style={{ padding: "1.3rem 2rem", borderBottom: `1px solid ${p.line}` }}><Contacts color={p.muted} dir="row" /></div>
              <div style={{ padding: "1.6rem 2rem", display: "flex", gap: "1.7rem" }}>
                <div style={{ width: "62%", ...col("1.3rem") }}><Summary /><Experiences /><Projects /><References /></div>
                <div style={{ width: "38%", ...col("1.3rem") }}><Details /><SkillBars /><Educations /><Languages /><Certifications /><Interests /></div>
              </div>
            </>
          );

        case "elegant":
          return (
            <div style={{ padding: "2.2rem 2.4rem" }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                {data.photo && <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}><Photo size={84} ring={p.line} /></div>}
                <h2 className="font-black" style={{ color: p.ink, fontSize: "2.2rem", letterSpacing: "0.02em" }}>{L.name}</h2>
                <p style={{ color: p.title, fontStyle: "italic", fontSize: "1.05rem", marginTop: "0.15rem" }}>{L.role}</p>
                <div style={{ height: 1, backgroundColor: p.line, margin: "0.9rem auto", width: "60%" }} />
                <div style={{ display: "flex", justifyContent: "center" }}><Contacts color={p.muted} dir="row" /></div>
              </div>
              <div style={col("1.4rem")}>
                <Summary center /><Experiences /><Educations /><Certifications /><Projects />
                <div style={{ display: "flex", gap: "1.6rem" }}><div style={{ flex: 1 }}><SkillChips /></div><div style={{ flex: 1 }}><Languages /></div></div>
                <div style={{ display: "flex", gap: "1.6rem" }}><div style={{ flex: 1 }}><Details /></div><div style={{ flex: 1 }}><Interests /></div></div>
                <References />
              </div>
            </div>
          );

        case "compact":
          return (
            <div style={{ padding: "1.4rem 1.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", borderBottom: `2px solid ${p.accent}`, paddingBottom: "0.8rem", marginBottom: "0.9rem" }}>
                {data.photo && <Photo size={56} ring={p.line} />}
                <div style={{ flex: 1 }}><h2 className="font-black" style={{ color: p.ink, fontSize: "1.4rem", lineHeight: 1.1 }}>{L.name}</h2><p className="text-sm font-semibold" style={{ color: p.title }}>{L.role}</p></div>
              </div>
              <div style={{ marginBottom: "0.9rem" }}><Contacts color={p.muted} dir="row" /></div>
              <div style={{ display: "flex", gap: "1.4rem" }}>
                <div style={{ width: "60%", ...col("1.05rem") }}><Summary /><Experiences /><Projects /><References /></div>
                <div style={{ width: "40%", ...col("1.05rem") }}><Details /><SkillBars /><Educations /><Languages /><Certifications /><Interests /></div>
              </div>
            </div>
          );

        case "minimal":
          return (
            <div style={{ padding: "2.2rem 2.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.4rem" }}>
                {data.photo && <Photo size={64} ring={p.line} />}
                <div><h2 className="font-black" style={{ color: p.ink, fontSize: "2rem", letterSpacing: "-0.01em" }}>{L.name}</h2><p className="font-semibold" style={{ color: p.title }}>{L.role}</p></div>
              </div>
              <div style={{ marginBottom: "1.1rem" }}><Contacts color={p.muted} dir="row" /></div>
              <div style={{ height: 2, backgroundColor: p.accent, width: 48, marginBottom: "1.3rem" }} />
              <div style={col("1.4rem")}>
                <Summary /><Experiences /><Educations />
                <div style={{ display: "flex", gap: "1.6rem" }}><div style={{ flex: 1 }}><SkillChips /></div><div style={{ flex: 1 }}><Languages /></div></div>
                <Certifications /><Projects /><Details /><Interests /><References />
              </div>
            </div>
          );

        case "duo":
          return (
            <div style={{ padding: "1.9rem 2rem" }}>
              <div style={{ marginBottom: "1.3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {data.photo && <Photo size={66} ring={p.line} />}
                  <div style={{ flex: 1 }}><h2 className="font-black" style={{ color: p.ink, fontSize: "1.9rem", lineHeight: 1.1 }}>{L.name}</h2><p className="font-semibold" style={{ color: p.title }}>{L.role}</p></div>
                </div>
                <div style={{ marginTop: "0.6rem" }}><Contacts color={p.muted} dir="row" /></div>
                <div style={{ height: 2, backgroundColor: p.accent, marginTop: "0.9rem" }} />
              </div>
              <div style={{ display: "flex", gap: "1.6rem" }}>
                <div style={{ width: "50%", ...col("1.25rem") }}><Summary /><Experiences /><Projects /></div>
                <div style={{ width: "50%", ...col("1.25rem"), borderLeft: `1px solid ${p.line}`, paddingLeft: "1.5rem" }}><Details /><Educations /><SkillBars /><Languages /><Certifications /><Interests /><References /></div>
              </div>
            </div>
          );

        case "stripe":
          return (
            <div style={{ padding: "1.9rem 2rem 1.9rem 1.7rem" }}>
              <h2 className="font-black" style={{ color: p.ink, fontSize: "2rem", lineHeight: 1.1 }}>{L.name}</h2>
              <p className="font-semibold" style={{ color: p.title, marginBottom: "0.6rem" }}>{L.role}</p>
              <Contacts color={p.muted} dir="row" />
              <div style={{ height: 1, backgroundColor: p.line, margin: "1.1rem 0" }} />
              <div style={col("1.35rem")}>
                <Summary /><Experiences /><Educations /><Certifications /><Projects />
                <div style={{ display: "flex", gap: "1.6rem" }}><div style={{ flex: 1 }}><SkillBars /></div><div style={{ flex: 1 }}><Languages /></div></div>
                <Details /><Interests /><References />
              </div>
            </div>
          );

        case "executive":
          return (
            <div style={{ padding: "2rem 2.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", borderBottom: `2px solid ${p.ink}`, paddingBottom: "0.9rem", marginBottom: "1.3rem" }}>
                <div>
                  <h2 className="font-black" style={{ color: p.ink, fontSize: "2.1rem", lineHeight: 1.05, letterSpacing: "0.02em" }}>{L.name}</h2>
                  <p className="font-semibold" style={{ color: p.title, fontSize: "1.05rem" }}>{L.role}</p>
                </div>
                <div style={{ textAlign: "right" }}><Contacts color={p.sub} dir="col" /></div>
              </div>
              <div style={col("1.4rem")}>
                <Summary /><Experiences /><Educations /><Certifications /><Projects />
                <div style={{ display: "flex", gap: "1.6rem" }}><div style={{ flex: 1 }}><SkillChips /></div><div style={{ flex: 1 }}><Languages /></div></div>
                <Details /><Interests /><References />
              </div>
            </div>
          );

        case "grid": {
          const cardWrap = (node: React.ReactNode, i: number) =>
            node ? <div key={i} style={{ border: `1px solid ${p.line}`, borderRadius: "0.6rem", padding: "0.9rem 1rem", breakInside: "avoid" }}>{node}</div> : null;
          const cards = [<Educations key="ed" />, <SkillBars key="sk" />, <Languages key="lg" />, <Certifications key="ce" />, <Projects key="pr" />, <Details key="dt" />, <Interests key="in" />, <References key="rf" />]
            .map((n, i) => cardWrap(n, i)).filter(Boolean);
          return (
            <div>
              <div style={{ backgroundColor: p.band, padding: "1.7rem 2rem", display: "flex", alignItems: "center", gap: "1.1rem" }}>
                {data.photo && <Photo size={74} ring="rgba(255,255,255,0.55)" />}
                <div style={{ flex: 1 }}><h2 className="text-2xl font-black" style={{ color: p.bandText }}>{L.name}</h2><p className="font-medium" style={{ color: p.bandSub }}>{L.role}</p><div style={{ marginTop: "0.4rem" }}><Contacts color={p.bandSub} dir="row" /></div></div>
              </div>
              <div style={{ padding: "1.5rem 2rem", ...col("1rem") }}>
                {data.summary && <div style={{ border: `1px solid ${p.line}`, borderRadius: "0.6rem", padding: "0.9rem 1rem" }}><Summary /></div>}
                <div style={{ border: `1px solid ${p.line}`, borderRadius: "0.6rem", padding: "0.9rem 1rem" }}><Experiences /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>{cards}</div>
              </div>
            </div>
          );
        }

        case "banner":
          return (
            <div>
              <div style={{ backgroundColor: p.band, padding: "2.2rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
                {data.photo ? <Photo size={92} ring="rgba(255,255,255,0.65)" /> : (
                  <span style={{ width: 80, height: 80, borderRadius: 9999, border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", color: p.bandText, fontSize: "1.75rem", fontWeight: 800 }}>{initials || "CV"}</span>
                )}
                <div><h2 className="font-black" style={{ color: p.bandText, fontSize: "2rem", lineHeight: 1.05 }}>{L.name}</h2><p className="font-medium" style={{ color: p.bandSub }}>{L.role}</p></div>
                <Contacts color={p.bandSub} dir="row" />
              </div>
              <div style={{ padding: "1.8rem 2rem", display: "flex", gap: "1.7rem" }}>
                <div style={{ width: "62%", ...col("1.3rem") }}><Summary /><Experiences /><Projects /><References /></div>
                <div style={{ width: "38%", ...col("1.3rem") }}><Details /><Educations /><SkillBars /><Languages /><Certifications /><Interests /></div>
              </div>
            </div>
          );

        case "classic":
        case "timeline":
        default:
          return (
            <>
              <div style={{ backgroundColor: p.band, padding: "1.7rem 2rem", display: "flex", alignItems: "center", gap: "1.1rem" }}>
                {data.photo && <Photo size={78} ring="rgba(255,255,255,0.55)" />}
                <div style={{ flex: 1 }}>
                  <h2 className="text-2xl font-black" style={{ color: p.bandText }}>{L.name}</h2>
                  <p className="font-medium" style={{ color: p.bandSub }}>{L.role}</p>
                  <div style={{ marginTop: "0.45rem" }}><Contacts color={p.bandSub} dir="row" /></div>
                </div>
              </div>
              <div style={{ padding: "1.8rem 2rem", ...col("1.4rem") }}>
                <Summary />
                <Experiences timeline={template.layout === "timeline"} />
                <Educations /><Certifications /><Projects />
                <div style={{ display: "flex", gap: "1.6rem" }}><div style={{ flex: 1 }}><SkillBars /></div><div style={{ flex: 1 }}><Languages /></div></div>
                <Details /><Interests /><References />
              </div>
            </>
          );
      }
    };

    const stripeBorder = template.layout === "stripe" ? { borderLeft: `8px solid ${p.accent}` } : {};

    return (
      <div ref={ref} className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: "#ffffff", color: p.ink, minHeight: "600px", fontFamily: template.font, ...stripeBorder }}>
        {renderBody()}
      </div>
    );
  }
);
