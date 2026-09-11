"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spira from "./Spira";
import type { SpiraMoodId } from "@/data/spira";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

type Step = {
  targets: string[];
  mood: SpiraMoodId;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    targets: ["[data-tour='continue']"],
    mood: "confiant",
    title: "Ton cours",
    body: "Ici tu reprends ton chapitre. Un cours n’est validé que quand tu as vraiment le 10/10.",
  },
  {
    targets: ["[data-tour='modes']"],
    mood: "surpris",
    title: "Quatre modes",
    body: "Libre, Guidé, Cramming ou Blitz — tu choisis selon le moment, jamais l’inverse.",
  },
  {
    targets: ["[data-tour='matieres']"],
    mood: "calme",
    title: "Tes matières",
    body: "Le programme APC Togo, collège et lycée. Tape une matière pour ouvrir les cours.",
  },
  {
    targets: ["[data-tour='nav-cours-side']", "[data-tour='nav-cours']"],
    mood: "calme",
    title: "Cours",
    body: "Tout le programme est ici. C’est par là que tu ouvres un chapitre.",
  },
  {
    targets: ["[data-tour='nav-ligue-side']", "[data-tour='nav-ligue']"],
    mood: "joyeux",
    title: "Ligues",
    body: "Tu gagnes de l’XP, tu grimpes ta ligue, tu vois tes camarades. Sans la pression.",
  },
  {
    targets: ["[data-tour='nav-agenda-side']", "[data-tour='agenda']"],
    mood: "determine",
    title: "Agenda",
    body: "Le bouton du milieu, c’est l’agenda. Planifie tes séances pour ne pas improviser.",
  },
  {
    targets: ["[data-tour='tuteur']"],
    mood: "neutre",
    title: "Spira t’aide",
    body: "Si tu bloques, ouvre le tuteur. Il t’explique ici, même hors ligne.",
  },
];

function visibleTarget(selectors: string[]): HTMLElement | null {
  for (const sel of selectors) {
    const nodes = document.querySelectorAll<HTMLElement>(sel);
    for (const node of nodes) {
      const r = node.getBoundingClientRect();
      if (r.width > 4 && r.height > 4) return node;
    }
  }
  return null;
}

export default function AppTour() {
  const pathname = usePathname();
  const { colors } = useAppTheme();
  const done = useLearnFlowStore((s) => s.appTourCompleted);
  const complete = useLearnFlowStore((s) => s.completeAppTour);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const active = !done && pathname === "/app";
  const current = STEPS[step];

  const measure = useCallback(() => {
    if (!active || !current) return;
    const el = visibleTarget(current.targets);
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
    setRect(el.getBoundingClientRect());
  }, [active, current]);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(measure, 80);
    const skip = window.setTimeout(() => {
      if (!visibleTarget(current.targets)) {
        if (step + 1 >= STEPS.length) complete();
        else setStep((s) => s + 1);
      }
    }, 700);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(skip);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      document.body.style.overflow = prev;
    };
  }, [active, measure, step, current, complete]);

  if (!active || !current) return null;

  const pad = 8;
  const hole = rect
    ? {
        top: Math.max(8, rect.top - pad),
        left: Math.max(8, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  const placeAbove = hole ? hole.top > 280 : false;
  const next = () => {
    if (step + 1 >= STEPS.length) complete();
    else setStep((s) => s + 1);
  };

  return (
    <div className="lf-tour" role="dialog" aria-modal="true" aria-label="Guide Spira">
      {hole ? (
        <div
          className="lf-tour-hole"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
          }}
        />
      ) : null}
      <div
        className="lf-tour-card"
        style={{
          background: colors.white,
          color: colors.textDark,
          borderColor: colors.border,
          ...(placeAbove && hole
            ? { bottom: window.innerHeight - hole.top + 14 }
            : hole
              ? { top: hole.top + hole.height + 14 }
              : { bottom: 24 }),
        }}
      >
        <div className="flex items-start gap-3">
          <Spira mood={current.mood} size={64} message="" />
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: colors.primary }}>
              Spira t’accompagne
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold leading-tight">{current.title}</h2>
            <p className="mt-1.5 text-[14px] font-semibold leading-5" style={{ color: colors.textSecondary }}>
              {current.body}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" className="text-[13px] font-extrabold" style={{ color: colors.textMuted }} onClick={complete}>
            Passer
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-2xl px-5 py-2.5 text-[14px] font-extrabold text-white"
            style={{ background: colors.primary }}
          >
            {step + 1 >= STEPS.length ? "C’est bon" : `Suivant (${step + 1}/${STEPS.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
