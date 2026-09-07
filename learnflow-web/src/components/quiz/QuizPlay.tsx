"use client";

import { useEffect, type ReactNode } from "react";
import Icon from "@/components/Icon";
import { useAppTheme } from "@/theme/useAppTheme";

export const QUIZ_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

export type QuizPlayProps = {
  kicker?: string;
  current: number;
  total: number;
  question: string;
  options: string[];
  correctIndex: number;
  selected: number | null;
  onPick: (index: number) => void;
  onBack: () => void;
  onContinue: () => void;
  explanation?: string;
  reviewLabel?: string;
  onReview?: () => void;
  headerRight?: ReactNode;
  continueLabel?: string;
};

function optionKind(i: number, selected: number | null, correct: number) {
  if (selected === null) return "idle" as const;
  if (i === correct) return "correct" as const;
  if (i === selected) return "wrong" as const;
  return "dim" as const;
}

export default function QuizPlay({
  kicker,
  current,
  total,
  question,
  options,
  correctIndex,
  selected,
  onPick,
  onBack,
  onContinue,
  explanation,
  reviewLabel,
  onReview,
  headerRight,
  continueLabel = "Continuer",
}: QuizPlayProps) {
  const { colors } = useAppTheme();
  const answered = selected !== null;
  const ok = answered && selected === correctIndex;
  const progress = Math.min(1, (current + (answered ? 1 : 0.35)) / total);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (answered && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onContinue();
        return;
      }
      if (answered) return;

      const fromDigit = e.key >= "1" && e.key <= "9" ? Number(e.key) - 1 : -1;
      const fromLetter = /^[a-fA-F]$/.test(e.key) ? e.key.toUpperCase().charCodeAt(0) - 65 : -1;
      const idx = fromDigit >= 0 ? fromDigit : fromLetter;
      if (idx >= 0 && idx < options.length) {
        e.preventDefault();
        onPick(idx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, onContinue, onPick, options.length]);

  return (
    <div className="mx-auto flex h-dvh min-h-dvh w-full max-w-xl flex-col" style={{ background: colors.surface }}>
      <div className="flex items-center gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: colors.white, border: `1.5px solid ${colors.border}` }}
          aria-label="Retour"
        >
          <Icon name="x" size={18} color={colors.textDark} />
        </button>
        <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full" style={{ background: colors.border }}>
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress * 100}%`, background: colors.primary }}
          />
        </div>
        <span className="shrink-0 text-[13px] font-extrabold tabular-nums" style={{ color: colors.primary }}>
          {current + 1}/{total}
        </span>
        {headerRight}
      </div>

      <div key={question} className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-3 lf-slide-in">
        {kicker ? (
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: colors.textMuted }}>
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-2 text-[22px] font-extrabold leading-7 sm:text-[24px] sm:leading-8">{question}</h1>

        <div className="mt-6 flex flex-col gap-3 pb-4">
          {options.map((opt, i) => {
            const kind = optionKind(i, selected, correctIndex);
            const letter = QUIZ_LETTERS[i] ?? String(i + 1);
            const bg =
              kind === "correct" ? colors.svtBg : kind === "wrong" ? colors.angBg : colors.white;
            const border =
              kind === "correct" ? colors.secondary : kind === "wrong" ? colors.danger : colors.borderStrong;
            const badgeBg =
              kind === "correct" ? colors.secondary : kind === "wrong" ? colors.danger : colors.surfaceAlt;
            const badgeFg = kind === "correct" || kind === "wrong" ? "#fff" : colors.textSecondary;
            return (
              <button
                key={`${i}-${opt}`}
                type="button"
                disabled={answered}
                onPointerDown={(e) => {
                  if (e.button !== 0 || answered) return;
                  onPick(i);
                }}
                onClick={() => onPick(i)}
                className={`flex w-full items-center gap-3 rounded-[18px] border-2 px-3.5 py-3.5 text-left transition-[transform,box-shadow,opacity] ${
                  kind === "correct" ? "lf-quiz-ok" : ""
                }`}
                style={{
                  background: bg,
                  borderColor: border,
                  opacity: kind === "dim" ? 0.42 : 1,
                  boxShadow: kind === "idle" ? "0 1px 0 rgba(15,23,42,0.04)" : "none",
                }}
                aria-pressed={selected === i}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-black"
                  style={{ background: badgeBg, color: badgeFg }}
                >
                  {kind === "correct" ? <Icon name="check" size={16} color="#fff" /> : kind === "wrong" ? <Icon name="x" size={16} color="#fff" /> : letter}
                </span>
                <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug sm:text-[16px]">{opt}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-auto hidden pb-3 pt-2 text-center text-[11px] font-semibold lg:block" style={{ color: colors.textMuted }}>
          {answered ? "Entrée pour continuer" : "Touches 1 à 4 ou A à D"}
        </p>
      </div>

      {answered ? (
        <div
          className="lf-quiz-sheet shrink-0 border-t px-5 pt-4"
          style={{
            background: ok ? colors.svtBg : colors.angBg,
            borderColor: ok ? colors.svtBorder : colors.angBorder,
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mx-auto w-full max-w-xl">
            <p className="flex items-center gap-2 text-[18px] font-extrabold" style={{ color: ok ? colors.secondary : colors.danger }}>
              <Icon name={ok ? "check-circle" : "alert-circle"} size={22} color={ok ? colors.secondary : colors.danger} />
              {ok ? "C’est ça !" : "Pas tout à fait"}
            </p>
            {explanation ? (
              <p className="mt-1.5 text-[14px] font-medium leading-5" style={{ color: colors.textSecondary }}>
                {explanation}
              </p>
            ) : null}
            {onReview && reviewLabel && !ok ? (
              <button
                type="button"
                onClick={onReview}
                className="mt-2 text-[13px] font-extrabold"
                style={{ color: colors.primary }}
              >
                {reviewLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onContinue}
              className="mt-4 w-full rounded-2xl py-3.5 text-[16px] font-extrabold text-white"
              style={{ background: ok ? colors.secondary : colors.danger }}
            >
              {continueLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
