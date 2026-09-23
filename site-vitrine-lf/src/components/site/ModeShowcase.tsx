"use client";

import { useLocale } from "../../lib/i18n";

export default function ModeShowcase() {
  const { t } = useLocale();

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
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
  );
}
