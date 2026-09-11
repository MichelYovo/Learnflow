import { getPublishedSchemas } from "./publishedCache";

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
  image: string;
  parts: Schema3DPart[];
};

const COEUR: Schema3DModel = {
  id: "coeur",
  title: "Cœur humain",
  subtitle: "Coupe 3D · circulation double",
  image: "/schemas/coeur.png",
  parts: [
    { id: "vcs", label: "Veine cave supérieure", role: "Ramène le sang pauvre en O₂ de la tête et des bras.", x: 30, y: 20 },
    { id: "aorte", label: "Aorte", role: "Envoie le sang oxygéné vers tout le corps.", x: 48, y: 28 },
    { id: "ap", label: "Artère pulmonaire", role: "Mène le sang pauvre en O₂ vers les poumons.", x: 60, y: 34 },
    { id: "vp", label: "Veines pulmonaires", role: "Ramènent le sang oxygéné des poumons.", x: 70, y: 40 },
    { id: "od", label: "Oreillette droite", role: "Reçoit le sang veineux et le verse dans le ventricule droit.", x: 24, y: 42 },
    { id: "vd", label: "Ventricule droit", role: "Pompe le sang vers les poumons.", x: 34, y: 62 },
    { id: "og", label: "Oreillette gauche", role: "Reçoit le sang oxygéné des veines pulmonaires.", x: 60, y: 42 },
    { id: "vg", label: "Ventricule gauche", role: "Paroi épaisse : pompe le sang dans l'aorte.", x: 56, y: 64 },
    { id: "septum", label: "Septum", role: "Cloison : empêche le mélange des deux sangs.", x: 48, y: 58 },
  ],
};

const ADN: Schema3DModel = {
  id: "adn",
  title: "ADN — double hélice",
  subtitle: "Support des caractères héréditaires",
  image: "/schemas/adn.jpg",
  parts: [
    { id: "helice", label: "Double hélice", role: "Deux brins enroulés : forme de l'ADN.", x: 12, y: 22 },
    { id: "paires", label: "Paire de bases", role: "Barreau de l'échelle : A face à T, G face à C.", x: 18, y: 36 },
    { id: "brins", label: "Brins sucre-phosphate", role: "Squelette de la molécule, de chaque côté.", x: 16, y: 48 },
    { id: "at", label: "Paire A–T", role: "Adénine liée à la thymine par 2 liaisons hydrogène.", x: 62, y: 14 },
    { id: "gc", label: "Paire G–C", role: "Guanine liée à la cytosine par 3 liaisons hydrogène.", x: 58, y: 34 },
    { id: "phosphate", label: "Phosphate", role: "Groupe du nucléotide, sur le squelette.", x: 12, y: 82 },
    { id: "sucre", label: "Sucre (désoxyribose)", role: "Pentose du nucléotide, numéroté 1' à 5'.", x: 32, y: 86 },
    { id: "base", label: "Base azotée", role: "A, T, G ou C : c'est elle qui code l'information.", x: 50, y: 72 },
  ],
};

const NEURONE: Schema3DModel = {
  id: "neurone",
  title: "Neurone",
  subtitle: "Cellule nerveuse · l'influx va dans un seul sens",
  image: "/schemas/neurone.png",
  parts: [
    { id: "dendrites", label: "Dendrites", role: "Reçoivent les messages des autres neurones.", x: 12, y: 38 },
    { id: "noyau", label: "Noyau", role: "Centre de la cellule, contient l'ADN.", x: 22, y: 46 },
    { id: "corps", label: "Corps cellulaire", role: "Fait le total des messages reçus.", x: 24, y: 40 },
    { id: "cone", label: "Cône d'implantation", role: "L'influx (potentiel d'action) part d'ici.", x: 34, y: 40 },
    { id: "axone", label: "Axone", role: "Fibre unique : conduit l'influx vers la synapse.", x: 52, y: 18 },
    { id: "terminaison", label: "Terminaisons synaptiques", role: "Libèrent le neurotransmetteur.", x: 84, y: 26 },
    { id: "mito", label: "Mitochondrie", role: "Fournit l'énergie (ATP) du neurone.", x: 16, y: 64 },
  ],
};

