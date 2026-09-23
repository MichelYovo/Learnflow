import { lomeDay } from "@/engine/rewards";

export type DayActivity = {
  studyMs: number;
  xp: number;
  lessons: number;
  chapters: string[];
};

export type ActivityLog = {
  /** Lundi de la semaine en cours, fuseau Afrique/Lomé (yyyy-mm-dd). */
  weekId: string;
  days: Record<string, DayActivity>;
};

const WEEK_LABELS = ["L", "M", "M", "J", "V", "S", "D"] as const;

function emptyDay(): DayActivity {
  return { studyMs: 0, xp: 0, lessons: 0, chapters: [] };
}

/** Lundi (yyyy-mm-dd) de la semaine qui contient le jour de Lomé. */
export function weekIdOf(now = new Date()): string {
  const [y, m, d] = lomeDay(now).split("-").map(Number);
  const utc = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  const weekday = utc.getUTCDay();
  const delta = weekday === 0 ? 6 : weekday - 1;
  utc.setUTCDate(utc.getUTCDate() - delta);
  return utc.toISOString().slice(0, 10);
}

export function emptyActivityLog(now = new Date()): ActivityLog {
  return { weekId: weekIdOf(now), days: {} };
}

export function asActivityLog(raw: unknown): ActivityLog {
  if (!raw || typeof raw !== "object") return emptyActivityLog();
  const row = raw as Partial<ActivityLog>;
  if (typeof row.weekId !== "string" || !row.days || typeof row.days !== "object") return emptyActivityLog();
  const days: Record<string, DayActivity> = {};
  for (const [key, value] of Object.entries(row.days)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !value || typeof value !== "object") continue;
    const day = value as Partial<DayActivity>;
    days[key] = {
      studyMs: Math.max(0, Number(day.studyMs) || 0),
      xp: Math.max(0, Number(day.xp) || 0),
      lessons: Math.max(0, Number(day.lessons) || 0),
      chapters: Array.isArray(day.chapters) ? day.chapters.filter((id) => typeof id === "string") : [],
    };
  }
  return { weekId: row.weekId, days };
}

/** Nouvelle semaine : on repart de zéro pour le graphique et l’objectif. */
export function alignWeek(log: ActivityLog | undefined, now = new Date()): { log: ActivityLog; rolled: boolean } {
  const weekId = weekIdOf(now);
  const current = log?.weekId === weekId ? log : null;
  if (current) return { log: current, rolled: false };
  return { log: { weekId, days: {} }, rolled: true };
}

export function bumpDay(
  log: ActivityLog,
  now: Date,
  patch: { studyMs?: number; xp?: number; lessons?: number; chapterId?: string },
): ActivityLog {
  const base = alignWeek(log, now).log;
  const key = lomeDay(now);
  const prev = base.days[key] ?? emptyDay();
  const chapters =
    patch.chapterId && !prev.chapters.includes(patch.chapterId) ? [...prev.chapters, patch.chapterId] : prev.chapters;
  return {
    weekId: base.weekId,
    days: {
      ...base.days,
      [key]: {
        studyMs: prev.studyMs + Math.max(0, patch.studyMs ?? 0),
        xp: prev.xp + Math.max(0, patch.xp ?? 0),
        lessons: prev.lessons + Math.max(0, patch.lessons ?? 0),
        chapters,
      },
    },
  };
}

export function weekSlots(now = new Date()): { key: string; label: string; today: boolean }[] {
  const start = weekIdOf(now);
  const [y, m, d] = start.split("-").map(Number);
  const today = lomeDay(now);
  return WEEK_LABELS.map((label, i) => {
    const dt = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + i));
    const key = dt.toISOString().slice(0, 10);
    return { key, label, today: key === today };
  });
}

export function weekSnapshot(log: ActivityLog | undefined, now = new Date()) {
  const aligned = alignWeek(log, now).log;
  const slots = weekSlots(now);
  let studyMs = 0;
  let xp = 0;
  let lessons = 0;
  const chapters = new Set<string>();
  for (const slot of slots) {
    const day = aligned.days[slot.key];
    if (!day) continue;
    studyMs += day.studyMs;
    xp += day.xp;
    lessons += day.lessons;
    day.chapters.forEach((id) => chapters.add(id));
  }
  const max = Math.max(1, ...slots.map((slot) => aligned.days[slot.key]?.studyMs ?? 0));
  const chart = slots.map((slot) => {
    const ms = aligned.days[slot.key]?.studyMs ?? 0;
    const height = ms <= 0 ? 8 : Math.max(18, Math.round((ms / max) * 72));
    return {
      label: slot.label,
      today: slot.today,
      height,
      color: slot.today ? "#1D4ED8" : ms > 0 ? "#60A5FA" : "#BFDBFE",
    };
  });
  return { studyMs, xp, lessons, chapters: chapters.size, chart };
}
