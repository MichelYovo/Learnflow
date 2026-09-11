"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUPER_PROF_PROMPTS, type SuperProfEmail } from "@/lib/superProfPrompts";

type Msg = { role: "user" | "prof"; text: string; email?: SuperProfEmail };

export default function SuperProfChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [flash, setFlash] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "prof",
      text: "Super Prof ici. Je rédige des mails, je prépare l’envoi, et je fais des revues d’élèves. Choisis une question ou pose la tienne.",
    },
  ]);

  const lastEmail = useMemo(() => [...msgs].reverse().find((m) => m.email)?.email, [msgs]);

  const send = async (preset?: string) => {
    const q = (preset ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setFlash("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    const res = await fetch("/api/super-prof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, path: pathname }),
    });
    const json = (await res.json()) as { text?: string; error?: string; email?: SuperProfEmail };
    setBusy(false);
    setMsgs((m) => [
      ...m,
      { role: "prof", text: json.text || json.error || "Super Prof n’a pas répondu.", email: json.email },
    ]);
  };

  const sendMail = async (email: SuperProfEmail) => {
    if (sending) return;
    setSending(true);
    setFlash("");
    const res = await fetch("/api/relances/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentIds: email.studentIds,
        subject: email.subject,
        body: email.body,
      }),
    });
    const json = (await res.json()) as { sent?: { name: string }[]; skipped?: { name: string; reason: string }[]; error?: string };
    setSending(false);
    if (!res.ok) {
      setFlash(json.error || "Envoi impossible.");
      return;
    }
    const sent = json.sent?.length ?? 0;
    const skipped = json.skipped?.length ?? 0;
    setFlash(
      sent
        ? `Mail envoyé à ${sent} élève${sent > 1 ? "s" : ""}${skipped ? ` · ${skipped} ignoré(s)` : ""}.`
        : json.skipped?.[0]?.reason || "Aucun envoi.",
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1677FF] text-[11px] font-black leading-tight text-white shadow-lg"
        aria-label="Ouvrir Super Prof"
      >
        SP
      </button>
      {open ? (
        <div className="fixed bottom-24 right-5 z-40 flex h-[min(560px,calc(100vh-8rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[22px] border-2 border-[#F0EFEE] bg-white shadow-xl">
          <div className="flex items-center justify-between bg-[#1677FF] px-4 py-3 text-white">
            <p className="text-sm font-extrabold">Super Prof · mails & revues</p>
            <button type="button" onClick={() => setOpen(false)} className="text-sm font-black">
              ×
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto border-b border-[#F0EFEE] bg-[#F8FAFC] px-3 py-2">
            {SUPER_PROF_PROMPTS.map((p) => (
              <button
                key={p.id}
                type="button"
                disabled={busy}
                onClick={() => void send(p.text)}
                className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#1677FF] ring-1 ring-[#BAE0FF]"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-auto max-w-[90%]" : "max-w-[92%]"}>
                <p
                  className={`rounded-2xl px-3 py-2 text-sm font-medium whitespace-pre-wrap ${
                    m.role === "user" ? "bg-[#1677FF] text-white" : "bg-[#F8FAFC] text-[#1C1917]"
                  }`}
                >
                  {m.text}
                </p>
                {m.email ? <EmailDraft email={m.email} busy={sending} onSend={() => void sendMail(m.email!)} /> : null}
              </div>
            ))}
            {busy ? <p className="text-xs font-bold text-[#64748B]">Super Prof écrit…</p> : null}
            {flash ? <p className="text-xs font-bold text-[#1677FF]">{flash}</p> : null}
          </div>
          {lastEmail && !msgs[msgs.length - 1]?.email ? (
            <div className="px-3 pb-1">
              <button
                type="button"
                disabled={sending}
                onClick={() => void sendMail(lastEmail)}
                className="w-full rounded-xl bg-[#10B981] px-3 py-2 text-xs font-extrabold text-white disabled:opacity-60"
              >
                {sending ? "Envoi…" : "Envoyer le dernier mail préparé"}
              </button>
            </div>
          ) : null}
          <form
            className="flex gap-2 border-t border-[#F0EFEE] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Rédige, envoie, revue…"
              className="h-10 flex-1 rounded-xl border-2 border-[#F0EFEE] px-3 text-sm outline-none"
            />
            <button type="submit" disabled={busy} className="rounded-xl bg-[#1677FF] px-3 text-sm font-extrabold text-white">
              OK
            </button>
          </form>
          <Link href="/dashboard/relances" className="px-4 pb-3 text-center text-[11px] font-extrabold text-[#1677FF]">
            Message automatique & relances →
          </Link>
        </div>
      ) : null}
    </>
  );
}

function EmailDraft({
  email,
  busy,
  onSend,
}: {
  email: SuperProfEmail;
  busy: boolean;
  onSend: () => void;
}) {
  return (
    <div className="mt-2 rounded-2xl border border-[#BAE0FF] bg-white p-3">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#1677FF]">Mail prêt</p>
      <p className="mt-1 text-sm font-extrabold text-[#1C1917]">{email.subject}</p>
      <p className="mt-1 max-h-28 overflow-y-auto whitespace-pre-wrap text-xs font-medium text-[#475569]">{email.body}</p>
      <p className="mt-2 text-[11px] font-semibold text-[#64748B]">
        {email.studentIds.length} destinataire{email.studentIds.length > 1 ? "s" : ""}
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={onSend}
        className="mt-2 w-full rounded-xl bg-[#10B981] px-3 py-2 text-xs font-extrabold text-white disabled:opacity-60"
      >
        {busy ? "Envoi…" : "Envoyer ce mail"}
      </button>
    </div>
  );
}