const SYNAPSE: Schema3DModel = {
  id: "synapse",
  title: "Synapse chimique",
  subtitle: "L'électrique devient chimique, puis redevient électrique",
  image: "/schemas/synapse.jpg",
  parts: [
    { id: "neurone", label: "Neurone présynaptique", role: "Envoie l'influx vers la synapse.", x: 58, y: 8 },
    { id: "dendrites", label: "Dendrites", role: "Reçoivent les messages.", x: 36, y: 28 },
    { id: "axone", label: "Axone", role: "Conduit l'influx électrique.", x: 52, y: 32 },
    { id: "influx", label: "Influx électrique", role: "Message nerveux le long de la fibre.", x: 28, y: 48 },
    { id: "nt", label: "Neurotransmetteur", role: "Messager chimique libéré dans la fente.", x: 72, y: 52 },
    { id: "recepteur", label: "Récepteur", role: "S'ouvre quand le messager se fixe.", x: 66, y: 72 },
    { id: "fente", label: "Fente synaptique", role: "Espace entre les deux neurones.", x: 78, y: 78 },
  ],
};

const REIN: Schema3DModel = {
  id: "rein",
  title: "Rein — coupe longitudinale",
  subtitle: "Filtration du sang et formation de l'urine",
  image: "/schemas/rein.png",
  parts: [
    { id: "cortex", label: "Cortex", role: "Zone externe : filtration glomérulaire.", x: 58, y: 12 },
    { id: "medulle", label: "Médulla", role: "Zone interne : concentre l'urine.", x: 72, y: 20 },
    { id: "papille", label: "Papille", role: "Pointe de la pyramide : l'urine s'égoutte.", x: 78, y: 30 },
    { id: "pyramide", label: "Pyramides de Malpighi", role: "Tissu médullaire en éventail.", x: 78, y: 40 },
    { id: "capsule", label: "Capsule", role: "Enveloppe protectrice du rein.", x: 80, y: 70 },
    { id: "artere", label: "Artère rénale", role: "Apporte le sang à filtrer.", x: 40, y: 30 },
    { id: "veine", label: "Veine rénale", role: "Ramène le sang filtré vers la veine cave.", x: 38, y: 36 },
    { id: "bassinet", label: "Bassinet", role: "Entonnoir central : toutes les urines convergent.", x: 36, y: 50 },
    { id: "uretere", label: "Uretère", role: "Tube qui descend l'urine vers la vessie.", x: 32, y: 58 },
    { id: "calice", label: "Calices", role: "Cupules qui recueillent l'urine des papilles.", x: 48, y: 74 },
  ],
};

const DIGESTIF: Schema3DModel = {
  id: "digestif",
  title: "Appareil digestif",
  subtitle: "Du bol alimentaire à l'absorption",
  image: "/schemas/digestif.png",
  parts: [
    { id: "bouche", label: "Bouche", role: "Mastication et amylase salivaire (amidon).", x: 72, y: 16 },
    { id: "glandes", label: "Glandes salivaires", role: "Sécrètent la salive et l'amylase.", x: 62, y: 12 },
    { id: "pharynx", label: "Pharynx", role: "Carrefour aérodigestif vers l'œsophage.", x: 52, y: 16 },
    { id: "oesophage", label: "Œsophage", role: "Péristaltisme jusqu'à l'estomac.", x: 58, y: 30 },
    { id: "foie", label: "Foie", role: "Produit la bile, utile aux lipides.", x: 48, y: 42 },
    { id: "vesicule", label: "Vésicule biliaire", role: "Stocke la bile avant le duodénum.", x: 42, y: 48 },
    { id: "estomac", label: "Estomac", role: "Brassage, pepsine et acide : attaque des protéines.", x: 60, y: 44 },
    { id: "pancreas", label: "Pancréas", role: "Sucs digestifs vers l'intestin grêle.", x: 58, y: 52 },
    { id: "grele", label: "Intestin grêle", role: "Absorption des nutriments (villosités).", x: 48, y: 58 },
    { id: "gros", label: "Gros intestin", role: "Réabsorption d'eau, formation des selles.", x: 42, y: 64 },
  ],
};

