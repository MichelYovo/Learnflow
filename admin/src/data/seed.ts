export type AdminStudent = {
  id: string;
  name: string;
  email: string;
  classe: string;
  xpTotale: number;
  weeklyXp: number;
  streak: number;
  lessonsDone: number;
  leagueTier: string;
  color: string;
  bg: string;
  platform?: "web" | "mobile" | string;
  parentPhone?: string;
};

export const SEED_STUDENTS: AdminStudent[] = [
  { id: "1", name: "Kofi Adjei", email: "kofi@learnflow.tg", classe: "3eme", xpTotale: 2840, weeklyXp: 2840, streak: 5, lessonsDone: 34, leagueTier: "Or", color: "#1677FF", bg: "#E6F4FF" },
  { id: "2", name: "Ama Kofi", email: "ama@learnflow.tg", classe: "Tle", xpTotale: 3120, weeklyXp: 2100, streak: 7, lessonsDone: 22, leagueTier: "Platine", color: "#10B981", bg: "#ECFDF5" },
  { id: "3", name: "Ama Mensah", email: "ama.mensah@learnflow.tg", classe: "1ere", xpTotale: 4210, weeklyXp: 4210, streak: 12, lessonsDone: 48, leagueTier: "Diamant", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "4", name: "Kwame Asante", email: "kwame@learnflow.tg", classe: "Tle", xpTotale: 3940, weeklyXp: 3940, streak: 8, lessonsDone: 41, leagueTier: "Diamant", color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "5", name: "Efua Boateng", email: "efua@learnflow.tg", classe: "3eme", xpTotale: 2720, weeklyXp: 2720, streak: 7, lessonsDone: 31, leagueTier: "Or", color: "#10B981", bg: "#ECFDF5" },
  { id: "6", name: "Yaw Darko", email: "yaw@learnflow.tg", classe: "4eme", xpTotale: 2490, weeklyXp: 2490, streak: 3, lessonsDone: 28, leagueTier: "Argent", color: "#EF4444", bg: "#FEF2F2" },
  { id: "7", name: "Akua Owusu", email: "akua@learnflow.tg", classe: "2nde", xpTotale: 2180, weeklyXp: 2180, streak: 6, lessonsDone: 24, leagueTier: "Argent", color: "#06B6D4", bg: "#ECFEFF" },
  { id: "8", name: "Kojo Asante", email: "kojo@learnflow.tg", classe: "5eme", xpTotale: 1950, weeklyXp: 1950, streak: 2, lessonsDone: 19, leagueTier: "Bronze", color: "#F97316", bg: "#FFF7ED" },
  { id: "9", name: "Adwoa Mensah", email: "adwoa@learnflow.tg", classe: "6eme", xpTotale: 1740, weeklyXp: 1740, streak: 4, lessonsDone: 16, leagueTier: "Bronze", color: "#EC4899", bg: "#FDF2F8" },
  { id: "10", name: "Nana Addo", email: "nana@learnflow.tg", classe: "1ere", xpTotale: 1680, weeklyXp: 1680, streak: 1, lessonsDone: 15, leagueTier: "Bronze", color: "#6366F1", bg: "#EEF2FF" },
  { id: "11", name: "Abena Serwaa", email: "abena@learnflow.tg", classe: "3eme", xpTotale: 1620, weeklyXp: 1620, streak: 9, lessonsDone: 21, leagueTier: "Argent", color: "#14B8A6", bg: "#F0FDFA" },
  { id: "12", name: "Fiifi Mensah", email: "fiifi@learnflow.tg", classe: "Tle", xpTotale: 1540, weeklyXp: 1540, streak: 5, lessonsDone: 18, leagueTier: "Or", color: "#F43F5E", bg: "#FFF1F2" },
];

export const SEED_LEAGUES = SEED_STUDENTS.map((s, i) => ({
  studentId: s.id,
  name: s.name,
  tier: s.leagueTier,
  weeklyXp: s.weeklyXp,
  rank: i + 1,
}));

export type ProgrammeChapter = {
  id: string;
  title: string;
  lessons: number;
};

export type ProgrammeSubject = {
  id: string;
  label: string;
  color: string;
  bg: string;
  chapters: ProgrammeChapter[];
};

