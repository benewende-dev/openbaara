"use client";

import { useState } from "react";
import type { Lang } from "@/components/site/lang";

const COPY = {
  fr: {
    name: "Nom", email: "E-mail", profile: "Vous représentez",
    profiles: ["Un business angel", "Un fonds d'investissement", "Une entreprise partenaire", "Une institution", "Autre"],
    when: "Vos disponibilités", whenPh: "Par exemple : mardi ou jeudi matin, heure d'Abidjan",
    topic: "Ce que vous souhaitez aborder", send: "Envoyer la demande", sending: "Envoi…",
    sentTitle: "Demande envoyée",
    sentP: "Nous revenons vers vous sous deux jours ouvrés avec une invitation et le lien de la visio.",
    failed: "L'envoi a échoué. Écrivez-nous à contact@openbaara.com.",
    subject: "Rendez-vous investisseur",
  },
  en: {
    name: "Name", email: "Email", profile: "You represent",
    profiles: ["A business angel", "An investment fund", "A partner company", "An institution", "Other"],
    when: "Your availability", whenPh: "For example: Tuesday or Thursday morning, Abidjan time",
    topic: "What you would like to discuss", send: "Send the request", sending: "Sending…",
    sentTitle: "Request sent",
    sentP: "We'll come back to you within two working days with an invitation and the video link.",
    failed: "Sending failed. Write to us at contact@openbaara.com.",
    subject: "Investor meeting",
  },
};

export function MeetingForm({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    const message = [`${c.profile} : ${f.get("profile")}`, `${c.when} : ${f.get("when")}`, "", String(f.get("topic") ?? "")].join("\n");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: f.get("name"), email: f.get("email"), subject: `${c.subject} · ${f.get("profile")}`, message }),
    }).catch(() => null);
    if (res?.ok) return setState("sent");
    const data = await res?.json().catch(() => null);
    setError(data?.error || c.failed);
    setState("error");
  };

  if (state === "sent") {
    return (
      <div role="status" className="notice fade self-start p-10">
        <span className="h3" style={{ fontSize: 26 }}>{c.sentTitle}</span>
        <span className="body">{c.sentP}</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel grid gap-3.5 p-6 sm:grid-cols-2 md:p-8">
      <div className="field">
        <label className="label" htmlFor="mn">{c.name}</label>
        <input id="mn" name="name" className="inp" autoComplete="name" required maxLength={120} />
      </div>
      <div className="field">
        <label className="label" htmlFor="me">{c.email}</label>
        <input id="me" name="email" type="email" className="inp" autoComplete="email" required maxLength={200} />
      </div>
      <div className="field sm:col-span-2">
        <label className="label" htmlFor="mp">{c.profile}</label>
        <select id="mp" name="profile" className="inp">
          {c.profiles.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="field sm:col-span-2">
        <label className="label" htmlFor="mw">{c.when}</label>
        <input id="mw" name="when" className="inp" placeholder={c.whenPh} required maxLength={200} />
      </div>
      <div className="field sm:col-span-2">
        <label className="label" htmlFor="mt">{c.topic}</label>
        <textarea id="mt" name="topic" rows={3} className="inp" required maxLength={3000} />
      </div>
      {state === "error" && <p role="alert" className="error sm:col-span-2">{error}</p>}
      <button type="submit" className="btn btn-p justify-self-end sm:col-span-2" disabled={state === "sending"}>
        {state === "sending" ? c.sending : c.send}
      </button>
    </form>
  );
}
