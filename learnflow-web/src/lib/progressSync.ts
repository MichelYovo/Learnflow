import type { ChapterProgress, DifficulteFlash, FlashcardData, Ligue, ProfileEleve } from "@/types/learnflow";
import type { CloudChapterProgress, CloudFlashcardState, CloudProgress, StudentCloudProfile } from "./cloudTypes";
import { fetchOwnStudentProfile, saveCloudProgress } from "./cloud";
import { nowIso } from "./ids";
import { isCloudProfileId } from "@/data/mock";
import { FLASHCARDS } from "@/data/mock";
import { getBrowserSupabase } from "./supabase";

const DEBOUNCE_MS = 900;

let timer: ReturnType<typeof setTimeout> | null = null;
let running = false;
let queued = false;

export function parseCloudProgress(raw: StudentCloudProfile["progress"]): CloudProgress | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as CloudProgress;
  if (p.v !== 1 || typeof p.chapterProgress !== "object" || !p.chapterProgress) return null;
  return p;
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
    read: Boolean(a.read || b.read),
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
    const state = useLearnFlowStore.getState();
    if (!isCloudProfileId(state.activeProfileId) || state.activeProfileId !== uid) return;

    const cloud = await fetchOwnStudentProfile();
    if (!cloud) return;

    const profile = state.getActiveProfile();
    const local = snapshotProgress({
      profile,
      ligue: state.ligue,
      chapterProgress: state.chapterProgress,
      flashcards: state.flashcards,
    });
    const remote = parseCloudProgress(cloud.progress);
    const merged = mergeProgress(local, remote, cloud.total_xp ?? 0);

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
