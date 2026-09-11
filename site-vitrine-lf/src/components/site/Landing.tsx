import Image from "next/image";
import { SUBJECTS, TIERS } from "../../lib/brand";
import ContactForm from "./ContactForm";
import Faq from "./Faq";
import HeroPhones from "./HeroPhones";
import ModeShowcase from "./ModeShowcase";
import StoreButtons from "./StoreButtons";
import SupportButton from "./SupportButton";

const BEATS = [
  {
    n: "1",
    t: "Découvrir",
    d: "Tu ouvres le chapitre : l’essentiel d’abord, un vrai exemple, puis les détails.",
  },
  {
    n: "2",
    t: "Pratiquer",
    d: "Tu t’entraînes jusqu’à ce que le cours te paraisse familier — sans chrono, à ton rythme.",
  },
  {
    n: "3",
    t: "Maîtriser",
    d: "Un quiz de 10 questions. Il faut 10/10 pour valider. Pas 9. Pas « presque ».",
  },
  {
    n: "4",
    t: "Continuer",
    d: "Tu gagnes des points, tu montes en ligue, et le chapitre suivant t’attend.",
  },
];

const DIFFERENT = [
  {
    t: "La règle du 10/10",
    d: "Un chapitre n’est validé que quand c’est parfait. « Presque » ne suffit pas le jour du devoir.",
  },
  {
    t: "Le programme du Togo",
    d: "Collège et lycée, 6e → Terminale. Tes matières, tes classes, pas un catalogue générique.",
  },
  {
    t: "Cinq minutes, vraiment",
    d: "Un petit parcours par session. Assez court pour le bus, assez profond pour que ça reste.",
  },
  {
    t: "Même sans internet",
    d: "Une fois l’app installée, tes cours et tes quiz t’attendent partout — maison, école, trajet.",
  },
];

const AUDIENCE = [
  {
    t: "Collégiens et lycéens",
    d: "Pour ceux qui veulent comprendre, pas juste survoler. Quatre modes selon le moment.",
  },
  {
    t: "Parents",
    d: "Un SMS de fierté quand un chapitre est validé à 10/10. Rien d’autre. Pas de surveillance.",
  },
  {
    t: "Établissements",
    d: "Le programme APC, sur le téléphone de l’élève. Ça marche aussi quand le réseau lâche.",
  },
];

const START = [
  {
    n: "1",
    t: "Récupère l’app",
    d: "Google Play ou l’App Store. Gratuit pour les cours, les quiz et la maîtrise.",
  },
  {
    n: "2",
    t: "Crée ton profil",
    d: "Prénom, classe, matières. Si vous êtes plusieurs sur le même téléphone, chacun a le sien.",
  },
  {
    n: "3",
    t: "Vise le 10/10",
    d: "Tu lis, tu t’entraînes, tu valides. Spira est là. Un chapitre à la fois.",
  },
];

