import type { DifficulteFlash, QCMData } from "../types/learnflow";

export type ChallengeId = "lesson" | "reader" | "qcm" | "flash" | "duel_win";
export type DuelOutcome = "win" | "lose" | "draw";

export type RewardToast = {
  title: string;
  body: string;
  badge?: string;
  xp?: number;
};

export type RewardsState = {
  day: string;
  progress: Record<string, number>;
  completed: string[];
  hintBoostUntil: number;
  easeBoostUntil?: number;
  awardedDuels: string[];
  lifetimeCompleted: number;
  lastStreakDay: string;
  notifiedDay: string;
  lastUnlock: RewardToast | null;
  dailyXpAwarded: number;
};

export type ChallengeDef = {
  id: ChallengeId;
  title: string;
  body: string;
  xp: number;
  target: number;
  hintMinutes: number;
  badge?: string;
};

export const DAILY_CHALLENGE_XP_CAP = 500;

export const CHALLENGES: ChallengeDef[] = [
  {
    id: "lesson",
    title: "Lis une leçon",
    body: "Ouvre L’essentiel d’un chapitre. +XP et un indice gratuit au prochain QCM.",
    xp: 40,
    target: 1,
    hintMinutes: 20,
  },
  {
    id: "reader",
    title: "Lis En Détails",
    body: "Termine la fiche complète d’un chapitre.",
    xp: 60,
    target: 1,
    hintMinutes: 20,
    badge: "Lecteur Pro",
  },
  {
    id: "qcm",
    title: "10/10 au QCM",
    body: "Valide un quiz d’assimilation sans faute.",
    xp: 100,
    target: 1,
    hintMinutes: 30,
  },
  {
    id: "flash",
    title: "5 flashcards",
    body: "Révise 5 cartes. Tu gagnes de l’XP.",
    xp: 40,
    target: 5,
    hintMinutes: 15,
  },
  {
    id: "duel_win",
    title: "Gagne un Blitz duo",
    body: "Bats un ami en live. Badge Blitz King à la clé.",
    xp: 150,
    target: 1,
    hintMinutes: 30,
    badge: "Blitz King",
  },
];

export const ACHIEVEMENT_KEYS = [
  { key: "Série 7", label: "Série 7", hint: "7 jours d’affilée", color: "#EF4444", icon: "flame" as const },
  { key: "Blitz King", label: "Blitz King", hint: "Gagne un Blitz duo", color: "#F59E0B", icon: "zap" as const },
  { key: "Lecteur Pro", label: "Lecteur Pro", hint: "Lis En Détails", color: "#1677FF", icon: "book" as const },
  { key: "CHALLENGER", label: "CHALLENGER", hint: "10/10 au 1er essai", color: "#F59E0B", icon: "award" as const },
  { key: "Étoile d'Or", label: "Étoile d'Or", hint: "3 défis réussis", color: "#1677FF", icon: "star" as const },
  { key: "Diamant", label: "Diamant", hint: "Atteins la ligue Diamant", color: "#06B6D4", icon: "sparkles" as const },
];

export function lomeDay(date = new Date()): string {
  try {
    return date.toLocaleDateString("en-CA", { timeZone: "Africa/Lome" });
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function emptyRewards(): RewardsState {
  return {
    day: lomeDay(),
    progress: {},
    completed: [],
    hintBoostUntil: 0,
    awardedDuels: [],
    lifetimeCompleted: 0,
    lastStreakDay: "",
    notifiedDay: "",
    lastUnlock: null,
    dailyXpAwarded: 0,
  };
}

function resolveHintUntil(raw: Partial<RewardsState>): number {
  const hint = Number(raw.hintBoostUntil) || 0;
  const legacy = Number(raw.easeBoostUntil) || 0;
  return Math.max(hint, legacy);
}

export function withDay(raw?: Partial<RewardsState> | null): RewardsState {
  const base = { ...emptyRewards(), ...(raw ?? {}) };
  const day = lomeDay();
  const completed = Array.isArray(base.completed) ? base.completed : [];
  const progress = base.progress && typeof base.progress === "object" ? base.progress : {};
  const hintBoostUntil = resolveHintUntil(base);
  if (base.day === day) {
    return {
      ...emptyRewards(),
      ...base,
      completed,
      progress,
      day,
      hintBoostUntil,
      dailyXpAwarded: Number(base.dailyXpAwarded) || 0,
    };
  }
  return {
    ...emptyRewards(),
    day,
    hintBoostUntil,
    awardedDuels: (Array.isArray(base.awardedDuels) ? base.awardedDuels : []).slice(0, 40),
    lifetimeCompleted: base.lifetimeCompleted ?? 0,
    lastStreakDay: base.lastStreakDay ?? "",
    lastUnlock: base.lastUnlock ?? null,
    dailyXpAwarded: 0,
  };
}

export function challengeById(id: ChallengeId): ChallengeDef {
  return CHALLENGES.find((c) => c.id === id) ?? CHALLENGES[0];
}

export function challengesOfTheDay(day = lomeDay()): ChallengeDef[] {
  const n = CHALLENGES.length;
  let h = 2166136261;
  for (let i = 0; i < day.length; i++) h = Math.imul(h ^ day.charCodeAt(i), 16777619);
  const start = n ? (h >>> 0) % n : 0;
  return [0, 1, 2].map((i) => CHALLENGES[(start + i) % n]).filter(Boolean);
}

export function hasHintBoost(r: RewardsState): boolean {
  return withDay(r).hintBoostUntil > Date.now();
}

export function hasEaseBoost(r: RewardsState): boolean {
  return hasHintBoost(r);
}

export function pedagogicalHint(explanation?: string): string {
  const text = (explanation ?? "").trim();
  if (!text) return "Relis l’essentiel du chapitre, puis élimine deux options.";
  const first = text.split(/[.!?]/)[0]?.trim() ?? text;
  const clipped = first.length > 120 ? `${first.slice(0, 117)}…` : first;
  return clipped.endsWith(".") ? clipped : `${clipped}.`;
}

export function preferEasierQuestions<T extends { difficulte?: DifficulteFlash }>(items: T[], _ease: boolean): T[] {
  return items;
}

export function preferEasierQcm(items: QCMData[], ease: boolean): QCMData[] {
  return preferEasierQuestions(items, ease);
}

export function yesterdayLome(): string {
  return lomeDay(new Date(Date.now() - 86_400_000));
}

export function nextStreak(current: number, lastStreakDay: string): { streak: number; lastStreakDay: string } {
  const day = lomeDay();
  if (lastStreakDay === day) return { streak: current, lastStreakDay };
  const next = lastStreakDay === yesterdayLome() ? current + 1 : 1;
  return { streak: next, lastStreakDay: day };
}

export const DUEL_LOSE_XP = 25;
export const DUEL_DRAW_XP = 40;

export function formatStudyHours(studyMs: number): string {
  const hours = Math.max(0, studyMs) / 3_600_000;
  if (hours < 0.1) return "0h";
  if (hours < 10) return `${hours.toFixed(1).replace(/\.0$/, "")}h`;
  return `${Math.round(hours)}h`;
}
