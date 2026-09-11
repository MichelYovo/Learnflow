export type SuperProfEmail = {
  subject: string;
  body: string;
  studentIds: string[];
};

export const SUPER_PROF_PROMPTS = [
  {
    id: "inactifs",
    label: "Qui est inactif ?",
    text: "Quels élèves sont inactifs ? Donne leur nom, classe, et depuis combien de temps, avec une recommandation courte.",
  },
  {
    id: "mail-inactifs",
    label: "Rédiger un mail de relance",
    text: "Rédige un mail de relance pour tous les élèves inactifs. Ton chaleureux, français simple, mentionne depuis combien de temps ils sont absents, et invite-les à continuer via le lien.",
  },
  {
    id: "revue",
    label: "Revue d’un élève",
    text: "Fais une revue concrète de l’élève actuellement ouvert (ou du plus inactif s’il n’y en a pas). Points bloqués, ce qu’il a déjà fait, et 3 actions pour le relancer.",
  },
  {
    id: "envoyer",
    label: "Préparer l’envoi",
    text: "Prépare le mail de relance prêt à envoyer aux inactifs qui ont un email. Je validerai l’envoi ensuite.",
  },
] as const;
