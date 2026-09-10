import { isSupabaseConfigured, supabase } from "./supabase";
import { nowIso } from "./ids";

export type ActivityType =
  | "login"
  | "signup"
  | "profile_complete"
  | "chapter_open"
  | "quiz_complete"
  | "blitz_complete"
  | "xp_gain"
  | "mode_start";

export type CloudChapterProgress = {
  chapitreId: string;
  assimilationScore: number | null;
  assimilationPerfect: boolean;
  grandQuizzUnlocked: boolean;
  grandQuizzLockedUntil: string | null;
  firstTryPerfect: boolean;
  read?: boolean;
  essentialRead?: boolean;
  detailsRead?: boolean;
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

export async function fetchOwnStudentProfile(): Promise<StudentCloudProfile | null> {
  if (!isSupabaseConfigured) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData.session?.user.id;
  if (!uid) return null;
  const { data, error } = await supabase.from("student_profiles").select("*").eq("id", uid).maybeSingle();
  if (error) {
    console.warn("[LearnFlow] fetch profile", error.message);
    return null;
  }
  return (data as StudentCloudProfile | null) ?? null;
}

export async function upsertStudentProfile(
  patch: Partial<StudentCloudProfile> & { id: string; name: string; class_level: string }
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Supabase non configuré." };
  const { error } = await supabase.from("student_profiles").upsert(
    {
      parent_id: patch.parent_id ?? patch.id,
      total_xp: patch.total_xp ?? 0,
      platform: "mobile",
      ...patch,
    },
    { onConflict: "id" }
  );
  if (error) return { error: error.message };
  return {};
}

export async function saveCloudProgress(payload: {
  id: string;
  name: string;
  class_level: string;
  total_xp: number;
  streak: number;
  lessons_done: number;
  avatar_id?: string | null;
  email?: string | null;
  parent_phone?: string | null;
  progress: CloudProgress;
}): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Supabase non configuré." };
  const stamp = nowIso();
  const { error } = await supabase.from("student_profiles").upsert(
    {
      id: payload.id,
      parent_id: payload.id,
      name: payload.name,
      class_level: payload.class_level,
      total_xp: payload.total_xp,
      streak: payload.streak,
      lessons_done: payload.lessons_done,
      avatar_id: payload.avatar_id ?? null,
      email: payload.email ?? null,
      parent_phone: payload.parent_phone ?? null,
      platform: "mobile",
      progress: payload.progress,
      progress_updated_at: stamp,
      updated_at: stamp,
    },
    { onConflict: "id" }
  );
  if (error) return { error: error.message };

  const { data: existingRow } = await supabase
    .from("league_scores")
    .select("id, weekly_xp, league_tier")
    .eq("student_id", payload.id)
    .maybeSingle();
  const weekly = Math.max(existingRow?.weekly_xp ?? 0, payload.progress.ligue.scoreHebdo);
  const { error: leagueError } = await supabase.from("league_scores").upsert(
    {
      id: existingRow?.id ?? payload.id,
      student_id: payload.id,
      league_tier: existingRow?.league_tier ?? payload.progress.ligue.nomLigue ?? "Bronze",
      weekly_xp: weekly,
      last_sync: stamp,
    },
    { onConflict: "id" }
  );
  if (leagueError) console.warn("[LearnFlow] league_scores", leagueError.message);
  return {};
}

export async function ensureBeginnerLeague(studentId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.from("league_scores").select("id").eq("student_id", studentId).maybeSingle();
  if (data) return;
  const { error } = await supabase.from("league_scores").insert({
    student_id: studentId,
    league_tier: "Bronze",
    weekly_xp: 0,
  });
  if (error) console.warn("[LearnFlow] league seed", error.message);
}

export async function trackActivity(type: ActivityType, payload: Record<string, unknown> = {}): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user.id;
  if (!uid) return;
  const { error } = await supabase.from("activity_events").insert({
    student_id: uid,
    type,
    platform: "mobile",
    payload,
  });
  if (error) console.warn("[LearnFlow] activity", error.message);
}
