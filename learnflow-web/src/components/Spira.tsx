"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  pickSpiraQuip,
  resolveSpiraScene,
  SPIRA_PEEK_MOODS,
  type SpiraMoodId,
  type SpiraScene,
} from "@/data/spira";
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

type Act = "idle" | "look" | "hop" | "peek" | "react";

type Props = {
  mood?: SpiraMoodId;
  scene?: SpiraScene;
  size?: number;
  message?: string;
  animated?: boolean;
  /** Tap : saut + réplique. Désactiver dans un autre bouton. */
  interactive?: boolean;
  /** Décale Spira dans un petit périmètre — plus figée au centre. */
  wander?: boolean;
};

export default function Spira({
  mood,
  scene,
  size = 64,
  message,
  animated = true,
  interactive,
  wander,
}: Props) {
  const { colors } = useAppTheme();
  const fromScene = scene ? resolveSpiraScene(scene) : null;
  const baseMood = mood ?? fromScene?.mood ?? "neutre";
  const text = message === "" ? undefined : (message ?? fromScene?.message);
  const canTap = interactive ?? size >= 52;
  const canWander = wander ?? size >= 64;
  const range = canWander ? Math.min(36, Math.max(14, Math.round(size * 0.32))) : 0;

  const [reduce, setReduce] = useState(false);
  const [act, setAct] = useState<Act>("idle");
  const [slot, setSlot] = useState(0);
  const [flash, setFlash] = useState<SpiraMoodId | null>(null);
  const [quip, setQuip] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!animated || reduce) return;
    let cancelled = false;
    let timer = 0;
    const loop = () => {
      const wait = 2200 + Math.random() * 2600;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        const roll = Math.random();
        if (canWander && roll < 0.42) {
          setSlot((s) => {
            const next = [-1, 0, 1].filter((x) => x !== s);
            return next[Math.floor(Math.random() * next.length)];
          });
          setAct("hop");
        } else if (roll < 0.72) {
          setAct("look");
        } else {
          setAct("peek");
          setFlash(SPIRA_PEEK_MOODS[Math.floor(Math.random() * SPIRA_PEEK_MOODS.length)]);
          window.setTimeout(() => {
            if (!cancelled) setFlash(null);
          }, 720);
        }
        window.setTimeout(() => {
          if (!cancelled) setAct("idle");
        }, 820);
        loop();
      }, wait);
    };
    loop();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [animated, canWander, reduce]);

  const react = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      if (!canTap || reduce) return;
      setAct("react");
      setFlash(Math.random() > 0.45 ? "joyeux" : "surpris");
      setQuip(pickSpiraQuip());
      window.setTimeout(() => setAct("idle"), 700);
      window.setTimeout(() => setFlash(null), 900);
      window.setTimeout(() => setQuip(null), 2200);
    },
    [canTap, reduce],
  );

  const id = flash ?? baseMood;
  const live = animated && !reduce;
  const padX = range + (canWander ? 6 : 0);
  const stageClass = live ? `lf-spira-3d lf-spira-${act}` : "lf-spira-3d";

  const inner = (
    <>
      {quip ? (
        <span
          className="lf-spira-quip pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border px-2.5 py-1 text-[11px] font-extrabold shadow-sm"
          style={{
            top: -6,
            color: colors.textDark,
            background: colors.white,
            borderColor: colors.border,
          }}
        >
          {quip}
        </span>
      ) : null}
      <span
        className="lf-spira-stage relative inline-flex items-end justify-center overflow-visible"
        style={{
          width: size,
          height: size,
          transform: live ? `translateX(${slot * range}px)` : undefined,
        }}
      >
        {live ? <span className="lf-spira-ground" aria-hidden /> : null}
        <span className={`${stageClass} relative z-[1] overflow-visible`}>
          <Image
            src={ASSETS[id]}
            alt={canTap ? "Spira — touche-moi" : `Spira ${id}`}
            width={size}
            height={size}
            className="bg-transparent object-contain"
            style={{ width: size, height: size, background: "transparent" }}
            priority={size >= 80}
          />
        </span>
      </span>
    </>
  );

  return (
    <div className="relative flex flex-col items-center gap-2 overflow-visible">
      {canTap ? (
        <button
          type="button"
          onClick={react}
          aria-label="Spira — touche-moi"
          className="relative flex cursor-pointer flex-col items-center border-0 bg-transparent p-0"
          style={{ width: size + padX * 2, minHeight: size + (quip ? 22 : 0) }}
        >
          {inner}
        </button>
      ) : (
        <div className="relative flex flex-col items-center" style={{ width: size + padX * 2 }}>
          {inner}
        </div>
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
