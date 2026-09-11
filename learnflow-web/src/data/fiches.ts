import type { AnalogieSpiraData, FicheCoursData, SchemaCoursKind } from "../types/learnflow";
import { FICHES_TLE } from "./fichesTle";
import { countWords as countWordsInText, hydrateFiche } from "./lessonContent";
import { findChapterMeta } from "./programme";
import { overlayFiche } from "./publishedCache";
import { chapterHas3dImage } from "./schemas3d";

const KICKER = "EN D'AUTRE TERME";

function analogie(parole: string, concept: string, exemple: string): AnalogieSpiraData {
  return {
    kicker: KICKER,
    titre: "L'Analogie de Spira",
    parole,
    concept,
    exemple,
  };
}

const FICHES_3EME: Record<string, FicheCoursData> = {
  eq2: {
    chapitreId: "eq2",
    titre: "Équations du 2nd degré · Δ",
    matiereId: "maths",
    motsClesMasques: ["discriminant", "racines", "Viète"],
    pucesEssentiel: [
      "Une équation du **2nd degré** s'écrit ax² + bx + c = 0 avec **a ≠ 0**.",
      "Le **discriminant** Δ = b² − 4ac décide du nombre de **racines** réelles.",
      "Si **Δ > 0** → **deux** racines distinctes : x = (−b ± √Δ) / 2a.",
      "Si **Δ = 0** → **une** racine double : x = −b / 2a.",
      "Si **Δ < 0** → **aucune** racine réelle.",
      "Relations de **Viète** : somme = −b/a, produit = c/a.",
    ],
    analogie: analogie(
      "Imagine un feu tricolore. Vert : Δ > 0, tu passes — deux routes, deux racines. Orange : Δ = 0, une seule voie. Rouge : Δ < 0, stop — pas de racine réelle.",
      "Le discriminant Δ",
      "Un feu tricolore : vert (2), orange (1), rouge (0).",
    ),
    situationProbleme: {
      recit:
        "Koffi veut clôturer un jardin rectangulaire. La longueur dépasse la largeur de 5 m, et l'aire vaut 6 m². Il cherche les deux dimensions exactes.",
      question: "Comment trouver deux nombres dont la différence est 5 et le produit 6 ?",
      competenceVisee:
        "Résoudre une équation du second degré à coefficients réels et interpréter le nombre de solutions selon le signe de Δ. Utiliser les relations de Viète pour contrôler un résultat.",
    },
    exempleResolu: {
      enonce: "Résoudre dans ℝ : x² − 5x + 6 = 0.",
      etapes: [
        { titre: "Identifier a, b, c", texte: "a = 1, b = −5, c = 6 (et a ≠ 0 : c'est bien du 2nd degré)." },
        { titre: "Calculer Δ", texte: "Δ = b² − 4ac = 25 − 24 = 1. Or 1 > 0 : deux racines réelles distinctes." },
        { titre: "Les racines", texte: "x = (−b ± √Δ) / 2a = (5 ± 1) / 2. Donc x₁ = 2 et x₂ = 3." },
      ],
      reponseFinale: "S = {2 ; 3}. Contrôle Viète : somme 5 = −b/a, produit 6 = c/a.",
    },
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Résoudre une **équation du second degré** à coefficients réels et interpréter le nombre de solutions selon le signe de Δ.",
          "Utiliser les **relations de Viète** pour contrôler un résultat ou former une équation.",
        ],
      },
      {
        id: "definition",
        titre: "Savoirs — définition",
        paragraphes: [
          "Forme canonique de travail : **ax² + bx + c = 0**, avec a, b, c réels et **a ≠ 0** (sinon l'équation n'est plus du 2nd degré).",
          "On calcule le **discriminant** Δ = b² − 4ac. C'est un nombre réel qui classe le cas.",
        ],
      },
      {
        id: "cas",
        titre: "Savoir-faire — les trois cas",
        paragraphes: [
          "**Δ > 0** : deux **racines** réelles distinctes x₁ = (−b − √Δ) / 2a et x₂ = (−b + √Δ) / 2a.",
          "**Δ = 0** : une racine double x₀ = −b / 2a (la parabole touche l'axe des x en un point).",
          "**Δ < 0** : pas de solution dans ℝ. On s'arrête là au collège / lycée (hors nombres complexes).",
        ],
      },
      {
        id: "viete",
        titre: "Relations de Viète",
        paragraphes: [
          "Si les **racines** existent : x₁ + x₂ = **−b/a** et x₁ · x₂ = **c/a**.",
          "Astuce de contrôle : après calcul, vérifie somme et produit — une erreur de signe se voit tout de suite.",
        ],
      },
    ],
  },

  circ: {
    chapitreId: "circ",
    titre: "Circuits électriques · tension et courant",
    matiereId: "pc",
    motsClesMasques: ["tension", "courant", "intensité"],
    pucesEssentiel: [
      "La **tension** U (volt) est la « poussée » électrique entre deux points.",
      "L'**intensité** I (ampère) est le **courant**, c'est-à-dire le débit de charges.",
      "En **série**, I est le même partout ; les tensions s'ajoutent.",
      "En **dérivation**, U est la même ; les courants s'ajoutent (loi des nœuds).",
      "Loi des **mailles** : la somme algébrique des tensions sur une boucle est nulle.",
    ],
    analogie: analogie(
      "Pense à un circuit d'eau. La tension, c'est la pression : plus la différence de hauteur est grande, plus l'eau pousse. Le courant, c'est le débit dans le tuyau. Une résistance, c'est un rétrécissement qui freine le débit.",
      "Tension U et intensité I",
      "Un circuit d'eau : pression (U), débit (I), rétrécissement (R).",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Distinguer **tension** et **intensité**, les mesurer, et prévoir le comportement d'un circuit série ou parallèle.",
        ],
      },
      {
        id: "savoirs",
        titre: "Savoirs",
        paragraphes: [
          "**U** se mesure en parallèle aux bornes d'un dipôle (voltmètre).",
          "**I** se mesure en série dans la branche (ampèremètre).",
          "Convention : le **courant** sort de la borne + du générateur.",
        ],
      },
      {
        id: "lois",
        titre: "Savoir-faire — lois de Kirchhoff",
        paragraphes: [
          "**Loi des nœuds** : la somme des courants qui arrivent = la somme de ceux qui partent.",
          "**Loi des mailles** : en suivant une boucle, ΣU = 0.",
        ],
      },
    ],
  },

  ohm: {
    chapitreId: "ohm",
    titre: "Résistances et loi d'Ohm",
    matiereId: "pc",
    motsClesMasques: ["résistance", "Ohm", "intensité"],
    pucesEssentiel: [
      "Loi d'**Ohm** : **U = R · I** (U en V, R en Ω, I en A).",
      "Plus la **résistance** R est grande, plus I diminue à U constante.",
      "Résistances en **série** : R_éq = R₁ + R₂ + …",
      "Résistances en **parallèle** : 1/R_éq = 1/R₁ + 1/R₂ + …",
      "L'**effet Joule** : P = U · I = R · I² (chaleur dissipée).",
    ],
    analogie: analogie(
      "Reprenons le tuyau. U = R · I, c'est : pression = étroitesse × débit. Un tuyau très fin (R grande) laisse peu d'eau passer. Plusieurs tuyaux côte à côte (parallèle), le débit total grimpe.",
      "Loi d'Ohm U = R·I",
      "Tuyau étroit = grande résistance ; plusieurs tuyaux = parallèle.",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Appliquer la **loi d'Ohm**, calculer une résistance équivalente, et relier puissance et **effet Joule**.",
        ],
      },
      {
        id: "savoirs",
        titre: "Savoirs",
        paragraphes: [
          "Un ohm (Ω) : résistance qui, sous 1 V, laisse passer 1 A.",
          "Caractéristique d'une résistance ohmique : droite U = f(I) de pente R.",
        ],
      },
      {
        id: "assoc",
        titre: "Savoir-faire — associations",
        paragraphes: [
          "Série : même **intensité**, tensions proportionnelles aux R.",
          "Parallèle : même **tension**, courants inversement proportionnels aux R.",
        ],
      },
    ],
  },

  digest: {
    chapitreId: "digest",
    titre: "La digestion",
    matiereId: "svt",
    schema: "both",
    motsClesMasques: ["nutriments", "bouche", "estomac", "enzymes", "intestin grêle", "gros intestin", "énergie"],
    essentialText:
      "La digestion est le processus par lequel le corps transforme les aliments en [nutriments] assimilables.\n\n• Les aliments passent par la [bouche], l'œsophage, puis l'[estomac].\n• Les sucs gastriques décomposent les aliments grâce aux [enzymes].\n• L'absorption des nutriments se fait principalement dans l'[intestin grêle].\n• Les déchets sont évacués par le [gros intestin].\n\nCe processus fournit l'[énergie] nécessaire au fonctionnement de nos cellules.",
    detailedText:
      "La digestion humaine est un processus biologique complexe et vital qui se déroule dans l'appareil digestif. Elle débute dans la cavité buccale où la mastication (action mécanique) et la salive (action chimique via l'amylase) commencent à décomposer les aliments. Le bol alimentaire descend ensuite via l'œsophage jusqu'à l'estomac. L'estomac, grâce à son acidité extrême et à la pepsine, va réduire ces éléments en une bouillie appelée chyme. Le processus se poursuit dans l'intestin grêle, véritable centre d'absorption, où les nutriments traversent la paroi intestinale pour rejoindre la circulation sanguine. Enfin, le gros intestin absorbe l'eau restante et forme les matières fécales qui seront expulsées.\n\nCompétence visée (APC)\n\nExpliquer le trajet des aliments, distinguer digestion mécanique et chimique, et localiser l'absorption des nutriments.\n\nSavoirs — le trajet\n\nBouche : mastication et amylase salivaire (amidon). Œsophage : péristaltisme jusqu'à l'estomac. Estomac : brassage, pepsine et acide chlorhydrique (protéines). Intestin grêle : sucs pancréatiques, bile et absorption au niveau des villosités. Gros intestin : réabsorption d'eau et formation des selles.\n\nSavoir-faire\n\nLégender un schéma de l'appareil digestif (organe ↔ rôle). Relier une enzyme à son substrat : amylase / amidon, pepsine / protéines, lipase / lipides.",
    pucesEssentiel: [
      "La digestion transforme les aliments en nutriments assimilables.",
      "Voie : bouche → œsophage → estomac → intestin grêle → gros intestin.",
      "Digestion mécanique (broyage) + chimique (enzymes).",
      "L'absorption se fait surtout dans l'intestin grêle (villosités).",
      "Le foie produit la bile (lipides) ; le pancréas déverse ses sucs dans le duodénum.",
    ],
    analogie: analogie(
      "Ton tube digestif, c'est une usine en chaîne. La bouche broie, l'estomac mélange et attaque les protéines, l'intestin grêle récupère les pièces utiles, le gros intestin jette le reste. Les enzymes, ce sont les ouvriers spécialisés.",
      "Tube digestif",
      "Une usine à la chaîne : broyer, transformer, trier, jeter.",
    ),
    situationProbleme: {
      recit:
        "À la cantine, Ama avale trop vite un foutou. Dix minutes plus tard, elle se demande où est passé le repas et comment son corps va en tirer de l'énergie pour le cours de l'après-midi.",
      question: "Par où passent les aliments, et où les nutriments rejoignent-ils le sang ?",
      competenceVisee:
        "Expliquer le trajet des aliments, distinguer digestion mécanique et chimique, et localiser l'absorption des nutriments.",
    },
    exempleResolu: {
      enonce:
        "On te donne un schéma de l'appareil digestif. Relie la bouche, l'estomac et l'intestin grêle à leur rôle principal.",
      etapes: [
        {
          titre: "Bouche",
          texte: "Mastication (mécanique) + amylase salivaire (chimique) : l'amidon commence à être hydrolysé.",
        },
        {
          titre: "Estomac",
          texte: "Brassage + pepsine et HCl : les protéines sont attaquées ; le chyme se forme.",
        },
        {
          titre: "Intestin grêle",
          texte: "Sucs pancréatiques, bile, villosités : l'essentiel de l'absorption des nutriments.",
        },
      ],
      reponseFinale: "Bouche = début amidon ; estomac = protéines ; intestin grêle = absorption.",
    },
    miniQuiz: [
      {
        id: "digest-mini-1",
        enonceQuestion: "Où commence la digestion chimique de l'amidon ?",
        optionsProposees: ["Estomac", "Bouche", "Intestin grêle", "Gros intestin"],
        indexReponseCorrecte: 1,
        explicationPedagogique: "L'amylase salivaire commence à hydrolyser l'amidon dès la bouche.",
      },
      {
        id: "digest-mini-2",
        enonceQuestion: "Où se fait l'essentiel de l'absorption des nutriments ?",
        optionsProposees: ["Estomac", "Gros intestin", "Intestin grêle", "Bouche"],
        indexReponseCorrecte: 2,
        explicationPedagogique: "Les villosités de l'intestin grêle maximisent la surface d'échange.",
      },
    ],
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Expliquer le **trajet des aliments**, distinguer digestion mécanique et chimique, et localiser l'**absorption** des nutriments.",
        ],
      },
      {
        id: "trajet",
        titre: "Savoirs — le trajet",
        paragraphes: [
          "**Bouche** : mastication + amylase salivaire (amidon).",
          "**Œsophage** : péristaltisme jusqu'à l'estomac.",
          "**Estomac** : brassage + pepsine + HCl (protéines).",
          "**Intestin grêle** : sucs pancréatiques, bile, **absorption**.",
          "**Gros intestin** : réabsorption d'eau, formation des selles.",
        ],
      },
      {
        id: "savoirfaire",
        titre: "Savoir-faire",
        paragraphes: [
          "Légender un **schéma** de l'appareil digestif (organe ↔ rôle).",
          "Relier une **enzyme** à son substrat : amylase / amidon, pepsine / protéines, lipase / lipides.",
        ],
      },
    ],
  },

  cell: {
    chapitreId: "cell",
    titre: "La cellule, unité du vivant",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["noyau", "mitochondries", "membrane"],
    pucesEssentiel: [
      "La **cellule** est l'unité structurale et fonctionnelle du vivant.",
      "Chez les **eucaryotes**, le **noyau** contient l'ADN.",
      "Les **mitochondries** produisent l'**ATP** (énergie).",
      "La **membrane** plasmique contrôle les échanges (semi-perméable).",
      "Cellule **végétale** : paroi + **chloroplastes** (photosynthèse).",
    ],
    analogie: analogie(
      "Une cellule, c'est une ville. Le noyau, c'est la mairie — les plans (ADN). Les mitochondries, les centrales électriques. La membrane, les murs et les portes. Les ribosomes, les usines à protéines.",
      "Organisation cellulaire",
      "Une ville : mairie, centrales, murs, usines.",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Décrire l'organisation d'une **cellule** eucaryote et relier chaque organite à sa fonction.",
        ],
      },
      {
        id: "organites",
        titre: "Savoirs — organites",
        paragraphes: [
          "**Noyau** : matériel génétique, contrôle de la cellule.",
          "**Mitochondries** : respiration cellulaire → ATP.",
          "**Ribosomes** : synthèse des protéines.",
          "**Chloroplastes** (végétal) : photosynthèse.",
          "**Membrane** : frontière sélective avec le milieu.",
        ],
      },
      {
        id: "compare",
        titre: "Savoir-faire — comparer",
        paragraphes: [
          "Cellule animale vs végétale : la végétale a une **paroi** pecto-cellulosique, une grande vacuole, et souvent des chloroplastes.",
          "Sur le **modèle 3D**, associe chaque organite à son rôle — pas seulement le nom.",
        ],
      },
    ],
  },

  gene: {
    chapitreId: "gene",
    titre: "Division cellulaire et hérédité",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["mitose", "méiose", "chromosomes"],
    pucesEssentiel: [
      "La **mitose** produit 2 cellules filles **identiques** (croissance, réparation).",
      "La **méiose** produit 4 **gamètes** à n chromosomes (reproduction sexuée).",
      "L'**ADN** est empaqueté en **chromosomes** au moment de la division.",
      "Les **lois de Mendel** expliquent la transmission des caractères.",
      "Une **mutation** est un changement de l'ADN ; elle peut créer de la diversité.",
    ],
    analogie: analogie(
      "L'ADN, c'est le livre de recettes de la cellule. La mitose, c'est photocopier le livre pour deux cuisines identiques. La méiose, c'est mélanger deux livres de familles différentes pour en inventer un nouveau.",
      "Hérédité",
      "Un livre de recettes : copier (mitose) ou mélanger (méiose).",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Distinguer **mitose** et **méiose**, et relier chromosomes, gènes et transmission des caractères.",
        ],
      },
      {
        id: "savoirs",
        titre: "Savoirs",
        paragraphes: [
          "**Mitose** : conservation du caryotype, 2 cellules 2n.",
          "**Méiose** : réduction chromatique, 4 cellules n.",
          "Un **gène** est un segment d'ADN qui code un caractère ; les allèles en sont les versions.",
        ],
      },
      {
        id: "savoirfaire",
        titre: "Savoir-faire",
        paragraphes: [
          "Lire un schéma de division, calculer un rapport mendélien simple, et expliquer l'intérêt des **mutations** pour la variation.",
        ],
      },
    ],
  },

  nerveux: {
    chapitreId: "nerveux",
    titre: "La commande nerveuse du mouvement",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["neurone", "synapse", "myéline"],
    pucesEssentiel: [
      "Le **neurone** conduit le **message nerveux** dans un seul sens.",
      "**Dendrites** reçoivent → **corps cellulaire** → **axone** envoie.",
      "La **myéline** accélère : l'influx saute aux **nœuds de Ranvier**.",
      "À la **synapse**, l'électrique devient **chimique** (neurotransmetteur).",
    ],
    analogie: analogie(
      "Le neurone, c'est un fil. La myéline, c'est la gaine : le courant va plus vite. La synapse, c'est la prise : on passe un colis chimique au neurone d'à côté.",
      "Message nerveux",
      "Fil, gaine, prise.",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Légender le **neurone** et expliquer le passage du message à la **synapse**.",
        ],
      },
      {
        id: "neurone",
        titre: "Savoirs — le neurone",
        paragraphes: [
          "**Dendrites** : entrée. **Axone** : une seule fibre de sortie.",
          "**Myéline** : isolant. **Nœud de Ranvier** : l'influx saute, donc plus vite.",
        ],
      },
      {
        id: "synapse",
        titre: "Savoirs — la synapse",
        paragraphes: [
          "L'influx n'enjambe pas le vide : **vésicules** → **neurotransmetteur** dans la **fente** → **récepteurs** du 2e neurone.",
        ],
      },
    ],
  },

  circulation: {
    chapitreId: "circulation",
    titre: "La circulation sanguine",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["ventricule", "oreillette", "aorte"],
    pucesEssentiel: [
      "Le **cœur** est une **pompe double** : côté droit et côté gauche ne se mélangent pas (**septum**).",
      "**Oreillette** reçoit, **ventricule** éjecte. Le ventricule **gauche** a la paroi la plus épaisse.",
      "**Petite circulation** : ventricule droit → **artère pulmonaire** → poumons → veines pulmonaires → oreillette gauche.",
      "**Grande circulation** : ventricule gauche → **aorte** → organes → veines caves → oreillette droite.",
      "Sang **rouge** (schéma) = riche en O₂ ; sang **bleu** = pauvre en O₂ — sauf artère pulmonaire (bleu) et veines pulmonaires (rouge).",
    ],
    analogie: analogie(
      "Le cœur, c'est un immeuble à deux cages d'escalier qui ne communiquent pas. À droite, l'escalier mène aux poumons pour charger l'oxygène. À gauche, l'escalier plus musclé envoie ce sang partout dans le corps. L'aorte, c'est l'autoroute de sortie.",
      "Double circulation",
      "Deux cages d'escalier étanches : poumons d'un côté, corps de l'autre.",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Légender le **cœur** en coupe et relier chaque cavité / vaisseau au trajet du sang (petite et grande circulation).",
        ],
      },
      {
        id: "cavites",
        titre: "Savoirs — cavités et valves",
        paragraphes: [
          "4 cavités : 2 **oreillettes**, 2 **ventricules**. **Septum interventriculaire** : étanchéité.",
          "**Valve tricuspide** (droite), **valve mitrale** (gauche), valves pulmonaire et **aortique** : anti-reflux.",
        ],
      },
      {
        id: "trajet",
        titre: "Savoir-faire — le trajet",
        paragraphes: [
          "Veines caves → OD → VD → artère pulmonaire → poumons → veines pulmonaires → OG → VG → **aorte**.",
          "Sur le **modèle 3D**, touche chaque structure et dis si le sang y est oxygéné ou non.",
        ],
      },
    ],
  },

  excretion: {
    chapitreId: "excretion",
    titre: "L'excrétion",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["rein", "urine", "bassinet"],
    pucesEssentiel: [
      "Les **reins** filtrent le sang et fabriquent l'**urine**.",
      "De l'extérieur vers l'intérieur : **capsule** → **cortex** → **pyramides de Malpighi** → **papille** → **calice** → **bassinet** → **uretère**.",
      "L'**artère rénale** apporte le sang à filtrer ; la **veine rénale** le ramène filtré.",
      "L'urine descend par l'**uretère** jusqu'à la vessie.",
    ],
    analogie: analogie(
      "Le rein, c'est une usine de tri. L'artère, c'est le camion qui arrive chargé. Le cortex trie. Les pyramides concentrent les déchets. Le bassinet est le quai de chargement, l'uretère le convoyeur vers la vessie.",
      "Filtration rénale",
      "Usine de tri : arrivée, filtre, quai, convoyeur.",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Légender une **coupe de rein** et expliquer le trajet du sang et de l'urine.",
        ],
      },
      {
        id: "savoirs",
        titre: "Savoirs",
        paragraphes: [
          "**Cortex** : filtration (glomérules). **Médulla / pyramides** : concentration.",
          "**Calices** et **bassinet** : collecte. **Uretère** : évacuation.",
        ],
      },
    ],
  },

  adn: {
    chapitreId: "adn",
    titre: "Le support des caractères héréditaires : ADN",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["double hélice", "bases", "complémentaire"],
    pucesEssentiel: [
      "L'**ADN** est le support des **caractères héréditaires**.",
      "Structure en **double hélice** : deux brins sucre-phosphate reliés par des **bases**.",
      "Appariement **complémentaire** : **A–T** et **G–C** (jamais A–G ni T–C).",
      "Un **gène** est un segment d'ADN qui code un caractère ; une **mutation** le modifie.",
    ],
    analogie: analogie(
      "L'ADN, c'est une échelle torsadée. Les montants, c'est le sucre-phosphate. Les barreaux, ce sont les bases : A toujours en face de T, G toujours en face de C. Si tu changes un barreau, tu changes parfois la recette — c'est une mutation.",
      "Double hélice",
      "Une échelle torsadée : montants + barreaux A-T et G-C.",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Décrire la **double hélice** et relier ADN, gène et transmission des caractères (programme 3ème Togo).",
        ],
      },
      {
        id: "savoirs",
        titre: "Savoirs",
        paragraphes: [
          "Quatre bases : **A**dénine, **T**hymine, **G**uanine, **C**ytosine.",
          "Complémentarité : 2 liaisons hydrogène pour A–T, 3 pour G–C.",
        ],
      },
    ],
  },

  neurones: {
    chapitreId: "neurones",
    titre: "Fonctionnement des neurones",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["potentiel d'action", "synapse", "myéline"],
    pucesEssentiel: [
      "Le **potentiel d'action** est tout ou rien : il part ou il ne part pas.",
      "Il naît au **cône d'implantation**, puis court le long de l'**axone**.",
      "La **myéline** rend la conduction **saltatoire** (nœuds de Ranvier).",
      "À la **synapse** : vésicules → **neurotransmetteur** → récepteurs.",
    ],
    analogie: analogie(
      "Le potentiel d'action, c'est des dominos : ça part ou ça ne part pas. À la synapse, on arrête les dominos et on envoie un SMS chimique au neurone d'en face.",
      "Potentiel d'action et synapse",
      "Dominos, puis SMS.",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Relier la structure du **neurone** au **potentiel d'action** et à la **synapse**.",
        ],
      },
      {
        id: "pa",
        titre: "Savoirs — potentiel d'action",
        paragraphes: [
          "Na⁺ entre (dépolarisation), K⁺ sort (repolarisation).",
          "**Myéline** : l'influx saute de nœud en nœud.",
        ],
      },
      {
        id: "syn",
        titre: "Savoirs — synapse chimique",
        paragraphes: [
          "Influx → Ca²⁺ → exocytose des **vésicules** → **fente** → **récepteur** → potentiel postsynaptique.",
        ],
      },
    ],
  },

  brassage: {
    chapitreId: "brassage",
    titre: "Brassage génétique et ADN",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["méiose", "crossing-over", "allèle"],
    pucesEssentiel: [
      "La **méiose** produit des gamètes **haploïdes** et **brasse** les allèles.",
      "**Brassage interchromosomique** : répartition aléatoire des homologues (anaphase I).",
      "**Brassage intrachromosomique** : **crossing-over** en prophase I.",
      "L'**ADN** en **double hélice** porte les **gènes** ; A–T et G–C assurent la copie fidèle.",
    ],
    analogie: analogie(
      "Deux jeux de cartes familiaux. À la méiose, tu sépares les paquets au hasard (brassage inter) et parfois tu échanges quelques cartes au milieu d'un paquet (crossing-over). L'ADN, c'est le dos des cartes : A face à T, G face à C, pour que la copie reste lisible.",
      "Brassage génétique",
      "Deux jeux de cartes mélangés, puis un échange de cartes au milieu.",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Expliquer comment **méiose** + **fécondation** assurent l'unicité génétique, en s'appuyant sur la structure de l'**ADN**.",
        ],
      },
      {
        id: "savoirs",
        titre: "Savoirs",
        paragraphes: [
          "Prophase I : bivalents, chiasmas, **crossing-over**.",
          "Anaphase I : séparation des homologues. Anaphase II : séparation des chromatides.",
        ],
      },
    ],
  },

  glycemie: {
    chapitreId: "glycemie",
    titre: "Régulation de la glycémie et de la pression artérielle",
    matiereId: "svt",
    schema: "3d",
    motsClesMasques: ["insuline", "glucagon", "rein"],
    pucesEssentiel: [
      "La **glycémie** est régulée par l'**insuline** (baisse) et le **glucagon** (hausse).",
      "La **pression artérielle** dépend du débit cardiaque et de la vasomotricité.",
      "Le **rein** intervient : filtration, volume plasmatique, axe rénine-angiotensine.",
      "Sur le schéma : **artère rénale** (sang à filtrer), **cortex**, **bassinet**, **uretère**.",
    ],
    analogie: analogie(
      "La glycémie, c'est le niveau d'essence. Insuline : tu ranges l'essence à la station (foie, muscles). Glucagon : tu ressorts le jerrican. Le rein, c'est le trop-plein du réservoir : il ajuste le volume d'eau, donc la pression dans les tuyaux.",
      "Régulation interne",
      "Niveau d'essence (glucose) + trop-plein (rein / pression).",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Décrire un **boucle de régulation** (glycémie ou PA) et le rôle du **rein** dans le maintien du milieu intérieur.",
        ],
      },
    ],
  },

  complexes: {
    chapitreId: "complexes",
    titre: "Nombres complexes",
    matiereId: "maths",
    motsClesMasques: ["module", "argument", "conjugué"],
    pucesEssentiel: [
      "Un complexe s'écrit **z = a + ib** avec i² = −1.",
      "**Conjugué** : z̄ = a − ib. **Module** : |z| = √(a² + b²).",
      "Forme **trigo** : z = |z|(cos θ + i sin θ). Forme **expo** : z = |z| e^{iθ}.",
      "Le produit **ajoute les arguments** et **multiplie les modules**.",
    ],
    analogie: analogie(
      "Un complexe, c'est un point du plan : a vers la droite, b vers le haut. Le module, c'est la distance à l'origine — comme un rayon. L'argument, c'est l'angle. Multiplier par i, c'est tourner de 90°.",
      "Plan complexe",
      "Un point : distance (module) et angle (argument).",
    ),
    sectionsDetaillees: [
      {
        id: "competence",
        titre: "Compétence visée (APC)",
        paragraphes: [
          "Calculer dans ℂ (algébrique, trigo, expo) et interpréter géométriquement module et argument.",
        ],
      },
    ],
  },
};

