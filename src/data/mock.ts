import type {
  QCMData,
  FlashcardData,
  ParentNote,
  ClasseAPC,
  AgendaSession,
  SchoolClass,
  SubjectShortcut,
  LigueNom,
  InboxNotification,
} from "../types/learnflow";

export const CLASSES: { id: ClasseAPC; label: string }[] = [
  { id: "6eme", label: "6ème" },
  { id: "5eme", label: "5ème" },
  { id: "4eme", label: "4ème" },
  { id: "3eme", label: "3ème" },
  { id: "2nde", label: "2nde" },
  { id: "1ere", label: "1ère" },
  { id: "Tle", label: "Tle D" },
];

export function classLabel(id: string) {
  return CLASSES.find((c) => c.id === id)?.label ?? id;
}

export const PROFILE_COLORS = [
  { color: "#1677FF", bg: "#E6F4FF" },
  { color: "#10B981", bg: "#ECFDF5" },
  { color: "#8B5CF6", bg: "#F5F3FF" },
  { color: "#F59E0B", bg: "#FFFBEB" },
  { color: "#EF4444", bg: "#FEF2F2" },
  { color: "#06B6D4", bg: "#ECFEFF" },
];

export const AGENDA_MODE_CONFIG = {
  libre: { label: "Mode Libre", color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
  guide: { label: "Mode Guidé", color: "#1677FF", bg: "#E6F4FF", border: "#BAE0FF" },
  cramming: { label: "Cramming", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  blitz: { label: "Blitz", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
} as const;

const TODAY_IDX = (new Date().getDay() + 6) % 7;

export const INITIAL_INBOX: InboxNotification[] = [
  {
    id: "n-study-1",
    kind: "study",
    title: "Séance dans 15 min",
    body: "Maths — Mode Guidé à 18:00. Ta séance t'attend.",
    createdAt: new Date(Date.now() - 8 * 60_000).toISOString(),
    read: false,
  },
  {
    id: "n-streak-1",
    kind: "streak",
    title: "Série en danger",
    body: "Il te reste encore un peu de temps pour garder ta série du jour.",
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    read: false,
  },
  {
    id: "n-league-1",
    kind: "league",
    title: "Ligue Or · rang #3",
    body: "Tu es 3e du groupe 12. Continue pour viser Platine.",
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    read: true,
  },
];

export const INITIAL_AGENDA: AgendaSession[] = [
  { id: "1", subject: "Maths", subjectColor: "#1677FF", subjectBg: "#E6F4FF", mode: "guide", day: TODAY_IDX, hour: 18, minute: 0, duration: 45, reminderMin: 15 },
  { id: "2", subject: "SVT", subjectColor: "#10B981", subjectBg: "#ECFDF5", mode: "libre", day: TODAY_IDX, hour: 19, minute: 30, duration: 30, reminderMin: 15 },
  { id: "3", subject: "Physique-Chimie", subjectColor: "#06B6D4", subjectBg: "#ECFEFF", mode: "cramming", day: (TODAY_IDX + 1) % 7, hour: 17, minute: 0, duration: 60, reminderMin: 30 },
];

export const INITIAL_TIMETABLE: SchoolClass[] = [
  { id: "t1", subject: "Mathématiques", subjectColor: "#1677FF", subjectBg: "#E6F4FF", day: 0, startHour: 8, startMinute: 0, endHour: 9, endMinute: 0, teacher: "M. Kokou", room: "Salle 12" },
  { id: "t2", subject: "Français", subjectColor: "#8B5CF6", subjectBg: "#F5F3FF", day: 0, startHour: 9, startMinute: 0, endHour: 10, endMinute: 0, teacher: "Mme Afua", room: "Salle 8" },
  { id: "t3", subject: "SVT", subjectColor: "#10B981", subjectBg: "#ECFDF5", day: 0, startHour: 10, startMinute: 30, endHour: 12, endMinute: 0, teacher: "M. Komlan", room: "Salle 5" },
  { id: "t4", subject: "Anglais", subjectColor: "#EF4444", subjectBg: "#FEF2F2", day: 1, startHour: 8, startMinute: 0, endHour: 9, endMinute: 0, teacher: "Mme Grace", room: "Salle 3" },
  { id: "t5", subject: "Mathématiques", subjectColor: "#1677FF", subjectBg: "#E6F4FF", day: 1, startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, teacher: "M. Kokou", room: "Salle 12" },
  { id: "t6", subject: "Histoire-Géo", subjectColor: "#F59E0B", subjectBg: "#FFFBEB", day: 2, startHour: 8, startMinute: 0, endHour: 9, endMinute: 0, teacher: "M. Edem", room: "Salle 10" },
  { id: "t7", subject: "Physique-Chimie", subjectColor: "#06B6D4", subjectBg: "#ECFEFF", day: 2, startHour: 9, startMinute: 0, endHour: 10, endMinute: 30, teacher: "Mme Esso", room: "Labo 2" },
  { id: "t8", subject: "SVT", subjectColor: "#10B981", subjectBg: "#ECFDF5", day: 3, startHour: 8, startMinute: 0, endHour: 9, endMinute: 30, teacher: "M. Komlan", room: "Salle 5" },
  { id: "t9", subject: "Français", subjectColor: "#8B5CF6", subjectBg: "#F5F3FF", day: 4, startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, teacher: "Mme Afua", room: "Salle 8" },
  { id: "t10", subject: "EDHC", subjectColor: "#F97316", subjectBg: "#FFF7ED", day: 4, startHour: 11, startMinute: 0, endHour: 12, endMinute: 0, teacher: "M. Senam", room: "Salle 1" },
];

export const SUBJECTS = [
  { id: "maths", abbrev: "Maths", name: "Mathématiques", icon: "calculator" as const, color: "#1677FF", bg: "#E6F4FF", border: "#BAE0FF", done: 12, total: 32 },
  { id: "pc", abbrev: "PC", name: "Physique-Chimie", icon: "atom" as const, color: "#06B6D4", bg: "#ECFEFF", border: "#A5F3FC", done: 5, total: 24 },
  { id: "svt", abbrev: "SVT", name: "SVT", icon: "microscope" as const, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", done: 8, total: 20 },
  { id: "hg", abbrev: "H-G", name: "Histoire-Géo", icon: "globe" as const, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", done: 6, total: 18 },
  { id: "fr", abbrev: "Français", name: "Français", icon: "quill" as const, color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE", done: 9, total: 22 },
  { id: "ang", abbrev: "Anglais", name: "Anglais", icon: "chatbubble" as const, color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", done: 4, total: 16 },
  { id: "edhc", abbrev: "EDHC", name: "EDHC", icon: "heart" as const, color: "#F97316", bg: "#FFF7ED", border: "#FED7AA", done: 2, total: 12 },
];

const SHORTCUT_ICONS: Record<string, string> = {
  maths: "calculator",
  pc: "atom",
  svt: "microscope",
  hg: "globe",
  fr: "quill",
  ang: "chatbubble",
  edhc: "heart",
};

/** Raccourcis Accueil — 5 premières visibles, le reste via « Voir tout » */
export const SUBJECT_SHORTCUTS: SubjectShortcut[] = SUBJECTS.map((s) => ({
  id: s.id,
  name: s.abbrev,
  fullName: s.name,
  progress: Math.round((s.done / s.total) * 100),
  icon: SHORTCUT_ICONS[s.id] ?? s.icon,
  colorScheme: s.id,
  slug: s.id,
}));

export const WEEK_BARS = [
  { label: "L", xp: 120 },
  { label: "M", xp: 250 },
  { label: "M", xp: 180 },
  { label: "J", xp: 320 },
  { label: "V", xp: 290 },
  { label: "S", xp: 150 },
  { label: "D", xp: 45, today: true },
];

export const TODAY_SESSIONS = [
  { time: "18:00", subject: "Maths", mode: "Mode Guidé", modeColor: "#1677FF", duration: "45 min" },
  { time: "19:30", subject: "SVT", mode: "Mode Libre", modeColor: "#10B981", duration: "30 min" },
];

export const MATHS_CHAPTERS = [
  {
    id: "c1",
    title: "Calcul littéral et identités remarquables",
    lessons: [
      { id: "l1", title: "Développement et factorisation", duration: "14 min", xp: 75, status: "done" as const },
      { id: "l2", title: "Identités remarquables (a+b)²", duration: "12 min", xp: 50, status: "done" as const },
      { id: "l3", title: "Factorisation par mise en évidence", duration: "15 min", xp: 75, status: "done" as const },
      { id: "l4", title: "Applications et exercices", duration: "18 min", xp: 100, status: "current" as const },
    ],
  },
  {
    id: "eq2",
    title: "Équations du 2nd degré",
    lessons: [
      { id: "e1", title: "Introduction au discriminant Δ", duration: "12 min", xp: 50, status: "done" as const },
      { id: "e2", title: "Cas Δ > 0 : deux racines réelles", duration: "15 min", xp: 75, status: "done" as const },
      { id: "e3", title: "Cas Δ = 0 : racine double", duration: "10 min", xp: 50, status: "current" as const },
      { id: "e4", title: "Cas Δ < 0 : pas de solution réelle", duration: "10 min", xp: 50, status: "locked" as const },
      { id: "e5", title: "Relations de Viète", duration: "18 min", xp: 100, status: "locked" as const },
    ],
  },
];

export { FICHE_DELTA } from "./fiches";

export const ASSIMILATION_QCM: QCMData[] = [
  {
    id: "a1",
    enonceQuestion: "Quelle est la formule du discriminant ?",
    optionsProposees: ["Δ = b² + 4ac", "Δ = b² − 4ac", "Δ = 2b − 4ac", "Δ = b − 4ac"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Le discriminant est Δ = b² − 4ac.",
    ancreCours: "definition",
  },
  {
    id: "a2",
    enonceQuestion: "Si Δ = 0, combien de solutions l'équation possède-t-elle ?",
    optionsProposees: ["Aucune", "Une racine double", "Deux distinctes", "Infinité"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Quand Δ = 0, racine double x = −b / 2a.",
    ancreCours: "cas-zero",
  },
  {
    id: "a3",
    enonceQuestion: "Dans ax² + bx + c = 0, que doit-on imposer sur a ?",
    optionsProposees: ["a = 0", "a ≥ 0", "a ≠ 0", "a < 0"],
    indexReponseCorrecte: 2,
    explicationPedagogique: "Si a = 0, l'équation n'est plus du 2nd degré.",
    ancreCours: "definition",
  },
  {
    id: "a4",
    enonceQuestion: "Laquelle de ces équations est du 2ⁿᵈ degré ?",
    optionsProposees: ["3x + 5 = 0", "x² + 2x = 0", "5 = 0", "x³ = x"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "x² + 2x = 0 est bien du second degré.",
    ancreCours: "definition",
  },
  {
    id: "a5",
    enonceQuestion: "Si Δ > 0, combien de racines réelles ?",
    optionsProposees: ["0", "1", "2", "∞"],
    indexReponseCorrecte: 2,
    explicationPedagogique: "Δ > 0 ⇒ deux racines réelles distinctes.",
    ancreCours: "cas-positif",
  },
  {
    id: "a6",
    enonceQuestion: "Somme des racines (Viète) = ?",
    optionsProposees: ["c/a", "−b/a", "b/a", "−c/a"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "x₁ + x₂ = −b/a.",
    ancreCours: "viete",
  },
  {
    id: "a7",
    enonceQuestion: "Produit des racines (Viète) = ?",
    optionsProposees: ["−b/a", "b/a", "c/a", "−c/a"],
    indexReponseCorrecte: 2,
    explicationPedagogique: "x₁ · x₂ = c/a.",
    ancreCours: "viete",
  },
  {
    id: "a8",
    enonceQuestion: "Pour x² − 5x + 6 = 0, Δ vaut ?",
    optionsProposees: ["1", "25", "1", "13"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Δ = 25 − 24 = 1… wait 25−24=1. Actually options: b²−4ac = 25−24 = 1. Fix: correct index for 1 is 0 or we use 25 as wrong. Let me use Δ=1.",
    ancreCours: "cas-positif",
  },
  {
    id: "a9",
    enonceQuestion: "Racine double quand ?",
    optionsProposees: ["Δ < 0", "Δ = 0", "Δ > 0", "a = 0"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Racine double uniquement si Δ = 0.",
    ancreCours: "cas-zero",
  },
  {
    id: "a10",
    enonceQuestion: "Forme des racines si Δ > 0 ?",
    optionsProposees: ["−b/2a", "(−b ± √Δ)/2a", "√Δ / 2a", "b/2a"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "x = (−b ± √Δ) / 2a.",
    ancreCours: "cas-positif",
  },
];

// Fix a8 explanation and options
ASSIMILATION_QCM[7] = {
  id: "a8",
  enonceQuestion: "Pour x² − 5x + 6 = 0, Δ vaut ?",
  optionsProposees: ["1", "25", "11", "49"],
  indexReponseCorrecte: 0,
  explicationPedagogique: "Δ = (−5)² − 4·1·6 = 25 − 24 = 1.",
  ancreCours: "cas-positif",
};

export const GRAND_QUIZZ: QCMData[] = [
  ...ASSIMILATION_QCM,
  {
    id: "g11",
    enonceQuestion: "Si a = 2, b = −4, c = 2, alors Δ = ?",
    optionsProposees: ["0", "8", "16", "4"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Δ = 16 − 16 = 0 → racine double.",
  },
  {
    id: "g12",
    enonceQuestion: "Une équation du 2nd degré a toujours des racines réelles ?",
    optionsProposees: ["Oui", "Non", "Seulement si a > 0", "Seulement si c = 0"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Non : si Δ < 0, pas de racines réelles.",
  },
];

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const daysFromNow = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const FLASHCARDS: FlashcardData[] = [
  {
    id: "f1",
    recto: "Formule du discriminant Δ ?",
    verso: "Δ = b² − 4ac",
    intervalleRepetJ: 1,
    prochaineRevision: hoursAgo(4),
    difficulte: "Moyen",
    due: true,
    chapitreId: "eq2",
    matiere: "Maths",
  },
  {
    id: "f2",
    recto: "Δ > 0 signifie ?",
    verso: "Deux racines réelles distinctes",
    intervalleRepetJ: 2,
    prochaineRevision: hoursAgo(1),
    difficulte: "Facile",
    due: true,
    chapitreId: "eq2",
    matiere: "Maths",
  },
  {
    id: "f3",
    recto: "Somme des racines (Viète) ?",
    verso: "x₁ + x₂ = −b/a",
    intervalleRepetJ: 0,
    prochaineRevision: hoursAgo(2),
    difficulte: "Moyen",
    due: true,
    chapitreId: "eq2",
    matiere: "Maths",
  },
  {
    id: "f4",
    recto: "Produit des racines ?",
    verso: "x₁ · x₂ = c/a",
    intervalleRepetJ: 2,
    prochaineRevision: daysFromNow(3),
    difficulte: "Facile",
    due: false,
    chapitreId: "eq2",
    matiere: "Maths",
  },
  {
    id: "f5",
    recto: "Où commence la digestion chimique de l'amidon ?",
    verso: "Dans la bouche, grâce à l'amylase salivaire.",
    intervalleRepetJ: 0,
    prochaineRevision: hoursAgo(6),
    difficulte: "Moyen",
    due: true,
    chapitreId: "digest",
    matiere: "SVT",
  },
  {
    id: "f6",
    recto: "Rôle de l'intestin grêle ?",
    verso: "Absorption des nutriments vers le sang.",
    intervalleRepetJ: 1,
    prochaineRevision: daysFromNow(2),
    difficulte: "Facile",
    due: false,
    chapitreId: "digest",
    matiere: "SVT",
  },
  {
    id: "f7",
    recto: "Quelle cavité cardiaque a la paroi la plus épaisse ?",
    verso: "Le ventricule gauche : il pompe le sang dans l'aorte vers tout le corps.",
    intervalleRepetJ: 0,
    prochaineRevision: hoursAgo(3),
    difficulte: "Moyen",
    due: true,
    chapitreId: "circulation",
    matiere: "SVT",
  },
  {
    id: "f8",
    recto: "Appariement des bases de l'ADN ?",
    verso: "A–T et G–C (complémentarité de la double hélice).",
    intervalleRepetJ: 0,
    prochaineRevision: hoursAgo(5),
    difficulte: "Facile",
    due: true,
    chapitreId: "adn",
    matiere: "SVT",
  },
  {
    id: "f9",
    recto: "Rôle de la gaine de myéline ?",
    verso: "Isoler l'axone et accélérer l'influx (conduction saltatoire).",
    intervalleRepetJ: 1,
    prochaineRevision: hoursAgo(2),
    difficulte: "Moyen",
    due: true,
    chapitreId: "neurones",
    matiere: "SVT",
  },
  {
    id: "f10",
    recto: "À la synapse, le message nerveux devient…",
    verso: "Chimique : neurotransmetteur libéré dans la fente synaptique.",
    intervalleRepetJ: 0,
    prochaineRevision: hoursAgo(1),
    difficulte: "Moyen",
    due: true,
    chapitreId: "neurones",
    matiere: "SVT",
  },
  {
    id: "f11",
    recto: "Le bassinet du rein sert à…",
    verso: "Collecter l'urine avant de l'envoyer dans l'uretère.",
    intervalleRepetJ: 2,
    prochaineRevision: daysFromNow(1),
    difficulte: "Facile",
    due: false,
    chapitreId: "excretion",
    matiere: "SVT",
  },
];

export const BLITZ_QCM: QCMData[] = [
  { id: "bf1", enonceQuestion: "b² − 4ac est la formule du ?", optionsProposees: ["Discriminant", "Périmètre", "Volume", "Gradient"], indexReponseCorrecte: 0, explicationPedagogique: "", matiere: "Maths", difficulte: "Facile" },
  { id: "bf2", enonceQuestion: "La mitose produit combien de cellules filles ?", optionsProposees: ["1", "2", "4", "8"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "SVT", difficulte: "Facile" },
  { id: "bf3", enonceQuestion: "H₂O est la formule chimique de ?", optionsProposees: ["CO₂", "L'eau", "L'acide", "Le sel"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "PC", difficulte: "Facile" },
  { id: "bf4", enonceQuestion: "La photosynthèse libère quel gaz ?", optionsProposees: ["CO₂", "H₂", "O₂", "N₂"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "SVT", difficulte: "Facile" },
  { id: "bf5", enonceQuestion: "cos²(x) + sin²(x) = ?", optionsProposees: ["0", "2", "1", "π"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "Maths", difficulte: "Facile" },
  { id: "bf6", enonceQuestion: "Capitale du Togo ?", optionsProposees: ["Kara", "Lomé", "Sokodé", "Atakpamé"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "H-G", difficulte: "Facile" },
  { id: "bf7", enonceQuestion: "Past simple de « go » ?", optionsProposees: ["goed", "gone", "went", "going"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "Anglais", difficulte: "Facile" },
  { id: "bf8", enonceQuestion: "Un acide a un pH…", optionsProposees: ["= 7", "> 7", "< 7", "= 14"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "PC", difficulte: "Facile" },

  { id: "bm1", enonceQuestion: "'Present Perfect' = ?", optionsProposees: ["I go", "I have gone", "I went", "I going"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "Anglais", difficulte: "Moyen" },
  { id: "bm2", enonceQuestion: "L'indépendance du Togo : quelle année ?", optionsProposees: ["1958", "1960", "1962", "1965"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "H-G", difficulte: "Moyen" },
  { id: "bm3", enonceQuestion: "Δ > 0 signifie combien de racines réelles ?", optionsProposees: ["0", "1", "2", "∞"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "Maths", difficulte: "Moyen" },
  { id: "bm4", enonceQuestion: "La méiose produit combien de cellules ?", optionsProposees: ["2", "3", "4", "8"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "SVT", difficulte: "Moyen" },
  { id: "bm5", enonceQuestion: "Somme des racines (Viète) ?", optionsProposees: ["c/a", "−b/a", "b/a", "−c/a"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "Maths", difficulte: "Moyen" },
  { id: "bm6", enonceQuestion: "Quel organe produit la bile ?", optionsProposees: ["Pancréas", "Foie", "Estomac", "Rate"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "SVT", difficulte: "Moyen" },
  { id: "bm7", enonceQuestion: "H₂O₂ est…", optionsProposees: ["L'eau", "L'eau oxygénée", "Le dioxyde", "L'ozone"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "PC", difficulte: "Moyen" },
  { id: "bm8", enonceQuestion: "Where does digestion of starch start?", optionsProposees: ["Stomach", "Mouth", "Liver", "Colon"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "Anglais", difficulte: "Moyen" },

  { id: "bd1", enonceQuestion: "Si Δ = 0, l'équation a…", optionsProposees: ["0 racine", "1 racine double", "2 racines", "∞ racines"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "Maths", difficulte: "Difficile" },
  { id: "bd2", enonceQuestion: "Produit des racines (Viète) ?", optionsProposees: ["−b/a", "c/a", "b/c", "−c/a"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "Maths", difficulte: "Difficile" },
  { id: "bd3", enonceQuestion: "Gaz consommé par la photosynthèse ?", optionsProposees: ["O₂", "N₂", "CO₂", "H₂"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "SVT", difficulte: "Difficile" },
  { id: "bd4", enonceQuestion: "Si Δ < 0, les racines réelles sont…", optionsProposees: ["Deux", "Une", "Aucune", "Complexes seulement"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "Maths", difficulte: "Difficile" },
  { id: "bd5", enonceQuestion: "Le Togo a d'abord été colonie…", optionsProposees: ["Anglaise", "Allemande", "Portugaise", "Belge"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "H-G", difficulte: "Difficile" },
  { id: "bd6", enonceQuestion: "pH = −log[H₃O⁺]. Si [H₃O⁺] = 10⁻³, pH = ?", optionsProposees: ["3", "7", "11", "−3"], indexReponseCorrecte: 0, explicationPedagogique: "", matiere: "PC", difficulte: "Difficile" },
  { id: "bd7", enonceQuestion: "Present Perfect vs preterite : action with present result?", optionsProposees: ["I saw him", "I have seen him", "I seeing him", "I seen him"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "Anglais", difficulte: "Difficile" },
  { id: "bd8", enonceQuestion: "L'absorption des nutriments se fait surtout dans…", optionsProposees: ["L'estomac", "Le gros intestin", "L'intestin grêle", "La bouche"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "SVT", difficulte: "Difficile" },
  { id: "bd9", enonceQuestion: "La paroi la plus épaisse du cœur est celle du…", optionsProposees: ["Ventricule droit", "Ventricule gauche", "Oreillette droite", "Oreillette gauche"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "SVT", difficulte: "Difficile" },
  { id: "bf9", enonceQuestion: "Dans l'ADN, A s'associe à…", optionsProposees: ["G", "C", "T", "U"], indexReponseCorrecte: 2, explicationPedagogique: "", matiere: "SVT", difficulte: "Facile" },
  { id: "bm9", enonceQuestion: "La myéline sert à…", optionsProposees: ["Ralentir l'influx", "Accélérer l'influx", "Digérer l'amidon", "Filtrer l'urine"], indexReponseCorrecte: 1, explicationPedagogique: "", matiere: "SVT", difficulte: "Moyen" },
];

export type LeaguePlayer = {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  you: boolean;
  initials: string;
  avatarColor: string;
  avatarId?: string;
};

export type LeagueTierMeta = {
  id: LigueNom;
  label: string;
  /** Clé fichier sous assets/badges/{key}.png */
  badgeKey: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  color: string;
  accent: string;
};

/** Paliers de ligue (ordre Duolingo-like) — couleurs alignées badges 3D */
export const LEAGUE_TIERS: LeagueTierMeta[] = [
  { id: "Bronze", label: "Bronze", badgeKey: "bronze", color: "#D4A574", accent: "#FFF7ED" },
  { id: "Argent", label: "Argent", badgeKey: "silver", color: "#94A3B8", accent: "#F8FAFC" },
  { id: "Or", label: "Or", badgeKey: "gold", color: "#EAB308", accent: "#FEF9C3" },
  { id: "Platine", label: "Platine", badgeKey: "platinum", color: "#C4B5FD", accent: "#F5F3FF" },
  { id: "Diamant", label: "Diamant", badgeKey: "diamond", color: "#F59E0B", accent: "#FFFBEB" },
];

const LEAGUE_SEED: LeaguePlayer[] = [
  { rank: 1, name: "Ama Mensah", xp: 4210, streak: 12, you: false, initials: "AM", avatarColor: "#F59E0B", avatarId: "a02" },
  { rank: 2, name: "Kwame Asante", xp: 3940, streak: 8, you: false, initials: "KA", avatarColor: "#8B5CF6", avatarId: "a05" },
  { rank: 3, name: "Kofi Adjei", xp: 2840, streak: 5, you: true, initials: "KO", avatarColor: "#1677FF", avatarId: "a07" },
  { rank: 4, name: "Efua Boateng", xp: 2720, streak: 7, you: false, initials: "EB", avatarColor: "#10B981", avatarId: "a06" },
  { rank: 5, name: "Yaw Darko", xp: 2490, streak: 3, you: false, initials: "YD", avatarColor: "#EF4444", avatarId: "a10" },
  { rank: 6, name: "Akua Owusu", xp: 2180, streak: 6, you: false, initials: "AO", avatarColor: "#06B6D4", avatarId: "a09" },
  { rank: 7, name: "Kojo Asante", xp: 1950, streak: 2, you: false, initials: "KJ", avatarColor: "#F97316", avatarId: "a03" },
  { rank: 8, name: "Adwoa Mensah", xp: 1740, streak: 4, you: false, initials: "AD", avatarColor: "#EC4899", avatarId: "a01" },
];

const EXTRA_NAMES = [
  "Nana Addo", "Abena Serwaa", "Fiifi Mensah", "Esi Lamptey", "Kweku Boateng",
  "Afia Nyarko", "Paapa Owusu", "Maame Yaa", "Nii Armah", "Ama Serwa",
  "Kwesi Appiah", "Aba Quartey", "Tetteh Lartey", "Akosua Frimpong", "Yaw Mensah",
  "Adjoa Sarpong", "Kofi Boateng", "Mansa Okai", "Samuel Tetteh", "Grace Amankwah",
  "Daniel Owusu", "Ruth Asiedu",
];
const EXTRA_COLORS = [
  "#6366F1", "#14B8A6", "#F43F5E", "#0EA5E9", "#A855F7",
  "#84CC16", "#E11D48", "#F59E0B", "#22C55E", "#3B82F6",
];

function buildLeaguePlayers(): LeaguePlayer[] {
  const players = [...LEAGUE_SEED];
  let xp = 1680;
  for (let i = 0; i < EXTRA_NAMES.length && players.length < 30; i++) {
    const name = EXTRA_NAMES[i];
    const parts = name.split(" ");
    const initials = `${parts[0][0]}${parts[1]?.[0] ?? ""}`.toUpperCase();
    xp = Math.max(420, xp - (35 + (i % 5) * 12));
    players.push({
      rank: players.length + 1,
      name,
      xp,
      streak: 1 + (i % 9),
      you: false,
      initials,
      avatarColor: EXTRA_COLORS[i % EXTRA_COLORS.length],
      avatarId: `a${String((i % 10) + 1).padStart(2, "0")}`,
    });
  }
  return players;
}

/** Classement hebdo du groupe (rangs 1–30) */
export const LEAGUE_PLAYERS: LeaguePlayer[] = buildLeaguePlayers();

export const PROFILES_DEMO = [
  {
    id: "1",
    nom: "Kofi Adjei",
    firstName: "Kofi",
    lastName: "Adjei",
    email: "kofi@learnflow.tg",
    classe: "3eme" as const,
    gradeLabel: "3ème",
    xpTotale: 2840,
    streak: 5,
    rang: 3,
    lessonsDone: 34,
    color: "#1677FF",
    bg: "#E6F4FF",
    avatarId: "a07",
  },
  {
    id: "2",
    nom: "Ama Kofi",
    firstName: "Ama",
    lastName: "Kofi",
    email: "ama@learnflow.tg",
    classe: "Tle" as const,
    gradeLabel: "Tle D",
    xpTotale: 3120,
    streak: 7,
    rang: 5,
    lessonsDone: 22,
    color: "#10B981",
    bg: "#ECFDF5",
    avatarId: "a02",
  },
];

export const PARENT_NOTES: ParentNote[] = [
  { matiere: "Mathématiques", score: 14 },
  { matiere: "SVT", score: 16 },
  { matiere: "Physique-Chimie", score: 12 },
  { matiere: "Français", score: 13 },
  { matiere: "Anglais", score: 15 },
];

export type AiFaqItem = { q: string; a: string; keywords?: string[] };

export const AI_FAQ: AiFaqItem[] = [
  {
    q: "C'est quoi le discriminant ?",
    keywords: ["discriminant", "delta", "Δ", "racine"],
    a: "Δ = b² − 4ac. Il indique combien de racines réelles a une équation du 2nd degré.",
  },
  {
    q: "Comment circule le sang dans le cœur ?",
    keywords: ["coeur", "cœur", "circulation", "ventricule", "aorte"],
    a: "Pompe double : le droit envoie le sang aux poumons, le gauche (paroi plus épaisse) vers le corps via l'aorte. Le septum empêche le mélange des deux sangs. Ouvre le modèle 3D du chapitre Circulation.",
  },
  {
    q: "Comment est fait l'ADN ?",
    keywords: ["adn", "hélice", "bases", "génétique"],
    a: "Double hélice : A face à T, G face à C. C'est le support des caractères héréditaires. Le modèle 3D du chapitre ADN montre les paires de bases.",
  },
  {
    q: "C'est quoi une synapse ?",
    keywords: ["synapse", "neurone", "neurotransmetteur", "myéline"],
    a: "Contact entre deux neurones. L'influx électrique devient chimique : vésicules, neurotransmetteur, fente, récepteurs. La myéline accélère l'influx le long de l'axone.",
  },
  {
    q: "Comment réviser efficacement ?",
    keywords: ["reviser", "réviser", "efficace", "methode", "méthode"],
    a: "Alterne Mode Guidé (cartes dues) et courtes sessions Blitz. La règle 10/10 garantit la maîtrise avant le Grand Quizz.",
  },
  {
    q: "Que fait Spira ?",
    keywords: ["spira"],
    a: "Spira illustre les notions avec des analogies. Le tuteur (moi) répond à tes questions depuis le bouton en bas à droite.",
  },
  {
    q: "C'est quoi le Mode Guidé ?",
    keywords: ["guidé", "guide", "cartes dues"],
    a: "Le Mode Guidé te propose les flashcards dues aujourd'hui (algo des J). Il s'active dès qu'une carte est à réviser.",
  },
  {
    q: "Comment marche le Blitz ?",
    keywords: ["blitz", "60s", "60 s", "sprint"],
    a: "Blitz 60s : un sprint chrono, une série de QCM. Idéal pour un rappel rapide — pas pour apprendre une notion neuve.",
  },
  {
    q: "C'est quoi la règle 10/10 ?",
    keywords: ["10/10", "10 10", "maitrise", "maîtrise", "garde"],
    a: "La garde-barrière 10/10 : tu dois maîtriser la fiche avant d'accéder au Grand Quizz. Pas de shortcut.",
  },
  {
    q: "Comment marchent les flashcards ?",
    keywords: ["flashcard", "cartes", "algo des j", "repetition", "répétition"],
    a: "Chaque carte a un intervalle (algo des J). Tu la notes Facile / Moyen / Difficile — la prochaine date de révision s'ajuste.",
  },
  {
    q: "Comment monter en ligue ?",
    keywords: ["ligue", "xp", "classement", "rang"],
    a: "Tu gagnes de l'XP à chaque séance. Ton rang dans le groupe de la semaine décide si tu montes, restes, ou descends de ligue.",
  },
];

export function findAiFaq(query: string): AiFaqItem | undefined {
  const q = query.toLowerCase().trim();
  if (!q) return undefined;
  return AI_FAQ.find((f) => {
    const nq = f.q.toLowerCase();
    if (q.includes(nq.slice(0, Math.min(12, nq.length))) || nq.includes(q.slice(0, Math.min(8, q.length)))) {
      return true;
    }
    return (f.keywords ?? []).some((k) => q.includes(k.toLowerCase()));
  });
}

export function replyAsLocalTutor(query: string): string {
  const faq = findAiFaq(query);
  if (faq) return faq.a;
  return "Je n'ai que des réponses locales pour l'instant. Essaie : discriminant, Spira, Mode Guidé, Blitz, 10/10, flashcards ou ligue.";
}
