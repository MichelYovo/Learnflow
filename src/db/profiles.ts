import type { LocalProfile, LocalProfileInput } from "../types/database";
import { createId, nowIso } from "../lib/ids";
import { hashPin, isPinConfigured, isValidPinFormat, verifyPin } from "../lib/pin";
import { withDatabase } from "./client";

const PROFILE_COLUMNS = `
  id, parent_id, name, class_level, total_xp, local_pin_code,
  first_name, last_name, email, streak, rank, lessons_done,
  color, bg, avatar_id, created_at, updated_at, dirty
`;

export async function loadProfiles(): Promise<LocalProfile[]> {
  return withDatabase((db) =>
    db.getAllAsync<LocalProfile>(
      `SELECT ${PROFILE_COLUMNS} FROM LocalProfiles ORDER BY created_at ASC`
    )
  );
}

export async function listProfiles(): Promise<LocalProfile[]> {
  try {
    return await loadProfiles();
  } catch (error) {
    console.warn("[LearnFlow] listProfiles", error);
    return [];
  }
}

export async function getProfileById(id: string): Promise<LocalProfile | null> {
  try {
    const row = await withDatabase((db) =>
      db.getFirstAsync<LocalProfile>(
        `SELECT ${PROFILE_COLUMNS} FROM LocalProfiles WHERE id = ? LIMIT 1`,
        [id]
      )
    );
    return row ?? null;
  } catch (error) {
    console.warn("[LearnFlow] getProfileById", error);
    return null;
  }
}

export async function upsertProfile(input: LocalProfileInput): Promise<LocalProfile> {
  const id = input.id ?? createId();
  const existing = await getProfileById(id);
  let pinHash = existing?.local_pin_code ?? "";
  if (input.pin != null && input.pin !== "") {
    if (!isValidPinFormat(input.pin)) {
      throw new Error("Le code PIN doit contenir exactement 4 chiffres.");
    }
    pinHash = await hashPin(input.pin, id);
  }
  const timestamp = nowIso();

  const row: LocalProfile = {
    id,
    parent_id: input.parent_id,
    name: input.name.trim(),
    class_level: input.class_level,
    total_xp: input.total_xp ?? existing?.total_xp ?? 0,
    local_pin_code: pinHash,
    first_name: input.first_name ?? existing?.first_name ?? null,
    last_name: input.last_name ?? existing?.last_name ?? null,
    email: input.email ?? existing?.email ?? null,
    streak: input.streak ?? existing?.streak ?? 0,
    rank: input.rank ?? existing?.rank ?? 0,
    lessons_done: input.lessons_done ?? existing?.lessons_done ?? 0,
    color: input.color ?? existing?.color ?? null,
    bg: input.bg ?? existing?.bg ?? null,
    avatar_id: input.avatar_id ?? existing?.avatar_id ?? null,
    created_at: existing?.created_at ?? timestamp,
    updated_at: timestamp,
    dirty: 1,
  };

  await withDatabase((db) =>
    db.runAsync(
      `INSERT INTO LocalProfiles (
        id, parent_id, name, class_level, total_xp, local_pin_code,
        first_name, last_name, email, streak, rank, lessons_done,
        color, bg, avatar_id, created_at, updated_at, dirty
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        parent_id = excluded.parent_id,
        name = excluded.name,
        class_level = excluded.class_level,
        total_xp = excluded.total_xp,
        local_pin_code = excluded.local_pin_code,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        email = excluded.email,
        streak = excluded.streak,
        rank = excluded.rank,
        lessons_done = excluded.lessons_done,
        color = excluded.color,
        bg = excluded.bg,
        avatar_id = excluded.avatar_id,
        updated_at = excluded.updated_at,
        dirty = 1`,
      [
        row.id,
        row.parent_id,
        row.name,
        row.class_level,
        row.total_xp,
        row.local_pin_code,
        row.first_name,
        row.last_name,
        row.email,
        row.streak,
        row.rank,
        row.lessons_done,
        row.color,
        row.bg,
        row.avatar_id,
        row.created_at,
        row.updated_at,
        row.dirty,
      ]
    )
  );

  return row;
}

