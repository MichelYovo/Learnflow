import type { ProgrammeSubject } from "../types/learnflow";
import { L, packSubject, packTheme } from "./programmeBuild";

export const PROGRAMME_TLE: ProgrammeSubject[] = [
  packSubject("maths", [
    packTheme("tm-geo", "Géométrie et algèbre", [
      {
        id: "vecteurs",
        title: "Vecteurs de l'espace et repérage",
        lessons: [
          L("vx1", "Colinéarité, orthogonalité, bases", "16 min", 75, "done"),
          L("vx2", "Repère et coordonnées dans l'espace", "14 min", 75, "done"),
          L("vx3", "Produit scalaire et produit vectoriel", "18 min", 100, "current"),
        ],
      },
      {
        id: "complexes",
        title: "Nombres complexes",
        lessons: [
          L("cx1", "Forme algébrique, conjugué, module", "16 min", 75, "done"),
          L("cx2", "Forme trigonométrique et exponentielle", "18 min", 100, "current"),
          L("cx3", "Équations dans ℂ et similitudes", "18 min", 100, "locked"),
        ],
      },
    ]),
    packTheme("tm-ana", "Analyse", [
      {
        id: "limites",
        title: "Limites et continuité",
        lessons: [
          L("lm1", "Limites de référence et opérations", "16 min", 75, "locked"),
          L("lm2", "Continuité, TVI et encadrement", "16 min", 75, "locked"),
        ],
      },
      {
        id: "derivees",
        title: "Dérivées et primitives",
        lessons: [
          L("dv1", "Nombre dérivé et opérations", "16 min", 75, "locked"),
          L("dv2", "Primitives usuelles", "14 min", 75, "locked"),
          L("dv3", "Étude de fonctions", "20 min", 100, "locked"),
        ],
      },
      {
        id: "ln",
        title: "Fonction logarithme népérien",
        lessons: [
          L("ln1", "Définition, dérivée et propriétés", "16 min", 75, "locked"),
          L("ln2", "Équations et inéquations avec ln", "16 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("tm-proba", "Probabilités", [
      {
        id: "probas",
        title: "Probabilités conditionnelles",
        lessons: [
          L("pr1", "Arbres, indépendance, Bayes", "18 min", 100, "locked"),
          L("pr2", "Variables aléatoires discrètes", "16 min", 75, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("svt", [
    packTheme("ts-gen", "Unicité des individus et diversité génétique", [
      {
        id: "repro-sexuee",
        title: "Reproduction sexuée et méiose",
        lessons: [
          L("rs1", "Gamétogenèse chez les mammifères", "16 min", 75, "done"),
          L("rs2", "Les deux divisions de la méiose", "18 min", 100, "done"),
          L("rs3", "Fécondation et caryogamie", "14 min", 75, "current"),
        ],
      },
      {
        id: "brassage",
        title: "Brassage génétique et ADN",
        lessons: [
          L("br1", "Structure de l'ADN, double hélice", "16 min", 75, "done"),
          L("br2", "Crossing-over et brassage interchromosomique", "18 min", 100, "current"),
          L("br3", "Diversité génétique d'une population", "16 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("ts-imm", "Mécanismes de l'immunité", [
      {
        id: "immunite-tle",
        title: "Soi, non-soi et réponse immunitaire",
        lessons: [
          L("it1", "Le soi et le non-soi", "14 min", 75, "locked"),
          L("it2", "Immunocompétence des lymphocytes", "16 min", 75, "locked"),
          L("it3", "Déroulement de la réponse immunitaire", "18 min", 100, "locked"),
        ],
      },
    ]),
    packTheme("ts-nerf", "Fonctionnement du centre nerveux", [
      {
        id: "neurones",
        title: "Fonctionnement des neurones",
        lessons: [
          L("ne1", "Anatomie du neurone", "14 min", 75, "done"),
          L("ne2", "Potentiel d'action et myéline", "16 min", 75, "current"),
          L("ne3", "Synapse chimique et neurotransmetteurs", "18 min", 100, "locked"),
          L("ne4", "Réflexes et motricité volontaire", "16 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("ts-reg", "Régulation hormonale et nerveuse", [
      {
        id: "glycemie",
        title: "Régulation de la glycémie et de la pression artérielle",
        lessons: [
          L("gl1", "Glycémie : insuline et glucagon", "16 min", 75, "locked"),
          L("gl2", "Pression artérielle et rôle du rein", "16 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("ts-evo", "Évolution de la Terre et du vivant", [
      {
        id: "evolution",
        title: "Mécanismes de l'évolution et lignée humaine",
        lessons: [
          L("ev1", "Histoire de la Terre et des êtres vivants", "14 min", 75, "locked"),
          L("ev2", "Sélection naturelle et lignée humaine", "16 min", 75, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("pc", [
    packTheme("tp-meca", "Mécanique", [
      {
        id: "cinematique",
        title: "Mouvements et équations horaires",
        lessons: [
          L("cn1", "Référentiel, trajectoire, vecteur position", "14 min", 75, "done"),
          L("cn2", "Vitesse, accélération, MRU et MRUA", "16 min", 75, "current"),
          L("cn3", "Mouvement circulaire", "16 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("tp-chim", "Chimie", [
      {
        id: "acide-base-tle",
        title: "Acide-base et dosages",
        lessons: [
          L("ab1", "Couples acide/base et pH", "16 min", 75, "locked"),
          L("ab2", "Dosage acido-basique", "16 min", 75, "locked"),
        ],
      },
      {
        id: "orga",
        title: "Chimie organique",
        lessons: [
          L("og1", "Nomenclature des composés oxygénés", "14 min", 75, "locked"),
          L("og2", "Amines, acides aminés et protéines", "16 min", 75, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("fr", [
    packTheme("tf-disc", "Discours et argumentation", [
      {
        id: "argumenter",
        title: "Convaincre, persuader, délibérer",
        lessons: [
          L("ar1", "Thèse, arguments, exemples", "14 min", 75, "done"),
          L("ar2", "Dissertation et commentaire", "18 min", 100, "current"),
        ],
      },
    ]),
    packTheme("tf-lit", "Littérature africaine", [
      {
        id: "lit-tle",
        title: "Roman et essai d'Afrique",
        lessons: [
          L("lt1", "Négritude et postindépendance", "16 min", 75, "locked"),
          L("lt2", "Voix togolaises contemporaines", "14 min", 75, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("ang", [
    packTheme("ta-lang", "Language in use", [
      {
        id: "tenses-tle",
        title: "Advanced tenses and aspect",
        lessons: [
          L("at1", "Narrative tenses and present perfect", "14 min", 75, "done"),
          L("at2", "Conditionals and wish", "16 min", 75, "current"),
        ],
      },
      {
        id: "essay",
        title: "Essay and comprehension",
        lessons: [
          L("es1", "Argumentative paragraph", "14 min", 75, "locked"),
          L("es2", "Summary and guided writing", "16 min", 75, "locked"),
        ],
      },
    ]),
  ]),
];
