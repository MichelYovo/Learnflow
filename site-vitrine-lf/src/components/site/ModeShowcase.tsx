"use client";

import { useState } from "react";
import { MODES } from "../../lib/brand";
import { playSfx, preloadSfx } from "../../lib/sfx";
import Phone from "../phone/Phone";
import { BlitzPlay, CoursePlay, ProfilePlay, QuizPlay } from "../phone/playScreens";

const SCREEN = {
  libre: { glow: "green" as const, dark: false, sfx: "click" as const, anim: "pop" as const, node: (k: number) => <CoursePlay playKey={k} /> },
  guide: { glow: "blue" as const, dark: false, sfx: "click" as const, anim: "pop" as const, node: (k: number) => <ProfilePlay playKey={k} /> },
  cramming: { glow: "amber" as const, dark: false, sfx: "correct" as const, anim: "win" as const, node: (k: number) => <QuizPlay playKey={k} outcome="ok" /> },
  blitz: { glow: "red" as const, dark: true, sfx: "timesUp" as const, anim: "shake" as const, node: (k: number) => <BlitzPlay playKey={k} /> },
};

export default function ModeShowcase() {
  const [id, setId] = useState<(typeof MODES)[number]["id"]>("libre");
  const [playKey, setPlayKey] = useState(0);
  const mode = MODES.find((m) => m.id === id)!;
  const screen = SCREEN[id];

  const play = (next: (typeof MODES)[number]["id"]) => {
    preloadSfx();
    playSfx(SCREEN[next].sfx);
    setId(next);
    setPlayKey((k) => k + 1);
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {MODES.map((m) => {
          const on = m.id === id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => play(m.id)}
              aria-pressed={on}
              className="rounded-[24px] border-2 p-5 text-left transition"
              style={{
                background: m.bg,
                borderColor: on ? m.color : m.border,
                boxShadow: on ? `0 12px 32px ${m.color}33` : "none",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white text-lg font-black"
                  style={{ color: m.color }}
                >
                  ▶
                </span>
                {on ? (
                  <span className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: m.color }}>
                    En lecture
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#A8A29E]">Clique</span>
                )}
              </div>
              <p className="text-lg font-extrabold" style={{ color: m.color }}>
                {m.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1C1917]">{m.sub}</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748B]">{m.purpose}</p>
              <p className="mt-3 text-xs font-bold" style={{ color: m.color }}>
                {m.hint}
              </p>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center">
        <button type="button" onClick={() => play(id)} aria-label="Relancer l’animation" className="cursor-pointer">
          <div key={playKey} className={`lf-demo-phone lf-anim-${screen.anim}`}>
            <Phone glow={screen.glow} dark={screen.dark} label={mode.label}>
              {screen.node(playKey)}
            </Phone>
          </div>
        </button>
        <p className="mt-4 text-center text-xs font-semibold text-[#A8A29E]">Clique un mode — le téléphone s’anime (avec le son).</p>
      </div>
    </div>
  );
}
