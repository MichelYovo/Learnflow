import type {
  QCMData,
  FlashcardData,
  ParentNote,
  AgendaSession,
  SchoolClass,
  SubjectShortcut,
  LigueNom,
  InboxNotification,
} from "../types/learnflow";

export { CLASSES, CLASS_GROUPS, classLabel, isLyceeClass, isTleDClass, normalizeClassId } from "./classes";

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
    title: "Ligue Bronze",
    body: "Tout le monde commence ici. Ton rang se calcule dès que tu gagnes de l'XP.",
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    read: true,
  },
];

export const INITIAL_AGENDA: AgendaSession[] = [
  { id: "1", subject: "Maths", subjectColor: "#1677FF", subjectBg: "#E6F4FF", mode: "guide", day: TODAY_IDX, hour: 18, minute: 0, duration: 45, reminderMin: 15 },
  { id: "2", subject: "SVT", subjectColor: "#10B981", subjectBg: "#ECFDF5", mode: "libre", day: TODAY_IDX, hour: 19, minute: 30, duration: 30, reminderMin: 15 },
  { id: "3", subject: "PCT", subjectColor: "#06B6D4", subjectBg: "#ECFEFF", mode: "cramming", day: (TODAY_IDX + 1) % 7, hour: 17, minute: 0, duration: 60, reminderMin: 30 },
];

export const INITIAL_TIMETABLE: SchoolClass[] = [
  { id: "t1", subject: "Mathématiques", subjectColor: "#1677FF", subjectBg: "#E6F4FF", day: 0, startHour: 8, startMinute: 0, endHour: 9, endMinute: 0, teacher: "M. Kokou", room: "Salle 12" },
  { id: "t2", subject: "Français", subjectColor: "#8B5CF6", subjectBg: "#F5F3FF", day: 0, startHour: 9, startMinute: 0, endHour: 10, endMinute: 0, teacher: "Mme Afua", room: "Salle 8" },
  { id: "t3", subject: "SVT", subjectColor: "#10B981", subjectBg: "#ECFDF5", day: 0, startHour: 10, startMinute: 30, endHour: 12, endMinute: 0, teacher: "M. Komlan", room: "Salle 5" },
  { id: "t4", subject: "Anglais", subjectColor: "#EF4444", subjectBg: "#FEF2F2", day: 1, startHour: 8, startMinute: 0, endHour: 9, endMinute: 0, teacher: "Mme Grace", room: "Salle 3" },
  { id: "t5", subject: "Mathématiques", subjectColor: "#1677FF", subjectBg: "#E6F4FF", day: 1, startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, teacher: "M. Kokou", room: "Salle 12" },
  { id: "t6", subject: "Histoire-Géo", subjectColor: "#F59E0B", subjectBg: "#FFFBEB", day: 2, startHour: 8, startMinute: 0, endHour: 9, endMinute: 0, teacher: "M. Edem", room: "Salle 10" },
  { id: "t7", subject: "PCT", subjectColor: "#06B6D4", subjectBg: "#ECFEFF", day: 2, startHour: 9, startMinute: 0, endHour: 10, endMinute: 30, teacher: "Mme Esso", room: "Labo 2" },
  { id: "t8", subject: "SVT", subjectColor: "#10B981", subjectBg: "#ECFDF5", day: 3, startHour: 8, startMinute: 0, endHour: 9, endMinute: 30, teacher: "M. Komlan", room: "Salle 5" },
  { id: "t9", subject: "Français", subjectColor: "#8B5CF6", subjectBg: "#F5F3FF", day: 4, startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, teacher: "Mme Afua", room: "Salle 8" },
  { id: "t10", subject: "ECM", subjectColor: "#F97316", subjectBg: "#FFF7ED", day: 4, startHour: 11, startMinute: 0, endHour: 12, endMinute: 0, teacher: "M. Senam", room: "Salle 1" },
];

