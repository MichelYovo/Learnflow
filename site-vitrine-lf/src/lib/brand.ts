export const WEB_URL =
  (process.env.NEXT_PUBLIC_WEB_URL ?? process.env.NEXT_PUBLIC_LEARNFLOW_WEB_URL ?? "https://learnflow-web.vercel.app").replace(
    /\/$/,
    "",
  );

export const SUBJECTS = [
  { id: "maths", label: "Maths", color: "#1677FF", bg: "#E6F4FF" },
  { id: "svt", label: "SVT", color: "#10B981", bg: "#ECFDF5" },
  { id: "pc", label: "PCT / PC", color: "#06B6D4", bg: "#ECFEFF" },
  { id: "hg", label: "HG", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "fr", label: "Français", color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "ang", label: "Anglais", color: "#EF4444", bg: "#FEF2F2" },
  { id: "edhc", label: "ECM", color: "#F97316", bg: "#FFF7ED" },
  { id: "philo", label: "Philo", color: "#6366F1", bg: "#EEF2FF" },
] as const;

export const MODES = [
  {
    id: "libre",
    label: "Mode Libre",
    sub: "Tu as le temps",
    purpose:
      "Tu lis à ton rythme, sans chrono. Idéal le soir, le week-end, ou quand tu veux vraiment comprendre un chapitre.",
    hint: "Cours · Schémas · Pas de stress",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  {
    id: "guide",
    label: "Mode Guidé",
    sub: "Tu ne sais pas par où commencer",
    purpose:
      "L’app te propose ce qu’il faut réviser aujourd’hui — surtout ce que tu risques d’oublier. Tu suis, c’est tout.",
    hint: "Une petite routine chaque jour",
    color: "#1677FF",
    bg: "#E6F4FF",
    border: "#BAE0FF",
  },
  {
    id: "cramming",
    label: "Cramming",
    sub: "Devoir demain",
    purpose:
      "Un chapitre, des quiz, des textes à trous. Pas de chrono : tu te concentres jusqu’à tout retenir.",
    hint: "Quiz · Mots manquants",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  {
    id: "blitz",
    label: "Blitz 60s",
    sub: "Un défi rapide",
    purpose:
      "60 secondes, questions mêlées. Tout seul, ou Duel Blitz : tu invites un ami dans la même arène, en même temps.",
    hint: "Solo · ou Duel Blitz",
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
] as const;

export const TIERS = [
  { id: "bronze", label: "Bronze", src: "/badges/bronze.png" },
  { id: "argent", label: "Argent", src: "/badges/silver.png" },
  { id: "or", label: "Or", src: "/badges/gold.png" },
  { id: "platine", label: "Platine", src: "/badges/platinum.png" },
  { id: "diamant", label: "Diamant", src: "/badges/diamond.png" },
] as const;
