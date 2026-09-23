import Link from "next/link";
import { eventCaption } from "@/lib/activity";
import type { AdminActivityEvent } from "@/lib/catalog";

export default function ActivityFeed({ events }: { events: AdminActivityEvent[] }) {
  return (
    <article className="h-full rounded-[24px] border border-[#E7E5E4] bg-white p-5 shadow-[0_12px_32px_rgba(28,25,23,.045)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-black tracking-tight text-[#1C1917]">Mouvements récents</h2>
          <p className="mt-0.5 text-xs font-semibold text-[#A8A29E]">Dernières actions des élèves</p>
        </div>
        <Link href="/dashboard/activite" className="text-sm font-extrabold text-[#1677FF] hover:text-[#155EEF]">
          Voir tout
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="rounded-2xl bg-[#FAFAF9] px-4 py-8 text-center text-sm font-semibold text-[#A8A29E]">
          Aucun mouvement pour l’instant.
        </p>
      ) : (
        <ul>
          {events.map((event, index) => {
            const mobile = event.platform === "mobile";
            return (
              <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                {index < events.length - 1 ? (
                  <span className="absolute bottom-0 left-[15px] top-9 w-px bg-[#F0EFEE]" />
                ) : null}
                <span
                  className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-black uppercase ${
                    mobile ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#E6F4FF] text-[#1677FF]"
                  }`}
                >
                  {mobile ? "M" : "W"}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-sm font-extrabold text-[#1C1917]">{event.studentName}</p>
                    <time className="shrink-0 text-[11px] font-bold text-[#A8A29E]">
                      {new Date(event.createdAt).toLocaleString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "short",
                      })}
                    </time>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-[#64748B]">{eventCaption(event)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
