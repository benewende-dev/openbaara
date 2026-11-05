"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: [href: string, label: string][] = [
  ["/admin", "Tableau de bord"],
  ["/admin/commandes", "Commandes"],
  ["/admin/devis", "Demandes de devis"],
  ["/admin/catalogue", "Forfaits et produits"],
  ["/admin/cours", "Cours de l'Academy"],
  ["/admin/promos", "Codes promo"],
  ["/admin/journal", "Journal d'audit"],
  ["/admin/equipe", "Équipe et accès"],
];

export function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Console" style={{ display: "contents" }}>
      {ITEMS.map(([href, label]) => {
        const on = href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link key={href} href={href} className="item" aria-current={on ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
