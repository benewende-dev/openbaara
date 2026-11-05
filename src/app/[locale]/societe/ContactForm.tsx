"use client";

import { useState } from "react";
import type { Lang } from "@/components/site/lang";

const SUBJECTS = {
  fr: ["Une venture", "Investir", "Partenariat", "Academy ou formation d'équipe", "Services", "Presse", "Autre"],
  en: ["A venture", "Investing", "Partnership", "Academy or team training", "Services", "Press", "Other"],
};

const COPY = {
  fr: {
    name: "Nom", email: "E-mail", subject: "Objet", message: "Message",
    privacy: "Vos données servent uniquement à vous répondre.", send: "Envoyer", sending: "Envoi…",
    sentTitle: "Message envoyé", sentP: "Nous vous répondons sous deux jours ouvrés.", again: "Écrire un autre message",
    failed: "L'envoi a échoué. Écrivez-nous à contact@openbaara.com.",
  },
  en: {
    name: "Name", email: "Email", subject: "Subject", message: "Message",
    privacy: "Your details are only used to reply to you.", send: "Send", sending: "Sending…",
    sentTitle: "Message sent", sentP: "We'll reply within two working days.", again: "Write another message",
    failed: "Sending failed. Write to us at contact@openbaara.com.",
  },
};

export function ContactForm({ lang, venture }: { lang: Lang; venture: { slug: string; name: string } | null }) {
  const c = COPY[lang];
  const subjects = SUBJECTS[lang];
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    }).catch(() => null);
    if (res?.ok) return setState("sent");
    const data = await res?.json().catch(() => null);
    setError(data?.error || c.failed);
    setState("error");
  };

  if (state === "sent") {
    return (
      <div role="status" className="notice fade self-start p-10">
        <span className="h3">{c.sentTitle}</span>
        <span className="body">{c.sentP}</span>
        <button type="button" onClick={() => setState("idle")} className="link mt-2 self-start bg-transparent">{c.again}</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="field">
        <label htmlFor="cn" className="label">{c.name}</label>
        <input id="cn" name="name" className="inp" autoComplete="name" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="ce" className="label">{c.email}</label>
        <input id="ce" name="email" type="email" className="inp" autoComplete="email" required maxLength={200} />
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="cs" className="label">{c.subject}</label>
        <select id="cs" name="subject" className="inp" defaultValue={venture ? subjects[0] : subjects[subjects.length - 1]}>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="cm" className="label">{c.message}</label>
        <textarea id="cm" name="message" rows={5} className="inp" required maxLength={4000} defaultValue={venture ? (lang === "fr" ? `${venture.name} : ` : `${venture.name}: `) : ""} />
      </div>
      {state === "error" && <p role="alert" className="error sm:col-span-2">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
        <span className="small muted">{c.privacy}</span>
        <button type="submit" className="btn btn-p" disabled={state === "sending"}>{state === "sending" ? c.sending : c.send}</button>
      </div>
    </form>
  );
}