const OEIL: Schema3DModel = {
  id: "oeil",
  title: "Œil humain",
  subtitle: "Formation de l'image sur la rétine",
  image: "/schemas/oeil.png",
  parts: [
    { id: "retine", label: "Rétine", role: "Capte la lumière et forme l'image.", x: 38, y: 22 },
    { id: "choroide", label: "Choroïde", role: "Nourrit la rétine, riche en vaisseaux.", x: 58, y: 10 },
    { id: "sclerotique", label: "Sclérotique", role: "Blanc de l'œil : enveloppe protectrice.", x: 74, y: 16 },
    { id: "cornee", label: "Cornée", role: "Première lentille : fait converger les rayons.", x: 82, y: 26 },
    { id: "cristallin", label: "Cristallin", role: "Lentille qui accommode (netté de près / de loin).", x: 72, y: 34 },
    { id: "pupille", label: "Pupille", role: "Trou de l'iris : règle la quantité de lumière.", x: 82, y: 40 },
    { id: "iris", label: "Iris", role: "Diaphragme coloré autour de la pupille.", x: 82, y: 48 },
    { id: "papille", label: "Papille optique", role: "Départ du nerf optique (point aveugle).", x: 26, y: 40 },
    { id: "muscle", label: "Muscle oculomoteur", role: "Oriente le globe dans l'orbite.", x: 18, y: 64 },
  ],
};

const POUMONS: Schema3DModel = {
  id: "poumons",
  title: "Appareil respiratoire",
  subtitle: "Voies aériennes, poumons et hématose",
  image: "/schemas/poumons.png",
  parts: [
    { id: "nez", label: "Fosses nasales", role: "Filtrent, réchauffent et humectent l'air.", x: 62, y: 22 },
    { id: "pharynx", label: "Pharynx", role: "Carrefour entre air et aliments.", x: 52, y: 30 },
    { id: "larynx", label: "Larynx", role: "Passage de l'air et cordes vocales.", x: 62, y: 30 },
    { id: "trachee", label: "Trachée", role: "Tube cartilagineux vers les bronches.", x: 56, y: 40 },
    { id: "bronche", label: "Bronches", role: "Se divisent dans chaque poumon.", x: 58, y: 48 },
    { id: "alveoles", label: "Alvéoles", role: "Sacs d'échange : O₂ entre, CO₂ sort (hématose).", x: 44, y: 48 },
    { id: "poumon_d", label: "Poumon droit", role: "Trois lobes : organe de l'hématose.", x: 38, y: 58 },
    { id: "poumon_g", label: "Poumon gauche", role: "Deux lobes, encoche cardiaque.", x: 68, y: 66 },
    { id: "diaphragme", label: "Diaphragme", role: "Muscle : inspiration (descend) / expiration (remonte).", x: 48, y: 70 },
  ],
};

const CELLULE: Schema3DModel = {
  id: "cellule",
  title: "Cellule eucaryote",
  subtitle: "Organites et leurs rôles",
  image: "/schemas/cellule.png",
  parts: [
    { id: "golgi", label: "Appareil de Golgi", role: "Trie et emballe les protéines.", x: 42, y: 30 },
    { id: "rer", label: "Réticulum rugueux", role: "Ribosomes collés : synthèse des protéines.", x: 38, y: 40 },
    { id: "rel", label: "Réticulum lisse", role: "Lipides et détoxification.", x: 32, y: 48 },
    { id: "noyau", label: "Noyau", role: "Contient l'ADN, commande la cellule.", x: 50, y: 50 },
    { id: "nucleole", label: "Nucléole", role: "Fabrique les ribosomes.", x: 52, y: 54 },
    { id: "lysosome", label: "Lysosome", role: "Digère les déchets de la cellule.", x: 64, y: 42 },
    { id: "centrioles", label: "Centrioles", role: "Participent à la division cellulaire.", x: 58, y: 34 },
    { id: "mito", label: "Mitochondrie", role: "Respiration cellulaire → ATP.", x: 36, y: 72 },
    { id: "ribosomes", label: "Ribosomes libres", role: "Usines à protéines dans le cytosol.", x: 68, y: 58 },
    { id: "membrane", label: "Membrane", role: "Frontière semi-perméable avec le milieu.", x: 50, y: 78 },
  ],
};

const REPRO_F: Schema3DModel = {
  id: "repro-f",
  title: "Appareil génital féminin",
  subtitle: "Ovaires, trompes, utérus",
  image: "/schemas/repro-f.png",
  parts: [
    { id: "trompe", label: "Trompe utérine", role: "Lieu habituel de la fécondation.", x: 58, y: 34 },
    { id: "uterus", label: "Utérus", role: "Nid du fœtus pendant la grossesse.", x: 68, y: 38 },
    { id: "ovaire", label: "Ovaire", role: "Produit les ovocytes et les hormones.", x: 82, y: 32 },
    { id: "col", label: "Col de l'utérus", role: "Passage entre vagin et utérus.", x: 66, y: 48 },
    { id: "vagin", label: "Vagin", role: "Conduit vers l'utérus.", x: 66, y: 58 },
  ],
};

