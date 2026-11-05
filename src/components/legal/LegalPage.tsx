import type { ReactNode } from "react";

export type LegalSection = {
  heading: string;
  /** Each entry is a paragraph; arrays render as bullet lists. */
  body: (string | string[])[];
};

export type LegalContent = {
  title: string;
  updatedLabel: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
};

function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed text-muted dark:text-muted-dark">
      {children}
    </p>
  );
}

export function LegalPage({ title, updatedLabel, updated, intro, sections }: LegalContent) {
  return (
    <div className="section-padding">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <header className="mb-12">
          <span className="kicker text-primary">{updatedLabel}</span>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted dark:text-muted-dark">{updated}</p>
          {intro && (
            <p className="mt-6 text-base leading-relaxed text-muted dark:text-muted-dark">
              {intro}
            </p>
          )}
        </header>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-display text-xl font-semibold mb-3">{section.heading}</h2>
              <div className="space-y-3">
                {section.body.map((block, j) =>
                  Array.isArray(block) ? (
                    <ul
                      key={j}
                      className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted dark:text-muted-dark marker:text-primary"
                    >
                      {block.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <Paragraph key={j}>{block}</Paragraph>
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
