import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CAN_EDIT, requireAdmin } from "@/lib/admin/auth";
import { CATEGORIES, formatFaq, readingMinutes, type FaqItem } from "@/lib/journal/format";
import { ventures } from "@/data/ventures";
import { ArticleBody } from "@/components/journal/ArticleBody";
import { deleteArticle, publishArticle, unpublishArticle, updateArticle } from "../../../articles-actions";
import { ActionForm, Submit } from "../../../_components/forms";
import { fmtDate } from "../../../_components/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await prisma.article.findUnique({ where: { id }, select: { titleFr: true } });
  return { title: a?.titleFr ?? "Article" };
}

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const canEdit = CAN_EDIT.includes(admin.role);
  const { id } = await params;
  const a = await prisma.article.findUnique({ where: { id } });
  if (!a) notFound();
  const faq = (a.faq ?? []) as FaqItem[];
  const published = a.status === "published";

  return (
    <>
      <p className="small" style={{ margin: "0 0 8px" }}><Link href="/admin/articles" className="muted">Articles du Journal</Link> / {a.titleFr}</p>
      <div className="head">
        <div>
          <h1>{a.titleFr}</h1>
          <p className="muted" style={{ margin: "4px 0 0" }}>
            {published ? <>Publié le {fmtDate(a.publishedAt)} · <a href={`/fr/journal/${a.slug}`} target="_blank" rel="noopener">voir sur le site</a></> : "Brouillon, invisible sur le site"} · {readingMinutes(a.bodyFr)} min de lecture
          </p>
        </div>
        {canEdit && (
          <div className="row">
            {published ? (
              <form action={unpublishArticle}><input type="hidden" name="articleId" value={a.id} /><button className="btn">Retirer du site</button></form>
            ) : (
              <>
                <ActionForm action={publishArticle} className="row">
                  <input type="hidden" name="articleId" value={a.id} />
                  <Submit>Publier</Submit>
                </ActionForm>
                <form action={deleteArticle}><input type="hidden" name="articleId" value={a.id} /><button className="btn ghost">Supprimer le brouillon</button></form>
              </>
            )}
          </div>
        )}
      </div>

      <div className="cols2 wide">
        <section className="card">
          <ActionForm action={updateArticle}>
            <input type="hidden" name="articleId" value={a.id} />
            <fieldset disabled={!canEdit} style={{ border: 0, padding: 0, margin: 0 }} className="stack">
              <label className="f">Titre<input className="i" name="titleFr" defaultValue={a.titleFr} required /></label>
              <div className="cols2">
                <label className="f">Adresse<input className="i mono" name="slug" defaultValue={a.slug} required /></label>
                <label className="f">Catégorie
                  <select className="i" name="category" defaultValue={a.category}>
                    {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.fr}</option>)}
                  </select>
                </label>
              </div>
              <div className="cols2">
                <label className="f">Venture concernée
                  <select className="i" name="ventureSlug" defaultValue={a.ventureSlug ?? ""}>
                    <option value="">Aucune</option>
                    {ventures.map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}
                  </select>
                </label>
                <label className="f">Auteur<input className="i" name="authorName" defaultValue={a.authorName} required /></label>
              </div>
              <label className="f">Résumé : la réponse en deux ou trois phrases (repris par Google et les moteurs IA)
                <textarea className="i" name="excerptFr" rows={3} maxLength={500} defaultValue={a.excerptFr} />
              </label>
              <label className="f">Texte en Markdown (## Intertitre, **gras**, - liste, [lien](https://…))
                <textarea className="i mono" name="bodyFr" rows={22} defaultValue={a.bodyFr} style={{ fontSize: 13 }} />
              </label>
              <label className="f">Questions fréquentes : chaque question commence par « ? », la réponse suit
                <textarea className="i" name="faqFr" rows={6} defaultValue={formatFaq(faq.map((f) => ({ q: f.q.fr, a: f.a.fr })))} placeholder={"? Qu'est-ce qu'un studio de ventures ?\nUne structure qui fonde et construit plusieurs entreprises."} />
              </label>
              <details>
                <summary style={{ cursor: "pointer" }}>Version anglaise (facultative)</summary>
                <div className="stack" style={{ marginTop: 12 }}>
                  <label className="f">Titre (anglais)<input className="i" name="titleEn" defaultValue={a.titleEn ?? ""} /></label>
                  <label className="f">Résumé (anglais)<textarea className="i" name="excerptEn" rows={3} maxLength={500} defaultValue={a.excerptEn ?? ""} /></label>
                  <label className="f">Texte (anglais)<textarea className="i mono" name="bodyEn" rows={14} defaultValue={a.bodyEn ?? ""} style={{ fontSize: 13 }} /></label>
                  <label className="f">Questions fréquentes (anglais, même ordre)
                    <textarea className="i" name="faqEn" rows={5} defaultValue={formatFaq(faq.filter((f) => f.q.en !== f.q.fr).map((f) => ({ q: f.q.en, a: f.a.en })))} />
                  </label>
                </div>
              </details>
              {canEdit && <Submit>Enregistrer</Submit>}
            </fieldset>
          </ActionForm>
        </section>

        <section className="card stack">
          <h2>Aperçu</h2>
          <p className="small muted" style={{ margin: 0 }}>{CATEGORIES[a.category]?.fr} · {a.authorName}</p>
          <h3 style={{ margin: 0, fontSize: 22 }}>{a.titleFr}</h3>
          {a.excerptFr ? <p style={{ margin: 0, fontWeight: 500 }}>{a.excerptFr}</p> : <p className="msg err" style={{ margin: 0 }}>Résumé manquant</p>}
          {a.bodyFr ? <ArticleBody markdown={a.bodyFr} /> : <p className="muted">Texte vide.</p>}
          {faq.length > 0 && (
            <div className="stack">
              <h3 style={{ margin: 0 }}>Questions fréquentes</h3>
              {faq.map((f) => <div key={f.q.fr}><strong>{f.q.fr}</strong><p style={{ margin: "4px 0 0" }}>{f.a.fr}</p></div>)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
