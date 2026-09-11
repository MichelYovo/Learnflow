"use client";

import { useState } from "react";
import type { SupportTopic } from "./SupportProvider";

type Props = {
  topic?: SupportTopic;
  onSuccess?: () => void;
  embedded?: boolean;
};

export default function ContactForm({ topic = "support", onSuccess, embedded = false }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    topic === "waitlist" ? "Je veux être prévenu(e) quand LearnFlow est sur Android / iPhone.\nClasse : " : "",
  );
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, topic, company: honeypot }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error || "Le message n’a pas pu partir. Réessaie.");
        setBusy(false);
        return;
      }
      setDone(true);
      setName("");
      setEmail("");
      setMessage("");
      onSuccess?.();
    } catch {
      setError("Pas de réseau. Réessaie dans un instant.");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className={embedded ? "rounded-[24px] border-2 border-[#BAE0FF] bg-[#E6F4FF] p-6 text-center" : "text-center"}>
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">C’est parti</p>
        <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-[#1C1917]">Message envoyé</h3>
        <p className="mt-3 text-sm font-medium leading-relaxed text-[#64748B]">
          {topic === "waitlist"
            ? "On te préviendra dès que l’app est sur les stores."
            : "L’équipe LearnFlow a bien reçu ton message. Tu le retrouves aussi dans le dashboard admin."}
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-5 inline-flex h-11 items-center rounded-2xl bg-[#1677FF] px-5 text-sm font-extrabold text-white"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void submit(e)} className={embedded ? "space-y-3" : ""}>
      <label className="block text-xs font-extrabold uppercase tracking-wide text-[#A8A29E]">
        Prénom et nom
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="mt-1 h-11 w-full rounded-2xl border border-[#1C1917]/10 bg-white px-3 text-sm font-semibold text-[#1C1917] outline-none focus:border-[#1677FF]"
          placeholder="Kofi Adjei"
          autoComplete="name"
        />
      </label>
      <label className="mt-3 block text-xs font-extrabold uppercase tracking-wide text-[#A8A29E]">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={120}
          className="mt-1 h-11 w-full rounded-2xl border border-[#1C1917]/10 bg-white px-3 text-sm font-semibold text-[#1C1917] outline-none focus:border-[#1677FF]"
          placeholder="kofi@email.com"
          autoComplete="email"
        />
      </label>
      <label className="mt-3 block text-xs font-extrabold uppercase tracking-wide text-[#A8A29E]">
        Message
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minLength={8}
          maxLength={2000}
          rows={embedded ? 5 : 4}
          className="mt-1 w-full resize-none rounded-2xl border border-[#1C1917]/10 bg-white px-3 py-2.5 text-sm font-semibold text-[#1C1917] outline-none focus:border-[#1677FF]"
          placeholder={topic === "waitlist" ? "Android ou iPhone, ta classe…" : "Dis-nous ce dont tu as besoin."}
        />
      </label>
      <div className="hidden" aria-hidden>
        <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      {error ? <p className="mt-3 text-sm font-bold text-[#EF4444]">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#1677FF] text-sm font-extrabold text-white disabled:opacity-60"
      >
        {busy ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}
