import { emptyPayload, type CoursePayload, type ProfQuizItem } from "./contentTypes";

function asQuizItem(row: Record<string, unknown>, i: number, prefix: string): ProfQuizItem {
  const options = Array.isArray(row.optionsProposees)
    ? row.optionsProposees.map((x) => String(x))
    : ["A", "B", "C", "D"];
  return {
    id: String(row.id || `${prefix}${i + 1}`),
    enonceQuestion: String(row.enonceQuestion || ""),
    optionsProposees: options.slice(0, 6),
    indexReponseCorrecte: Math.min(options.length - 1, Math.max(0, Number(row.indexReponseCorrecte) || 0)),
    explicationPedagogique: String(row.explicationPedagogique || ""),
  };
}

function asSituation(raw: unknown) {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const recit = String(o.recit || "").trim();
  const question = String(o.question || "").trim();
  const competenceVisee = String(o.competenceVisee || "").trim();
  if (!recit && !question && !competenceVisee) return undefined;
  return { recit, question, competenceVisee };
}

function asExemple(raw: unknown) {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const enonce = String(o.enonce || "").trim();
  const reponseFinale = String(o.reponseFinale || "").trim();
  const etapes = Array.isArray(o.etapes)
    ? o.etapes.map((step, i) => {
        const row = (step ?? {}) as Record<string, unknown>;
        return {
          titre: String(row.titre || `Étape ${i + 1}`),
          texte: String(row.texte || ""),
        };
      }).filter((s) => s.texte.trim())
    : [];
  if (!enonce && etapes.length === 0 && !reponseFinale) return undefined;
  return { enonce, etapes, reponseFinale };
}

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
    ? o.quiz.map((q, i) => asQuizItem((q ?? {}) as Record<string, unknown>, i, "q"))
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
  const miniQuizRaw = Array.isArray(ficheIn.miniQuiz)
    ? ficheIn.miniQuiz.map((q, i) => asQuizItem((q ?? {}) as Record<string, unknown>, i, "mini-"))
    : [];
  const miniQuiz = miniQuizRaw.length
    ? [...miniQuizRaw, ...(base.fiche.miniQuiz ?? [])].slice(0, 2)
    : base.fiche.miniQuiz;
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
      situationProbleme: asSituation(ficheIn.situationProbleme) ?? base.fiche.situationProbleme,
      exempleResolu: asExemple(ficheIn.exempleResolu) ?? base.fiche.exempleResolu,
      miniQuiz,
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
    "essentialText": string (FICHE RÉFLEXE autonome, lecture mobile < 5 min / < 300 mots : formules encadrées, définitions clés, puces, [mots] à masquer — JAMAIS une troncature de detailedText),
    "situationProbleme": {
      "recit": string (exemple concret du quotidien togolais / scolaire pour ancrer la compétence),
      "question": string (question déclencheur),
      "competenceVisee": string (compétence APC visée)
    },
    "detailedText": string (savoirs + savoir-faire développés, lecture continue, SANS crochets de masquage, SANS recopier la situation ni l'exemple résolu),
    "pucesEssentiel": string[] (compat, 6 à 10 puces),
    "sectionsDetaillees": [{"id":"s1","titre":string,"paragraphes":string[]}] (Savoirs, Savoir-faire — pas de section Exemple ni Compétence si déjà dans situationProbleme),
    "motsClesMasques": string[],
    "analogie": {"parole":string,"concept":string,"exemple":string},
    "exempleResolu": {
      "enonce": string (exercice type du programme),
      "etapes": [{"titre":string,"texte":string}] (méthode pas à pas, 3 à 5 étapes),
      "reponseFinale": string (réponse + contrôle)
    },
    "miniQuiz": [{"id":"mini-1","enonceQuestion":string,"optionsProposees":[4 strings],"indexReponseCorrecte":0,"explicationPedagogique":string}] (EXACTEMENT 2 QCM formatifs, distincts du quiz d'assimilation)
  },
  "quiz": [{"id":"q1","enonceQuestion":string,"optionsProposees":[4 strings],"indexReponseCorrecte":0,"explicationPedagogique":string}] (10 questions d'assimilation),
  "flashcards": [{"recto":string,"verso":string}] (8 cartes)
}
Langue : français simple. Niveau adapté à la classe.`;