export const FICHES: Record<string, FicheCoursData> = {
  ...FICHES_3EME,
  ...FICHES_TLE,
};

function fallbackFiche(chapitreId: string): FicheCoursData {
  const meta = findChapterMeta(chapitreId);
  const titre = meta?.chapter.title ?? "Fiche de cours";
  const matiereId = meta?.subject.id ?? "maths";
  const schema: SchemaCoursKind | undefined = chapterHas3dImage(chapitreId)
    ? chapitreId === "digest"
      ? "both"
      : "3d"
    : chapitreId === "digest"
      ? "2d"
      : undefined;
  const essentialText = `« ${titre} » : retiens le fil du chapitre, pas le détail des preuves.\n\n• Les [définitions] et les [propriétés] sont les mots cardinaux à restituer.\n• Relie chaque [notion] à un exemple du programme de ta classe.\n• Vérifie-toi ensuite avec le [quizz] d'assimilation 10/10.\n\nCette fiche réflexe est autonome : elle ne recopie pas En Détails. Passe à l'autre onglet pour la situation-problème, l'exemple résolu et 2 QCM.`;
  const detailedText = `Savoirs\n\nLe cours développé pose d'abord le vocabulaire, puis les propriétés et les relations entre elles. Chaque définition doit pouvoir être reformulée sans recopier. Les cas particuliers et les conditions d'application font partie du savoir, pas d'un à-côté. Les enchaînements du raisonnement (hypothèses, théorème, conclusion) sont aussi importants que le résultat numérique.\n\nSavoir-faire\n\nEn situation, tu identifies la notion utile, tu choisis une méthode, tu mènes le calcul ou le raisonnement, puis tu contrôles le résultat (unité, ordre de grandeur, cohérence avec l'énoncé). Le schéma, s'il existe, sert à ancrer le raisonnement.`;
  return {
    chapitreId,
    titre,
    matiereId,
    essentialText,
    detailedText,
    motsClesMasques: ["définitions", "propriétés", "notion", "quizz"],
    pucesEssentiel: [
      `« ${titre} » : retiens le fil du chapitre, pas le détail des preuves.`,
      "Les définitions et les propriétés sont les mots cardinaux à restituer.",
      "Relie chaque notion à un exemple du programme de ta classe.",
      "Vérifie-toi ensuite avec le quizz d'assimilation 10/10.",
    ],
    analogie: analogie(
      "Quand une idée paraît abstraite, je la ramène à quelque chose que tu connais déjà. C'est ça, mon boulot : le concept, en d'autres termes.",
      titre,
      "Un exemple du quotidien pour ancrer la notion.",
    ),
    situationProbleme: {
      recit: `Tu retrouves « ${titre} » dans un problème de la vie courante ou d'un devoir : il faut choisir la bonne méthode, pas recopier la leçon.`,
      question: "Quelle méthode du cours permet de résoudre cette situation ?",
      competenceVisee: `Mobiliser les savoirs du chapitre « ${titre} » pour résoudre une situation-problème conforme au programme.`,
    },
    exempleResolu: {
      enonce: `Un exercice type du chapitre « ${titre} ».`,
      etapes: [
        { titre: "Identifier", texte: "Repère la notion utile et les données de l'énoncé." },
        { titre: "Appliquer", texte: "Choisis la méthode du cours et mène le raisonnement pas à pas." },
        { titre: "Contrôler", texte: "Vérifie l'unité, l'ordre de grandeur et la cohérence avec l'énoncé." },
      ],
      reponseFinale: "Le résultat est cohérent avec l'énoncé et la fiche réflexe.",
    },
    miniQuiz: [
      {
        id: `${chapitreId}-mini-1`,
        enonceQuestion: `À quoi sert la fiche réflexe du chapitre « ${titre} » ?`,
        optionsProposees: [
          "Retenir formules et définitions clés",
          "Remplacer le quiz d'assimilation",
          "Copier En Détails en plus court",
          "Sauter les exercices",
        ],
        indexReponseCorrecte: 0,
        explicationPedagogique: "L'Essentiel est une fiche réflexe autonome : formules, définitions, mots-clés.",
      },
      {
        id: `${chapitreId}-mini-2`,
        enonceQuestion: "Après ces 2 questions, que dois-tu faire ?",
        optionsProposees: [
          "Passer le quizz d'assimilation (10 questions)",
          "Fermer l'application",
          "Relire uniquement l'analogie",
          "Ignorer l'exemple résolu",
        ],
        indexReponseCorrecte: 0,
        explicationPedagogique: "La mini-autoévaluation vérifie la compréhension ; le quiz d'assimilation 10/10 vient ensuite.",
      },
    ],
    sectionsDetaillees: [
      {
        id: "savoirs",
        titre: "Savoirs",
        paragraphes: [
          "Les définitions, propriétés et conditions d'application du chapitre, reformulées sans recopier.",
        ],
      },
      {
        id: "savoirfaire",
        titre: "Savoir-faire",
        paragraphes: [
          "Identifier la notion, choisir une méthode, mener le raisonnement, contrôler le résultat, puis valider au quizz 10/10.",
        ],
      },
    ],
    schema,
  };
}

export function ficheForChapter(chapitreId: string, classe?: string): FicheCoursData {
  const fallback = hydrateFiche(FICHES[chapitreId] ?? fallbackFiche(chapitreId));
  try {
    return hydrateFiche(overlayFiche(chapitreId, fallback, classe) ?? fallback);
  } catch {
    return fallback;
  }
}

export function countWords(puces: string[]): number {
  return countWordsInText(puces);
}

/** @deprecated — compat lecture ancienne maquette */
export const FICHE_DELTA: FicheCoursData = FICHES.eq2;
