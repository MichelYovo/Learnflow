import type { LeagueCacheRow } from "../types/database";
import { withDatabase } from "./client";

export async function replaceLeagueCache(rows: LeagueCacheRow[]): Promise<void> {
  try {
    await withDatabase(async (db) => {
      await db.withTransactionAsync(async () => {
        await db.execAsync("DELETE FROM LeagueCache");
        for (const row of rows) {
          await db.runAsync(
            `INSERT INTO LeagueCache (
              id, student_id, student_name, league_tier, weekly_xp, rank,
              last_sync, is_you, initials, avatar_color, streak, avatar_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              row.id,
              row.student_id,
              row.student_name,
              row.league_tier,
              row.weekly_xp,
              row.rank,
              row.last_sync,
              row.is_you,
              row.initials,
              row.avatar_color,
              row.streak,
              row.avatar_id ?? null,
            ]
          );
        }
      });
    });
  } catch (error) {
    console.warn("[LearnFlow] replaceLeagueCache", error);
  }
}

export async function getCachedLeaderboard(tier?: string): Promise<LeagueCacheRow[]> {
  try {
    return await withDatabase((db) =>
      tier
        ? db.getAllAsync<LeagueCacheRow>(
            `SELECT id, student_id, student_name, league_tier, weekly_xp, rank,
                    last_sync, is_you, initials, avatar_color, streak, avatar_id
             FROM LeagueCache
             WHERE league_tier = ?
             ORDER BY rank ASC, weekly_xp DESC`,
            [tier]
          )
        : db.getAllAsync<LeagueCacheRow>(
            `SELECT id, student_id, student_name, league_tier, weekly_xp, rank,
                    last_sync, is_you, initials, avatar_color, streak, avatar_id
             FROM LeagueCache
             ORDER BY rank ASC, weekly_xp DESC`
          )
    );
  } catch (error) {
    console.warn("[LearnFlow] getCachedLeaderboard", error);
    return [];
  }
}

export async function setSyncMeta(key: string, value: string): Promise<void> {
  try {
    await withDatabase((db) =>
      db.runAsync(
        `INSERT INTO SyncMeta (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [key, value]
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] setSyncMeta", error);
  }
}

export async function getSyncMeta(key: string): Promise<string | null> {
  try {
    const row = await withDatabase((db) =>
      db.getFirstAsync<{ value: string }>(`SELECT value FROM SyncMeta WHERE key = ? LIMIT 1`, [key])
    );
    return row?.value ?? null;
  } catch (error) {
    console.warn("[LearnFlow] getSyncMeta", error);
    return null;
  }
}
