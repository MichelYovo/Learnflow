import type { ChapterProgress, DifficulteFlash, FlashcardData, Ligue, ProfileEleve } from "@/types/learnflow";
import type { CloudChapterProgress, CloudFlashcardState, CloudProgress, StudentCloudProfile } from "./cloudTypes";
import { fetchOwnStudentProfile, saveCloudProgress } from "./cloud";
import { nowIso } from "./ids";
import { isCloudProfileId } from "@/data/mock";
import { FLASHCARDS } from "@/data/mock";
import { remainingAiQuota, todayIsoDate } from "@/data/tutor";
import { getBrowserSupabase } from "./supabase";

const DEBOUNCE_MS = 900;

let timer: ReturnType<typeof setTimeout> | null = null;
let running = false;
let queued = false;

export function parseCloudProgress(raw: StudentCloudProfile["progress"]): CloudProgress | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<CloudProgress>;
  if (p.v !== 1) return null;
  return {
    v: 1,
    updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : nowIso(),
    xpTotale: Number(p.xpTotale) || 0,
    streak: Number(p.streak) || 0,
    lessonsDone: Number(p.lessonsDone) || 0,
    badgesDebloques: Array.isArray(p.badgesDebloques) ? p.badgesDebloques : [],
    avatarId: p.avatarId,
    ligue: p.ligue ?? { nomLigue: "Bronze", rangActuel: 1, scoreHebdo: 0, estGelee: false, groupe: 1 },
    chapterProgress: p.chapterProgress && typeof p.chapterProgress === "object" ? p.chapterProgress : {},
    flashcards: Array.isArray(p.flashcards) ? p.flashcards : [],
    aiQuotaRestant: p.aiQuotaRestant,
    aiQuotaDay: p.aiQuotaDay,
  };
}

function mergeChapter(a?: CloudChapterProgress, b?: CloudChapterProgress): CloudChapterProgress | undefined {
  if (!a) return b;
  if (!b) return a;
  const scoreA = a.assimilationScore ?? -1;
  const scoreB = b.assimilationScore ?? -1;
  const unlocked = a.grandQuizzUnlocked || b.grandQuizzUnlocked;
  const locks = [a.grandQuizzLockedUntil, b.grandQuizzLockedUntil]
    .filter((d): d is string => Boolean(d && new Date(d).getTime() > Date.now()))
    .sort();
  return {
    chapitreId: a.chapitreId || b.chapitreId,
    assimilationScore: Math.max(scoreA, scoreB) < 0 ? null : Math.max(scoreA, scoreB),
    assimilationPerfect: a.assimilationPerfect || b.assimilationPerfect,
    grandQuizzUnlocked: unlocked,
    firstTryPerfect: a.firstTryPerfect || b.firstTryPerfect,
    grandQuizzLockedUntil: locks.at(-1) ?? null,
    read: Boolean(a.read || b.read || a.essentialRead || b.essentialRead || a.detailsRead || b.detailsRead),
    essentialRead: Boolean(a.essentialRead || b.essentialRead),
    detailsRead: Boolean(a.detailsRead || b.detailsRead),
  };
}

function mergeChapters(
  local: Record<string, ChapterProgress>,
  remote: Record<string, CloudChapterProgress>
): Record<string, ChapterProgress> {
  const ids = new Set([...Object.keys(local), ...Object.keys(remote)]);
  const out: Record<string, ChapterProgress> = {};
  for (const id of ids) {
    const merged = mergeChapter(local[id], remote[id]);
    if (merged) out[id] = merged;
  }
  return out;
}

function mergeFlashcards(local: FlashcardData[], remote: CloudFlashcardState[]): FlashcardData[] {
  const byId = new Map(remote.map((c) => [c.id, c]));
  return local.map((card) => {
    const r = byId.get(card.id);
    if (!r) return card;
    if (r.intervalleRepetJ > card.intervalleRepetJ) {
      return { ...card, ...r, difficulte: r.difficulte as DifficulteFlash };
    }
    if (r.intervalleRepetJ === card.intervalleRepetJ && r.prochaineRevision > card.prochaineRevision) {
      return { ...card, ...r, difficulte: r.difficulte as DifficulteFlash };
    }
    return card;
  });
}

function snapshotFlashcards(cards: FlashcardData[]): CloudFlashcardState[] {
  return cards.map((c) => ({
    id: c.id,
    intervalleRepetJ: c.intervalleRepetJ,
    prochaineRevision: c.prochaineRevision,
    difficulte: c.difficulte,
    due: c.due,
  }));
}

export function snapshotProgress(input: {
  profile: ProfileEleve;
  ligue: Ligue;
  chapterProgress: Record<string, ChapterProgress>;
  flashcards: FlashcardData[];
  aiQuotaRestant?: number;
  aiQuotaDay?: string;
}): CloudProgress {
  return {
    v: 1,
    updatedAt: nowIso(),
    xpTotale: input.profile.xpTotale,
    streak: input.profile.streak,
    lessonsDone: input.profile.lessonsDone,
    badgesDebloques: input.profile.badgesDebloques,
    avatarId: input.profile.avatarId ?? null,
    ligue: {
      nomLigue: input.ligue.nomLigue,
      rangActuel: input.ligue.rangActuel,
      scoreHebdo: input.ligue.scoreHebdo,
      estGelee: input.ligue.estGelee,
      groupe: input.ligue.groupe,
    },
    chapterProgress: input.chapterProgress,
    flashcards: snapshotFlashcards(input.flashcards),
    aiQuotaRestant: input.aiQuotaRestant,
    aiQuotaDay: input.aiQuotaDay,
  };
}

