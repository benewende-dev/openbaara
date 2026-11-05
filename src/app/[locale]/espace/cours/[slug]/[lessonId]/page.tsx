import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/db";
import { getLearner } from "@/lib/learner/auth";
import { canOpen, getCourse } from "@/lib/courses/access";
import { signedEmbedUrl } from "@/lib/courses/video";
import { Arrow } from "@/components/site/Arrow";
import { toggleDone } from "../../../actions";

export const dynamic = "force-dynamic";

const COPY = {
  fr: {
    program: "Programme du cours", mySpace: "Mon espace",
    kinds: { video: "Vidéo", text: "Lecture", exercise: "Exercice" },
    min: (n: number) => `${n} min`, preview: "Aperçu gratuit",
    videoSoon: "Vidéo en préparation", videoSoonP: "Elle sera disponible ici dès sa mise en ligne.",
    locked: "Leçon réservée aux inscrits", lockedP: "Achetez le cours pour ouvrir toutes les leçons.", buy: "Voir le cours dans l'Academy",
    done: "Terminée", markDone: "Marquer comme terminée", next: "Leçon suivante", prev: "Leçon précédente",
  },
  en: {
    program: "Course outline", mySpace: "My space",
    kinds: { video: "Video", text: "Reading", exercise: "Exercise" },
    min: (n: number) => `${n} min`, preview: "Free preview",
    videoSoon: "Video in preparation", videoSoonP: "It will be available here as soon as it is online.",
    locked: "Lesson for enrolled learners", lockedP: "Buy the course to open every lesson.", buy: "See the course in the Academy",
    done: "Completed", markDone: "Mark as completed", next: "Next lesson", prev: "Previous lesson",
  },
};

type Params = { params: Promise<{ locale: string; slug: string; lessonId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { titleFr: true, titleEn: true, published: true } });
  const title = lesson?.published ? (locale === "en" ? lesson.titleEn : lesson.titleFr) : undefined;
  return { title, robots: { index: false } };
}

export default async function LessonPage({ params }: Params) {
  const { locale, slug, lessonId } = await params;
  const lang = locale === "en" ? "en" : "fr";
  const c = COPY[lang];
  const learner = await getLearner();
  const course = await getCourse(slug, learner?.id ?? null);
  if (!course) notFound();
  const idx = course.flat.findIndex((l) => l.id === lessonId);
  if (idx < 0) notFound();
  const lesson = course.flat[idx];
  const open = canOpen(lesson, course.owned);
  if (!open && !learner) redirect(`/${lang}/espace/connexion`);

  const t = (fr: string, en: string) => (lang === "en" ? en : fr);
  const video = open && lesson.videoId ? signedEmbedUrl(lesson.videoId) : null;
  const body = t(lesson.bodyFr, lesson.bodyEn).trim();
  const prev = course.flat[idx - 1];
  const next = course.flat[idx + 1];
  const isDone = course.done.has(lesson.id);

  return (
    <div className="wrap grid gap-10 pt-8 pb-24 md:grid-cols-[300px_1fr] md:gap-12">
      <aside aria-label={c.program} className="flex flex-col gap-6 md:sticky md:top-24 md:self-start">
        <div className="flex flex-col gap-1">
          <Link href="/espace" className="link small !text-[var(--muted)] self-start">← {c.mySpace}</Link>
          <span className="font-semibold">{t(course.product.nameFr, course.product.nameEn)}</span>
        </div>
        {course.modules.map((m) => (
          <div key={m.id} className="flex flex-col gap-1">
            <span className="label pb-1">{t(m.titleFr, m.titleEn)}</span>
            {m.lessons.map((l) => {
              const current = l.id === lesson.id;
              const done = course.done.has(l.id);
              const reachable = canOpen(l, course.owned);
              return (
                <Link
                  key={l.id}
                  href={`/espace/cours/${slug}/${l.id}`}
                  aria-current={current ? "step" : undefined}
                  className="grid grid-cols-[18px_1fr] items-start gap-2.5 rounded-md px-2 py-2 text-sm no-underline aria-[current=step]:bg-[var(--bg2)] aria-[current=step]:font-semibold"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border text-[11px]"
                    style={{ borderColor: done ? "var(--accent)" : "var(--line2)", background: done ? "var(--accent)" : "transparent", color: "var(--accent-fg)" }}
                  >
                    {done ? "✓" : ""}
                  </span>
                  <span className="flex flex-col">
                    <span className={reachable ? "" : "muted"}>{t(l.titleFr, l.titleEn)}</span>
                    <span className="small muted">
                      {c.kinds[l.kind]}
                      {l.durationMin ? ` · ${c.min(l.durationMin)}` : ""}
                      {!course.owned && l.freePreview ? ` · ${c.preview}` : ""}
                      {!reachable ? " · 🔒" : ""}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </aside>

      <main className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="small muted">{t(lesson.module.titleFr, lesson.module.titleEn)}</span>
          <h1 className="h2">{t(lesson.titleFr, lesson.titleEn)}</h1>
        </div>

        {!open ? (
          <div className="notice">
            <span className="h3">{c.locked}</span>
            <span className="body">{c.lockedP}</span>
            <Link href="/academy" className="link mt-1 self-start">{c.buy} <Arrow /></Link>
          </div>
        ) : (
          <>
            {lesson.kind === "video" &&
              (video ? (
                <div className="overflow-hidden rounded-[10px] bg-black" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={video}
                    title={t(lesson.titleFr, lesson.titleEn)}
                    className="h-full w-full border-0"
                    loading="lazy"
                    allow="accelerometer; gyroscope; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[var(--line2)] bg-[var(--bg2)] p-8 text-center" style={{ aspectRatio: "16/9" }}>
                  <span className="h3">{c.videoSoon}</span>
                  <span className="body small">{c.videoSoonP}</span>
                </div>
              ))}
            {body && (
              <div className="flex max-w-[68ch] flex-col gap-4">
                {body.split(/\n\s*\n/).map((p, k) => (
                  <p key={k} className="body whitespace-pre-line">{p}</p>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-6">
              {learner && course.owned && (
                <form action={toggleDone}>
                  <input type="hidden" name="locale" value={lang} />
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <button type="submit" aria-pressed={isDone} className={`btn ${isDone ? "btn-s" : "btn-p"}`}>
                    {isDone ? `✓ ${c.done}` : c.markDone}
                  </button>
                </form>
              )}
              {prev && <Link href={`/espace/cours/${slug}/${prev.id}`} className="btn btn-s">← {c.prev}</Link>}
              {next && <Link href={`/espace/cours/${slug}/${next.id}`} className="btn btn-s">{c.next} →</Link>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