export async function addXpToProfile(id: string, amount: number): Promise<number> {
  if (amount <= 0) {
    const current = await getProfileById(id);
    return current?.total_xp ?? 0;
  }
  try {
    await withDatabase((db) =>
      db.runAsync(
        `UPDATE LocalProfiles
         SET total_xp = total_xp + ?, updated_at = ?, dirty = 1
         WHERE id = ?`,
        [amount, nowIso(), id]
      )
    );
    const updated = await getProfileById(id);
    return updated?.total_xp ?? 0;
  } catch (error) {
    console.warn("[LearnFlow] addXpToProfile", error);
    throw error;
  }
}

export async function setProfileXp(id: string, totalXp: number): Promise<void> {
  try {
    await withDatabase((db) =>
      db.runAsync(
        `UPDATE LocalProfiles SET total_xp = ?, updated_at = ?, dirty = 1 WHERE id = ?`,
        [totalXp, nowIso(), id]
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] setProfileXp", error);
  }
}

export async function markProfilesClean(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  try {
    const placeholders = ids.map(() => "?").join(", ");
    await withDatabase((db) =>
      db.runAsync(
        `UPDATE LocalProfiles SET dirty = 0, updated_at = ? WHERE id IN (${placeholders})`,
        [nowIso(), ...ids]
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] markProfilesClean", error);
  }
}

export async function listDirtyProfiles(): Promise<LocalProfile[]> {
  try {
    return await withDatabase((db) =>
      db.getAllAsync<LocalProfile>(
        `SELECT ${PROFILE_COLUMNS} FROM LocalProfiles WHERE dirty = 1`
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] listDirtyProfiles", error);
    return [];
  }
}

export async function updateProfileAvatar(id: string, avatarId: string): Promise<void> {
  try {
    await withDatabase((db) =>
      db.runAsync(
        `UPDATE LocalProfiles
         SET avatar_id = ?, updated_at = ?, dirty = 1
         WHERE id = ?`,
        [avatarId, nowIso(), id]
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] updateProfileAvatar", error);
  }
}

export async function updateProfileClass(id: string, classLevel: string): Promise<void> {
  try {
    await withDatabase((db) =>
      db.runAsync(
        `UPDATE LocalProfiles
         SET class_level = ?, updated_at = ?, dirty = 1
         WHERE id = ?`,
        [classLevel, nowIso(), id]
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] updateProfileClass", error);
  }
}

export async function updateProfileName(id: string, name: string): Promise<void> {
  const firstName = name.trim().split(/\s+/)[0] || name.trim();
  try {
    await withDatabase((db) =>
      db.runAsync(
        `UPDATE LocalProfiles
         SET name = ?, first_name = ?, updated_at = ?, dirty = 1
         WHERE id = ?`,
        [name.trim(), firstName, nowIso(), id]
      )
    );
  } catch (error) {
    console.warn("[LearnFlow] updateProfileName", error);
  }
}

export async function validateLocalPin(profileId: string, pin: string): Promise<boolean> {
  const profile = await getProfileById(profileId);
  if (!profile) return false;
  if (!isPinConfigured(profile.local_pin_code)) return true;
  return verifyPin(pin, profileId, profile.local_pin_code);
}

export async function updateLocalPin(profileId: string, pin: string): Promise<void> {
  if (!isValidPinFormat(pin)) {
    throw new Error("Le code PIN doit contenir exactement 4 chiffres.");
  }
  const existing = await getProfileById(profileId);
  if (!existing) return;
  const alreadyOk = await verifyPin(pin, profileId, existing.local_pin_code);
  if (alreadyOk) return;
  const pinHash = await hashPin(pin, profileId);
  await withDatabase((db) =>
    db.runAsync(
      `UPDATE LocalProfiles
       SET local_pin_code = ?, updated_at = ?, dirty = 1
       WHERE id = ?`,
      [pinHash, nowIso(), profileId]
    )
  );
}

export const LOCAL_PARENT_ID = "local-parent";
