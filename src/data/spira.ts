/**
 * Catalogue Spira — une nature = un rôle dans l'app.
 * Les écrans ne choisissent plus une humeur au hasard : ils déclarent une scène.
 */
import type { AppMode } from "../types/modes";
import type { DifficulteFlash } from "../types/learnflow";

export type SpiraMoodId =
  | "joyeux"
  | "calme"
  | "confiant"
  | "triste"
  | "enerve"
  | "timide"
  | "surpris"
  | "neutre"
  | "determine"
  | "fatigue";

export type SpiraNature = {
  id: SpiraMoodId;
  label: string;
  color: string;
  role: string;
};

/** Identité visuelle + rôle pédagogique de chaque perso. */
export const SPIRA_NATURES: Record<SpiraMoodId, SpiraNature> = {
  joyeux: {
    id: "joyeux",
    label: "Joyeux",
    color: "#F5C518",
    role: "Accueil, succès, célébration (10/10, Challenger, compte prêt).",
  },
  calme: {
    id: "calme",
    label: "Calme",
    color: "#22C55E",
    role: "Mode Libre, cours, splash — assimilation sereine, sans chrono.",
  },
  confiant: {
    id: "confiant",
    label: "Confiant",
    color: "#1677FF",
    role: "Mode Guidé, ligue, analogies — Spira pilote et rassure.",
  },
  triste: {
    id: "triste",
    label: "Triste",
    color: "#7C3AED",
    role: "Échec, mauvaise réponse, 10/10 non validé.",
  },
  enerve: {
    id: "enerve",
    label: "Énervé",
    color: "#EF4444",
    role: "Blitz 60s — survive le chrono, défi ami.",
  },
  timide: {
    id: "timide",
    label: "Timide",
    color: "#EC4899",
    role: "Profil, sas parental, contenus encore verrouillés.",
  },
  surpris: {
    id: "surpris",
    label: "Surpris",
    color: "#22D3EE",
    role: "Première rencontre, découverte, « aha » pédagogique.",
  },
  neutre: {
    id: "neutre",
    label: "Neutre",
    color: "#94A3B8",
    role: "Attente, tuteur IA, états par défaut.",
  },
  determine: {
    id: "determine",
    label: "Déterminé",
    color: "#F59E0B",
    role: "Cramming, maîtrise 10/10, quiz d'assimilation.",
  },
  fatigue: {
    id: "fatigue",
    label: "Fatigué",
    color: "#475569",
    role: "Instant T Repos, quota IA épuisé, après un sprint trop dur.",
  },
};

/** Perso signature de chaque mode — aligné sur la couleur du mode. */
export const SPIRA_FOR_MODE: Record<AppMode, SpiraMoodId> = {
  libre: "calme",
  guide: "confiant",
  cramming: "determine",
  blitz: "enerve",
};

export type SpiraScene =
  | "welcome"
  | "splash"
  | "onboarding.meet"
  | "onboarding.mastery"
  | "onboarding.modes"
  | "onboarding.league"
  | "onboarding.offline"
  | "auth.success"
  | "tab.home"
  | "tab.cours"
  | "tab.ligue"
  | "tab.profil"
  | "hub.quiz"
  | "mode.libre"
  | "mode.guide"
  | "mode.guide.empty"
  | "mode.guide.done"
  | "mode.cramming"
  | "mode.blitz.ready"
  | "mode.blitz.play"
  | "mode.blitz.panic"
  | "mode.blitz.win"
  | "mode.blitz.lose"
  | "course.analogy"
  | "schema"
  | "flash.empty"
  | "flash.done"
  | "quiz.wrong"
  | "quiz.play"
  | "quiz.pass"
  | "quiz.perfect"
  | "quiz.fail"
  | "quiz.locked"
  | "quiz.rest"
  | "tutor.ready"
  | "tutor.exhausted"
  | "parents.gate"
  | "parents.error"
  | "settings.about"
  | "settings.rate";

export type SpiraSceneDef = {
  mood: SpiraMoodId;
  message?: string;
};

