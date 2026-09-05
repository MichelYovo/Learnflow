"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import { ScreenHeader } from "@/components/ui";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { InboxKind, InboxNotification } from "@/types/learnflow";

const KIND_META: Record<InboxKind, { icon: IconName; color: string; bg: string; label: string }> = {
  study: { icon: "calendar", color: "#1677FF", bg: "#E6F4FF", label: "Étude" },
  streak: { icon: "flame", color: "#D97706", bg: "#FEF3C7", label: "Série" },
  league: { icon: "trophy", color: "#D97706", bg: "#FFFBEB", label: "Ligue" },
  repos: { icon: "moon", color: "#8B5CF6", bg: "#F5F3FF", label: "Repos" },
  system: { icon: "bell", color: "#1677FF", bg: "#E6F4FF", label: "LearnFlow" },
};

function formatWhen(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.max(0, Math.round(diff / 60_000));
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "Hier" : `Il y a ${d} j`;
}

export default function InboxPage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const inbox = useLearnFlowStore((s) => s.inbox);
  const markInboxRead = useLearnFlowStore((s) => s.markInboxRead);
  const markAllInboxRead = useLearnFlowStore((s) => s.markAllInboxRead);
  const unread = useMemo(() => inbox.filter((n) => !n.read).length, [inbox]);

  const open = (n: InboxNotification) => {
    markInboxRead(n.id);
    if (n.kind === "study") router.push("/app/agenda");
    else if (n.kind === "league") router.push("/app/ligue");
  };

  return (
    <div>
      <ScreenHeader title="Notifications" backHref="/app" />
      <div className="mx-auto max-w-xl space-y-2 px-5 py-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold" style={{ color: colors.textMuted }}>
            {unread > 0 ? `${unread} non lue${unread > 1 ? "s" : ""}` : "Tout est lu"}
          </p>
          {unread > 0 ? (
            <button type="button" onClick={markAllInboxRead} className="text-[13px] font-extrabold" style={{ color: colors.primary }}>
              Tout marquer lu
            </button>
          ) : null}
        </div>

        {inbox.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[20px] border-2 px-6 py-10 text-center" style={{ background: colors.white, borderColor: colors.border }}>
            <Icon name="bell" size={28} color={colors.textMuted} />
            <p className="text-sm font-extrabold">Aucune notification</p>
            <p className="text-[13px] font-medium" style={{ color: colors.textMuted }}>
              Les rappels d&apos;étude, de série et de ligue resteront ici.
            </p>
          </div>
        ) : (
          inbox.map((n) => {
            const meta = KIND_META[n.kind];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => open(n)}
                className="flex w-full gap-3 rounded-[20px] border-2 p-3.5 text-left"
                style={{
                  background: colors.white,
                  borderColor: n.read ? colors.border : colors.mathsBorder,
                }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: meta.bg }}>
                  <Icon name={meta.icon} size={18} color={meta.color} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                    <span className="text-[11px] font-semibold" style={{ color: colors.textMuted }}>
                      {formatWhen(n.createdAt)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm font-extrabold">{n.title}</span>
                  <span className="mt-0.5 block text-[13px] font-medium" style={{ color: colors.textSecondary }}>
                    {n.body}
                  </span>
                </span>
                {!n.read ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: colors.primary }} /> : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
