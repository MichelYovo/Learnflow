"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { dueChapterIds, isoWeekLome, withWeeklyReview } from "@/data/weeklyReview";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function WeeklyReviewBar({
  chapterId,
  compact,
}: {
  chapterId?: string;
  compact?: boolean;
}) {
  const { colors } = useAppTheme();
  const chapterProgress = useLearnFlowStore((s) => s.chapterProgress);
  const weeklyReview = useLearnFlowStore((s) => s.weeklyReview);
  const week = isoWeekLome();
  const due = dueChapterIds(chapterProgress, withWeeklyReview(weeklyReview).lastReviewed, week);
  const scopedDue = chapterId ? due.includes(chapterId) : due.length > 0;
  const href = chapterId ? `/app/revision?chapterId=${encodeURIComponent(chapterId)}` : "/app/revision";
  const label = chapterId
    ? scopedDue
      ? "Révision de la semaine"
      : "Réviser ce chapitre"
    : due.length
      ? `Révision · ${due.length} chapitre${due.length > 1 ? "s" : ""}`
      : "Révision de la semaine";

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-[18px] border px-3.5 ${compact ? "py-2.5" : "py-3"}`}
      style={{
        background: colors.mathsBg,
        borderColor: colors.mathsBorder,
      }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: colors.white }}
      >
        <Icon name="refresh" size={16} color={colors.primary} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-extrabold" style={{ color: colors.textDark }}>
          {label}
        </span>
        <span className="block text-[11px] font-semibold" style={{ color: colors.textMuted }}>
          Rappel hebdomadaire · quiz + cartes
        </span>
      </span>
      {scopedDue && !chapterId ? (
        <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: colors.primary, color: colors.onPrimary }}>
          {due.length}
        </span>
      ) : (
        <Icon name="chevron-right" size={16} color={colors.primary} />
      )}
    </Link>
  );
}
