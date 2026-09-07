import { classLabel, isCloudProfileId, LOCAL_TEST_PROFILE_IDS, PROFILE_COLORS, PROFILES_DEMO } from "../data/mock";
import { defaultAvatarId, resolveAvatarId } from "../data/avatars";
import { isPinConfigured } from "../lib/pin";
import type { LocalProfile } from "../types/database";
import type { ProfileEleve } from "../types/learnflow";
import type { LeaguePlayer } from "../data/mock";
import type { LeagueCacheRow } from "../types/database";
import {
  upsertProfile,
  loadProfiles,
  getProfileById,
  updateLocalPin,
  updateProfileClass,
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
    avatarId: resolveAvatarId(row.avatar_id ?? extras?.avatarId ?? defaultAvatarId(row.id)),
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
    avatarId: defaultAvatarId(row.student_id),
  };
}

/** PIN des deux comptes de simulation (Kofi + Ama). */
export const DEMO_PIN = "1234";

export async function seedDemoProfilesIfEmpty(): Promise<LocalProfile[]> {
  const existing = await loadProfiles();
  if (existing.length > 0) return existing;

  for (let i = 0; i < PROFILES_DEMO.length; i += 1) {
    const demo = PROFILES_DEMO[i];
    const palette = PROFILE_COLORS[i % PROFILE_COLORS.length];
    await upsertProfile({
      id: String(demo.id),
      parent_id: LOCAL_PARENT_ID,
      name: demo.nom,
      class_level: demo.classe,
      total_xp: demo.xpTotale,
      pin: DEMO_PIN,
      first_name: demo.firstName,
      last_name: demo.lastName,
      email: demo.email,
      streak: demo.streak,
      rank: demo.rang,
      lessons_done: demo.lessonsDone,
      color: demo.color ?? palette.color,
      bg: demo.bg ?? palette.bg,
      avatar_id: demo.avatarId ?? null,
    });
  }

  return loadProfiles();
}

/** Retire les profils locaux hors Kofi / Ama, conserve les comptes cloud (UUID). */
export async function pruneExtraLocalProfiles(): Promise<void> {
  const rows = await loadProfiles();
  const keep = rows
    .filter((row) => LOCAL_TEST_PROFILE_IDS.includes(row.id) || isCloudProfileId(row.id))
    .map((row) => row.id);
  await deleteProfilesNotIn(keep.length > 0 ? keep : LOCAL_TEST_PROFILE_IDS);
}

/** Aligne les PIN des comptes démo déjà présents (ex. Ama encore en 5678). */
export async function ensureDemoPins(pin = DEMO_PIN): Promise<void> {
  for (const demo of PROFILES_DEMO) {
    const id = String(demo.id);
    const existing = await getProfileById(id);
    if (!existing) continue;
    await updateLocalPin(id, pin);
  }
}

/** Aligne classe et XP des comptes démo (3ème + Tle D). */
export async function ensureDemoClasses(): Promise<void> {
  for (const demo of PROFILES_DEMO) {
    const id = String(demo.id);
    const existing = await getProfileById(id);
    if (!existing) continue;
    if (existing.class_level !== demo.classe) {
      await updateProfileClass(id, demo.classe);
    }
  }
}

export async function importEleveProfiles(
  profiles: ProfileEleve[],
  defaultPin = DEMO_PIN
): Promise<void> {
  const existing = await loadProfiles();
  if (existing.length > 0) return;

  for (const profile of profiles) {
    if (!PROFILES_DEMO.some((d) => String(d.id) === String(profile.id))) continue;
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
