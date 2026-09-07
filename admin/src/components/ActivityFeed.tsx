import Link from "next/link";
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

export default function ActivityFeed({ events }: { events: AdminActivityEvent[] }) {
  return (
    <article className="rounded-[22px] border-2 border-[#F0EFEE] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-black text-[#1C1917]">Mouvements récents</h2>
        <Link href="/dashboard/activite" className="text-sm font-extrabold text-[#1677FF]">
          Voir tout
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="text-sm font-semibold text-[#A8A29E]">Aucun mouvement pour l’instant.</p>
      ) : (
        <ul className="space-y-2.5">
          {events.map((e) => (
            <li key={e.id} className="flex items-center gap-3 rounded-2xl border border-[#F0EFEE] px-3 py-2.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                  e.platform === "mobile" ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#E6F4FF] text-[#1677FF]"
                }`}
              >
                {e.platform}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-[#1C1917]">{e.studentName}</p>
                <p className="text-xs font-semibold text-[#64748B]">{LABELS[e.type] ?? e.type}</p>
              </div>
              <time className="shrink-0 text-[11px] font-bold text-[#A8A29E]">
                {new Date(e.createdAt).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
              </time>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
