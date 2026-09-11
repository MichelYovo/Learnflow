import type { FicheCoursData } from "../types/learnflow";
import { tleFiche } from "./fichesBuild";

/** Fiches Histoire-Géo Tle D — leçons Terminale A/C/D Togo. */
export const FICHES_TLE_HG: Record<string, FicheCoursData> = {
  "tle-d-geo1": tleFiche({
    id: "tle-d-geo1",
    titre: "Les potentialités de l'économie togolaise",
    matiereId: "hg",
    mots: ["potentialité", "atout", "mise en valeur", "phosphates", "Port de Lomé"],
    puces: [
      "Une **potentialité** est une ressource ou un avantage susceptible d'être valorisé. Un **atout** est déjà favorable.",
      "Potentialités naturelles : reliefs, sols, climats (sud tropical humide / nord plus sec), végétation, hydrographie (Mono, Oti), **phosphates**, solaire, hydraulique.",
      "Potentialités humaines : population jeune, main-d'œuvre, marché. Position : façade maritime, Afrique de l'Ouest.",
      "Le **Port autonome de Lomé** et les réseaux routiers, ferroviaires et numériques renforcent les échanges.",
      "La **mise en valeur** exige infrastructures, investissement et gestion durable (sols, forêts, eau).",
    ],
    parole:
      "Avoir du phosphate ou un port, ce n'est pas encore la richesse : c'est une potentialité. L'atout, c'est quand on l'exploite vraiment — routes, formation, transformation, sans casser les sols.",
    concept: "Potentialité et mise en valeur",
    exemple: "Phosphates et Port de Lomé : ressources à transformer en développement.",
    recit:
      "Comment les ressources naturelles et humaines du Togo peuvent-elles contribuer à la modernisation de son économie ?",
    question: "Quelles potentialités naturelles et humaines, et à quelles conditions les valoriser ?",
    competence:
      "Identifier les potentialités naturelles, humaines et spatiales du Togo et les conditions de leur mise en valeur durable.",
    enonce: "Cite deux potentialités naturelles et une condition de valorisation.",
    etapes: [
      { titre: "Naturelles", texte: "Phosphates ; hydrographie (Mono, Oti) ou climat agricole du Sud." },
      { titre: "Condition", texte: "Infrastructures, investissement, ou gestion durable des sols et des eaux." },
    ],
    reponse: "Ex. phosphates + façade maritime ; valorisation par le Port de Lomé, les routes et une gestion durable.",
    savoirs: [
      "Reliefs, sols, climats sud/nord, forêts et savanes, Mono et Oti, phosphates, renouvelables. Population, jeunesse, position ouest-africaine, Port de Lomé.",
      "Une ressource n'est un atout que si elle est accessible, financée, transformée. Développement durable : limiter érosion, déforestation, pression climatique.",
    ],
    savoirFaire: [
      "Définir potentialité, atout, mise en valeur. Distinguer naturel / humain / spatial.",
      "Rédiger une réponse organisée à la situation-problème avec exemples togolais.",
    ],
  }),

  "tle-d-geo2": tleFiche({
    id: "tle-d-geo2",
    titre: "Les problèmes du développement de l'économie togolaise",
    matiereId: "hg",
    mots: ["développement durable", "valeur ajoutée", "informel", "érosion"],
    puces: [
      "Les ressources ne suffisent pas : contraintes environnementales (**érosion**, déforestation, sécheresses, inondations).",
      "Contraintes économiques : dépendance agricole, faible transformation (peu de **valeur ajoutée**), infrastructures et énergie limitées.",
      "Problèmes sociaux : emploi, qualification, pauvreté, inégalités, poids de l'**informel**.",
      "Le **développement durable** répond aux besoins présents sans compromettre ceux des générations futures.",
      "Pistes : diversification, transformation locale, formation, protection des milieux.",
    ],
    parole:
      "Avoir des terres et un port ne garantit pas le développement. Si on n'usine pas, la valeur part ailleurs. L'informel nourrit beaucoup de monde mais reste fragile. Le défi, c'est diversifier sans épuiser les sols.",
    concept: "Contraintes du développement",
    exemple: "Export de matière première peu transformée : faible valeur ajoutée nationale.",
    recit:
      "Pourquoi la présence de nombreuses ressources ne suffit-elle pas à assurer un développement économique rapide et durable ?",
    question: "Quelles contraintes environnementales, économiques et sociales pèsent sur l'économie togolaise ?",
    competence:
      "Expliquer les problèmes de développement du Togo (environnement, économie, société) et relier les réponses à la diversification et au développement durable.",
    enonce: "Donne une contrainte environnementale et une contrainte économique.",
    etapes: [
      { titre: "Environnement", texte: "Érosion, déforestation, ou irrégularités climatiques." },
      { titre: "Économie", texte: "Faible transformation / dépendance agricole / accès limité à l'énergie." },
    ],
    reponse: "Ex. érosion des sols ; faible transformation locale des matières premières.",
    savoirs: [
      "Dégradation des terres, risques climatiques. Dépendance agricole, infrastructures, financement. Emploi, inégalités, informel.",
      "Diversification et durabilité comme réponses. Valeur ajoutée = richesse créée par la transformation.",
    ],
    savoirFaire: [
      "Classer les problèmes (environnement / économie / société). Définir développement durable, valeur ajoutée, informel.",
      "Argumenter avec des exemples togolais dans une copie organisée.",
    ],
  }),

  "tle-d-geo3": tleFiche({
    id: "tle-d-geo3",
    titre: "Les réformes dans l'économie togolaise",
    matiereId: "hg",
    mots: ["réforme", "compétitivité", "inclusion", "infrastructure"],
    puces: [
      "Les **réformes** visent à moderniser les institutions, les services et les **infrastructures**.",
      "Objectif : rendre l'économie plus **compétitive** (coûts, qualité, délais, ouverture).",
      "Autre objectif : l'**inclusion** — plus d'acteurs accèdent à l'emploi, au crédit, aux services.",
      "Leviers : cadre des affaires, énergie, transport, formation, numérique, agriculture.",
      "Une réforme réussit si elle est financée, suivie, et si elle améliore vraiment les conditions de production.",
    ],
    parole:
      "Réformer, ce n'est pas changer le nom des ministères : c'est changer les règles du jeu pour que produire et échanger coûtent moins cher, et que plus de Togolais en profitent.",
    concept: "Réformes économiques",
    exemple: "Améliorer le port, les routes et le climat des affaires pour attirer l'investissement.",
    recit:
      "Quelles réformes peuvent renforcer la modernisation, la compétitivité et l'inclusion dans l'économie togolaise ?",
    question: "Quels sont les objectifs des réformes et sur quels leviers agissent-elles ?",
    competence:
      "Présenter les objectifs des réformes économiques togolaises (moderniser, compétitivité, inclusion) et leurs leviers.",
    enonce: "Cite deux objectifs d'une réforme économique togolaise.",
    etapes: [
      { titre: "Moderniser", texte: "Institutions, infrastructures, services." },
      { titre: "Compétitivité / inclusion", texte: "Mieux produire et échanger ; élargir l'accès à l'emploi et au crédit." },
    ],
    reponse: "Moderniser le cadre productif et le rendre plus compétitif et plus inclusif.",
    savoirs: [
      "Modernisation, compétitivité, inclusion. Leviers : infrastructures, énergie, formation, cadre juridique, filières agricoles.",
      "Les réformes s'évaluent à leurs effets sur l'investissement, l'emploi et les inégalités territoriales.",
    ],
    savoirFaire: [
      "Définir réforme, compétitivité, inclusion. Relier un levier à un objectif.",
      "Construire une réponse organisée avec exemples concrets.",
    ],
  }),

  "tle-d-geo4": tleFiche({
    id: "tle-d-geo4",
    titre: "Les mécanismes de la mondialisation",
    matiereId: "hg",
    mots: ["mondialisation", "flux", "FTN", "réseaux", "interdépendance"],
    puces: [
      "La **mondialisation** est l'intensification des échanges et des **interdépendances** entre les territoires.",
      "Elle repose sur des **flux** : marchandises, capitaux, informations, personnes.",
      "Acteurs : États, **FTN** (firmes transnationales), organisations internationales, diasporas.",
      "Les **réseaux** (ports, câbles, aéroports, internet, routes maritimes) organisent ces flux.",
      "Métropoles et façades maritimes polarisent souvent les échanges.",
    ],
    parole:
      "La mondialisation, ce n'est pas « le monde est petit » : c'est que les tuyaux (bateaux, câbles, banques, usines) relient les territoires de plus en plus fort. Une FTN, c'est une entreprise qui a un pied dans plusieurs pays.",
    concept: "Mondialisation",
    exemple: "Un téléphone conçu dans un pays, assemblé dans un autre, vendu partout.",
    recit:
      "Comment les flux et les réseaux organisent-ils les relations entre les territoires du monde ?",
    question: "Quels acteurs et quels flux font la mondialisation ?",
    competence:
      "Définir la mondialisation, identifier ses acteurs, ses flux et le rôle des réseaux.",
    enonce: "Nomme deux types de flux et un acteur majeur de la mondialisation.",
    etapes: [
      { titre: "Flux", texte: "Marchandises, capitaux, ou informations." },
      { titre: "Acteur", texte: "FTN, État, ou organisation internationale (OMC, FMI…)." },
    ],
    reponse: "Ex. flux de marchandises et de capitaux ; firmes transnationales.",
    savoirs: [
      "Définition, acteurs, flux, réseaux, hubs. Division internationale du travail.",
      "Les territoires sont inégalement intégrés : centres, périphéries, marges.",
    ],
    savoirFaire: [
      "Définir mondialisation, flux, FTN. Lire un document (carte de flux, graphique d'échanges).",
      "Organiser une copie : acteurs / mécanismes / territoires.",
    ],
  }),

  "tle-d-geo5": tleFiche({
    id: "tle-d-geo5",
    titre: "Conséquences et contestations de la mondialisation",
    matiereId: "hg",
    mots: ["inégalités", "opportunité", "altermondialisme", "délocalisation"],
    puces: [
      "**Opportunités** : marchés, investissements, technologies, croissance pour certains territoires.",
      "La concurrence et les **délocalisations** peuvent fragiliser des emplois.",
      "La mondialisation creuse des **inégalités** entre pays et à l'intérieur des pays.",
      "Impacts environnementaux : transports, ressources, déchets.",
      "Contestations : syndicats, ONG, **altermondialisme** : une autre régulation des échanges.",
    ],
    parole:
      "La mondialisation ouvre des portes et en ferme d'autres. Certains gagnent des usines, d'autres les perdent. Les contestataires ne disent pas toujours « stop au monde » : ils demandent des règles plus justes.",
    concept: "Gagnants et perdants",
    exemple: "Hausse des échanges et, en parallèle, critiques des inégalités Nord-Sud.",
    recit:
      "Pourquoi la mondialisation produit-elle à la fois des opportunités, des inégalités et des contestations ?",
    question: "Quels effets économiques et sociaux, et pourquoi y a-t-il contestation ?",
    competence:
      "Analyser les conséquences de la mondialisation (opportunités, inégalités, environnement) et les formes de contestation.",
    enonce: "Donne une opportunité et une contestation liées à la mondialisation.",
    etapes: [
      { titre: "Opportunité", texte: "Ouverture des marchés, investissement, transfert de technologies." },
      { titre: "Contestation", texte: "Altermondialisme, critiques des inégalités ou de l'impact écologique." },
    ],
    reponse: "Opportunité : accès aux marchés. Contestation : dénonciation des inégalités / altermondialisme.",
    savoirs: [
      "Effets économiques (croissance, concurrence, délocalisations). Inégalités spatiales et sociales. Enjeux environnementaux.",
      "Acteurs de la contestation et demandes de régulation (normes, taxes, commerce équitable).",
    ],
    savoirFaire: [
      "Nuancer : ni tout positif ni tout négatif. Utiliser des exemples précis.",
      "Relier un document (graphique d'inégalités, manifeste) au cours.",
    ],
  }),

  "tle-d-geo6": tleFiche({
    id: "tle-d-geo6",
    titre: "Le Togo dans la mondialisation",
    matiereId: "hg",
    mots: ["insertion", "Port autonome de Lomé", "CEDEAO", "exportations"],
    puces: [
      "Le Togo s'insère par sa façade maritime et le **Port autonome de Lomé** (hub régional).",
      "Échanges : **exportations** (phosphates, produits agricoles…) et importations de biens manufacturés et d'énergie.",
      "Intégration régionale : **CEDEAO**, corridors vers les pays enclavés.",
      "Avantages : transit, investissements, diaspora. Défis : dépendance, faible transformation, concurrence portuaire.",
      "L'insertion n'est pas uniforme : Lomé et certains axes captent plus de flux que l'intérieur.",
    ],
    parole:
      "Le Togo n'est pas « hors du monde » : les bateaux, le phosphate, les camions vers le Sahel le branchent. Le défi, c'est de ne pas rester seulement un couloir, mais de transformer et d'employer sur place.",
    concept: "Insertion du Togo",
    exemple: "Conteneurs au Port de Lomé à destination du Burkina ou du Niger.",
    recit:
      "Comment le Togo s'insère-t-il dans les échanges mondiaux et quels sont les avantages et défis de cette insertion ?",
    question: "Quels atouts et quels défis pour le Togo dans la mondialisation ?",
    competence:
      "Situer le Togo dans les échanges mondiaux (port, région, exportations) et peser atouts et défis.",
    enonce: "Quel rôle joue le Port de Lomé dans l'insertion du Togo ?",
    etapes: [
      { titre: "Hub", texte: "Porte d'entrée maritime, transit vers l'intérieur de l'Afrique de l'Ouest." },
      { titre: "Limite", texte: "Sans transformation locale, le pays reste surtout un espace de passage." },
    ],
    reponse: "C'est un hub d'échanges régionaux ; l'enjeu est d'en tirer plus de valeur ajoutée nationale.",
    savoirs: [
      "Atouts : littoral, PAL, CEDEAO, position. Structure des échanges. Rôle de la diaspora et des IDE.",
      "Défis : dépendance, informel, inégalités territoriales, concurrence des ports voisins.",
    ],
    savoirFaire: [
      "Localiser les flux sur un croquis. Distinguer atout et défi.",
      "Rédiger une analyse géographique avec trois notions et des exemples togolais.",
    ],
  }),

  "tle-d-geo7": tleFiche({
    id: "tle-d-geo7",
    titre: "Un modèle de développement : la Corée du Sud",
    matiereId: "hg",
    mots: ["modèle", "État développeur", "industrie", "chaebol"],
    puces: [
      "Après la guerre de Corée, le pays est ruiné. L'**État développeur** planifie, forme, finance les **industries**.",
      "Passage d'une économie agricole à une puissance industrielle et technologique.",
      "Grands groupes (**chaebol**) : électronique, automobile, construction navale.",
      "Éducation, exportations, investissement dans la recherche. Urbanisation rapide.",
      "Limites : inégalités, pression sociale, dépendance énergétique, enjeux démocratiques selon les périodes.",
    ],
    parole:
      "La Corée du Sud, c'est l'atelier qui est devenu laboratoire : l'État a poussé l'école et l'usine, puis les marques mondiales. Ce n'est pas magique : c'est une stratégie sur des décennies.",
    concept: "État développeur",
    exemple: "Électronique et automobile sud-coréennes exportées dans le monde.",
    recit:
      "Comment la Corée du Sud est-elle devenue une grande économie industrielle et technologique ?",
    question: "Quel rôle de l'État, quelles étapes, et quelles limites du modèle ?",
    competence:
      "Expliquer la trajectoire sud-coréenne (État, industrie, éducation) comme modèle de développement, avec ses limites.",
    enonce: "Cite deux leviers du décollage sud-coréen.",
    etapes: [
      { titre: "État", texte: "Planification, infrastructures, soutien aux industries exportatrices." },
      { titre: "Humain", texte: "Éducation de masse et montée en gamme technologique." },
    ],
    reponse: "État développeur + éducation / industrie exportatrice (chaebol).",
    savoirs: [
      "Situation initiale difficile. Rôle de l'État. Chaebol. Montée en gamme. Insertion dans les échanges asiatiques et mondiaux.",
      "Limites sociales, environnementales, géopolitiques (voisinage nord-coréen).",
    ],
    savoirFaire: [
      "Chronologiser le décollage. Comparer (sans copier) avec le Togo : rôle de l'État, industrie, école.",
      "Utiliser le vocabulaire : modèle, industrialisation, exportations.",
    ],
  }),

  "tle-d-geo8": tleFiche({
    id: "tle-d-geo8",
    titre: "Étude d'un pays émergent : l'Afrique du Sud",
    matiereId: "hg",
    mots: ["émergent", "apartheid", "mines", "inégalités", "BRICS"],
    puces: [
      "Pays **émergent** : poids régional, ressources (**mines** : or, platine, charbon), agriculture, industrie, services.",
      "Héritage de l'**apartheid** : inégalités spatiales et sociales encore fortes.",
      "Puissance africaine : économie, diplomatie, parfois **BRICS**.",
      "Atouts : ressources, infrastructures relativement développées, métropoles (Johannesburg, Le Cap, Durban).",
      "Limites : chômage, inégalités, énergie, criminalité, tensions sociales.",
    ],
    parole:
      "L'Afrique du Sud a les mines, les villes, les ports d'une puissance. Mais l'apartheid a laissé une carte des inégalités. Émergent ne veut pas dire « problème réglé ».",
    concept: "Pays émergent",
    exemple: "Johannesburg : métropole financière ; townships : héritage inégalitaire.",
    recit:
      "Quels sont les atouts, les performances et les limites du modèle de développement de l'Afrique du Sud ?",
    question: "Pourquoi parle-t-on d'émergence, et quelles sont les limites ?",
    competence:
      "Caractériser l'Afrique du Sud comme pays émergent : bases de la puissance, héritages, inégalités et limites.",
    enonce: "Donne un atout et une limite du développement sud-africain.",
    etapes: [
      { titre: "Atout", texte: "Ressources minières, métropoles, rôle régional." },
      { titre: "Limite", texte: "Inégalités héritées de l'apartheid, chômage." },
    ],
    reponse: "Atout : ressources et poids régional. Limite : inégalités / chômage.",
    savoirs: [
      "Ressources minières et agricoles. Métropoles. Sortie de l'apartheid (1994). Rôle en Afrique et dans les forums internationaux.",
      "Inégalités, énergie, chômage. La notion d'émergence est relative et contestable.",
    ],
    savoirFaire: [
      "Définir pays émergent. Cartographier atouts et fractures. Comparer avec la Corée du Sud (deux « modèles » différents).",
    ],
  }),

  "tle-d-onu": tleFiche({
    id: "tle-d-onu",
    titre: "L'ONU : naissance, fonctionnement, bilan et perspectives",
    matiereId: "hg",
    mots: ["ONU", "Charte", "Conseil de sécurité", "veto", "multilatéralisme"],
    puces: [
      "L'**ONU** naît après 1945 pour la paix et la coopération. **Charte** signée à San Francisco le 26 juin 1945, en vigueur le 24 octobre 1945.",
      "Organes : Assemblée générale, **Conseil de sécurité** (5 permanents avec **veto** : USA, Russie, Chine, France, Royaume-Uni), Secrétariat, CIJ.",
      "Moyens : résolutions, casques bleus, médiation, aide humanitaire, institutions spécialisées.",
      "Bilan : cadre de dialogue, opérations de paix, normes ; limites : veto, dépendances des États, rivalités.",
      "Perspectives : réforme du Conseil, **multilatéralisme**, financement, nouvelles crises.",
    ],
    parole:
      "L'ONU, c'est la table où presque tous les États s'assoient. Le Conseil de sécurité peut envoyer des casques bleus — mais les cinq grands peuvent dire non d'un veto. D'où les réussites et les blocages.",
    concept: "ONU et veto",
    exemple: "Casques bleus ; blocage d'une résolution par un veto.",
    recit:
      "Pourquoi l'ONU a-t-elle été créée, comment fonctionne-t-elle et pourquoi son action reste-t-elle à la fois importante et limitée ?",
    question: "Quels organes, quels succès, quelles limites (veto) ?",
    competence:
      "Expliquer la naissance de l'ONU, son fonctionnement (organes, veto) et dresser un bilan critique avec des perspectives.",
    enonce: "Date de la Charte et nomme les cinq membres permanents.",
    etapes: [
      { titre: "Date", texte: "Signée le 26 juin 1945, en vigueur le 24 octobre 1945." },
      { titre: "P5", texte: "États-Unis, Russie, Chine, France, Royaume-Uni." },
    ],
    reponse: "Charte 1945 ; P5 = USA, Russie, Chine, France, Royaume-Uni.",
    savoirs: [
      "Contexte : échec de la SDN, Seconde Guerre mondiale. Objectifs de la Charte. Organes et institutions spécialisées.",
      "Réussites (dialogue, humanitaire, décolonisation accompagnée) et limites (veto, moyens). Débats de réforme.",
    ],
    savoirFaire: [
      "Mémoriser 1945, San Francisco, P5, veto. Distinguer AG et Conseil de sécurité.",
      "Rédiger un bilan nuancé : succès + limites + perspectives.",
    ],
  }),

  "tle-d-bipolaire": tleFiche({
    id: "tle-d-bipolaire",
    titre: "Le monde bipolaire (1947–1991)",
    matiereId: "hg",
    mots: ["Guerre froide", "bipolarisation", "OTAN", "Pacte de Varsovie", "Truman"],
    puces: [
      "La **Guerre froide** oppose USA et URSS (1947–1991) sans guerre directe entre eux : **bipolarisation**.",
      "1947 : doctrine **Truman** (endiguement) et doctrine Jdanov. Plan Marshall. Deux modèles : libéral vs communiste.",
      "Blocs : **OTAN** (1949) à l'Ouest ; **Pacte de Varsovie** (1955) à l'Est.",
      "Crises : Berlin, Cuba 1962, guerres de Corée et du Vietnam, mur de Berlin 1961.",
      "Fin : réformes de Gorbatchev, 1989, chute de l'URSS 1991.",
    ],
    parole:
      "Deux capitaines, deux camps, une peur de la bombe : on s'affronte partout sauf en duel direct. OTAN d'un côté, Pacte de Varsovie de l'autre. Ça dure jusqu'à ce que l'URSS disparaisse en 1991.",
    concept: "Monde bipolaire",
    exemple: "Crise de Cuba 1962 : le monde au bord de la guerre nucléaire.",
    recit:
      "Comment l'opposition entre les États-Unis et l'URSS a-t-elle structuré les relations internationales de 1947 à 1991 ?",
    question: "Quelles causes, quels blocs, quelles crises, quelle fin ?",
    competence:
      "Définir bipolarisation et Guerre froide, expliquer les causes, les blocs, les crises et la fin de la bipolarisation.",
    enonce: "Qu'est-ce que la doctrine Truman (1947) ?",
    etapes: [
      { titre: "Contenu", texte: "Endiguer l'expansion communiste, soutenir les « peuples libres »." },
      { titre: "Effet", texte: "Elle ouvre la Guerre froide, avec le plan Marshall et les alliances." },
    ],
    reponse: "Politique américaine d'endiguement du communisme, 1947.",
    savoirs: [
      "Deux modèles. Rupture 1947. OTAN, Pacte de Varsovie, Comecon. Crises majeures. Détente puis relance. 1989–1991.",
      "Guerre froide = tension idéologique, courses aux armements, guerres périphériques, pas de conflit mondial direct USA-URSS.",
    ],
    savoirFaire: [
      "Chronologie 1947-1949-1955-1961-1962-1989-1991. Définir bipolarisation, endiguement.",
      "Situer une crise sur une carte mentale Est/Ouest.",
    ],
  }),

  "tle-d-apres91": tleFiche({
    id: "tle-d-apres91",
    titre: "Le monde de 1991 à nos jours",
    matiereId: "hg",
    mots: ["unipolarité", "multipolarité", "terrorisme", "puissances émergentes"],
    puces: [
      "1991 : disparition de l'URSS. Moment d'**unipolarité** américaine, puis montée d'une **multipolarité**.",
      "Nouvelles puissances : Chine, autres émergents. Acteurs non étatiques (ONG, firmes, groupes armés).",
      "Nouvelles menaces : **terrorisme**, guerres civiles, cyber, climat, pandémies.",
      "Coopération : ONU, coalitions, G20. Tensions : Irak, Ukraine, rivalités USA-Chine.",
      "Le « nouvel ordre » n'est pas stable : hyperpuissance contestée, conflits régionaux.",
    ],
    parole:
      "Quand l'URSS s'effondre, il reste un géant. Puis d'autres poids lourds reviennent sur le ring. Le monde n'est plus seulement Est-Ouest : terrorisme, émergents, crises globales.",
    concept: "Ordre international post-1991",
    exemple: "Attentats du 11 septembre 2001 ; montée de la Chine.",
    recit:
      "Comment les relations internationales ont-elles évolué depuis la fin du monde bipolaire ?",
    question: "Unipolarité, nouvelles puissances, nouvelles menaces : comment les articuler ?",
    competence:
      "Caractériser l'ordre international depuis 1991, identifier nouvelles puissances et menaces, et les formes de coopération.",
    enonce: "Pourquoi parle-t-on d'abord d'unipolarité après 1991 ?",
    etapes: [
      { titre: "URSS", texte: "Sa disparition laisse les États-Unis comme superpuissance dominante." },
      { titre: "Suite", texte: "D'autres puissances et crises rendent ensuite le jeu plus multipolaire." },
    ],
    reponse: "Les USA restent la seule superpuissance militaire et politique globale au début des années 1990.",
    savoirs: [
      "Fin de la bipolarisation. Hyperpuissance US. Émergents. 11-Septembre et guerres. Multipolarité relative.",
      "Rôle toujours central mais contesté de l'ONU. Nouveaux enjeux globaux.",
    ],
    savoirFaire: [
      "Chronologiser 1991, 2001, montée chinoise. Distinguer uni- et multipolarité.",
      "Analyser un document d'actualité avec le vocabulaire du cours.",
    ],
  }),

  "tle-d-decolo-afrique": tleFiche({
    id: "tle-d-decolo-afrique",
    titre: "Les facteurs de la décolonisation de l'Afrique",
    matiereId: "hg",
    mots: ["décolonisation", "nationalisme", "ONU", "indépendances"],
    puces: [
      "Après 1945, les empires coloniaux sont contestés. La **décolonisation** africaine mélange facteurs internes et internationaux.",
      "Internes : **nationalismes**, élites formées, partis, syndicats, parfois luttes armées.",
      "Externes : affaiblissement de l'Europe, Guerre froide, **ONU**, droit des peuples, exemples asiatiques.",
      "Formes : négociée (nombreux États vers 1960) ou conflictuelle (Algérie, quelques guerres).",
      "1960 : « année de l'Afrique » pour beaucoup d'**indépendances**.",
    ],
    parole:
      "Ce n'est pas un seul levier : les Africains réclament, l'Europe est fatiguée, l'ONU parle de droits des peuples, et Washington et Moscou courtisent les nouveaux États. Résultat : la carte de l'Afrique change.",
    concept: "Décolonisation",
    exemple: "Vague d'indépendances de 1960 ; guerre d'Algérie jusqu'en 1962.",
    recit:
      "Quels facteurs expliquent la décolonisation de l'Afrique après la Seconde Guerre mondiale ?",
    question: "Comment articuler causes internes, contexte international et formes d'accès à l'indépendance ?",
    competence:
      "Identifier les facteurs internes et internationaux de la décolonisation africaine et distinguer les formes d'indépendance.",
    enonce: "Donne un facteur interne et un facteur international.",
    etapes: [
      { titre: "Interne", texte: "Nationalisme, partis, revendications d'égalité et d'indépendance." },
      { titre: "International", texte: "ONU, Guerre froide, affaiblissement des métropoles." },
    ],
    reponse: "Nationalismes africains + contexte ONU / affaiblissement européen / Guerre froide.",
    savoirs: [
      "Impérialisme contesté. Nationalismes. Conférences, syndicats. Rôle de l'ONU et des deux Grands. Année 1960.",
      "Indépendance négociée vs guerre. Héritages : frontières, État, coopérations.",
    ],
    savoirFaire: [
      "Classer les facteurs. Situer 1960. Distinguer deux formes d'accès à l'indépendance.",
      "Rédiger un plan : internes / externes / formes.",
    ],
  }),

  "tle-d-decolo-togo": tleFiche({
    id: "tle-d-decolo-togo",
    titre: "La décolonisation du Togo",
    matiereId: "hg",
    mots: ["mandat", "tutelle", "Sylvanus Olympio", "indépendance 1960"],
    puces: [
      "Ancienne colonie allemande, le Togo passe sous **mandat** SDN après 1918, puis **tutelle** de l'ONU (1946), administré par la France (et le Royaume-Uni à l'ouest, intégré au Ghana).",
      "Vie politique : partis, revendications, **Sylvanus Olympio**.",
      "Autonomie progressive, consultations, puis **indépendance le 27 avril 1960**.",
      "Spécificité : statut international (mandat/tutelle) plus que simple colonie française classique.",
      "L'indépendance s'inscrit dans la vague africaine et sous le regard de l'ONU.",
    ],
    parole:
      "Le Togo n'est pas « une colonie comme les autres » : mandat, puis tutelle ONU. Olympio et les partis poussent, Paris négocie, et le 27 avril 1960 le drapeau est hissé.",
    concept: "Tutelle et indépendance",
    exemple: "27 avril 1960 : indépendance, Olympio premier président.",
    recit:
      "Comment le Togo est-il passé du régime de tutelle à l'indépendance en 1960 ?",
    question: "Quels statuts internationaux, quels acteurs, quelles étapes jusqu'en 1960 ?",
    competence:
      "Rappeler les statuts internationaux du Togo, les acteurs politiques et les étapes jusqu'à l'indépendance de 1960.",
    enonce: "Quel est le statut du Togo après 1946 et la date de l'indépendance ?",
    etapes: [
      { titre: "Statut", texte: "Tutelle de l'ONU, administration française (partie orientale)." },
      { titre: "Date", texte: "Indépendance le 27 avril 1960." },
    ],
    reponse: "Tutelle ONU après 1946 ; indépendance le 27 avril 1960.",
    savoirs: [
      "Togo allemand, partage franco-britannique, mandat SDN, tutelle ONU. Acteurs politiques, Olympio.",
      "Étapes institutionnelles vers 1960. Contexte international de décolonisation.",
    ],
    savoirFaire: [
      "Chronologie mandat → tutelle → 1960. Distinguer Togo français et Togo britannique (Ghana).",
      "Relier l'ONU au cas togolais (tutelle).",
    ],
  }),

  "tle-d-togo-politique": tleFiche({
    id: "tle-d-togo-politique",
    titre: "L'évolution politique du Togo (1960–2005)",
    matiereId: "hg",
    mots: ["Olympio", "Eyadéma", "parti unique", "ouverture", "1990"],
    puces: [
      "1960–1963 : **Olympio** président ; assassiné en 1963. Instabilité, coups.",
      "1967 : **Gnassingbé Eyadéma** prend le pouvoir. Long règne, **parti unique** (RPT), culte de la stabilité.",
      "Années **1990** : **ouverture** politique, Conférence nationale, multipartisme, tensions.",
      "Eyadéma reste au pouvoir jusqu'à sa mort en 2005. Succession et continuité du régime.",
      "Fil : indépendance fragile → autoritarisme militaire/parti unique → ouverture contrainte des années 1990.",
    ],
    parole:
      "L'indépendance n'est pas la fin de l'histoire : Olympio tombe en 1963, Eyadéma s'installe en 1967, le parti unique dure, puis les années 1990 forcent une ouverture, sans effacer le pouvoir en place jusqu'en 2005.",
    concept: "Du parti unique à l'ouverture",
    exemple: "Conférence nationale des années 1990 ; mort d'Eyadéma en 2005.",
    recit:
      "Quelles sont les principales étapes de l'évolution politique du Togo entre 1960 et 2005 ?",
    question: "Comment enchaîner Olympio, Eyadéma, parti unique et ouverture des années 1990 ?",
    competence:
      "Présenter les étapes politiques du Togo de 1960 à 2005 (indépendances, coups, Eyadéma, ouverture des années 1990).",
    enonce: "Cite trois dates-repères entre 1960 et 2005.",
    etapes: [
      { titre: "1960 / 1963 / 1967", texte: "Indépendance ; mort d'Olympio ; prise de pouvoir d'Eyadéma." },
      { titre: "1990 / 2005", texte: "Ouverture politique ; mort d'Eyadéma." },
    ],
    reponse: "1960 indépendance ; 1967 Eyadéma ; années 1990 ouverture ; 2005 mort d'Eyadéma.",
    savoirs: [
      "Premières années 1960-1967. Régime Eyadéma, parti unique. Crise et ouverture des années 1990. 2005.",
      "Acteurs : militaires, parti, opposition, Église, partenaires extérieurs.",
    ],
    savoirFaire: [
      "Chronologie claire. Caractériser chaque phase (démocratie fragile, autoritarisme, transition).",
      "Rédiger un récit organisé jusqu'en 2005 sans confondre avec la période post-2005.",
    ],
  }),
};
