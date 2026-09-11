"use client";

import { CHALLENGES, withDay, type ChallengeId } from "@/engine/rewards";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function DailyChallenges({ onOpen }: { onOpen: (id: ChallengeId) => void }) {
  const { colors } = useAppTheme();
  const rawRewards = useLearnFlowStore((s) => s.rewards);
  const rewards = withDay(rawRewards);
  const ease = useLearnFlowStore((s) => Boolean(s.rewards?.easeBoostUntil && s.rewards.easeBoostUntil > Date.now()));
  const open = CHALLENGES.filter((c) => !rewards.completed.includes(c.id));

  return (
    <article className="rounded-[22px] border-2 p-4" style={{ background: colors.white, borderColor: colors.border }}>
      <h2 className="text-base font-extrabold" style={{ color: colors.textDark }}>
        Défis du jour
      </h2>
      <p className="mt-1 text-xs font-semibold leading-4" style={{ color: colors.textMuted }}>
        {ease
          ? "Boost actif : les prochaines questions sont plus faciles."
          : "Réussis un défi : plus d’XP et des questions plus faciles."}
      </p>
      {open.length === 0 ? (
        <p className="mt-2 text-sm font-extrabold" style={{ color: colors.secondary }}>
          Tous les défis du jour sont faits.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {open.slice(0, 3).map((c) => {
            const progress = rewards.progress[c.id] ?? 0;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onOpen(c.id)}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left"
                  style={{ background: colors.surfaceAlt }}
                >
                  <span>
                    <span className="block text-sm font-extrabold" style={{ color: colors.textDark }}>
                      {c.title}
                    </span>
                    <span className="text-[11px] font-semibold" style={{ color: colors.textMuted }}>
                      +{c.xp} XP · {progress}/{c.target}
                    </span>
                  </span>
                  <span className="text-xs font-extrabold" style={{ color: colors.primary }}>
                    Go
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
