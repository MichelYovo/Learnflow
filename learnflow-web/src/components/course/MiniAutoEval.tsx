"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { useAppTheme } from "@/theme/useAppTheme";
import type { QCMData } from "@/types/learnflow";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

function optionKind(i: number, selected: number | null, correct: number) {
  if (selected === null) return "idle" as const;
  if (i === correct) return "correct" as const;
  if (i === selected) return "wrong" as const;
  return "dim" as const;
}

export default function MiniAutoEval({ questions }: { questions: QCMData[] }) {
  const { colors } = useAppTheme();
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));

  useEffect(() => {
    setPicked(questions.map(() => null));
  }, [questions]);

  return (
    <div className="mt-4 space-y-6">
      {questions.map((q, qi) => {
        const selected = picked[qi] ?? null;
        const answered = selected !== null;
        return (
          <div key={q.id || `${qi}-${q.enonceQuestion}`}>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.12em]" style={{ color: colors.textMuted }}>
              Question {qi + 1} / {questions.length}
            </p>
            <p className="mt-1.5 text-[16px] font-extrabold leading-snug" style={{ color: colors.textDark }}>
              {q.enonceQuestion}
            </p>
            <div className="mt-3 flex flex-col gap-2.5">
              {q.optionsProposees.map((opt, i) => {
                const kind = optionKind(i, selected, q.indexReponseCorrecte);
                const bg = kind === "correct" ? colors.svtBg : kind === "wrong" ? colors.angBg : colors.white;
                const border =
                  kind === "correct" ? colors.secondary : kind === "wrong" ? colors.danger : colors.borderStrong;
                const badgeBg =
                  kind === "correct" ? colors.secondary : kind === "wrong" ? colors.danger : colors.surfaceAlt;
                const badgeFg = kind === "correct" || kind === "wrong" ? "#fff" : colors.textSecondary;
                return (
                  <button
                    key={`${q.id}-${i}`}
                    type="button"
                    disabled={answered}
                    onClick={() =>
                      setPicked((prev) => {
                        const next = [...prev];
                        next[qi] = i;
                        return next;
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-[18px] border-2 px-3.5 py-3 text-left"
                    style={{ background: bg, borderColor: border, opacity: kind === "dim" ? 0.42 : 1 }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-black"
                      style={{ background: badgeBg, color: badgeFg }}
                    >
                      {kind === "correct" ? (
                        <Icon name="check" size={14} color="#fff" />
                      ) : kind === "wrong" ? (
                        <Icon name="x" size={14} color="#fff" />
                      ) : (
                        LETTERS[i] ?? String(i + 1)
                      )}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
            {answered && q.explicationPedagogique ? (
              <p className="mt-2.5 text-sm font-semibold leading-relaxed" style={{ color: colors.textSecondary }}>
                {q.explicationPedagogique}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
