"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import StoreButtons from "./StoreButtons";
import SupportButton from "./SupportButton";

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
    <header className="sticky top-0 z-50 bg-[#0B1B3A]">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="LearnFlow — accueil">
          <BrandLogo size="nav" variant="onDark" priority />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-white/75 transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <SupportButton className="rounded-2xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#1677FF] shadow-sm transition hover:bg-[#E6F4FF]">
            Nous contacter
          </SupportButton>
          <StoreButtons compact />
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-[#0B1B3A] px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 text-base font-bold text-white"
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
            <StoreButtons />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
