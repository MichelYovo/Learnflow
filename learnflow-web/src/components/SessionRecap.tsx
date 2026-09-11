"use client";

import { useMemo, type ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";
import Spira from "@/components/Spira";
import SpiraCelebrate from "@/components/SpiraCelebrate";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export type RecapStat = {
  label: string;
  value: string;
  icon: IconName;
  color: string;
  bg: string;
};

export function useSessionStats(opts: { xp?: number; score?: number; total?: number; cards?: number }): RecapStat[] {
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const ligue = useLearnFlowStore((s) => s.ligue);
  return useMemo(() => {
    const rows: RecapStat[] = [];
    if (opts.xp != null) {
      rows.push({ label: "XP gagné", value: `+${opts.xp}`, icon: "zap", color: "#F59E0B", bg: "#FFFBEB" });
    }
    if (opts.score != null && opts.total) {
      rows.push({
        label: "Précision",
        value: `${Math.round((opts.score / Math.max(1, opts.total)) * 100)}%`,
        icon: "target",
        color: "#1677FF",
        bg: "#E6F4FF",
      });
    }
    if (opts.cards != null) {
      rows.push({ label: "Cartes", value: String(opts.cards), icon: "layers", color: "#8B5CF6", bg: "#F5F3FF" });
    }
    rows.push({ label: "Série", value: `${profile?.streak ?? 0} j`, icon: "flame", color: "#EF4444", bg: "#FEF2F2" });
    rows.push({ label: "Ligue", value: ligue.nomLigue, icon: "trophy", color: "#D97706", bg: "#FFFBEB" });
    return rows;
  }, [opts.xp, opts.score, opts.total, opts.cards, profile?.streak, ligue.nomLigue]);
}

export default function SessionRecap({
  success,
  title,
  subtitle,
  stats,
  children,
}: {
  success: boolean;
  title: string;
  subtitle?: string;
  stats: RecapStat[];
  children?: ReactNode;
}) {
  const { colors } = useAppTheme();

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col overflow-hidden" style={{ background: colors.surface }}>
      {success ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {["#F59E0B", "#10B981", "#1677FF", "#F97316", "#A78BFA", "#22D3EE"].map((c, i) => (
            <span
              key={c}
              className="lf-confetti absolute top-[-12px] h-2.5 w-2.5 rounded-[2px]"
              style={{ left: `${12 + i * 15}%`, background: c, animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      ) : null}

      <div
        className="flex flex-col items-center gap-2 px-6 pb-8 pt-10 text-center text-white"
        style={{
          background: success ? "linear-gradient(160deg,#10B981,#059669)" : "linear-gradient(160deg,#F97316,#DC2626)",
        }}
      >
        {success ? <SpiraCelebrate size={200} /> : <Spira scene="quiz.fail" size={96} message="" />}
        <p className="lf-recap-pop text-[32px] font-black leading-none">{title}</p>
        {subtitle ? <p className="max-w-sm text-[14px] font-semibold text-white/90">{subtitle}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pt-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="lf-recap-card flex flex-col items-center gap-1 rounded-[18px] border px-3 py-3.5"
            style={{
              background: colors.white,
              borderColor: colors.border,
              animationDelay: `${0.12 + i * 0.08}s`,
            }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px]" style={{ background: s.bg }}>
              <Icon name={s.icon} size={14} color={s.color} />
            </span>
            <p className="text-[18px] font-black" style={{ color: colors.textDark }}>
              {s.value}
            </p>
            <p className="text-[11px] font-bold" style={{ color: colors.textMuted }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6">{children}</div>
    </div>
  );
}
