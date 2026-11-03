import { prisma } from "@/lib/db";
import { CAN_EDIT, requireAdmin } from "@/lib/admin/auth";
import { createPromo, togglePromo } from "../../actions";
import { ActionForm, ScopeFields, Submit } from "../../_components/forms";
import { fmtDate, formatXof } from "../../_components/format";

export const metadata = { title: "Codes promo" };

export default async function PromosPage() {
  const admin = await requireAdmin();
  const canEdit = CAN_EDIT.includes(admin.role);
  const now = new Date();
  const [promos, products] = await Promise.all([
    prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { purchasable: true }, orderBy: { sortOrder: "asc" }, select: { slug: true, nameFr: true } }),
  ]);
  const names = Object.fromEntries(products.map((p) => [p.slug, p.nameFr]));

  const state = (p: (typeof promos)[number]) => {
    if (!p.active) return ["Désactivé", ""];
    if (p.endsAt && p.endsAt < now) return ["Expiré", ""];
    if (p.startsAt && p.startsAt > now) return ["Programmé", "warn"];
    if (p.maxUses != null && p.usedCount >= p.maxUses) return ["Épuisé", ""];
    return ["Actif", "ok"];
  };

  return (
    <>
      <div className="head"><div><h1>Codes promo</h1><p className="muted" style={{ margin: "4px 0 0" }}>La remise est recalculée par le serveur au paiement ; un code n&apos;est compté qu&apos;une fois la commande payée.</p></div></div>
      <div style={{ display: "grid", gridTemplateColumns: canEdit ? "1.6fr 1fr" : "1fr", gap: 16, alignItems: "start" }}>
        {promos.length ? (
          <table className="t">
            <thead><tr><th>Code</th><th>Remise</th><th>Produits</th><th>Validité</th><th className="r">Utilisations</th><th></th></tr></thead>
            <tbody>
              {promos.map((p) => {
                const [label, tone] = state(p);
                return (
                  <tr key={p.id}>
                    <td><span className="mono" style={{ fontWeight: 600 }}>{p.code}</span>{p.note && <div className="small muted">{p.note}</div>}</td>
                    <td className="num">{p.kind === "percent" ? `${p.value} %` : formatXof(p.value)}</td>
                    <td className="small">{p.productSlugs.length ? p.productSlugs.map((s) => names[s] ?? s).join(", ") : "Tout le catalogue"}{p.onePerCustomer && <div className="muted">Une fois par client</div>}</td>
                    <td className="small">{p.startsAt || p.endsAt ? `${p.startsAt ? `du ${fmtDate(p.startsAt)} ` : ""}${p.endsAt ? `au ${fmtDate(p.endsAt)}` : ""}` : "Sans limite"}<div><span className={`pill ${tone}`}>{label}</span></div></td>
                    <td className="r num">{p.usedCount}{p.maxUses != null ? ` / ${p.maxUses}` : ""}</td>
                    <td className="r">{canEdit && <form action={togglePromo}><input type="hidden" name="promoId" value={p.id} /><button className="btn sm">{p.active ? "Désactiver" : "Réactiver"}</button></form>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <div className="card empty">Aucun code pour l&apos;instant.</div>}

        {canEdit && (
          <section className="card">
            <h2>Nouveau code</h2>
            <ActionForm action={createPromo}>
              <label className="f">Code<input className="i mono" name="code" placeholder="LANCEMENT" required style={{ textTransform: "uppercase" }} /></label>
              <div className="cols2">
                <label className="f">Type<select className="i" name="kind"><option value="percent">Pourcentage</option><option value="fixed">Montant fixe (F CFA)</option></select></label>
                <label className="f">Valeur<input className="i num" name="value" type="number" min={1} required placeholder="15" /></label>
              </div>
              <ScopeFields products={products.map((p) => ({ slug: p.slug, name: p.nameFr }))} />
              <div className="cols2">
                <label className="f">Début (facultatif)<input className="i" type="date" name="startsAt" /></label>
                <label className="f">Fin (facultatif)<input className="i" type="date" name="endsAt" /></label>
              </div>
              <label className="f">Utilisations maximum (facultatif)<input className="i num" name="maxUses" type="number" min={1} placeholder="Illimité" /></label>
              <label className="small" style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="onePerCustomer" /> Une seule utilisation par client</label>
              <label className="f">Note interne<input className="i" name="note" placeholder="Campagne de rentrée" /></label>
              <Submit>Créer le code</Submit>
            </ActionForm>
          </section>
        )}
      </div>
    </>
  );
}
