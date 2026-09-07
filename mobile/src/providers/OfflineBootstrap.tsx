import React, { useEffect } from "react";
import {
  getCachedLeaderboard,
  ensureDemoPins,
  ensureDemoClasses,
  importEleveProfiles,
  initDatabase,
  leagueCacheToPlayer,
  loadProfiles,
  localProfileToEleve,
  pruneExtraLocalProfiles,
  seedDemoProfilesIfEmpty,
  updateLocalProfileAvatar,
} from "../db";
import { startSyncManager } from "../lib/SyncManager";
import { keepLocalTestProfiles } from "../data/mock";
import { useLearnFlowStore } from "../store/useLearnFlowStore";

async function hydrateFromSqlite(): Promise<void> {
  const store = useLearnFlowStore.getState();
  await importEleveProfiles(store.profiles);
  await seedDemoProfilesIfEmpty();
  await pruneExtraLocalProfiles();
  await ensureDemoPins();
  await ensureDemoClasses();
  const rows = await loadProfiles();
  if (rows.length === 0) return;

  const nextProfiles = keepLocalTestProfiles(
    rows.map((row) => {
      const prev = store.profiles.find((p) => String(p.id) === row.id);
      const mapped = localProfileToEleve(row, {
        badgesDebloques: prev?.badgesDebloques ?? [],
        avatarId: prev?.avatarId,
      });
      if (!row.avatar_id && mapped.avatarId) {
        void updateLocalProfileAvatar(row.id, mapped.avatarId);
      }
      return mapped;
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
        if (cancelled) return;
        stop = startSyncManager({
          getActiveStudentId: () => {
            const state = useLearnFlowStore.getState();
            return state.isAuthenticated ? String(state.activeProfileId) : null;
          },
          getLeagueTier: () => useLearnFlowStore.getState().ligue.nomLigue,
          onLeaderboard: (players) => useLearnFlowStore.getState().setLeagueBoard(players),
          onWeeklyXp: (studentId, weeklyXp, rank) => {
            useLearnFlowStore.getState().applyRemoteLeague(studentId, weeklyXp, rank);
          },
        });
      }
    })();

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return <>{children}</>;
}
