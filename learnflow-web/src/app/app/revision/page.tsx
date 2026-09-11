"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WeeklyReviewBar from "@/components/WeeklyReviewBar";
import { AppMain, ScreenHeader } from "@/components/ui";
import { findChapterMeta } from "@/data/programme";
import { dueChapterIds, isoWeekLome, withWeeklyReview } from "@/data/weeklyReview";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function RevisionInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { colors } = useAppTheme();
  const chapterProgress = useLearnFlowStore((s) => s.chapterProgress || {});
  const weeklyReview = useLearnFlowStore((s) => s.weeklyReview);
  const week = isoWeekLome();
  const due = dueChapterIds(chapterProgress, withWeeklyReview(weeklyReview).lastReviewed, week);
  const wanted = params.get("chapterId") ?? "";
  const studied = useMemo(
    () => Object.keys(chapterProgress).filter((id) => id && (chapterProgress[id]?.essentialRead || chapterProgress[id]?.detailsRead || chapterProgress[id]?.assimilationScore != null)),
    [chapterProgress],
  );
  const list = wanted ? [wanted] : due.length ? due : studied;

  return (
    <div>
      <ScreenHeader title="Révision de la semaine" backHref="/app/cours" />
      <AppMain className="space-y-3 py-5 pb-10">
        <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>
          Un rappel hebdomadaire par chapitre déjà ouvert. Le défi disparaît de la liste une fois la révision faite.
        </p>
        {wanted ? <WeeklyReviewBar chapterId={wanted} compact /> : null}
        {list.length === 0 ? (
          <div className="rounded-[22px] border-2 px-5 py-8 text-center" style={{ background: colors.white, borderColor: colors.border }}>
            <p className="text-sm font-extrabold" style={{ color: colors.textDark }}>
              Pas encore de chapitre à réviser
            </p>
            <p className="mt-1 text-[13px] font-medium" style={{ color: colors.textMuted }}>
              Lis un cours, puis reviens ici pour le rappel de la semaine.
            </p>
          </div>
        ) : (
          list.map((id) => {
            const meta = findChapterMeta(id);
            const done = withWeeklyReview(weeklyReview).lastReviewed[id] === week;
            return (
              <article
                key={id}
                className="rounded-[22px] border p-4"
                style={{ background: colors.white, borderColor: colors.border }}
              >
                <p className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: colors.textMuted }}>
                  {meta?.subject.name ?? "Cours"}
                </p>
                <h2 className="mt-0.5 text-[16px] font-extrabold" style={{ color: colors.textDark }}>
                  {meta?.chapter.title ?? id}
                </h2>
                <div className="mt-3 flex flex-col gap-2 min-[380px]:flex-row">
                  <button
                    type="button"
                    disabled={done}
                    onClick={() => router.push(`/app/quiz/assimilation/${id}?review=1`)}
                    className="flex-1 rounded-2xl py-3 text-sm font-extrabold text-white disabled:opacity-50"
                    style={{ background: colors.primary }}
                  >
                    {done ? "Révisé cette semaine" : "Quiz de rappel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/app/flashcards?chapterId=${id}`)}
                    className="flex-1 rounded-2xl border py-3 text-sm font-extrabold"
                    style={{ background: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }}
                  >
                    Cartes
                  </button>
                </div>
              </article>
            );
          })
        )}
      </AppMain>
    </div>
  );
}

export default function RevisionPage() {
  return (
    <Suspense fallback={null}>
      <RevisionInner />
    </Suspense>
  );
}
