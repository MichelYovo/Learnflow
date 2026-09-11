import type { FicheCoursData } from "../types/learnflow";
import { tleFiche } from "./fichesBuild";

/** Fiches SVT Tle D — leçons TOMNOND (SVT TERMINAL). */
export const FICHES_TLE_SVT: Record<string, FicheCoursData> = {
  "tle-d-adn": tleFiche({
    id: "tle-d-adn",
    titre: "Le matériel génétique et la transmission",
    matiereId: "svt",
    mots: ["ADN", "nucléotide", "duplication", "ARNm", "code génétique"],
    puces: [
      "L'**ADN** est une double hélice de **nucléotides** (sucre, phosphate, base A, T, C, G). A s'associe à T, C à G.",
      "La **duplication** est semi-conservative : chaque brin sert de matrice.",
      "L'ARN est en général simple brin ; U remplace T. Types : ARNm, ARNt, ARNr.",
      "**Protéosynthèse** : **transcription** (ADN → ARNm) puis traduction (codons → acides aminés).",
      "Le **code génétique** est universel, redondant : un codon (triplet) code un acide aminé.",
    ],
    parole:
      "L'ADN, c'est un livre en double exemplaire. Le photocopier, c'est la duplication. L'ARNm, c'est une copie de travail d'un chapitre. La traduction, c'est passer du code à la recette de la protéine.",
    concept: "ADN et protéosynthèse",
    exemple: "Un gène transcrit en ARNm, puis traduit en chaîne d'acides aminés.",
    recit:
      "On compare ADN et ARN, puis on suit le chemin d'un gène jusqu'à la protéine pour expliquer une ressemblance parent-enfant.",
    question: "Comment l'information de l'ADN est-elle dupliquée puis exprimée en protéine ?",
    competence:
      "Décrire la structure des acides nucléiques, la duplication de l'ADN, et les étapes de la protéosynthèse (transcription, traduction, code génétique).",
    enonce: "Pourquoi dit-on que la duplication de l'ADN est semi-conservative ?",
    etapes: [
      { titre: "Ouverture", texte: "Les deux brins se séparent." },
      { titre: "Copies", texte: "Chaque brin sert de matrice : deux doubles hélices, chacune avec un brin ancien et un brin nouveau." },
    ],
    reponse: "Chaque molécule-fille conserve un brin parental et un brin néosynthétisé.",
    savoirs: [
      "Nucléotide : base + désoxyribose + phosphate pour l'ADN. Complémentarité A-T et C-G. ARN : ribose, uracile, souvent simple hélice.",
      "Transcription dans le noyau (eucaryotes). Traduction : initiation, élongation, terminaison. Un codon stop arrête la synthèse.",
    ],
    savoirFaire: [
      "Schématiser un nucléotide et un fragment de double hélice. Compléter un brin complémentaire.",
      "À partir d'un ARNm, lire le code génétique. Distinguer duplication, transcription et traduction.",
    ],
  }),

  "tle-d-heredite": tleFiche({
    id: "tle-d-heredite",
    titre: "L'hérédité humaine",
    matiereId: "svt",
    mots: ["pédigrée", "allèle", "dominant", "récessif", "gonosomes"],
    puces: [
      "Un **pédigrée** (arbre généalogique) indique les sujets sains, malades, et souvent les porteurs.",
      "Un **allèle** **dominant** s'exprime à l'état hétérozygote ; **récessif** seulement à l'état homozygote.",
      "Maladie autosomique vs liée aux **gonosomes** (souvent X) : transmission différente selon le sexe.",
      "On détermine le mode de transmission en suivant qui est atteint de génération en génération.",
      "Le conseil génétique s'appuie sur ces modes pour estimer un risque.",
    ],
    parole:
      "Le pédigrée, c'est l'arbre de famille annoté : rond, carré, coloré si malade. En suivant les couleurs, tu vois si le gène est dominant, récessif, ou accroché au chromosome X.",
    concept: "Pédigrée",
    exemple: "Daltonisme lié à l'X : plus fréquent chez les garçons.",
    recit:
      "Une famille consulte pour une maladie génétique. Il faut lire le pédigrée et proposer un mode de transmission.",
    question: "Comment distinguer une transmission autosomique récessive d'une transmission liée à l'X ?",
    competence:
      "Analyser un pédigrée, identifier sains / malades / porteurs, et expliquer le mode de transmission d'un caractère chez l'humain.",
    enonce: "Un enfant malade naît de deux parents sains. Le caractère est-il plutôt dominant ou récessif ?",
    etapes: [
      { titre: "Parents sains", texte: "Ils n'expriment pas le phénotype malade." },
      { titre: "Enfant malade", texte: "Il a reçu deux allèles malades : les parents sont hétérozygotes porteurs. Donc récessif." },
    ],
    reponse: "Caractère récessif : les parents sont porteurs sains.",
    savoirs: [
      "Symboles du pédigrée. Autosome vs gonosome X/Y. Hétérozygote, homozygote, hémizygote (XY).",
      "Une maladie dominante n'atteint pas forcément tous les descendants, mais un malade a en général un parent atteint (sauf néomutation).",
    ],
    savoirFaire: [
      "Lire un pédigrée. Proposer un génotype compatible. Calculer un risque simple (échiquier de Punnett).",
      "Argumenter dominant / récessif, autosomique / lié à l'X.",
    ],
  }),

  "tle-d-gameto": tleFiche({
    id: "tle-d-gameto",
    titre: "La gamétogenèse",
    matiereId: "svt",
    mots: ["spermatogenèse", "ovogenèse", "méiose", "haploïde", "gonades"],
    puces: [
      "Les **gonades** : testicules (tubes séminifères) et ovaires (follicules).",
      "**Spermatogenèse** : multiplication, accroissement, maturation (**méiose**), puis spermiogenèse (différenciation).",
      "La méiose passe de spermatocytes I **diploïdes** à spermatocytes II puis spermatides **haploïdes**.",
      "**Ovogenèse** : multiplication et accroissement dès la vie embryonnaire ; à la puberté, ovocyte I → ovocyte II à l'ovulation. Pas de phase de différenciation comme la spermiogenèse.",
      "À l'ovulation, l'ovocyte II est libéré dans la trompe (follicule de De Graaf).",
    ],
    parole:
      "Fabriquer un gamète, c'est réduire le stock de chromosomes de moitié (méiose) pour que fécondation reconstitue 2n. Chez le mâle, ça tourne en continu dans les tubes. Chez la femelle, le stock d'ovocytes I est déjà là à la naissance.",
    concept: "Gamétogenèse",
    exemple: "Spermatozoïde : cellule n, flagelle. Ovocyte II : grosse cellule bloquée en métaphase II.",
    recit:
      "On relie une coupe de testicule et d'ovaire aux quatre phases, pour expliquer pourquoi les gamètes sont haploïdes.",
    question: "Quelles sont les phases de la spermatogenèse et ce qui distingue l'ovogenèse ?",
    competence:
      "Décrire les étapes de la gamétogenèse, localiser les gonades, et comparer spermatogenèse et ovogenèse.",
    enonce: "Où se déroule la spermatogenèse et quel est le résultat de la méiose ?",
    etapes: [
      { titre: "Lieu", texte: "Tubes séminifères du testicule." },
      { titre: "Méiose", texte: "Spermatocyte I (2n) → 2 spermatocytes II (n) → 4 spermatides (n)." },
    ],
    reponse: "Dans les tubes séminifères. La méiose produit des cellules haploïdes (spermatides), puis les spermatozoïdes après spermiogenèse.",
    savoirs: [
      "Structure du testicule (lobules, tubes) et de l'ovaire (follicules primordiaux à mûrs). Follicule de De Graaf et ovulation.",
      "Méiose = deux divisions. Spermiogenèse = transformation morphologique des spermatides. Ovogenèse sans phase de différenciation équivalente.",
    ],
    savoirFaire: [
      "Légender une coupe de gonade. Ordonner les étapes. Comparer nombre de gamètes, rythme, et ploidie.",
      "Relier méiose et haploïdie des gamètes.",
    ],
  }),

  "tle-d-fecond": tleFiche({
    id: "tle-d-fecond",
    titre: "La fécondation et les premières étapes",
    matiereId: "svt",
    mots: ["fécondation", "segmentation", "implantation", "nidation", "œuf"],
    puces: [
      "La **fécondation** : rencontre d'un spermatozoïde et d'un ovocyte, en général dans la trompe. Elle rétablit la diploïdie.",
      "Étapes : rapprochement, pénétration, amphimixie (fusion des pronucléi).",
      "L'**œuf** (zygote) subit la **segmentation** tout en migrant vers l'utérus.",
      "L'**implantation** (nidation) dans l'endomètre fixe l'embryon.",
      "Les premières étapes du développement posent les feuillets et le début de l'organogenèse.",
    ],
    parole:
      "Deux cellules haploïdes fusionnent : on retrouve 2n, comme un cadenas qui se referme. Puis l'œuf se divise en route vers l'utérus, et s'installe : c'est la nidation.",
    concept: "Fécondation et nidation",
    exemple: "Morula puis blastocyste avant l'implantation.",
    recit:
      "On suit le trajet de l'œuf de la trompe à l'utérus pour dater fécondation, segmentation et nidation.",
    question: "Quelles conditions et quelles étapes mènent de la fécondation à l'implantation ?",
    competence:
      "Décrire le processus de la fécondation à l'implantation de l'œuf, puis les premières étapes du développement.",
    enonce: "Pourquoi la fécondation rétablit-elle le caryotype diploïde ?",
    etapes: [
      { titre: "Gamètes", texte: "Spermatozoïde n et ovocyte n." },
      { titre: "Fusion", texte: "L'œuf 2n contient un lot paternel et un lot maternel." },
    ],
    reponse: "Fusion des deux lots haploïdes → cellule-œuf 2n.",
    savoirs: [
      "Conditions : rencontre dans les voies femelles, capacité des gamètes. Importance : mixité génétique et rétablissement de 2n.",
      "Segmentation : mitoses sans croissance globale. Migration. Implantation dans l'endomètre. Début du développement embryonnaire.",
    ],
    savoirFaire: [
      "Ordonner fécondation → segmentation → nidation. Schématiser les étapes.",
      "Relier le lieu (trompe / utérus) à l'étape.",
    ],
  }),

  "tle-d-sperma": tleFiche({
    id: "tle-d-sperma",
    titre: "La reproduction chez les spermatophytes",
    matiereId: "svt",
    mots: ["fleur", "étamine", "pistil", "pollinisation", "graine"],
    puces: [
      "La **fleur** porte les organes reproducteurs : **étamines** (androcée, pollen) et **pistil** / gynécée (ovules).",
      "Le pollen est produit dans l'anthère. L'ovule est dans l'ovaire.",
      "La **pollinisation** : transport du pollen jusqu'au stigmate (vent, insectes…).",
      "Après fécondation, l'ovule devient **graine**, l'ovaire fruit. La graine assure la dissémination.",
      "Cycle des spermatophytes : alternance sporophyte (plante) et gamétophytes réduits (pollen, sac embryonnaire).",
    ],
    parole:
      "La fleur, c'est l'usine à graines. Le pollen, c'est le messager mâle. Une fois fécondé, l'ovule s'habille en graine, et l'ovaire en fruit.",
    concept: "Reproduction des plantes à graines",
    exemple: "Une fleur de haricot : 5 étamines, un pistil, puis une gousse.",
    recit:
      "On disséque une fleur pour relier étamine, pollen, ovaire, ovule, puis fruit et graine.",
    question: "Comment passe-t-on de la fleur à la graine chez les spermatophytes ?",
    competence:
      "Identifier les organes d'une fleur et décrire le cycle de reproduction des plantes à graines (pollinisation, fécondation, graine).",
    enonce: "Quel organe produit le pollen et que devient l'ovule après fécondation ?",
    etapes: [
      { titre: "Pollen", texte: "Produit par l'étamine (anthère)." },
      { titre: "Graine", texte: "L'ovule fécondé devient la graine." },
    ],
    reponse: "Anthère → pollen. Ovule fécondé → graine.",
    savoirs: [
      "Organisation de la fleur (réceptacle, sépales, pétales, androcée, gynécée). Coupe d'anthère.",
      "Pollinisation directe ou croisée. Double fécondation chez les angiospermes (si au programme). Graine et fruit.",
    ],
    savoirFaire: [
      "Légender une fleur. Relier pollen / ovule / graine / fruit.",
      "Expliquer le rôle de la pollinisation dans la fécondation.",
    ],
  }),

  "tle-d-nerf": tleFiche({
    id: "tle-d-nerf",
    titre: "Le tissu nerveux et ses propriétés",
    matiereId: "svt",
    mots: ["neurone", "axone", "synapse", "influx", "myéline"],
    puces: [
      "Le système nerveux : encéphale, moelle, nerfs. Le **neurone** : dendrites, corps cellulaire, **axone**.",
      "Le nerf est un faisceau de fibres. La **myéline** accélère la conduction (saltatoire).",
      "L'**influx** (potentiel d'action) naît au cône d'implantation et se propage le long de l'axone.",
      "À la **synapse**, le message devient chimique : neurotransmetteur dans la fente.",
      "Propriétés : excitabilité, conductibilité, innervation unilatérale (sens unique dendrites → axone → synapse).",
    ],
    parole:
      "Un neurone, c'est un fil électrique avec une station relais à l'arrivée. L'influx court sur l'axone ; à la synapse, on change de langage : chimique. La myéline, c'est la gaine qui fait sauter le message plus vite.",
    concept: "Tissu nerveux",
    exemple: "Arc réflexe : message sensoriel vers la moelle, puis moteur vers le muscle.",
    recit:
      "On relie une coupe de moelle et un neurone pour expliquer comment un message va du récepteur à l'effecteur.",
    question: "Comment l'influx se propage-t-il et que se passe-t-il à la synapse ?",
    competence:
      "Décrire l'organisation du système nerveux, la structure du neurone et du nerf, et les propriétés (influx, synapse).",
    enonce: "Pourquoi la synapse impose-t-elle un sens unique au message nerveux ?",
    etapes: [
      { titre: "Libération", texte: "Le neurotransmetteur n'est libéré que par le bouton présynaptique." },
      { titre: "Récepteurs", texte: "Les récepteurs sont sur la membrane postsynaptique : le message ne revient pas." },
    ],
    reponse: "La chimie de la synapse est polarisée : le message va seulement du pré- vers le post-synaptique.",
    savoirs: [
      "Schéma de synthèse du SN. Moelle : substance grise / blanche. Structure du nerf. Neurone moteur, sensoriel, interneurone.",
      "Potentiel de repos, potentiel d'action. Conduction saltatoire. Synapse neuromusculaire (lien avec le muscle).",
    ],
    savoirFaire: [
      "Légender un neurone et une synapse. Ordonner : dendrites → corps → axone → synapse.",
      "Relier myéline et vitesse. Distinguer message électrique et chimique.",
    ],
  }),

  "tle-d-muscle": tleFiche({
    id: "tle-d-muscle",
    titre: "La physiologie du muscle strié",
    matiereId: "svt",
    mots: ["fibre musculaire", "sarcomère", "actine", "myosine", "synapse neuromusculaire"],
    puces: [
      "Le muscle strié squelettique : faisceaux de **fibres musculaires** (cellules allongées, plurinucléées).",
      "La fibre contient des myofibrilles striées : le **sarcomère** (unité entre deux stries Z) avec **actine** et **myosine**.",
      "La **synapse neuromusculaire** transmet l'ordre du motoneurone à la fibre (acétylcholine).",
      "Contraction : les filaments d'actine glissent sur la myosine, le sarcomère raccourcit (ATP).",
      "Un muscle se contracte en réponse à un influx ; le relâchement suit l'arrêt du message et le recyclage du Ca²⁺.",
    ],
    parole:
      "Le sarcomère, c'est un accordéon : actine et myosine s'accrochent et glissent, la fibre raccourcit. L'ordre arrive par la plaque motrice, comme une prise électrique sur le muscle.",
    concept: "Contraction musculaire",
    exemple: "Un biceps qui plie le coude : raccourcissement des sarcomères.",
    recit:
      "On relie la plaque motrice, le potentiel de fibre et le glissement actine-myosine pour expliquer un mouvement.",
    question: "Comment un influx nerveux déclenche-t-il le raccourcissement du sarcomère ?",
    competence:
      "Décrire l'organisation du muscle strié et expliquer la contraction (synapse neuromusculaire, actine, myosine).",
    enonce: "Quel est le rôle de l'ATP et de la synapse neuromusculaire dans la contraction ?",
    etapes: [
      { titre: "Synapse", texte: "L'acétylcholine déclenche le potentiel de fibre et la libération de Ca²⁺." },
      { titre: "Glissement", texte: "L'ATP permet aux têtes de myosine de se lier à l'actine et de tirer : le sarcomère raccourcit." },
    ],
    reponse: "La synapse transmet l'ordre ; l'ATP alimente le glissement actine-myosine.",
    savoirs: [
      "Structure macroscopique (tendon, corps musculaire) et microscopique (fibre, myofibrille, sarcomère). Stries A, I, Z.",
      "Couplage excitation-contraction. Rôle du calcium. Unité motrice.",
    ],
    savoirFaire: [
      "Légender un sarcomère au repos et contracté. Relier nerf → plaque → fibre → glissement.",
      "Expliquer pourquoi sans ATP (ou sans Ca²⁺) la contraction s'arrête.",
    ],
  }),

  "tle-d-milieu": tleFiche({
    id: "tle-d-milieu",
    titre: "La régulation du milieu intérieur",
    matiereId: "svt",
    mots: ["homéostasie", "milieu intérieur", "glycémie", "insuline", "glucagon"],
    puces: [
      "Le **milieu intérieur** : plasma, lymphe, liquide interstitiel. L'**homéostasie** maintient ses constantes.",
      "La **glycémie** est régulée par l'**insuline** (baisse : stockage) et le **glucagon** (hausse : déstockage).",
      "Le pancréas endocrine (îlots) détecte le glucose et sécrète ces hormones.",
      "La pression artérielle dépend du débit cardiaque et de la vasomotricité ; le rein ajuste le volume.",
      "Une boucle de régulation : capteur, centre, effecteur, rétrocontrôle.",
    ],
    parole:
      "Le milieu intérieur, c'est l'aquarium de tes cellules. L'homéostasie, c'est le thermostat. Insuline : trop de sucre, on range. Glucagon : pas assez, on ressort le stock.",
    concept: "Homéostasie",
    exemple: "Après un repas sucré, l'insuline fait baisser la glycémie.",
    recit:
      "Après un effort et un repas, on explique comment glycémie et pression restent dans une fourchette compatible avec la vie.",
    question: "Comment insuline et glucagon s'opposent-ils pour stabiliser la glycémie ?",
    competence:
      "Identifier les composants du milieu intérieur et expliquer une régulation (glycémie, pression) par rétrocontrôle.",
    enonce: "Que se passe-t-il si la glycémie monte après un repas ?",
    etapes: [
      { titre: "Détection", texte: "Les cellules β des îlots sécrètent l'insuline." },
      { titre: "Effet", texte: "Le glucose entre dans foie et muscles : la glycémie redescend." },
    ],
    reponse: "L'insuline favorise le stockage du glucose : la glycémie revient vers la valeur de consigne.",
    savoirs: [
      "Composants et caractéristiques du milieu intérieur. Homéostasie = maintien dynamique.",
      "Glycémie : insuline / glucagon. Pression artérielle : cœur, vaisseaux, rein, hormones (rénine-angiotensine si au programme).",
    ],
    savoirFaire: [
      "Schématiser une boucle (stimulus → hormone → effecteur → retour). Lire une courbe de glycémie.",
      "Distinguer hyperglycémie et hypoglycémie et les hormones associées.",
    ],
  }),
};
