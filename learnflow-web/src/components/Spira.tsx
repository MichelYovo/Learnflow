"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { pickSpiraQuip, resolveSpiraScene, type SpiraMoodId, type SpiraScene } from "@/data/spira";
import { useAppTheme } from "@/theme/useAppTheme";

const ASSETS: Record<SpiraMoodId, string> = {
  joyeux: "/spira/joyeux.png",
  calme: "/spira/calme.png",
  confiant: "/spira/confiant.png",
  triste: "/spira/triste.png",
  enerve: "/spira/enerve.png",
  timide: "/spira/timide.png",
  surpris: "/spira/surpris.png",
  neutre: "/spira/neutre.png",
  determine: "/spira/determine.png",
  fatigue: "/spira/fatigue.png",
};

type Props = {
  mood?: SpiraMoodId;
  scene?: SpiraScene;
  size?: number;
  message?: string;
  /** false = figée (accueil, cartes mode). true = entrée 1s + respiration Duo. */
  animated?: boolean;
  interactive?: boolean;
  /** conservé pour compat — plus de déplacement. */
  wander?: boolean;
};

export default function Spira({
  mood,
  scene,
  size = 64,
  message,
  animated = true,
  interactive = false,
}: Props) {
  const { colors } = useAppTheme();
  const fromScene = scene ? resolveSpiraScene(scene) : null;
  const id = mood ?? fromScene?.mood ?? "neutre";
  const text = message === "" ? undefined : (message ?? fromScene?.message);
  const [reduce, setReduce] = useState(false);
  const [act, setAct] = useState<"idle" | "react">("idle");
  const [quip, setQuip] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const live = animated && !reduce;
  const react = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      if (!interactive || reduce) return;
      setAct("react");
      setQuip(pickSpiraQuip());
      window.setTimeout(() => setAct("idle"), 720);
      window.setTimeout(() => setQuip(null), 1800);
    },
    [interactive, reduce],
  );

  const sprite = (
    <span className="relative inline-flex items-end justify-center overflow-visible" style={{ width: size, height: size }}>
      {quip ? (
        <span
          className="lf-spira-quip pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border px-2.5 py-1 text-[11px] font-extrabold shadow-sm"
          style={{ top: -8, color: colors.textDark, background: colors.white, borderColor: colors.border }}
        >
          {quip}
        </span>
      ) : null}
      <span className={`lf-spira-3d relative z-[1] overflow-visible ${live ? (act === "react" ? "lf-spira-react" : "lf-spira-live") : ""}`}>
        <Image
          src={ASSETS[id]}
          alt={interactive ? "Spira" : `Spira ${id}`}
          width={size}
          height={size}
          className="bg-transparent object-contain"
          style={{ width: size, height: size, background: "transparent" }}
          priority={size >= 80}
        />
      </span>
    </span>
  );

  return (
    <div className="relative flex flex-col items-center gap-2 overflow-visible">
      {interactive ? (
        <button type="button" onClick={react} aria-label="Spira" className="border-0 bg-transparent p-0">
          {sprite}
        </button>
      ) : (
        sprite
      )}
      {text ? (
        <p
          className="max-w-xs rounded-[20px] border px-4 py-3 text-center text-base font-bold leading-snug"
          style={{ color: colors.textDark, background: colors.white, borderColor: colors.border }}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}
