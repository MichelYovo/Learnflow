import type { FicheCoursData } from "../types/learnflow";
import { tleFiche } from "./fichesBuild";

/** Fiches Maths Tle D — résumé de FICHE DE COURS MATHS TleD (VISAMATH). */
export const FICHES_TLE_MATHS: Record<string, FicheCoursData> = {
  "tle-d-vecteurs": tleFiche({
    id: "tle-d-vecteurs",
    titre: "Vecteurs de l'espace et repérage",
    matiereId: "maths",
    mots: ["colinéaires", "coplanaires", "base", "repère", "coordonnées"],
    puces: [
      "Deux vecteurs de l'espace sont **colinéaires** si l'un est nul ou s'ils ont la même direction. Non nuls : u = α v.",
      "Trois vecteurs sont **coplanaires** si deux sont colinéaires ou si l'un est combinaison linéaire des deux autres.",
      "Une **base** de l'espace est un triplet de vecteurs non coplanaires.",
      "Un **repère** de l'espace est (O ; i, j, k) : O un point et (i, j, k) une base.",
      "Dans une base, tout vecteur a un triplet unique de **coordonnées** (x ; y ; z).",
    ],
    parole:
      "Un vecteur, c'est une flèche : où elle pointe, de quel côté, et quelle longueur. Colinéaires : deux flèches sur la même route. Un repère, c'est trois flèches depuis O : avance de x, de y, de z.",
    concept: "Base et repère de l'espace",
    exemple: "Trois flèches non coplanaires depuis O donnent les coordonnées d'un point.",
    recit:
      "En Tle D, on repère un point M de l'espace pour calculer une distance et un alignement. Il faut une base, un origne O, puis les coordonnées de M.",
    question: "Comment montrer que deux vecteurs sont colinéaires et que trois points sont alignés ?",
    competence:
      "Repérer un point et décomposer un vecteur dans une base, puis utiliser la colinéarité pour l'alignement ou le parallélisme dans l'espace.",
    enonce: "Dans un repère (O ; i, j, k), A(1 ; 0 ; 2), B(3 ; 2 ; 4), C(5 ; 4 ; 6). Les points A, B, C sont-ils alignés ?",
    etapes: [
      { titre: "Vecteurs", texte: "AB = (2 ; 2 ; 2) et AC = (4 ; 4 ; 4)." },
      { titre: "Colinéarité", texte: "AC = 2 AB, donc AB et AC sont colinéaires." },
      { titre: "Conclusion", texte: "A, B, C alignés ⇔ AB et AC colinéaires." },
    ],
    reponse: "Oui : AC = 2 AB, donc A, B et C sont alignés.",
    savoirs: [
      "Deux vecteurs non nuls sont colinéaires ssi il existe un réel α tel que u = α v. Trois vecteurs u, v, w avec u et v non colinéaires sont coplanaires ssi w = α u + β v.",
      "Une base est un triplet de vecteurs non coplanaires : tout vecteur s'écrit de façon unique comme combinaison linéaire. Un repère (O ; i, j, k) donne à tout point M un unique triplet (x ; y ; z) tel que OM = x i + y j + z k.",
      "Coordonnées de AB : (xB − xA ; yB − yA ; zB − zA). Relation de Chasles : AB + BC = AC. Quatre points A, B, C, D sont coplanaires ⇔ AB, AC, AD sont coplanaires.",
    ],
    savoirFaire: [
      "Lire et placer un point dans un repère. Calculer les coordonnées d'un vecteur. Prouver la colinéarité par proportionnalité des coordonnées.",
      "Décomposer un vecteur dans une base. Relier colinéarité et alignement : A, B, C alignés ⇔ AB et AC colinéaires.",
    ],
  }),

  "tle-d-barycentre": tleFiche({
    id: "tle-d-barycentre",
    titre: "Barycentre de n points pondérés",
    matiereId: "maths",
    mots: ["barycentre", "isobarycentre", "homogénéité", "associativité"],
    puces: [
      "Un **point pondéré** est un couple (A ; α) : un point et un réel.",
      "G = bar{(A ; α), (B ; β)} est l'unique point tel que α GA + β GB = 0, avec α + β ≠ 0.",
      "L'**isobarycentre** : mêmes coefficients. Pour 2 points, c'est le milieu ; pour 3 points non alignés, le centre de gravité du triangle.",
      "**Homogénéité** : multiplier tous les coefficients par k ≠ 0 ne change pas G.",
      "**Associativité** : on peut remplacer p points par leur barycentre partiel affecté de la somme des coefficients.",
    ],
    parole:
      "Le barycentre, c'est le point d'équilibre d'une balance. Chaque point a un poids. Si tu doubles tous les poids, l'équilibre ne bouge pas. L'isobarycentre, c'est quand tous les poids sont égaux.",
    concept: "Barycentre",
    exemple: "Milieu de [AB] = isobarycentre de A et B.",
    recit:
      "On cherche le point d'équilibre de plusieurs masses placées en A, B, C. C'est le barycentre des points pondérés.",
    question: "Comment construire G = bar{(A ; 2), (B ; 1), (C ; 1)} et calculer ses coordonnées ?",
    competence:
      "Définir le barycentre de n points pondérés, utiliser l'homogénéité et l'associativité, et calculer ses coordonnées.",
    enonce: "G = bar{(A ; 2), (B ; 1)}. Exprimer AG en fonction de AB.",
    etapes: [
      { titre: "Relation", texte: "2 GA + GB = 0." },
      { titre: "Chasles", texte: "GB = GA + AB. Donc 2 GA + GA + AB = 0 ⇒ 3 GA = −AB ⇒ AG = (1/3) AB." },
      { titre: "Lecture", texte: "G est au tiers de [AB] à partir de A (poids 2 en A, 1 en B)." },
    ],
    reponse: "AG = (1/3) AB. G divise [AB] dans le rapport 1 : 2.",
    savoirs: [
      "G existe ssi la somme des coefficients est non nulle. Réduction : α1 MA1 + … + αn MAn = (Σαi) MG. Si la somme est nulle, la somme vectorielle est indépendante de M.",
      "Coordonnées : xG = (Σ αi x_i) / (Σ αi), et de même pour y et z. L'isobarycentre de A et B est le milieu ; de A, B, C non alignés, le centre de gravité ; de 4 points d'un tétraèdre, le centre du tétraèdre.",
    ],
    savoirFaire: [
      "Construire G avec la formule AG = (1/Σα) Σ αi AAi. Réduire une somme vectorielle en faisant apparaître le barycentre.",
      "Utiliser l'homogénéité pour simplifier les coefficients, l'associativité pour regrouper, puis lire les coordonnées dans un repère.",
    ],
  }),

  "tle-d-scalaire": tleFiche({
    id: "tle-d-scalaire",
    titre: "Produit scalaire",
    matiereId: "maths",
    mots: ["produit scalaire", "norme", "orthogonaux", "vecteur normal"],
    puces: [
      "u · v = ||u|| × ||v|| × cos(u, v). Aussi : u · v = AH × AB si H est le projeté de C sur (AB) avec u = AB, v = AC.",
      "u · v = v · u. (αu) · v = α (u · v). u · (v + w) = u · v + u · w.",
      "La **norme** : ||u|| = √(u · u). Un vecteur **unitaire** a pour norme 1.",
      "u et v sont **orthogonaux** ⇔ u · v = 0. Une base **orthonormée** : vecteurs unitaires deux à deux orthogonaux.",
      "Dans une base orthonormée : u · v = xx' + yy' + zz'. Un **vecteur normal** à un plan dirige une droite perpendiculaire à ce plan.",
    ],
    parole:
      "Le produit scalaire mesure à quel point deux flèches « vont dans le même sens ». S'elles sont perpendiculaires, le produit est zéro. La norme, c'est la longueur de la flèche.",
    concept: "Produit scalaire",
    exemple: "Deux arêtes d'un cube se coupant en un sommet : produit scalaire nul.",
    recit:
      "On veut savoir si une droite est perpendiculaire à un plan, ou si un triangle est rectangle. Le produit scalaire tranche.",
    question: "Comment montrer que deux droites sont orthogonales et qu'un plan a pour vecteur normal n ?",
    competence:
      "Calculer un produit scalaire, caractériser l'orthogonalité, et reconnaître les positions relatives droites/plans ainsi que les lieux géométriques.",
    enonce: "Dans un repère orthonormé, u(1 ; 2 ; 2) et v(2 ; −1 ; 0). Calculer u · v et ||u||.",
    etapes: [
      { titre: "Analytique", texte: "u · v = 1×2 + 2×(−1) + 2×0 = 0." },
      { titre: "Norme", texte: "||u|| = √(1+4+4) = 3." },
      { titre: "Lecture", texte: "u · v = 0 : u et v sont orthogonaux." },
    ],
    reponse: "u · v = 0 et ||u|| = 3. Les vecteurs sont orthogonaux.",
    savoirs: [
      "Positions : deux droites orthogonales ⇔ vecteurs directeurs de produit scalaire nul ; parallèles ⇔ vecteurs directeurs colinéaires. Droite ⊥ plan ⇔ directeur colinéaire au vecteur normal. Droite // plan ⇔ directeur orthogonal au normal. Plans ⊥ ⇔ normales orthogonales ; plans // ⇔ normales colinéaires.",
      "Lieux dans l'espace : M tel que AM · u = 0 est le plan passant par A de normal u. AM · BM = 0 est la sphère de diamètre [AB]. AM = BM est le plan médiateur de [AB]. AM = k (k > 0) est la sphère de centre A et de rayon k.",
    ],
    savoirFaire: [
      "Calculer u · v par le cosinus, par projection, ou par xx'+yy'+zz' dans une base orthonormée. Démontrer l'orthogonalité.",
      "Identifier un vecteur normal à un plan. Traduire une condition vectorielle en plan, sphère, médiatrice ou cercle.",
    ],
  }),

  "tle-d-param": tleFiche({
    id: "tle-d-param",
    titre: "Représentations paramétriques",
    matiereId: "maths",
    mots: ["paramétrique", "vecteur directeur", "équation cartésienne", "plan"],
    puces: [
      "Droite passant par A(x0 ; y0 ; z0) de **vecteur directeur** u(a ; b ; c) : x = x0 + t a, y = y0 + t b, z = z0 + t c (t réel).",
      "C'est une **représentation paramétrique** de la droite.",
      "Un **plan** passant par A de vecteurs directeurs u et v non colinéaires : OM = OA + t u + s v.",
      "Équation **cartésienne** d'un plan : ax + by + cz + d = 0, avec n(a ; b ; c) vecteur normal.",
      "Un point appartient à la droite (resp. au plan) s'il existe t (resp. t, s) vérifiant le système.",
    ],
    parole:
      "Une paramétrique, c'est un GPS : tu pars de A et tu avances de t pas dans la direction u. Pour un plan, tu as deux directions : tu te déplaces en t et en s.",
    concept: "Paramétriques de droites et de plans",
    exemple: "La droite des ascenseurs : un point de départ et une direction verticale.",
    recit:
      "On veut l'équation de la droite (AB) et du plan (ABC) pour savoir si un point D est sur la droite ou dans le plan.",
    question: "Comment passer d'une représentation paramétrique à une équation cartésienne de plan ?",
    competence:
      "Écrire une représentation paramétrique d'une droite ou d'un plan, et une équation cartésienne de plan, puis tester l'appartenance d'un point.",
    enonce: "A(1 ; 0 ; 0), u(1 ; 1 ; 1). Donner une représentation paramétrique de la droite passant par A et de directeur u.",
    etapes: [
      { titre: "Formule", texte: "x = 1 + t, y = t, z = t." },
      { titre: "Vérification", texte: "Pour t = 0 on retrouve A. Le directeur est (1 ; 1 ; 1)." },
    ],
    reponse: "x = 1 + t, y = t, z = t, t ∈ ℝ.",
    savoirs: [
      "Deux droites sont parallèles si leurs vecteurs directeurs sont colinéaires, sécantes si un point commun existe, sinon non coplanaires. Un plan admet une équation ax+by+cz+d=0.",
      "Le vecteur n(a ; b ; c) est normal au plan ax+by+cz+d=0. Une droite est incluse dans le plan si un point de la droite est dans le plan et si son directeur est orthogonal à n.",
    ],
    savoirFaire: [
      "Écrire la paramétrique d'une droite connaissant un point et un directeur, ou deux points. Écrire celle d'un plan avec un point et deux directeurs.",
      "Obtenir une équation cartésienne (produit scalaire AM · n = 0). Tester si un point appartient à la droite ou au plan.",
    ],
  }),

  "tle-d-systemes": tleFiche({
    id: "tle-d-systemes",
    titre: "Systèmes d'équations linéaires",
    matiereId: "maths",
    mots: ["système", "pivot de Gauss", "lignes", "triangulaire"],
    puces: [
      "Un **système** de p équations linéaires à n inconnues : somme a_ij x_j = b_i.",
      "Une **solution** est une n-liste qui vérifie toutes les équations à la fois.",
      "Opérations sur les **lignes** : permuter, multiplier par α ≠ 0, remplacer Li par α Li + β Lj.",
      "Le **pivot de Gauss** transforme le système en un système **triangulaire** équivalent, plus facile à résoudre.",
      "Si une ligne devient 0 = 0, on retire ; si 0 = k avec k ≠ 0, l'ensemble solution est vide.",
    ],
    parole:
      "Gauss, c'est ranger un casse-tête : tu élimines les inconnues une par une jusqu'à n'avoir plus qu'une pyramide. Si tu tombes sur 0 = 5, impossible. Si 0 = 0, une inconnue reste libre.",
    concept: "Pivot de Gauss",
    exemple: "Deux droites du plan : une solution (sécantes), aucune (parallèles), ou une infinité (confondues).",
    recit:
      "Un problème d'espace se traduit par un système de 3 équations à 3 inconnues. Il faut le résoudre sans se tromper de cas.",
    question: "Comment décider si le système a 0, une ou une infinité de solutions ?",
    competence:
      "Résoudre un système linéaire par opérations élémentaires et pivot de Gauss, et interpréter le nombre de solutions.",
    enonce: "Résoudre : x + y = 3 et x − y = 1.",
    etapes: [
      { titre: "L1 + L2", texte: "2x = 4 ⇒ x = 2." },
      { titre: "Remonter", texte: "2 + y = 3 ⇒ y = 1." },
    ],
    reponse: "S = {(2 ; 1)}.",
    savoirs: [
      "Deux systèmes sont équivalents s'ils ont le même ensemble de solutions. Les opérations élémentaires ne changent pas l'ensemble solution.",
      "Après triangulaire : soit un unique n-uplet, soit des paramètres libres (infinité), soit une contradiction 0 = k ≠ 0 (ensemble vide).",
    ],
    savoirFaire: [
      "Choisir un pivot non nul, permuter si besoin, éliminer l'inconnue dans les autres lignes, recommencer.",
      "Remonter le système triangulaire. Interpréter géométriquement (intersection de plans) si le contexte l'exige.",
    ],
  }),

  "tle-d-vectoriel": tleFiche({
    id: "tle-d-vectoriel",
    titre: "Produit vectoriel",
    matiereId: "maths",
    mots: ["produit vectoriel", "base directe", "aire", "colinéaires"],
    puces: [
      "On oriente l'espace avec le **bonhomme d'Ampère** : base **directe** si j est à sa gauche.",
      "Le **produit vectoriel** u ∧ v est orthogonal à u et à v, de norme ||u|| ||v|| |sin θ|, et (u, v, u ∧ v) est directe.",
      "u ∧ v = 0 ⇔ u et v **colinéaires**. u ∧ v = − v ∧ u.",
      "Dans une base orthonormée directe : u ∧ v = (yz' − zy' ; zx' − xz' ; xy' − yx').",
      "||u ∧ v|| est l'**aire** du parallélogramme construit sur u et v.",
    ],
    parole:
      "Le produit vectoriel fabrique une flèche perpendiculaire aux deux autres. Tourne de u vers v avec la main droite : le pouce donne le sens. L'aire du parallélogramme, c'est sa longueur.",
    concept: "Produit vectoriel",
    exemple: "Aire d'un parallélogramme dans l'espace : norme du produit vectoriel des deux côtés.",
    recit:
      "On veut un vecteur normal au plan (ABC) et l'aire du triangle ABC. Le produit vectoriel AB ∧ AC répond aux deux.",
    question: "Comment obtenir un vecteur normal à un plan et l'aire d'un triangle ?",
    competence:
      "Orienter l'espace, calculer un produit vectoriel, et l'utiliser pour un vecteur normal, l'aire ou la colinéarité.",
    enonce: "u(1 ; 0 ; 0), v(0 ; 1 ; 0) dans une base orthonormée directe. Calculer u ∧ v.",
    etapes: [
      { titre: "Formule", texte: "u ∧ v = (0−0 ; 0−0 ; 1−0) = (0 ; 0 ; 1)." },
      { titre: "Contrôle", texte: "Orthogonal à i et à j, norme 1, base directe (i, j, k)." },
    ],
    reponse: "u ∧ v = (0 ; 0 ; 1) = k.",
    savoirs: [
      "Permuter circulairement les vecteurs d'une base ne change pas l'orientation ; permuter deux vecteurs ou remplacer un vecteur par son opposé change l'orientation.",
      "u ∧ (v + w) = u ∧ v + u ∧ w. (αu) ∧ v = α (u ∧ v). Le produit mixte (u ∧ v) · w est le volume (orienté) du parallélépipède.",
    ],
    savoirFaire: [
      "Calculer u ∧ v en coordonnées. En déduire un vecteur normal au plan (ABC) : AB ∧ AC.",
      "Aire du triangle ABC = (1/2) ||AB ∧ AC||. Tester la colinéarité par u ∧ v = 0.",
    ],
  }),

  "tle-d-complexes": tleFiche({
    id: "tle-d-complexes",
    titre: "Nombres complexes",
    matiereId: "maths",
    mots: ["forme algébrique", "conjugué", "module", "argument", "exponentielle"],
    puces: [
      "z = a + ib avec i² = −1. a = Re(z), b = Im(z) : **forme algébrique**.",
      "**Conjugué** z̄ = a − ib. **Module** |z| = √(a² + b²). z z̄ = |z|².",
      "Forme trigonométrique : z = |z| (cos θ + i sin θ), θ = **argument**.",
      "Forme **exponentielle** : z = |z| e^{iθ}. Produit : modules multipliés, arguments ajoutés.",
      "z = z' ⇔ Re(z) = Re(z') et Im(z) = Im(z').",
    ],
    parole:
      "Un complexe, c'est un point du plan : a vers la droite, b vers le haut. Le module, c'est la distance à O. L'argument, c'est l'angle. Multiplier par i, c'est tourner de 90°.",
    concept: "Plan complexe",
    exemple: "e^{iπ} = −1 : un demi-tour sur le cercle unité.",
    recit:
      "On résout z² − 2z + 2 = 0 et on veut placer les racines dans le plan, avec module et argument.",
    question: "Comment passer de a + ib à la forme expo et multiplier deux complexes ?",
    competence:
      "Calculer dans ℂ (algébrique, trigo, exponentielle) et interpréter géométriquement module et argument.",
    enonce: "z = 1 + i. Donner |z|, un argument, et la forme exponentielle.",
    etapes: [
      { titre: "Module", texte: "|z| = √(1+1) = √2." },
      { titre: "Argument", texte: "θ = π/4 car cos θ = 1/√2 et sin θ = 1/√2." },
      { titre: "Expo", texte: "z = √2 e^{iπ/4}." },
    ],
    reponse: "z = √2 e^{iπ/4}.",
    savoirs: [
      "Tout réel est un complexe (b = 0). Si a = 0 et b ≠ 0, z est imaginaire pur. Égalité : parties réelles et imaginaires égales.",
      "Formule d'Euler : e^{iθ} = cos θ + i sin θ. Inverse : 1/z = z̄ / |z|² si z ≠ 0. Les racines n-ièmes de l'unité sont e^{2i k π / n}.",
    ],
    savoirFaire: [
      "Additionner et multiplier en algébrique. Conjuguer. Calculer module et argument. Passer à la forme trigo ou expo.",
      "Interpréter : |z − z_A| = r est le cercle de centre A. arg((z−z_A)/(z−z_B)) = θ est un arc capable.",
    ],
  }),

  "tle-d-similitudes": tleFiche({
    id: "tle-d-similitudes",
    titre: "Similitudes planes",
    matiereId: "maths",
    mots: ["similitude", "écriture complexe", "rapport", "translation", "rotation"],
    puces: [
      "Une **transformation** du plan est une bijection du plan dans lui-même. Son **écriture complexe** relie z' à z.",
      "**Translation** de vecteur u d'affixe b : z' = z + b.",
      "Une **similitude** directe s'écrit z' = a z + b avec a ≠ 0. Le **rapport** est |a|, l'angle est arg(a).",
      "Si a = 1, c'est une translation. Si |a| = 1 et a ≠ 1, c'est une rotation. Si a réel > 0, une homothétie (ou translation).",
      "Les similitudes conservent les angles et multiplient les distances par le rapport k = |a|.",
    ],
    parole:
      "Une similitude, c'est un photocopieur avec zoom et rotation : tout est agrandi d'un même rapport et tourné d'un même angle. L'écriture z' = a z + b code le zoom (module de a) et la rotation (argument de a).",
    concept: "Similitude directe",
    exemple: "Homothétie de centre O et de rapport 2 : z' = 2z.",
    recit:
      "On transforme un triangle ABC en A'B'C' par zoom et rotation. On cherche l'écriture complexe et le centre.",
    question: "Comment lire le rapport, l'angle et le centre dans z' = a z + b ?",
    competence:
      "Associer à une transformation plane son écriture complexe, et reconnaître translations, rotations, homothéties et similitudes.",
    enonce: "f : z' = i z + 1. Quel est le rapport ? L'angle ?",
    etapes: [
      { titre: "a", texte: "a = i, |a| = 1, arg(a) = π/2." },
      { titre: "Nature", texte: "Rapport 1 et angle π/2 : rotation d'angle π/2 (plus une translation à identifier par le centre)." },
    ],
    reponse: "Rapport 1, angle π/2. C'est une rotation d'angle π/2.",
    savoirs: [
      "L'écriture complexe d'une translation de vecteur d'affixe b est z' = z + b. Une rotation de centre Ω d'affixe ω et d'angle θ : z' − ω = e^{iθ} (z − ω).",
      "Similitude directe de rapport k > 0 et d'angle θ : z' − ω = k e^{iθ} (z − ω), soit z' = a z + b avec a = k e^{iθ}.",
    ],
    savoirFaire: [
      "Écrire z' = a z + b à partir du rapport, de l'angle et d'un point et de son image. Réciproquement, lire k = |a| et θ = arg(a).",
      "Trouver le centre : point fixe z' = z, soit z = a z + b. Distinguer translation (a = 1) et les autres cas.",
    ],
  }),

  "tle-d-limites": tleFiche({
    id: "tle-d-limites",
    titre: "Limites et continuité",
    matiereId: "maths",
    mots: ["limite", "continuité", "asymptote", "opérations"],
    puces: [
      "lim x→+∞ x^n = +∞. lim x→0 (sin x)/x = 1. lim x→0 (1 − cos x)/x² = 1/2.",
      "On combine les **limites** par somme, produit, quotient (si le dénominateur ne tend pas vers 0).",
      "Formes indéterminées classiques : ∞ − ∞, 0 × ∞, ∞/∞, 0/0.",
      "f est **continue** en a si lim x→a f(x) = f(a). Continue sur I si elle l'est en tout point de I.",
      "Une **asymptote** horizontale y = L si lim x→∞ f(x) = L. Verticale x = a si lim x→a f(x) = ±∞.",
    ],
    parole:
      "La limite, c'est la valeur vers laquelle tu te rapproches, même si tu ne l'atteins pas. Continue, c'est un fil que tu traces sans lever le crayon.",
    concept: "Limite et continuité",
    exemple: "1/x → 0 en +∞ : l'axe des x est asymptote horizontale.",
    recit:
      "On étudie f(x) = (x² + 1)/(x − 1) : comportement en 1 et en l'infini, pour tracer la courbe.",
    question: "Comment lever une forme indéterminée et conclure sur les asymptotes ?",
    competence:
      "Calculer des limites, reconnaître les formes indéterminées, et déduire continuité et asymptotes.",
    enonce: "Calculer lim x→+∞ (3x² + 1)/(x² − x).",
    etapes: [
      { titre: "Facteur dominant", texte: "Diviser haut et bas par x² : (3 + 1/x²)/(1 − 1/x) → 3/1 = 3." },
    ],
    reponse: "La limite vaut 3. Asymptote horizontale y = 3.",
    savoirs: [
      "Opérations sur les limites et composition. Comparaison : si |f| ≤ g et g → 0, alors f → 0.",
      "Théorème des gendarmes. Une fonction dérivable est continue. Les fonctions polynômes, rationnelles (hors pôles), ln, exp, trigo sont continues sur leur ensemble de définition.",
    ],
    savoirFaire: [
      "Factoriser, simplifier, utiliser les équivalents ou les limites de référence. Traiter 0/0 ou ∞/∞.",
      "Conclure continuité en un point. Déterminer les asymptotes (horizontale, verticale, parfois oblique).",
    ],
  }),

  "tle-d-derivees": tleFiche({
    id: "tle-d-derivees",
    titre: "Dérivée et étude de fonctions",
    matiereId: "maths",
    mots: ["nombre dérivé", "tangente", "variations", "extremum"],
    puces: [
      "f est **dérivable** en x0 si [f(x) − f(x0)]/(x − x0) a une limite finie : le **nombre dérivé** f'(x0).",
      "La **tangente** en x0 a pour équation y = f'(x0)(x − x0) + f(x0).",
      "Formules : (u+v)' = u'+v', (uv)' = u'v + uv', (1/v)' = −v'/v², (u/v)' = (u'v − uv')/v².",
      "(u ∘ v)' = (u' ∘ v) × v'. Table : (x^n)' = n x^{n−1}, (ln x)' = 1/x, (e^x)' = e^x.",
      "Le signe de f' donne les **variations**. f'(a) = 0 et changement de signe : **extremum** local.",
    ],
    parole:
      "La dérivée, c'est la pente de la route au kilomètre x0. Si f' > 0, ça grimpe. Si f' = 0 et ça change de sens, tu es au col ou au fond de la vallée.",
    concept: "Nombre dérivé",
    exemple: "Tangente à y = x² en 1 : pente 2, droite y = 2x − 1.",
    recit:
      "On étudie f(x) = x e^{−x} : dérivée, tableau de variations, maximum, et tangente en 0.",
    question: "Comment obtenir f', le tableau de variations et l'équation de la tangente ?",
    competence:
      "Calculer une dérivée, interpréter le nombre dérivé comme pente de tangente, et dresser le tableau de variations.",
    enonce: "f(x) = x² − 4x + 3. Calculer f'(x) et les variations sur ℝ.",
    etapes: [
      { titre: "Dérivée", texte: "f'(x) = 2x − 4 = 2(x − 2)." },
      { titre: "Signe", texte: "f' < 0 sur ]−∞ ; 2[, f' > 0 sur ]2 ; +∞[." },
      { titre: "Variations", texte: "f décroît jusqu'à 2, puis croît. Minimum f(2) = −1." },
    ],
    reponse: "f'(x) = 2(x − 2). Minimum en x = 2, f(2) = −1.",
    savoirs: [
      "Dérivabilité ⇒ continuité (la réciproque est fausse). Interprétation : vitesse instantanée, coefficient directeur de la tangente.",
      "Théorème : si f' > 0 sur un intervalle, f est strictement croissante. Point critique : f'(a) = 0. Convexité liée au signe de f''.",
    ],
    savoirFaire: [
      "Dériver somme, produit, quotient, composée. Écrire l'équation de la tangente.",
      "Tableau de variations. Lire un extremum. Étudier une fonction (ensemble de définition, limites, dérivée, variations, branche infinie).",
    ],
  }),

  "tle-d-primitives": tleFiche({
    id: "tle-d-primitives",
    titre: "Primitives",
    matiereId: "maths",
    mots: ["primitive", "constante", "continue"],
    puces: [
      "F est une **primitive** de f sur I si F' = f sur I.",
      "Toute fonction **continue** sur I admet des primitives sur I.",
      "Si F est une primitive, les autres sont G(x) = F(x) + C, C constante réelle.",
      "Primitives usuelles : x^n (n ≠ −1) → x^{n+1}/(n+1) ; 1/x → ln|x| ; e^x → e^x ; cos → sin ; sin → −cos.",
      "Linéarité : une primitive de αf + β g est α F + β G.",
    ],
    parole:
      "Dériver, c'est descendre la colline. Primitive, c'est remonter : tu retrouves la fonction dont la pente est f. Il y a toujours + C, parce que plusieurs chemins ont la même pente.",
    concept: "Primitive",
    exemple: "Une primitive de 2x est x², ou x² + 7 : même dérivée.",
    recit:
      "On connaît f' et on veut f, avec f(0) = 1. Il faut une primitive puis caler la constante.",
    question: "Comment trouver toutes les primitives puis celle qui vérifie F(a) = y0 ?",
    competence:
      "Reconnaître une primitive, utiliser les formules usuelles et la linéarité, et déterminer la constante par une condition.",
    enonce: "Déterminer les primitives de f(x) = 3x² + 1/x sur ]0 ; +∞[, puis celle qui s'annule en 1.",
    etapes: [
      { titre: "Usuelles", texte: "F(x) = x³ + ln x + C." },
      { titre: "Condition", texte: "F(1) = 0 ⇒ 1 + 0 + C = 0 ⇒ C = −1." },
    ],
    reponse: "F(x) = x³ + ln x − 1.",
    savoirs: [
      "Existence : f continue ⇒ primitives. Unicité à une constante près. Lien avec l'intégrale : F(x) = ∫_a^x f(t) dt est la primitive qui s'annule en a.",
      "Formules : u' u^n → u^{n+1}/(n+1) ; u'/u → ln|u| ; u' e^u → e^u.",
    ],
    savoirFaire: [
      "Reconnaître la forme u' u^n ou u'/u. Ajouter + C. Utiliser F(a) = y0 pour trouver C.",
      "Vérifier en dérivant le résultat.",
    ],
  }),

  "tle-d-ln": tleFiche({
    id: "tle-d-ln",
    titre: "Fonction logarithme népérien",
    matiereId: "maths",
    mots: ["ln", "primitive", "équation", "dérivée"],
    puces: [
      "**ln** est la primitive sur ]0 ; +∞[ de 1/x qui s'annule en 1. Donc ln 1 = 0 et (ln x)' = 1/x.",
      "Propriété fondamentale : ln(xy) = ln x + ln y (x > 0, y > 0).",
      "ln(x^r) = r ln x. ln(1/x) = −ln x. ln(x/y) = ln x − ln y.",
      "ln est continue, dérivable, strictement croissante de ]0 ; +∞[ vers ℝ. lim x→0+ ln x = −∞, lim x→+∞ ln x = +∞.",
      "Équation ln x = m ⇔ x = e^m. ln x = ln y ⇔ x = y (x, y > 0).",
    ],
    parole:
      "ln, c'est le compteur qui transforme les produits en sommes : multiplier les x, c'est additionner les ln. Il n'existe que pour les nombres strictement positifs, et il passe par 0 en 1.",
    concept: "Logarithme népérien",
    exemple: "ln(e) = 1, ln(1) = 0, ln(e²) = 2.",
    recit:
      "On résout ln(x − 1) + ln(x + 1) = ln 8 et on étudie g(x) = ln x / x.",
    question: "Comment utiliser ln(xy) = ln x + ln y pour résoudre une équation ?",
    competence:
      "Utiliser la définition et les propriétés de ln, dériver, et résoudre des équations ou inéquations.",
    enonce: "Résoudre ln(2x) = ln 6 + ln(x − 1) dans ℝ.",
    etapes: [
      { titre: "Ensemble", texte: "2x > 0 et x − 1 > 0 ⇒ x > 1." },
      { titre: "Propriété", texte: "ln(2x) = ln[6(x − 1)]. Donc 2x = 6x − 6 ⇒ 4x = 6 ⇒ x = 3/2." },
      { titre: "Contrôle", texte: "3/2 > 1 : solution acceptable." },
    ],
    reponse: "S = {3/2}.",
    savoirs: [
      "ln est la réciproque de exp. Courbe : concave, tangente en 1 d'équation y = x − 1. Inéquation : ln x < ln y ⇔ 0 < x < y.",
      "Dérivée de ln u : u'/u (u > 0). Limite de référence : ln x / x → 0 en +∞ ; x ln x → 0 en 0+.",
    ],
    savoirFaire: [
      "Simplifier ln(ab), ln(a/b), ln(a^n). Résoudre ln u = ln v. Dériver ln u.",
      "Étudier une fonction contenant ln : ensemble de définition, limites, variations.",
    ],
  }),

  "tle-d-exp": tleFiche({
    id: "tle-d-exp",
    titre: "Fonction exponentielle",
    matiereId: "maths",
    mots: ["exponentielle", "réciproque", "e^x", "puissance"],
    puces: [
      "**exp** est la **réciproque** de ln : exp : ℝ → ]0 ; +∞[. On note exp(x) = e^x.",
      "ln(e^x) = x et e^{ln x} = x (x > 0). e^0 = 1, e^1 = e.",
      "(e^x)' = e^x. e^{x+y} = e^x e^y. (e^x)^α = e^{α x}.",
      "a^α = e^{α ln a} pour a > 0. C'est la **puissance** d'exposant réel.",
      "e^x > 0 pour tout x. lim x→−∞ e^x = 0, lim x→+∞ e^x = +∞. e^x = e^y ⇔ x = y.",
    ],
    parole:
      "e^x, c'est le miroir de ln : ce que ln a compressé, exp le redéplie. Croissance très rapide. Une puissance a^α, c'est e^{α ln a} : on passe toujours par ln et exp.",
    concept: "Exponentielle népérienne",
    exemple: "e^{ln 5} = 5. 2^π = e^{π ln 2}.",
    recit:
      "On compare 2^x et e^x, on résout e^{2x} − 3 e^x + 2 = 0, et on étudie une fonction puissance.",
    question: "Comment se ramener à e^X = k et utiliser a^α = e^{α ln a} ?",
    competence:
      "Utiliser exp comme réciproque de ln, les propriétés des puissances, et résoudre des équations exponentielles.",
    enonce: "Résoudre e^{2x} − 3 e^x + 2 = 0.",
    etapes: [
      { titre: "Inconnue auxiliaire", texte: "Poser X = e^x > 0. X² − 3X + 2 = 0." },
      { titre: "Racines", texte: "(X − 1)(X − 2) = 0 ⇒ X = 1 ou X = 2." },
      { titre: "Retour", texte: "e^x = 1 ⇒ x = 0 ; e^x = 2 ⇒ x = ln 2." },
    ],
    reponse: "S = {0 ; ln 2}.",
    savoirs: [
      "exp est continue, dérivable, strictement croissante. Sa courbe est au-dessus de ses tangentes. a^α a^β = a^{α+β}, (ab)^α = a^α b^α.",
      "Fonctions puissances x ↦ x^α (x > 0) : dérivée α x^{α−1}. Croissance comparée : x^α / e^x → 0 en +∞.",
    ],
    savoirFaire: [
      "Passer de ln à exp et inversement. Résoudre e^{u(x)} = k. Linéariser avec X = e^x.",
      "Écrire a^α = e^{α ln a}. Dériver e^{u(x)} : u' e^u. Étudier x^α.",
    ],
  }),

  "tle-d-integrales": tleFiche({
    id: "tle-d-integrales",
    titre: "Calcul intégral",
    matiereId: "maths",
    mots: ["intégrale", "primitive", "aires", "bornes"],
    puces: [
      "∫_a^b f(x) dx = F(b) − F(a), où F est une **primitive** de f continue.",
      "a et b sont les **bornes**. La variable x est muette.",
      "Si f ≥ 0, l'**intégrale** est l'aire entre la courbe, l'axe des x, et les droites x = a, x = b.",
      "Linéarité : ∫(αf + βg) = α ∫f + β ∫g. ∫_a^a = 0. ∫_a^b = − ∫_b^a.",
      "Relation de Chasles : ∫_a^c = ∫_a^b + ∫_b^c. Si a ≤ b et f ≤ g, alors ∫f ≤ ∫g.",
    ],
    parole:
      "Intégrer, c'est additionner des aires de petites bandes. Le résultat se lit sur une primitive : F(b) − F(a), comme un compteur d'aire entre a et b.",
    concept: "Intégrale",
    exemple: "Aire sous y = x de 0 à 2 : ∫_0^2 x dx = 2.",
    recit:
      "On calcule l'aire entre y = x² et y = x sur [0 ; 1], puis la valeur moyenne de f.",
    question: "Comment calculer ∫_a^b f et interpréter le résultat comme une aire ?",
    competence:
      "Calculer une intégrale à l'aide d'une primitive, utiliser linéarité et Chasles, et interpréter graphiquement l'aire.",
    enonce: "Calculer ∫_0^1 (2x + 1) dx.",
    etapes: [
      { titre: "Primitive", texte: "F(x) = x² + x." },
      { titre: "Bornes", texte: "F(1) − F(0) = 2 − 0 = 2." },
    ],
    reponse: "∫_0^1 (2x + 1) dx = 2.",
    savoirs: [
      "f continue sur [a ; b] est intégrable. Positivité : f ≥ 0 ⇒ ∫_a^b f ≥ 0 si a ≤ b. Inégalité de la moyenne.",
      "Intégration par parties : ∫ u' v = uv − ∫ u v'. Changement de variable (selon le programme).",
    ],
    savoirFaire: [
      "Trouver F, calculer F(b) − F(a). Découper avec Chasles. Aire entre deux courbes : ∫ |f − g|.",
      "Valeur moyenne de f sur [a ; b] : (1/(b − a)) ∫_a^b f.",
    ],
  }),

  "tle-d-equadiff": tleFiche({
    id: "tle-d-equadiff",
    titre: "Équations différentielles linéaires",
    matiereId: "maths",
    mots: ["équation différentielle", "y'", "coefficients constants", "solution"],
    puces: [
      "Une **équation différentielle** a pour inconnue une fonction y, et contient au moins une dérivée de y.",
      "y' = f(x) : les solutions sont les primitives de f.",
      "y' = a y : solutions y(x) = K e^{a x}. y' = a y + b (a ≠ 0) : y(x) = K e^{a x} − b/a.",
      "Second ordre à **coefficients constants** : y'' + p y' + q y = 0. On résout r² + p r + q = 0.",
      "Selon Δ : deux réels r1, r2 → y = A e^{r1 x} + B e^{r2 x} ; racine double r → (A + B x) e^{r x} ; Δ < 0 : exponentielle × (cos, sin).",
    ],
    parole:
      "Une équa-diff, c'est une règle sur la vitesse (y') ou l'accélération (y'') de y. Résoudre, c'est trouver toutes les courbes qui respectent cette règle. Il reste des constantes A, B à caler avec les conditions initiales.",
    concept: "Équation différentielle",
    exemple: "Refroidissement : T' = −k T donne T(t) = T0 e^{−k t}.",
    recit:
      "Un oscillateur ou une population vérifie y' = a y + b. On cherche y(t) avec y(0) connu.",
    question: "Comment résoudre y' = a y + b et caler K avec y(0) ?",
    competence:
      "Reconnaître l'ordre d'une équation différentielle linéaire, donner l'ensemble des solutions, et utiliser une condition initiale.",
    enonce: "Résoudre y' = 2y, avec y(0) = 3.",
    etapes: [
      { titre: "Générale", texte: "y(x) = K e^{2x}." },
      { titre: "Initiale", texte: "y(0) = 3 ⇒ K = 3." },
    ],
    reponse: "y(x) = 3 e^{2x}.",
    savoirs: [
      "Ordre = plus haute dérivée. Solution sur I = fonction qui vérifie l'équation sur I. Équation homogène / avec second membre (forme y' = ay + b).",
      "Pour y'' + p y' + q y = 0, l'équation caractéristique r² + p r + q = 0 dicte la forme des solutions.",
    ],
    savoirFaire: [
      "Identifier a et b dans y' = a y + b. Écrire la solution générale. Injecter y(x0) = y0.",
      "Pour le second ordre : discriminant, écrire A, B, puis conditions y(0) et y'(0) si demandées.",
    ],
  }),

  "tle-d-suites": tleFiche({
    id: "tle-d-suites",
    titre: "Suites numériques",
    matiereId: "maths",
    mots: ["suite", "terme général", "récurrence", "limite", "arithmétique"],
    puces: [
      "Une **suite** (u_n) est une fonction de ℕ (ou une partie) vers ℝ. u_n est le **terme général**.",
      "Définie par une formule explicite u_n = f(n), ou par **récurrence** u_{n+1} = f(u_n) et u_0.",
      "Suite **arithmétique** : u_{n+1} = u_n + r. **Géométrique** : u_{n+1} = q u_n.",
      "Croissante si u_{n+1} ≥ u_n. Majorée, minorée, convergente si elle admet une **limite** finie.",
      "Si u_n → L et f continue, f(u_n) → f(L). Point fixe : L = f(L) pour une récurrence u_{n+1} = f(u_n).",
    ],
    parole:
      "Une suite, c'est une liste numérotée : u0, u1, u2… Arithmétique : tu ajoutes toujours le même pas. Géométrique : tu multiplies par le même q. La limite, c'est la valeur vers laquelle la liste se calme.",
    concept: "Suite numérique",
    exemple: "u_n = 2^n : géométrique de raison 2, diverge vers +∞.",
    recit:
      "On étudie u_{n+1} = (u_n + 2)/2 avec u_0 = 0 : monotonie, convergence, limite.",
    question: "Comment montrer la monotonie et trouver la limite d'une suite récurrente ?",
    competence:
      "Reconnaître le mode de génération d'une suite, étudier monotonie et convergence, et calculer une limite.",
    enonce: "u_n = 3n + 1. La suite est-elle arithmétique ? Donner sa raison et lim u_n.",
    etapes: [
      { titre: "Raison", texte: "u_{n+1} − u_n = 3 : arithmétique de raison 3." },
      { titre: "Limite", texte: "3n + 1 → +∞." },
    ],
    reponse: "Oui, raison 3. La suite diverge vers +∞.",
    savoirs: [
      "Somme des n premiers termes d'une arithmétique, d'une géométrique (q ≠ 1). Convergence des géométriques : |q| < 1 ⇒ q^n → 0.",
      "Théorème de convergence monotone : croissante et majorée ⇒ convergente. Suites adjacentes.",
    ],
    savoirFaire: [
      "Calculer u_n selon le type. Étudier u_{n+1} − u_n ou u_{n+1}/u_n. Raisonner par récurrence.",
      "Conjecturer L, passer à la limite dans u_{n+1} = f(u_n). Encadrer pour conclure.",
    ],
  }),

  "tle-d-denombrement": tleFiche({
    id: "tle-d-denombrement",
    titre: "Dénombrement",
    matiereId: "maths",
    mots: ["cardinal", "factorielle", "arrangement", "permutation", "combinaison"],
    puces: [
      "card(E) = nombre d'éléments. card(A ∪ B) = card(A) + card(B) − card(A ∩ B). 0! = 1, n! = n(n−1)…1.",
      "Tirages successifs avec remise, ordonnés : n^p p-uplets.",
      "**Arrangement** A_n^p = n! / (n−p)! : tirages successifs sans remise, ordonnés. **Permutation** : A_n^n = n!.",
      "**Combinaison** C_n^p = n! / (p! (n−p)!) : p éléments non ordonnés, distincts.",
      "Tableau : ordonné + distincts → arrangements ; non ordonné + distincts → combinaisons ; avec remise → n^p.",
    ],
    parole:
      "Dénombrer, c'est compter les façons. Si l'ordre compte (un code), c'est un arrangement. Si l'ordre ne compte pas (une équipe), c'est une combinaison. n! c'est le nombre de files pour n personnes.",
    concept: "Arrangements et combinaisons",
    exemple: "Anagrammes de 4 lettres distinctes : 4! = 24. Choisir 2 élèves parmi 5 : C_5^2 = 10.",
    recit:
      "Un QCM de 3 questions à 4 choix, un code à 4 chiffres distincts, un jury de 3 parmi 10 : trois modèles différents.",
    question: "Comment choisir entre n^p, A_n^p et C_n^p ?",
    competence:
      "Choisir le modèle de tirage (ordonné ou non, avec ou sans remise) et calculer le cardinal.",
    enonce: "Combien de podiums (1er, 2e, 3e) avec 8 coureurs ?",
    etapes: [
      { titre: "Ordre", texte: "L'ordre compte, sans répétition : arrangement A_8^3." },
      { titre: "Calcul", texte: "A_8^3 = 8×7×6 = 336." },
    ],
    reponse: "336 podiums.",
    savoirs: [
      "Produit cartésien : card(A × B) = card(A) card(B). Factorielle : 0! = 1. C_n^p = C_n^{n−p}. Triangle de Pascal : C_{n+1}^{p+1} = C_n^p + C_n^{p+1}.",
      "Le tableau de la fiche VISAMATH : avec remise et ordonné → n^p ; sans remise et ordonné → A_n^p ; sans remise et non ordonné → C_n^p.",
    ],
    savoirFaire: [
      "Lire l'énoncé : ordre ? répétition ? Appliquer la formule. Calculer n!, A_n^p, C_n^p.",
      "Découper un décompte en étapes (produit) ou en cas (somme).",
    ],
  }),

  "tle-d-probas": tleFiche({
    id: "tle-d-probas",
    titre: "Probabilités",
    matiereId: "maths",
    mots: ["probabilité", "conditionnelle", "indépendance", "variable aléatoire", "binomiale"],
    puces: [
      "P(Ω) = 1, P(∅) = 0, 0 ≤ P(A) ≤ 1. P(A ∪ B) = P(A) + P(B) − P(A ∩ B).",
      "**Conditionnelle** : P(A|B) = P(A ∩ B) / P(B) si P(B) ≠ 0. Formule des probabilités totales.",
      "A et B **indépendants** ⇔ P(A ∩ B) = P(A) P(B).",
      "Une **variable aléatoire** X associe un réel à chaque issue. Espérance E(X), variance V(X).",
      "Loi **binomiale** B(n, p) : n épreuves de Bernoulli indépendantes, P(X = k) = C_n^k p^k (1−p)^{n−k}. E(X) = n p.",
    ],
    parole:
      "Une proba, c'est la part du gâteau des issues. Conditionnelle : on recoupe le gâteau en ne gardant que B. Binomiale : tu répètes n fois pile-ou-face, et tu comptes le nombre de succès.",
    concept: "Probabilité conditionnelle et loi binomiale",
    exemple: "10 QCM au hasard, 4 choix, X = nombre de bonnes réponses : X suit B(10 ; 1/4).",
    recit:
      "Un test médical, un tirage dans une urne, puis n lancers : il faut conditionner, puis reconnaître une binomiale.",
    question: "Quand utiliser P(A|B), l'indépendance, ou la loi B(n, p) ?",
    competence:
      "Calculer une probabilité, une conditionnelle, et reconnaître une loi binomiale (paramètres, P(X=k), espérance).",
    enonce: "On lance une pièce équilibrée 3 fois. X = nombre de piles. P(X = 2) ?",
    etapes: [
      { titre: "Loi", texte: "X ~ B(3 ; 1/2)." },
      { titre: "Formule", texte: "P(X = 2) = C_3^2 (1/2)^2 (1/2)^1 = 3/8." },
    ],
    reponse: "P(X = 2) = 3/8. E(X) = 3/2.",
    savoirs: [
      "Équiprobabilité : P(A) = card(A)/card(Ω). Formule de Bayes (si au programme). Variable indicatrice, loi de Bernoulli = B(1, p).",
      "V(X) = E(X²) − [E(X)]². Pour B(n, p), V(X) = n p (1−p). Diagramme en arbre pour les conditionnelles.",
    ],
    savoirFaire: [
      "Construire un arbre. Calculer P(A ∩ B) = P(B) P(A|B). Tester l'indépendance.",
      "Reconnaître n et p. Calculer P(X = k), E(X). Utiliser le dénombrement pour un univers fini.",
    ],
  }),
};
