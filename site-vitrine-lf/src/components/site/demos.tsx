"use client";

import ExplainShowcase, { type ExplainItem } from "./ExplainShowcase";
import {
  BlitzPlay,
  CoursePlay,
  LeaguePlay,
  OfflinePlay,
  ProfilePlay,
  QuizPlay,
  ResultPlay,
  SmsPlay,
} from "../phone/playScreens";

const PARCOURS: ExplainItem[] = [
  {
    id: "profil",
    n: "1",
    title: "Tu crées ton profil",
    body: "Ton prénom, ta classe, tes matières. Si vous êtes plusieurs sur le même téléphone, chacun a le sien.",
    sfx: "click",
    anim: "pop",
    glow: "blue",
    label: "Profil",
    screen: (k) => <ProfilePlay playKey={k} />,
  },
  {
    id: "cours",
    n: "2",
    title: "Tu lis le cours",
    body: "D’abord un résumé court (l’Essentiel), ensuite les détails. Des mots se révèlent pour que tu t’entraînes.",
    sfx: "click",
    anim: "pop",
    glow: "green",
    label: "Cours",
    screen: (k) => <CoursePlay playKey={k} />,
  },
  {
    id: "quiz",
    n: "3",
    title: "Tu fais le quiz",
    body: "10 questions. Il faut tout bon pour valider. Si tu te trompes, tu revois seulement ce que tu as raté.",
    sfx: "correct",
    anim: "win",
    glow: "green",
    label: "Quiz",
    screen: (k) => <QuizPlay playKey={k} outcome="ok" />,
  },
  {
    id: "suite",
    n: "4",
    title: "Tu continues",
    body: "Tu gagnes des points, tu montes en ligue, tu débloques des badges. Tes parents peuvent recevoir un SMS de fierté.",
    sfx: "correct",
    anim: "win",
    glow: "amber",
    label: "Résultat",
    screen: (k) => <ResultPlay playKey={k} />,
  },
];

const REGLE: ExplainItem[] = [
  {
    id: "parfait",
    title: "Tout bon du premier coup",
    body: "Tu enchaînes tout de suite, et tu gagnes un badge Challenger — plus de points.",
    sfx: "correct",
    anim: "win",
    glow: "green",
    label: "10/10",
    screen: (k) => <ResultPlay playKey={k} />,
  },
  {
    id: "erreur",
    title: "Tu as une erreur",
    body: "Tu relis, tu réessaies les questions manquées. Le grand quiz attend un peu.",
    sfx: "wrong",
    anim: "shake",
    glow: "red",
    label: "Erreur",
    screen: (k) => <QuizPlay playKey={k} outcome="ko" />,
  },
  {
    id: "points",
    title: "Les points",
    body: "Tu en gagnes seulement quand c’est 10/10. C’est plus juste : on ne récompense pas le survol.",
    sfx: "correct",
    anim: "pop",
    glow: "blue",
    label: "Points",
    screen: (k) => <LeaguePlay playKey={k} />,
  },
];

const LIGUES: ExplainItem[] = [
  {
    id: "podium",
    n: "1",
    title: "Le podium de la semaine",
    body: "Tu vois où tu es dans ton groupe. C’est un jeu, pas un bulletin.",
    sfx: "correct",
    anim: "win",
    glow: "amber",
    label: "Podium",
    screen: (k) => <LeaguePlay playKey={k} />,
  },
  {
    id: "paliers",
    n: "2",
    title: "Les paliers",
    body: "Bronze, Argent, Or, Platine, Diamant. Tu montes en validant tes chapitres.",
    sfx: "click",
    anim: "pop",
    glow: "amber",
    label: "Ligues",
    screen: (k) => <LeaguePlay playKey={k} />,
  },
  {
    id: "libre",
    n: "3",
    title: "Tu n’es pas obligé",
    body: "Tu peux cacher ton prénom, ou ne pas y aller. La ligue, c’est pour s’amuser.",
    sfx: "click",
    anim: "pop",
    glow: "blue",
    label: "Ligues",
    screen: (k) => <LeaguePlay playKey={k} />,
  },
];

