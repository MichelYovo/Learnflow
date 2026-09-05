export const PLAY_URL = process.env.NEXT_PUBLIC_PLAY_URL ?? "";
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "";
export const SUPPORT_EMAIL = "support@learnflow.tg";
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`;
export const WAITLIST_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("LearnFlow — liste d'attente")}&body=${encodeURIComponent("Bonjour,%0A%0AJe veux être prévenu(e) quand LearnFlow est sur les stores.%0A%0AClasse :%0AAndroid / iPhone :%0A")}`;

export const SUBJECTS = [
  { id: "maths", label: "Maths", color: "#1677FF", bg: "#E6F4FF" },
  { id: "svt", label: "SVT", color: "#10B981", bg: "#ECFDF5" },
  { id: "pc", label: "PC", color: "#06B6D4", bg: "#ECFEFF" },
  { id: "hg", label: "HG", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "fr", label: "Français", color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "ang", label: "Anglais", color: "#EF4444", bg: "#FEF2F2" },
  { id: "edhc", label: "EDHC", color: "#F97316", bg: "#FFF7ED" },
] as const;

export const MODES = [
  {
    id: "libre",
    label: "Mode Libre",
    sub: "Assimilation sereine",
    purpose:
      "Pour l'élève calme, à jour : comprendre et approfondir à son rythme, sans pression de temps.",
    hint: "Fiches · Analogies · Schémas SVT",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    spira: "calme",
  },
  {
    id: "guide",
    label: "Mode Guidé",
    sub: "Pilote automatique",
    purpose:
      "Routine quotidienne : Spira ne présente que ce que tu es sur le point d'oublier (algo des J).",
    hint: "Spira · répétition",
    color: "#1677FF",
    bg: "#E6F4FF",
    border: "#BAE0FF",
    spira: "confiant",
  },
  {
    id: "cramming",
    label: "Cramming",
    sub: "Veille de devoir",
    purpose:
      "Une matière, un chapitre : quizz d'assimilation (10 questions) + textes à trous, sans chrono.",
    hint: "Quizz · Trous",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    spira: "determine",
  },
  {
    id: "blitz",
    label: "Blitz 60s",
    sub: "Survive 60s",
    purpose:
      "60 secondes, mix de chapitres. Choisis Facile, Moyen ou Difficile, puis envoie le code défi sur WhatsApp.",
    hint: "Difficulté · WhatsApp",
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FECACA",
    spira: "enerve",
  },
] as const;

export const TIERS = [
  { id: "bronze", label: "Bronze", src: "/badges/bronze.png" },
  { id: "argent", label: "Argent", src: "/badges/silver.png" },
  { id: "or", label: "Or", src: "/badges/gold.png" },
  { id: "platine", label: "Platine", src: "/badges/platinum.png" },
  { id: "diamant", label: "Diamant", src: "/badges/diamond.png" },
] as const;

export const SPIRA_MOODS = [
  { id: "joyeux", label: "Joyeux", role: "Succès, 10/10, Challenger" },
  { id: "calme", label: "Calme", role: "Mode Libre, cours" },
  { id: "confiant", label: "Confiant", role: "Mode Guidé, ligue" },
  { id: "determine", label: "Déterminé", role: "Cramming, veille de devoir" },
  { id: "enerve", label: "Énervé", role: "Blitz 60s" },
  { id: "surpris", label: "Surpris", role: "Découverte, « aha »" },
  { id: "timide", label: "Timide", role: "Profil, contenus verrouillés" },
  { id: "triste", label: "Triste", role: "Erreur, 10/10 raté" },
  { id: "neutre", label: "Neutre", role: "Tuteur IA, attente" },
  { id: "fatigue", label: "Fatigué", role: "Repos Instant T" },
] as const;
