import type { QCMData } from "../types/learnflow";
import { ASSIMILATION_QCM } from "./mock";
import { findChapterMeta } from "./programme";
import { overlayQuiz } from "./publishedCache";
import { clozeFromLesson, isDeltaQuiz, quizFromLesson, shuffleClozeItems, shuffleQuizOptions, shuffleQuizOrder, VECTEURS_QCM, withOptionNotes } from "./quizFromLesson";

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
    enonceQuestion: "Où le pancréas déverse-t-il ses sucs ?",
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
    enonceQuestion: "Qu'est-ce que la digestion mécanique ?",
    optionsProposees: ["L'action des enzymes", "Le broyage (dents, brassage)", "L'absorption", "La photosynthèse"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Mécanique = découpage physique. Chimique = enzymes.",
    ancreCours: "mecanique",
    matiere: "SVT",
  },
  {
    id: "d9",
    enonceQuestion: "À quel niveau les glucides simples passent-ils dans le sang ?",
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
    enonceQuestion: "Que produisent surtout les mitochondries ?",
    optionsProposees: ["L'ATP", "La bile", "L'amidon", "Le CO₂ atmosphérique"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "La respiration cellulaire y produit l'ATP, « monnaie » énergétique.",
    matiere: "SVT",
  },
  {
    id: "c3",
    enonceQuestion: "Quel est le rôle de la membrane plasmique ?",
    optionsProposees: ["Fabrique les protéines", "Contrôle les échanges avec le milieu", "Stocke l'ADN", "Digère les aliments"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Elle est semi-perméable : elle sélectionne ce qui entre et sort.",
    matiere: "SVT",
  },
  {
    id: "c4",
    enonceQuestion: "Où trouve-t-on des chloroplastes ?",
    optionsProposees: ["La cellule animale", "La cellule végétale", "Les bactéries uniquement", "Les virus"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Les chloroplastes assurent la photosynthèse dans les cellules végétales.",
    matiere: "SVT",
  },
  {
    id: "c5",
    enonceQuestion: "Qu'est-ce que le cytoplasme ?",
    optionsProposees: ["Le suc qui baigne les organites", "La paroi cellulosique", "Le noyau", "La bile"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Milieu intérieur de la cellule, entre membrane et noyau.",
    matiere: "SVT",
  },
  {
    id: "c6",
    enonceQuestion: "À quoi servent les ribosomes ?",
    optionsProposees: ["La photosynthèse", "La synthèse des protéines", "Le stockage d'eau", "La division du noyau"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Ils traduisent l'ARN messager en protéines.",
    matiere: "SVT",
  },
  {
    id: "c7",
    enonceQuestion: "Que possède une cellule eucaryote ?",
    optionsProposees: ["Un noyau vrai", "Aucun organite", "Seulement de l'ADN libre", "Une cuticule"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Eucaryote = noyau délimité par une enveloppe.",
    matiere: "SVT",
  },
  {
    id: "c8",
    enonceQuestion: "Que produit une mitose ?",
    optionsProposees: ["2 cellules filles identiques", "4 gamètes", "Une seule cellule", "Des anticorps"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "Division conforme : 2 cellules à 2n chromosomes.",
    matiere: "SVT",
  },
  {
    id: "c9",
    enonceQuestion: "À quel type de cellule la paroi pecto-cellulosique est-elle propre ?",
    optionsProposees: ["À la cellule animale", "À la cellule végétale", "Au noyau", "Aux mitochondries"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Elle rigidifie la cellule végétale, en plus de la membrane.",
    matiere: "SVT",
  },
  {
    id: "c10",
    enonceQuestion: "Quel pigment capte l'énergie de la photosynthèse ?",
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
): QCMData =>
  withOptionNotes({
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
  q("h3", "De quelle cavité part l'aorte ?", ["Le ventricule droit", "Le ventricule gauche", "L'oreillette droite", "Le foie"], 1, "Grande circulation : ventricule gauche, puis aorte."),
  q("h4", "Quel sang l'artère pulmonaire transporte-t-elle ?", ["Un sang riche en O₂ vers le corps", "Un sang pauvre en O₂ vers les poumons", "Un sang riche en O₂ vers les poumons", "Un sang pauvre en O₂ vers le foie"], 1, "Exception : c'est une artère, mais elle conduit un sang pauvre en dioxygène vers les poumons."),
  q("h5", "À quoi sert le septum interventriculaire ?", ["À mélanger les deux sangs", "À empêcher le mélange des deux sangs", "À produire la bile", "À filtrer l'urine"], 1, "C'est la cloison étanche entre le ventricule droit et le ventricule gauche."),
  q("h6", "Où aboutissent les veines caves ?", ["Dans l'oreillette droite", "Dans l'oreillette gauche", "Dans le ventricule gauche", "Dans l'aorte"], 0, "Le sang de la grande circulation revient à l'oreillette droite."),
  q("h7", "Quelles cavités la valve mitrale sépare-t-elle ?", ["L'oreillette droite et le ventricule droit", "L'oreillette gauche et le ventricule gauche", "Le ventricule droit et l'artère pulmonaire", "Le ventricule gauche et l'aorte"], 1, "C'est la valve auriculo-ventriculaire gauche."),
  q("h8", "À quels organes la petite circulation relie-t-elle le cœur ?", ["Au cerveau", "Aux poumons", "Aux reins", "À l'intestin"], 1, "Ventricule droit, poumons, puis oreillette gauche."),
  q("h9", "Quel sang les veines pulmonaires ramènent-elles, et vers où ?", ["Un sang pauvre en O₂ vers l'oreillette droite", "Un sang riche en O₂ vers l'oreillette gauche", "Un sang pauvre en O₂ vers le ventricule gauche", "Un sang riche en O₂ vers l'aorte"], 1, "Après l'hématose, le sang oxygéné arrive dans l'oreillette gauche."),
  q("h10", "Où se situe la valve tricuspide ?", ["À gauche du cœur", "À droite du cœur", "Dans l'aorte", "Dans le foie"], 1, "Elle est entre l'oreillette droite et le ventricule droit."),
];

export const NERVEUX_QCM: QCMData[] = [
  q("n1", "À quoi servent les dendrites ?", ["À émettre l'influx", "À recevoir les messages", "À produire la myéline", "À filtrer le sang"], 1, "Elles sont l'entrée du neurone."),
  q("n2", "Qu'est-ce que l'axone ?", ["Une fibre toujours multiple", "La fibre unique qui conduit l'influx", "Le noyau du neurone", "Une valve du cœur"], 1, "Un neurone possède un seul axone."),
  q("n3", "Quel est l'effet de la gaine de myéline ?", ["Elle ralentit l'influx", "Elle accélère la conduction", "Elle digère les protéines", "Elle produit l'insuline"], 1, "L'influx saute d'un nœud de Ranvier à l'autre."),
  q("n4", "Qu'est-ce qu'un nœud de Ranvier ?", ["Une interruption de la myéline", "Le noyau du neurone", "Une synapse", "Un os du crâne"], 0, "L'influx nerveux y est relancé."),
  q("n5", "Que devient le message nerveux à la synapse ?", ["Il reste uniquement électrique", "Il devient chimique, grâce à un neurotransmetteur", "Il devient lumineux", "Il devient hormonal"], 1, "Des vésicules libèrent le neurotransmetteur dans la fente, vers les récepteurs."),
  q("n6", "Que contiennent les vésicules synaptiques ?", ["De l'ADN", "Des neurotransmetteurs", "De la bile", "De l'urine"], 1, "Ce sont les sacs du bouton synaptique."),
  q("n7", "Qu'est-ce que le cône d'implantation ?", ["L'endroit où naît l'influx", "Une pyramide du rein", "Une valve cardiaque", "Un chromosome"], 0, "C'est le départ de l'axone."),
  q("n8", "Quand un récepteur synaptique s'ouvre-t-il ?", ["Quand on coupe l'axone", "Quand le neurotransmetteur se fixe", "Quand le sang est trop acide", "Quand il fait nuit"], 1, "C'est un canal de la membrane du neurone suivant."),
  q("n9", "Dans quel sens le message circule-t-il dans un neurone ?", ["Dans les deux sens", "Des dendrites vers l'axone, puis la synapse", "De la synapse vers les dendrites", "Uniquement dans le sang"], 1, "Le message ne circule que dans un seul sens."),
  q("n10", "Qu'est-ce que la fente synaptique ?", ["L'espace entre deux neurones", "Le noyau", "L'aorte", "Le bassinet"], 0, "Le messager chimique la traverse."),
];

export const EXCRETION_QCM: QCMData[] = [
  q("r1", "Où l'urine est-elle fabriquée ?", ["Dans le foie", "Dans les reins", "Dans l'estomac", "Dans les poumons"], 1, "Les reins filtrent le sang pour produire l'urine."),
  q("r2", "Qu'est-ce que la capsule du rein ?", ["L'enveloppe externe", "Un calice", "L'uretère", "L'aorte"], 0, "C'est la tunique protectrice du rein."),
  q("r3", "Où se trouvent les pyramides de Malpighi ?", ["Dans le cortex uniquement", "Dans la médulla", "Dans la vessie", "Dans l'oreillette"], 1, "Ce sont des structures en éventail de la médulla."),
  q("r4", "Quel est le rôle du bassinet ?", ["Produire l'insuline", "Collecter l'urine avant l'uretère", "Pomper le sang", "Conduire l'influx nerveux"], 1, "C'est l'entonnoir central du hile."),
  q("r5", "Quels organes l'uretère relie-t-il ?", ["Le rein et la vessie", "Le cœur et le poumon", "Le foie et l'intestin", "L'oreille et le cerveau"], 0, "L'urine descend du rein vers la vessie."),
  q("r6", "Qu'apporte l'artère rénale ?", ["L'urine", "Le sang à filtrer", "La bile", "Les neurotransmetteurs"], 1, "C'est une branche de l'aorte vers le rein."),
  q("r7", "Qu'est-ce que la papille rénale ?", ["La pointe d'une pyramide", "Une valve cardiaque", "Un nœud de Ranvier", "Une base de l'ADN"], 0, "L'urine s'y égoutte vers le calice."),
  q("r8", "Qu'est-ce que le cortex rénal ?", ["La zone externe de filtration", "L'uretère", "Le septum", "L'axone"], 0, "Les glomérules se trouvent dans le cortex."),
  q("r9", "Que ramène la veine rénale ?", ["L'urine vers la vessie", "Le sang filtré vers la veine cave", "Le sang vers les poumons", "La lymphe vers le cœur"], 1, "Le sang filtré quitte le rein par le hile."),
  q("r10", "À quoi sert un calice rénal ?", ["À recevoir l'urine d'une papille", "À contracter le ventricule", "À isoler l'axone", "À coder un gène"], 0, "C'est une cupule de collecte."),
];

export const ADN_QCM: QCMData[] = [
  q("d1", "Quelle est la forme de l'ADN ?", ["Une simple chaîne linéaire", "Une double hélice", "Une sphère pleine", "Une valve"], 1, "Deux brins s'enroulent l'un autour de l'autre."),
  q("d2", "Avec quelle base l'adénine (A) s'associe-t-elle toujours dans l'ADN ?", ["G", "C", "T", "U"], 2, "L'adénine s'associe à la thymine."),
  q("d3", "Par combien de liaisons hydrogène la paire G–C est-elle liée ?", ["1 liaison hydrogène", "2 liaisons hydrogène", "3 liaisons hydrogène", "Une liaison peptidique"], 2, "G–C est plus stable que A–T, qui n'a que 2 liaisons."),
  q("d4", "Qu'est-ce qu'un gène ?", ["Un organe", "Un segment d'ADN qui code un caractère", "Une hormone", "Un os"], 1, "C'est une unité d'information héréditaire."),
  q("d5", "De quoi est fait le squelette de chaque brin d'ADN ?", ["De protéine contractile", "De sucre et de phosphate", "De lipide membranaire", "D'hémoglobine"], 1, "Ce sont les montants de l'échelle."),
  q("d6", "Qu'est-ce qu'une mutation ?", ["Un changement de l'ADN", "Une digestion", "Un réflexe", "Un calice"], 0, "C'est une modification de la séquence, qui peut changer un caractère."),
  q("d7", "À quel moment le crossing-over a-t-il lieu ?", ["Pendant l'anaphase de la mitose", "Pendant la prophase I de la méiose", "Pendant la digestion", "Pendant la systole"], 1, "Il réalise le brassage intrachromosomique."),
  q("d8", "Quelles cellules la méiose produit-elle ?", ["Des cellules 2n identiques", "Des cellules n, haploïdes", "Des cellules toujours cancéreuses", "Des cellules sans ADN"], 1, "Elle produit quatre gamètes à n chromosomes."),
  q("d9", "Avec quelle base la cytosine (C) s'associe-t-elle ?", ["A", "T", "G", "U"], 2, "La cytosine s'associe à la guanine."),
  q("d10", "Qu'est-ce que le brassage interchromosomique ?", ["La répartition aléatoire des chromosomes homologues", "La digestion de l'amidon", "L'ouverture d'un canal", "La filtration glomérulaire"], 0, "À l'anaphase I, chaque pôle reçoit un homologue au hasard."),
];

export const COMPLEXES_QCM: QCMData[] = [
  {
    id: "k1",
    enonceQuestion: "Que vaut i² ?",
    optionsProposees: ["1", "−1", "i", "0"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Par définition, i² = −1.",
    matiere: "Maths",
  },
  {
    id: "k2",
    enonceQuestion: "Que vaut le module de z = 3 + 4i ?",
    optionsProposees: ["5", "7", "12", "1"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "|z| = √(9+16) = 5.",
    matiere: "Maths",
  },
  {
    id: "k3",
    enonceQuestion: "Quel est le conjugué de 2 − 5i ?",
    optionsProposees: ["2 + 5i", "−2 − 5i", "5 − 2i", "2 − 5i"],
    indexReponseCorrecte: 0,
    explicationPedagogique: "On change le signe de la partie imaginaire.",
    matiere: "Maths",
  },
  {
    id: "k4",
    enonceQuestion: "Comment appelle-t-on la forme z = |z| e^{iθ} ?",
    optionsProposees: ["Algébrique", "Exponentielle", "Cartésienne brute", "Polynomiale"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Forme exponentielle d'un complexe non nul.",
    matiere: "Maths",
  },
  {
    id: "k5",
    enonceQuestion: "Que représente, géométriquement, une multiplication par i ?",
    optionsProposees: ["Homothétie de rapport 2", "Rotation de 90°", "Translation", "Symétrie centrale"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Arg(i) = π/2 : rotation d'un quart de tour.",
    matiere: "Maths",
  },
  {
    id: "k6",
    enonceQuestion: "Si z = a + ib, que vaut |z|² ?",
    optionsProposees: ["a + b", "a² + b²", "a² − b²", "2ab"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "|z|² = z z̄ = a² + b².",
    matiere: "Maths",
  },
  {
    id: "k7",
    enonceQuestion: "Qu'est-ce que l'argument d'un nombre complexe ?",
    optionsProposees: ["Sa partie réelle", "L'angle du vecteur image", "Son module", "i²"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Angle (Ox, vecteur image), modulo 2π.",
    matiere: "Maths",
  },
  {
    id: "k8",
    enonceQuestion: "Que vaut le produit d'un nombre complexe par son conjugué ?",
    optionsProposees: ["0", "|z|²", "2z", "i"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Produit d'un complexe par son conjugué = carré du module.",
    matiere: "Maths",
  },
  {
    id: "k9",
    enonceQuestion: "Quelle est la forme algébrique de e^{iπ} ?",
    optionsProposees: ["1", "−1", "i", "0"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Formule d'Euler : e^{iπ} = −1.",
    matiere: "Maths",
  },
  {
    id: "k10",
    enonceQuestion: "À quelle condition deux nombres complexes sont-ils égaux ?",
    optionsProposees: ["Leurs modules sont égaux", "Parties réelles et imaginaires égales", "Leurs arguments sont égaux", "Leur somme est nulle"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "a+ib = c+id ⇔ a=c et b=d.",
    matiere: "Maths",
  },
];

export function questionsForChapter(chapterId: string, classe?: string): QCMData[] {
  const dedicated: Record<string, QCMData[]> = {
    digest: DIGESTION_QCM,
    eq2: ASSIMILATION_QCM,
    cell: CELL_QCM,
    circulation: CIRCULATION_QCM,
    nerveux: NERVEUX_QCM,
    neurones: NERVEUX_QCM,
    excretion: EXCRETION_QCM,
    adn: ADN_QCM,
    complexes: COMPLEXES_QCM,
    "tle-d-complexes": COMPLEXES_QCM,
    "tle-d-vecteurs": VECTEURS_QCM,
  };
  const local = dedicated[chapterId] ?? quizFromLesson(chapterId, classe);
  const bank = overlayQuiz(chapterId, local, classe);
  let out: QCMData[];
  if (chapterId !== "eq2" && isDeltaQuiz(bank)) {
    out = (dedicated[chapterId] ?? quizFromLesson(chapterId, classe)).slice(0, 10);
  } else if (bank.length >= 10) {
    out = bank.slice(0, 10);
  } else {
    const extra = quizFromLesson(chapterId, classe).filter((q) => !bank.some((b) => b.enonceQuestion === q.enonceQuestion));
    out = [...bank, ...extra].slice(0, 10);
  }
  return shuffleQuizOptions(shuffleQuizOrder(out)).map(withOptionNotes);
}

export function questionsForGrandQuiz(chapterId: string, classe?: string): QCMData[] {
  return questionsForChapter(chapterId, classe);
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
    {
      id: "ne3",
      before: "La conduction saltatoire se fait grâce à la ",
      after: ".",
      blank: { id: "p3", answer: "myéline", options: ["myéline", "bile", "aorte", "valve"] },
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

export function clozeForChapter(chapterId: string, classe?: string): ClozeItem[] {
  let items: ClozeItem[];
  if (chapterId === "glycemie") items = CLOZE_BY_CHAPTER.excretion;
  else if (chapterId === "gene") items = CLOZE_BY_CHAPTER.adn;
  else if (chapterId === "tle-d-complexes") items = CLOZE_BY_CHAPTER.complexes;
  else if (CLOZE_BY_CHAPTER[chapterId]) items = CLOZE_BY_CHAPTER[chapterId];
  else items = clozeFromLesson(chapterId, classe);
  return shuffleClozeItems(items);
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