export default function Landing() {
  return (
    <main className="min-w-0">
      <section className="relative">
        <div className="lf-container grid min-w-0 items-center gap-10 pb-8 pt-10 sm:pb-12 sm:pt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-8 lg:pb-20 lg:pt-16">
          <div className="min-w-0">
            <p className="inline-flex items-center rounded-full border border-[#1C1917]/10 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#1C1917]">
              Collège et lycée · Togo
            </p>
            <h1 className="lf-h1 mt-6 max-w-xl text-[#1C1917]">
              Dix chapitres oubliés vendredi. Ou un, compris pour la vie.
            </h1>
            <p className="lf-lead mt-6 max-w-lg">
              LearnFlow t’apprend un chapitre à la fois, vraiment. Tu le lis, tu t’entraînes, tu le
              valides à 10/10 : un petit parcours par jour, et le cours est à toi.
            </p>
            <div id="telecharger" className="mt-8 scroll-mt-28">
              <StoreButtons />
            </div>
            <p className="mt-4 text-sm font-medium text-[#A39C94]">
              Gratuit. Les cours, les quiz et la règle du 10/10 le resteront.
            </p>
          </div>
          <div className="min-w-0">
            <HeroPhones />
          </div>
        </div>
      </section>

      <section id="parcours" className="lf-section scroll-mt-24">
        <div className="lf-container">
          <p className="lf-kicker">Comment ça marche</p>
          <h2 className="lf-h2 mt-3 max-w-2xl text-[#1C1917]">Quatre temps. Cinq minutes.</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {BEATS.map((b) => (
              <li key={b.n}>
                <p className="font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tight text-[#1677FF]">
                  {b.n}
                </p>
                <h3 className="mt-4 text-lg font-extrabold text-[#1C1917]">{b.t}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#5F5A55]">{b.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pourquoi" className="scroll-mt-24 bg-white py-[clamp(4.25rem,8vw,7.5rem)]">
        <div className="lf-container max-w-3xl">
          <p className="lf-kicker">Pourquoi seulement 10/10</p>
          <h2 className="lf-h2 mt-4 text-[#1C1917]">
            La plupart des apps te font enchaîner dix leçons. Vendredi, il n’en reste rien.
          </h2>
          <p className="lf-lead mt-6">
            Nous, on te donne un chapitre et le temps de vraiment le faire tien.
          </p>
          <p className="lf-lead mt-4">
            Dans un an, ce sont des centaines de chapitres que tu utilises encore — pas une pile de
            captures d’écran oubliées.
          </p>
        </div>
      </section>

      <section id="modes" className="lf-section scroll-mt-24">
        <div className="lf-container">
          <p className="lf-kicker">Les 4 modes</p>
          <h2 className="lf-h2 mt-3 max-w-2xl text-[#1C1917]">Un mode selon le moment — pas l’inverse.</h2>
          <p className="lf-lead mt-4 max-w-2xl">
            Libre le week-end. Guidé si tu ne sais pas par où commencer. Cramming la veille. Blitz
            pour un défi de 60 secondes.
          </p>
          <div className="mt-10">
            <ModeShowcase />
          </div>
        </div>
      </section>

      <section id="cours" className="scroll-mt-24 bg-white py-[clamp(4.25rem,8vw,7.5rem)]">
        <div className="lf-container">
          <p className="lf-kicker">Tes cours</p>
          <h2 className="lf-h2 mt-3 max-w-2xl text-[#1C1917]">Le programme du Togo. L’essentiel d’abord.</h2>
          <p className="lf-lead mt-4 max-w-2xl">
            Maths, SVT, PCT (collège) ou PC (lycée), Histoire-Géo, Français, Anglais, ECM, Philosophie.
            Chaque chapitre s’ouvre par un résumé court, puis les détails.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#1C1917]/8 bg-[#F6F3EE] px-3 py-1.5 text-sm font-extrabold"
                style={{ color: s.color }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/subjects/${s.id}.png`} alt="" className="h-4 w-4 object-contain" />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="lf-section">
        <div className="lf-container">
          <p className="lf-kicker">Ce qui change</p>
          <h2 className="lf-h2 mt-3 max-w-2xl text-[#1C1917]">La plupart des plateformes s’arrêtent au survol.</h2>
          <p className="lf-lead mt-4 max-w-2xl">
            LearnFlow t’aide à grandir en minutes par jour — assez pour que ça tienne le jour du
            devoir.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {DIFFERENT.map((item) => (
              <article key={item.t}>
                <h3 className="text-lg font-extrabold text-[#1C1917]">{item.t}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#5F5A55]">{item.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ligues" className="scroll-mt-24 bg-white py-[clamp(4.25rem,8vw,7.5rem)]">
        <div className="lf-container">
          <p className="lf-kicker">Ligues et points</p>
          <h2 className="lf-h2 mt-3 max-w-2xl text-[#1C1917]">Comme un championnat — sans la pression.</h2>
          <p className="lf-lead mt-4 max-w-2xl">
            Tu gagnes des points, tu montes de palier. Tu n’es pas obligé d’y aller, et tu peux cacher
            ton prénom.
          </p>
          <div className="mt-10 flex flex-wrap items-end justify-center gap-6 sm:gap-8">
            {TIERS.map((t, i) => (
              <div key={t.id} className="flex flex-col items-center gap-2">
                <Image
                  src={t.src}
                  alt={t.label}
                  width={i === 2 ? 88 : 64}
                  height={i === 2 ? 88 : 64}
                  className={i === 2 ? "h-[88px] w-[88px] object-contain" : "h-14 w-14 object-contain opacity-80"}
                />
                <span className="text-sm font-extrabold text-[#1C1917]">{t.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm font-semibold text-[#A39C94]">
            Bronze → Argent → Or → Platine → Diamant
          </p>
        </div>
      </section>

      <section id="parents" className="lf-section scroll-mt-24">
        <div id="sms" className="lf-container grid gap-12 lg:grid-cols-2">
          <div>
            <p className="lf-kicker">Pour tes parents</p>
            <h2 className="lf-h2 mt-3 text-[#1C1917]">Un SMS de fierté. Rien d’autre.</h2>
            <p className="lf-lead mt-4">
              Tes parents ne voient pas tes écrans. S’ils activent l’option, ils reçoivent seulement un
              message quand tu valides un chapitre à 10/10. Tu peux couper ça quand tu veux.
            </p>
          </div>
          <div id="offline">
            <p className="lf-kicker">Sans internet</p>
            <h2 className="lf-h2 mt-3 text-[#1C1917]">Tes révisions t’attendent partout.</h2>
            <p className="lf-lead mt-4">
              Bus, maison, école. Une fois l’app installée, tu lis et tu t’entraînes même s’il n’y a
              pas de réseau.
            </p>
          </div>
        </div>
      </section>

      <section className="scroll-mt-24 bg-white py-[clamp(4.25rem,8vw,7.5rem)]">
        <div className="lf-container">
          <p className="lf-kicker">Pour qui</p>
          <h2 className="lf-h2 mt-3 max-w-2xl text-[#1C1917]">Ceux qui veulent que ça reste.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {AUDIENCE.map((item) => (
              <article key={item.t} className="rounded-[28px] border border-[#1C1917]/8 bg-[#F6F3EE] p-6">
                <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-[#1C1917]">
                  {item.t}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[#5F5A55]">{item.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lf-section">
        <div className="lf-container">
          <p className="lf-kicker">Pour commencer</p>
          <h2 className="lf-h2 mt-3 max-w-2xl text-[#1C1917]">Trois gestes. C’est tout.</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {START.map((s) => (
              <li key={s.n}>
                <p className="font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tight text-[#1677FF]">
                  {s.n}
                </p>
                <h3 className="mt-4 text-lg font-extrabold text-[#1C1917]">{s.t}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#5F5A55]">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-white py-[clamp(4.25rem,8vw,7.5rem)]">
        <div className="lf-container grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
          <div className="min-w-0">
            <p className="lf-kicker">Nous contacter</p>
            <h2 className="lf-h2 mt-3 max-w-xl text-[#1C1917]">Une question ? Écris-nous ici.</h2>
            <p className="lf-lead mt-4 max-w-lg">
              Pas besoin d’ouvrir ta boîte mail. Tu laisses ton nom, ton email et ton message. Ça
              arrive tout de suite sur le dashboard de l’équipe LearnFlow.
            </p>
          </div>
          <div className="min-w-0 rounded-[28px] border border-[#1C1917]/8 bg-[#F6F3EE] p-4 sm:p-6">
            <ContactForm embedded />
          </div>
        </div>
      </section>

      <section id="faq" className="lf-section scroll-mt-24">
        <div className="lf-container">
          <p className="lf-kicker text-center">Questions</p>
          <h2 className="lf-h2 mt-3 text-center text-[#1C1917]">Une question ? On est là.</h2>
          <div className="mt-12">
            <Faq />
          </div>
        </div>
      </section>

      <section className="lf-container pb-16 sm:pb-20">
        <div className="rounded-[32px] bg-[#1C1917] px-5 py-12 text-center text-white sm:px-10 sm:py-16">
          <h2 className="lf-h2">Commence l’habitude. Garde le cours.</h2>
          <p className="mx-auto mt-4 max-w-lg text-base font-medium text-white/75">
            Ça prend cinq minutes. Ça reste pour les devoirs.
          </p>
          <p className="mt-3 text-sm font-semibold text-white/55">
            Une question ?{" "}
            <SupportButton className="underline decoration-white/30 underline-offset-4 hover:text-white">
              Écrire au support
            </SupportButton>
          </p>
          <div className="mt-8 flex justify-center">
            <StoreButtons align="center" light />
          </div>
        </div>
      </section>
    </main>
  );
}
