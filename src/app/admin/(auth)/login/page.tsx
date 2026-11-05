import { redirect } from "next/navigation";
import { getPendingSession } from "@/lib/admin/auth";
import { login } from "../../actions";
import { ActionForm, Submit } from "../../_components/forms";
import { AdminLogo } from "../../_components/Logo";

export const metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await getPendingSession()) redirect("/admin/verify");
  return (
    <div className="auth">
      <div className="card stack">
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}><AdminLogo /> Console OpenBaara</div>
        <ActionForm action={login}>
          <label className="f">Adresse e-mail<input className="i" type="email" name="email" autoComplete="username" required /></label>
          <label className="f">Mot de passe<input className="i" type="password" name="password" autoComplete="current-password" required /></label>
          <Submit>Continuer</Submit>
        </ActionForm>
        <p className="small muted" style={{ margin: 0 }}>Un code de double authentification vous sera demandé ensuite.</p>
      </div>
    </div>
  );
}
