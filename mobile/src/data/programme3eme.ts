import type { ProgrammeSubject } from "../types/learnflow";
import { L, packSubject, packTheme } from "./programmeBuild";

export const PROGRAMME_3EME: ProgrammeSubject[] = [
  packSubject("maths", [
    packTheme("m-t1", "Nombres et calcul algébrique", [
      {
        id: "c1",
        title: "Calcul littéral et identités remarquables",
        lessons: [
          L("l1", "Développement et factorisation", "14 min", 75, "done"),
          L("l2", "Identités remarquables (a+b)²", "12 min", 50, "done"),
          L("l3", "Factorisation par mise en évidence", "15 min", 75, "done"),
          L("l4", "Applications et exercices", "18 min", 100, "current"),
        ],
      },
      {
        id: "eq2",
        title: "Équations du 2nd degré",
        lessons: [
          L("e1", "Introduction au discriminant Δ", "12 min", 50, "done"),
          L("e2", "Cas Δ > 0 : deux racines réelles", "15 min", 75, "done"),
          L("e3", "Cas Δ = 0 : racine double", "10 min", 50, "current"),
          L("e4", "Cas Δ < 0 : pas de solution réelle", "10 min", 50, "locked"),
          L("e5", "Relations de Viète", "18 min", 100, "locked"),
        ],
      },
    ]),
    packTheme("m-t2", "Géométrie plane", [
      {
        id: "thales",
        title: "Théorème de Thalès",
        lessons: [
          L("th1", "Énoncé du théorème et conditions", "12 min", 50, "locked"),
          L("th2", "Réciproque du théorème de Thalès", "14 min", 75, "locked"),
          L("th3", "Applications aux triangles", "18 min", 100, "locked"),
        ],
      },
      {
        id: "trigo",
        title: "Trigonométrie dans le triangle rectangle",
        lessons: [
          L("tr1", "Sinus, cosinus et tangente", "15 min", 75, "locked"),
          L("tr2", "Calcul d'angles et de longueurs", "16 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("m-t3", "Statistiques", [
      {
        id: "stats",
        title: "Statistiques descriptives",
        lessons: [
          L("st1", "Moyenne, médiane et mode", "14 min", 75, "locked"),
          L("st2", "Étendue et quartiles", "12 min", 50, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("svt", [
    packTheme("s-geo", "Géodynamique et géologie du Togo", [
      {
        id: "geo-togo",
        title: "Les formations géologiques du Togo",
        lessons: [
          L("gt1", "Socle, bassins et chaînes du Togo", "14 min", 75, "done"),
          L("gt2", "Intérêts économiques des roches", "12 min", 50, "done"),
        ],
      },
    ]),
    packTheme("s-env", "Les êtres vivants et leur environnement", [
      {
        id: "nerveux",
        title: "La commande nerveuse du mouvement",
        lessons: [
          L("nv1", "Le neurone, cellule nerveuse", "16 min", 75, "current"),
          L("nv2", "Arc réflexe : du stimulus à l'effecteur", "14 min", 75, "locked"),
          L("nv3", "La synapse et le message chimique", "16 min", 75, "locked"),
        ],
      },
      {
        id: "oeil",
        title: "L'œil et la vision",
        lessons: [
          L("oe1", "Anatomie de l'œil", "12 min", 50, "locked"),
          L("oe2", "Formation de l'image et accommodation", "14 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("s-sante", "L'homme et sa santé", [
      {
        id: "immunite-3e",
        title: "L'immunité",
        lessons: [
          L("im1", "Microbes pathogènes et non pathogènes", "12 min", 50, "done"),
          L("im2", "Le paludisme au Togo", "14 min", 75, "done"),
          L("im3", "Défenses de l'organisme", "16 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("s-nutri", "Nutrition et alimentation", [
      {
        id: "digest",
        title: "La digestion",
        lessons: [
          L("di1", "Le trajet des aliments", "14 min", 75, "done"),
          L("di2", "Digestion mécanique et chimique", "16 min", 75, "done"),
          L("di3", "Absorption des nutriments", "14 min", 75, "current"),
        ],
      },
      {
        id: "circulation",
        title: "La circulation sanguine",
        lessons: [
          L("ci1", "Le cœur, pompe double", "16 min", 75, "current"),
          L("ci2", "Petite et grande circulation", "14 min", 75, "locked"),
          L("ci3", "Sang, vaisseaux et échanges", "14 min", 75, "locked"),
        ],
      },
      {
        id: "respiration",
        title: "La respiration",
        lessons: [
          L("re1", "Voies aériennes et poumons", "12 min", 50, "locked"),
          L("re2", "Hématose et transport des gaz", "14 min", 75, "locked"),
        ],
      },
      {
        id: "excretion",
        title: "L'excrétion",
        lessons: [
          L("ex1", "Le rein, filtre du sang", "16 min", 75, "locked"),
          L("ex2", "Formation de l'urine et rôle du bassinet", "14 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("s-repro", "Reproduction et hérédité", [
      {
        id: "repro-3e",
        title: "Reproduction humaine",
        lessons: [
          L("rp1", "Organes génitaux et gamètes", "14 min", 75, "locked"),
          L("rp2", "Fécondation, grossesse et maîtrise", "16 min", 75, "locked"),
        ],
      },
      {
        id: "adn",
        title: "Le support des caractères héréditaires : ADN",
        lessons: [
          L("ad1", "Double hélice et bases azotées", "16 min", 75, "locked"),
          L("ad2", "Transmission des caractères et maladies héréditaires", "16 min", 75, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("pc", [
    packTheme("p-opt", "Lumière et vision", [
      {
        id: "lentilles",
        title: "Lentilles minces",
        lessons: [
          L("le1", "Lentilles convergentes et divergentes", "14 min", 75, "done"),
          L("le2", "Images réelles et virtuelles", "14 min", 75, "current"),
          L("le3", "L'œil et les défauts de vision", "12 min", 50, "locked"),
        ],
      },
    ]),
    packTheme("p-meca", "Forces et énergie", [
      {
        id: "forces",
        title: "Notions de force, travail et puissance",
        lessons: [
          L("fo1", "Forces et leurs effets", "12 min", 50, "locked"),
          L("fo2", "Travail et puissance mécaniques", "14 min", 75, "locked"),
        ],
      },
    ]),
    packTheme("p-elec", "Électricité", [
      {
        id: "ohm",
        title: "Résistance électrique et loi d'Ohm",
        lessons: [
          L("oh1", "Loi d'Ohm : U = R·I", "12 min", 50, "done"),
          L("oh2", "Résistances en série et en parallèle", "15 min", 75, "current"),
        ],
      },
    ]),
    packTheme("p-chim", "Chimie", [
      {
        id: "acides",
        title: "Solutions acides et basiques",
        lessons: [
          L("ac1", "pH et indicateurs", "12 min", 50, "locked"),
          L("ac2", "Métaux usuels et hydrocarbures", "14 min", 75, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("hg", [
    packTheme("h-t1", "L'Afrique et le monde au XXe siècle", [
      {
        id: "col",
        title: "La colonisation et la résistance africaine",
        lessons: [
          L("co1", "Le partage de l'Afrique (Berlin 1885)", "15 min", 75, "done"),
          L("co2", "Modes d'administration coloniale", "14 min", 75, "done"),
          L("co3", "Résistances africaines", "16 min", 75, "done"),
        ],
      },
      {
        id: "indep",
        title: "Les indépendances africaines et le Togo",
        lessons: [
          L("in1", "Mouvements nationalistes", "16 min", 75, "done"),
          L("in2", "L'indépendance du Togo (27 avril 1960)", "14 min", 75, "done"),
          L("in3", "Les défis des États indépendants", "15 min", 75, "current"),
        ],
      },
    ]),
    packTheme("h-t2", "Géographie — Le Togo et l'Afrique", [
      {
        id: "geo",
        title: "Géographie physique du Togo",
        lessons: [
          L("ge1", "Relief, fleuves et côtes", "12 min", 50, "locked"),
          L("ge2", "Climat et végétation", "14 min", 75, "locked"),
          L("ge3", "Lomé : capitale et enjeux urbains", "14 min", 75, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("fr", [
    packTheme("f-t1", "Langue et grammaire", [
      {
        id: "phrase",
        title: "La phrase complexe",
        lessons: [
          L("ph1", "Propositions subordonnées relatives", "14 min", 75, "done"),
          L("ph2", "Propositions subordonnées conjonctives", "14 min", 75, "done"),
          L("ph3", "Propositions infinitives", "12 min", 50, "done"),
        ],
      },
      {
        id: "temps",
        title: "Les temps du discours et du récit",
        lessons: [
          L("te1", "Passé simple, imparfait et plus-que-parfait", "15 min", 75, "done"),
          L("te2", "Concordance des temps", "16 min", 75, "done"),
          L("te3", "Discours direct et indirect", "16 min", 75, "current"),
        ],
      },
    ]),
    packTheme("f-t2", "Littérature africaine et togolaise", [
      {
        id: "lit",
        title: "Roman et poésie d'Afrique noire",
        lessons: [
          L("li1", "La Négritude : Senghor, Césaire, Damas", "16 min", 75, "locked"),
          L("li2", "Auteurs togolais : Sénouvo Zinsou", "16 min", 75, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("ang", [
    packTheme("a-t1", "Grammar", [
      {
        id: "tenses",
        title: "Tenses and Aspect",
        lessons: [
          L("tn1", "Present Perfect vs Simple Past", "14 min", 75, "done"),
          L("tn2", "Past Perfect and Narrative Tenses", "14 min", 75, "done"),
          L("tn3", "Future forms (will, going to)", "12 min", 50, "current"),
        ],
      },
      {
        id: "modals",
        title: "Modal Verbs and Conditionals",
        lessons: [
          L("mo1", "Modal verbs : can, could, may, must", "12 min", 50, "locked"),
          L("mo2", "Conditional sentences (types 1, 2, 3)", "18 min", 100, "locked"),
        ],
      },
    ]),
  ]),

  packSubject("edhc", [
    packTheme("e-t1", "Droits de l'homme et citoyenneté", [
      {
        id: "droits",
        title: "Les droits fondamentaux",
        lessons: [
          L("dr1", "Déclaration Universelle des Droits de l'Homme", "14 min", 75, "done"),
          L("dr2", "Convention relative aux Droits de l'Enfant", "12 min", 50, "done"),
          L("dr3", "Devoirs du citoyen togolais", "14 min", 75, "current"),
        ],
      },
      {
        id: "instit",
        title: "Institutions de la République togolaise",
        lessons: [
          L("is1", "La Constitution et la séparation des pouvoirs", "16 min", 75, "locked"),
          L("is2", "Démocratie et élections au Togo", "14 min", 75, "locked"),
        ],
      },
    ]),
  ]),
];
