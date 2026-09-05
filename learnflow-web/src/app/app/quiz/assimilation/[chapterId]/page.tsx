"use client";

import { useRef, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import { questionsForChapter } from "@/data/modeContent";
import { playSfx } from "@/lib/sfx";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function QuizInner() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const search = useSearchParams();
  const loopErrors = search.get("loop") === "1";
  const router = useRouter();
  const { colors } = useAppTheme();
  const bank = questionsForChapter(chapterId);
  const [queue, setQueue] = useState(bank);
  const recordAssimilation = useLearnFlowStore((s) => s.recordAssimilation);
  const lockGrandQuizzOneHour = useLearnFlowStore((s) => s.lockGrandQuizzOneHour);
  const firstTryRef = useRef(true);
  const missedRef = useRef<typeof bank>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ xp: number; unlocked: boolean; challenger: boolean } | null>(null);
  const q = queue[current];

  const advance = (nextScore: number) => {
    if (current + 1 >= queue.length) {
      const res = recordAssimilation(chapterId, nextScore, queue.length, firstTryRef.current);
      setResult(res);
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setWrong(false);
    }
  };

  const pick = (i: number) => {
    if (selected !== null || !q) return;
    setSelected(i);
    if (i === q.indexReponseCorrecte) {
      playSfx("correct");
      const next = score + 1;
      setScore(next);
      setTimeout(() => advance(next), 700);
    } else {
      playSfx("wrong");
      firstTryRef.current = false;
      setWrong(true);
      missedRef.current = [...missedRef.current, q];
    }
  };

  if (done && result) {
    const perfect = result.unlocked;
    if (loopErrors) {
      const missed = missedRef.current;
      return (
        <div className="mx-auto max-w-xl">
          <div
            className="flex flex-col items-center gap-2.5 px-7 py-8 text-center text-white"
            style={{ background: perfect ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#F59E0B,#D97706)" }}
          >
            <Icon name={perfect ? "award" : "alert-circle"} size={40} color="#fff" />
            <p className="text-[28px] font-extrabold">
              {score}/{queue.length}
            </p>
            <p className="text-[13px] font-semibold text-white/90">
              {perfect ? `Chapitre maîtrisé · +${result.xp} XP` : "Sans chrono — on reboucle uniquement sur tes erreurs."}
            </p>
          </div>
          <div className="space-y-3 px-5 py-5">
            {!perfect && missed.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setQueue(missed);
                  missedRef.current = [];
                  setDone(false);
                  setCurrent(0);
                  setScore(0);
                  setSelected(null);
                  setWrong(false);
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
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-xl">
        <div
          className="flex flex-col items-center gap-2.5 px-7 py-8 text-center text-white"
          style={{ background: perfect ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#EF4444,#DC2626)" }}
        >
          <Icon name={perfect ? "award" : "alert-circle"} size={40} color="#fff" />
          <p className="text-[28px] font-extrabold">{perfect ? "Parfait !" : `${score}/${queue.length}`}</p>
          <p className="text-[13px] font-semibold text-white/90">
            {perfect
              ? `Règle du 10/10 validée · +${result.xp} XP${result.challenger ? " · Badge CHALLENGER" : ""}`
              : "Accès au Grand Quizz refusé — revois les points ratés"}
          </p>
        </div>

        {perfect ? (
          <div className="space-y-3 px-5 py-5">
            <p className="text-center text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textMuted }}>
              Étape 2 — Instant T
            </p>
            <button
              type="button"
              onClick={() => router.replace(`/app/quiz/grand/${chapterId}`)}
              className="flex w-full items-center gap-3 rounded-[20px] border-2 p-4 text-left"
              style={{ background: colors.mathsBg, borderColor: colors.mathsBorder }}
            >
              <Icon name="zap" size={22} color={colors.primary} />
              <span className="flex-1">
                <span className="block text-[15px] font-extrabold" style={{ color: colors.primary }}>
                  Option Sprint
                </span>
                <span className="text-[13px] font-medium" style={{ color: colors.textSecondary }}>
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
              className="flex w-full items-center gap-3 rounded-[20px] border-2 p-4 text-left"
              style={{ background: colors.white, borderColor: colors.border }}
            >
              <Spira scene="quiz.rest" size={44} message="" />
              <span className="flex-1">
                <span className="block text-[15px] font-extrabold" style={{ color: colors.accent }}>
                  Option Repos
                </span>
                <span className="text-[13px] font-medium" style={{ color: colors.textSecondary }}>
                  Verrouille 1h + rappel local (démo)
                </span>
              </span>
            </button>
            <div className="flex justify-center pt-2">
              <Spira scene={result.challenger ? "quiz.perfect" : "quiz.pass"} size={result.challenger ? 88 : 80} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-5 py-5">
            <Spira scene="quiz.fail" size={88} />
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
                setWrong(false);
                setResult(null);
              }}
              className="w-full rounded-[14px] border-2 py-3.5 text-[15px] font-extrabold"
              style={{ background: colors.white, borderColor: colors.border, color: colors.textDark }}
            >
              Réessayer le quizz
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between px-4 py-4">
        <button type="button" onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center" aria-label="Retour">
          <Icon name="arrow-left" size={20} color={colors.textDark} />
        </button>
        <span className="text-sm font-extrabold" style={{ color: colors.primary }}>
          {current + 1}/{queue.length}
        </span>
        <Spira scene="quiz.play" size={36} message="" />
      </div>
      <div className="mx-4 h-1 overflow-hidden" style={{ background: colors.border }}>
        <div className="h-full" style={{ width: `${((current + 1) / queue.length) * 100}%`, background: colors.primary }} />
      </div>

      <div className="space-y-4 px-5 py-5">
        <h1 className="text-[18px] font-extrabold leading-[26px]">{q.enonceQuestion}</h1>
        <div className="space-y-2.5">
          {q.optionsProposees.map((opt, i) => {
            const on = selected === i;
            const ok = on && i === q.indexReponseCorrecte;
            const ko = on && i !== q.indexReponseCorrecte;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => pick(i)}
                className="w-full rounded-2xl border-2 px-4 py-4 text-left font-bold"
                style={{
                  background: ok ? colors.svtBg : ko ? colors.angBg : colors.white,
                  borderColor: ok ? colors.secondary : ko ? colors.danger : colors.border,
                  transform: ok ? "scale(1.02)" : undefined,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {wrong && selected !== null ? (
          <div className="space-y-2 rounded-2xl border-2 p-3.5" style={{ background: colors.white, borderColor: colors.angBorder }}>
            <Spira scene="quiz.wrong" size={64} message="" />
            <p className="font-extrabold" style={{ color: colors.danger }}>
              Pas tout à fait
            </p>
            <p className="text-[13px] font-medium leading-[18px]" style={{ color: colors.textSecondary }}>
              {q.explicationPedagogique}
            </p>
            <button
              type="button"
              onClick={() => router.push(`/app/cours/${chapterId}`)}
              className="text-[13px] font-extrabold"
              style={{ color: colors.primary }}
            >
              Revoir ce point → {q.ancreCours ?? "cours"}
            </button>
            <button
              type="button"
              onClick={() => advance(score)}
              className="w-full rounded-[14px] py-3.5 text-[15px] font-extrabold text-white"
              style={{ background: colors.primary }}
            >
              Continuer
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AssimilationPage() {
  return (
    <Suspense fallback={null}>
      <QuizInner />
    </Suspense>
  );
}