export const SUBJECTS = [
  { id: "maths", abbrev: "Maths", name: "Mathématiques", icon: "calculator" as const, color: "#1677FF", bg: "#E6F4FF", border: "#BAE0FF", done: 12, total: 32 },
  { id: "pc", abbrev: "PCT", name: "PCT", icon: "atom" as const, color: "#06B6D4", bg: "#ECFEFF", border: "#A5F3FC", done: 5, total: 24 },
  { id: "svt", abbrev: "SVT", name: "SVT", icon: "microscope" as const, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", done: 8, total: 20 },
  { id: "hg", abbrev: "H-G", name: "Histoire-Géo", icon: "globe" as const, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", done: 6, total: 18 },
  { id: "fr", abbrev: "Français", name: "Français", icon: "quill" as const, color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE", done: 9, total: 22 },
  { id: "ang", abbrev: "Anglais", name: "Anglais", icon: "chatbubble" as const, color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", done: 4, total: 16 },
  { id: "edhc", abbrev: "ECM", name: "ECM", icon: "heart" as const, color: "#F97316", bg: "#FFF7ED", border: "#FED7AA", done: 2, total: 12 },
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
    enonceQuestion: "Si Δ > 0, combien de racines réelles l'équation possède-t-elle ?",
    optionsProposees: ["0", "1", "2", "∞"],
    indexReponseCorrecte: 2,
    explicationPedagogique: "Δ > 0 ⇒ deux racines réelles distinctes.",
    ancreCours: "cas-positif",
  },
  {
    id: "a6",
    enonceQuestion: "D'après les relations de Viète, quelle est la somme des racines ?",
    optionsProposees: ["c/a", "−b/a", "b/a", "−c/a"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "x₁ + x₂ = −b/a.",
    ancreCours: "viete",
  },
  {
    id: "a7",
    enonceQuestion: "D'après les relations de Viète, quel est le produit des racines ?",
    optionsProposees: ["−b/a", "b/a", "c/a", "−c/a"],
    indexReponseCorrecte: 2,
    explicationPedagogique: "x₁ · x₂ = c/a.",
    ancreCours: "viete",
  },
  {
    id: "a8",
    enonceQuestion: "Pour l'équation x² − 5x + 6 = 0, que vaut le discriminant Δ ?",
    optionsProposees: ["1", "25", "11", "49"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Δ = (−5)² − 4·1·6 = 25 − 24 = 1.",
    ancreCours: "cas-positif",
  },
  {
    id: "a9",
    enonceQuestion: "Dans quel cas une équation du second degré a-t-elle une racine double ?",
    optionsProposees: ["Δ < 0", "Δ = 0", "Δ > 0", "a = 0"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Racine double uniquement si Δ = 0.",
    ancreCours: "cas-zero",
  },
  {
    id: "a10",
    enonceQuestion: "Quelle est la formule des racines lorsque Δ > 0 ?",
    optionsProposees: ["−b/2a", "(−b ± √Δ)/2a", "√Δ / 2a", "b/2a"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "x = (−b ± √Δ) / 2a.",
    ancreCours: "cas-positif",
  },
];

export const GRAND_QUIZZ: QCMData[] = [
  ...ASSIMILATION_QCM,
  {
    id: "g11",
    enonceQuestion: "Si a = 2, b = −4 et c = 2, que vaut le discriminant Δ ?",
    optionsProposees: ["0", "8", "16", "4"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Δ = 16 − 16 = 0 → racine double.",
  },
  {
    id: "g12",
    enonceQuestion: "Une équation du second degré a-t-elle toujours des racines réelles ?",
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
    verso: "Isoler l'axone : l'influx saute et va plus vite.",
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
    verso: "Chimique : un neurotransmetteur traverse la fente.",
    intervalleRepetJ: 0,
    prochaineRevision: hoursAgo(1),
    difficulte: "Moyen",
    due: true,
    chapitreId: "neurones",
    matiere: "SVT",
  },
  {
    id: "f12",
    recto: "Dans un neurone, le message va…",
    verso: "Dendrites → corps cellulaire → axone → synapse.",
    intervalleRepetJ: 0,
    prochaineRevision: hoursAgo(3),
    difficulte: "Facile",
    due: true,
    chapitreId: "nerveux",
    matiere: "SVT",
  },
  {
    id: "f13",
    recto: "Rôle de la gaine de myéline ?",
    verso: "Isoler l'axone : l'influx saute et va plus vite.",
    intervalleRepetJ: 1,
    prochaineRevision: hoursAgo(2),
    difficulte: "Moyen",
    due: true,
    chapitreId: "nerveux",
    matiere: "SVT",
  },
  {
    id: "f14",
    recto: "À la synapse, le message devient…",
    verso: "Chimique : un neurotransmetteur traverse la fente.",
    intervalleRepetJ: 0,
    prochaineRevision: hoursAgo(1),
    difficulte: "Moyen",
    due: true,
    chapitreId: "nerveux",
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
  { id: "bf1", enonceQuestion: "Que calcule la formule b² − 4ac ?", optionsProposees: ["Le discriminant", "Le périmètre", "Le volume", "Le gradient"], indexReponseCorrecte: 0, explicationPedagogique: "b² − 4ac est le discriminant Δ.", matiere: "Maths", difficulte: "Facile" },
  { id: "bf2", enonceQuestion: "Combien de cellules filles une mitose produit-elle ?", optionsProposees: ["1", "2", "4", "8"], indexReponseCorrecte: 1, explicationPedagogique: "La mitose produit deux cellules filles identiques.", matiere: "SVT", difficulte: "Facile" },
  { id: "bf3", enonceQuestion: "H₂O est la formule chimique de quelle substance ?", optionsProposees: ["Le dioxyde de carbone", "L'eau", "Un acide", "Le sel"], indexReponseCorrecte: 1, explicationPedagogique: "H₂O est la formule de l'eau.", matiere: "PCT", difficulte: "Facile" },
  { id: "bf4", enonceQuestion: "Quel gaz la photosynthèse libère-t-elle ?", optionsProposees: ["Le dioxyde de carbone", "Le dihydrogène", "Le dioxygène", "Le diazote"], indexReponseCorrecte: 2, explicationPedagogique: "La photosynthèse libère du dioxygène O₂.", matiere: "SVT", difficulte: "Facile" },
  { id: "bf5", enonceQuestion: "Que vaut cos²(x) + sin²(x) ?", optionsProposees: ["0", "2", "1", "π"], indexReponseCorrecte: 2, explicationPedagogique: "Pour tout réel x, cos²(x) + sin²(x) = 1.", matiere: "Maths", difficulte: "Facile" },
  { id: "bf6", enonceQuestion: "Quelle est la capitale du Togo ?", optionsProposees: ["Kara", "Lomé", "Sokodé", "Atakpamé"], indexReponseCorrecte: 1, explicationPedagogique: "Lomé est la capitale du Togo.", matiere: "H-G", difficulte: "Facile" },
  { id: "bf7", enonceQuestion: "Quel est le prétérit (past simple) du verbe « go » ?", optionsProposees: ["goed", "gone", "went", "going"], indexReponseCorrecte: 2, explicationPedagogique: "Le prétérit de go est went.", matiere: "Anglais", difficulte: "Facile" },
  { id: "bf8", enonceQuestion: "Comment se situe le pH d'une solution acide ?", optionsProposees: ["Il est égal à 7", "Il est supérieur à 7", "Il est inférieur à 7", "Il est égal à 14"], indexReponseCorrecte: 2, explicationPedagogique: "Un acide a un pH inférieur à 7.", matiere: "PCT", difficulte: "Facile" },

  { id: "bm1", enonceQuestion: "Quelle phrase est au present perfect ?", optionsProposees: ["I go", "I have gone", "I went", "I going"], indexReponseCorrecte: 1, explicationPedagogique: "Le present perfect se forme avec have/has + participe passé.", matiere: "Anglais", difficulte: "Moyen" },
  { id: "bm2", enonceQuestion: "En quelle année le Togo a-t-il accédé à l'indépendance ?", optionsProposees: ["1958", "1960", "1962", "1965"], indexReponseCorrecte: 1, explicationPedagogique: "Le Togo est indépendant depuis 1960.", matiere: "H-G", difficulte: "Moyen" },
  { id: "bm3", enonceQuestion: "Si Δ > 0, combien de racines réelles l'équation possède-t-elle ?", optionsProposees: ["0", "1", "2", "Une infinité"], indexReponseCorrecte: 2, explicationPedagogique: "Δ > 0 donne deux racines réelles distinctes.", matiere: "Maths", difficulte: "Moyen" },
  { id: "bm4", enonceQuestion: "Combien de cellules la méiose produit-elle ?", optionsProposees: ["2", "3", "4", "8"], indexReponseCorrecte: 2, explicationPedagogique: "La méiose produit quatre cellules haploïdes.", matiere: "SVT", difficulte: "Moyen" },
  { id: "bm5", enonceQuestion: "D'après les relations de Viète, quelle est la somme des racines ?", optionsProposees: ["c/a", "−b/a", "b/a", "−c/a"], indexReponseCorrecte: 1, explicationPedagogique: "La somme des racines vaut −b/a.", matiere: "Maths", difficulte: "Moyen" },
  { id: "bm6", enonceQuestion: "Quel organe produit la bile ?", optionsProposees: ["Le pancréas", "Le foie", "L'estomac", "La rate"], indexReponseCorrecte: 1, explicationPedagogique: "Le foie produit la bile.", matiere: "SVT", difficulte: "Moyen" },
  { id: "bm7", enonceQuestion: "Que désigne la formule H₂O₂ ?", optionsProposees: ["L'eau", "L'eau oxygénée", "Le dioxyde de carbone", "L'ozone"], indexReponseCorrecte: 1, explicationPedagogique: "H₂O₂ est l'eau oxygénée, ou peroxyde d'hydrogène.", matiere: "PCT", difficulte: "Moyen" },
  { id: "bm8", enonceQuestion: "Where does the chemical digestion of starch start?", optionsProposees: ["In the stomach", "In the mouth", "In the liver", "In the colon"], indexReponseCorrecte: 1, explicationPedagogique: "Starch digestion starts in the mouth, with salivary amylase.", matiere: "Anglais", difficulte: "Moyen" },

  { id: "bd1", enonceQuestion: "Si Δ = 0, combien de racines réelles l'équation possède-t-elle ?", optionsProposees: ["Aucune", "Une racine double", "Deux racines distinctes", "Une infinité"], indexReponseCorrecte: 1, explicationPedagogique: "Δ = 0 donne une seule racine, dite double.", matiere: "Maths", difficulte: "Difficile" },
  { id: "bd2", enonceQuestion: "D'après les relations de Viète, quel est le produit des racines ?", optionsProposees: ["−b/a", "c/a", "b/c", "−c/a"], indexReponseCorrecte: 1, explicationPedagogique: "Le produit des racines vaut c/a.", matiere: "Maths", difficulte: "Difficile" },
  { id: "bd3", enonceQuestion: "Quel gaz la photosynthèse consomme-t-elle ?", optionsProposees: ["Le dioxygène", "Le diazote", "Le dioxyde de carbone", "Le dihydrogène"], indexReponseCorrecte: 2, explicationPedagogique: "La photosynthèse consomme du dioxyde de carbone.", matiere: "SVT", difficulte: "Difficile" },
  { id: "bd4", enonceQuestion: "Si Δ < 0, que peut-on dire des racines réelles ?", optionsProposees: ["Il y en a deux", "Il y en a une", "Il n'y en a aucune", "Elles sont forcément complexes et réelles"], indexReponseCorrecte: 2, explicationPedagogique: "Si Δ < 0, l'équation n'a pas de racine réelle.", matiere: "Maths", difficulte: "Difficile" },
  { id: "bd5", enonceQuestion: "De quelle puissance coloniale le Togo a-t-il d'abord dépendu ?", optionsProposees: ["L'Angleterre", "L'Allemagne", "Le Portugal", "La Belgique"], indexReponseCorrecte: 1, explicationPedagogique: "Le Togo a d'abord été une colonie allemande.", matiere: "H-G", difficulte: "Difficile" },
  { id: "bd6", enonceQuestion: "Si pH = −log[H₃O⁺] et [H₃O⁺] = 10⁻³, que vaut le pH ?", optionsProposees: ["3", "7", "11", "−3"], indexReponseCorrecte: 0, explicationPedagogique: "−log(10⁻³) = 3.", matiere: "PCT", difficulte: "Difficile" },
  { id: "bd7", enonceQuestion: "Which sentence shows a past action with a present result?", optionsProposees: ["I saw him", "I have seen him", "I seeing him", "I seen him"], indexReponseCorrecte: 1, explicationPedagogique: "The present perfect links a past action to the present.", matiere: "Anglais", difficulte: "Difficile" },
  { id: "bd8", enonceQuestion: "Où se fait surtout l'absorption des nutriments ?", optionsProposees: ["Dans l'estomac", "Dans le gros intestin", "Dans l'intestin grêle", "Dans la bouche"], indexReponseCorrecte: 2, explicationPedagogique: "L'absorption se fait surtout dans l'intestin grêle.", matiere: "SVT", difficulte: "Difficile" },
  { id: "bd9", enonceQuestion: "Quelle cavité du cœur a la paroi la plus épaisse ?", optionsProposees: ["Le ventricule droit", "Le ventricule gauche", "L'oreillette droite", "L'oreillette gauche"], indexReponseCorrecte: 1, explicationPedagogique: "Le ventricule gauche a la paroi la plus épaisse.", matiere: "SVT", difficulte: "Difficile" },
  { id: "bf9", enonceQuestion: "Dans l'ADN, avec quelle base l'adénine (A) s'associe-t-elle ?", optionsProposees: ["La guanine (G)", "La cytosine (C)", "La thymine (T)", "L'uracile (U)"], indexReponseCorrecte: 2, explicationPedagogique: "Dans l'ADN, A s'associe à T.", matiere: "SVT", difficulte: "Facile" },
  { id: "bm9", enonceQuestion: "À quoi sert la gaine de myéline ?", optionsProposees: ["À ralentir l'influx", "À accélérer l'influx", "À digérer l'amidon", "À filtrer l'urine"], indexReponseCorrecte: 1, explicationPedagogique: "La myéline accélère la conduction de l'influx nerveux.", matiere: "SVT", difficulte: "Moyen" },
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
  studentId?: string;
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

/** Classement live uniquement — plus de profils de simulation. */
export const LEAGUE_PLAYERS: LeaguePlayer[] = [];

export const BEGINNER_LIGUE = {
  nomLigue: "Bronze" as const,
  rangActuel: 1,
  scoreHebdo: 0,
  estGelee: false,
  groupe: 1,
};

export function initialsFromName(name: string): string {
  return (
    name
      .replace(/[^A-Za-zÀ-ÿ]/g, " ")
      .trim()
      .split(/\s+/)
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ÉL"
  );
}

export const EMPTY_WEEK_CHART = [
  { label: "L", height: 8, color: "#BFDBFE" },
  { label: "M", height: 8, color: "#BFDBFE" },
  { label: "M", height: 8, color: "#BFDBFE" },
  { label: "J", height: 8, color: "#BFDBFE" },
  { label: "V", height: 8, color: "#BFDBFE" },
  { label: "S", height: 8, color: "#BFDBFE" },
  { label: "D", height: 10, color: "#1D4ED8", today: true },
];

export function beginnerLeagueBoard(
  name: string,
  avatarId?: string,
  initials?: string
): LeaguePlayer[] {
  return [
    {
      rank: 1,
      name,
      xp: 0,
      streak: 0,
      you: true,
      initials: (initials ?? initialsFromName(name)).toUpperCase(),
      avatarColor: "#1677FF",
      avatarId,
    },
  ];
}

/** Anciens comptes de test — plus utilisés. */
export const LOCAL_TEST_PROFILE_IDS: string[] = [];

export function isCloudProfileId(id: string | number): boolean {
  const s = String(id);
  return s.length >= 20 || /^[0-9a-f-]{36}$/i.test(s);
}

export function keepRealProfiles<T extends { id: string | number }>(profiles: T[]): T[] {
  return profiles.filter((p) => isCloudProfileId(p.id));
}

export const keepLocalTestProfiles = keepRealProfiles;

export function resolveLocalTestActiveId(
  profiles: { id: string | number }[],
  preferred?: string | number
): string {
  const id = String(preferred ?? "");
  if (id && profiles.some((p) => String(p.id) === id)) return id;
  return profiles[0] ? String(profiles[0].id) : "";
}

export const PARENT_NOTES: ParentNote[] = [
  { matiere: "Mathématiques", score: 14 },
  { matiere: "SVT", score: 16 },
  { matiere: "PCT", score: 12 },
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
    q: "C'est quoi un neurone ?",
    keywords: ["neurone", "dendrite", "axone", "myéline"],
    a: "Cellule nerveuse. Dendrites reçoivent, axone envoie. La myéline accélère. À la synapse, le message devient chimique. Ouvre le modèle 3D Neurone.",
  },
  {
    q: "C'est quoi une synapse ?",
    keywords: ["synapse", "neurone", "neurotransmetteur", "myéline"],
    a: "Contact entre deux neurones. L'influx électrique devient chimique : vésicules → neurotransmetteur → fente → récepteurs. Ouvre le modèle 3D Neurone / Synapse.",
  },
  {
    q: "Comment réviser efficacement ?",
    keywords: ["reviser", "réviser", "efficace", "methode", "méthode"],
    a: "Alterne Mode Guidé (cartes dues) et courtes sessions Blitz. La règle 10/10 garantit la maîtrise avant le Grand Quizz.",
  },
  {
    q: "C'est quoi le tuteur ?",
    keywords: ["tuteur", "chatbot", "ia", "assistant", "faq"],
    a: "Je suis un assistant distinct de Spira. Je vulgarise les notions. Les questions courantes passent par la FAQ hors ligne (illimitée) ; les autres comptent dans tes 5 questions cloud du jour.",
  },
  {
    q: "Que fait Spira ?",
    keywords: ["spira"],
    a: "Spira est la mascotte : elle illustre les notions avec des analogies. Moi je suis le tuteur, un chatbot à part — le gros bouton rond en bas à droite de l'Accueil.",
  },
  {
    q: "C'est quoi le Mode Guidé ?",
    keywords: ["guidé", "guide", "cartes dues"],
    a: "Le Mode Guidé te propose les flashcards dues aujourd'hui (algo des J). Il s'active dès qu'une carte est à réviser.",
  },
  {
    q: "Comment marche le Blitz ?",
    keywords: ["blitz", "60s", "60 s", "sprint", "duel"],
    a: "Blitz : un sprint solo de 60 secondes. Duel Blitz : tu invites un ami, vous entrez dans la même arène et vous jouez en même temps.",
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
  return "Je n'ai que des réponses locales pour l'instant. Essaie : discriminant, cœur, ADN, synapse, Spira, Mode Guidé, Blitz, 10/10, flashcards ou ligue.";
}