const PARENTS: ExplainItem[] = [
  {
    id: "reussite",
    n: "1",
    title: "Tu réussis",
    body: "10/10 au quiz — ou 10/10 dès le premier essai (badge Challenger).",
    sfx: "correct",
    anim: "win",
    glow: "green",
    label: "10/10",
    screen: (k) => <ResultPlay playKey={k} />,
  },
  {
    id: "sms",
    n: "2",
    title: "Un SMS part",
    body: "Un message de félicitations, seulement si l’option est activée.",
    sfx: "warn",
    anim: "pop",
    glow: "blue",
    label: "SMS",
    screen: (k) => <SmsPlay playKey={k} />,
  },
  {
    id: "parents",
    n: "3",
    title: "Tes parents savent",
    body: "Ils apprennent la réussite. Jamais ce que tu as fait minute par minute.",
    sfx: "click",
    anim: "pop",
    glow: "blue",
    label: "SMS",
    screen: (k) => <SmsPlay playKey={k} />,
  },
];

const OFFLINE: ExplainItem[] = [
  {
    id: "bus",
    n: "1",
    title: "Dans le bus",
    body: "Tu lis tes fiches et tu t’entraînes, même sans réseau. Pas de chrono.",
    sfx: "click",
    anim: "pop",
    glow: "green",
    label: "Hors ligne",
    screen: (k) => <OfflinePlay playKey={k} />,
  },
  {
    id: "maison",
    n: "2",
    title: "À la maison",
    body: "Pas de wifi ? Tes cours restent sur le téléphone.",
    sfx: "click",
    anim: "pop",
    glow: "blue",
    label: "Hors ligne",
    screen: (k) => <CoursePlay playKey={k} />,
  },
  {
    id: "recre",
    n: "3",
    title: "À la récré",
    body: "Un Blitz de 60 secondes, et tu peux défier un ami sur WhatsApp.",
    sfx: "timesUp",
    anim: "shake",
    glow: "red",
    dark: true,
    label: "Blitz",
    screen: (k) => <BlitzPlay playKey={k} />,
  },
];

export function ParcoursDemo() {
  return <ExplainShowcase items={PARCOURS} columns={2} />;
}

export function RuleDemo() {
  return <ExplainShowcase items={REGLE} />;
}

export function CourseDemo() {
  return (
    <ExplainShowcase
      items={[
        {
          id: "essentiel",
          title: "L’Essentiel d’abord",
          body: "Un résumé court, facile à relire. Les mots importants s’allument un par un.",
          sfx: "click",
          anim: "pop",
          glow: "green",
          label: "Cours",
          screen: (k) => <CoursePlay playKey={k} />,
        },
        {
          id: "details",
          title: "Ensuite les détails",
          body: "Tu vas plus loin, avec le programme officiel du Togo. En SVT, des schémas à faire tourner.",
          sfx: "click",
          anim: "pop",
          glow: "green",
          label: "Cours",
          screen: (k) => <CoursePlay playKey={k} />,
        },
        {
          id: "quiz-cours",
          title: "Puis tu t’entraînes",
          body: "Quand tu as lu, tu passes au quiz. Même écran, même chapitre.",
          sfx: "correct",
          anim: "win",
          glow: "green",
          label: "Quiz",
          screen: (k) => <QuizPlay playKey={k} outcome="ok" />,
        },
      ]}
    />
  );
}

export function LeagueDemo() {
  return <ExplainShowcase items={LIGUES} />;
}

export function ParentsDemo() {
  return <ExplainShowcase items={PARENTS} />;
}

export function OfflineDemo() {
  return <ExplainShowcase items={OFFLINE} />;
}
