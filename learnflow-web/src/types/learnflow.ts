export type ClasseAPC =
  | "6eme"
  | "5eme"
  | "4eme"
  | "3eme"
  | "2nde-A"
  | "2nde-S"
  | "1ere-A"
  | "1ere-C"
  | "1ere-D"
  | "Tle-A"
  | "Tle-C"
  | "Tle-D";

export type ModeApprentissage = "Libre" | "Guide" | "Cramming" | "Blitz";
export type LigueNom = "Bronze" | "Argent" | "Or" | "Platine" | "Diamant";
export type DifficulteFlash = "Facile" | "Moyen" | "Difficile";
export type TypeQuizz = "Assimilation" | "GrandQuizzChapitre";

export interface CompteUtilisateur {
  id: string;
  email: string;
  motDePasse: string;
  cleOTP2FA?: string;
}

export interface ProfileEleve {
  id: string;
  compteId: string;
  nom: string;
  firstName: string;
  lastName?: string;
  email?: string;
  classe: ClasseAPC | string;
  gradeLabel?: string;
  xpTotale: number;
  streak: number;
  rang: number;
  lessonsDone: number;
  badgesDebloques: string[];
  suiviParentalId?: number;
  color?: string;
  bg?: string;
  avatarId?: string;
  hasPin?: boolean;
  parentPhone?: string;
}

export type StudyModeId = "libre" | "guide" | "cramming" | "blitz";

export interface AgendaSession {
  id: string;
  subject: string;
  subjectColor: string;
  subjectBg: string;
  mode: StudyModeId;
  day: number;
  hour: number;
  minute: number;
  duration: number;
  reminderMin?: number;
}

export interface SchoolClass {
  id: string;
  subject: string;
  subjectColor: string;
  subjectBg: string;
  day: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  teacher?: string;
  room?: string;
}

export interface ProgrammeLesson {
  id: string;
  title: string;
  duration: string;
  xp: number;
  status: "done" | "current" | "locked";
}

export interface ProgrammeChapter {
  id: string;
  title: string;
  lessons: ProgrammeLesson[];
  /** Essentiel + Détails + quiz. 100 % only when all three are done. */
  progressDone?: number;
  progressTotal?: number;
}

export interface ProgrammeTheme {
  id: string;
  title: string;
  chapters: ProgrammeChapter[];
  lessonsTotal: number;
  lessonsDone: number;
}

export interface ProgrammeSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  progress: number;
  themes: ProgrammeTheme[];
}

/** Raccourci matière (maquette Accueil « Mes matières ») */
export interface SubjectShortcut {
  id: string;
  /** Libellé court sous la carte (Maths, PC, SVT…) */
  name: string;
  /** Nom complet dans « Voir tout » (Mathématiques…) */
  fullName?: string;
  progress: number;
  icon: string;
  colorScheme: string;
  slug: string;
}

export interface SubjectColorScheme {
  color: string;
  bg: string;
  border: string;
}

export interface SuiviParental {
  telParent: string;
  estSMSPassifActif: boolean;
  dernierSMSNotification: string | null;
}

export type InboxKind = "study" | "streak" | "league" | "repos" | "system" | "badge" | "challenge";

