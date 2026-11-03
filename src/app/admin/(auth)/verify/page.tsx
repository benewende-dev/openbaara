import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getPendingSession, newTotpSecret, totpFor } from "@/lib/admin/auth";
import { verifyTotp } from "../../actions";
import { ActionForm, Submit } from "../../_components/forms";
import { AdminLogo } from "../../_components/Logo";

export const metadata = { title: "Double authentification" };

export default async function VerifyPage() {
  const s = await getPendingSession();
  if (!s) redirect("/admin/login");

  const setup = !s.admin.totpEnabled;
  const secret = setup ? newTotpSecret() : null;
  const qr = secret ? await QRCode.toDataURL(totpFor(s.admin.email, secret).toString(), { margin: 1, width: 200 }) : null;

  return (
    <div className="auth">
      <div className="card stack">
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}><AdminLogo /> Double authentification</div>
        {setup ? (
          <>
            <p className="small" style={{ margin: 0 }}>
              Première connexion : scannez ce code avec une application d&apos;authentification (Google Authenticator, 1Password, Aegis…), puis saisissez le code à 6 chiffres.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr!} alt="QR code de configuration" width={200} height={200} style={{ alignSelf: "center", borderRadius: 8, background: "#fff", padding: 6 }} />
            <p className="small muted mono" style={{ margin: 0, wordBreak: "break-all" }}>Clé manuelle : {secret}</p>
          </>
        ) : (
          <p className="small" style={{ margin: 0 }}>Saisissez le code à 6 chiffres de votre application d&apos;authentification.</p>
        )}
        <ActionForm action={verifyTotp}>
          {secret && <input type="hidden" name="secret" value={secret} />}
          <label className="f">Code<input className="i num" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" required autoFocus /></label>
          <Submit>Vérifier</Submit>
        </ActionForm>
      </div>
    </div>
  );
}
