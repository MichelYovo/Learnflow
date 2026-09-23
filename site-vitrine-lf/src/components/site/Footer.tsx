"use client";

import Link from "next/link";
import { WEB_URL } from "../../lib/brand";
import { useLocale } from "../../lib/i18n";
import BrandLogo from "./BrandLogo";
import SpiraWave from "./SpiraWave";
import SupportButton from "./SupportButton";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-[var(--lf-border)] bg-[var(--lf-surface)]">
      <div className="lf-container grid gap-10 py-10 sm:py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <BrandLogo size="footer" variant="onLight" />
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[var(--lf-muted)]">{t.footer.blurb}</p>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--lf-faint)]">{t.footer.onPage}</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--lf-ink)]">
            <li>
              <Link href="/#parcours" className="hover:text-[var(--lf-brand)]">
                {t.nav.how}
              </Link>
            </li>
            <li>
              <Link href="/#modes" className="hover:text-[var(--lf-brand)]">
                {t.nav.modes}
              </Link>
            </li>
            <li>
              <Link href="/#ligues" className="hover:text-[var(--lf-brand)]">
                {t.nav.leagues}
              </Link>
            </li>
            <li>
              <Link href="/#parents" className="hover:text-[var(--lf-brand)]">
                {t.footer.parents}
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-[var(--lf-brand)]">
                {t.nav.faq}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--lf-faint)]">{t.footer.contact}</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--lf-ink)]">
            <li>
              <SupportButton className="font-extrabold text-[var(--lf-brand)] hover:underline">
                {t.nav.support}
              </SupportButton>
            </li>
            <li>
              <a href={WEB_URL} className="hover:text-[var(--lf-brand)]">
                {t.footer.open}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--lf-faint)]">{t.footer.legal}</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--lf-ink)]">
            <li>
              <Link href="/confidentialite" className="hover:text-[var(--lf-brand)]">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-[var(--lf-brand)]">
                {t.footer.mentions}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--lf-border)] px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-6 text-center">
        <SpiraWave />
        <p className="mt-1 pb-5 text-xs font-semibold text-[var(--lf-faint)]">{t.footer.copy}</p>
      </div>
    </footer>
  );
}
