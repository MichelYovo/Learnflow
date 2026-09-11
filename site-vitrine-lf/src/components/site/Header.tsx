"use client";

import { useState } from "react";
import Link from "next/link";
import { WEB_URL } from "../../lib/brand";
import BrandLogo from "./BrandLogo";
import SupportButton from "./SupportButton";
import WebCta from "./WebCta";

const LINKS = [
  { href: "/#parcours", label: "Comment ça marche" },
  { href: "/#modes", label: "Les 4 modes" },
  { href: "/#ligues", label: "Ligues" },
  { href: "/#contact", label: "Contact" },
  { href: "/#faq", label: "Questions" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B1B3A]/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="lf-container flex h-16 min-w-0 items-center justify-between gap-3 sm:h-[72px] sm:gap-4">
        <Link href="/" className="flex min-w-0 shrink-0 items-center" aria-label="LearnFlow — accueil">
          <BrandLogo size="nav" variant="onDark" priority />
        </Link>
        <nav className="hidden min-w-0 items-center gap-3 xl:flex xl:gap-5" aria-label="Sections">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-sm font-semibold text-white/75 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden min-w-0 items-center gap-3 xl:flex">
          <SupportButton className="rounded-2xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#1677FF] shadow-sm hover:bg-[#E6F4FF]">
            Nous contacter
          </SupportButton>
          <a
            href={WEB_URL}
            className="inline-flex h-11 items-center rounded-2xl bg-[#1677FF] px-4 text-sm font-extrabold text-white hover:bg-[#155EEF]"
          >
            Ouvrir l’app
          </a>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 xl:hidden"
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-white ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {open ? (
        <div className="max-h-[min(80dvh,calc(100dvh-4.5rem))] overflow-y-auto border-t border-white/10 bg-[#0B1B3A] px-[clamp(1rem,4vw,2rem)] py-4 pb-[max(1rem,env(safe-area-inset-bottom))] xl:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2.5 text-base font-bold text-white"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <SupportButton
              className="rounded-2xl bg-white px-3 py-3 text-left text-base font-extrabold text-[#1677FF]"
              onClick={() => setOpen(false)}
            >
              Nous contacter
            </SupportButton>
            <WebCta />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
