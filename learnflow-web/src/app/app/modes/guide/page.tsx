"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import { ScreenHeader, PrimaryButton } from "@/components/ui";
import { spiraForFlashRating, type SpiraMoodId } from "@/data/spira";
import { cardsDueToday, daysUntilNext } from "@/engine/spacedRepetition";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { DifficulteFlash } from "@/types/learnflow";

function spiraAfterRating(d: DifficulteFlash, days: number) {
  if (d === "Facile") return `Dans ${days} jour${days > 1 ? "s" : ""}.`;
  if (d === "Moyen") return "Bientôt.";
  return "On y revient vite.";
}

export default function ModeGuidePage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const flashcards = useLearnFlowStore((s) => s.flashcards);
  const rateFlashcard = useLearnFlowStore((s) => s.rateFlashcard);
  const liveDue = useMemo(() => cardsDueToday(flashcards), [flashcards]);
  const [deck, setDeck] = useState(liveDue);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [mood, setMood] = useState<SpiraMoodId>("confiant");
  const [speech, setSpeech] = useState(
    liveDue.length > 0
      ? `${liveDue.length} carte${liveDue.length > 1 ? "s" : ""} due${liveDue.length > 1 ? "s" : ""} aujourd'hui.`
      : "Rien à réviser aujourd'hui."
  );

  const card = deck[Math.min(idx, Math.max(deck.length - 1, 0))];

  const rate = (d: DifficulteFlash) => {
    if (!card) return;
    const days = daysUntilNext(d, card.intervalleRepetJ);
    rateFlashcard(card.id, d);
    setMood(spiraForFlashRating(d));
    setSpeech(spiraAfterRating(d, days));
    if (idx + 1 >= deck.length) {
      setTimeout(() => setDone(true), 420);
    } else {
      setTimeout(() => {
        setIdx((i) => i + 1);
        setFlipped(false);
      }, 280);
    }
  };

  if (liveDue.length === 0 && !started) {
    return (
      <div>
        <ScreenHeader title="Mode Guidé" backHref="/app" />
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-7">
          <Spira scene="mode.guide.empty" size={96} message={speech} />
          <button type="button" onClick={() => router.push("/app")} className="text-base font-extrabold" style={{ color: colors.primary }}>
            Retour accueil
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div>
        <ScreenHeader
          title="Mode Guidé"
          backHref="/app"
          right={
            <button type="button" onClick={() => router.push("/app/modes/customize?mode=Guide")} className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: colors.white }}>
              <Icon name="settings" size={16} color={colors.textDark} />
            </button>
          }
        />
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-7">
          <Spira scene="mode.guide" size={96} message={speech} />
          <div className="w-full max-w-xs">
            <PrimaryButton
              onClick={() => {
                setDeck(liveDue);
                setStarted(true);
                setMood("confiant");
                setSpeech("");
              }}
            >
              Lancer l&apos;entretien
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <ScreenHeader title="Mode Guidé" backHref="/app" />
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-7">
          <Spira scene="mode.guide.done" size={88} />
          <div className="w-full max-w-xs">
            <PrimaryButton onClick={() => router.push("/app")}>Terminer</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader
        title="Mode Guidé"
        backHref="/app"
        right={
          <span className="text-[15px] font-bold" style={{ color: colors.primary }}>
            {idx + 1}/{deck.length}
          </span>
        }
      />
      <div className="mx-auto max-w-xl px-6 py-4">
        <div className="mb-2 flex justify-center">
          <Spira mood={mood} size={56} message={speech} />
        </div>
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="flex min-h-[240px] w-full items-center justify-center rounded-[28px] p-7 text-center text-2xl font-extrabold leading-8"
          style={{ background: colors.white }}
        >
          {flipped ? card.verso : card.recto}
        </button>
        {flipped ? (
          <div className="mt-6 flex gap-2.5">
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
      </div>
    </div>
  );
}
