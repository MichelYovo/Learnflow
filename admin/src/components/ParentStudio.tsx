"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { maskTogoPhone } from "@/lib/phoneTogo";

type PhoneStatus = "ok" | "invalid" | "missing";

type ParentRow = {
  id: string;
  name: string;
  classLabel: string;
  parentPhone?: string;
  phoneStatus: PhoneStatus;
  welcomeDue: boolean;
  recapDue: boolean;
  welcomeLink?: string;
  recapLink?: string;
};

type SendRow = {
  id: string;
  name: string;
  event: string;
  status: string;
  sentAt: string;
};

type Draft = {
  studentId: string;
  name: string;
  phone: string;
  event: "parent_welcome" | "weekly_recap";
  text: string;
  waLink: string;
};

export default function ParentStudio({
  cadenceDays,
  whatsappReady,
  students,
  sends,
}: {
  cadenceDays: 7 | 14;
  whatsappReady: boolean;
  students: ParentRow[];
  sends: SendRow[];
}) {
  const [days, setDays] = useState<7 | 14>(cadenceDays);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");
  const [log, setLog] = useState(sends);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [filter, setFilter] = useState<"all" | "ok" | "invalid" | "missing">("all");

  const stats = useMemo(() => {
    return {
      ok: students.filter((s) => s.phoneStatus === "ok").length,
      invalid: students.filter((s) => s.phoneStatus === "invalid").length,
      missing: students.filter((s) => s.phoneStatus === "missing").length,
      welcomeDue: students.filter((s) => s.welcomeDue).length,
      recapDue: students.filter((s) => s.recapDue).length,
    };
  }, [students]);

  const rows = students.filter((s) => (filter === "all" ? true : s.phoneStatus === filter));

  const saveCadence = async (next: 7 | 14) => {
    setDays(next);
    await fetch("/api/parents/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cadenceDays: next }),
    });
  };

  const dispatch = async (kind: "due" | "welcome" | "recap") => {
    setBusy(true);
    setError("");
    setFlash("");
    try {
      const res = await fetch("/api/parents/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const raw = await res.text();
      let json: {
        sent?: { name: string }[];
        skipped?: { name: string; reason: string }[];
        drafts?: Draft[];
        error?: string;
      } = {};
      try {
        json = raw ? (JSON.parse(raw) as typeof json) : {};
      } catch {
        setBusy(false);
        setError("Réponse invalide. Réessaie.");
        return;
      }
      setBusy(false);
      if (!res.ok) {
        setError(json.error || "Préparation impossible.");
        return;
      }
      const sent = json.sent?.length ?? 0;
      setDrafts(json.drafts ?? []);
      setFlash(
        sent
          ? `${sent} message${sent > 1 ? "s" : ""} envoyé${sent > 1 ? "s" : ""} par API.`
          : (json.drafts?.length ?? 0)
            ? `${json.drafts?.length} message${(json.drafts?.length ?? 0) > 1 ? "s" : ""} prêt${(json.drafts?.length ?? 0) > 1 ? "s" : ""} : ouvre WhatsApp sur ton téléphone, c’est gratuit.`
            : json.skipped?.[0]?.reason || "Rien à envoyer pour le moment.",
      );
    } catch {
      setBusy(false);
      setError("Préparation impossible. Réessaie.");
    }
  };

  const openWhatsApp = async (draft: Draft) => {
    window.open(draft.waLink, "_blank", "noopener,noreferrer");
    await fetch("/api/parents/mark-sent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: draft.studentId,
        name: draft.name,
        phone: draft.phone,
        event: draft.event,
      }),
    });
    setDrafts((cur) => cur.filter((d) => !(d.studentId === draft.studentId && d.event === draft.event)));
    setLog((cur) => [
      {
        id: `${draft.studentId}-${Date.now()}`,
        name: draft.name,
        event: draft.event,
        status: "sent",
        sentAt: new Date().toISOString(),
      },
      ...cur,
    ]);
  };

  return (
    <div className="space-y-5">
      <article className="rounded-[22px] border-2 border-[#BAE0FF] bg-[#E6F4FF] p-5">
        <h2 className="text-base font-black text-[#1C1917]">Sans API payante</h2>
        <p className="mt-1 text-sm font-medium leading-relaxed text-[#1C1917]">
          WhatsApp Business / Twilio sont payants. En attendant, LearnFlow prépare le message et ouvre WhatsApp sur
          ton téléphone — tu appuies sur Envoyer. Gratuit, et ça marche tout de suite.
        </p>
      </article>

      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <h2 className="text-base font-black text-[#1C1917]">Vérification des numéros déjà inscrits</h2>
        <p className="mt-1 text-sm font-medium text-[#64748B]">
          Mobile Togo uniquement : 8 chiffres après +228. Tous les numéros Togo sont acceptés.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Valides" value={stats.ok} tone="green" />
          <Stat label="Invalides" value={stats.invalid} tone="red" />
          <Stat label="Manquants" value={stats.missing} tone="amber" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "ok", "invalid", "missing"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${
                filter === id ? "bg-[#1677FF] text-white" : "bg-[#FAFAF9] text-[#64748B]"
              }`}
            >
              {id === "all" ? "Tous" : id === "ok" ? "Valides" : id === "invalid" ? "Invalides" : "Sans numéro"}
            </button>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          {rows.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#F0EFEE] px-3 py-2">
              <Link href={`/dashboard/eleves/${s.id}`} className="min-w-0">
                <p className="truncate font-extrabold text-[#1C1917]">{s.name}</p>
                <p className="text-xs font-semibold text-[#64748B]">
                  {s.classLabel} · {s.parentPhone ? maskTogoPhone(s.parentPhone) : "aucun numéro"}
                </p>
              </Link>
              <div className="flex items-center gap-2">
                <StatusPill status={s.phoneStatus} />
                {s.phoneStatus === "ok" && s.welcomeDue && s.welcomeLink ? (
                  <button
                    type="button"
                    onClick={() =>
                      void openWhatsApp({
                        studentId: s.id,
                        name: s.name,
                        phone: s.parentPhone || "",
                        event: "parent_welcome",
                        text: "",
                        waLink: s.welcomeLink || "",
                      })
                    }
                    className="rounded-full bg-[#25D366] px-3 py-1 text-[11px] font-extrabold text-white"
                  >
                    Accueil
                  </button>
                ) : null}
                {s.phoneStatus === "ok" && s.recapDue && s.recapLink ? (
                  <button
                    type="button"
                    onClick={() =>
                      void openWhatsApp({
                        studentId: s.id,
                        name: s.name,
                        phone: s.parentPhone || "",
                        event: "weekly_recap",
                        text: "",
                        waLink: s.recapLink || "",
                      })
                    }
                    className="rounded-full bg-[#1677FF] px-3 py-1 text-[11px] font-extrabold text-white"
                  >
                    Point
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <h2 className="text-base font-black text-[#1C1917]">Messages parents</h2>
        <p className="mt-1 text-sm font-medium text-[#64748B]">
          {whatsappReady
            ? "Une API est configurée : l’envoi peut partir tout seul."
            : "Prépare les messages, puis ouvre WhatsApp un par un."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void saveCadence(7)}
            className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${
              days === 7 ? "bg-[#1677FF] text-white" : "bg-[#FAFAF9] text-[#64748B]"
            }`}
          >
            Chaque semaine
          </button>
          <button
            type="button"
            onClick={() => void saveCadence(14)}
            className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${
              days === 14 ? "bg-[#1677FF] text-white" : "bg-[#FAFAF9] text-[#64748B]"
            }`}
          >
            Toutes les 2 semaines
          </button>
        </div>
        {error ? <p className="mt-3 text-sm font-bold text-[#EF4444]">{error}</p> : null}
        {flash ? <p className="mt-3 text-sm font-bold text-[#1677FF]">{flash}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void dispatch("due")}
            className="rounded-2xl bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {busy ? "Préparation…" : "Préparer ce qui est dû"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void dispatch("welcome")}
            className="rounded-2xl bg-[#F0EFEE] px-5 py-2.5 text-sm font-extrabold text-[#1C1917] disabled:opacity-60"
          >
            Accueil des comptes déjà inscrits
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void dispatch("recap")}
            className="rounded-2xl bg-[#10B981] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            Point de progression
          </button>
        </div>
        <p className="mt-3 text-xs font-semibold text-[#64748B]">
          {stats.welcomeDue} accueil{stats.welcomeDue > 1 ? "s" : ""} · {stats.recapDue} point
          {stats.recapDue > 1 ? "s" : ""} dû{stats.recapDue > 1 ? "s" : ""}.
        </p>
        {drafts.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {drafts.map((d) => (
              <li key={`${d.studentId}-${d.event}`} className="rounded-2xl border border-[#BAE0FF] bg-[#F8FAFC] px-3 py-3">
                <p className="font-extrabold text-[#1C1917]">
                  {d.name} · {d.event === "weekly_recap" ? "point" : "accueil"}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-xs font-medium text-[#475569]">{d.text}</p>
                <button
                  type="button"
                  onClick={() => void openWhatsApp(d)}
                  className="mt-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-extrabold text-white"
                >
                  Ouvrir WhatsApp
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </article>

      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <h2 className="mb-3 text-base font-black text-[#1C1917]">Derniers envois</h2>
        {log.length === 0 ? (
          <p className="text-sm font-semibold text-[#64748B]">Aucun envoi encore.</p>
        ) : (
          <ul className="space-y-2">
            {log.map((row) => (
              <li key={row.id} className="flex items-center justify-between rounded-xl bg-[#FAFAF9] px-3 py-2 text-sm">
                <span className="font-bold text-[#1C1917]">
                  {row.name} · {row.event === "weekly_recap" ? "point" : "accueil"}
                </span>
                <span className="text-xs font-semibold text-[#64748B]">
                  {row.status} · {new Date(row.sentAt).toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "green" | "red" | "amber" }) {
  const tones = {
    green: "bg-[#ECFDF5] text-[#059669]",
    red: "bg-[#FEF2F2] text-[#EF4444]",
    amber: "bg-[#FFFBEB] text-[#F59E0B]",
  };
  return (
    <div className="rounded-2xl bg-[#FAFAF9] p-4">
      <p className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-extrabold ${tones[tone]}`}>{label}</p>
      <p className="mt-2 text-2xl font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: PhoneStatus }) {
  const map = {
    ok: "bg-[#ECFDF5] text-[#059669]",
    invalid: "bg-[#FEF2F2] text-[#EF4444]",
    missing: "bg-[#FFFBEB] text-[#F59E0B]",
  };
  const label = { ok: "valide", invalid: "invalide", missing: "manquant" };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${map[status]}`}>{label[status]}</span>
  );
}
