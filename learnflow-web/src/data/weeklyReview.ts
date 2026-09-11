import { chapterActivityDone } from "./programme";
import type { ChapterProgress } from "../types/learnflow";

export type WeeklyReviewState = {
  week: string;
  notifiedWeek: string;
  lastReviewed: Record<string, string>;
};

export function isoWeekLome(date = new Date()): string {
  let stamp = date.toISOString().slice(0, 10);
  try {
    stamp = date.toLocaleDateString("en-CA", { timeZone: "Africa/Lome" });
  } catch {
    /* keep utc */
  }
  const [y, m, d] = stamp.split("-").map(Number);
  const utc = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function emptyWeeklyReview(): WeeklyReviewState {
  return { week: isoWeekLome(), notifiedWeek: "", lastReviewed: {} };
}

export function withWeeklyReview(raw?: Partial<WeeklyReviewState> | null): WeeklyReviewState {
  const week = isoWeekLome();
  const lastReviewed =
    raw?.lastReviewed && typeof raw.lastReviewed === "object" && !Array.isArray(raw.lastReviewed)
      ? raw.lastReviewed
      : {};
  return {
    week,
    notifiedWeek: typeof raw?.notifiedWeek === "string" ? raw.notifiedWeek : "",
    lastReviewed,
  };
}

export function dueChapterIds(
  chapterProgress: Record<string, ChapterProgress> | null | undefined,
  lastReviewed: Record<string, string> | null | undefined,
  week = isoWeekLome(),
): string[] {
  const progress = chapterProgress && typeof chapterProgress === "object" ? chapterProgress : {};
  const reviewed = lastReviewed && typeof lastReviewed === "object" ? lastReviewed : {};
  return Object.keys(progress).filter((id) => {
    if (!id) return false;
    if (chapterActivityDone(progress[id]) <= 0) return false;
    return reviewed[id] !== week;
  });
}
