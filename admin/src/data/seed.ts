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
  status?: "actif" | "suspendu" | string;
  createdAt?: string;
};

export const SEED_STUDENTS: AdminStudent[] = [];

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
      { id: "tle-d-vecteurs", title: "Vecteurs de l'espace et repérage", lessons: 1 },
      { id: "tle-d-barycentre", title: "Barycentre de n points pondérés", lessons: 1 },
      { id: "tle-d-scalaire", title: "Produit scalaire", lessons: 1 },
      { id: "tle-d-param", title: "Représentations paramétriques", lessons: 1 },
      { id: "tle-d-systemes", title: "Systèmes d'équations linéaires", lessons: 1 },
      { id: "tle-d-vectoriel", title: "Produit vectoriel", lessons: 1 },
      { id: "tle-d-complexes", title: "Nombres complexes", lessons: 2 },
      { id: "tle-d-similitudes", title: "Similitudes planes", lessons: 1 },
      { id: "tle-d-limites", title: "Limites et continuité", lessons: 1 },
      { id: "tle-d-derivees", title: "Dérivée et étude de fonctions", lessons: 1 },
      { id: "tle-d-primitives", title: "Primitives", lessons: 1 },
      { id: "tle-d-ln", title: "Fonction logarithme népérien", lessons: 1 },
      { id: "tle-d-exp", title: "Fonction exponentielle", lessons: 1 },
      { id: "tle-d-integrales", title: "Calcul intégral", lessons: 1 },
      { id: "tle-d-equadiff", title: "Équations différentielles linéaires", lessons: 1 },
      { id: "tle-d-suites", title: "Suites numériques", lessons: 1 },
      { id: "tle-d-denombrement", title: "Dénombrement", lessons: 1 },
      { id: "tle-d-probas", title: "Probabilités", lessons: 1 },
    ],
  },
  {
    id: "svt",
    label: "SVT",
    color: "#10B981",
    bg: "#ECFDF5",
    chapters: [
      { id: "tle-d-adn", title: "Le matériel génétique et la transmission", lessons: 1 },
      { id: "tle-d-heredite", title: "L'hérédité humaine", lessons: 1 },
      { id: "tle-d-gameto", title: "La gamétogenèse", lessons: 1 },
      { id: "tle-d-fecond", title: "La fécondation et les premières étapes", lessons: 1 },
      { id: "tle-d-sperma", title: "La reproduction chez les spermatophytes", lessons: 1 },
      { id: "tle-d-nerf", title: "Le tissu nerveux et ses propriétés", lessons: 1 },
      { id: "tle-d-muscle", title: "La physiologie du muscle strié", lessons: 1 },
      { id: "tle-d-milieu", title: "La régulation du milieu intérieur", lessons: 1 },
    ],
  },
  {
    id: "pc",
    label: "PC",
    color: "#06B6D4",
    bg: "#ECFEFF",
    chapters: [
      { id: "tle-d-cinematique", title: "Mouvements et équations horaires", lessons: 1 },
      { id: "tle-d-newton", title: "Référentiel galiléen et théorèmes de mécanique", lessons: 1 },
      { id: "tle-d-gravitation", title: "Gravitation et satellites", lessons: 1 },
      { id: "tle-d-champs", title: "Champs uniformes et projectiles", lessons: 1 },
      { id: "tle-d-oscillateurs", title: "Oscillateurs mécaniques", lessons: 1 },
      { id: "tle-d-acide", title: "Acide-base et dosages", lessons: 1 },
      { id: "tle-d-orga", title: "Chimie organique", lessons: 1 },
    ],
  },
  {
    id: "hg",
    label: "Histoire-Géo",
    color: "#F59E0B",
    bg: "#FFFBEB",
    chapters: [
      { id: "tle-d-geo1", title: "Les potentialités de l'économie togolaise", lessons: 1 },
      { id: "tle-d-geo2", title: "Les problèmes du développement de l'économie togolaise", lessons: 1 },
      { id: "tle-d-geo3", title: "Les réformes dans l'économie togolaise", lessons: 1 },
      { id: "tle-d-geo4", title: "Les mécanismes de la mondialisation", lessons: 1 },
      { id: "tle-d-geo5", title: "Conséquences et contestations de la mondialisation", lessons: 1 },
      { id: "tle-d-geo6", title: "Le Togo dans la mondialisation", lessons: 1 },
      { id: "tle-d-geo7", title: "Un modèle de développement : la Corée du Sud", lessons: 1 },
      { id: "tle-d-geo8", title: "Étude d'un pays émergent : l'Afrique du Sud", lessons: 1 },
      { id: "tle-d-onu", title: "L'ONU : naissance, fonctionnement, bilan et perspectives", lessons: 1 },
      { id: "tle-d-bipolaire", title: "Le monde bipolaire (1947–1991)", lessons: 1 },
      { id: "tle-d-apres91", title: "Le monde de 1991 à nos jours", lessons: 1 },
      { id: "tle-d-decolo-afrique", title: "Les facteurs de la décolonisation de l'Afrique", lessons: 1 },
      { id: "tle-d-decolo-togo", title: "La décolonisation du Togo", lessons: 1 },
      { id: "tle-d-togo-politique", title: "L'évolution politique du Togo (1960–2005)", lessons: 1 },
    ],
  },
];
