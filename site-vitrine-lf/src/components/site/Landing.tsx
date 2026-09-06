import Image from "next/image";
import Phone from "../phone/Phone";
import { CourseMock, ResultMock } from "../phone/screens";
import { SPIRA_MOODS, SUBJECTS, TIERS } from "../../lib/brand";
import Faq from "./Faq";
import HeroPhones from "./HeroPhones";
import ModeShowcase from "./ModeShowcase";
import StoreButtons from "./StoreButtons";

export default function Landing() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_80%_-10%,rgba(22,119,255,.16),transparent),radial-gradient(600px_280px_at_10%_20%,rgba(16,185,129,.10),transparent)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:pb-24 lg:pt-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#BAE0FF] bg-[#E6F4FF] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#1677FF]">
              <Image src="/brand/logo-mark.png" alt="" width={18} height={18} />
              Togo · APC · Offline-first
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.1] tracking-tight text-[#1C1917] sm:text-5xl lg:text-[56px]">
              Un chapitre n’est validé qu’à 10/10.
            </h1>
            <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-[#64748B]">
              LearnFlow, l’app collège-lycée APC Togo. Fiches, flashcards, quatre modes, ligues — et Spira à tes
              côtés. Pas de survol : on vise la maîtrise.
            </p>
            <div className="mt-8">
              <StoreButtons />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#A8A29E]">
              <a href="#produit" className="text-[#1677FF] hover:underline">
                Voir comment ça marche
              </a>
              {" · "}
              6e → Terminale D · 7 matières
            </p>
          </div>
          <HeroPhones />
        </div>
      </section>

      <section id="produit" className="scroll-mt-24 border-t border-[#F0EFEE] bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">La règle</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
              Pas de survol : on vise la maîtrise.
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-[#64748B]">
              Un chapitre n’est validé que lorsqu’il est vraiment acquis. Le quizz d’assimilation (10 questions) doit
              être parfait. Premier essai parfait → badge CHALLENGER. Erreur → on reboucle uniquement sur les questions
              ratées.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                ["Sprint", "Enchaîne le Grand Quizz tout de suite — XP ×2."],
                ["Repos", "Grand Quizz verrouillé 1 h, rappel inbox si tu l’as activé."],
                ["XP honnête", "Des points seulement si le score est parfait."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3 rounded-2xl border-2 border-[#F0EFEE] bg-[#FAFAF9] p-4">
                  <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1677FF]" />
                  <div>
                    <p className="font-extrabold text-[#1C1917]">{t}</p>
                    <p className="text-sm font-medium text-[#64748B]">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <Phone glow="green" float label="Résultat 10/10">
              <ResultMock />
            </Phone>
          </div>
        </div>
      </section>

      <section id="modes" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Quatre modes</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Libre, Guidé, Cramming ou Blitz — selon le moment, jamais l’inverse.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium text-[#64748B]">
            Touche une carte : le téléphone montre l’écran correspondant.
          </p>
          <div className="mt-10">
            <ModeShowcase />
          </div>
        </div>
      </section>

      <section id="cours" className="border-t border-[#F0EFEE] bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <div className="order-2 flex justify-center lg:order-1">
            <Phone glow="green" label="Fiche de cours SVT">
              <CourseMock />
            </Phone>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#10B981]">Cours APC</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
              Matière, thème, chapitre, leçons.
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-[#64748B]">
              L’Essentiel en moins de 300 mots, En Détails selon l’APC, mots masqués, analogie de
              Spira. En SVT, cœur, ADN, neurone, synapse et rein ont un schéma 3D annoté.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
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
          </div>
        </div>
      </section>

      <section id="ligues" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#F59E0B]">Ligues et XP</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Grimpe ta ligue. La motivation, sans la pression.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium text-[#64748B]">
            Classement hebdo du groupe, gel de ligue, badges Série 7, Blitz King, Lecteur Pro, CHALLENGER.
          </p>
          <div className="mt-10 flex flex-wrap items-end justify-center gap-6">
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
        </div>
      </section>

      <section id="spira" className="border-t border-[#F0EFEE] bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Spira</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Une mascotte. Pas une IA.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium text-[#64748B]">
            Chaque écran déclare une scène. Le tuteur IA est à part : 5 requêtes cloud par jour, puis FAQ locale.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SPIRA_MOODS.map((m) => (
              <figure key={m.id} className="rounded-[20px] border-2 border-[#F0EFEE] bg-[#FAFAF9] p-4 text-center">
                <img src={`/spira/${m.id}.png`} alt={m.label} className="mx-auto h-20 w-20 object-contain" />
                <figcaption className="mt-2 text-sm font-extrabold text-[#1C1917]">{m.label}</figcaption>
                <p className="mt-1 text-[11px] font-medium leading-snug text-[#64748B]">{m.role}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="sms" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">SMS</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Un SMS de fierté. Rien d’autre.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#64748B]">
            Quand l’élève valide un chapitre à 10/10 — ou décroche le badge CHALLENGER du premier coup — LearnFlow
            peut envoyer un SMS de félicitations au parent. Pas de suivi de session, pas de notes en temps réel :
            uniquement ce moment-là. L’option se coupe dans Confidentialité.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "L’élève réussit",
                d: "10/10 au quizz d’assimilation, ou 10/10 dès le premier essai (Challenger).",
              },
              {
                n: "2",
                t: "L’app envoie un SMS",
                d: "Un message de félicitations, si l’option « SMS passif » est activée.",
              },
              {
                n: "3",
                t: "Le parent est prévenu",
                d: "Il apprend la réussite. Jamais ce que l’élève a fait minute par minute.",
              },
            ].map((s) => (
              <li key={s.n} className="rounded-[24px] border-2 border-[#F0EFEE] bg-white p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F4FF] text-sm font-black text-[#1677FF]">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-[#1C1917]">{s.t}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748B]">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="offline" className="border-t border-[#F0EFEE] bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Hors ligne</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            Tes révisions t’attendent partout — bus, maison, école.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Dans le bus", d: "Fiches et quiz sans réseau. Spira calme, pas de chrono.", s: "calme" },
              { t: "Courant coupé", d: "Tout est sur l’appareil : SQLite + profils locaux.", s: "determine" },
              { t: "À la récré", d: "Blitz 60 s et code défi WhatsApp, même en 2G.", s: "enerve" },
            ].map((c) => (
              <article key={c.t} className="rounded-[24px] border-2 border-[#F0EFEE] bg-[#FAFAF9] p-6">
                <img src={`/spira/${c.s}.png`} alt="" className="h-16 w-16 object-contain" />
                <h3 className="mt-4 text-lg font-extrabold text-[#1C1917]">{c.t}</h3>
                <p className="mt-2 text-sm font-medium text-[#64748B]">{c.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">FAQ</p>
          <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">Questions fréquentes</h2>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#1677FF_0%,#155EEF_45%,#0F766E_100%)] px-8 py-14 text-center text-white">
          <img src="/spira/joyeux.png" alt="" className="mx-auto h-24 w-24 object-contain" />
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">Prêt à viser 10/10 ?</h2>
          <p className="mx-auto mt-3 max-w-lg text-base font-medium text-white/90">
            Collège et lycée, programme APC Togo. LearnFlow tourne même hors ligne.
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
