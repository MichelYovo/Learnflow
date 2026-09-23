"use client";

import Spira from "@/components/Spira";
import { spiraMoodForMode } from "@/data/spira";
import type { AppMode } from "@/types/modes";

type Props = {
  mode: AppMode;
  /** Largeur de la zone mascotte (sprite ≈ 90 %) */
  size: number;
  groundColor?: string;
};

/** Props expressives autour de Spira — personnalité distinctive par mode. */
export default function ModeMascot({ mode, size, groundColor = "rgba(15,23,42,0.14)" }: Props) {
  const sprite = Math.round(size * 0.9);

  return (
    <span
      className={`lf-mode-mascot lf-mode-mascot--${mode}`}
      style={{ width: size, height: Math.round(size * 1.08) }}
      aria-hidden
    >
      {mode === "blitz" ? <BlitzProps /> : null}

      <span className="lf-mode-mascot__sprite">
        <Spira mood={spiraMoodForMode(mode)} size={sprite} message="" animated={false} interactive={false} />
      </span>

      {mode === "libre" ? <LibreProps /> : null}
      {mode === "guide" ? <GuideProps /> : null}
      {mode === "cramming" ? <CrammingProps /> : null}

      <span className="lf-mode-mascot__ground" style={{ background: groundColor }} />
    </span>
  );
}

function LibreProps() {
  return (
    <svg className="lf-mode-prop lf-mode-prop--shades" viewBox="0 0 64 28" fill="none" aria-hidden>
      <path
        d="M8 14c0-3 3-6 8-6h8c2.5 0 4 1.2 4 3v2c0 1.8-1.5 3-4 3H16c-5 0-8-1.2-8-2z"
        fill="#0F172A"
      />
      <path
        d="M36 14c0-3 3-6 8-6h8c2.5 0 4 1.2 4 3v2c0 1.8-1.5 3-4 3H44c-5 0-8-1.2-8-2z"
        fill="#0F172A"
      />
      <path d="M28 12h8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <path d="M10 10l4-4M54 10l-4-4" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="20" cy="14" rx="5" ry="3" fill="#38BDF8" opacity="0.55" />
      <ellipse cx="48" cy="14" rx="5" ry="3" fill="#38BDF8" opacity="0.55" />
    </svg>
  );
}

function GuideProps() {
  return (
    <svg className="lf-mode-prop lf-mode-prop--badge" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="16" fill="#1677FF" />
      <circle cx="20" cy="20" r="12" fill="#E6F4FF" />
      <path d="M20 10v10l7 4" stroke="#0958D9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrammingProps() {
  return (
    <>
      <svg className="lf-mode-prop lf-mode-prop--book lf-mode-prop--book-l" viewBox="0 0 28 24" fill="none" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#F59E0B" />
        <rect x="4" y="6" width="16" height="12" rx="1" fill="#FEF3C7" />
        <path d="M8 10h8M8 13h6" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="lf-mode-prop lf-mode-prop--book lf-mode-prop--book-r" viewBox="0 0 28 24" fill="none" aria-hidden>
        <rect x="4" y="3" width="20" height="16" rx="2" fill="#EF4444" />
        <rect x="6" y="5" width="16" height="12" rx="1" fill="#FEE2E2" />
        <path d="M10 9h8M10 12h5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="lf-mode-prop lf-mode-prop--sweat lf-mode-prop--sweat-1" />
      <span className="lf-mode-prop lf-mode-prop--sweat lf-mode-prop--sweat-2" />
      <span className="lf-mode-prop lf-mode-prop--sweat lf-mode-prop--sweat-3" />
    </>
  );
}

function BlitzProps() {
  return (
    <svg className="lf-mode-prop lf-mode-prop--speed" viewBox="0 0 48 56" fill="none" aria-hidden>
      <path d="M40 8H8" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
      <path d="M36 20H4" stroke="#F87171" strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
      <path d="M38 32H10" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M34 44H6" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M42 14l-6 4 6 4" fill="#FBBF24" />
    </svg>
  );
}