const REPRO_H: Schema3DModel = {
  id: "repro-h",
  title: "Appareil génital masculin",
  subtitle: "Testicules, voies spermatiques",
  image: "/schemas/repro-h.png",
  parts: [
    { id: "vessie", label: "Vessie", role: "Réservoir d'urine, au-dessus de la prostate.", x: 42, y: 14 },
    { id: "vesicule", label: "Vésicule séminale", role: "Liquide qui nourrit les spermatozoïdes.", x: 68, y: 28 },
    { id: "prostate", label: "Prostate", role: "Sécrète une partie du sperme.", x: 58, y: 42 },
    { id: "uretre", label: "Urètre", role: "Conduit commun : urine et sperme.", x: 28, y: 52 },
    { id: "deferent", label: "Canal déférent", role: "Monte les spermatozoïdes depuis l'épididyme.", x: 62, y: 58 },
    { id: "epididyme", label: "Épididyme", role: "Maturation et stockage des spermatozoïdes.", x: 52, y: 72 },
    { id: "testicule", label: "Testicule", role: "Produit les spermatozoïdes (tubes séminifères).", x: 42, y: 78 },
  ],
};

const FECONDATION: Schema3DModel = {
  id: "fecondation",
  title: "Fécondation",
  subtitle: "De l'ovulation à la rencontre des gamètes",
  image: "/schemas/fecondation.png",
  parts: [
    { id: "ovulation", label: "Ovulation", role: "L'ovocyte quitte l'ovaire.", x: 22, y: 28 },
    { id: "ovaire", label: "Ovaire", role: "Libère l'ovocyte à chaque cycle.", x: 18, y: 40 },
    { id: "trompe", label: "Trompe", role: "Lieu de la fécondation.", x: 42, y: 48 },
    { id: "uterus", label: "Utérus", role: "Accueille l'œuf après nidation.", x: 52, y: 58 },
    { id: "spermato", label: "Spermatozoïde", role: "Gamète mâle qui rejoint l'ovocyte.", x: 82, y: 14 },
    { id: "ovule", label: "Ovocyte / œuf", role: "Gamète femelle ; fusion → cellule-œuf 2n.", x: 78, y: 24 },
  ],
};

const MUSCLE: Schema3DModel = {
  id: "muscle",
  title: "Fibre musculaire striée",
  subtitle: "Myofibrilles et contraction",
  image: "/schemas/muscle.png",
  parts: [
    { id: "sarcolemme", label: "Sarcolemme", role: "Membrane de la fibre musculaire.", x: 18, y: 20 },
    { id: "mito", label: "Mitochondries", role: "ATP pour la contraction.", x: 38, y: 10 },
    { id: "myofibrilles", label: "Myofibrilles", role: "Cylindres contractiles (actine / myosine).", x: 78, y: 12 },
    { id: "noyau", label: "Noyau", role: "Fibre plurinucléée (syncytium).", x: 16, y: 52 },
    { id: "ttubule", label: "Tubule T", role: "Fait entrer le signal électrique au cœur de la fibre.", x: 58, y: 62 },
    { id: "citerne", label: "Citernes", role: "Stockent le calcium (Ca²⁺) pour la contraction.", x: 56, y: 70 },
    { id: "reticulum", label: "Réticulum sarcoplasmique", role: "Libère le Ca²⁺ : les myofibrilles se raccourcissent.", x: 52, y: 82 },
  ],
};

const FLEUR: Schema3DModel = {
  id: "fleur",
  title: "Fleur de spermatophyte",
  subtitle: "Pièces fertiles et périanthe",
  image: "/schemas/fleur.png",
  parts: [
    { id: "ovules", label: "Ovules", role: "Futures graines, dans l'ovaire.", x: 14, y: 12 },
    { id: "pistil", label: "Pistil", role: "Organe femelle : stigmate, style, ovaire.", x: 24, y: 16 },
    { id: "stigmate", label: "Stigmate", role: "Reçoit le pollen.", x: 42, y: 16 },
    { id: "style", label: "Style", role: "Tube du pistil vers l'ovaire.", x: 40, y: 24 },
    { id: "ovaire", label: "Ovaire", role: "Contient les ovules.", x: 50, y: 46 },
    { id: "petale", label: "Pétales", role: "Corolle : attire les pollinisateurs.", x: 28, y: 48 },
    { id: "sepale", label: "Sépales", role: "Calice : protège le bouton floral.", x: 28, y: 56 },
    { id: "anthere", label: "Anthère", role: "Produit le pollen (microspores).", x: 84, y: 48 },
    { id: "filament", label: "Filet", role: "Porte l'anthère.", x: 72, y: 64 },
    { id: "etamine", label: "Étamine", role: "Organe mâle : filet + anthère.", x: 82, y: 74 },
  ],
};

