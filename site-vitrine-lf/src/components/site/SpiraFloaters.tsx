"use client";

import { useEffect, useState } from "react";

const MOODS = ["joyeux", "surpris", "confiant", "timide", "calme", "determine", "enerve", "neutre"] as const;

const FLOATERS = [
  { mood0: 0, size: 78, className: "lf-spira-fly-a hidden md:block", delay: "0s" },
  { mood0: 3, size: 68, className: "lf-spira-fly-b", delay: "0.6s" },
];

export default function SpiraFloaters() {
  const [tick, setTick] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    if (mq.matches) return () => mq.removeEventListener("change", sync);
    const t = window.setInterval(() => setTick((n) => n + 1), 2200);
    return () => {
      mq.removeEventListener("change", sync);
      window.clearInterval(t);
    };
  }, []);

  if (reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[25] overflow-hidden" aria-hidden>
      {FLOATERS.map((f, i) => {
        const mood = MOODS[(f.mood0 + tick) % MOODS.length];
        return (
          <div
            key={i}
            className={`lf-spira-fly ${f.className} absolute`}
            style={{ animationDelay: f.delay, width: f.size, height: f.size }}
          >
            <img
              key={`${i}-${mood}`}
              src={`/spira/${mood}.png`}
              alt=""
              width={f.size}
              height={f.size}
              className="lf-spira-grimace h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(15,23,42,0.2)]"
            />
          </div>
        );
      })}
    </div>
  );
}
