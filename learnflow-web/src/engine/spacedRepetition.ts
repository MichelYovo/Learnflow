/** Algorithme Leitner (boîtes 1→5) + délais type Anki/Ebbinghaus */

import type { DifficulteFlash, FlashcardData } from "../types/learnflow";

/** Jours avant prochaine révision selon la boîte Leitner (1–5). */
export const LEITNER_DAYS = [0, 1, 3, 7, 14, 30] as const;

export const LEITNER_MAX_BOX = 5;

export function leitnerBox(card: Pick<FlashcardData, "intervalleRepetJ">): number {
  const n = Number(card.intervalleRepetJ) || 1;
  return Math.max(1, Math.min(LEITNER_MAX_BOX, n));
}

export function daysForBox(box: number): number {
  const b = Math.max(1, Math.min(LEITNER_MAX_BOX, box));
  return LEITNER_DAYS[b] ?? 1;
}

/**
 * Difficile → boîte 1 (revoir bientôt)
 * Moyen → reste dans la même boîte
 * Facile → monte d’une boîte
 */
export function nextLeitnerBox(currentBox: number, rating: DifficulteFlash): number {
  const box = Math.max(1, Math.min(LEITNER_MAX_BOX, currentBox || 1));
  if (rating === "Difficile") return 1;
  if (rating === "Moyen") return box;
  return Math.min(LEITNER_MAX_BOX, box + 1);
}

export function nextRevisionDate(
  difficulte: DifficulteFlash,
  currentInterval = 1,
): { date: Date; interval: number } {
  const box = nextLeitnerBox(currentInterval || 1, difficulte);
  const days = daysForBox(box);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return { date, interval: box };
}

export function cardsDueToday(cards: FlashcardData[]): FlashcardData[] {
  if (!Array.isArray(cards)) return [];
  const now = new Date();
  return cards.filter((c) => c && (c.due || new Date(c.prochaineRevision) <= now));
}

export function daysUntilNext(difficulte: DifficulteFlash, currentInterval = 1): number {
  const box = nextLeitnerBox(currentInterval || 1, difficulte);
  return daysForBox(box);
}

export function applySelfRating(card: FlashcardData, rating: DifficulteFlash): FlashcardData {
  const { date, interval } = nextRevisionDate(rating, leitnerBox(card));
  return {
    ...card,
    difficulte: rating,
    intervalleRepetJ: interval,
    prochaineRevision: date.toISOString(),
    due: false,
  };
}

export function boxLabel(box: number): string {
  return `Boîte ${leitnerBox({ intervalleRepetJ: box })}`;
}

export function countByLeitnerBox(cards: FlashcardData[]): Record<number, number> {
  const out: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const c of cards ?? []) {
    const b = leitnerBox(c);
    out[b] = (out[b] ?? 0) + 1;
  }
  return out;
}
