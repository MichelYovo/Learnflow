"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import StoreButtons from "./StoreButtons";
import SupportButton from "./SupportButton";

const LINKS = [
  { href: "/#parcours", label: "Comment ça marche" },
  { href: "/#pourquoi", label: "Pourquoi" },
  { href: "/#modes", label: "Modes" },
  { href: "/#parents", label: "Parents" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1C1917]/8 bg-[#F6F3EE]/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="lf-container flex h-16 min-w-0 items-center justify-between gap-3 sm:h-[70px] sm:gap-4">
        <Link href="/" className="flex min-w-0 shrink-0 items-center" aria-label="LearnFlow — accueil">
          <BrandLogo size="nav" variant="onLight" priority />
        </Link>
        <nav className="hidden min-w-0 items-center gap-1 lg:flex xl:gap-2" aria-label="Sections">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold text-[#5F5A55] hover:text-[#1C1917]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden min-w-0 items-center gap-2 lg:flex">
          <SupportButton className="rounded-full px-3 py-2 text-[13px] font-semibold text-[#5F5A55] hover:text-[#1C1917]">
            Contact
          </SupportButton>
          <a
            href="#telecharger"
            className="inline-flex h-10 items-center rounded-full bg-[#1C1917] px-4 text-[13px] font-extrabold text-white hover:bg-black"
          >
            Télécharger
          </a>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#1C1917]/12 bg-white lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-[#1C1917] ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#1C1917] ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#1C1917] ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {open ? (
        <div className="max-h-[min(80dvh,calc(100dvh-4.5rem))] overflow-y-auto border-t border-[#1C1917]/8 bg-[#F6F3EE] px-[clamp(1rem,4vw,2rem)] py-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2.5 text-base font-bold text-[#1C1917]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <SupportButton
              className="rounded-xl px-3 py-2.5 text-left text-base font-bold text-[#1C1917]"
              onClick={() => setOpen(false)}
            >
              Nous contacter
            </SupportButton>
            <div className="pt-3">
              <StoreButtons />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
