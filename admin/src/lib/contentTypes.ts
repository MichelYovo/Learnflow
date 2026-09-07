export type ProfLesson = {
  id: string;
  title: string;
  duration: string;
  xp: number;
};

export type ProfQuizItem = {
  id: string;
  enonceQuestion: string;
  optionsProposees: string[];
  indexReponseCorrecte: number;
  explicationPedagogique: string;
};

export type ProfFlashcard = {
  recto: string;
  verso: string;
};

export type ProfFiche = {
  pucesEssentiel: string[];
  sectionsDetaillees: { id: string; titre: string; paragraphes: string[] }[];
  motsClesMasques: string[];
  analogie?: { parole: string; concept: string; exemple: string };
};

export type CoursePayload = {
  lessons: ProfLesson[];
  fiche: ProfFiche;
  quiz: ProfQuizItem[];
  flashcards: ProfFlashcard[];
};

export type SchemaPart = {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
};

export function emptyPayload(): CoursePayload {
  return {
    lessons: [{ id: "l1", title: "Leçon 1", duration: "12 min", xp: 50 }],
    fiche: {
      pucesEssentiel: ["Résumé à compléter."],
      sectionsDetaillees: [{ id: "s1", titre: "Savoirs", paragraphes: [""] }],
      motsClesMasques: [],
    },
    quiz: [],
    flashcards: [],
  };
}
