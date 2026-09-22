import { getBrowserSupabase, isSupabaseConfigured } from "./supabase";
import type { ActivityType, CloudProgress, StudentCloudProfile } from "./cloudTypes";
import { nowIso } from "./ids";

export async function fetchOwnStudentProfile(): Promise<StudentCloudProfile | null> {
  const supabase = getBrowserSupabase();
  if (!supabase) return null;
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
  const supabase = getBrowserSupabase();
  if (!supabase) return { error: "Supabase non configuré." };
  const { error } = await supabase.from("student_profiles").upsert(
    {
      parent_id: patch.parent_id ?? patch.id,
      platform: "web",
      ...patch,
    },
    { onConflict: "id" }
  );
  if (error) return { error: error.message };
  return {};
}

export async function awardXp(opts: {
  amount: number;
  reason?: string;
  idempotencyKey?: string;
}): Promise<{ ok: boolean; totalXp?: number; awarded?: number; message?: string }> {
  const supabase = getBrowserSupabase();
  if (!supabase) return { ok: false, message: "Supabase non configuré." };
  const amount = Math.max(0, Math.floor(opts.amount));
  if (amount < 1) return { ok: false, message: "montant invalide" };
  const { data, error } = await supabase.rpc("award_xp", {
    p_amount: amount,
    p_reason: opts.reason ?? "generic",
    p_idempotency_key: opts.idempotencyKey ?? null,
  });
  if (error) {
    console.warn("[LearnFlow] award_xp", error.message);
    return { ok: false, message: error.message };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return {
    ok: Boolean(row?.ok),
    totalXp: typeof row?.total_xp === "number" ? row.total_xp : undefined,
    awarded: typeof row?.awarded === "number" ? row.awarded : undefined,
    message: typeof row?.message === "string" ? row.message : undefined,
  };
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
  const supabase = getBrowserSupabase();
  if (!supabase) return { error: "Supabase non configuré." };
  const stamp = nowIso();
  // total_xp n'est plus écrasé ici : passer par award_xp (RPC).
  // On lit la valeur serveur pour ne pas régresser.
  const { data: existing } = await supabase
    .from("student_profiles")
    .select("total_xp")
    .eq("id", payload.id)
    .maybeSingle();
  const safeXp = Math.max(existing?.total_xp ?? 0, Math.min(payload.total_xp, (existing?.total_xp ?? 0) + 250));

  const { error } = await supabase.from("student_profiles").upsert(
    {
      id: payload.id,
      parent_id: payload.id,
      name: payload.name,
      class_level: payload.class_level,
      total_xp: safeXp,
      streak: payload.streak,
      lessons_done: payload.lessons_done,
      avatar_id: payload.avatar_id ?? null,
      email: payload.email ?? null,
      parent_phone: payload.parent_phone ?? null,
      platform: "web",
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
  const leagueRow: Record<string, unknown> = {
    student_id: payload.id,
    league_tier: existingRow?.league_tier ?? payload.progress.ligue.nomLigue ?? "Bronze",
    weekly_xp: weekly,
    last_sync: stamp,
  };
  if (existingRow?.id) leagueRow.id = existingRow.id;
  const { error: leagueError } = await supabase.from("league_scores").upsert(leagueRow, { onConflict: "student_id" });
  if (leagueError) console.warn("[LearnFlow] league_scores", leagueError.message);
  return {};
}

export async function ensureBeginnerLeague(studentId: string): Promise<void> {
  const supabase = getBrowserSupabase();
  if (!supabase) return;
  const { data } = await supabase.from("league_scores").select("id").eq("student_id", studentId).maybeSingle();
  if (data) return;
  const { error } = await supabase.from("league_scores").insert({
    student_id: studentId,
    league_tier: "Bronze",
    weekly_xp: 0,
  });
  if (error) console.warn("[LearnFlow] league seed", error.message);
}

let lastHeartbeatAt = 0;
const HEARTBEAT_MS = 4 * 60_000;

export async function trackActivity(type: ActivityType, payload: Record<string, unknown> = {}): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = getBrowserSupabase();
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user.id;
  if (!uid) return;
  if (type === "heartbeat") {
    const now = Date.now();
    if (now - lastHeartbeatAt < HEARTBEAT_MS) return;
    lastHeartbeatAt = now;
  }
  const { error } = await supabase.from("activity_events").insert({
    student_id: uid,
    type,
    platform: "web",
    payload,
  });
  if (error) console.warn("[LearnFlow] activity", error.message);
}