export const PROGRAMME_3EME: ProgrammeSubject[] = [
  {
    id: "maths",
    label: "Mathématiques",
    color: "#1677FF",
    bg: "#E6F4FF",
    chapters: [
      { id: "c1", title: "Calcul littéral et identités remarquables", lessons: 4 },
      { id: "eq2", title: "Équations du 2nd degré", lessons: 5 },
      { id: "thales", title: "Théorème de Thalès", lessons: 3 },
      { id: "trigo", title: "Trigonométrie dans le triangle rectangle", lessons: 2 },
      { id: "stats", title: "Statistiques descriptives", lessons: 2 },
    ],
  },
  {
    id: "svt",
    label: "SVT",
    color: "#10B981",
    bg: "#ECFDF5",
    chapters: [
      { id: "geo-tg", title: "Les formations géologiques du Togo", lessons: 3 },
      { id: "nerf", title: "La commande nerveuse du mouvement", lessons: 3 },
      { id: "oeil", title: "L'œil et la vision", lessons: 3 },
      { id: "immunite", title: "L'immunité", lessons: 3 },
      { id: "digest", title: "La digestion", lessons: 3 },
      { id: "circulation", title: "La circulation sanguine", lessons: 3 },
      { id: "respiration", title: "La respiration", lessons: 2 },
      { id: "excretion", title: "L'excrétion", lessons: 3 },
      { id: "repro", title: "Reproduction humaine", lessons: 2 },
      { id: "adn", title: "Le support des caractères héréditaires : ADN", lessons: 3 },
    ],
  },
  {
    id: "pc",
    label: "PCT",
    color: "#06B6D4",
    bg: "#ECFEFF",
    chapters: [
      { id: "lentilles", title: "Lentilles minces", lessons: 3 },
      { id: "force", title: "Notions de force, travail et puissance", lessons: 3 },
      { id: "ohm", title: "Résistance électrique et loi d'Ohm", lessons: 3 },
      { id: "acide", title: "Solutions acides et basiques", lessons: 2 },
    ],
  },
  {
    id: "hg",
    label: "Histoire-Géo",
    color: "#F59E0B",
    bg: "#FFFBEB",
    chapters: [
      { id: "colo", title: "La colonisation et la résistance africaine", lessons: 3 },
      { id: "indep", title: "Les indépendances africaines et le Togo", lessons: 3 },
      { id: "geo", title: "Géographie physique du Togo", lessons: 2 },
    ],
  },
  {
    id: "fr",
    label: "Français",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    chapters: [
      { id: "phrase", title: "La phrase complexe", lessons: 3 },
      { id: "temps", title: "Les temps du discours et du récit", lessons: 3 },
      { id: "lit", title: "Roman et poésie d'Afrique noire", lessons: 2 },
    ],
  },
  {
    id: "ang",
    label: "Anglais",
    color: "#EF4444",
    bg: "#FEF2F2",
    chapters: [
      { id: "tenses", title: "Tenses and Aspect", lessons: 3 },
      { id: "modals", title: "Modal Verbs and Conditionals", lessons: 2 },
    ],
  },
  {
    id: "edhc",
    label: "ECM",
    color: "#F97316",
    bg: "#FFF7ED",
    chapters: [
      { id: "droits", title: "Les droits fondamentaux", lessons: 3 },
      { id: "institutions", title: "Institutions de la République togolaise", lessons: 2 },
    ],
  },
];

export const PROGRAMME_TLE: ProgrammeSubject[] = [
  {
    id: "maths",
    label: "Mathématiques",
    color: "#1677FF",
    bg: "#E6F4FF",
    chapters: [
      { id: "vecteurs", title: "Vecteurs de l'espace et repérage", lessons: 3 },
      { id: "complexes", title: "Nombres complexes", lessons: 3 },
      { id: "limites", title: "Limites et continuité", lessons: 2 },
      { id: "derivees", title: "Dérivées et primitives", lessons: 3 },
      { id: "ln", title: "Fonction logarithme népérien", lessons: 3 },
      { id: "probas", title: "Probabilités conditionnelles", lessons: 2 },
    ],
  },
  {
    id: "svt",
    label: "SVT",
    color: "#10B981",
    bg: "#ECFDF5",
    chapters: [
      { id: "meiose", title: "Reproduction sexuée et méiose", lessons: 3 },
      { id: "brassage", title: "Brassage génétique et ADN", lessons: 3 },
      { id: "immunite-tle", title: "Soi, non-soi et réponse immunitaire", lessons: 3 },
      { id: "neurones", title: "Fonctionnement des neurones", lessons: 4 },
      { id: "regulation", title: "Régulation de la glycémie et de la pression artérielle", lessons: 3 },
      { id: "evolution", title: "Mécanismes de l'évolution et lignée humaine", lessons: 2 },
    ],
  },
  {
    id: "pc",
    label: "PCT",
    color: "#06B6D4",
    bg: "#ECFEFF",
    chapters: [
      { id: "mvt", title: "Mouvements et équations horaires", lessons: 3 },
      { id: "dosages", title: "Acide-base et dosages", lessons: 2 },
      { id: "orga", title: "Chimie organique", lessons: 2 },
    ],
  },
  {
    id: "fr",
    label: "Français",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    chapters: [
      { id: "argumenter", title: "Convaincre, persuader, délibérer", lessons: 2 },
      { id: "lit-tle", title: "Roman et essai d'Afrique", lessons: 2 },
    ],
  },
  {
    id: "ang",
    label: "Anglais",
    color: "#EF4444",
    bg: "#FEF2F2",
    chapters: [
      { id: "tenses-tle", title: "Advanced tenses and aspect", lessons: 2 },
      { id: "essay", title: "Essay and comprehension", lessons: 2 },
    ],
  },
];
