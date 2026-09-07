"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spira from "@/components/Spira";
import { ScreenHeader, PrimaryButton } from "@/components/ui";
import { chapterTitle, clozeForChapter } from "@/data/modeContent";
import { spiraForScore } from "@/data/spira";
import { playSfx } from "@/lib/sfx";
import { useAppTheme } from "@/theme/useAppTheme";

export default function FillBlanksPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const items = useMemo(() => clozeForChapter(chapterId), [chapterId]);
  const [queue, setQueue] = useState(items);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<typeof items>([]);
  const [done, setDone] = useState(false);
  const item = queue[Math.min(idx, Math.max(queue.length - 1, 0))];

  const choose = (opt: string) => {
    if (locked) return;
    setPicked(opt);
    setLocked(true);
    const ok = opt === item.blank.answer;
    playSfx(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    else setWrong((w) => [...w, item]);
  };

  const next = () => {
    if (idx + 1 >= queue.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
    setLocked(false);
  };

  if (done) {
    const total = queue.length;
    const perfect = score === total;
    return (
      <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center px-6 text-center lg:min-h-dvh">
        <Spira mood={spiraForScore(score, total)} size={88} message={perfect ? "Textes à trous maîtrisés." : "On reprend uniquement les phrases ratées."} />
        <p className="mt-3 text-3xl font-black">
          {score}/{total}
        </p>
        <div className="mt-6 w-full max-w-sm space-y-3">
          {!perfect && wrong.length > 0 ? (
            <PrimaryButton
              onClick={() => {
                setQueue(wrong);
                setIdx(0);
                setPicked(null);
                setLocked(false);
                setScore(0);
                setDone(false);
                setWrong([]);
              }}
            >
              Reprendre les erreurs
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => router.back()}>OK</PrimaryButton>
          )}
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col lg:min-h-dvh">
      <ScreenHeader title={chapterTitle(chapterId)} backHref="/app" />
      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col px-5">
        <p className="shrink-0 pt-3 text-right text-sm font-extrabold" style={{ color: colors.primary }}>
          {idx + 1}/{queue.length}
        </p>
        <p className="shrink-0 pt-2 pb-0 text-lg font-black leading-relaxed sm:text-xl">
          {item.before}
          <span className="mx-1 rounded-lg px-2 py-0.5" style={{ background: colors.mathsBg, color: colors.primary }}>
            {picked ?? "____"}
          </span>
          {item.after}
        </p>
        <div className={`flex min-h-0 flex-1 flex-col ${locked ? "justify-start pt-4" : "justify-center py-6"}`}>
          <div className="grid shrink-0 grid-cols-2 gap-4 sm:gap-5">
            {item.blank.options.map((opt) => {
              const on = picked === opt;
              const ok = locked && opt === item.blank.answer;
              const ko = on && opt !== item.blank.answer;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => choose(opt)}
                  className="rounded-2xl border px-3 py-2 text-sm font-extrabold"
                  style={{
                    background: ok ? "#ECFDF5" : ko ? "#FEF2F2" : colors.white,
                    borderColor: ok ? "#10B981" : ko ? "#EF4444" : colors.border,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {locked ? (
            <div className="mt-4 flex min-h-0 flex-1 flex-col justify-end pb-5">
              <PrimaryButton onClick={next}>Continuer</PrimaryButton>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
