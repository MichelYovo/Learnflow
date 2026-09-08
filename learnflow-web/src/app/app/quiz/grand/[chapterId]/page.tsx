"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizPlay from "@/components/quiz/QuizPlay";
import Spira from "@/components/Spira";
import { PrimaryButton } from "@/components/ui";
import { questionsForGrandQuiz } from "@/data/modeContent";
import { usePublishedCatalog } from "@/data/publishedCache";
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
  usePublishedCatalog();
  const questions = questionsForGrandQuiz(chapterId, profile?.classe);
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
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
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
    playSfx(i === q.indexReponseCorrecte ? "correct" : "wrong");
  };

  const continueQuiz = () => {
    const next = score + (selected === q.indexReponseCorrecte ? 1 : 0);
    setScore(next);
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
  };

  if (done) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
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
    <QuizPlay
      kicker={`Grand Quizz${q.matiere ? ` · ${q.matiere}` : ""}`}
      current={current}
      total={questions.length}
      question={q.enonceQuestion}
      options={q.optionsProposees}
      correctIndex={q.indexReponseCorrecte}
      selected={selected}
      onPick={pick}
      onBack={() => router.back()}
      onContinue={continueQuiz}
      explanation={q.explicationPedagogique}
      headerRight={<Spira scene="quiz.play" size={36} message="" />}
    />
  );
}
