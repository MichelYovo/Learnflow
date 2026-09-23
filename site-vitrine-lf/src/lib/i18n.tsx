"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "fr" | "en";

const STORAGE_KEY = "lf-locale";

const dict = {
  fr: {
    nav: {
      how: "Comment ça marche",
      modes: "Les 4 modes",
      leagues: "Ligues",
      contact: "Contact",
      faq: "Questions",
      openApp: "Ouvrir l’app",
      support: "Nous contacter",
      menu: "Menu",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
    },
    hero: {
      badge: "Collège et lycée · Togo",
      title: "Tes cours, compris pour de vrai.",
      leadBefore: "LearnFlow, c’est l’app pour réviser sans te perdre. Tu lis, tu t’entraînes, tu gagnes de l’XP — et un chapitre n’est validé que quand tu as ",
      leadStrong: "10/10",
      leadAfter: ".",
      seeHow: "Voir comment ça marche",
      already: "6e → Terminale · déjà sur le web",
      cta: "Ouvrir LearnFlow",
      ctaCompact: "Ouvrir l’app",
    },
    how: {
      kicker: "Comment ça marche",
      title: "Quatre étapes. Du profil au 10/10.",
      steps: [
        { t: "Tu crées ton profil", d: "Prénom, classe, matières. Si vous êtes plusieurs sur le même téléphone, chacun a le sien." },
        { t: "Tu lis le cours", d: "L’essentiel d’abord, les détails ensuite. Comme un cahier, mais plus clair." },
        { t: "Tu vises le 10/10", d: "10 questions. Il faut tout bon pour valider. Si tu rates, tu revois seulement ce qui manque." },
        { t: "Tu gagnes de l’XP", d: "Points, ligues, badges. Le cahier de jeu avance avec toi — sans la pression." },
      ],
    },
    rule: {
      kicker: "La règle du 10/10",
      title: "Un chapitre n’est validé que quand c’est parfait.",
      lead: "Le quiz a 10 questions. Il faut 10/10 — pas 9, pas « presque ». Si tu te trompes, tu ne recommences pas tout : tu revois seulement les questions ratées, jusqu’à tout bon.",
    },
    modes: {
      kicker: "Les 4 modes",
      title: "Un mode selon le moment — pas l’inverse.",
      lead: "Libre le week-end. Guidé si tu ne sais pas par où commencer. Cramming la veille. Blitz pour un défi de 60 secondes.",
      items: [
        {
          label: "Mode Libre",
          sub: "Tu as le temps",
          purpose: "Tu lis à ton rythme, sans chrono. Idéal le soir, le week-end, ou quand tu veux vraiment comprendre un chapitre.",
          hint: "Cours · Schémas · Pas de stress",
        },
        {
          label: "Mode Guidé",
          sub: "Tu ne sais pas par où commencer",
          purpose: "L’app te propose ce qu’il faut réviser aujourd’hui — surtout ce que tu risques d’oublier. Tu suis, c’est tout.",
          hint: "Une petite routine chaque jour",
        },
        {
          label: "Cramming",
          sub: "Devoir demain",
          purpose: "Un chapitre, des quiz, des textes à trous. Pas de chrono : tu te concentres jusqu’à tout retenir.",
          hint: "Quiz · Mots manquants",
        },
        {
          label: "Blitz 60s",
          sub: "Un défi rapide",
          purpose: "60 secondes, questions mêlées. Tout seul, ou Duel Blitz : tu invites un ami dans la même arène, en même temps.",
          hint: "Solo · ou Duel Blitz",
        },
      ],
    },
    leagues: {
      kicker: "Le cahier de jeu",
      title: "XP, ligues, badges — comme un championnat.",
      lead: "Chaque 10/10 te fait avancer. Tu montes de palier, tu débloques des badges, tu peux défier un ami en Duel Blitz. Tu n’es pas obligé d’y aller, et tu peux cacher ton prénom.",
      stats: [
        { v: "+XP", l: "à chaque quiz" },
        { v: "Streak", l: "les jours d’affilée" },
        { v: "Blitz 60s", l: "solo ou duel" },
      ],
      path: "Bronze → Argent → Or → Platine → Diamant",
      tiers: ["Bronze", "Argent", "Or", "Platine", "Diamant"],
    },
    courses: {
      kicker: "Tes cours",
      title: "Le programme du Togo. L’essentiel d’abord.",
      lead: "Maths · SVT · PCT (collège) · PC (lycée) · Histoire-Géo · Français · Anglais · ECM · Philosophie",
    },
    parents: {
      kicker: "Pour tes parents",
      title: "Un SMS de fierté. Rien d’autre.",
      lead: "Tes parents ne voient pas tes écrans. S’ils activent l’option, ils reçoivent seulement un message quand tu valides un chapitre à 10/10.",
    },
    offline: {
      kicker: "Sans internet",
      title: "Tes révisions t’attendent partout.",
      lead: "Bus, maison, école. Une fois l’app ouverte, tu lis et tu t’entraînes même s’il n’y a pas de réseau.",
    },
    contact: {
      kicker: "Nous contacter",
      title: "Une question ? Écris-nous ici.",
      lead: "Tu laisses ton nom, ton email et ton message. Ça arrive tout de suite sur le dashboard de l’équipe LearnFlow.",
    },
    faq: {
      kicker: "Questions",
      title: "Les questions que tu te poses vraiment",
      items: [
        {
          q: "C’est quoi LearnFlow ?",
          a: "C’est une app pour collégiens et lycéens. Tu y trouves tes cours, des quiz et un cahier de jeu : XP, ligues, badges. Un chapitre n’est validé que quand tu as 10/10.",
        },
        {
          q: "C’est pour quelle classe ?",
          a: "De la 6e jusqu’à la Terminale (2nde A/S, 1ère A/C/D, Tle A/C/D). Au collège : Maths, SVT, PCT, Histoire-Géo, Français, Anglais, ECM. Au lycée : les mêmes, avec PC à la place de PCT, plus la Philosophie.",
        },
        {
          q: "Comment je commence ?",
          a: "Tu ouvres LearnFlow sur le web, tu crées ton profil (prénom, classe, matières), et tu choisis un mode. Ensuite tu lis le cours, tu t’entraînes, puis tu fais le quiz.",
        },
        {
          q: "Pourquoi il faut 10/10 ?",
          a: "Parce que « presque » ne suffit pas le jour du devoir. 9/10, ce n’est pas encore validé. Si tu te trompes, tu revois seulement les questions ratées, jusqu’à tout bon.",
        },
        {
          q: "Je ne sais pas quel mode choisir.",
          a: "Libre si tu as le temps. Guidé si tu ne sais pas par où commencer. Cramming si tu as un devoir demain. Blitz pour un défi de 60 secondes — Duel Blitz si tu invites un ami.",
        },
        {
          q: "Spira, c’est qui ?",
          a: "C’est le petit personnage dans l’app. Il t’accompagne pendant que tu révises. Il ne fait pas tes devoirs : il est là pour t’encourager.",
        },
        {
          q: "Ça marche sans internet ?",
          a: "Oui. Une fois l’app ouverte, tu peux lire tes cours et faire tes quiz dans le bus, à la maison ou à l’école, même s’il n’y a pas de réseau.",
        },
        {
          q: "Mes parents voient tout ce que je fais ?",
          a: "Non. Ils ne voient pas tes écrans. S’ils activent l’option, ils reçoivent seulement un SMS de félicitations quand tu valides un chapitre à 10/10.",
        },
        {
          q: "Je suis obligé de faire les ligues ?",
          a: "Non. Les ligues, c’est le cahier de jeu : XP, paliers Bronze à Diamant, badges. Si tu n’aimes pas le classement, tu n’es pas obligé d’y aller, et tu peux cacher ton prénom.",
        },
        {
          q: "LearnFlow est disponible maintenant ?",
          a: "Oui, sur le web. L’app téléphone arrive plus tard sur Google Play et l’App Store.",
        },
      ],
    },
    cta: {
      title: "Prêt à viser 10/10 ?",
      lead: "Collège et lycée, programme du Togo. Ouvre LearnFlow sur le web, crée ton profil, et c’est parti.",
      support: "Une question ?",
      write: "Écrire au support",
    },
    footer: {
      blurb: "L’app de révision pour collégiens et lycéens du Togo. Tes cours, des quiz, et un chapitre validé seulement à 10/10.",
      onPage: "Sur cette page",
      parents: "Parents",
      contact: "Contact",
      legal: "Légal",
      privacy: "Confidentialité",
      mentions: "Mentions légales",
      open: "Ouvrir LearnFlow",
      copy: "LearnFlow Togo · Collège et lycée · Version 1.0.0",
    },
    a11y: {
      switchToEn: "Passer en anglais",
      switchToFr: "Passer en français",
      switchToDark: "Passer en mode sombre",
      switchToLight: "Passer en mode clair",
    },
  },
  en: {
    nav: {
      how: "How it works",
      modes: "The 4 modes",
      leagues: "Leagues",
      contact: "Contact",
      faq: "FAQ",
      openApp: "Open the app",
      support: "Contact us",
      menu: "Menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      badge: "Middle & high school · Togo",
      title: "Your courses, understood for real.",
      leadBefore: "LearnFlow is the app to revise without getting lost. You read, you practice, you earn XP — and a chapter is only validated when you score ",
      leadStrong: "10/10",
      leadAfter: ".",
      seeHow: "See how it works",
      already: "6th grade → Terminale · already on the web",
      cta: "Open LearnFlow",
      ctaCompact: "Open the app",
    },
    how: {
      kicker: "How it works",
      title: "Four steps. From profile to 10/10.",
      steps: [
        { t: "Create your profile", d: "First name, class, subjects. If several people share a phone, each gets their own." },
        { t: "Read the lesson", d: "Essentials first, details next. Like a notebook, but clearer." },
        { t: "Aim for 10/10", d: "10 questions. Everything must be correct. If you miss some, you only review what you missed." },
        { t: "Earn XP", d: "Points, leagues, badges. The gamebook moves with you — without the pressure." },
      ],
    },
    rule: {
      kicker: "The 10/10 rule",
      title: "A chapter is only validated when it’s perfect.",
      lead: "The quiz has 10 questions. You need 10/10 — not 9, not “almost”. If you miss one, you don’t restart everything: you only review the wrong answers until they’re all right.",
    },
    modes: {
      kicker: "The 4 modes",
      title: "A mode for the moment — not the other way around.",
      lead: "Libre on weekends. Guided when you don’t know where to start. Cramming the night before. Blitz for a 60-second challenge.",
      items: [
        {
          label: "Libre mode",
          sub: "You have time",
          purpose: "Read at your pace, no timer. Ideal in the evening, on weekends, or when you really want to understand a chapter.",
          hint: "Lessons · Diagrams · No stress",
        },
        {
          label: "Guided mode",
          sub: "You don’t know where to start",
          purpose: "The app suggests what to revise today — especially what you’re likely to forget. You just follow.",
          hint: "A small daily routine",
        },
        {
          label: "Cramming",
          sub: "Test tomorrow",
          purpose: "One chapter, quizzes, fill-in-the-blanks. No timer: you focus until it sticks.",
          hint: "Quizzes · Missing words",
        },
        {
          label: "Blitz 60s",
          sub: "A quick challenge",
          purpose: "60 seconds, mixed questions. Solo, or Blitz Duel: invite a friend into the same arena at the same time.",
          hint: "Solo · or Blitz Duel",
        },
      ],
    },
    leagues: {
      kicker: "The gamebook",
      title: "XP, leagues, badges — like a championship.",
      lead: "Every 10/10 moves you forward. You climb tiers, unlock badges, and can challenge a friend in Blitz Duel. You don’t have to join, and you can hide your name.",
      stats: [
        { v: "+XP", l: "on every quiz" },
        { v: "Streak", l: "days in a row" },
        { v: "Blitz 60s", l: "solo or duel" },
      ],
      path: "Bronze → Silver → Gold → Platinum → Diamond",
      tiers: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
    },
    courses: {
      kicker: "Your courses",
      title: "Togo’s curriculum. Essentials first.",
      lead: "Maths · SVT · PCT (middle school) · PC (high school) · History-Geo · French · English · ECM · Philosophy",
    },
    parents: {
      kicker: "For your parents",
      title: "A proud SMS. Nothing else.",
      lead: "Your parents don’t see your screens. If they turn the option on, they only get a message when you validate a chapter at 10/10.",
    },
    offline: {
      kicker: "Offline",
      title: "Your revisions wait for you everywhere.",
      lead: "Bus, home, school. Once the app is open, you read and practice even without a network.",
    },
    contact: {
      kicker: "Contact us",
      title: "A question? Write us here.",
      lead: "Leave your name, email and message. It reaches the LearnFlow team dashboard right away.",
    },
    faq: {
      kicker: "FAQ",
      title: "The questions you actually ask",
      items: [
        {
          q: "What is LearnFlow?",
          a: "An app for middle and high school students. Courses, quizzes, and a gamebook: XP, leagues, badges. A chapter is only validated at 10/10.",
        },
        {
          q: "Which grades?",
          a: "From 6th grade to Terminale. Middle school: Maths, SVT, PCT, History-Geo, French, English, ECM. High school: the same with PC instead of PCT, plus Philosophy.",
        },
        {
          q: "How do I start?",
          a: "Open LearnFlow on the web, create your profile (name, class, subjects), pick a mode. Then read, practice, and take the quiz.",
        },
        {
          q: "Why 10/10?",
          a: "Because “almost” isn’t enough on exam day. 9/10 isn’t validated yet. If you miss some, you only review those until they’re all correct.",
        },
        {
          q: "I don’t know which mode to pick.",
          a: "Libre if you have time. Guided if you don’t know where to start. Cramming if you have a test tomorrow. Blitz for a 60-second challenge — Blitz Duel if you invite a friend.",
        },
        {
          q: "Who is Spira?",
          a: "The little character in the app. He accompanies you while you revise. He doesn’t do your homework — he cheers you on.",
        },
        {
          q: "Does it work offline?",
          a: "Yes. Once the app is open, you can read courses and take quizzes on the bus, at home, or at school, even without a network.",
        },
        {
          q: "Do my parents see everything I do?",
          a: "No. They don’t see your screens. If they enable it, they only get a congratulatory SMS when you validate a chapter at 10/10.",
        },
        {
          q: "Do I have to do leagues?",
          a: "No. Leagues are the gamebook: XP, Bronze to Diamond tiers, badges. If you don’t like rankings, you can skip them and hide your name.",
        },
        {
          q: "Is LearnFlow available now?",
          a: "Yes, on the web. The phone app comes later on Google Play and the App Store.",
        },
      ],
    },
    cta: {
      title: "Ready to aim for 10/10?",
      lead: "Middle and high school, Togo curriculum. Open LearnFlow on the web, create your profile, and go.",
      support: "A question?",
      write: "Write to support",
    },
    footer: {
      blurb: "The revision app for middle and high school students in Togo. Your courses, quizzes, and a chapter validated only at 10/10.",
      onPage: "On this page",
      parents: "Parents",
      contact: "Contact",
      legal: "Legal",
      privacy: "Privacy",
      mentions: "Legal notice",
      open: "Open LearnFlow",
      copy: "LearnFlow Togo · Middle & high school · Version 1.0.0",
    },
    a11y: {
      switchToEn: "Switch to English",
      switchToFr: "Switch to French",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
    },
  },
} as const;

export type Dictionary = (typeof dict)["fr"];

type Ctx = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<Ctx | null>(null);

function readLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  // Default = FR. Only switch if the user explicitly chose EN.
  return raw === "en" ? "en" : "fr";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const next = readLocale();
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fr" ? "en" : "fr");
  }, [locale, setLocale]);

  const value = useMemo(
    () => ({
      locale,
      t: dict[locale] as Dictionary,
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
