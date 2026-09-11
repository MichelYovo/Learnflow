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
  const { colors } = useAppTheme();
  return useMemo(() => {
    const rows: RecapStat[] = [];
    if (opts.xp != null) {
      rows.push({ label: "XP gagné", value: `+${opts.xp}`, icon: "zap", color: colors.accent, bg: colors.hgBg });
    }
    if (opts.score != null && opts.total) {
      rows.push({
        label: "Précision",
        value: `${Math.round((opts.score / Math.max(1, opts.total)) * 100)}%`,
        icon: "target",
        color: colors.primary,
        bg: colors.mathsBg,
      });
    }
    if (opts.cards != null) {
      rows.push({ label: "Cartes", value: String(opts.cards), icon: "layers", color: colors.violet, bg: colors.frBg });
    }
    rows.push({ label: "Série", value: `${profile?.streak ?? 0} j`, icon: "flame", color: colors.danger, bg: colors.angBg });
    rows.push({ label: "Ligue", value: ligue.nomLigue, icon: "trophy", color: colors.accent, bg: colors.hgBg });
    return rows;
  }, [opts.xp, opts.score, opts.total, opts.cards, profile?.streak, ligue.nomLigue, colors]);
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
    <div
      className="relative mx-auto flex h-dvh max-h-dvh w-full max-w-xl flex-col overflow-hidden"
      style={{ background: colors.surface }}
    >
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
        className="flex shrink-0 flex-col items-center gap-1 px-4 pb-3 pt-[max(0.7rem,env(safe-area-inset-top))] text-center text-white sm:gap-2 sm:px-6 sm:pb-5 sm:pt-8"
        style={{
          background: success ? "linear-gradient(160deg,#10B981,#059669)" : "linear-gradient(160deg,#F97316,#DC2626)",
        }}
      >
        <div className="flex h-[clamp(72px,22vh,168px)] w-[clamp(72px,22vh,168px)] items-center justify-center">
          {success ? (
            <SpiraCelebrate size={168} className="h-full w-full" />
          ) : (
            <Spira scene="quiz.fail" size={72} message="" />
          )}
        </div>
        <p className="lf-recap-pop text-[clamp(1.25rem,5vw,2rem)] font-black leading-tight">{title}</p>
        {subtitle ? (
          <p className="max-w-sm text-[12px] font-semibold leading-snug text-white/90 sm:text-[14px]">{subtitle}</p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:pt-5">
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="lf-recap-card flex flex-col items-center gap-0.5 rounded-[16px] border px-2 py-2.5 sm:gap-1 sm:px-3 sm:py-3.5"
              style={{
                background: colors.white,
                borderColor: colors.border,
                animationDelay: `${0.12 + i * 0.08}s`,
              }}
            >
              <span className="flex h-7 w-8 items-center justify-center rounded-[10px] sm:h-8" style={{ background: s.bg }}>
                <Icon name={s.icon} size={14} color={s.color} />
              </span>
              <p className="text-[16px] font-black sm:text-[18px]" style={{ color: colors.textDark }}>
                {s.value}
              </p>
              <p className="text-[10px] font-bold sm:text-[11px]" style={{ color: colors.textMuted }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 space-y-2 px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-2 sm:space-y-3 sm:px-5 sm:pt-4">
        {children}
      </div>
    </div>
  );
}
