import type { QCMData } from "../types/learnflow";
import { ASSIMILATION_QCM } from "./mock";
import { findChapterMeta } from "./programme";

export type ClozeBlank = {
  id: string;
  answer: string;
  options: string[];
};

export type ClozeItem = {
  id: string;
  before: string;
  after: string;
  blank: ClozeBlank;
};

export type SchemaHotspot = {
  id: string;
  label: string;
  hint: string;
  /** Position en % dans le canvas */
  x: number;
  y: number;
};

export const CRAMMING_CHAPTERS: {
  id: string;
  subject: string;
  title: string;
  color: string;
  bg: string;
}[] = [
  { id: "digest", subject: "SVT", title: "La digestion", color: "#10B981", bg: "#ECFDF5" },
  { id: "eq2", subject: "Maths", title: "Équations du 2nd degré", color: "#1677FF", bg: "#E6F4FF" },
  { id: "cell", subject: "SVT", title: "La cellule", color: "#10B981", bg: "#ECFDF5" },
];

export const DIGESTION_QCM: QCMData[] = [
  {
    id: "d1",
    enonceQuestion: "Où commence la digestion chimique de l'amidon ?",
    optionsProposees: ["Estomac", "Bouche", "Intestin grêle", "Gros intestin"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "L'amylase salivaire commence à hydrolyser l'amidon dès la bouche.",
    ancreCours: "bouche",
    matiere: "SVT",
  },
  {
    id: "d2",
    enonceQuestion: "Quel tube relie la bouche à l'estomac ?",
    optionsProposees: ["Trachée", "Œsophage", "Duodénum", "Côlon"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "L'œsophage transporte le bol alimentaire par péristaltisme.",
    ancreCours: "oesophage",
    matiere: "SVT",
  },
  {
    id: "d3",
    enonceQuestion: "Quel est le rôle principal de l'estomac ?",
    optionsProposees: ["Absorber le glucose", "Stockage et digestion des protéines", "Produire la bile", "Absorber l'eau"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Le suc gastrique (pepsine + HCl) digère surtout les protéines.",
    ancreCours: "estomac",
    matiere: "SVT",
  },
  {
    id: "d4",
    enonceQuestion: "Où se fait l'essentiel de l'absorption des nutriments ?",
    optionsProposees: ["Estomac", "Gros intestin", "Intestin grêle", "Bouche"],
    indexReponseCorrecte: 2,
    explicationPedagogique: "Les villosités de l'intestin grêle maximisent la surface d'échange.",
    ancreCours: "grele",
    matiere: "SVT",
  },
  {
    id: "d5",
    enonceQuestion: "Quel organe produit la bile ?",
    optionsProposees: ["Pancréas", "Foie", "Estomac", "Rate"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Le foie sécrète la bile, stockée dans la vésicule, qui émulsionne les lipides.",
    ancreCours: "foie",
    matiere: "SVT",
  },
  {
    id: "d6",
    enonceQuestion: "Le pancréas déverse ses sucs dans…",
    optionsProposees: ["L'estomac", "Le duodénum", "Le côlon", "L'œsophage"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Le suc pancréatique arrive dans le duodénum (début de l'intestin grêle).",
    ancreCours: "pancreas",
    matiere: "SVT",
  },
  {
    id: "d7",
    enonceQuestion: "Quel est le rôle du gros intestin ?",
    optionsProposees: ["Digérer les protéines", "Absorber l'eau et former les selles", "Produire l'insuline", "Mâcher les aliments"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Le côlon réabsorbe l'eau et compacte les déchets.",
    ancreCours: "colon",
    matiere: "SVT",
  },
  {
    id: "d8",
    enonceQuestion: "La digestion mécanique, c'est…",
    optionsProposees: ["L'action des enzymes", "Le broyage (dents, brassage)", "L'absorption", "La photosynthèse"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Mécanique = découpage physique. Chimique = enzymes.",
    ancreCours: "mecanique",
    matiere: "SVT",
  },
  {
    id: "d9",
    enonceQuestion: "Les glucides simples passent dans le sang au niveau…",
    optionsProposees: ["Des villosités intestinales", "De la trachée", "Des alvéoles", "De la peau"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Après hydrolyse, glucose & co. traversent l'épithélium des villosités.",
    ancreCours: "grele",
    matiere: "SVT",
  },
  {
    id: "d10",
    enonceQuestion: "Sans bile, quelle digestion est gênée ?",
    optionsProposees: ["Des protéines", "Des lipides", "De l'amidon buccal", "De l'eau"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "La bile émulsionne les graisses pour que les lipases agissent.",
    ancreCours: "foie",
    matiere: "SVT",
  },
];

export const CELL_QCM: QCMData[] = [
  {
    id: "c1",
    enonceQuestion: "Quel organite contient l'ADN ?",
    optionsProposees: ["Mitochondrie", "Noyau", "Ribosome", "Vacuole"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Le noyau abrite le matériel génétique chez les eucaryotes.",
    matiere: "SVT",
  },
  {
    id: "c2",
    enonceQuestion: "Les mitochondries produisent surtout…",
    optionsProposees: ["L'ATP", "La bile", "L'amidon", "Le CO₂ atmosphérique"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "La respiration cellulaire y produit l'ATP, « monnaie » énergétique.",
    matiere: "SVT",
  },
  {
    id: "c3",
    enonceQuestion: "La membrane plasmique…",
    optionsProposees: ["Fabrique les protéines", "Contrôle les échanges avec le milieu", "Stocke l'ADN", "Digère les aliments"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Elle est semi-perméable : elle sélectionne ce qui entre et sort.",
    matiere: "SVT",
  },
  {
    id: "c4",
    enonceQuestion: "Les chloroplastes se trouvent chez…",
    optionsProposees: ["La cellule animale", "La cellule végétale", "Les bactéries uniquement", "Les virus"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Les chloroplastes assurent la photosynthèse dans les cellules végétales.",
    matiere: "SVT",
  },
  {
    id: "c5",
    enonceQuestion: "Le cytoplasme est…",
    optionsProposees: ["Le suc qui baigne les organites", "La paroi cellulosique", "Le noyau", "La bile"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Milieu intérieur de la cellule, entre membrane et noyau.",
    matiere: "SVT",
  },
  {
    id: "c6",
    enonceQuestion: "Les ribosomes servent à…",
    optionsProposees: ["La photosynthèse", "La synthèse des protéines", "Le stockage d'eau", "La division du noyau"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Ils traduisent l'ARN messager en protéines.",
    matiere: "SVT",
  },
  {
    id: "c7",
    enonceQuestion: "Une cellule eucaryote possède…",
    optionsProposees: ["Un noyau vrai", "Aucun organite", "Seulement de l'ADN libre", "Une cuticule"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Eucaryote = noyau délimité par une enveloppe.",
    matiere: "SVT",
  },
  {
    id: "c8",
    enonceQuestion: "La mitose produit…",
    optionsProposees: ["2 cellules filles identiques", "4 gamètes", "Une seule cellule", "Des anticorps"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Division conforme : 2 cellules à 2n chromosomes.",
    matiere: "SVT",
  },
  {
    id: "c9",
    enonceQuestion: "La paroi pecto-cellulosique est propre…",
    optionsProposees: ["À la cellule animale", "À la cellule végétale", "Au noyau", "Aux mitochondries"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Elle rigidifie la cellule végétale, en plus de la membrane.",
    matiere: "SVT",
  },
  {
    id: "c10",
    enonceQuestion: "L'énergie de la photosynthèse est captée par…",
    optionsProposees: ["L'hémoglobine", "La chlorophylle", "L'insuline", "La pepsine"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Le pigment vert des chloroplastes capte la lumière.",
    matiere: "SVT",
  },
];

const q = (
  id: string,
  enonceQuestion: string,
  optionsProposees: string[],
  indexReponseCorrecte: number,
  explicationPedagogique: string
): QCMData => ({
  id,
  enonceQuestion,
  optionsProposees,
  indexReponseCorrecte,
  explicationPedagogique,
  matiere: "SVT",
});

export const CIRCULATION_QCM: QCMData[] = [
  q("h1", "Combien de cavités a le cœur humain ?", ["2", "3", "4", "6"], 2, "Deux oreillettes et deux ventricules."),
  q("h2", "Quelle cavité a la paroi la plus épaisse ?", ["Oreillette droite", "Ventricule droit", "Oreillette gauche", "Ventricule gauche"], 3, "Le VG pompe vers tout le corps : muscle plus épais."),
  q("h3", "L'aorte part du…", ["Ventricule droit", "Ventricule gauche", "Oreillette droite", "Foie"], 1, "Grande circulation : VG → aorte."),
  q("h4", "L'artère pulmonaire transporte un sang…", ["Riche en O₂ vers le corps", "Pauvre en O₂ vers les poumons", "Riche en O₂ vers les poumons", "Pauvre en O₂ vers le foie"], 1, "Exception : artère mais sang « bleu » vers les poumons."),
  q("h5", "Le septum interventriculaire sert à…", ["Mélanger les deux sangs", "Empêcher le mélange des deux sangs", "Produire la bile", "Filtrer l'urine"], 1, "Cloison étanche entre VD et VG."),
  q("h6", "Les veines caves aboutissent dans…", ["L'oreillette droite", "L'oreillette gauche", "Le ventricule gauche", "L'aorte"], 0, "Retour veineux de la grande circulation vers l'OD."),
  q("h7", "La valve mitrale sépare…", ["OD et VD", "OG et VG", "VD et artère pulmonaire", "VG et aorte"], 1, "Valve auriculo-ventriculaire gauche."),
  q("h8", "La petite circulation relie le cœur…", ["Au cerveau", "Aux poumons", "Aux reins", "À l'intestin"], 1, "VD → poumons → OG."),
  q("h9", "Les veines pulmonaires ramènent un sang…", ["Pauvre en O₂ à l'OD", "Riche en O₂ à l'OG", "Pauvre en O₂ au VG", "Riche en O₂ à l'aorte"], 1, "Après hématose, sang rouge vers l'oreillette gauche."),
  q("h10", "La valve tricuspide est située…", ["À gauche", "À droite", "Dans l'aorte", "Dans le foie"], 1, "Entre oreillette et ventricule droits."),
];

export const NERVEUX_QCM: QCMData[] = [
  q("n1", "Les dendrites servent surtout à…", ["Émettre l'influx", "Recevoir les messages", "Produire la myéline", "Filtrer le sang"], 1, "Arborisation réceptrice autour du corps cellulaire."),
  q("n2", "L'axone est…", ["Toujours multiple", "La fibre unique qui conduit l'influx", "Le noyau", "Une valve du cœur"], 1, "Un neurone : un axone, plusieurs dendrites."),
  q("n3", "La gaine de myéline…", ["Ralentit l'influx", "Accélère la conduction", "Digère les protéines", "Produit l'insuline"], 1, "Conduction saltatoire d'un nœud de Ranvier à l'autre."),
  q("n4", "Un nœud de Ranvier est…", ["Un gap dans la myéline", "Le noyau", "Une synapse électrique uniquement", "Un os du crâne"], 0, "Interruption de gaine : relance du potentiel d'action."),
  q("n5", "À la synapse, le message devient…", ["Uniquement électrique", "Chimique (neurotransmetteur)", "Lumineux", "Hormonal thyroïdien"], 1, "Vésicules → fente → récepteurs."),
  q("n6", "Les vésicules synaptiques contiennent…", ["L'ADN", "Des neurotransmetteurs", "De la bile", "De l'urine"], 1, "Sacs d'exocytose dans le bouton présynaptique."),
  q("n7", "Le cône d'implantation est…", ["La zone gâchette de l'axone", "Une pyramide du rein", "Une valve", "Un chromosome"], 0, "Naissance du potentiel d'action."),
  q("n8", "Un récepteur ligand-dépendant s'ouvre quand…", ["On coupe l'axone", "Le neurotransmetteur se fixe", "Le sang est trop acide", "Il fait nuit"], 1, "Canal de la membrane postsynaptique."),
  q("n9", "L'arc réflexe met en jeu…", ["Uniquement le cerveau conscient", "Récepteur, centre, effecteur", "Seulement les hormones", "Les reins seuls"], 1, "Circuit court, souvent médullaire."),
  q("n10", "La fente synaptique est…", ["L'espace entre deux neurones", "Le noyau", "L'aorte", "Le bassinet"], 0, "L'influx n'y passe pas en continu : messager chimique."),
];

export const EXCRETION_QCM: QCMData[] = [
  q("r1", "L'urine est fabriquée dans…", ["Le foie", "Les reins", "L'estomac", "Les poumons"], 1, "Filtration du sang par les reins."),
  q("r2", "La capsule du rein est…", ["L'enveloppe externe", "Un calice", "L'uretère", "L'aorte"], 0, "Tunique protectrice."),
  q("r3", "Les pyramides de Malpighi se trouvent…", ["Dans le cortex uniquement", "Dans la médulla", "Dans la vessie", "Dans l'oreillette"], 1, "Structures en éventail de la médulla."),
  q("r4", "Le bassinet…", ["Produit l'insuline", "Collecte l'urine avant l'uretère", "Pompe le sang", "Conduit l'influx"], 1, "Entonnoir central du hile."),
  q("r5", "L'uretère relie…", ["Rein et vessie", "Cœur et poumon", "Foie et intestin", "Oreille et cerveau"], 0, "Descente de l'urine."),
  q("r6", "L'artère rénale apporte…", ["L'urine", "Le sang à filtrer", "La bile", "Les neurotransmetteurs"], 1, "Branche de l'aorte vers le rein."),
  q("r7", "La papille est…", ["La pointe d'une pyramide", "Une valve cardiaque", "Un nœud de Ranvier", "Une base de l'ADN"], 0, "Égouttement vers le calice."),
  q("r8", "Le cortex rénal est…", ["La zone externe de filtration", "L'uretère", "Le septum", "L'axone"], 0, "Glomérules dans le cortex."),
  q("r9", "La veine rénale ramène…", ["L'urine à la vessie", "Le sang filtré vers la veine cave", "Le sang vers les poumons", "La lymphe au cœur"], 1, "Sang « nettoyé » hors du hile."),
  q("r10", "Un calice sert à…", ["Recevoir l'urine d'une papille", "Contracter le ventricule", "Isoler l'axone", "Coder un gène"], 0, "Cupule de collecte."),
];

export const ADN_QCM: QCMData[] = [
  q("d1", "L'ADN a la forme d'une…", ["Simple chaîne linéaire uniquement", "Double hélice", "Sphère pleine", "Valve"], 1, "Deux brins enroulés."),
  q("d2", "La base A s'associe toujours à…", ["G", "C", "T", "U dans l'ADN"], 2, "Adénine — Thymine."),
  q("d3", "La paire G–C est liée par…", ["1 liaison hydrogène", "2 liaisons hydrogène", "3 liaisons hydrogène", "Une liaison peptidique"], 2, "Plus stable que A–T (2 liaisons)."),
  q("d4", "Un gène est…", ["Un organe", "Un segment d'ADN qui code un caractère", "Une hormone", "Un os"], 1, "Unité d'information héréditaire."),
  q("d5", "Le squelette de chaque brin est…", ["Protéine contractile", "Sucre-phosphate", "Lipide membranaire", "Hémoglobine"], 1, "Montants de l'échelle."),
  q("d6", "Une mutation est…", ["Un changement de l'ADN", "Une digestion", "Un réflexe", "Un calice"], 0, "Altération de la séquence, parfois d'un caractère."),
  q("d7", "Le crossing-over a lieu pendant…", ["La mitose anaphase", "La prophase I de méiose", "La digestion", "La systole"], 1, "Brassage intrachromosomique."),
  q("d8", "La méiose produit des cellules…", ["2n identiques", "n (haploïdes)", "Toujours cancéreuses", "Sans ADN"], 1, "Quatre gamètes à n chromosomes."),
  q("d9", "Complémentarité : C va avec…", ["A", "T", "G", "U dans l'ADN"], 2, "Cytosine — Guanine."),
  q("d10", "Le brassage interchromosomique, c'est…", ["La répartition aléatoire des homologues", "La digestion de l'amidon", "L'ouverture d'un canal", "La filtration glomérulaire"], 0, "Anaphase I : chaque pôle reçoit un homologue au hasard."),
];

export const COMPLEXES_QCM: QCMData[] = [
  {
    id: "k1",
    enonceQuestion: "i² vaut ?",
    optionsProposees: ["1", "−1", "i", "0"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Par définition, i² = −1.",
    matiere: "Maths",
  },
  {
    id: "k2",
    enonceQuestion: "Le module de z = 3 + 4i vaut ?",
    optionsProposees: ["5", "7", "12", "1"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "|z| = √(9+16) = 5.",
    matiere: "Maths",
  },
  {
    id: "k3",
    enonceQuestion: "Le conjugué de 2 − 5i est ?",
    optionsProposees: ["2 + 5i", "−2 − 5i", "5 − 2i", "2 − 5i"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "On change le signe de la partie imaginaire.",
    matiere: "Maths",
  },
  {
    id: "k4",
    enonceQuestion: "z = |z| e^{iθ} est la forme…",
    optionsProposees: ["Algébrique", "Exponentielle", "Cartésienne brute", "Polynomiale"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Forme exponentielle d'un complexe non nul.",
    matiere: "Maths",
  },
  {
    id: "k5",
    enonceQuestion: "Multiplier par i géométriquement, c'est…",
    optionsProposees: ["Homothétie de rapport 2", "Rotation de 90°", "Translation", "Symétrie centrale"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Arg(i) = π/2 : rotation d'un quart de tour.",
    matiere: "Maths",
  },
  {
    id: "k6",
    enonceQuestion: "Si z = a + ib, |z|² = ?",
    optionsProposees: ["a + b", "a² + b²", "a² − b²", "2ab"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "|z|² = z z̄ = a² + b².",
    matiere: "Maths",
  },
  {
    id: "k7",
    enonceQuestion: "L'argument d'un complexe est…",
    optionsProposees: ["Sa partie réelle", "L'angle du vecteur image", "Son module", "i²"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Angle (Ox, vecteur image), modulo 2π.",
    matiere: "Maths",
  },
  {
    id: "k8",
    enonceQuestion: "z × z̄ = ?",
    optionsProposees: ["0", "|z|²", "2z", "i"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Produit d'un complexe par son conjugué = carré du module.",
    matiere: "Maths",
  },
  {
    id: "k9",
    enonceQuestion: "La forme algébrique de e^{iπ} est ?",
    optionsProposees: ["1", "−1", "i", "0"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Formule d'Euler : e^{iπ} = −1.",
    matiere: "Maths",
  },
  {
    id: "k10",
    enonceQuestion: "Deux complexes sont égaux ssi…",
    optionsProposees: ["Leurs modules sont égaux", "Parties réelles et imaginaires égales", "Leurs arguments sont égaux", "Leur somme est nulle"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "a+ib = c+id ⇔ a=c et b=d.",
    matiere: "Maths",
  },
];

export function questionsForChapter(chapterId: string): QCMData[] {
  if (chapterId === "digest") return DIGESTION_QCM;
  if (chapterId === "cell") return CELL_QCM;
  if (chapterId === "circulation") return CIRCULATION_QCM;
  if (chapterId === "nerveux" || chapterId === "neurones") return NERVEUX_QCM;
  if (chapterId === "excretion" || chapterId === "glycemie") return EXCRETION_QCM;
  if (chapterId === "adn" || chapterId === "brassage" || chapterId === "gene") return ADN_QCM;
  if (chapterId === "complexes") return COMPLEXES_QCM;
  return ASSIMILATION_QCM;
}

export const CLOZE_BY_CHAPTER: Record<string, ClozeItem[]> = {
  digest: [
    {
      id: "cl1",
      before: "La digestion de l'amidon commence dans la ",
      after: " grâce à l'amylase salivaire.",
      blank: { id: "b1", answer: "bouche", options: ["bouche", "foie", "côlon", "trachée"] },
    },
    {
      id: "cl2",
      before: "Le bol alimentaire descend par l'",
      after: " jusqu'à l'estomac.",
      blank: { id: "b2", answer: "œsophage", options: ["œsophage", "intestin", "artère", "pancréas"] },
    },
    {
      id: "cl3",
      before: "Dans l'estomac, la ",
      after: " attaque surtout les protéines.",
      blank: { id: "b3", answer: "pepsine", options: ["pepsine", "amylase", "bile", "insuline"] },
    },
    {
      id: "cl4",
      before: "L'absorption des nutriments a lieu dans l'",
      after: ".",
      blank: { id: "b4", answer: "intestin grêle", options: ["intestin grêle", "œsophage", "bouche", "vessie"] },
    },
    {
      id: "cl5",
      before: "Le foie produit la ",
      after: ", qui émulsionne les lipides.",
      blank: { id: "b5", answer: "bile", options: ["bile", "salive", "lympe", "urée"] },
    },
  ],
  eq2: [
    {
      id: "eq1",
      before: "Le ",
      after: " Δ = b² − 4ac décide du nombre de racines.",
      blank: { id: "e1", answer: "discriminant", options: ["discriminant", "périmètre", "gradient", "quotient"] },
    },
    {
      id: "eq2c",
      before: "Si Δ > 0, l'équation a ",
      after: " racines réelles distinctes.",
      blank: { id: "e2", answer: "deux", options: ["deux", "zéro", "une", "quatre"] },
    },
    {
      id: "eq3",
      before: "Si Δ = 0, on a une racine ",
      after: ".",
      blank: { id: "e3", answer: "double", options: ["double", "imaginaire", "nulle", "négative"] },
    },
    {
      id: "eq4",
      before: "La somme des racines vaut ",
      after: ".",
      blank: { id: "e4", answer: "−b/a", options: ["−b/a", "c/a", "b/a", "−c/a"] },
    },
    {
      id: "eq5",
      before: "Le produit des racines vaut ",
      after: ".",
      blank: { id: "e5", answer: "c/a", options: ["c/a", "−b/a", "2a", "√Δ"] },
    },
  ],
  cell: [
    {
      id: "ce1",
      before: "Le ",
      after: " contient l'ADN de la cellule eucaryote.",
      blank: { id: "k1", answer: "noyau", options: ["noyau", "ribosome", "vacuole", "cil"] },
    },
    {
      id: "ce2",
      before: "Les ",
      after: " produisent l'ATP par respiration.",
      blank: { id: "k2", answer: "mitochondries", options: ["mitochondries", "lysosomes", "cils", "centrioles"] },
    },
    {
      id: "ce3",
      before: "La membrane ",
      after: " contrôle les échanges.",
      blank: { id: "k3", answer: "plasmique", options: ["plasmique", "nucléaire seule", "basale", "séreuse"] },
    },
  ],
  circulation: [
    {
      id: "ci1",
      before: "Le ventricule ",
      after: " a la paroi la plus épaisse.",
      blank: { id: "h1", answer: "gauche", options: ["gauche", "droit", "médian", "pulmonaire"] },
    },
    {
      id: "ci2",
      before: "L'",
      after: " envoie le sang oxygéné vers le corps.",
      blank: { id: "h2", answer: "aorte", options: ["aorte", "veine cave", "artère pulmonaire", "valve"] },
    },
    {
      id: "ci3",
      before: "Le ",
      after: " empêche le mélange des deux sangs.",
      blank: { id: "h3", answer: "septum", options: ["septum", "foie", "bassinet", "axone"] },
    },
  ],
  nerveux: [
    {
      id: "nv1",
      before: "Les ",
      after: " reçoivent les messages des autres neurones.",
      blank: { id: "n1", answer: "dendrites", options: ["dendrites", "valves", "calices", "pyramides"] },
    },
    {
      id: "nv2",
      before: "La gaine de ",
      after: " accélère l'influx nerveux.",
      blank: { id: "n2", answer: "myéline", options: ["myéline", "bile", "pepsine", "insuline"] },
    },
    {
      id: "nv3",
      before: "À la ",
      after: ", le message devient chimique.",
      blank: { id: "n3", answer: "synapse", options: ["synapse", "aorte", "capsule", "oreillette"] },
    },
  ],
  neurones: [
    {
      id: "ne1",
      before: "Le potentiel d'action naît au cône d'",
      after: ".",
      blank: { id: "p1", answer: "implantation", options: ["implantation", "Malpighi", "aorte", "ovaire"] },
    },
    {
      id: "ne2",
      before: "Le ",
      after: " est libéré dans la fente synaptique.",
      blank: { id: "p2", answer: "neurotransmetteur", options: ["neurotransmetteur", "glucose", "urine", "sebum"] },
    },
  ],
  adn: [
    {
      id: "dn1",
      before: "L'ADN a une structure en double ",
      after: ".",
      blank: { id: "a1", answer: "hélice", options: ["hélice", "valve", "synapse", "pyramide"] },
    },
    {
      id: "dn2",
      before: "L'adénine s'associe toujours à la ",
      after: ".",
      blank: { id: "a2", answer: "thymine", options: ["thymine", "guanine", "cytosine", "uracile"] },
    },
  ],
  brassage: [
    {
      id: "br1",
      before: "Le crossing-over a lieu en prophase ",
      after: " de la méiose.",
      blank: { id: "b1", answer: "I", options: ["I", "II", "III", "0"] },
    },
    {
      id: "br2",
      before: "La méiose produit des cellules ",
      after: ".",
      blank: { id: "b2", answer: "haploïdes", options: ["haploïdes", "diploïdes", "sans noyau", "végétatives"] },
    },
  ],
  excretion: [
    {
      id: "ex1",
      before: "L'urine est collectée dans le ",
      after: " avant l'uretère.",
      blank: { id: "x1", answer: "bassinet", options: ["bassinet", "ventricule", "noyau", "axone"] },
    },
    {
      id: "ex2",
      before: "L'",
      after: " relie le rein à la vessie.",
      blank: { id: "x2", answer: "uretère", options: ["uretère", "aorte", "axone", "œsophage"] },
    },
  ],
  complexes: [
    {
      id: "cx1",
      before: "i² est égal à ",
      after: ".",
      blank: { id: "c1", answer: "−1", options: ["−1", "1", "0", "i"] },
    },
    {
      id: "cx2",
      before: "Le ",
      after: " de z = a + ib vaut √(a² + b²).",
      blank: { id: "c2", answer: "module", options: ["module", "argument", "conjugué", "discriminant"] },
    },
  ],
};

export function clozeForChapter(chapterId: string): ClozeItem[] {
  if (chapterId === "glycemie") return CLOZE_BY_CHAPTER.excretion;
  if (chapterId === "gene") return CLOZE_BY_CHAPTER.adn;
  return CLOZE_BY_CHAPTER[chapterId] ?? CLOZE_BY_CHAPTER.digest;
}

export const DIGEST_HOTSPOTS: SchemaHotspot[] = [
  { id: "bouche", label: "Bouche", hint: "Mastication + amylase", x: 50, y: 8 },
  { id: "oesophage", label: "Œsophage", hint: "Tube vers l'estomac", x: 50, y: 24 },
  { id: "estomac", label: "Estomac", hint: "Pepsine + HCl", x: 38, y: 42 },
  { id: "foie", label: "Foie", hint: "Produit la bile", x: 62, y: 40 },
  { id: "grele", label: "Intestin grêle", hint: "Absorption", x: 48, y: 62 },
  { id: "colon", label: "Gros intestin", hint: "Réabsorption d'eau", x: 70, y: 78 },
];

export const CELL_ORGANELLES: {
  id: string;
  label: string;
  role: string;
  color: string;
}[] = [
  { id: "noyau", label: "Noyau", role: "Centre de commande, ADN", color: "#1677FF" },
  { id: "mito", label: "Mitochondrie", role: "Centrale énergétique (ATP)", color: "#F59E0B" },
  { id: "membrane", label: "Membrane", role: "Frontière semi-perméable", color: "#10B981" },
  { id: "cyto", label: "Cytoplasme", role: "Milieu intérieur", color: "#06B6D4" },
  { id: "ribo", label: "Ribosome", role: "Usine à protéines", color: "#8B5CF6" },
];

export function chapterTitle(chapterId: string) {
  return findChapterMeta(chapterId)?.chapter.title
    ?? CRAMMING_CHAPTERS.find((c) => c.id === chapterId)?.title
    ?? "Chapitre";
}

export function chapterSubject(chapterId: string) {
  const name = findChapterMeta(chapterId)?.subject.name;
  if (name === "Mathématiques") return "Maths";
  if (name === "Histoire-Géographie") return "H-G";
  return name ?? CRAMMING_CHAPTERS.find((c) => c.id === chapterId)?.subject ?? "";
}
