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

export type ProfSituation = {
  recit: string;
  question: string;
  competenceVisee: string;
};

export type ProfExempleResolu = {
  enonce: string;
  etapes: { titre: string; texte: string }[];
  reponseFinale: string;
};

export type ProfFiche = {
  essentialText?: string;
  detailedText?: string;
  pucesEssentiel: string[];
  sectionsDetaillees: { id: string; titre: string; paragraphes: string[] }[];
  motsClesMasques: string[];
  analogie?: { parole: string; concept: string; exemple: string };
  situationProbleme?: ProfSituation;
  exempleResolu?: ProfExempleResolu;
  miniQuiz?: ProfQuizItem[];
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

function emptyMiniQuiz(): ProfQuizItem[] {
  return [
    {
      id: "mini-1",
      enonceQuestion: "",
      optionsProposees: ["", "", "", ""],
      indexReponseCorrecte: 0,
      explicationPedagogique: "",
    },
    {
      id: "mini-2",
      enonceQuestion: "",
      optionsProposees: ["", "", "", ""],
      indexReponseCorrecte: 0,
      explicationPedagogique: "",
    },
  ];
}

export function emptyPayload(): CoursePayload {
  return {
    lessons: [{ id: "l1", title: "Leçon 1", duration: "12 min", xp: 50 }],
    fiche: {
      pucesEssentiel: ["Résumé à compléter."],
      essentialText: "Fiche réflexe à compléter (max ~5 min). Place les [mots-clés] entre crochets : formules, définitions.",
      detailedText:
        "Savoirs et savoir-faire à rédiger ici. Ce texte n'est pas une version allongée de la fiche réflexe : c'est le cours développé.",
      sectionsDetaillees: [{ id: "s1", titre: "Savoirs", paragraphes: [""] }],
      motsClesMasques: [],
      situationProbleme: {
        recit: "Exemple concret du quotidien pour ancrer la compétence.",
        question: "Quelle méthode du cours permet de résoudre cette situation ?",
        competenceVisee: "Compétence visée (APC) à formuler.",
      },
      exempleResolu: {
        enonce: "Énoncé d'un exercice type.",
        etapes: [
          { titre: "Étape 1", texte: "Identifier les données." },
          { titre: "Étape 2", texte: "Appliquer la méthode." },
        ],
        reponseFinale: "Réponse et contrôle.",
      },
      miniQuiz: emptyMiniQuiz(),
    },
    quiz: [],
    flashcards: [],
  };
}
