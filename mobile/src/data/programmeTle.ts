import type { ProgrammeSubject } from "../types/learnflow";
import { L, packSubject, packTheme } from "./programmeBuild";

/** Programme Tle D uniquement — catalogue issu de Données_LF / TERMINAL. */
export const PROGRAMME_TLE: ProgrammeSubject[] = [
  packSubject("maths", [
    packTheme("tm-geo", "Géométrie et algèbre", [
      {
        id: "tle-d-vecteurs",
        title: "Vecteurs de l'espace et repérage",
        lessons: [L("td-v1", "Colinéarité, bases et coordonnées", "16 min", 75, "current")],
      },
      {
        id: "tle-d-barycentre",
        title: "Barycentre de n points pondérés",
        lessons: [L("td-ba1", "Définition et propriétés", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-scalaire",
        title: "Produit scalaire",
        lessons: [L("td-sc1", "Produit scalaire dans l'espace", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-param",
        title: "Représentations paramétriques",
        lessons: [L("td-pa1", "Droites et plans", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-systemes",
        title: "Systèmes d'équations linéaires",
        lessons: [L("td-sy1", "Pivot de Gauss et problèmes", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-vectoriel",
        title: "Produit vectoriel",
        lessons: [L("td-pv1", "Définition et applications", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-complexes",
        title: "Nombres complexes",
        lessons: [
          L("td-cx1", "Forme algébrique, module, argument", "16 min", 75, "locked"),
          L("td-cx2", "Forme trigonométrique et exponentielle", "16 min", 75, "locked"),
        ],
      },
      {
        id: "tle-d-similitudes",
        title: "Similitudes planes",
        lessons: [L("td-si1", "Écriture complexe d'une similitude", "16 min", 75, "locked")],
      },
    ]),
    packTheme("tm-ana", "Analyse", [
      {
        id: "tle-d-limites",
        title: "Limites et continuité",
        lessons: [L("td-lm1", "Limites, opérations, continuité", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-derivees",
        title: "Dérivée et étude de fonctions",
        lessons: [L("td-dv1", "Dérivation et variations", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-primitives",
        title: "Primitives",
        lessons: [L("td-pr1", "Primitives usuelles", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-ln",
        title: "Fonction logarithme népérien",
        lessons: [L("td-ln1", "Définition, équations, dérivée", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-exp",
        title: "Fonction exponentielle",
        lessons: [L("td-ex1", "Exponentielle et puissances", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-integrales",
        title: "Calcul intégral",
        lessons: [L("td-in1", "Intégrales et aires", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-equadiff",
        title: "Équations différentielles linéaires",
        lessons: [L("td-ed1", "Équations du 1er et 2nd ordre", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-suites",
        title: "Suites numériques",
        lessons: [L("td-su1", "Suites, limites, récurrence", "16 min", 75, "locked")],
      },
    ]),
    packTheme("tm-proba", "Organisation des données", [
      {
        id: "tle-d-denombrement",
        title: "Dénombrement",
        lessons: [L("td-de1", "Arrangements, permutations, combinaisons", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-probas",
        title: "Probabilités",
        lessons: [L("td-pb1", "Conditionnelles, variables, loi binomiale", "18 min", 100, "locked")],
      },
    ]),
  ]),

  packSubject("svt", [
    packTheme("ts-gen", "Génétique et reproduction", [
      {
        id: "tle-d-adn",
        title: "Le matériel génétique et la transmission",
        lessons: [L("td-ad1", "ADN, duplication, transmission", "16 min", 75, "current")],
      },
      {
        id: "tle-d-heredite",
        title: "L'hérédité humaine",
        lessons: [L("td-he1", "Transmission des caractères chez l'humain", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-gameto",
        title: "La gamétogenèse",
        lessons: [L("td-ga1", "Formation des gamètes", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-fecond",
        title: "La fécondation et les premières étapes",
        lessons: [L("td-fe1", "Fécondation et développement précoce", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-sperma",
        title: "La reproduction chez les spermatophytes",
        lessons: [L("td-sp1", "Cycle de reproduction des plantes à graines", "16 min", 75, "locked")],
      },
    ]),
    packTheme("ts-nerf", "Nerfs, muscles et milieu intérieur", [
      {
        id: "tle-d-nerf",
        title: "Le tissu nerveux et ses propriétés",
        lessons: [L("td-ne1", "Neurone, influx, synapse", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-muscle",
        title: "La physiologie du muscle strié",
        lessons: [L("td-mu1", "Contraction du muscle strié", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-milieu",
        title: "La régulation du milieu intérieur",
        lessons: [L("td-mi1", "Homéostasie et régulations", "16 min", 75, "locked")],
      },
    ]),
  ]),

  packSubject(
    "pc",
    [
      packTheme("tp-meca", "Mécanique", [
        {
          id: "tle-d-cinematique",
          title: "Mouvements et équations horaires",
          lessons: [L("td-cn1", "Référentiel, vitesse, accélération, MRU et MRUA", "18 min", 100, "locked")],
        },
        {
          id: "tle-d-newton",
          title: "Référentiel galiléen et théorèmes de mécanique",
          lessons: [L("td-nw1", "Centre d'inertie et énergie cinétique", "16 min", 75, "locked")],
        },
        {
          id: "tle-d-gravitation",
          title: "Gravitation et satellites",
          lessons: [L("td-gr1", "Champ gravitationnel, Kepler, géostationnaire", "16 min", 75, "locked")],
        },
        {
          id: "tle-d-champs",
          title: "Champs uniformes et projectiles",
          lessons: [L("td-ch1", "Pesanteur et champ électrostatique", "16 min", 75, "locked")],
        },
        {
          id: "tle-d-oscillateurs",
          title: "Oscillateurs mécaniques",
          lessons: [L("td-os1", "Pendule élastique et amortissement", "16 min", 75, "locked")],
        },
      ]),
      packTheme("tp-chim", "Chimie", [
        {
          id: "tle-d-acide",
          title: "Acide-base et dosages",
          lessons: [L("td-ab1", "Couples acide/base, pH, dosage", "16 min", 75, "locked")],
        },
        {
          id: "tle-d-orga",
          title: "Chimie organique",
          lessons: [L("td-og1", "Composés oxygénés, amines, acides aminés", "16 min", 75, "locked")],
        },
      ]),
    ],
    "PC",
  ),

  packSubject("hg", [
    packTheme("th-geo", "Géographie — économie togolaise et mondialisation", [
      {
        id: "tle-d-geo1",
        title: "Les potentialités de l'économie togolaise",
        lessons: [L("td-g1", "Ressources naturelles et humaines", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-geo2",
        title: "Les problèmes du développement de l'économie togolaise",
        lessons: [L("td-g2", "Contraintes environnementales, économiques, sociales", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-geo3",
        title: "Les réformes dans l'économie togolaise",
        lessons: [L("td-g3", "Moderniser et rendre l'économie plus compétitive", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-geo4",
        title: "Les mécanismes de la mondialisation",
        lessons: [L("td-g4", "Flux, acteurs et réseaux", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-geo5",
        title: "Conséquences et contestations de la mondialisation",
        lessons: [L("td-g5", "Opportunités, inégalités, contestations", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-geo6",
        title: "Le Togo dans la mondialisation",
        lessons: [L("td-g6", "Place du Togo dans les échanges mondiaux", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-geo7",
        title: "Un modèle de développement : la Corée du Sud",
        lessons: [L("td-g7", "Trajectoire économique sud-coréenne", "14 min", 75, "locked")],
      },
      {
        id: "tle-d-geo8",
        title: "Étude d'un pays émergent : l'Afrique du Sud",
        lessons: [L("td-g8", "Puissance émergente africaine", "14 min", 75, "locked")],
      },
    ]),
    packTheme("th-hist", "Histoire — monde et Togo depuis 1945", [
      {
        id: "tle-d-onu",
        title: "L'ONU : naissance, fonctionnement, bilan et perspectives",
        lessons: [L("td-h1", "San Francisco, organes, bilan", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-bipolaire",
        title: "Le monde bipolaire (1947–1991)",
        lessons: [L("td-h2", "Guerre froide, blocs Est-Ouest", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-apres91",
        title: "Le monde de 1991 à nos jours",
        lessons: [L("td-h3", "Nouvel ordre international", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-decolo-afrique",
        title: "Les facteurs de la décolonisation de l'Afrique",
        lessons: [L("td-h4", "Causes internes et internationales", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-decolo-togo",
        title: "La décolonisation du Togo",
        lessons: [L("td-h5", "Du mandat à l'indépendance de 1960", "16 min", 75, "locked")],
      },
      {
        id: "tle-d-togo-politique",
        title: "L'évolution politique du Togo (1960–2005)",
        lessons: [L("td-h6", "Olympio, Eyadéma, ouverture des années 1990", "16 min", 75, "locked")],
      },
    ]),
  ]),
];
