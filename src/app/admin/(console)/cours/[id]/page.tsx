import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CAN_EDIT, requireAdmin } from "@/lib/admin/auth";
import { isVideoConfigured } from "@/lib/courses/video";
import { addLesson, addModule, deleteLesson, deleteModule, grantAccess, revokeAccess, updateLesson, updateModule } from "../../../cours-actions";
import { ActionForm, Submit } from "../../../_components/forms";
import { fmtDate } from "../../../_components/format";

const KIND = { video: "Vidéo", text: "Lecture", exercise: "Exercice" } as const;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { id }, select: { nameFr: true } });
  return { title: p ? `Programme · ${p.nameFr}` : "Cours" };
}

export default async function CourseProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const canEdit = CAN_EDIT.includes(admin.role);
  const { id } = await params;
  const course = await prisma.product.findFirst({
    where: { id, kind: "course" },
    include: {
      modules: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { lessons: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } } },
      entitlements: { include: { customer: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!course) notFound();
  const videoReady = isVideoConfigured();

  return (
    <>
      <p className="small" style={{ margin: "0 0 8px" }}><Link href="/admin/cours" className="muted">Cours de l&apos;Academy</Link> / {course.nameFr}</p>
      <div className="head">
        <div>
          <h1>{course.nameFr}</h1>
          <p className="muted" style={{ margin: "4px 0 0" }}>
            {course.published ? "En vente" : "Hors ligne"} · <Link href={`/admin/catalogue/${course.id}`}>prix et fiche</Link> ·{" "}
            <a href={`/fr/espace/cours/${course.slug}`} target="_blank" rel="noopener">voir côté apprenant</a>
          </p>
        </div>
      </div>
      {!videoReady && (
        <p className="msg" style={{ marginTop: 0 }}>
          Lecture vidéo non configurée : renseignez BUNNY_STREAM_LIBRARY_ID et BUNNY_STREAM_TOKEN_KEY. En attendant, les leçons vidéo affichent « Vidéo en préparation ».
        </p>
      )}

      <div className="cols2 wide">
        <div className="stack">
          {course.modules.length === 0 && <section className="card"><p className="muted" style={{ margin: 0 }}>Aucun module pour l&apos;instant. Commencez par en créer un.</p></section>}
          {course.modules.map((m) => (
            <section key={m.id} className="card stack">
              <details>
                <summary style={{ cursor: "pointer" }}>
                  <strong>{m.sortOrder + 1}. {m.titleFr}</strong> <span className="small muted">· {m.lessons.length} leçon{m.lessons.length > 1 ? "s" : ""}</span>
                </summary>
                {canEdit && (
                  <div className="stack" style={{ marginTop: 12 }}>
                    <ActionForm action={updateModule}>
                      <input type="hidden" name="moduleId" value={m.id} />
                      <div className="cols2">
                        <label className="f">Titre (français)<input className="i" name="titleFr" defaultValue={m.titleFr} required /></label>
                        <label className="f">Titre (anglais)<input className="i" name="titleEn" defaultValue={m.titleEn} required /></label>
                      </div>
                      <label className="f" style={{ maxWidth: 160 }}>Ordre<input className="i num" name="sortOrder" type="number" min={0} defaultValue={m.sortOrder} /></label>
                      <Submit>Enregistrer le module</Submit>
                    </ActionForm>
                    {m.lessons.length === 0 && (
                      <form action={deleteModule}><input type="hidden" name="moduleId" value={m.id} /><button className="btn sm ghost">Supprimer ce module vide</button></form>
                    )}
                  </div>
                )}
              </details>

              <table className="t" style={{ border: 0 }}>
                <tbody>
                  {m.lessons.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <details>
                          <summary style={{ cursor: "pointer" }}>
                            {l.titleFr}{" "}
                            <span className="small muted">
                              · {KIND[l.kind]}{l.durationMin ? `, ${l.durationMin} min` : ""}
                            </span>{" "}
                            <span className={`pill ${l.published ? "ok" : "warn"}`}>{l.published ? "En ligne" : "Hors ligne"}</span>{" "}
                            {l.kind === "video" && <span className={`pill ${l.videoId ? "ok" : ""}`}>{l.videoId ? "Vidéo rattachée" : "Sans vidéo"}</span>}{" "}
                            {l.freePreview && <span className="pill">Aperçu gratuit</span>}
                          </summary>
                          <ActionForm action={updateLesson}>
                            <input type="hidden" name="lessonId" value={l.id} />
                            <fieldset disabled={!canEdit} style={{ border: 0, padding: 0, margin: "12px 0 0" }} className="stack">
                              <div className="cols2">
                                <label className="f">Titre (français)<input className="i" name="titleFr" defaultValue={l.titleFr} required /></label>
                                <label className="f">Titre (anglais)<input className="i" name="titleEn" defaultValue={l.titleEn} required /></label>
                              </div>
                              <div className="cols2">
                                <label className="f">Type
                                  <select className="i" name="kind" defaultValue={l.kind}>
                                    {Object.entries(KIND).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                  </select>
                                </label>
                                <label className="f">Durée (minutes)<input className="i num" name="durationMin" inputMode="numeric" defaultValue={l.durationMin ?? ""} /></label>
                              </div>
                              <label className="f">Identifiant de la vidéo (Bunny Stream)<input className="i mono" name="videoId" defaultValue={l.videoId ?? ""} placeholder="ex. 3f2a…-…" /></label>
                              <label className="f">Texte, consignes ou ressources (français)<textarea className="i" name="bodyFr" rows={5} defaultValue={l.bodyFr} /></label>
                              <label className="f">Texte (anglais)<textarea className="i" name="bodyEn" rows={4} defaultValue={l.bodyEn} /></label>
                              <div className="cols2">
                                <label className="f">Ordre dans le module<input className="i num" name="sortOrder" type="number" min={0} defaultValue={l.sortOrder} /></label>
                                <div className="stack" style={{ gap: 6, paddingTop: 18 }}>
                                  <label className="small"><input type="checkbox" name="published" defaultChecked={l.published} /> En ligne pour les apprenants</label>
                                  <label className="small"><input type="checkbox" name="freePreview" defaultChecked={l.freePreview} /> Aperçu gratuit, sans achat</label>
                                </div>
                              </div>
                              {canEdit && <Submit>Enregistrer la leçon</Submit>}
                            </fieldset>
                          </ActionForm>
                          {canEdit && (
                            <form action={deleteLesson} style={{ marginTop: 8 }}><input type="hidden" name="lessonId" value={l.id} /><button className="btn sm ghost">Supprimer la leçon</button></form>
                          )}
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {canEdit && (
                <ActionForm action={addLesson} className="row">
                  <input type="hidden" name="moduleId" value={m.id} />
                  <select className="i" name="kind" defaultValue="video" style={{ width: 130 }} aria-label="Type de leçon">
                    {Object.entries(KIND).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <input className="i" name="titleFr" placeholder="Titre de la nouvelle leçon" aria-label="Titre de la nouvelle leçon (français)" required style={{ flex: 1 }} />
                  <input type="hidden" name="titleEn" value="" />
                  <Submit className="btn">Ajouter</Submit>
                </ActionForm>
              )}
            </section>
          ))}

          {canEdit && (
            <section className="card">
              <h2>Nouveau module</h2>
              <ActionForm action={addModule}>
                <input type="hidden" name="productId" value={course.id} />
                <div className="cols2">
                  <label className="f">Titre (français)<input className="i" name="titleFr" required placeholder="Les bases" /></label>
                  <label className="f">Titre (anglais, facultatif)<input className="i" name="titleEn" placeholder="The basics" /></label>
                </div>
                <Submit>Ajouter le module</Submit>
              </ActionForm>
            </section>
          )}
        </div>

        <section className="card stack">
          <h2>Inscrits ({course.entitlements.length})</h2>
          {canEdit && (
            <ActionForm action={grantAccess}>
              <input type="hidden" name="productId" value={course.id} />
              <label className="f">Nom<input className="i" name="name" required /></label>
              <label className="f">E-mail<input className="i" name="email" type="email" required /></label>
              <Submit>Offrir l&apos;accès</Submit>
            </ActionForm>
          )}
          <table className="t" style={{ border: 0 }}>
            <tbody>
              {course.entitlements.map((e) => (
                <tr key={e.id}>
                  <td>{e.customer.name}<div className="small muted">{e.customer.email}</div></td>
                  <td className="small muted">{e.source === "admin" ? "Offert" : "Acheté"}, {fmtDate(e.createdAt)}</td>
                  <td className="r">
                    {canEdit && e.source === "admin" && (
                      <form action={revokeAccess}><input type="hidden" name="entitlementId" value={e.id} /><button className="btn sm ghost">Retirer</button></form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
