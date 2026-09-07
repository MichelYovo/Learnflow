import React, { useEffect } from "react";
import { AppState } from "react-native";
import {
  getCachedLeaderboard,
  importEleveProfiles,
  initDatabase,
  leagueCacheToPlayer,
  loadProfiles,
  localProfileToEleve,
  pruneExtraLocalProfiles,
} from "../db";
import { startSyncManager } from "../lib/SyncManager";
import { fetchOwnStudentProfile, isProfileComplete } from "../lib/cloud";
import { syncProgress } from "../lib/progressSync";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { isCloudProfileId, keepLocalTestProfiles } from "../data/mock";
import { refreshPublishedCatalog } from "../data/publishedCache";
import { useLearnFlowStore } from "../store/useLearnFlowStore";

async function hydrateFromSqlite(): Promise<void> {
  const store = useLearnFlowStore.getState();
  await importEleveProfiles(store.profiles);
  await pruneExtraLocalProfiles();
  const rows = await loadProfiles();
  if (rows.length === 0) return;

  const nextProfiles = keepLocalTestProfiles(
    rows.map((row) => {
      const prev = store.profiles.find((p) => String(p.id) === row.id);
      return localProfileToEleve(row, {
        badgesDebloques: prev?.badgesDebloques ?? [],
        avatarId: prev?.avatarId ?? row.avatar_id ?? undefined,
      });
    })
  );
  if (nextProfiles.length === 0) return;

  const activeStillThere = nextProfiles.some((p) => p.id === String(store.activeProfileId));
  store.hydrateFromLocal({
    profiles: nextProfiles,
    activeProfileId: activeStillThere ? String(store.activeProfileId) : nextProfiles[0].id,
  });

  const cached = await getCachedLeaderboard(store.ligue.nomLigue);
  if (cached.length > 0) {
    store.setLeagueBoard(cached.map(leagueCacheToPlayer));
  }
}

async function restoreCloudSession(): Promise<void> {
  if (!isSupabaseConfigured) return;
  await refreshPublishedCatalog("mobile");
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return;
  const profile = await fetchOwnStudentProfile();
  if (profile?.status === "suspendu") {
    useLearnFlowStore.getState().logout();
    return;
  }
  const state = useLearnFlowStore.getState();
  const already = isCloudProfileId(state.activeProfileId) && state.activeProfileId === user.id && state.isAuthenticated;
  if (!already) {
    if (!isProfileComplete(profile)) return;
    useLearnFlowStore.getState().applyCloudUser({
      id: user.id,
      email: user.email ?? profile?.email ?? "",
      nom: profile?.name ?? String(user.user_metadata?.full_name ?? "Élève"),
      classe: profile?.class_level ?? "3eme",
      parentPhone: profile?.parent_phone ?? "",
      xpTotale: profile?.total_xp ?? 0,
      streak: profile?.streak ?? 0,
      lessonsDone: profile?.lessons_done ?? 0,
      avatarId: profile?.avatar_id ?? undefined,
    });
  }
  await syncProgress();
}

export default function OfflineBootstrap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        await initDatabase();
        if (cancelled) return;
        try {
          await hydrateFromSqlite();
        } catch (error) {
          console.warn("[LearnFlow] offline bootstrap", error);
          await initDatabase();
          if (cancelled) return;
          await hydrateFromSqlite();
        }
      } catch (error) {
        console.warn("[LearnFlow] offline bootstrap", error);
      } finally {
        if (!cancelled) {
          try {
            await restoreCloudSession();
          } catch (error) {
            console.warn("[LearnFlow] restore cloud", error);
          }
        }
        if (cancelled) return;
        const stopSync = startSyncManager({
          getActiveStudentId: () => {
            const state = useLearnFlowStore.getState();
            return state.isAuthenticated ? String(state.activeProfileId) : null;
          },
          getLeagueTier: () => useLearnFlowStore.getState().ligue.nomLigue,
          getSelf: () => {
            const profile = useLearnFlowStore.getState().getActiveProfile();
            if (!profile?.id) return null;
            return { name: profile.nom, avatarId: profile.avatarId };
          },
          onLeaderboard: (players) => useLearnFlowStore.getState().setLeagueBoard(players),
          onWeeklyXp: (studentId, weeklyXp, rank, tier) => {
            useLearnFlowStore.getState().applyRemoteLeague(studentId, weeklyXp, rank, tier);
          },
        });
        const appSub = AppState.addEventListener("change", (next) => {
          if (next === "active") {
            void refreshPublishedCatalog("mobile");
            void syncProgress();
          }
        });
        stop = () => {
          appSub.remove();
          stopSync();
        };
      }
    })();

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return <>{children}</>;
}
