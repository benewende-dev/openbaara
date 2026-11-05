import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/db";
import { requireLearner } from "@/lib/learner/auth";
import { getLearnerCourses } from "@/lib/courses/access";
import { formatXof } from "@/lib/shop/pricing";
import { Arrow } from "@/components/site/Arrow";
import { langOf } from "@/components/site/lang";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

const COPY = {
  fr: {
    title: "Mon espace", hello: (n: string) => `Bonjour ${n}`, out: "Se déconnecter",
    courses: "Mes cours", none: "Vous n'avez pas encore de cours.", browse: "Voir l'Academy",
    preparing: "Le contenu est en préparation. Votre accès est réservé : les leçons apparaîtront ici dès leur mise en ligne.",
    progress: (d: number, t: number) => `${d} leçon${d > 1 ? "s" : ""} terminée${d > 1 ? "s" : ""} sur ${t}`,
    start: "Commencer", resume: "Continuer", review: "Revoir",
    receipts: "Reçus", cols: ["Date", "Achat", "Référence", "Montant"], noReceipts: "Aucun paiement pour l'instant.",
  },
  en: {
    title: "My space", hello: (n: string) => `Hello ${n}`, out: "Sign out",
    courses: "My courses", none: "You don't have any courses yet.", browse: "See the Academy",
    preparing: "The content is being prepared. Your access is reserved: lessons will appear here as soon as they are online.",
    progress: (d: number, t: number) => `${d} of ${t} lesson${t > 1 ? "s" : ""} completed`,
    start: "Start", resume: "Continue", review: "Review",
    receipts: "Receipts", cols: ["Date", "Purchase", "Reference", "Amount"], noReceipts: "No payments yet.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: COPY[await langOf(params)].title, robots: { index: false } };
}

export default async function LearnerHome({ params }: { params: Promise<{ locale: string }> }) {
  const lang = await langOf(params);
  const c = COPY[lang];
  const learner = await requireLearner(lang);
  const [courses, orders] = await Promise.all([
    getLearnerCourses(learner.id),
    prisma.order.findMany({ where: { customerId: learner.id, status: "paid" }, include: { items: true }, orderBy: { paidAt: "desc" } }),
  ]);
  const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { dateStyle: "medium", timeZone: "Africa/Abidjan" });
  const firstName = learner.name.split(" ")[0];

  return (
    <div className="wrap flex flex-col gap-16 pt-14 pb-28 md:pt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="h1">{c.hello(firstName)}</h1>
        <form action={logout}>
          <input type="hidden" name="locale" value={lang} />
          <button type="submit" className="link small bg-transparent">{c.out}</button>
        </form>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="h3">{c.courses}</h2>
        {courses.length === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="body">{c.none}</p>
            <Link href="/academy" className="link">{c.browse} <Arrow /></Link>
          </div>
        ) : (
          <ul className="m-0 list-none p-0">
            {courses.map(({ product, total, completed, next }) => {
              const pct = total ? Math.round((completed / total) * 100) : 0;
              const cta = total === 0 ? null : completed === 0 ? c.start : completed === total ? c.review : c.resume;
              return (
                <li key={product.id} className="grid items-center gap-3 border-t border-[var(--line)] py-5 md:grid-cols-[1.4fr_1fr_auto] md:gap-8">
                  <span className="flex flex-col gap-1">
                    <span className="font-semibold">{lang === "en" ? product.nameEn : product.nameFr}</span>
                    <span className="small muted">{total === 0 ? c.preparing : c.progress(completed, total)}</span>
                  </span>
                  {total > 0 ? (
                    <span className="flex items-center gap-3" aria-hidden="true">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg2)]">
                        <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="small num w-10 text-right">{pct} %</span>
                    </span>
                  ) : (
                    <span className="hide-sm" />
                  )}
                  {cta && next ? (
                    <Link href={`/espace/cours/${product.slug}/${next.id}`} className="btn btn-s justify-self-start md:justify-self-end">{cta}</Link>
                  ) : (
                    <span />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="h3">{c.receipts}</h2>
        {orders.length === 0 ? (
          <p className="body">{c.noReceipts}</p>
        ) : (
          <table className="dtable">
            <thead>
              <tr>{c.cols.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="num !text-[15px] !font-normal">{o.paidAt ? date.format(o.paidAt) : ""}</td>
                  <td>{o.items.map((i) => i.name).join(", ")}</td>
                  <td className="mono">{o.ref}</td>
                  <td className="num !text-[var(--fg)]">{formatXof(o.totalXof)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
