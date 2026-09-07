import type { ImageSourcePropType } from "react-native";

export type Schema3DPart = {
  id: string;
  label: string;
  role: string;
  /** Position en % sur le visuel */
  x: number;
  y: number;
};

export type Schema3DModel = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  parts: Schema3DPart[];
};

const COEUR: Schema3DModel = {
  id: "coeur",
  title: "Cœur humain",
  subtitle: "Coupe 3D · circulation double",
  image: require("../../assets/schemas/coeur.jpg"),
  parts: [
    { id: "aorte", label: "Aorte", role: "Envoie le sang oxygéné vers tout le corps.", x: 62, y: 10 },
    { id: "ap", label: "Artère pulmonaire", role: "Mène le sang pauvre en O₂ vers les poumons.", x: 54, y: 20 },
    { id: "vcs", label: "Veines caves supérieures", role: "Ramènent le sang veineux de la tête et des bras.", x: 18, y: 14 },
    { id: "od", label: "Oreillette droite", role: "Reçoit le sang pauvre en O₂ et le verse dans le ventricule droit.", x: 22, y: 40 },
    { id: "vd", label: "Ventricule droit", role: "Pompe le sang vers les poumons via l'artère pulmonaire.", x: 30, y: 68 },
    { id: "og", label: "Oreillette gauche", role: "Reçoit le sang oxygéné des veines pulmonaires.", x: 58, y: 38 },
    { id: "vg", label: "Ventricule gauche", role: "Paroi épaisse : pompe le sang dans l'aorte vers le corps.", x: 64, y: 66 },
    { id: "septum", label: "Septum interventriculaire", role: "Cloison musculaire : empêche le mélange des deux sangs.", x: 48, y: 62 },
    { id: "mitrale", label: "Valve mitrale", role: "Empêche le reflux de l'oreillette gauche vers le ventricule.", x: 56, y: 50 },
    { id: "tricuspide", label: "Valve tricuspide", role: "Empêche le reflux entre oreillette et ventricule droits.", x: 28, y: 52 },
  ],
};

const ADN: Schema3DModel = {
  id: "adn",
  title: "ADN — double hélice",
  subtitle: "Support des caractères héréditaires",
  image: require("../../assets/schemas/adn.jpg"),
  parts: [
    { id: "gc", label: "Paire G–C", role: "Guanine liée à la cytosine par 3 liaisons hydrogène.", x: 72, y: 22 },
    { id: "at", label: "Paire A–T", role: "Adénine liée à la thymine par 2 liaisons hydrogène.", x: 72, y: 40 },
    { id: "ta", label: "Paire T–A", role: "Complémentarité stricte : T ne s'associe qu'à A.", x: 72, y: 56 },
    { id: "cg", label: "Paire C–G", role: "Même règle que G–C : appariement complémentaire.", x: 72, y: 72 },
    { id: "brins", label: "Brins sucre-phosphate", role: "Deux chaînes enroulées : squelette de la double hélice.", x: 38, y: 48 },
  ],
};

const NEURONE: Schema3DModel = {
  id: "neurone",
  title: "Neurone",
  subtitle: "Cellule nerveuse · l'influx va dans un seul sens",
  image: require("../../assets/schemas/neurone.jpg"),
  parts: [
    { id: "dendrites", label: "Dendrites", role: "Reçoivent les messages.", x: 20, y: 18 },
    { id: "noyau", label: "Noyau", role: "Centre de la cellule.", x: 28, y: 32 },
    { id: "corps", label: "Corps cellulaire", role: "Fait le total des messages reçus.", x: 36, y: 40 },
    { id: "cone", label: "Cône d'implantation", role: "L'influx part d'ici.", x: 44, y: 48 },
    { id: "axone", label: "Axone", role: "Fibre unique : conduit l'influx.", x: 52, y: 56 },
    { id: "myeline", label: "Gaine de myéline", role: "Isolant : l'influx va plus vite.", x: 62, y: 64 },
    { id: "ranvier", label: "Nœud de Ranvier", role: "L'influx saute d'un nœud à l'autre.", x: 70, y: 72 },
    { id: "terminaison", label: "Terminaison axonale", role: "Arrive à la synapse.", x: 84, y: 84 },
  ],
};

const SYNAPSE: Schema3DModel = {
  id: "synapse",
  title: "Synapse neuronale",
  subtitle: "L'électrique devient chimique, puis redevient électrique",
  image: require("../../assets/schemas/synapse.jpg"),
  parts: [
    { id: "impulsion", label: "Impulsion nerveuse", role: "L'influx arrive dans le bouton.", x: 56, y: 10 },
    { id: "vesicules", label: "Vésicules synaptiques", role: "Sacs de neurotransmetteurs.", x: 46, y: 30 },
    { id: "nt", label: "Neurotransmetteur", role: "Messager chimique libéré.", x: 64, y: 44 },
    { id: "fente", label: "Fente synaptique", role: "Espace entre les deux neurones.", x: 50, y: 54 },
    { id: "recepteur", label: "Récepteur / canal", role: "S'ouvre quand le messager se fixe.", x: 38, y: 70 },
    { id: "pps", label: "Potentiel postsynaptique", role: "Nouveau message dans le 2e neurone.", x: 52, y: 86 },
  ],
};

const REIN: Schema3DModel = {
  id: "rein",
  title: "Rein — coupe longitudinale",
  subtitle: "Filtration du sang et formation de l'urine",
  image: require("../../assets/schemas/rein.jpg"),
  parts: [
    { id: "capsule", label: "Capsule", role: "Enveloppe protectrice du rein.", x: 74, y: 10 },
    { id: "cortex", label: "Cortex", role: "Zone externe : filtration glomérulaire.", x: 72, y: 22 },
    { id: "pyramide", label: "Pyramide de Malpighi", role: "Tissu médullaire en éventail, concentre l'urine.", x: 58, y: 40 },
    { id: "papille", label: "Papille", role: "Pointe de la pyramide : l'urine s'égoutte vers le calice.", x: 48, y: 54 },
    { id: "calice", label: "Calice", role: "Cupule qui recueille l'urine d'une papille.", x: 40, y: 58 },
    { id: "bassinet", label: "Bassinet", role: "Entonnoir central : toutes les urines convergent ici.", x: 30, y: 52 },
    { id: "uretere", label: "Uretère", role: "Tube qui descend l'urine vers la vessie.", x: 20, y: 82 },
    { id: "artere", label: "Artère rénale", role: "Apporte le sang à filtrer (sang rouge, oxygéné).", x: 16, y: 40 },
    { id: "veine", label: "Veine rénale", role: "Ramène le sang filtré vers la veine cave.", x: 16, y: 50 },
  ],
};

const BY_CHAPTER: Record<string, Schema3DModel[]> = {
  circulation: [COEUR],
  nerveux: [NEURONE, SYNAPSE],
  neurones: [NEURONE, SYNAPSE],
  excretion: [REIN],
  glycemie: [REIN],
  adn: [ADN],
  brassage: [ADN],
  gene: [ADN],
};

export function schemas3dForChapter(chapterId?: string): Schema3DModel[] {
  if (!chapterId) return [];
  return BY_CHAPTER[chapterId] ?? [];
}

export function chapterHas3dImage(chapterId?: string): boolean {
  return schemas3dForChapter(chapterId).length > 0;
}
