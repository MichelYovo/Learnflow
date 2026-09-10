/**
 * Modes d'apprentissage LearnFlow (CDC + maquette Figma).
 * Stack : Next.js · React · TypeScript · Zustand
 */

import type { OutilRevisionId } from "./learnflow";

/** Identifiants stables des 4 modes de travail (grille Accueil). */
export type AppMode = "libre" | "guide" | "cramming" | "blitz";

/**
 * État fonctionnel / visuel d'une carte mode :
 * - available  → cliquable, prêt à lancer
 * - selected   → mode actuellement choisi (bordure accentuée)
 * - inactive   → grisé, non cliquable (ex. Mode Guidé sans cartes dues)
 * - locked     → verrouillé (prérequis non atteints)
 */
export type ModeCardStatus = "available" | "selected" | "inactive" | "locked";

export interface ModeDefinition {
  id: AppMode;
  /** Libellé affiché sur la carte */
  label: string;
  /** Sous-titre court */
  sub: string;
  /** Rôle pédagogique (commentaire produit / CDC) */
  purpose: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  /** Badge optionnel sous le sous-titre (ex. WhatsApp, Répétition) */
  hint?: string;
  hintIcon?: string;
}

/**
 * Catalogue des modes — source unique pour UI + logique.
 *
 * libre     : assimilation sereine, sans chrono, fiches + analogies ; schémas 2D/3D en SVT.
 * guide     : Spira pilote l'algo des J (cartes dues aujourd'hui).
 * cramming  : veille de devoir, un chapitre, quizz 10Q + textes à trous.
 * blitz     : arène 60s, mix multi-chapitres + code défi WhatsApp.
 */
export const MODE_DEFINITIONS: ModeDefinition[] = [
  {
    id: "libre",
    label: "Mode Libre",
    sub: "Assimilation sereine",
    purpose:
      "Pour l'élève calme, à jour : comprendre et approfondir à son rythme, sans pression de temps.",
    icon: "feather",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    hint: "Fiches · Analogies · Schémas SVT",
    hintIcon: "layers",
  },
  {
    id: "guide",
    label: "Mode Guidé",
    sub: "Pilote automatique",
    purpose:
      "Routine quotidienne : Spira ne présente que ce que tu es sur le point d'oublier (algo des J).",
    icon: "brain",
    color: "#1677FF",
    bg: "#E6F4FF",
    border: "#BAE0FF",
    hint: "Spira · répétition",
    hintIcon: "refresh-cw",
  },
  {
    id: "cramming",
    label: "Cramming",
    sub: "Veille de devoir",
    purpose:
      "Une matière, un chapitre : quizz d'assimilation (10 questions) + textes à trous, sans chrono.",
    icon: "coffee",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    hint: "Quizz · Trous",
    hintIcon: "quiz",
  },
  {
    id: "blitz",
    label: "Blitz 60s",
    sub: "Survive 60s",
    purpose:
      "60 secondes chrono, mix de chapitres. Envoie un code duel sur WhatsApp : ton ami joue exactement la même série.",
    icon: "timer",
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FECACA",
    hint: "Duel · code WhatsApp",
    hintIcon: undefined,
  },
];

/** Outils recommandés par défaut (CDC) — appliqués au lancement du mode. */
export const MODE_DEFAULT_TOOLS: Record<AppMode, OutilRevisionId[]> = {
  libre: ["fiche", "flashcards", "schema"],
  guide: ["flashcards"],
  cramming: ["qcm", "trous"],
  blitz: ["qcm"],
};

/** Mapping AppMode → ModeApprentissage (navigation / sessions). */
export function appModeToSessionMode(mode: AppMode): "Libre" | "Guide" | "Cramming" | "Blitz" {
  const map = {
    libre: "Libre",
    guide: "Guide",
    cramming: "Cramming",
    blitz: "Blitz",
  } as const;
  return map[mode];
}
