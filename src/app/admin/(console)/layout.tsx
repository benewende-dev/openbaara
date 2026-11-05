import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { logout } from "../actions";
import { AdminLogo } from "../_components/Logo";
import { Nav } from "../_components/Nav";

const ROLE = { owner: "Propriétaire", editor: "Éditeur", support: "Support" } as const;

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/admin" className="brand"><AdminLogo /> OpenBaara</Link>
        <Nav />
        <div className="foot">
          <span style={{ color: "var(--fg)" }}>{admin.name}</span>
          <span>{ROLE[admin.role]}</span>
          <form action={logout}><button className="btn ghost sm" style={{ padding: 0 }}>Se déconnecter</button></form>
          <Link href="/fr" className="small">Voir le site</Link>
        </div>
      </aside>
      <main className="page">{children}</main>
    </div>
  );
}
