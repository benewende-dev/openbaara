import Link from "next/link";
import { prisma } from "@/lib/db";
import { CAN_EDIT, requireAdmin } from "@/lib/admin/auth";
import { CATEGORIES } from "@/lib/journal/format";
import { createArticle } from "../../articles-actions";
import { ActionForm, Submit } from "../../_components/forms";
import { fmtDate } from "../../_components/format";

export const metadata = { title: "Articles du Journal" };

export default async function ArticlesPage() {
  const admin = await requireAdmin();
  const canEdit = CAN_EDIT.includes(admin.role);
  const articles = await prisma.article.findMany({ orderBy: [{ status: "asc" }, { updatedAt: "desc" }] });

  return (
    <>
      <div className="head">
        <div>
          <h1>Articles du Journal</h1>
          <p className="muted" style={{ margin: "4px 0 0" }}>
            Un article commence en brouillon. Une fois publié, il apparaît sur le site, dans le plan du site, le flux RSS et le fichier lu par les moteurs IA.
          </p>
        </div>
      </div>
      <div className="cols2 wide">
        <table className="t">
          <thead><tr><th>Article</th><th>Catégorie</th><th>Statut</th><th>Mise à jour</th></tr></thead>
          <tbody>
            {articles.length === 0 && <tr><td colSpan={4} className="muted">Aucun article pour l&apos;instant.</td></tr>}
            {articles.map((a) => (
              <tr key={a.id}>
                <td><Link href={`/admin/articles/${a.id}`} style={{ fontWeight: 500, textDecoration: "none" }}>{a.titleFr}</Link><div className="small muted mono">/journal/{a.slug}</div></td>
                <td className="small">{CATEGORIES[a.category]?.fr ?? a.category}</td>
                <td><span className={`pill ${a.status === "published" ? "ok" : "warn"}`}>{a.status === "published" ? `Publié le ${fmtDate(a.publishedAt)}` : "Brouillon"}</span>{a.titleEn && a.bodyEn ? <span className="pill" style={{ marginLeft: 6 }}>EN</span> : null}</td>
                <td className="small muted">{fmtDate(a.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {canEdit && (
          <section className="card">
            <h2>Nouvel article</h2>
            <ActionForm action={createArticle}>
              <label className="f">Titre<input className="i" name="titleFr" required minLength={8} placeholder="Ce que le paiement instantané change pour les PME" /></label>
              <label className="f">Catégorie
                <select className="i" name="category" defaultValue="studio">
                  {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.fr}</option>)}
                </select>
              </label>
              <Submit>Créer le brouillon</Submit>
            </ActionForm>
          </section>
        )}
      </div>
    </>
  );
}