export function mergeProgress(local: CloudProgress, remote: CloudProgress | null, cloudXp: number): CloudProgress {
  if (!remote) {
    return { ...local, xpTotale: Math.max(local.xpTotale, cloudXp) };
  }
  const badges = Array.from(new Set([...(local.badgesDebloques ?? []), ...(remote.badgesDebloques ?? [])]));
  return {
    v: 1,
    updatedAt: nowIso(),
    xpTotale: Math.max(local.xpTotale, remote.xpTotale, cloudXp),
    streak: Math.max(local.streak, remote.streak),
    lessonsDone: Math.max(local.lessonsDone, remote.lessonsDone),
    badgesDebloques: badges,
    avatarId: local.avatarId || remote.avatarId,
    ligue: {
      nomLigue: local.ligue.scoreHebdo >= remote.ligue.scoreHebdo ? local.ligue.nomLigue : remote.ligue.nomLigue,
      rangActuel: Math.min(local.ligue.rangActuel || 99, remote.ligue.rangActuel || 99),
      scoreHebdo: Math.max(local.ligue.scoreHebdo, remote.ligue.scoreHebdo),
      estGelee: local.ligue.estGelee || remote.ligue.estGelee,
      groupe: local.ligue.groupe || remote.ligue.groupe,
    },
    chapterProgress: mergeChapters(local.chapterProgress, remote.chapterProgress),
    flashcards: snapshotFlashcards(
      mergeFlashcards(
        FLASHCARDS.map((c) => {
          const loc = local.flashcards.find((x) => x.id === c.id);
          return loc ? { ...c, ...loc } : c;
        }),
        remote.flashcards
      )
    ),
    aiQuotaDay: local.aiQuotaDay === todayIsoDate() ? local.aiQuotaDay : remote.aiQuotaDay,
    aiQuotaRestant:
      local.aiQuotaDay === todayIsoDate()
        ? remainingAiQuota(local.aiQuotaRestant ?? 5, local.aiQuotaDay)
        : remainingAiQuota(remote.aiQuotaRestant ?? 5, remote.aiQuotaDay),
  };
}

export async function syncProgress(): Promise<void> {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  try {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;

    const { useLearnFlowStore } = await import("@/store/useLearnFlowStore");
    let state = useLearnFlowStore.getState();
    const cloud = await fetchOwnStudentProfile();

    if (cloud && (state.activeProfileId !== uid || !isCloudProfileId(state.activeProfileId))) {
      useLearnFlowStore.getState().applyCloudUser({
        id: uid,
        email: cloud.email ?? "",
        nom: cloud.name || "Élève",
        classe: cloud.class_level || "3eme",
        parentPhone: cloud.parent_phone ?? "",
        xpTotale: cloud.total_xp ?? 0,
        streak: cloud.streak ?? 0,
        lessonsDone: cloud.lessons_done ?? 0,
        avatarId: cloud.avatar_id ?? undefined,
      });
      state = useLearnFlowStore.getState();
    }

    if (!isCloudProfileId(state.activeProfileId) || state.activeProfileId !== uid) return;

    const profile = state.getActiveProfile();
    const local = snapshotProgress({
      profile,
      ligue: state.ligue,
      chapterProgress: state.chapterProgress,
      flashcards: state.flashcards,
      aiQuotaRestant: remainingAiQuota(state.aiQuotaRestant, state.aiQuotaDay),
      aiQuotaDay: todayIsoDate(),
    });
    const remote = parseCloudProgress(cloud?.progress);
    const merged = mergeProgress(local, remote, cloud?.total_xp ?? 0);

    useLearnFlowStore.getState().ingestCloudProgress({
      id: uid,
      xpTotale: merged.xpTotale,
      streak: merged.streak,
      lessonsDone: merged.lessonsDone,
      badgesDebloques: merged.badgesDebloques,
      avatarId: merged.avatarId ?? undefined,
      chapterProgress: merged.chapterProgress,
      flashcards: mergeFlashcards(state.flashcards.length ? state.flashcards : FLASHCARDS, merged.flashcards),
      ligue: merged.ligue,
      aiQuotaRestant: merged.aiQuotaRestant,
      aiQuotaDay: merged.aiQuotaDay,
    });

    const next = useLearnFlowStore.getState().getActiveProfile();
    await saveCloudProgress({
      id: uid,
      name: next.nom,
      class_level: String(next.classe),
      total_xp: merged.xpTotale,
      streak: merged.streak,
      lessons_done: merged.lessonsDone,
      avatar_id: next.avatarId,
      email: next.email,
      parent_phone: next.parentPhone,
      progress: { ...merged, xpTotale: merged.xpTotale, avatarId: next.avatarId },
    });
  } catch (error) {
    console.warn("[LearnFlow] progress sync", error);
  } finally {
    running = false;
    if (queued) {
      queued = false;
      void syncProgress();
    }
  }
}

export function requestProgressSync(): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void syncProgress();
  }, DEBOUNCE_MS);
}
