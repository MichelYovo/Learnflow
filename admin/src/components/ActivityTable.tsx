"use client";

import { useMemo, useState } from "react";
import type { AdminActivityEvent } from "@/lib/catalog";

const LABELS: Record<string, string> = {
  login: "Connexion",
  signup: "Inscription",
  profile_complete: "Profil complété",
  chapter_open: "Chapitre ouvert",
  quiz_complete: "Quiz 10/10",
  blitz_complete: "Blitz",
  xp_gain: "XP gagné",
  mode_start: "Mode lancé",
};

export default function ActivityTable({ events }: { events: AdminActivityEvent[] }) {
  const [platform, setPlatform] = useState("all");
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");

  const types = useMemo(() => [...new Set(events.map((e) => e.type))], [events]);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return events.filter((e) => {
      const matchP = platform === "all" || e.platform === platform;
      const matchT = type === "all" || e.type === type;
      const matchQ = !query || e.studentName.toLowerCase().includes(query) || e.type.toLowerCase().includes(query);
      return matchP && matchT && matchQ;
    });
  }, [events, platform, type, q]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Élève ou type…"
          className="h-11 flex-1 rounded-2xl border-2 border-[#F0EFEE] bg-white px-4 text-sm font-medium outline-none focus:border-[#1677FF]"
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="h-11 rounded-2xl border-2 border-[#F0EFEE] bg-white px-3 text-sm font-bold outline-none focus:border-[#1677FF]"
        >
          <option value="all">Toutes les apps</option>
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-11 rounded-2xl border-2 border-[#F0EFEE] bg-white px-3 text-sm font-bold outline-none focus:border-[#1677FF]"
        >
          <option value="all">Tous les types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {LABELS[t] ?? t}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-[22px] border-2 border-[#F0EFEE] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAFAF9] text-[11px] font-extrabold uppercase tracking-wider text-[#A8A29E]">
            <tr>
              <th className="px-4 py-3">Quand</th>
              <th className="px-4 py-3">Élève</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">App</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-[#F0EFEE]">
                <td className="px-4 py-3 text-xs font-bold text-[#64748B]">
                  {new Date(e.createdAt).toLocaleString("fr-FR")}
                </td>
                <td className="px-4 py-3 font-extrabold text-[#1C1917]">{e.studentName}</td>
                <td className="px-4 py-3 font-bold">{LABELS[e.type] ?? e.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                      e.platform === "mobile" ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#E6F4FF] text-[#1677FF]"
                    }`}
                  >
                    {e.platform}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center font-semibold text-[#A8A29E]">
                  Aucun mouvement pour ce filtre.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
