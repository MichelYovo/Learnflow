"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import { PrimaryButton } from "@/components/ui";
import { spiraMoodForSession } from "@/data/spira";
import { cardsDueToday } from "@/engine/spacedRepetition";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { DifficulteFlash } from "@/types/learnflow";

function FlashInner() {
  const search = useSearchParams();
  const router = useRouter();
  const { colors } = useAppTheme();
  const flashcards = useLearnFlowStore((s) => s.flashcards);
  const rateFlashcard = useLearnFlowStore((s) => s.rateFlashcard);
  const guided = search.get("mode") === "Guide";
  const mood = spiraMoodForSession(search.get("mode"));
  const chapterId = search.get("chapterId") ?? undefined;
  const deck = useMemo(() => {
    const base = guided ? cardsDueToday(flashcards) : flashcards;
    if (chapterId) {
      const scoped = base.filter((c) => !c.chapitreId || c.chapitreId === chapterId);
      if (scoped.length) return scoped;
    }
    return base;
  }, [flashcards, guided, chapterId]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  if (deck.length === 0) {
    return (
      <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center gap-3 px-6 text-center lg:min-h-dvh">
        <Spira scene="flash.empty" size={80} message="" />
        <p className="text-lg font-extrabold">Aucune carte due</p>
        <button type="button" onClick={() => router.back()} className="font-extrabold" style={{ color: colors.primary }}>
          Retour
        </button>
      </div>
    );
  }

  const card = deck[Math.min(idx, deck.length - 1)];
  const rate = (d: DifficulteFlash) => {
    rateFlashcard(card.id, d);
    if (idx + 1 >= deck.length) setDone(true);
    else {
      setIdx((i) => i + 1);
      setFlipped(false);
    }
  };

  const next = () => {
    if (idx + 1 >= deck.length) setDone(true);
    else {
      setIdx((i) => i + 1);
      setFlipped(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center gap-4 px-6 text-center lg:min-h-dvh">
        <Spira scene="flash.done" size={88} />
        <p className="text-lg font-extrabold">Session flashcards terminée</p>
        <div className="w-full max-w-sm">
          <PrimaryButton onClick={() => router.back()}>OK</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full min-w-0 max-w-xl flex-col px-[clamp(0.75rem,3.6vw,1.5rem)] py-4 lg:min-h-dvh">
      <div className="mb-2 flex items-center gap-3 px-2">
        <button type="button" onClick={() => router.back()} aria-label="Retour">
          <Icon name="arrow-left" size={20} color={colors.textDark} />
        </button>
        <span className="flex-1 text-sm font-extrabold" style={{ color: colors.primary }}>
          {idx + 1}/{deck.length}
        </span>
      </div>
      <div className="flex flex-col">
      <div className="mb-1 flex justify-center">
        <Spira mood={mood} size={52} message="" />
      </div>
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className="mx-auto mt-2 flex min-h-[min(52vh,420px)] w-full max-w-full items-center justify-center rounded-[28px] p-5 text-center text-[clamp(1.15rem,4vw+0.4rem,1.5rem)] font-extrabold leading-snug sm:p-7"
        style={{ background: colors.white }}
      >
        {flipped ? card.verso : card.recto}
      </button>
      {flipped && guided ? (
        <div className="mt-6 flex gap-2.5 px-2">
          {(["Difficile", "Moyen", "Facile"] as DifficulteFlash[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => rate(d)}
              className="flex-1 rounded-2xl border-[1.5px] py-4 text-sm font-extrabold"
              style={{
                background: colors.white,
                borderColor: d === "Facile" ? colors.secondary : d === "Moyen" ? colors.accent : colors.danger,
                color: d === "Facile" ? colors.secondary : d === "Moyen" ? colors.accent : colors.danger,
              }}
            >
              {d}
            </button>
          ))}
        </div>
      ) : null}
      {flipped && !guided ? (
        <div className="mx-2 mt-4">
          <button
            type="button"
            onClick={next}
            className="w-full rounded-[14px] py-3.5 text-sm font-extrabold text-white"
            style={{ background: colors.secondary }}
          >
            {idx + 1 >= deck.length ? "Terminer" : "Carte suivante"}
          </button>
        </div>
      ) : null}
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={null}>
      <FlashInner />
    </Suspense>
  );
}
