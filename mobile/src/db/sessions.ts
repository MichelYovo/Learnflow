import type { StudySession, StudySessionInput } from "../types/database";
import { createId, nowIso } from "../lib/ids";
import { withDatabase } from "./client";

export async function insertStudySession(input: StudySessionInput): Promise<StudySession> {
  const row: StudySession = {
    id: createId(),
    student_id: input.student_id,
    chapter_id: input.chapter_id ?? null,
    chapter_title: input.chapter_title ?? null,
    xp_gained: input.xp_gained,
    completed_at: input.completed_at ?? nowIso(),
    synced: 0,
  };

  try {
    await withDatabase((db) =>
      db.runAsync(
        `INSERT INTO StudySessions (
          id, student_id, chapter_id, chapter_title, xp_gained, completed_at, synced
        ) VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [
          row.id,
          row.student_id,
          row.chapter_id,
          row.chapter_title,
          row.xp_gained,
          row.completed_at,
        ]
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] insertStudySession", error);
    throw error;
  }

  return row;
}

export async function listPendingSessions(): Promise<StudySession[]> {
  try {
    return await withDatabase((db) =>
      db.getAllAsync<StudySession>(
        `SELECT id, student_id, chapter_id, chapter_title, xp_gained, completed_at, synced
         FROM StudySessions
         WHERE synced = 0
         ORDER BY completed_at ASC`
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] listPendingSessions", error);
    return [];
  }
}

export async function listSessionsForStudent(studentId: string): Promise<StudySession[]> {
  try {
    return await withDatabase((db) =>
      db.getAllAsync<StudySession>(
        `SELECT id, student_id, chapter_id, chapter_title, xp_gained, completed_at, synced
         FROM StudySessions
         WHERE student_id = ?
         ORDER BY completed_at DESC`,
        [studentId]
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] listSessionsForStudent", error);
    return [];
  }
}

export async function markSessionsSynced(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  try {
    const placeholders = ids.map(() => "?").join(", ");
    await withDatabase((db) =>
      db.runAsync(`UPDATE StudySessions SET synced = 1 WHERE id IN (${placeholders})`, ids)
    );
  } catch (error) {
    console.warn("[LearnFlow] markSessionsSynced", error);
  }
}

export function groupPendingXpByStudent(sessions: StudySession[]): Map<string, { xp: number; ids: string[] }> {
  const grouped = new Map<string, { xp: number; ids: string[] }>();
  for (const session of sessions) {
    const current = grouped.get(session.student_id) ?? { xp: 0, ids: [] };
    current.xp += session.xp_gained;
    current.ids.push(session.id);
    grouped.set(session.student_id, current);
  }
  return grouped;
}