export interface InboxNotification {
  id: string;
  kind: InboxKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface Ligue {
  nomLigue: LigueNom;
  rangActuel: number;
  scoreHebdo: number;
  estGelee: boolean;
  groupe: number;
}

/** Encadré « Analogie de Spira » / « En d'autre terme ». */
export interface AnalogieSpiraData {
  /** Ruban court — ex. « EN D'AUTRE TERME » */
  kicker: string;
  titre: string;
  /** Réplique à la 1re personne, affichée dans la bulle. */
  parole: string;
  concept: string;
  exemple: string;
}

export interface SectionCoursAPC {
  id: string;
  titre: string;
  /** Paragraphes ; **mots** = termes cardinaux (gras bleu). */
  paragraphes: string[];
}

/** Schémas interactifs — réservés à la SVT. */
export type SchemaCoursKind = "2d" | "3d" | "both";

/** Bloc 1 d'En Détails — exemple du quotidien + compétence APC. */
export interface SituationProbleme {
  recit: string;
  question: string;
  competenceVisee: string;
}

export interface ExempleResoluEtape {
  titre: string;
  texte: string;
}

/** Bloc 3 d'En Détails — exercice type mené pas à pas. */
export interface ExempleResolu {
  enonce: string;
  etapes: ExempleResoluEtape[];
  reponseFinale: string;
}

/**
 * Deux corps de leçon sémantiquement distincts.
 * L'Essentiel n'est jamais une troncature d'En Détails.
 */
export interface LessonContent {
  id: string;
  title: string;
  /** Fiche réflexe < 300 mots, puces, [mots] à masquer pour le rappel actif. */
  essentialText: string;
  /** Cours APC développé (savoirs + savoir-faire), lecture continue. */
  detailedText: string;
}

export interface FicheCoursData {
  chapitreId: string;
  titre: string;
  matiereId: string;
  /** Fiche réflexe — jamais un extrait d'En Détails. */
  essentialText?: string;
  /** Savoirs + savoir-faire, lecture continue. */
  detailedText?: string;
  /** Compat catalogue / tutor / Prof — dérivé de essentialText si absent. */
  pucesEssentiel: string[];
  /** Compat Prof / overlay — dérivé de detailedText si absent. */
  sectionsDetaillees: SectionCoursAPC[];
  motsClesMasques: string[];
  analogie?: AnalogieSpiraData;
  schema?: SchemaCoursKind;
  situationProbleme?: SituationProbleme;
  exempleResolu?: ExempleResolu;
  miniQuiz?: QCMData[];
  estBioniqueActive?: boolean;
  ancreId?: string;
  /** @deprecated préfère essentialText */
  contenuEssentiel?: string;
  /** @deprecated préfère detailedText */
  contenuDetaille?: string;
}

export interface FlashcardData {
  id: string;
  recto: string;
  verso: string;
  intervalleRepetJ: number;
  prochaineRevision: string;
  difficulte: DifficulteFlash;
  due: boolean;
  chapitreId?: string;
  matiere?: string;
}

export interface QCMData {
  id: string;
  enonceQuestion: string;
  optionsProposees: string[];
  indexReponseCorrecte: number;
  explicationPedagogique: string;
  /** Une note par choix, même ordre que optionsProposees (revue après réponse). */
  optionNotes?: string[];
  ancreCours?: string;
  matiere?: string;
  /** Niveau Blitz (Facile / Moyen / Difficile). */
  difficulte?: DifficulteFlash;
}

export interface SchemaInteractifData {
  typeVisuel: "2D_SVT" | "3D_Modele";
  estDegradeActive: boolean;
  associationsCorrectes: Record<string, string>;
}

export interface VraiFauxData {
  assertion: string;
  reponseAttendue: boolean;
  explicationPedagogique: string;
}

export interface QuizzData {
  id: number;
  typeQuizz: TypeQuizz;
  questions: QCMData[];
  scoreRequis: number;
}

export interface SessionRevision {
  id: number;
  mode: ModeApprentissage;
  estRecettePersonnalisee: boolean;
  outilsSelectionnes: string[];
  tempsEcoule: number;
  chapitreId?: string;
  matiereId?: string;
}

export type OutilRevisionId =
  | "fiche"
  | "flashcards"
  | "qcm"
  | "schema"
  | "vraiFaux"
  | "trous";

export interface LessonStatus {
  id: string;
  title: string;
  duration: string;
  xp: number;
  status: "done" | "current" | "locked";
}

export interface ChapterProgress {
  chapitreId: string;
  assimilationScore: number | null;
  assimilationPerfect: boolean;
  grandQuizzUnlocked: boolean;
  grandQuizzLockedUntil: string | null;
  firstTryPerfect: boolean;
  /** Legacy: course page opened. Bars now use essentialRead / detailsRead / quiz. */
  read?: boolean;
  essentialRead?: boolean;
  detailsRead?: boolean;
}

export interface ParentNote {
  matiere: string;
  score: number;
}
