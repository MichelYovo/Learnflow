import { classLabel, isCloudProfileId } from "../data/mock";
import { resolveAvatarId } from "../data/avatars";
import { isPinConfigured } from "../lib/pin";
import type { LocalProfile } from "../types/database";
import type { ProfileEleve } from "../types/learnflow";
import type { LeaguePlayer } from "../data/mock";
import type { LeagueCacheRow } from "../types/database";
import {
  upsertProfile,
  loadProfiles,
  deleteProfilesNotIn,
  LOCAL_PARENT_ID,
} from "./profiles";

export function localProfileToEleve(
  row: LocalProfile,
  extras?: Pick<ProfileEleve, "badgesDebloques" | "avatarId" | "hasPin">
): ProfileEleve {
  const parts = row.name.trim().split(/\s+/);
  return {
    id: row.id,
    compteId: row.parent_id,
    nom: row.name,
    firstName: row.first_name ?? parts[0] ?? row.name,
    lastName: row.last_name ?? (parts.slice(1).join(" ") || undefined),
    email: row.email ?? undefined,
    classe: row.class_level,
    gradeLabel: classLabel(row.class_level),
    xpTotale: row.total_xp,
    streak: row.streak,
    rang: row.rank,
    lessonsDone: row.lessons_done,
    badgesDebloques: extras?.badgesDebloques ?? [],
    color: row.color ?? undefined,
    bg: row.bg ?? undefined,
    avatarId: resolveAvatarId(row.avatar_id ?? extras?.avatarId),
    hasPin: extras?.hasPin ?? isPinConfigured(row.local_pin_code),
  };
}

export function leagueCacheToPlayer(row: LeagueCacheRow): LeaguePlayer {
  const initials =
    row.initials ??
    row.student_name
      .split(/\s+/)
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  return {
    rank: row.rank,
    name: row.student_name,
    xp: row.weekly_xp,
    streak: row.streak,
    you: row.is_you === 1,
    initials,
    avatarColor: row.avatar_color ?? "#1677FF",
    avatarId: row.avatar_id ?? undefined,
    studentId: row.student_id,
  };
}

/** Plus de comptes de simulation. */
export const DEMO_PIN = "1234";

export async function seedDemoProfilesIfEmpty(): Promise<LocalProfile[]> {
  return loadProfiles();
}

/** Retire tout profil local de simulation (Kofi, Ama, ids courts). */
export async function pruneExtraLocalProfiles(): Promise<void> {
  try {
    await deleteAllLocalSimulationProfiles();
  } catch {
    /* ignore */
  }
  const rows = await loadProfiles();
  const keep = rows.filter((row) => isCloudProfileId(row.id)).map((row) => row.id);
  if (keep.length === 0) {
    await deleteProfilesNotIn(["__none__"]);
    return;
  }
  await deleteProfilesNotIn(keep);
}

async function deleteAllLocalSimulationProfiles(): Promise<void> {
  const { withDatabase } = await import("./client");
  await withDatabase((db) =>
    db.runAsync("DELETE FROM LocalProfiles WHERE id IN ('1', '2') OR length(id) < 20")
  );
}

/** Conservé no-op : plus de PIN démo. */
export async function ensureDemoPins(_pin = DEMO_PIN): Promise<void> {}

/** Conservé no-op : plus de classes démo. */
export async function ensureDemoClasses(): Promise<void> {}

export async function importEleveProfiles(
  profiles: ProfileEleve[],
  defaultPin = DEMO_PIN
): Promise<void> {
  const existing = await loadProfiles();
  if (existing.length > 0) return;

  for (const profile of profiles) {
    if (!isCloudProfileId(String(profile.id))) continue;
    await upsertProfile({
      id: String(profile.id),
      parent_id: String(profile.compteId || LOCAL_PARENT_ID),
      name: profile.nom,
      class_level: String(profile.classe),
      total_xp: profile.xpTotale,
      pin: profile.hasPin === false ? undefined : defaultPin,
      first_name: profile.firstName,
      last_name: profile.lastName ?? null,
      email: profile.email ?? null,
      streak: profile.streak,
      rank: profile.rang,
      lessons_done: profile.lessonsDone,
      color: profile.color ?? null,
      bg: profile.bg ?? null,
      avatar_id: profile.avatarId ?? null,
    });
  }
}
