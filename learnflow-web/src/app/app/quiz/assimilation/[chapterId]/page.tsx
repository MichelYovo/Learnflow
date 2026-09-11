"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import QuizPlay from "@/components/quiz/QuizPlay";
import SessionRecap, { useSessionStats } from "@/components/SessionRecap";
import Spira from "@/components/Spira";
import { questionsForChapter } from "@/data/modeContent";
import { findChapterMeta } from "@/data/programme";
import { usePublishedCatalog } from "@/data/publishedCache";
import { playSfx, preloadSfx } from "@/lib/sfx";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function QuizInner() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const search = useSearchParams();
  const loopErrors = search.get("loop") === "1";
  const router = useRouter();
  const { colors } = useAppTheme();
  const catalogEpoch = usePublishedCatalog();
  const classe = useLearnFlowStore((s) => s.getActiveProfile()?.classe);
  const chapterTitle = findChapterMeta(chapterId)?.chapter.title;
  const bank = useMemo(() => questionsForChapter(chapterId, classe), [chapterId, classe, catalogEpoch]);
  const [queue, setQueue] = useState(bank);
  const recordAssimilation = useLearnFlowStore((s) => s.recordAssimilation);
  const lockGrandQuizzOneHour = useLearnFlowStore((s) => s.lockGrandQuizzOneHour);
  const firstTryRef = useRef(true);
  const missedRef = useRef<typeof bank>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ xp: number; unlocked: boolean; challenger: boolean } | null>(null);
  const q = queue[current];
  const recapStats = useSessionStats({
    xp: result?.xp ?? 0,
    score,
    total: queue.length,
  });

  useEffect(() => {
    preloadSfx();
  }, []);

  const advance = () => {
    const nextScore = score + (selected === q?.indexReponseCorrecte ? 1 : 0);
    setScore(nextScore);
    if (current + 1 >= queue.length) {
      const res = recordAssimilation(chapterId, nextScore, queue.length, firstTryRef.current);
      setResult(res);
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const pick = (i: number) => {
    if (selected !== null || !q) return;
    setSelected(i);
    if (i === q.indexReponseCorrecte) {
      playSfx("correct");
    } else {
      playSfx("wrong");
      firstTryRef.current = false;
      missedRef.current = [...missedRef.current, q];
    }
  };

  if (done && result) {
    const perfect = result.unlocked;
    const missed = missedRef.current;
    return (
      <SessionRecap
        success={perfect}
        title={perfect ? "Parfait !" : `${score}/${queue.length}`}
        subtitle={
          loopErrors
            ? perfect
              ? `Chapitre maîtrisé · +${result.xp} XP`
              : "Sans chrono — on reboucle uniquement sur tes erreurs."
            : perfect
              ? `Règle du 10/10 validée · +${result.xp} XP${result.challenger ? " · Badge CHALLENGER" : ""}`
              : "Accès au Grand Quizz refusé — revois les points ratés"
        }
        stats={recapStats}
      >
        {loopErrors ? (
          !perfect && missed.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setQueue(missed);
                missedRef.current = [];
                setDone(false);
                setCurrent(0);
                setScore(0);
                setSelected(null);
                setResult(null);
              }}
              className="w-full rounded-[14px] py-3.5 text-[15px] font-extrabold text-white"
              style={{ background: colors.primary }}
            >
              Boucler sur les {missed.length} erreurs
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/app/modes/cramming")}
              className="w-full rounded-[14px] py-3.5 text-[15px] font-extrabold text-white"
              style={{ background: colors.primary }}
            >
              Retour Cramming
            </button>
          )
        ) : perfect ? (
          <>
            <p className="text-center text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
              Étape 2 — Instant T
            </p>
            <button
              type="button"
              onClick={() => router.replace(`/app/quiz/grand/${chapterId}`)}
              className="flex w-full items-center gap-3 rounded-[18px] border-2 px-3 py-3 text-left sm:p-4"
              style={{ background: colors.mathsBg, borderColor: colors.mathsBorder }}
            >
              <Icon name="zap" size={20} color={colors.primary} />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-extrabold sm:text-[15px]" style={{ color: colors.primary }}>
                  Option Sprint
                </span>
                <span className="text-[12px] font-medium sm:text-[13px]" style={{ color: colors.textSecondary }}>
                  Enchaîner le Grand Quizz maintenant
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                lockGrandQuizzOneHour(chapterId);
                router.push("/app");
              }}
              className="flex w-full items-center gap-3 rounded-[18px] border-2 px-3 py-3 text-left sm:p-4"
              style={{ background: colors.white, borderColor: colors.border }}
            >
              <Spira scene="quiz.rest" size={36} message="" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-extrabold sm:text-[15px]" style={{ color: colors.accent }}>
                  Option Repos
                </span>
                <span className="text-[12px] font-medium sm:text-[13px]" style={{ color: colors.textSecondary }}>
                  Verrouille 1h + rappel local (démo)
                </span>
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => router.push(`/app/cours/${chapterId}`)}
              className="w-full rounded-[14px] py-3.5 text-[15px] font-extrabold text-white"
              style={{ background: colors.primary }}
            >
              Revoir ce point (deep link cours)
            </button>
            <button
              type="button"
              onClick={() => {
                setDone(false);
                setCurrent(0);
                setScore(0);
                setSelected(null);
                setResult(null);
              }}
              className="w-full rounded-[14px] border-2 py-3.5 text-[15px] font-extrabold"
              style={{ background: colors.white, borderColor: colors.border, color: colors.textDark }}
            >
              Réessayer le quizz
            </button>
          </>
        )}
      </SessionRecap>
    );
  }

  if (!q) return null;

  return (
    <QuizPlay
      kicker={`Assimilation${q.matiere ? ` · ${q.matiere}` : ""}${chapterTitle ? ` · ${chapterTitle}` : ""}`}
      current={current}
      total={queue.length}
      question={q.enonceQuestion}
      options={q.optionsProposees}
      correctIndex={q.indexReponseCorrecte}
      selected={selected}
      onPick={pick}
      onBack={() => router.back()}
      onContinue={advance}
      explanation={q.explicationPedagogique}
      optionNotes={q.optionNotes}
      reviewLabel={q.ancreCours ? `Revoir ce point → ${q.ancreCours}` : "Revoir ce point → cours"}
      onReview={() => router.push(`/app/cours/${chapterId}`)}
      headerRight={<Spira scene="quiz.play" size={36} message="" />}
    />
  );
}

export default function AssimilationPage() {
  return (
    <Suspense fallback={null}>
      <QuizInner />
    </Suspense>
  );
}
