import { PROGRESS_DATE, ventureProgress, type Venture } from "@/data/ventures";

const COPY = {
  fr: { label: "Avancement", estimated: "estimation", paused: "En pause", asOf: (d: string) => `au ${d}` },
  en: { label: "Progress", estimated: "estimate", paused: "Paused", asOf: (d: string) => `as of ${d}` },
};

/** Barre d'avancement d'une venture : même règle pour toutes, base affichée en dessous si demandé. */
export function ProgressBar({ venture, lang, detailed = false }: { venture: Venture; lang: "fr" | "en"; detailed?: boolean }) {
  const c = COPY[lang];
  const { pct, estimated } = ventureProgress(venture);
  const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(PROGRESS_DATE);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 small">
        <span className="muted">
          {c.label}
          {venture.paused && <span className="ml-2 rounded border border-[var(--line2)] px-1.5 py-px text-[12px] text-[var(--fg)]">{c.paused}</span>}
        </span>
        <span className="num font-semibold">
          {pct} %{estimated && <span className="muted font-normal"> · {c.estimated}</span>}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${c.label} ${venture.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-1.5 overflow-hidden rounded-full bg-[var(--bg2)]"
      >
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: venture.paused ? "var(--muted)" : "var(--fg)" }} />
      </div>
      {detailed && (
        <p className="small muted m-0">
          {venture.progress.basis[lang]} ({c.asOf(date)})
        </p>
      )}
    </div>
  );
}
