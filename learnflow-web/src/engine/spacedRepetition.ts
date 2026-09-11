import type { DifficulteFlash, FlashcardData } from "../types/learnflow";

/** Algorithme des J (répétition espacée type Ebbinghaus / Koala) */
const INTERVALS: Record<DifficulteFlash, number[]> = {
  Facile: [1, 3, 7, 14, 30],
  Moyen: [1, 2, 4, 8, 16],
  Difficile: [0, 1, 2, 4, 7],
};

export function nextRevisionDate(difficulte: DifficulteFlash, currentInterval = 0): { date: Date; interval: number } {
  const ladder = INTERVALS[difficulte];
  const idx = Math.min(currentInterval, ladder.length - 1);
  const days = ladder[idx];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return { date, interval: idx + 1 };
}

export function cardsDueToday(cards: FlashcardData[]): FlashcardData[] {
  if (!Array.isArray(cards)) return [];
  const now = new Date();
  return cards.filter((c) => c && (c.due || new Date(c.prochaineRevision) <= now));
}

export function daysUntilNext(difficulte: DifficulteFlash, currentInterval = 0): number {
  const ladder = INTERVALS[difficulte];
  const idx = Math.min(currentInterval, ladder.length - 1);
  return ladder[idx];
}

export function applySelfRating(
  card: FlashcardData,
  rating: DifficulteFlash
): FlashcardData {
  const { date, interval } = nextRevisionDate(rating, card.intervalleRepetJ);
  return {
    ...card,
    difficulte: rating,
    intervalleRepetJ: interval,
    prochaineRevision: date.toISOString(),
    due: false,
  };
}
