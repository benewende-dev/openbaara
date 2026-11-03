"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "../actions";

export function Submit({ children, className = "btn p" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Enregistrement…" : children}
    </button>
  );
}

export function Message({ state }: { state: FormState }) {
  if (!state) return null;
  if (state.error) return <p role="alert" className="msg err" style={{ margin: 0 }}>{state.error}</p>;
  if (state.ok) return <p role="status" className="msg ok" style={{ margin: 0 }}>{state.ok}</p>;
  return null;
}

/** Formulaire branché sur une action serveur, avec son message de retour. */
export function ActionForm({
  action,
  children,
  className = "stack",
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className}>
      {children}
      <Message state={state} />
    </form>
  );
}

/** Champ date qui ne s'affiche que pour un changement programmé. */
export function WhenFields() {
  const [when, setWhen] = useState<"now" | "later">("now");
  return (
    <>
      <label className="f">
        Entrée en vigueur
        <select name="when" className="i" value={when} onChange={(e) => setWhen(e.target.value as "now" | "later")}>
          <option value="now">Immédiatement</option>
          <option value="later">À une date</option>
        </select>
      </label>
      {when === "later" && (
        <label className="f">
          Date et heure (Abidjan)
          <input type="datetime-local" name="validFrom" className="i" required />
        </label>
      )}
    </>
  );
}

/** Choix des produits visés par un code promo. */
export function ScopeFields({ products }: { products: { slug: string; name: string }[] }) {
  const [scope, setScope] = useState<"all" | "some">("all");
  return (
    <>
      <label className="f">
        S&apos;applique à
        <select name="scope" className="i" value={scope} onChange={(e) => setScope(e.target.value as "all" | "some")}>
          <option value="all">Tout le catalogue payable en ligne</option>
          <option value="some">Certains produits</option>
        </select>
      </label>
      {scope === "some" && (
        <fieldset className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <legend className="small muted">Produits</legend>
          {products.map((p) => (
            <label key={p.slug} className="small" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="products" value={p.slug} /> {p.name}
            </label>
          ))}
        </fieldset>
      )}
    </>
  );
}
