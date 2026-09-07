export type ActivityType =
  | "login"
  | "signup"
  | "profile_complete"
  | "chapter_open"
  | "quiz_complete"
  | "blitz_complete"
  | "xp_gain"
  | "mode_start";

export type ActivityPlatform = "web" | "mobile";

export type CloudChapterProgress = {
  chapitreId: string;
  assimilationScore: number | null;
  assimilationPerfect: boolean;
  grandQuizzUnlocked: boolean;
  grandQuizzLockedUntil: string | null;
  firstTryPerfect: boolean;
};

export type CloudFlashcardState = {
  id: string;
  intervalleRepetJ: number;
  prochaineRevision: string;
  difficulte: "Facile" | "Moyen" | "Difficile";
  due: boolean;
};

export type CloudLigueState = {
  nomLigue: string;
  rangActuel: number;
  scoreHebdo: number;
  estGelee: boolean;
  groupe: number;
};

export type CloudProgress = {
  v: 1;
  updatedAt: string;
  xpTotale: number;
  streak: number;
  lessonsDone: number;
  badgesDebloques: string[];
  avatarId?: string | null;
  ligue: CloudLigueState;
  chapterProgress: Record<string, CloudChapterProgress>;
  flashcards: CloudFlashcardState[];
};

export type StudentCloudProfile = {
  id: string;
  parent_id: string;
  name: string;
  class_level: string;
  total_xp: number;
  email?: string | null;
  parent_phone?: string | null;
  platform?: string | null;
  streak?: number | null;
  lessons_done?: number | null;
  avatar_id?: string | null;
  status?: "actif" | "suspendu" | string | null;
  progress?: CloudProgress | Record<string, unknown> | null;
  progress_updated_at?: string | null;
};

export function isProfileComplete(row: Pick<StudentCloudProfile, "class_level"> | null): boolean {
  if (!row) return false;
  return (row.class_level ?? "").trim().length > 0;
}
