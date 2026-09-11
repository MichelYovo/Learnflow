"use client";

import { WEB_URL } from "../../lib/brand";
import SupportButton from "./SupportButton";

const ITEMS = [
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
] as const;

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {ITEMS.map((item) => (
        <details
          key={item.q}
          className="group rounded-[20px] border-2 border-[#F0EFEE] bg-white px-5 py-4 open:border-[#BAE0FF]"
        >
          <summary className="cursor-pointer list-none text-base font-extrabold text-[#1C1917] marker:content-none">
            <span className="flex items-start justify-between gap-3 sm:gap-4">
              <span className="min-w-0">{item.q}</span>
              <span className="shrink-0 text-[#1677FF] group-open:hidden">+</span>
              <span className="hidden shrink-0 text-[#1677FF] group-open:inline">−</span>
            </span>
          </summary>
          <p className="mt-3 text-sm font-medium leading-relaxed text-[#64748B]">{item.a}</p>
        </details>
      ))}
      <p className="px-1 pt-2 text-sm font-medium text-[#64748B]">
        Tu ne trouves pas ta réponse ?{" "}
        <SupportButton className="font-extrabold text-[#1677FF] hover:underline">Écris-nous</SupportButton>
        {" — ou "}
        <a href={WEB_URL} className="font-extrabold text-[#1677FF] hover:underline">
          ouvre LearnFlow
        </a>
        .
      </p>
    </div>
  );
}
