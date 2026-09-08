"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SupportMessage } from "@/lib/supabase";

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Africa/Lome",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function MessagesInbox({ messages }: { messages: SupportMessage[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"new" | "all">("new");
  const [openId, setOpenId] = useState<string | null>(messages[0]?.id ?? null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (filter === "all") return messages;
    return messages.filter((m) => m.status === "new");
  }, [messages, filter]);

  async function markRead(id: string) {
    setBusyId(id);
    await fetch(`/api/support/${id}`, { method: "PATCH" });
    setBusyId(null);
    router.refresh();
  }

  if (messages.length === 0) {
    return (
      <p className="rounded-[22px] border-2 border-dashed border-[#F0EFEE] bg-white px-6 py-16 text-center text-sm font-semibold text-[#64748B]">
        Aucun message pour l’instant. Les envois du site vitrine (Support / Préviens-moi) s’affichent ici.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("new")}
          className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${
            filter === "new" ? "bg-[#1677FF] text-white" : "bg-[#FAFAF9] text-[#64748B]"
          }`}
        >
          Non lus ({messages.filter((m) => m.status === "new").length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${
            filter === "all" ? "bg-[#1677FF] text-white" : "bg-[#FAFAF9] text-[#64748B]"
          }`}
        >
          Tous ({messages.length})
        </button>
      </div>
      <ul className="space-y-3">
        {rows.map((m) => {
          const open = openId === m.id;
          return (
            <li
              key={m.id}
              className={`rounded-[22px] border-2 bg-white ${
                m.status === "new" ? "border-[#BAE0FF]" : "border-[#F0EFEE]"
              }`}
            >
              <button
                type="button"
                className="flex w-full items-start gap-3 px-5 py-4 text-left"
                onClick={() => setOpenId(open ? null : m.id)}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F4FF] text-xs font-black text-[#1677FF]">
                  {m.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((p) => p[0]?.toUpperCase() ?? "")
                    .join("") || "?"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-[#1C1917]">{m.name}</span>
                    <span className="text-xs font-semibold text-[#64748B]">{m.email}</span>
                    {m.status === "new" ? (
                      <span className="rounded-full bg-[#E6F4FF] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#1677FF]">
                        Nouveau
                      </span>
                    ) : null}
                    <span className="rounded-full bg-[#FAFAF9] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#A8A29E]">
                      {m.topic === "waitlist" ? "Liste d’attente" : "Support"}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-sm font-medium text-[#64748B]">{m.message}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-[#A8A29E]">{formatWhen(m.created_at)}</span>
              </button>
              {open ? (
                <div className="border-t border-[#F0EFEE] px-5 py-4">
                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-[#1C1917]">{m.message}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent("LearnFlow — ta question")}`}
                      className="inline-flex h-10 items-center rounded-2xl bg-[#1677FF] px-4 text-sm font-extrabold text-white"
                    >
                      Répondre par email
                    </a>
                    {m.status === "new" ? (
                      <button
                        type="button"
                        disabled={busyId === m.id}
                        onClick={() => void markRead(m.id)}
                        className="inline-flex h-10 items-center rounded-2xl border-2 border-[#F0EFEE] px-4 text-sm font-extrabold text-[#64748B] disabled:opacity-60"
                      >
                        Marquer comme lu
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {filter === "new" && rows.length === 0 ? (
        <p className="mt-4 text-sm font-semibold text-[#64748B]">Tout est lu. Passe sur « Tous » pour l’historique.</p>
      ) : null}
    </div>
  );
}
