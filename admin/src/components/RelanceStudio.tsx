"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { classLabel, initialsFromName } from "@/lib/brand";
import type { InactiveStudent } from "@/lib/inactivity";
import type { RelanceSend, RelanceTemplate } from "@/lib/relanceTypes";

export default function RelanceStudio({
  students,
  template,
  sends,
  mailReady,
}: {
  students: InactiveStudent[];
  template: RelanceTemplate;
  sends: RelanceSend[];
  mailReady: boolean;
}) {
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [selected, setSelected] = useState<string[]>(() => students.filter((s) => s.email).map((s) => s.id));
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");

  const withMail = useMemo(() => students.filter((s) => s.email), [students]);

  const toggle = (id: string) => {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const saveTemplate = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/relances/template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body }),
    });
    const json = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Enregistrement impossible.");
      return;
    }
    setFlash("Message automatique enregistré.");
  };

  const send = async () => {
    if (!selected.length) {
      setError("Choisis au moins un élève.");
      return;
    }
    setBusy(true);
    setError("");
    setFlash("");
    await saveTemplate();
    const res = await fetch("/api/relances/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentIds: selected }),
    });
    const json = (await res.json()) as {
      sent?: { name: string }[];
      skipped?: { name: string; reason: string }[];
      error?: string;
    };
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Envoi impossible.");
      return;
    }
    const sent = json.sent?.length ?? 0;
    const skipped = json.skipped ?? [];
    setFlash(
      sent
        ? `Envoyé à ${sent} élève${sent > 1 ? "s" : ""}${skipped.length ? ` · ${skipped.length} ignoré(s)` : ""}.`
        : skipped[0]?.reason || "Aucun envoi.",
    );
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <h2 className="text-base font-black text-[#1C1917]">Message automatique</h2>
        <p className="mt-1 text-sm font-medium text-[#64748B]">
          Variables : {"{{prenom}}"} {"{{classe}}"} {"{{absence}}"} {"{{xp}}"} {"{{lien}}"}. Le lien ouvre l’app élève
          pour continuer.
        </p>
        <label className="mt-4 block text-sm font-bold text-[#1C1917]">
          Objet
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 h-11 w-full rounded-2xl border-2 border-[#F0EFEE] px-3 text-sm outline-none focus:border-[#1677FF]"
          />
        </label>
        <label className="mt-3 block text-sm font-bold text-[#1C1917]">
          Corps du mail
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="mt-1 w-full rounded-2xl border-2 border-[#F0EFEE] px-3 py-3 text-sm leading-relaxed outline-none focus:border-[#1677FF]"
          />
        </label>
        {error ? <p className="mt-3 text-sm font-bold text-[#EF4444]">{error}</p> : null}
        {flash ? <p className="mt-3 text-sm font-bold text-[#10B981]">{flash}</p> : null}
        {!mailReady ? (
          <p className="mt-3 text-sm font-semibold text-[#F59E0B]">
            Ajoute SMTP_USER / SMTP_PASS ou RESEND_API_KEY dans admin/.env.local pour envoyer.
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void saveTemplate()}
            className="rounded-2xl bg-[#F0EFEE] px-5 py-2.5 text-sm font-extrabold text-[#1C1917] disabled:opacity-60"
          >
            Enregistrer
          </button>
          <button
            type="button"
            disabled={busy || !mailReady}
            onClick={() => void send()}
            className="rounded-2xl bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {busy ? "Envoi…" : `Envoyer à ${selected.length} élève${selected.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </article>

      <div className="space-y-5">
        <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-black text-[#1C1917]">Inactifs à relancer</h2>
            <button
              type="button"
              className="text-xs font-extrabold text-[#1677FF]"
              onClick={() => setSelected(withMail.map((s) => s.id))}
            >
              Tout cocher
            </button>
          </div>
          {students.length === 0 ? (
            <p className="text-sm font-semibold text-[#64748B]">Aucun élève inactif pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((s) => (
                <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-[#F0EFEE] px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    disabled={!s.email}
                    onChange={() => toggle(s.id)}
                    className="h-4 w-4 accent-[#1677FF]"
                  />
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white"
                    style={{ background: s.color }}
                  >
                    {initialsFromName(s.name)}
                  </span>
                  <Link href={`/dashboard/eleves/${s.id}`} className="min-w-0 flex-1">
                    <p className="truncate font-extrabold text-[#1C1917]">{s.name}</p>
                    <p className="text-xs font-semibold text-[#64748B]">
                      {classLabel(s.classe)} · {s.absenceLabel}
                      {s.email ? "" : " · sans email"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
          <h2 className="mb-3 text-base font-black text-[#1C1917]">Derniers envois</h2>
          {sends.length === 0 ? (
            <p className="text-sm font-semibold text-[#64748B]">Aucun mail de relance envoyé pour l’instant.</p>
          ) : (
            <ul className="space-y-2">
              {sends.slice(0, 8).map((row) => (
                <li key={row.id} className="flex items-center justify-between rounded-xl bg-[#FAFAF9] px-3 py-2 text-sm">
                  <span className="font-bold text-[#1C1917]">{row.name}</span>
                  <span className="text-xs font-semibold text-[#64748B]">
                    {new Date(row.sentAt).toLocaleString("fr-FR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </div>
  );
}
