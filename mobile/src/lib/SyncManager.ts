import { InteractionManager } from "react-native";
import * as Network from "expo-network";
import type { LeaguePlayer } from "../data/mock";
import type { LeagueCacheRow } from "../types/database";
import type { LeagueScoreRow, StudentProfile } from "../types/supabase";
import { supabase, isSupabaseConfigured } from "./supabase";
import { fetchLeagueLeaderboard, subscribeLeagueLive } from "./leagueLive";
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
  getSelf?: () => { name: string; avatarId?: string } | null;
  onLeaderboard: (players: LeaguePlayer[]) => void;
  onWeeklyXp: (studentId: string, weeklyXp: number, rank: number, tier?: string) => void;
};

type NetworkSubscription = { remove: () => void };

const SYNC_DEBOUNCE_MS = 800;

let hooks: SyncManagerHooks | null = null;
let networkSub: NetworkSubscription | null = null;
let liveUnsub: (() => void) | null = null;
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
    const scorePayload: LeagueScoreRow = {
      id: existing?.id ?? studentId,
      student_id: studentId,
      league_tier: existing?.league_tier ?? leagueTier,
      weekly_xp: weekly,
      last_sync: nowIso(),
    };

    const { error: scoreError } = await supabase
      .from("league_scores")
      .upsert(scorePayload, { onConflict: "id" });
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
  const self = hooks?.getSelf?.() ?? null;
  const players = await fetchLeagueLeaderboard(
    leagueTier,
    activeStudentId,
    self ? { name: self.name, avatarId: self.avatarId, initials: initialsFromName(self.name) } : undefined
  );
  const lastSync = nowIso();
  const cache: LeagueCacheRow[] = players.map((player, index) => ({
    id: player.studentId ?? player.name ?? `lb-${index}`,
    student_id: player.studentId ?? (player.you && activeStudentId ? activeStudentId : `peer-${index}`),
    student_name: player.name,
    league_tier: leagueTier,
    weekly_xp: player.xp,
    rank: player.rank,
    last_sync: lastSync,
    is_you: player.you ? 1 : 0,
    initials: player.initials,
    avatar_color: player.avatarColor,
    streak: player.streak,
    avatar_id: player.avatarId ?? null,
  }));

  await replaceLeagueCache(cache);
  hooks?.onLeaderboard(players);

  const me = players.find((row) => row.you);
  if (me && activeStudentId) {
    hooks?.onWeeklyXp(activeStudentId, me.xp, me.rank, leagueTier);
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

    const leagueTier = hooks?.getLeagueTier() ?? "Bronze";
    const activeStudentId = hooks?.getActiveStudentId() ?? null;

    const { syncProgress } = await import("./progressSync");
    await syncProgress();
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
  liveUnsub = subscribeLeagueLive(() => scheduleSync());

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
  liveUnsub?.();
  liveUnsub = null;
}

export function isSyncing(): boolean {
  return syncing;
}