export const SPIRA_SCENE: Record<SpiraScene, SpiraSceneDef> = {
  welcome: { mood: "joyeux" },
  splash: { mood: "calme" },
  "onboarding.meet": {
    mood: "surpris",
    message: "Salut ! Moi c'est Spira. Je t'aide à réussir tes examens, à ton rythme.",
  },
  "onboarding.mastery": {
    mood: "determine",
    message: "Ici, tu ne survoles pas. La règle du 10/10 : tu passes seulement quand c'est vraiment acquis.",
  },
  "onboarding.modes": {
    mood: "calme",
    message: "Quatre modes selon le moment : Libre, Guidé, Cramming, ou Blitz 60 secondes.",
  },
  "onboarding.league": {
    mood: "confiant",
    message: "Gagne de l'XP, grimpe ta ligue et défie tes camarades.",
  },
  "onboarding.offline": {
    mood: "neutre",
    message: "Et tout marche même sans réseau. Programme APC Togo, collège et lycée.",
  },
  "auth.success": { mood: "joyeux", message: "Compte prêt — on y va !" },
  "tab.home": { mood: "joyeux" },
  "tab.cours": { mood: "calme" },
  "tab.ligue": { mood: "confiant" },
  "tab.profil": { mood: "timide" },
  "hub.quiz": { mood: "determine" },
  "mode.libre": { mood: "calme" },
  "mode.guide": { mood: "confiant" },
  "mode.guide.empty": { mood: "joyeux", message: "Rien à réviser aujourd'hui. Reviens demain." },
  "mode.guide.done": { mood: "joyeux", message: "Bien joué. À demain." },
  "mode.cramming": { mood: "determine" },
  "mode.blitz.ready": { mood: "enerve" },
  "mode.blitz.play": { mood: "enerve" },
  "mode.blitz.panic": { mood: "enerve" },
  "mode.blitz.win": { mood: "joyeux", message: "Quel sprint !" },
  "mode.blitz.lose": { mood: "fatigue", message: "C'était intense. Réessaie quand tu es prêt." },
  "course.analogy": { mood: "confiant" },
  schema: { mood: "calme" },
  "flash.empty": { mood: "calme", message: "Aucune carte due." },
  "flash.done": { mood: "joyeux", message: "Session terminée." },
  "quiz.wrong": { mood: "triste", message: "Pas tout à fait." },
  "quiz.play": { mood: "determine" },
  "quiz.pass": { mood: "joyeux", message: "10/10. Sprint ou repos ?" },
  "quiz.perfect": { mood: "joyeux", message: "Premier essai parfait — Challenger !" },
  "quiz.fail": { mood: "triste", message: "Pas encore le 10/10." },
  "quiz.locked": { mood: "timide", message: "Valide d'abord le 10/10." },
  "quiz.rest": { mood: "fatigue", message: "1 h de repos." },
  "tutor.ready": { mood: "neutre" },
  "tutor.exhausted": { mood: "fatigue", message: "Quota cloud épuisé." },
  "parents.gate": { mood: "timide" },
  "parents.error": { mood: "triste", message: "Oups, mauvais calcul." },
  "settings.about": { mood: "calme" },
  "settings.rate": { mood: "timide" },
};

export function resolveSpiraScene(scene: SpiraScene): SpiraSceneDef {
  return SPIRA_SCENE[scene];
}

export function spiraMoodForMode(mode: AppMode): SpiraMoodId {
  return SPIRA_FOR_MODE[mode];
}

export function spiraMoodForSession(mode?: string | null): SpiraMoodId {
  const key = (mode ?? "").toLowerCase();
  if (key === "guide" || key === "guidé") return "confiant";
  if (key === "cramming") return "determine";
  if (key === "blitz") return "enerve";
  return "calme";
}

export function spiraForFlashRating(d: DifficulteFlash): SpiraMoodId {
  if (d === "Facile") return "joyeux";
  if (d === "Moyen") return "confiant";
  return "determine";
}

export function spiraForScore(score: number, total: number): SpiraMoodId {
  if (total <= 0) return "neutre";
  if (score === total) return "joyeux";
  if (score >= total / 2) return "confiant";
  return "triste";
}

export function spiraForRatingStars(stars: number): SpiraMoodId {
  if (stars >= 4) return "joyeux";
  if (stars === 3) return "calme";
  if (stars >= 1) return "triste";
  return "timide";
}
