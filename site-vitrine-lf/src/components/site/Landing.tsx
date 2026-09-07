import Image from "next/image";
import { SUBJECTS, TIERS } from "../../lib/brand";
import Faq from "./Faq";
import HeroPhones from "./HeroPhones";
import ModeShowcase from "./ModeShowcase";
import StoreButtons from "./StoreButtons";
import { CourseDemo, LeagueDemo, OfflineDemo, ParentsDemo, ParcoursDemo, RuleDemo } from "./demos";

const PLAN = [
  { href: "#parcours", n: "1", t: "Comment ça marche", d: "4 étapes, du profil au 10/10." },
  { href: "#regle", n: "2", t: "La règle du 10/10", d: "Pourquoi, et que faire si tu rates." },
  { href: "#modes", n: "3", t: "Les 4 modes", d: "Libre, Guidé, Cramming, Blitz." },
  { href: "#cours", n: "4", t: "Tes cours", d: "L’essentiel, puis les détails." },
  { href: "#ligues", n: "5", t: "Ligues", d: "Des points, sans la pression." },
  { href: "#faq", n: "6", t: "Questions", d: "Tout ce que tu te demandes." },
];

export default function Landing() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_80%_-10%,rgba(22,119,255,.16),transparent),radial-gradient(600px_280px_at_10%_20%,rgba(16,185,129,.10),transparent)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:pb-16 lg:pt-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#BAE0FF] bg-[#E6F4FF] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#1677FF]">
              <Image src="/brand/logo-mark.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
              Collège et lycée · Togo
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.1] tracking-tight text-[#1C1917] sm:text-5xl lg:text-[56px]">
              Tes cours, compris pour de vrai.
            </h1>
            <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-[#64748B]">
              LearnFlow, c’est l’app pour réviser sans te perdre. Tu lis, tu t’entraînes, et un chapitre n’est validé
              que quand tu as <strong className="font-extrabold text-[#1C1917]">10/10</strong>. Clique les explications :
              le téléphone s’anime, avec le son.
            </p>
            <div className="mt-8">
              <StoreButtons />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#A8A29E]">
              <a href="#parcours" className="text-[#1677FF] hover:underline">
                Voir comment ça marche
              </a>
              {" · "}
              6e → Terminale · 7 matières
            </p>
          </div>
          <HeroPhones />
        </div>
      </section>

      <section className="border-t border-[#F0EFEE] bg-white py-10">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">
            Tu ne sais pas par où commencer ?
          </p>
          <h2 className="mt-2 text-center text-2xl font-black tracking-tight text-[#1C1917] sm:text-3xl">
            Voici le plan de la page.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-[#64748B]">
            Clique sur une case. Ensuite, dans chaque partie, clique encore : le téléphone montre l’app.
          </p>
          <nav aria-label="Plan de la page" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLAN.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="flex gap-3 rounded-[20px] border-2 border-[#F0EFEE] bg-[#FAFAF9] p-4 transition hover:border-[#BAE0FF] hover:bg-[#E6F4FF]"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1677FF] text-sm font-black text-white">
                  {p.n}
                </span>
                <div>
                  <p className="font-extrabold text-[#1C1917]">{p.t}</p>
                  <p className="mt-0.5 text-sm font-medium text-[#64748B]">{p.d}</p>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section id="parcours" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Comment ça marche</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Quatre étapes. Clique pour les voir.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#64748B]">
            Tu n’as pas besoin de tout connaître avant de commencer. Clique une étape : le téléphone joue la scène.
          </p>
          <div className="mt-10">
            <ParcoursDemo />
          </div>
        </div>
      </section>

      <section id="regle" className="scroll-mt-24 border-t border-[#F0EFEE] bg-white py-20">
        <div id="produit" className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">La règle du 10/10</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Un chapitre n’est validé que quand c’est parfait.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#64748B]">
            Le quiz a 10 questions. Il faut 10/10 — pas 9, pas « presque ». Clique une situation pour voir ce qui se
            passe.
          </p>
          <div className="mt-10">
            <RuleDemo />
          </div>
        </div>
      </section>

      <section id="modes" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Les 4 modes</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Un mode selon le moment — pas l’inverse.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#64748B]">
            Clique sur une carte : le téléphone joue l’écran, avec le son. Choisis selon ta journée.
          </p>
          <div className="mt-10">
            <ModeShowcase />
          </div>
        </div>
      </section>

      <section id="cours" className="border-t border-[#F0EFEE] bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#10B981]">Tes cours</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            L’essentiel d’abord, les détails ensuite.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#64748B]">
            Clique une case : tu vois comment un chapitre s’ouvre. 7 matières, selon ta classe.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <span
                key={s.id}
                className="rounded-full px-3 py-1.5 text-sm font-extrabold"
                style={{ color: s.color, background: s.bg }}
              >
                {s.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm font-medium text-[#64748B]">
            Maths · SVT · Physique-Chimie · Histoire-Géo · Français · Anglais · EDHC
          </p>
          <div className="mt-10">
            <CourseDemo />
          </div>
        </div>
      </section>

      <section id="ligues" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#F59E0B]">Ligues et points</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Comme un championnat — sans la pression.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#64748B]">
            Clique pour voir le podium bouger. Tu n’es pas obligé d’y aller, et tu peux cacher ton prénom.
          </p>
          <div className="mt-8 flex flex-wrap items-end justify-center gap-6">
            {TIERS.map((t, i) => (
              <div key={t.id} className="flex flex-col items-center gap-2">
                <Image
                  src={t.src}
                  alt={t.label}
                  width={i === 2 ? 96 : 72}
                  height={i === 2 ? 96 : 72}
                  className={i === 2 ? "h-24 w-24 object-contain" : "h-16 w-16 object-contain opacity-80"}
                />
                <span className="text-sm font-extrabold text-[#1C1917]">{t.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm font-semibold text-[#A8A29E]">
            Bronze → Argent → Or → Platine → Diamant
          </p>
          <div className="mt-10">
            <LeagueDemo />
          </div>
        </div>
      </section>

      <section id="parents" className="scroll-mt-24 border-t border-[#F0EFEE] bg-white py-20">
        <div id="sms" className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Pour tes parents</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Un SMS de fierté. Rien d’autre.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#64748B]">
            Clique les étapes : tu vois le 10/10, puis le message. Tes parents ne voient pas tes écrans.
          </p>
          <div className="mt-10">
            <ParentsDemo />
          </div>
        </div>
      </section>

      <section id="offline" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Sans internet</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Tes révisions t’attendent partout — bus, maison, école.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#64748B]">
            Clique un lieu : le téléphone montre ce que tu peux faire, même sans réseau.
          </p>
          <div className="mt-10">
            <OfflineDemo />
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-[#F0EFEE] bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Questions</p>
          <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Les questions que tu te poses vraiment
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-base font-medium text-[#64748B]">
            Pas de jargon. Si tu ne trouves pas ta réponse, écris-nous — on t’explique comme en classe.
          </p>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#1677FF_0%,#155EEF_45%,#0F766E_100%)] px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-black sm:text-4xl">Prêt à viser 10/10 ?</h2>
          <p className="mx-auto mt-3 max-w-lg text-base font-medium text-white/90">
            Collège et lycée, programme du Togo. Tes cours restent sur le téléphone — même sans internet.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="[&_span]:!bg-white [&_span]:!text-[#1677FF] [&_span]:!opacity-100 [&_a]:!bg-white [&_a]:!text-[#1677FF]">
              <StoreButtons align="center" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
