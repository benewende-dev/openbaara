import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getLearner } from "@/lib/learner/auth";
import { getCourse } from "@/lib/courses/access";
import { Arrow } from "@/components/site/Arrow";

export const dynamic = "force-dynamic";

const COPY = {
  fr: { preparing: "Le contenu de ce cours est en préparation.", reserved: "Votre accès est réservé : les leçons apparaîtront dans votre espace dès leur mise en ligne.", back: "Mon espace" },
  en: { preparing: "This course's content is being prepared.", reserved: "Your access is reserved: lessons will appear in your space as soon as they are online.", back: "My space" },
};

/** Entrée d'un cours : ouvre la première leçon non terminée. */
export default async function CourseEntry({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale === "en" ? "en" : "fr";
  const learner = await getLearner();
  const course = await getCourse(slug, learner?.id ?? null);
  if (!course) notFound();
  const next = course.flat.find((l) => !course.done.has(l.id)) ?? course.flat[0];
  if (next) redirect(`/${lang}/espace/cours/${slug}/${next.id}`);
  const c = COPY[lang];
  return (
    <div className="wrap flex max-w-[640px] flex-col gap-5 pt-16 pb-28 md:pt-24">
      <h1 className="h2">{lang === "en" ? course.product.nameEn : course.product.nameFr}</h1>
      <p className="lead">{c.preparing}</p>
      {course.owned && <p className="body">{c.reserved}</p>}
      <Link href="/espace" className="link self-start">{c.back} <Arrow /></Link>
    </div>
  );
}
