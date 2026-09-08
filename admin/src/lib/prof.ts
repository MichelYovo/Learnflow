import { emptyPayload, type CoursePayload } from "./contentTypes";

export function normalizePayload(raw: unknown): CoursePayload {
  const base = emptyPayload();
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;
  const lessons = Array.isArray(o.lessons)
    ? o.lessons.map((l, i) => {
        const row = (l ?? {}) as Record<string, unknown>;
        return {
          id: String(row.id || `l${i + 1}`),
          title: String(row.title || `Leçon ${i + 1}`),
          duration: String(row.duration || "12 min"),
          xp: Number(row.xp) || 50,
        };
      })
    : base.lessons;
  const ficheIn = (o.fiche ?? {}) as Record<string, unknown>;
  const quiz = Array.isArray(o.quiz)
    ? o.quiz.map((q, i) => {
        const row = (q ?? {}) as Record<string, unknown>;
        const options = Array.isArray(row.optionsProposees)
          ? row.optionsProposees.map((x) => String(x))
          : ["A", "B", "C", "D"];
        return {
          id: String(row.id || `q${i + 1}`),
          enonceQuestion: String(row.enonceQuestion || ""),
          optionsProposees: options.slice(0, 6),
          indexReponseCorrecte: Math.min(options.length - 1, Math.max(0, Number(row.indexReponseCorrecte) || 0)),
          explicationPedagogique: String(row.explicationPedagogique || ""),
        };
      })
    : [];
  const flashcards = Array.isArray(o.flashcards)
    ? o.flashcards.map((f) => {
        const row = (f ?? {}) as Record<string, unknown>;
        return { recto: String(row.recto || ""), verso: String(row.verso || "") };
      })
    : [];
  const analogie = ficheIn.analogie && typeof ficheIn.analogie === "object" ? (ficheIn.analogie as Record<string, string>) : undefined;
  const pucesEssentiel = Array.isArray(ficheIn.pucesEssentiel)
    ? ficheIn.pucesEssentiel.map(String)
    : base.fiche.pucesEssentiel;
  const sectionsDetaillees = Array.isArray(ficheIn.sectionsDetaillees)
    ? ficheIn.sectionsDetaillees.map((s, i) => {
        const row = (s ?? {}) as Record<string, unknown>;
        return {
          id: String(row.id || `s${i + 1}`),
          titre: String(row.titre || "Section"),
          paragraphes: Array.isArray(row.paragraphes) ? row.paragraphes.map(String) : [""],
        };
      })
    : base.fiche.sectionsDetaillees;
  const essentialText =
    typeof ficheIn.essentialText === "string" && ficheIn.essentialText.trim()
      ? ficheIn.essentialText
      : pucesEssentiel.join("\n\n");
  const detailedText =
    typeof ficheIn.detailedText === "string" && ficheIn.detailedText.trim()
      ? ficheIn.detailedText
      : sectionsDetaillees.map((s) => `${s.titre}\n\n${s.paragraphes.join("\n\n")}`).join("\n\n");
  return {
    lessons: lessons.length ? lessons : base.lessons,
    fiche: {
      essentialText,
      detailedText,
      pucesEssentiel,
      sectionsDetaillees,
      motsClesMasques: Array.isArray(ficheIn.motsClesMasques) ? ficheIn.motsClesMasques.map(String) : [],
      analogie: analogie
        ? {
            parole: String(analogie.parole || ""),
            concept: String(analogie.concept || ""),
            exemple: String(analogie.exemple || ""),
          }
        : undefined,
    },
    quiz,
    flashcards,
  };
}

export const PROF_SYSTEM = `Tu es Prof, pédagogue APC Togo pour LearnFlow (collège/lycée).
Collège (6e–3e) : PCT = Physique-Chimie-Technologie. Lycée (2nde–Tle) : PC = Physique-Chimie, plus Philosophie. Pas de technologie au lycée.
Réponds UNIQUEMENT en JSON valide, clés :
{
  "chapter_title": string,
  "lessons": [{"id":"l1","title":string,"duration":"12 min","xp":50}],
  "fiche": {
    "essentialText": string (synthèse < 300 mots, autonome, puces, [mots] à masquer — JAMAIS une troncature de detailedText),
    "detailedText": string (cours APC complet, lecture continue, sans crochets de masquage),
    "pucesEssentiel": string[] (compat, 6 à 10 puces),
    "sectionsDetaillees": [{"id":"s1","titre":string,"paragraphes":string[]}],
    "motsClesMasques": string[],
    "analogie": {"parole":string,"concept":string,"exemple":string}
  },
  "quiz": [{"id":"q1","enonceQuestion":string,"optionsProposees":[4 strings],"indexReponseCorrecte":0,"explicationPedagogique":string}] (10 questions),
  "flashcards": [{"recto":string,"verso":string}] (8 cartes)
}
Langue : français simple. Niveau adapté à la classe.`;
