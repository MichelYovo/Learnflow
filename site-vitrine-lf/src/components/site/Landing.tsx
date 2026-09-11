import Image from "next/image";
import { SUBJECTS, TIERS } from "../../lib/brand";
import ContactForm from "./ContactForm";
import Faq from "./Faq";
import HeroPhones from "./HeroPhones";
import ModeShowcase from "./ModeShowcase";
import SupportButton from "./SupportButton";
import WebCta from "./WebCta";

const BEATS = [
  {
    n: "1",
    t: "Tu crées ton profil",
    d: "Prénom, classe, matières. Si vous êtes plusieurs sur le même téléphone, chacun a le sien.",
  },
  {
    n: "2",
    t: "Tu lis le cours",
    d: "L’essentiel d’abord, les détails ensuite. Comme un cahier, mais plus clair.",
  },
  {
    n: "3",
    t: "Tu vises le 10/10",
    d: "10 questions. Il faut tout bon pour valider. Si tu rates, tu revois seulement ce qui manque.",
  },
  {
    n: "4",
    t: "Tu gagnes de l’XP",
    d: "Points, ligues, badges. Le cahier de jeu avance avec toi — sans la pression.",
  },
];

export default function Landing() {
  return (
    <main className="min-w-0">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_80%_-10%,rgba(22,119,255,.16),transparent),radial-gradient(600px_280px_at_10%_20%,rgba(16,185,129,.10),transparent)]" />
        <div className="lf-container relative grid min-w-0 items-center gap-8 pb-10 pt-8 sm:gap-10 sm:pb-12 sm:pt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:pb-16 lg:pt-14">
          <div className="min-w-0">
            <p className="inline-flex max-w-full items-center rounded-full border-2 border-white bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#0B1B3A] shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              Collège et lycée · Togo
            </p>
            <h1 className="lf-h1 mt-5 max-w-xl text-[#1C1917]">Tes cours, compris pour de vrai.</h1>
            <p className="lf-lead mt-5 max-w-lg">
              LearnFlow, c’est l’app pour réviser sans te perdre. Tu lis, tu t’entraînes, tu gagnes de l’XP — et un
              chapitre n’est validé que quand tu as <strong className="font-extrabold text-[#1C1917]">10/10</strong>.
            </p>
            <div className="mt-8">
              <WebCta />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#A8A29E]">
              <a href="#parcours" className="text-[#1677FF] hover:underline">
                Voir comment ça marche
              </a>
              {" · "}
              6e → Terminale · déjà sur le web
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
          <h2 className="lf-h2 mt-2 max-w-2xl text-[#1C1917]">Quatre étapes. Du profil au 10/10.</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BEATS.map((b) => (
              <li key={b.n}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1677FF] text-sm font-black text-white">
                  {b.n}
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-[#1C1917]">{b.t}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748B]">{b.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="regle" className="lf-section scroll-mt-24 border-t border-[#F0EFEE] bg-white">
        <div id="produit" className="lf-container max-w-3xl">
          <p className="lf-kicker">La règle du 10/10</p>
          <h2 className="lf-h2 mt-2 text-[#1C1917]">Un chapitre n’est validé que quand c’est parfait.</h2>
          <p className="lf-lead mt-4">
            Le quiz a 10 questions. Il faut 10/10 — pas 9, pas « presque ». Si tu te trompes, tu ne recommences pas
            tout : tu revois seulement les questions ratées, jusqu’à tout bon.
          </p>
        </div>
      </section>

      <section id="modes" className="lf-section scroll-mt-24">
        <div className="lf-container">
          <p className="lf-kicker">Les 4 modes</p>
          <h2 className="lf-h2 mt-2 max-w-2xl text-[#1C1917]">Un mode selon le moment — pas l’inverse.</h2>
          <p className="lf-lead mt-4 max-w-2xl">
            Libre le week-end. Guidé si tu ne sais pas par où commencer. Cramming la veille. Blitz pour un défi de 60
            secondes.
          </p>
          <div className="mt-10">
            <ModeShowcase />
          </div>
        </div>
      </section>

      <section id="ligues" className="lf-section scroll-mt-24 border-t border-[#F0EFEE] bg-white">
        <div className="lf-container">
          <p className="lf-kicker">Le cahier de jeu</p>
          <h2 className="lf-h2 mt-2 max-w-2xl text-[#1C1917]">XP, ligues, badges — comme un championnat.</h2>
          <p className="lf-lead mt-4 max-w-2xl">
            Chaque 10/10 te fait avancer. Tu montes de palier, tu débloques des badges, tu peux défier un ami en Duel
            Blitz. Tu n’es pas obligé d’y aller, et tu peux cacher ton prénom.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { v: "+XP", l: "à chaque quiz", color: "#F59E0B", bg: "#FFFBEB" },
              { v: "🔥 Streak", l: "les jours d’affilée", color: "#1677FF", bg: "#E6F4FF" },
              { v: "Blitz 60s", l: "solo ou duel", color: "#EF4444", bg: "#FEF2F2" },
            ].map((s) => (
              <div key={s.v} className="rounded-[20px] border-2 border-[#F0EFEE] px-4 py-4" style={{ background: s.bg }}>
                <p className="text-lg font-black" style={{ color: s.color }}>
                  {s.v}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#64748B]">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-end justify-center gap-6">
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
          <p className="mt-4 text-center text-sm font-semibold text-[#A8A29E]">
            Bronze → Argent → Or → Platine → Diamant
          </p>
        </div>
      </section>

      <section id="cours" className="lf-section">
        <div className="lf-container">
          <p className="lf-kicker">Tes cours</p>
          <h2 className="lf-h2 mt-2 max-w-2xl text-[#1C1917]">Le programme du Togo. L’essentiel d’abord.</h2>
          <p className="lf-lead mt-4 max-w-2xl">
            Maths · SVT · PCT (collège) · PC (lycée) · Histoire-Géo · Français · Anglais · ECM · Philosophie
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold"
                style={{ color: s.color, background: s.bg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/subjects/${s.id}.png`} alt="" className="h-4 w-4 object-contain" />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="parents" className="lf-section scroll-mt-24 border-t border-[#F0EFEE] bg-white">
        <div id="sms" className="lf-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="lf-kicker">Pour tes parents</p>
            <h2 className="lf-h2 mt-2 text-[#1C1917]">Un SMS de fierté. Rien d’autre.</h2>
            <p className="lf-lead mt-4">
              Tes parents ne voient pas tes écrans. S’ils activent l’option, ils reçoivent seulement un message quand tu
              valides un chapitre à 10/10.
            </p>
          </div>
          <div id="offline">
            <p className="lf-kicker">Sans internet</p>
            <h2 className="lf-h2 mt-2 text-[#1C1917]">Tes révisions t’attendent partout.</h2>
            <p className="lf-lead mt-4">
              Bus, maison, école. Une fois l’app ouverte, tu lis et tu t’entraînes même s’il n’y a pas de réseau.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="lf-section scroll-mt-24 border-t border-[#F0EFEE] bg-white">
        <div className="lf-container grid items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
          <div className="min-w-0">
            <p className="lf-kicker">Nous contacter</p>
            <h2 className="lf-h2 mt-2 max-w-xl text-[#1C1917]">Une question ? Écris-nous ici.</h2>
            <p className="lf-lead mt-4 max-w-lg">
              Tu laisses ton nom, ton email et ton message. Ça arrive tout de suite sur le dashboard de l’équipe
              LearnFlow.
            </p>
          </div>
          <div className="min-w-0 rounded-[28px] border-2 border-[#F0EFEE] bg-[#FAFAF9] p-4 sm:p-6">
            <ContactForm embedded />
          </div>
        </div>
      </section>

      <section id="faq" className="lf-section scroll-mt-24">
        <div className="lf-container">
          <p className="lf-kicker text-center">Questions</p>
          <h2 className="lf-h2 mt-2 text-center text-[#1C1917]">Les questions que tu te poses vraiment</h2>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      <section className="lf-container pb-16 sm:pb-20">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1677FF_0%,#155EEF_45%,#0F766E_100%)] px-5 py-10 text-center text-white sm:rounded-[32px] sm:px-8 sm:py-14">
          <h2 className="lf-h2">Prêt à viser 10/10 ?</h2>
          <p className="mx-auto mt-3 max-w-lg text-base font-medium text-white/90">
            Collège et lycée, programme du Togo. Ouvre LearnFlow sur le web, crée ton profil, et c’est parti.
          </p>
          <p className="mt-3 text-sm font-semibold text-white/80">
            Une question ?{" "}
            <SupportButton className="underline decoration-white/40 underline-offset-4 hover:text-white">
              Écrire au support
            </SupportButton>
          </p>
          <div className="mt-8 flex justify-center">
            <WebCta align="center" light />
          </div>
        </div>
      </section>
    </main>
  );
}
