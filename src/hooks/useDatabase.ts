import { useCallback, useEffect, useState } from "react";
import type { LocalProfile, StudySession, LeagueCacheRow, LocalProfileInput, StudySessionInput } from "../types/database";
import {
  initDatabase,
  listProfiles,
  getProfileById,
  upsertProfile,
  addXpToProfile,
  updateLocalProfileName,
  validateLocalPin,
  insertStudySession,
  listPendingSessions,
  listSessionsForStudent,
  getCachedLeaderboard,
} from "../db";

export type UseDatabaseResult = {
  ready: boolean;
  error: string | null;
  profiles: LocalProfile[];
  refresh: () => Promise<void>;
  createProfile: (input: LocalProfileInput) => Promise<LocalProfile>;
  getProfile: (id: string) => Promise<LocalProfile | null>;
  addXp: (id: string, amount: number) => Promise<number>;
  renameProfile: (id: string, name: string) => Promise<void>;
  validatePin: (profileId: string, pin: string) => Promise<boolean>;
  logStudySession: (input: StudySessionInput) => Promise<StudySession>;
  getPendingSessions: () => Promise<StudySession[]>;
  getSessions: (studentId: string) => Promise<StudySession[]>;
  getLeaderboard: (tier?: string) => Promise<LeagueCacheRow[]>;
};

export function useDatabase(): UseDatabaseResult {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<LocalProfile[]>([]);

  const refresh = useCallback(async () => {
    try {
      const rows = await listProfiles();
      setProfiles(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de la base locale.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initDatabase();
        if (cancelled) return;
        setReady(true);
        await refresh();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Impossible d'ouvrir la base locale.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const createProfile = useCallback(
    async (input: LocalProfileInput) => {
      const row = await upsertProfile(input);
      await refresh();
      return row;
    },
    [refresh]
  );

  const getProfile = useCallback(async (id: string) => getProfileById(id), []);

  const addXp = useCallback(
    async (id: string, amount: number) => {
      const total = await addXpToProfile(id, amount);
      await refresh();
      return total;
    },
    [refresh]
  );

  const renameProfile = useCallback(
    async (id: string, name: string) => {
      await updateLocalProfileName(id, name);
      await refresh();
    },
    [refresh]
  );

  const validatePin = useCallback(
    async (profileId: string, pin: string) => validateLocalPin(profileId, pin),
    []
  );

  const logStudySession = useCallback(async (input: StudySessionInput) => {
    return insertStudySession(input);
  }, []);

  const getPendingSessions = useCallback(async () => listPendingSessions(), []);

  const getSessions = useCallback(
    async (studentId: string) => listSessionsForStudent(studentId),
    []
  );

  const getLeaderboard = useCallback(
    async (tier?: string) => getCachedLeaderboard(tier),
    []
  );

  return {
    ready,
    error,
    profiles,
    refresh,
    createProfile,
    getProfile,
    addXp,
    renameProfile,
    validatePin,
    logStudySession,
    getPendingSessions,
    getSessions,
    getLeaderboard,
  };
}
