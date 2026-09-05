"use client";

import { useEffect, useState } from "react";
import Phone from "../phone/Phone";
import { BlitzMock, HomeMock, LeagueMock, QuizMock } from "../phone/screens";

const SCENES = [
  { id: "home", label: "Accueil", glow: "blue" as const, node: <HomeMock /> },
  { id: "quiz", label: "10/10", glow: "green" as const, node: <QuizMock /> },
  { id: "ligue", label: "Ligues", glow: "amber" as const, node: <LeagueMock /> },
  { id: "blitz", label: "Blitz", glow: "red" as const, node: <BlitzMock /> },
];

export default function HeroPhones() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % SCENES.length), 4200);
    return () => window.clearInterval(t);
  }, []);

  const left = SCENES[(i + 3) % SCENES.length];
  const center = SCENES[i];
  const right = SCENES[(i + 1) % SCENES.length];

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1677FF]/15 blur-3xl" />
      <div className="relative flex items-end justify-center gap-0 pt-6 md:min-h-[680px]">
        <div className="absolute left-0 top-10 hidden origin-bottom md:block" style={{ transform: "rotate(-14deg) translateX(8px) translateY(48px) scale(0.82)" }}>
          <Phone glow={left.glow} dark={left.id === "blitz"} label={left.label}>
            {left.node}
          </Phone>
        </div>
        <div className="relative z-20">
          <Phone float glow={center.glow} dark={center.id === "blitz"} label={center.label}>
            {center.node}
          </Phone>
        </div>
        <div className="absolute right-0 top-10 hidden origin-bottom md:block" style={{ transform: "rotate(14deg) translateX(-8px) translateY(48px) scale(0.82)" }}>
          <Phone glow={right.glow} dark={right.id === "blitz"} label={right.label}>
            {right.node}
          </Phone>
        </div>
      </div>
      <div className="relative z-20 mt-8 flex justify-center gap-2">
        {SCENES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Voir l’écran ${s.label}`}
            aria-pressed={idx === i}
            onClick={() => setI(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-[#1677FF]" : "w-2.5 bg-[#BAE0FF] hover:bg-[#1677FF]/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
