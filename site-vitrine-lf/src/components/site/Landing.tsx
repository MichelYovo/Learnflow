"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { SUBJECTS, TIERS } from "../../lib/brand";
import { useLocale } from "../../lib/i18n";
import ContactForm from "./ContactForm";
import Faq from "./Faq";
import SupportButton from "./SupportButton";
import WebCta from "./WebCta";

const HeroPhones = dynamic(() => import("./HeroPhones"), {
  ssr: false,
  loading: () => (
    <div
      className="mx-auto aspect-[4/5] w-full max-w-[420px] animate-pulse rounded-[2rem] bg-[var(--lf-brand-soft)]"
      aria-hidden
    />
  ),
});

export default function Landing() {
  const { t, locale } = useLocale();

  return (
    <main className="min-w-0" lang={locale}>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_80%_-10%,var(--lf-glow),transparent)]" />
        <div className="lf-container relative grid min-w-0 items-center gap-8 pb-10 pt-8 sm:gap-10 sm:pb-12 sm:pt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:pb-16 lg:pt-14">
          <div className="min-w-0">
            <p className="inline-flex max-w-full items-center rounded-full border border-[var(--lf-border)] bg-[var(--lf-surface)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--lf-ink)] shadow-[0_8px_24px_var(--lf-shadow)]">
              {t.hero.badge}
            </p>
            <h1 className="lf-h1 mt-5 max-w-xl">{t.hero.title}</h1>
            <p className="lf-lead mt-5 max-w-lg">
              {t.hero.leadBefore}
              <strong className="font-extrabold text-[var(--lf-ink)]">{t.hero.leadStrong}</strong>
              {t.hero.leadAfter}
            </p>
            <div className="mt-8">
              <WebCta />
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--lf-faint)]">
              <a href="#parcours" className="text-[var(--lf-brand)] hover:underline">
                {t.hero.seeHow}
              </a>
              {" · "}
              {t.hero.already}
            </p>
          </div>
          <div className="min-w-0">
            <HeroPhones />
          </div>
        </div>
      </section>

      <section id="parcours" className="lf-section scroll-mt-24">
        <div className="lf-container">
          <p className="lf-kicker">{t.how.kicker}</p>
          <h2 className="lf-h2 mt-2 max-w-2xl">{t.how.title}</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.how.steps.map((b, i) => (
              <li key={b.t}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--lf-brand)] text-sm font-black text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-[var(--lf-ink)]">{b.t}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--lf-muted)]">{b.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="regle" className="lf-section scroll-mt-24 border-t border-[var(--lf-border)] bg-[var(--lf-surface)]">
        <div id="produit" className="lf-container max-w-3xl">
          <p className="lf-kicker">{t.rule.kicker}</p>
          <h2 className="lf-h2 mt-2">{t.rule.title}</h2>
          <p className="lf-lead mt-4">{t.rule.lead}</p>
        </div>
      </section>

      <section id="modes" className="lf-section scroll-mt-24">
        <div className="lf-container">
          <p className="lf-kicker">{t.modes.kicker}</p>
          <h2 className="lf-h2 mt-2 max-w-2xl">{t.modes.title}</h2>
          <p className="lf-lead mt-4 max-w-2xl">{t.modes.lead}</p>
          <div className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2">
            {t.modes.items.map((m) => (
              <article
                key={m.label}
                className="rounded-[24px] border border-[var(--lf-brand-border)] bg-[var(--lf-brand-soft)] p-5 sm:p-6"
              >
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--lf-brand)]">{m.hint}</p>
                <h3 className="mt-3 text-xl font-black tracking-tight text-[var(--lf-ink)]">{m.label}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--lf-ink)]">{m.sub}</p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--lf-muted)]">{m.purpose}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ligues" className="lf-section scroll-mt-24 border-t border-[var(--lf-border)] bg-[var(--lf-surface)]">
        <div className="lf-container">
          <p className="lf-kicker">{t.leagues.kicker}</p>
          <h2 className="lf-h2 mt-2 max-w-2xl">{t.leagues.title}</h2>
          <p className="lf-lead mt-4 max-w-2xl">{t.leagues.lead}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {t.leagues.stats.map((s) => (
              <div
                key={s.v}
                className="rounded-[20px] border border-[var(--lf-border)] bg-[var(--lf-bg)] px-4 py-4"
              >
                <p className="text-lg font-black text-[var(--lf-brand)]">{s.v}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--lf-muted)]">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-end justify-center gap-6">
            {TIERS.map((tier, i) => (
              <div key={tier.id} className="flex flex-col items-center gap-2">
                <Image
                  src={tier.src}
                  alt={t.leagues.tiers[i] ?? tier.label}
                  width={i === 2 ? 88 : 64}
                  height={i === 2 ? 88 : 64}
                  sizes="88px"
                  loading="lazy"
                  className={i === 2 ? "h-[88px] w-[88px] object-contain" : "h-14 w-14 object-contain opacity-80"}
                />
                <span className="text-sm font-extrabold text-[var(--lf-ink)]">
                  {t.leagues.tiers[i] ?? tier.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm font-semibold text-[var(--lf-faint)]">{t.leagues.path}</p>
        </div>
      </section>

      <section id="cours" className="lf-section">
        <div className="lf-container">
          <p className="lf-kicker">{t.courses.kicker}</p>
          <h2 className="lf-h2 mt-2 max-w-2xl">{t.courses.title}</h2>
          <p className="lf-lead mt-4 max-w-2xl">{t.courses.lead}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lf-brand-border)] bg-[var(--lf-brand-soft)] px-3 py-1.5 text-sm font-extrabold text-[var(--lf-brand)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/icons/subjects/${s.id}.png`}
                  alt=""
                  width={16}
                  height={16}
                  loading="lazy"
                  decoding="async"
                  className="h-4 w-4 object-contain"
                />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="parents" className="lf-section scroll-mt-24 border-t border-[var(--lf-border)] bg-[var(--lf-surface)]">
        <div id="sms" className="lf-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="lf-kicker">{t.parents.kicker}</p>
            <h2 className="lf-h2 mt-2">{t.parents.title}</h2>
            <p className="lf-lead mt-4">{t.parents.lead}</p>
          </div>
          <div id="offline">
            <p className="lf-kicker">{t.offline.kicker}</p>
            <h2 className="lf-h2 mt-2">{t.offline.title}</h2>
            <p className="lf-lead mt-4">{t.offline.lead}</p>
          </div>
        </div>
      </section>

      <section id="contact" className="lf-section scroll-mt-24 border-t border-[var(--lf-border)] bg-[var(--lf-surface)]">
        <div className="lf-container grid items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
          <div className="min-w-0">
            <p className="lf-kicker">{t.contact.kicker}</p>
            <h2 className="lf-h2 mt-2 max-w-xl">{t.contact.title}</h2>
            <p className="lf-lead mt-4 max-w-lg">{t.contact.lead}</p>
          </div>
          <div className="min-w-0 rounded-[28px] border border-[var(--lf-border)] bg-[var(--lf-bg)] p-4 sm:p-6">
            <ContactForm embedded />
          </div>
        </div>
      </section>

      <section id="faq" className="lf-section scroll-mt-24">
        <div className="lf-container">
          <p className="lf-kicker text-center">{t.faq.kicker}</p>
          <h2 className="lf-h2 mt-2 text-center">{t.faq.title}</h2>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      <section className="lf-container pb-16 sm:pb-20">
        <div className="overflow-hidden rounded-[28px] bg-[var(--lf-brand)] px-5 py-10 text-center text-white sm:rounded-[32px] sm:px-8 sm:py-14">
          <h2 className="lf-h2 text-white">{t.cta.title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-base font-medium text-white/90">{t.cta.lead}</p>
          <p className="mt-3 text-sm font-semibold text-white/80">
            {t.cta.support}{" "}
            <SupportButton className="underline decoration-white/40 underline-offset-4 hover:text-white">
              {t.cta.write}
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
