import { InteractionManager } from "react-native";
import * as Network from "expo-network";
import type { LeaguePlayer } from "../data/mock";
import type { LeagueCacheRow } from "../types/database";
import type { LeagueScoreInsert, LeagueScoreRow, StudentProfile } from "../types/supabase";
import { supabase, isSupabaseConfigured } from "./supabase";
import { defaultAvatarId } from "../data/avatars";
import { nowIso } from "./ids";
import {
  getProfileById,
  listDirtyProfiles,
  listPendingSessions,
  groupPendingXpByStudent,
  markSessionsSynced,
  markProfilesClean,
  replaceLeagueCache,
  setSyncMeta,
  LOCAL_PARENT_ID,
} from "../db";

export type SyncManagerHooks = {
  getActiveStudentId: () => string | null;
  getLeagueTier: () => string;
  onLeaderboard: (players: LeaguePlayer[]) => void;
  onWeeklyXp: (studentId: string, weeklyXp: number, rank: number) => void;
};

type NetworkSubscription = { remove: () => void };

const SYNC_DEBOUNCE_MS = 800;

let hooks: SyncManagerHooks | null = null;
let networkSub: NetworkSubscription | null = null;
let syncing = false;
let queued = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function isOnline(state: { isConnected?: boolean | null; isInternetReachable?: boolean | null }): boolean {
  return Boolean(state.isConnected) && state.isInternetReachable !== false;
}

async function restoreSession(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn("[LearnFlow] silent auth", error.message);
      return null;
    }
    return data.session?.user.id ?? null;
  } catch (error) {
    console.warn("[LearnFlow] silent auth failed", error);
    return null;
  }
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toPlayers(rows: LeagueCacheRow[]): LeaguePlayer[] {
  return rows.map((row) => ({
    rank: row.rank,
    name: row.student_name,
    xp: row.weekly_xp,
    streak: row.streak,
    you: row.is_you === 1,
    initials: row.initials ?? initialsFromName(row.student_name),
    avatarColor: row.avatar_color ?? "#1677FF",
    avatarId: defaultAvatarId(row.student_id),
  }));
}

async function pushPendingXp(parentId: string, leagueTier: string): Promise<void> {
  const pending = await listPendingSessions();
  const dirty = await listDirtyProfiles();
  const grouped = groupPendingXpByStudent(pending);
  const studentIds = new Set([...grouped.keys(), ...dirty.map((p) => p.id)]);

  const syncedProfileIds: string[] = [];
  const syncedSessionIds: string[] = [];

  for (const studentId of studentIds) {
    const local = await getProfileById(studentId);
    if (!local) continue;

    const parent = local.parent_id === LOCAL_PARENT_ID ? parentId : local.parent_id;
    const payload: StudentProfile = {
      id: local.id,
      parent_id: parent,
      name: local.name,
      class_level: local.class_level,
      total_xp: local.total_xp,
    };

    const { error: profileError } = await supabase
      .from("student_profiles")
      .upsert(payload, { onConflict: "id" });
    if (profileError) {
      console.warn("[LearnFlow] push student_profiles", profileError.message);
      continue;
    }

    const pendingXp = grouped.get(studentId)?.xp ?? 0;
    const { data: existingRow, error: scoreReadError } = await supabase
      .from("league_scores")
      .select("id, student_id, league_tier, weekly_xp, last_sync")
      .eq("student_id", studentId)
      .maybeSingle();
    if (scoreReadError) {
      console.warn("[LearnFlow] read league_scores", scoreReadError.message);
      continue;
    }
    const existing = existingRow as LeagueScoreRow | null;

    const weekly = (existing?.weekly_xp ?? 0) + pendingXp;
    const scorePayload: LeagueScoreInsert = {
      student_id: studentId,
      league_tier: existing?.league_tier ?? leagueTier,
      weekly_xp: weekly,
      last_sync: nowIso(),
    };
    if (existing?.id) scorePayload.id = existing.id;

    const { error: scoreError } = await supabase
      .from("league_scores")
      .upsert(scorePayload, { onConflict: "student_id" });
    if (scoreError) {
      console.warn("[LearnFlow] push league_scores", scoreError.message);
      continue;
    }

    syncedProfileIds.push(studentId);
    const sessionIds = grouped.get(studentId)?.ids ?? [];
    syncedSessionIds.push(...sessionIds);
  }

  await markProfilesClean(syncedProfileIds);
  await markSessionsSynced(syncedSessionIds);
}

