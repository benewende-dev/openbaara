import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CAN_EDIT, requireAdmin } from "@/lib/admin/auth";
import { currentPrice } from "@/lib/shop/pricing";
import { cancelScheduledPrice, setPrice, updateProduct } from "../../../actions";
import { ActionForm, Submit, WhenFields } from "../../../_components/forms";
import { CATEGORY, KIND, fmtDateTime, formatXof } from "../../../_components/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { id }, select: { nameFr: true } });
  return { title: p?.nameFr ?? "Produit" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const canEdit = CAN_EDIT.includes(admin.role);
  const { id } = await params;
  const p = await prisma.product.findUnique({
    where: { id },
    include: { prices: { orderBy: { validFrom: "desc" }, include: { createdBy: true } } },
  });
  if (!p) notFound();
  const now = new Date();
  const cur = currentPrice(p.prices, now);
  const features = (p.features as { fr: string; en: string }[]) ?? [];

  return (
    <>
      <p className="small" style={{ margin: "0 0 8px" }}><Link href="/admin/catalogue" className="muted">Forfaits et produits</Link> / {p.nameFr}</p>
      <div className="head">
        <div><h1>{p.nameFr}</h1><p className="muted" style={{ margin: "4px 0 0" }}>{KIND[p.kind]}, {CATEGORY[p.category] ?? p.category} · <span className="mono">{p.slug}</span></p></div>
        <div style={{ textAlign: "right" }}><div className="small muted">Prix en vigueur</div><div className="num" style={{ fontSize: 24, fontWeight: 600 }}>{cur ? formatXof(cur.amountXof) : "Aucun"}</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, alignItems: "start" }}>
        <div className="stack">
          {canEdit && (
            <section className="card">
              <h2>Changer le prix</h2>
              <ActionForm action={setPrice}>
                <input type="hidden" name="productId" value={p.id} />
                <label className="f">Nouveau prix (F CFA, vide = sur devis)<input className="i num" name="amount" inputMode="numeric" placeholder="950000" /></label>
                <WhenFields />
                <label className="f">Note interne<input className="i" name="note" placeholder="Hausse annuelle, offre de lancement…" /></label>
                <Submit>Enregistrer le prix</Submit>
              </ActionForm>
            </section>
          )}
          <section className="card">
            <h2>Historique des prix</h2>
            <table className="t" style={{ border: 0 }}>
              <tbody>
                {p.prices.map((pr) => {
                  const future = pr.validFrom > now;
                  return (
                    <tr key={pr.id}>
                      <td className="num">{formatXof(pr.amountXof)}</td>
                      <td className="small">{future ? <span className="pill warn">Programmé</span> : pr.id === cur?.id ? <span className="pill ok">En vigueur</span> : <span className="muted">Ancien</span>}</td>
                      <td className="small muted">{fmtDateTime(pr.validFrom)}{pr.createdBy ? `, ${pr.createdBy.name}` : ""}{pr.note ? <div>{pr.note}</div> : null}</td>
                      <td className="r">{future && canEdit && (
                        <form action={cancelScheduledPrice}><input type="hidden" name="priceId" value={pr.id} /><button className="btn sm ghost">Annuler</button></form>
                      )}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>

        <section className="card">
          <h2>Fiche</h2>
          <ActionForm action={updateProduct}>
            <input type="hidden" name="productId" value={p.id} />
            <fieldset disabled={!canEdit} style={{ border: 0, padding: 0, margin: 0 }} className="stack">
              <div className="cols2">
                <label className="f">Nom (français)<input className="i" name="nameFr" defaultValue={p.nameFr} required /></label>
                <label className="f">Nom (anglais)<input className="i" name="nameEn" defaultValue={p.nameEn} required /></label>
                <label className="f">Délai (français)<input className="i" name="deliveryFr" defaultValue={p.deliveryFr ?? ""} placeholder="5 semaines" /></label>
                <label className="f">Délai (anglais)<input className="i" name="deliveryEn" defaultValue={p.deliveryEn ?? ""} placeholder="5 weeks" /></label>
                <label className="f">Pour qui (français)<input className="i" name="audienceFr" defaultValue={p.audienceFr ?? ""} /></label>
                <label className="f">Pour qui (anglais)<input className="i" name="audienceEn" defaultValue={p.audienceEn ?? ""} /></label>
              </div>
              <label className="f">Description (français)<textarea className="i" name="descriptionFr" defaultValue={p.descriptionFr} /></label>
              <label className="f">Description (anglais)<textarea className="i" name="descriptionEn" defaultValue={p.descriptionEn} /></label>
              <div className="cols2">
                <label className="f">Contenu inclus (français, une ligne par point)<textarea className="i" name="featuresFr" rows={6} defaultValue={features.map((f) => f.fr).join("\n")} /></label>
                <label className="f">Contenu inclus (anglais, même ordre)<textarea className="i" name="featuresEn" rows={6} defaultValue={features.map((f) => f.en).join("\n")} /></label>
              </div>
              <label className="f" style={{ maxWidth: 160 }}>Ordre d&apos;affichage<input className="i num" name="sortOrder" type="number" min={0} defaultValue={p.sortOrder} /></label>
              {canEdit && <div><Submit>Enregistrer la fiche</Submit></div>}
            </fieldset>
          </ActionForm>
        </section>
      </div>
    </>
  );
}
