"use client";

import Icon from "@/components/Icon";

export type DuelHudFighter = {
  name: string;
  score: number;
  answered: number;
  you?: boolean;
  waiting?: boolean;
  done?: boolean;
};

function Slot({ fighter, align }: { fighter: DuelHudFighter; align: "left" | "right" }) {
  const waiting = Boolean(fighter.waiting) || !fighter.name;
  return (
    <div
      className={`min-w-0 rounded-2xl border px-2.5 py-2 sm:px-3 sm:py-2.5 ${align === "right" ? "text-right" : "text-left"}`}
      style={{
        background: fighter.you ? "rgba(245,158,11,0.16)" : "rgba(0,0,0,0.35)",
        borderColor: fighter.you ? "rgba(251,191,36,0.65)" : waiting ? "rgba(255,255,255,0.12)" : "rgba(248,113,113,0.4)",
      }}
    >
      <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
        {fighter.you ? "Toi" : waiting ? "Slot 2" : "Rival"}
      </p>
      <p className={`truncate text-sm font-black ${waiting ? "text-white/40" : "text-white"}`}>
        {waiting ? "En attente…" : fighter.name}
      </p>
      <p className="mt-0.5 text-base font-black tabular-nums text-[#FDE68A] sm:text-lg">
        {waiting ? "—" : `${fighter.score}`}
        <span className="ml-1 text-[10px] font-bold text-white/45 sm:text-[11px]">{waiting ? "" : `pts · Q${fighter.answered + (fighter.done ? 0 : 1)}`}</span>
      </p>
    </div>
  );
}

export default function BlitzDuelHud({
  me,
  rival,
  code,
}: {
  me: DuelHudFighter;
  rival?: DuelHudFighter | null;
  code?: string;
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 sm:gap-2">
        <Slot fighter={{ ...me, you: true }} align="left" />
        <div className="flex flex-col items-center gap-1 px-1">
          <span className="rounded-full bg-black/50 px-2 py-1 text-[11px] font-black tracking-[0.18em] text-[#FBBF24]">VS</span>
          <Icon name="users" size={14} color="rgba(253,230,138,0.7)" />
        </div>
        <Slot
          fighter={rival ?? { name: "", score: 0, answered: 0, waiting: true }}
          align="right"
        />
      </div>
      {code ? (
        <p className="mt-2 text-center text-[11px] font-black tracking-[0.2em] text-amber-200/70">{code}</p>
      ) : null}
    </div>
  );
}
