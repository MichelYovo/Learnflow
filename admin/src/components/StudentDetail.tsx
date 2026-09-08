"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CLASS_GROUPS, classLabel, initialsFromName, normalizeClassId } from "@/lib/brand";
import { maskTogoPhone } from "@/lib/phoneTogo";
import type { AdminActivityEvent, AdminLeagueRow } from "@/lib/catalog";
import type { AdminStudent } from "@/data/seed";

export default function StudentDetail({
  student,
  events,
  league,
}: {
  student: AdminStudent;
  events: AdminActivityEvent[];
  league: AdminLeagueRow | null;
}) {
  const router = useRouter();
  const [classe, setClasse] = useState(normalizeClassId(student.classe) || student.classe);
  const [status, setStatus] = useState(student.status === "suspendu" ? "suspendu" : "actif");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPhone, setShowPhone] = useState(false);

  const save = async () => {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/eleves/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classe, status }),
    });
    const json = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Enregistrement impossible.");
      return;
    }
    router.refresh();
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer définitivement le compte de ${student.name} ?`)) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/eleves/${student.id}`, { method: "DELETE" });
    const json = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Suppression impossible.");
      return;
    }
    router.replace("/dashboard/eleves");
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <Link href="/dashboard/eleves" className="text-sm font-extrabold text-[#1677FF]">
        ← Tous les élèves
      </Link>
      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-black text-white"
            style={{ background: student.color }}
          >
            {initialsFromName(student.name)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black text-[#1C1917]">{student.name}</h1>
            <p className="text-sm font-semibold text-[#64748B]">{student.email || "Sans email"}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
              status === "suspendu" ? "bg-[#FEF2F2] text-[#EF4444]" : "bg-[#ECFDF5] text-[#059669]"
            }`}
          >
            {status}
          </span>
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Classe" value={classLabel(student.classe)} />
          <Info label="Ligue" value={`${league?.tier ?? student.leagueTier} · #${league?.rank ?? "—"}`} />
          <Info label="XP" value={student.xpTotale.toLocaleString("fr-FR")} />
          <Info label="Série" value={`${student.streak} j`} />
          <Info label="Leçons" value={String(student.lessonsDone)} />
          <Info label="App" value={student.platform || "—"} />
          <Info
            label="Parent"
            value={
              student.parentPhone ? (showPhone ? student.parentPhone : maskTogoPhone(student.parentPhone)) : "—"
            }
          />
          {student.parentPhone ? (
            <button type="button" className="text-left text-xs font-extrabold text-[#1677FF]" onClick={() => setShowPhone((v) => !v)}>
              {showPhone ? "Masquer le numéro" : "Afficher le numéro"}
            </button>
          ) : null}
        </dl>
      </article>

      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <h2 className="text-base font-black text-[#1C1917]">Rôles et compte</h2>
        <p className="mt-1 text-sm font-medium text-[#64748B]">
          Classe APC et statut. Suspendu : l’élève ne peut plus ouvrir l’app avec ce compte.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-bold text-[#1C1917]">
            Classe
            <select
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border-2 border-[#F0EFEE] px-3 text-sm font-bold outline-none focus:border-[#1677FF]"
            >
              {CLASS_GROUPS.map((g) => (
                <optgroup key={g.id} label={g.label}>
                  {g.classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold text-[#1C1917]">
            Statut
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border-2 border-[#F0EFEE] px-3 text-sm font-bold outline-none focus:border-[#1677FF]"
            >
              <option value="actif">Actif</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </label>
        </div>
        {error ? <p className="mt-3 text-sm font-bold text-red-500">{error}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void save()}
            className="rounded-2xl bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void remove()}
            className="rounded-2xl bg-[#FEF2F2] px-5 py-2.5 text-sm font-extrabold text-[#EF4444] disabled:opacity-60"
          >
            Supprimer le compte
          </button>
        </div>
      </article>

      <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
        <h2 className="mb-3 text-base font-black text-[#1C1917]">Activité récente</h2>
        <ul className="space-y-2">
          {events.slice(0, 30).map((e) => (
            <li key={e.id} className="flex items-center justify-between rounded-xl bg-[#FAFAF9] px-3 py-2 text-sm">
              <span className="font-bold text-[#1C1917]">{e.type}</span>
              <span className="text-xs font-semibold text-[#64748B]">
                {e.platform} · {new Date(e.createdAt).toLocaleString("fr-FR")}
              </span>
            </li>
          ))}
          {events.length === 0 ? <p className="text-sm font-semibold text-[#A8A29E]">Pas encore d’activité.</p> : null}
        </ul>
      </article>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#FAFAF9] px-3 py-2">
      <dt className="text-[11px] font-extrabold uppercase tracking-wide text-[#A8A29E]">{label}</dt>
      <dd className="font-extrabold text-[#1C1917]">{value}</dd>
    </div>
  );
}
