import type { AnalogieSpiraData, FicheCoursData } from "../types/learnflow";

function analogie(parole: string, concept: string, exemple: string): AnalogieSpiraData {
  return {
    kicker: "EN D'AUTRE TERME",
    titre: "L'Analogie de Spira",
    parole,
    concept,
    exemple,
  };
}

function boldToBrackets(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "[$1]");
}

export type TleFicheDraft = {
  id: string;
  titre: string;
  matiereId: string;
  mots: string[];
  puces: string[];
  parole: string;
  concept: string;
  exemple: string;
  recit: string;
  question: string;
  competence: string;
  enonce: string;
  etapes: { titre: string; texte: string }[];
  reponse: string;
  savoirs: string[];
  savoirFaire: string[];
};

export function tleFiche(d: TleFicheDraft): FicheCoursData {
  const essentialText = d.puces
    .map((p, i) => {
      const t = boldToBrackets(p).replace(/^[•\-]\s+/, "");
      return i === 0 ? t : `• ${t}`;
    })
    .join("\n\n");
  return {
    chapitreId: d.id,
    titre: d.titre,
    matiereId: d.matiereId,
    schema: d.matiereId === "svt" ? "3d" : undefined,
    motsClesMasques: d.mots,
    pucesEssentiel: d.puces,
    essentialText,
    analogie: analogie(d.parole, d.concept, d.exemple),
    situationProbleme: {
      recit: d.recit,
      question: d.question,
      competenceVisee: d.competence,
    },
    exempleResolu: {
      enonce: d.enonce,
      etapes: d.etapes,
      reponseFinale: d.reponse,
    },
    sectionsDetaillees: [
      { id: "competence", titre: "Compétence visée (APC)", paragraphes: [d.competence] },
      { id: "savoirs", titre: "Savoirs", paragraphes: d.savoirs },
      { id: "savoirfaire", titre: "Savoir-faire", paragraphes: d.savoirFaire },
    ],
    detailedText: [
      "Compétence visée (APC)",
      "",
      d.competence,
      "",
      "Savoirs",
      "",
      d.savoirs.join("\n\n"),
      "",
      "Savoir-faire",
      "",
      d.savoirFaire.join("\n\n"),
    ].join("\n"),
  };
}
