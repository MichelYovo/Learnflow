import type { FicheCoursData } from "../types/learnflow";
import { tleFiche } from "./fichesBuild";

/** Fiches PC Tle D — APC physique Bohoussou + chimie Terminale (acide-base, orga). */
export const FICHES_TLE_PC: Record<string, FicheCoursData> = {
  "tle-d-cinematique": tleFiche({
    id: "tle-d-cinematique",
    titre: "Mouvements et équations horaires",
    matiereId: "pc",
    mots: ["référentiel", "trajectoire", "vitesse", "accélération", "équation horaire"],
    puces: [
      "Le **référentiel** est le solide par rapport auquel on étudie le mouvement (terrestre, géocentrique, Copernic).",
      "La **trajectoire** est l'ensemble des positions successives. **Équations horaires** : x(t), y(t), z(t) ou s(t).",
      "Vecteur position : OM = x i + y j + z k. Vecteur **vitesse** : dérivée de OM. Vecteur **accélération** : dérivée de v.",
      "MRU : v constante, a = 0. MRUA : a constante, v = v0 + a t, x = x0 + v0 t + (1/2) a t².",
      "En curviligne : v = ds/dt, a_t = dv/dt, a_n = v²/ρ.",
    ],
    parole:
      "Le référentiel, c'est la caméra. La trajectoire, c'est la trace du mobile. L'équation horaire, c'est le GPS en fonction du temps : où es-tu à la date t, et à quelle vitesse.",
    concept: "Équations horaires",
    exemple: "Athlète qui accélère puis court à vitesse constante : MRUA puis MRU.",
    recit:
      "Un élève de Tle D parcourt une piste rectiligne puis curviligne. On cherche les équations horaires des deux phases.",
    question: "Comment passer de x(t) à v(t) et a(t), et reconnaître MRU ou MRUA ?",
    competence:
      "Définir référentiel, trajectoire et vecteurs cinématiques, puis déterminer et utiliser les équations horaires (MRU, MRUA).",
    enonce: "x(t) = 2 t² (t en s, x en m). Calculer v(t) et a(t). Quel mouvement ?",
    etapes: [
      { titre: "Dériver", texte: "v = dx/dt = 4 t. a = dv/dt = 4 m/s²." },
      { titre: "Nature", texte: "a constante : MRUA rectiligne si la trajectoire est une droite." },
    ],
    reponse: "v(t) = 4t, a = 4 m·s⁻² : MRUA.",
    savoirs: [
      "Repère d'espace et de temps. Trajectoire rectiligne, circulaire, curviligne. Vitesse moyenne vs instantanée.",
      "MRU, MRUA, mouvement circulaire uniforme (vitesse tangentielle constante, accélération centripète).",
    ],
    savoirFaire: [
      "Choisir le référentiel. Dériver les équations horaires. Identifier a = 0 ou a constante.",
      "Exploiter un enregistrement (chronophotographie) : calculer v et a entre deux points.",
    ],
  }),

  "tle-d-newton": tleFiche({
    id: "tle-d-newton",
    titre: "Référentiel galiléen et théorèmes de mécanique",
    matiereId: "pc",
    mots: ["référentiel galiléen", "inertie", "centre d'inertie", "énergie cinétique"],
    puces: [
      "Un **référentiel galiléen** est un référentiel où le principe d'**inertie** est vérifié (Copernic, géocentrique ; terrestre sur une courte durée).",
      "Théorème du **centre d'inertie** : Σ F_ext = m a_G (dans un galiléen).",
      "Si Σ F = 0, G est en MRU (repos ou vitesse constante).",
      "Théorème de l'**énergie cinétique** : ΔEc = Σ W(F) entre deux instants. Ec = (1/2) m v².",
      "Une force constante : W = F · AB = F AB cos α.",
    ],
    parole:
      "Dans un car qui accélère, la poupée du rétroviseur s'incline : le car n'est plus galiléen. Dans un galiléen, les forces expliquent vraiment l'accélération du centre d'inertie, et le travail des forces change l'énergie cinétique.",
    concept: "Référentiel galiléen",
    exemple: "Poupée verticale à vitesse constante ; elle penche à l'accélération.",
    recit:
      "Dans le car de ramassage, la poupée reste verticale à l'arrêt ou à v constante, et s'incline à l'accélération. On relie cela aux référentiels galiléens et à ΣF = m a.",
    question: "Dans quel référentiel Σ F = m a_G, et comment le travail change-t-il Ec ?",
    competence:
      "Définir un référentiel galiléen, appliquer le théorème du centre d'inertie et le théorème de l'énergie cinétique.",
    enonce: "Une bille de 0,01 kg en chute libre. Forces ? Accélération de G ?",
    etapes: [
      { titre: "Bilan", texte: "Poids P = mg (frottements négligés)." },
      { titre: "TCI", texte: "P = m a_G ⇒ a_G = g vers le bas." },
    ],
    reponse: "a_G = g, verticale descendante. Chute libre dans le référentiel terrestre (approché galiléen).",
    savoirs: [
      "Principe d'inertie. Exemples de référentiels. Centre d'inertie G. Quantité de mouvement (si au programme).",
      "Travail d'une force. Puissance. Énergie cinétique. Forces conservatives et énergie potentielle (lien avec les chapitres suivants).",
    ],
    savoirFaire: [
      "Dire si un référentiel est galiléen dans une situation. Bilan des forces, appliquer ΣF = m a_G.",
      "Calculer W et ΔEc. Relier un enregistrement de chute libre au poids.",
    ],
  }),

  "tle-d-gravitation": tleFiche({
    id: "tle-d-gravitation",
    titre: "Gravitation et satellites",
    matiereId: "pc",
    mots: ["gravitation", "champ gravitationnel", "Kepler", "géostationnaire"],
    puces: [
      "Force de **gravitation** : F = G m1 m2 / r², attractive, selon la droite des centres.",
      "Le **champ gravitationnel** créé par M en un point : G = G M / r², vers M. Force sur m : F = m G.",
      "Satellite circulaire : mouvement circulaire uniforme. v = √(G M / r). T² / r³ = constante (**Kepler**).",
      "Un satellite **géostationnaire** reste fixe par rapport à la Terre : plan équatorial, même sens, T = 24 h, altitude ≈ 36 000 km.",
      "T ne dépend pas de la masse du satellite ; elle augmente avec l'altitude.",
    ],
    parole:
      "La Terre tire le satellite comme une fronde invisible. Plus il est haut, plus il met de temps à faire un tour. Géostationnaire : il tourne avec la Terre, donc il semble immobile au-dessus de l'équateur.",
    concept: "Satellite circulaire",
    exemple: "Satellite TV géostationnaire au-dessus de l'équateur.",
    recit:
      "On compare la Lune, un satellite d'observation et un satellite géostationnaire : même loi, altitudes différentes.",
    question: "Comment obtenir v et T d'un satellite circulaire, et les conditions du géostationnaire ?",
    competence:
      "Utiliser la gravitation et le champ gravitationnel, puis caractériser le mouvement d'un satellite circulaire (Kepler, géostationnaire).",
    enonce: "Pourquoi T est-il indépendant de la masse m du satellite ?",
    etapes: [
      { titre: "TCI", texte: "G M m / r² = m v² / r : m se simplifie." },
      { titre: "Période", texte: "T = 2π r / v donc T ne dépend pas de m." },
    ],
    reponse: "La masse m se simplifie dans ΣF = m a. T dépend de r (et de M), pas de m.",
    savoirs: [
      "Constante G. Champ g terrestre ≈ G M / R² à la surface. Poids et gravitation.",
      "3e loi de Kepler : T² / r³ = 4π² / (G M). Conditions du géostationnaire.",
    ],
    savoirFaire: [
      "Calculer F, G, v, T. Convertir altitude ↔ rayon (r = R + h).",
      "Vérifier les trois conditions du géostationnaire. Utiliser T²/r³ = cste pour comparer deux orbites.",
    ],
  }),

  "tle-d-champs": tleFiche({
    id: "tle-d-champs",
    titre: "Champs uniformes et projectiles",
    matiereId: "pc",
    mots: ["champ uniforme", "pesanteur", "électrostatique", "projectile", "parabole"],
    puces: [
      "Un **champ uniforme** a un vecteur constant (en norme, direction, sens) dans une région.",
      "Champ de **pesanteur** g : uniforme près du sol. Champ **électrostatique** E entre les armatures d'un condensateur plan.",
      "Force : P = m g. Sur une charge q : F = q E.",
      "Un **projectile** lancé avec v0 dans g uniforme a une trajectoire **parabolique** (si v0 n'est pas verticale).",
      "Équations : ax = 0, ay = −g (axe y vertical). Éliminer t donne y = ax² + bx + c.",
    ],
    parole:
      "Un champ uniforme, c'est une flèche identique partout, comme le vent sur un petit terrain plat. Le ballon de basket et l'électron du tube de Crookes dessinent alors une parabole, l'un sous g, l'autre sous E.",
    concept: "Champ uniforme",
    exemple: "Panier de basketball : parabole dans g. Électrons déviés entre les plaques d'un condensateur.",
    recit:
      "Journées portes ouvertes : un panier de basket et un faisceau d'électrons. On veut les équations des trajectoires.",
    question: "Comment obtenir l'équation cartésienne de la trajectoire dans g ou E uniforme ?",
    competence:
      "Définir un champ uniforme, écrire les équations horaires d'un projectile, et en déduire la trajectoire parabolique.",
    enonce: "v0 horizontale, axe y vers le haut, origine au lancer. Quelle est la forme de y(x) ?",
    etapes: [
      { titre: "Horaires", texte: "x = v0 t, y = −(1/2) g t²." },
      { titre: "Éliminer t", texte: "t = x/v0 ⇒ y = −(g/(2 v0²)) x² : parabole." },
    ],
    reponse: "Trajectoire parabolique y = k x² (k < 0).",
    savoirs: [
      "g uniforme près du sol. E uniforme entre plaques. Signe de q : un électron (q < 0) est accéléré à l'opposé de E.",
      "Portée, flèche, temps de vol d'un projectile. Superposition des mouvements (horizontal MRU, vertical MRUA).",
    ],
    savoirFaire: [
      "Projeter ΣF = m a sur x et y. Intégrer pour v(t) et x(t), y(t). Éliminer t.",
      "Adapter le raisonnement à F = q E (a = q E / m).",
    ],
  }),

  "tle-d-oscillateurs": tleFiche({
    id: "tle-d-oscillateurs",
    titre: "Oscillateurs mécaniques",
    matiereId: "pc",
    mots: ["oscillateur", "période", "pendule élastique", "amortissement", "énergie mécanique"],
    puces: [
      "Un **oscillateur** mécanique effectue des va-et-vient autour de l'équilibre. Libre (non **amorti**) si pas de frottement.",
      "Caractéristiques : **période** T, fréquence f = 1/T, amplitude, phase.",
      "Pendule **élastique** (masse-ressort) : F = −k x, équation x'' + (k/m) x = 0, T = 2π √(m/k).",
      "Sans amortissement, l'**énergie mécanique** Em = Ec + Ep se conserve. Ep = (1/2) k x² pour le ressort.",
      "L'amortisseur dissipe de l'énergie : l'amplitude diminue. Oscillations entretenues si on apporte de l'énergie.",
    ],
    parole:
      "Un ressort, c'est une balançoire : plus la masse est lourde, plus T est long ; plus le ressort est raide, plus T est court. Sans frottement, l'énergie circule entre cinétique et potentielle. L'amortisseur, c'est le frein qui mange un peu d'énergie à chaque aller-retour.",
    concept: "Oscillateur harmonique",
    exemple: "Suspension de voiture : ressort + amortisseur.",
    recit:
      "Une revue décrit l'amortisseur d'une auto avec le ressort. On définit l'oscillateur, son équation, T, et la conservation de Em sans frottement.",
    question: "Quelle est l'équation du pendule élastique et que devient Em avec frottements ?",
    competence:
      "Définir un oscillateur mécanique, établir l'équation du pendule élastique non amorti, et discuter la conservation de l'énergie mécanique.",
    enonce: "m = 0,4 kg, k = 40 N/m. Calculer T du pendule élastique horizontal sans frottement.",
    etapes: [
      { titre: "Formule", texte: "T = 2π √(m/k) = 2π √(0,4/40) = 2π √0,01 = 0,63 s environ." },
    ],
    reponse: "T = 2π × 0,1 ≈ 0,63 s.",
    savoirs: [
      "Exemples : pendule élastique, pesant, diapason. Équation différentielle x'' + ω0² x = 0, ω0 = 2π/T.",
      "Amortissement : frottements fluides, régime pseudo-périodique. Entretien des oscillations.",
    ],
    savoirFaire: [
      "Écrire ΣF = m a pour le ressort, obtenir x'' + (k/m) x = 0. Calculer T.",
      "Bilan Em = (1/2)mv² + (1/2)kx². Expliquer la baisse d'amplitude avec un amortisseur.",
    ],
  }),

  "tle-d-acide": tleFiche({
    id: "tle-d-acide",
    titre: "Acide-base et dosages",
    matiereId: "pc",
    mots: ["acide", "base", "pH", "couple", "dosage"],
    puces: [
      "Selon Brönsted : un **acide** cède H⁺, une **base** capte H⁺. Un **couple** acide/base : AH / A⁻.",
      "pH = −log [H3O⁺]. Eau pure : pH = 7 à 25 °C. Ke = [H3O⁺][HO⁻].",
      "Acide fort : réaction totale avec l'eau. Base forte : idem. pH d'un acide fort : −log c.",
      "Un **dosage** détermine une concentration inconnue. À l'équivalence, les réactifs se sont consommés selon les coefficients.",
      "Indicateur coloré : zone de virage. Un tampon a un pH qui varie peu.",
    ],
    parole:
      "Acide : donneur de H⁺. Base : receveur. Le pH, c'est le thermomètre de [H3O⁺]. Doser, c'est verser jusqu'à l'équivalence pour trouver la concentration inconnue, comme remplir un verre jusqu'à la marque.",
    concept: "Couple acide/base",
    exemple: "Dosage de HCl par NaOH : à l'équivalence n(acide) = n(base).",
    recit:
      "On identifie un couple AH/A⁻, on calcule le pH d'une solution d'acide fort, puis on dose par une base forte.",
    question: "Comment calculer le pH d'un acide fort et reconnaître l'équivalence d'un dosage ?",
    competence:
      "Définir acide, base, pH et couple, puis exploiter un dosage acido-basique (équivalence, indicateur).",
    enonce: "Solution d'acide fort c = 0,010 mol/L. pH ?",
    etapes: [
      { titre: "Fort", texte: "[H3O⁺] = c = 1,0×10⁻² mol/L." },
      { titre: "pH", texte: "pH = −log(10⁻²) = 2,0." },
    ],
    reponse: "pH = 2,0.",
    savoirs: [
      "Autoprotolyse de l'eau. Solutions acide / neutre / basique. Acide faible : équilibre, Ka, pKa. Forme prédominante selon pH / pKa.",
      "Dosage acide fort–base forte, acide faible–base forte. pH à l'équivalence. Courbe pH = f(V).",
    ],
    savoirFaire: [
      "Écrire AH + H2O ⇌ A⁻ + H3O⁺. Calculer pH d'un fort. Repérer le couple.",
      "Relier VE, c et V. Choisir un indicateur dont la zone encadre le pH d'équivalence.",
    ],
  }),

  "tle-d-orga": tleFiche({
    id: "tle-d-orga",
    titre: "Chimie organique",
    matiereId: "pc",
    mots: ["nomenclature", "alcool", "amine", "acide aminé", "groupe fonctionnel"],
    puces: [
      "La **nomenclature** des composés oxygénés : identifier la chaîne et le **groupe fonctionnel** (alcool −OH, aldéhyde, cétone, acide carboxylique, ester).",
      "Les **amines** : dérivés de NH3 (primaire, secondaire, tertiaire). Propriétés basiques.",
      "Un **acide aminé** porte −COOH et −NH2. Les protéines sont des enchaînements d'acides aminés (liaisons peptidiques).",
      "Isomérie : même formule brute, formules semi-développées différentes.",
      "Réactions types : oxydation d'alcool, estérification, formation d'amide / peptide.",
    ],
    parole:
      "En orga, tu nommes la molécule comme une adresse : chaîne principale + groupe caractéristique. L'alcool a un −OH, l'amine un N, l'acide aminé les deux : c'est la brique des protéines.",
    concept: "Groupes fonctionnels",
    exemple: "Éthanol CH3CH2OH. Glycine : acide aminé le plus simple.",
    recit:
      "On nomme des composés oxygénés, on classe une amine, puis on relie acides aminés et protéines.",
    question: "Comment nommer un alcool ou une cétone, et qu'est-ce qu'un acide aminé ?",
    competence:
      "Nommer les composés organiques oxygénés, caractériser amines et acides aminés, et relier ces derniers aux protéines.",
    enonce: "Quelle fonction porte CH3−CH2−OH ? Nom ?",
    etapes: [
      { titre: "Groupe", texte: "−OH sur carbone saturé : alcool." },
      { titre: "Nom", texte: "Deux carbones : éthanol." },
    ],
    reponse: "Alcool : éthanol.",
    savoirs: [
      "Règles de nomenclature (chaîne la plus longue, indice le plus petit). Aldéhyde −CHO, cétone C=O, acide −COOH, ester −COOR.",
      "Amines 1°, 2°, 3°. Acides aminés, zwitterion, liaison peptidique, protéine.",
    ],
    savoirFaire: [
      "Passer de la formule au nom et inversement. Repérer le groupe fonctionnel.",
      "Écrire une condensation de deux acides aminés (peptide). Distinguer isomères.",
    ],
  }),
};
