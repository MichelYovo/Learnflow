"use client";

import { WEB_URL } from "../../lib/brand";
import { useLocale } from "../../lib/i18n";
import SupportButton from "./SupportButton";

export default function Faq() {
  const { t, locale } = useLocale();

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {t.faq.items.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-[var(--lf-border)] bg-[var(--lf-surface)] open:border-[var(--lf-brand-border)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-extrabold text-[var(--lf-ink)]">
            {item.q}
            <span className="text-[var(--lf-brand)] transition group-open:rotate-45">+</span>
          </summary>
          <div className="border-t border-[var(--lf-border)] px-5 py-4 text-sm font-medium leading-relaxed text-[var(--lf-muted)]">
            {item.a}
            {item.q.toLowerCase().includes("commence") || item.q.toLowerCase().includes("start") ? (
              <p className="mt-3">
                <a href={WEB_URL} className="font-extrabold text-[var(--lf-brand)] hover:underline">
                  {locale === "fr" ? "Ouvrir LearnFlow →" : "Open LearnFlow →"}
                </a>
              </p>
            ) : null}
            {item.q.toLowerCase().includes("disponible") || item.q.toLowerCase().includes("available") ? (
              <p className="mt-3">
                <SupportButton className="font-extrabold text-[var(--lf-brand)] hover:underline">
                  {t.nav.support}
                </SupportButton>
              </p>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
