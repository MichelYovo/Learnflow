"use client";

import { useMemo, useState } from "react";
import { CLASSES, classLabel, initialsFromName } from "@/lib/brand";
import { maskTogoPhone } from "@/lib/phoneTogo";
import type { AdminStudent } from "@/data/seed";

export default function StudentsTable({ students }: { students: AdminStudent[] }) {
  const [q, setQ] = useState("");
  const [classe, setClasse] = useState("all");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return students.filter((s) => {
      const matchQ = !query || s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query);
      const matchC = classe === "all" || s.classe === classe;
      return matchQ && matchC;
    });
  }, [students, q, classe]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un élève…"
          className="h-11 flex-1 rounded-2xl border-2 border-[#F0EFEE] bg-white px-4 text-sm font-medium outline-none focus:border-[#1677FF]"
        />
        <select
          value={classe}
          onChange={(e) => setClasse(e.target.value)}
          className="h-11 rounded-2xl border-2 border-[#F0EFEE] bg-white px-3 text-sm font-bold text-[#1C1917] outline-none focus:border-[#1677FF]"
        >
          <option value="all">Toutes les classes</option>
          {CLASSES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-[22px] border-2 border-[#F0EFEE] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAFAF9] text-[11px] font-extrabold uppercase tracking-wider text-[#A8A29E]">
            <tr>
              <th className="px-4 py-3">Élève</th>
              <th className="px-4 py-3">Classe</th>
              <th className="px-4 py-3">App</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Ligue</th>
              <th className="px-4 py-3">XP</th>
              <th className="px-4 py-3">Série</th>
              <th className="px-4 py-3">Leçons</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t border-[#F0EFEE]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white"
                      style={{ background: s.color }}
                    >
                      {initialsFromName(s.name)}
                    </span>
                    <div>
                      <p className="font-extrabold text-[#1C1917]">{s.name}</p>
                      <p className="text-xs font-medium text-[#64748B]">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-[#475569]">{classLabel(s.classe)}</td>
                <td className="px-4 py-3">
                  {s.platform ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                        s.platform === "mobile" ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#E6F4FF] text-[#1677FF]"
                      }`}
                    >
                      {s.platform}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#A8A29E]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-bold text-[#475569]">
                  <ParentCell phone={s.parentPhone} />
                </td>
                <td className="px-4 py-3 font-bold text-[#1C1917]">{s.leagueTier}</td>
                <td className="px-4 py-3 font-black text-[#1677FF]">{s.xpTotale.toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3 font-bold">{s.streak} j</td>
                <td className="px-4 py-3 font-bold">{s.lessonsDone}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center font-semibold text-[#A8A29E]">
                  Aucun élève pour ce filtre.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ParentCell({ phone }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  if (!phone) return <span className="text-xs font-semibold text-[#A8A29E]">—</span>;
  return (
    <button type="button" onClick={() => setOpen((v) => !v)} className="text-left text-xs font-extrabold text-[#1677FF]">
      {open ? phone : maskTogoPhone(phone)}
    </button>
  );
}
