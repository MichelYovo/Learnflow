"use client";

import SupportButton from "./SupportButton";

const ITEMS = [
  {
    q: "C’est quoi LearnFlow ?",
    a: "C’est une app pour collégiens et lycéens. Tu y trouves tes cours, des quiz et des jeux de révision. L’idée est simple : tu ne « valides » un chapitre que quand tu l’as vraiment compris — c’est-à-dire 10/10 au quiz.",
  },
  {
    q: "C’est pour quelle classe ?",
    a: "De la 6e jusqu’à la Terminale (2nde A/S, 1ère A/C/D, Tle A/C/D). Au collège : Maths, SVT, PCT, Histoire-Géo, Français, Anglais, ECM. Au lycée : les mêmes, avec PC (Physique-Chimie) à la place de PCT, plus la Philosophie.",
  },
  {
    q: "Comment je commence ?",
    a: "Tu télécharges l’app, tu crées ton profil (ton prénom, ta classe, tes matières), et tu choisis un mode. Ensuite tu lis le cours, tu t’entraînes, puis tu fais le quiz. Pas besoin de tout comprendre d’un coup : l’app te guide.",
  },
  {
    q: "Pourquoi il faut 10/10 ?",
    a: "Parce que « presque » ne suffit pas le jour du devoir. 9/10, ce n’est pas encore validé. Si tu te trompes, tu ne recommences pas tout : tu revois seulement les questions ratées, jusqu’à tout bon.",
  },
  {
    q: "Et si je rate le quiz ?",
    a: "Ce n’est pas grave. Spira est un peu triste, tu relis le cours, et tu réessaies les questions que tu as manquées. Quand tu as 10/10, le chapitre est validé — et tu peux passer à la suite.",
  },
  {
    q: "Je ne sais pas quel mode choisir.",
    a: "Libre si tu as le temps et que tu veux lire tranquillement. Guidé si tu ne sais pas par où commencer : l’app te propose ce qu’il faut réviser aujourd’hui. Cramming si tu as un devoir demain. Blitz si tu veux un défi de 60 secondes tout seul — Duel Blitz si tu invites un ami dans la même arène.",
  },
  {
    q: "Spira, c’est qui ?",
    a: "C’est le petit personnage dans l’app. Il t’accompagne pendant que tu révises. Il ne fait pas tes devoirs : il est là pour t’encourager quand tu lis, quand tu réussis, ou quand tu rates une question.",
  },
  {
    q: "Ça marche sans internet ?",
    a: "Oui. Une fois l’app installée, tu peux lire tes cours et faire tes quiz dans le bus, à la maison ou à l’école, même s’il n’y a pas de réseau.",
  },
  {
    q: "Mes parents voient tout ce que je fais ?",
    a: "Non. Ils ne voient pas tes écrans, ni tes notes en direct. Si tu (ou tes parents) activez l’option, ils reçoivent seulement un SMS de félicitations quand tu valides un chapitre à 10/10. Tu peux couper ça quand tu veux.",
  },
  {
    q: "On peut être plusieurs sur le même téléphone ?",
    a: "Oui. Chaque élève a son propre profil, avec sa classe et sa progression. Tu déverrouilles le tien avec un code à 4 chiffres, pour que personne ne mélange vos révisions.",
  },
  {
    q: "Je suis obligé de faire les ligues ?",
    a: "Non. Les ligues, c’est pour s’amuser : tu gagnes des points, tu montes de palier (Bronze, Argent, Or…), tu vois tes camarades. Si tu n’aimes pas le classement, tu n’es pas obligé d’y aller, et tu peux cacher ton prénom.",
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
              <span className="shrink-0 text-[#1677FF] transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-3 text-sm font-medium leading-relaxed text-[#64748B]">{item.a}</p>
        </details>
      ))}
      <details className="group rounded-[20px] border-2 border-[#F0EFEE] bg-white px-5 py-4 open:border-[#BAE0FF]">
        <summary className="cursor-pointer list-none text-base font-extrabold text-[#1C1917] marker:content-none">
          <span className="flex items-start justify-between gap-3 sm:gap-4">
            Comment je télécharge l’app ?
            <span className="shrink-0 text-[#1677FF] transition group-open:rotate-45">+</span>
          </span>
        </summary>
        <p className="mt-3 text-sm font-medium leading-relaxed text-[#64748B]">
          Bientôt sur Android et iPhone. En attendant, clique sur « Préviens-moi » en haut de la page, ou{" "}
          <SupportButton className="font-extrabold text-[#1677FF] hover:underline">écris au support</SupportButton>{" "}
          — on te dira dès que c’est en ligne.
        </p>
      </details>
    </div>
  );
}
