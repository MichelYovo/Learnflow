"use client";

import { WEB_URL } from "../../lib/brand";
import { useLocale } from "../../lib/i18n";

type Props = { compact?: boolean; align?: "start" | "center"; light?: boolean };

export default function WebCta({ compact = false, align = "start", light = false }: Props) {
  const { t } = useLocale();
  const btn = light
    ? "bg-white text-[var(--lf-brand)] hover:bg-[var(--lf-brand-soft)]"
    : "bg-[var(--lf-brand)] text-white shadow-[0_8px_20px_var(--lf-glow)] hover:bg-[var(--lf-brand-hover)]";

  return (
    <div className={`flex min-w-0 ${align === "center" ? "justify-center" : ""}`}>
      <a
        href={WEB_URL}
        className={`inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold ${btn}`}
      >
        {compact ? t.hero.ctaCompact : t.hero.cta}
      </a>
    </div>
  );
}