async function pullLeaderboard(activeStudentId: string | null, leagueTier: string): Promise<void> {
  const { data: scoreRows, error } = await supabase
    .from("league_scores")
    .select("id, student_id, league_tier, weekly_xp, last_sync")
    .eq("league_tier", leagueTier)
    .order("weekly_xp", { ascending: false })
    .limit(30);

  if (error) {
    throw new Error(error.message);
  }
  const scores = (scoreRows ?? []) as LeagueScoreRow[];
  if (scores.length === 0) return;

  const ids = [...new Set(scores.map((row) => row.student_id))];
  const { data: nameRows, error: namesError } = await supabase
    .from("student_profiles")
    .select("id, name, total_xp")
    .in("id", ids);
  if (namesError) {
    throw new Error(namesError.message);
  }

  const names = (nameRows ?? []) as Pick<StudentProfile, "id" | "name" | "total_xp">[];
  const nameById = new Map(names.map((row) => [row.id, row]));
  const lastSync = nowIso();
  const cache: LeagueCacheRow[] = scores.map((row, index) => {
    const profile = nameById.get(row.student_id);
    const name = profile?.name ?? "Élève";
    return {
      id: row.id,
      student_id: row.student_id,
      student_name: name,
      league_tier: row.league_tier,
      weekly_xp: row.weekly_xp,
      rank: index + 1,
      last_sync: row.last_sync ?? lastSync,
      is_you: activeStudentId && row.student_id === activeStudentId ? 1 : 0,
      initials: initialsFromName(name),
      avatar_color: null,
      streak: 0,
    };
  });

  await replaceLeagueCache(cache);
  hooks?.onLeaderboard(toPlayers(cache));

  const me = cache.find((row) => row.is_you === 1);
  if (me) {
    hooks?.onWeeklyXp(me.student_id, me.weekly_xp, me.rank);
  }
}

async function runSync(): Promise<void> {
  if (syncing) {
    queued = true;
    return;
  }
  syncing = true;
  queued = false;

  try {
    const state = await Network.getNetworkStateAsync();
    if (!isOnline(state)) return;
    if (!isSupabaseConfigured) return;

    const parentId = await restoreSession();
    if (!parentId) return;

    const leagueTier = hooks?.getLeagueTier() ?? "Or";
    const activeStudentId = hooks?.getActiveStudentId() ?? null;

    await pushPendingXp(parentId, leagueTier);
    await pullLeaderboard(activeStudentId, leagueTier);
    await setSyncMeta("last_sync_at", nowIso());
    await setSyncMeta("last_sync_error", "");
  } catch (error) {
    const message = error instanceof Error ? error.message : "sync failed";
    console.warn("[LearnFlow] background sync", message);
    await setSyncMeta("last_sync_error", message);
  } finally {
    syncing = false;
    if (queued) {
      queued = false;
      scheduleSync();
    }
  }
}

function scheduleSync(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    InteractionManager.runAfterInteractions(() => {
      void runSync();
    });
  }, SYNC_DEBOUNCE_MS);
}

export function requestBackgroundSync(): void {
  scheduleSync();
}

export function startSyncManager(nextHooks: SyncManagerHooks): () => void {
  hooks = nextHooks;
  stopSyncManager();

  networkSub = Network.addNetworkStateListener((state) => {
    if (isOnline(state)) scheduleSync();
  });

  scheduleSync();

  return stopSyncManager;
}

export function stopSyncManager(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  networkSub?.remove();
  networkSub = null;
}

export function isSyncing(): boolean {
  return syncing;
}
