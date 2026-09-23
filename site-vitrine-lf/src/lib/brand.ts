export const WEB_URL =
  (process.env.NEXT_PUBLIC_WEB_URL ?? process.env.NEXT_PUBLIC_LEARNFLOW_WEB_URL ?? "https://learnflow-web.vercel.app").replace(
    /\/$/,
    "",
  );

/** Matières : même accent marque, pas de palette arc-en-ciel sur la vitrine. */
export const SUBJECTS = [
  { id: "maths", label: "Maths" },
  { id: "svt", label: "SVT" },
  { id: "pc", label: "PCT / PC" },
  { id: "hg", label: "HG" },
  { id: "fr", label: "Français" },
  { id: "ang", label: "Anglais" },
  { id: "edhc", label: "ECM" },
  { id: "philo", label: "Philo" },
] as const;

export const MODES = [
  {
    id: "libre",
    label: "Mode Libre",
    sub: "Tu as le temps",
    purpose:
      "Tu lis à ton rythme, sans chrono. Idéal le soir, le week-end, ou quand tu veux vraiment comprendre un chapitre.",
    hint: "Cours · Schémas · Pas de stress",
  },
  {
    id: "guide",
    label: "Mode Guidé",
    sub: "Tu ne sais pas par où commencer",
    purpose:
      "L’app te propose ce qu’il faut réviser aujourd’hui — surtout ce que tu risques d’oublier. Tu suis, c’est tout.",
    hint: "Une petite routine chaque jour",
  },
  {
    id: "cramming",
    label: "Cramming",
    sub: "Devoir demain",
    purpose:
      "Un chapitre, des quiz, des textes à trous. Pas de chrono : tu te concentres jusqu’à tout retenir.",
    hint: "Quiz · Mots manquants",
  },
  {
    id: "blitz",
    label: "Blitz 60s",
    sub: "Un défi rapide",
    purpose:
      "60 secondes, questions mêlées. Tout seul, ou Duel Blitz : tu invites un ami dans la même arène, en même temps.",
    hint: "Solo · ou Duel Blitz",
  },
] as const;

export const TIERS = [
  { id: "bronze", label: "Bronze", src: "/badges/bronze.png" },
  { id: "argent", label: "Argent", src: "/badges/silver.png" },
  { id: "or", label: "Or", src: "/badges/gold.png" },
  { id: "platine", label: "Platine", src: "/badges/platinum.png" },
  { id: "diamant", label: "Diamant", src: "/badges/diamond.png" },
] as const;
