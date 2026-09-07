"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import { PrimaryButton } from "@/components/ui";
import { GRAND_QUIZZ } from "@/data/mock";
import { spiraForScore } from "@/data/spira";
import { calculerXP } from "@/engine/xp";
import { playSfx, preloadSfx } from "@/lib/sfx";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function GrandQuizzPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const canAccess = useLearnFlowStore((s) => s.canAccessGrandQuizz(chapterId));
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const accumulerXP = useLearnFlowStore((s) => s.accumulerXP);
  const questions = GRAND_QUIZZ;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[current];

  useEffect(() => {
    preloadSfx();
  }, []);

  if (!canAccess) {
    return (
      <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center px-6 text-center lg:min-h-dvh">
        <Spira scene="quiz.locked" size={96} />
        <h1 className="mt-3 text-xl font-black">Grand Quizz verrouillé</h1>
        <p className="mt-2 text-sm font-semibold" style={{ color: colors.textMuted }}>
          Valide d&apos;abord le 10/10 (ou attends la fin du repos 1 h).
        </p>
        <div className="mt-6 w-full max-w-sm">
          <PrimaryButton onClick={() => router.push(`/app/quiz/assimilation/${chapterId}`)}>Aller à l&apos;assimilation</PrimaryButton>
        </div>
      </div>
    );
  }

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === q.indexReponseCorrecte;
    playSfx(ok ? "correct" : "wrong");
    const next = ok ? score + 1 : score;
    if (ok) setScore(next);
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        const xp = calculerXP({
          baseXP: next * 20,
          classe: profile.classe,
          densiteChapitre: 1.2,
          multiplicateurPrecision: 2,
        });
        accumulerXP(xp);
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 450);
  };

  if (done) {
    return (
      <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center px-6 text-center lg:min-h-dvh">
        <Spira
          mood={spiraForScore(score, questions.length)}
          size={96}
          message={score === questions.length ? "Sprint parfait !" : "Grand Quizz terminé. XP sprint ×2 appliqué."}
        />
        <p className="mt-3 text-3xl font-extrabold">
          {score}/{questions.length}
        </p>
        <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMuted }}>
          Grand Quizz terminé · XP sprint ×2 appliqué
        </p>
        <div className="mt-6 w-full max-w-sm">
          <PrimaryButton onClick={() => router.push("/app")}>Retour</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] max-w-2xl flex-col lg:min-h-dvh">
      <div className="flex items-center justify-between px-4 py-4">
        <button type="button" onClick={() => router.back()} aria-label="Retour">
          <Icon name="arrow-left" size={20} color={colors.textDark} />
        </button>
        <span className="text-sm font-extrabold" style={{ color: colors.primary }}>
          Grand Quizz · {current + 1}/{questions.length}
        </span>
        <Spira scene="quiz.play" size={36} message="" />
      </div>
      <h1 className="shrink-0 px-5 pt-2 text-[17px] font-extrabold leading-6 sm:text-[18px] sm:leading-7">
        {q.enonceQuestion}
      </h1>
      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-5 py-6">
        <div className="mt-5 flex shrink-0 flex-col gap-4 sm:gap-5">
          {q.optionsProposees.map((opt, i) => {
            const on = selected === i;
            const ok = on && i === q.indexReponseCorrecte;
            const ko = on && i !== q.indexReponseCorrecte;
            return (
              <button
                key={opt}
                type="button"
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  pick(i);
                }}
                onClick={() => pick(i)}
                className="w-full shrink-0 rounded-2xl border-2 px-3 py-2 text-left font-bold"
                style={{
                  background: ok ? colors.svtBg : ko ? colors.angBg : colors.white,
                  borderColor: ok ? colors.secondary : ko ? colors.danger : colors.border,
                  transform: ok ? "scale(1.02)" : ko ? "scale(0.99)" : undefined,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
