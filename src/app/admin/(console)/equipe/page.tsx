import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDateTime } from "../../_components/format";

export const metadata = { title: "Équipe et accès" };

const ROLE = {
  owner: ["Propriétaire", "Tout, y compris l'équipe"],
  editor: ["Éditeur", "Catalogue, prix, codes promo, devis"],
  support: ["Support", "Lecture, commandes et devis"],
} as const;

export default async function TeamPage() {
  await requireAdmin(["owner"]);
  const team = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <>
      <div className="head"><div><h1>Équipe et accès</h1><p className="muted" style={{ margin: "4px 0 0" }}>Un compte se crée depuis le serveur avec <span className="mono">npm run admin:create</span>. La double authentification est obligatoire.</p></div></div>
      <table className="t">
        <thead><tr><th>Nom</th><th>Rôle</th><th>Double authentification</th><th>Dernière connexion</th></tr></thead>
        <tbody>
          {team.map((a) => (
            <tr key={a.id}>
              <td>{a.name}<div className="small muted">{a.email}</div></td>
              <td>{ROLE[a.role][0]}<div className="small muted">{ROLE[a.role][1]}</div></td>
              <td>{a.totpEnabled ? <span className="pill ok">Activée</span> : <span className="pill warn">À configurer</span>}</td>
              <td className="small muted">{a.lastLoginAt ? fmtDateTime(a.lastLoginAt) : "Jamais"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
