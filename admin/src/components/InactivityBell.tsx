"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type InactiveRow = {
  id: string;
  name: string;
  absenceLabel: string;
};

export default function InactivityBell() {
  const [open, setOpen] = useState(false);
  const [inactive, setInactive] = useState(0);
  const [rows, setRows] = useState<InactiveRow[]>([]);
  const [welcomeDue, setWelcomeDue] = useState(0);
  const [recapDue, setRecapDue] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [inact, parents] = await Promise.all([fetch("/api/inactivity"), fetch("/api/parents")]);
      if (cancelled) return;
      if (inact.ok) {
        const json = (await inact.json()) as { count?: number; students?: InactiveRow[] };
        setInactive(json.count ?? 0);
        setRows(json.students?.slice(0, 5) ?? []);
      }
      if (parents.ok) {
        const json = (await parents.json()) as { welcomeDue?: number; recapDue?: number };
        setWelcomeDue(json.welcomeDue ?? 0);
        setRecapDue(json.recapDue ?? 0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const count = inactive + welcomeDue + recapDue;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#F0EFEE] bg-[#FAFAF9]"
        aria-label="Notifications admin"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5zM10 19a2 2 0 0 0 4 0"
            stroke="#1C1917"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#EF4444] px-1 text-[10px] font-black text-white">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-[22px] border-2 border-[#F0EFEE] bg-white shadow-xl">
          <div className="border-b border-[#F0EFEE] px-4 py-3">
            <p className="text-sm font-extrabold text-[#1C1917]">À traiter</p>
            <p className="text-xs font-semibold text-[#64748B]">
              {inactive} inactif{inactive > 1 ? "s" : ""} · {welcomeDue} accueil parent · {recapDue} point parent
            </p>
          </div>
          <ul className="max-h-72 overflow-y-auto p-2">
            {rows.map((s) => (
              <li key={s.id} className="rounded-xl px-3 py-2">
                <p className="truncate text-sm font-extrabold text-[#1C1917]">{s.name}</p>
                <p className="text-xs font-semibold text-[#64748B]">Absent depuis {s.absenceLabel}</p>
              </li>
            ))}
            {welcomeDue || recapDue ? (
              <li className="rounded-xl px-3 py-2 text-sm font-semibold text-[#64748B]">
                WhatsApp parents : {welcomeDue} accueil{welcomeDue > 1 ? "s" : ""} et {recapDue} point
                {recapDue > 1 ? "s" : ""} à envoyer.
              </li>
            ) : null}
          </ul>
          <div className="flex border-t border-[#F0EFEE]">
            <Link
              href="/dashboard/relances"
              className="flex-1 px-4 py-3 text-sm font-extrabold text-[#1677FF]"
              onClick={() => setOpen(false)}
            >
              Relances
            </Link>
            <Link
              href="/dashboard/parents"
              className="flex-1 px-4 py-3 text-right text-sm font-extrabold text-[#1677FF]"
              onClick={() => setOpen(false)}
            >
              Parents
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