const TERRE: Schema3DModel = {
  id: "terre",
  title: "Coupe de la Terre",
  subtitle: "Croûte, manteau, noyaux — cadre de la géologie",
  image: "/schemas/terre.png",
  parts: [
    { id: "croute", label: "Croûte", role: "Couche superficielle : roches des continents et des fonds océaniques.", x: 52, y: 16 },
    { id: "manteau", label: "Manteau", role: "Roches chaudes, visqueuses : convection, origine des plis et volcans.", x: 50, y: 36 },
    { id: "noyau_ext", label: "Noyau externe", role: "Fer-nickel liquide (~2900 km) : champ magnétique.", x: 50, y: 54 },
    { id: "noyau_int", label: "Noyau interne", role: "Fer solide au centre (~5100 km).", x: 50, y: 70 },
  ],
};

const MEIOSE: Schema3DModel = {
  id: "meiose",
  title: "Méiose",
  subtitle: "Deux divisions · 4 cellules haploïdes",
  image: "/schemas/meiose.png",
  parts: [
    { id: "pro1", label: "Prophase I", role: "Appariement des homologues, crossing-over possible.", x: 8, y: 48 },
    { id: "meta1", label: "Métaphase I", role: "Bivalents alignés au milieu.", x: 20, y: 48 },
    { id: "ana1", label: "Anaphase I", role: "Séparation des homologues (brassage inter).", x: 32, y: 48 },
    { id: "telo1", label: "Télophase I", role: "Deux cellules à n chromosomes (2 chromatides).", x: 42, y: 48 },
    { id: "pro2", label: "Prophase II", role: "Deuxième division, sans duplication d'ADN.", x: 56, y: 28 },
    { id: "meta2", label: "Métaphase II", role: "Chromosomes alignés, chromatides encore liées.", x: 68, y: 28 },
    { id: "ana2", label: "Anaphase II", role: "Séparation des chromatides sœurs.", x: 80, y: 28 },
    { id: "telo2", label: "Télophase II", role: "Quatre cellules haploïdes (gamètes).", x: 90, y: 28 },
  ],
};

const BY_CHAPTER: Record<string, Schema3DModel[]> = {
  circulation: [COEUR],
  nerveux: [NEURONE, SYNAPSE],
  neurones: [NEURONE, SYNAPSE],
  "tle-d-nerf": [NEURONE, SYNAPSE],
  excretion: [REIN],
  glycemie: [REIN],
  "tle-d-milieu": [REIN],
  adn: [ADN],
  brassage: [MEIOSE, ADN],
  gene: [MEIOSE, ADN],
  "tle-d-adn": [ADN],
  "tle-d-heredite": [MEIOSE, ADN],
  digest: [DIGESTIF],
  oeil: [OEIL],
  respiration: [POUMONS],
  cell: [CELLULE],
  "repro-3e": [REPRO_F, REPRO_H],
  "tle-d-gameto": [MEIOSE, REPRO_H],
  "tle-d-fecond": [FECONDATION, REPRO_F],
  "tle-d-sperma": [FLEUR],
  "tle-d-muscle": [MUSCLE],
  "geo-togo": [TERRE],
  "immunite-3e": [CELLULE],
};

export function schemas3dForChapter(chapterId?: string): Schema3DModel[] {
  if (!chapterId) return [];
  const local = BY_CHAPTER[chapterId] ?? [];
  const cloud = getPublishedSchemas()
    .filter((row) => row.chapter_id === chapterId && row.image_url)
    .map((row) => ({
      id: row.id || `cloud-${row.chapter_id}-${row.title}`,
      title: row.title,
      subtitle: row.subtitle,
      image: row.image_url,
      parts: row.parts ?? [],
    }));
  return [...local, ...cloud];
}

export function chapterHas3dImage(chapterId?: string): boolean {
  return schemas3dForChapter(chapterId).length > 0;
}
