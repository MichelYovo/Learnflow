"use client";

import { useEffect, useState } from "react";

const MOODS = ["joyeux", "surpris", "confiant", "timide", "calme", "determine", "enerve", "neutre"] as const;

const QUIPS = ["Allez !", "Hihi !", "On y va ?", "Je vole.", "Touche-moi !", "Tu gères."];

const FLOATERS = [
  { mood0: 0, size: 86, className: "lf-spira-fly-a hidden md:block", delay: "0s" },
  { mood0: 3, size: 72, className: "lf-spira-fly-b hidden lg:block", delay: "0.6s" },
  { mood0: 5, size: 64, className: "lf-spira-fly-c hidden xl:block", delay: "1.2s" },
];

export default function SpiraFloaters() {
  const [tick, setTick] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [poke, setPoke] = useState<{ i: number; n: number; line: string } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    if (mq.matches) return () => mq.removeEventListener("change", sync);
    const t = window.setInterval(() => setTick((n) => n + 1), 2800);
    return () => {
      mq.removeEventListener("change", sync);
      window.clearInterval(t);
    };
  }, []);

  if (reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[25] overflow-hidden">
      {FLOATERS.map((f, i) => {
        const mood = poke?.i === i ? "joyeux" : MOODS[(f.mood0 + tick) % MOODS.length];
        return (
          <button
            key={i}
            type="button"
            aria-label="Spira — touche-moi"
            className={`lf-spira-fly ${f.className} pointer-events-auto absolute cursor-pointer border-0 bg-transparent p-0`}
            style={{ animationDelay: f.delay, width: f.size, height: f.size }}
            onClick={() => {
              setPoke({
                i,
                n: Date.now(),
                line: QUIPS[Math.floor(Math.random() * QUIPS.length)],
              });
              window.setTimeout(() => setPoke((p) => (p?.i === i ? null : p)), 1600);
            }}
          >
            {poke?.i === i ? (
              <span className="lf-spira-grimace absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white px-2 py-0.5 text-[11px] font-extrabold text-[#0F172A] shadow">
                {poke.line}
              </span>
            ) : null}
            <img
              key={`${i}-${mood}-${poke?.i === i ? poke.n : 0}`}
              src={`/spira/${mood}.png`}
              alt=""
              width={f.size}
              height={f.size}
              className="lf-spira-fly-bob lf-spira-grimace h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(15,23,42,0.2)]"
            />
          </button>
        );
      })}
    </div>
  );
}
