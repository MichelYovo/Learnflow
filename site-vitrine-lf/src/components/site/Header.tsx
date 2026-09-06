"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SUPPORT_MAILTO } from "../../lib/brand";
import StoreButtons from "./StoreButtons";

const LINKS = [
  { href: "/#produit", label: "Produit" },
  { href: "/#modes", label: "Modes" },
  { href: "/#ligues", label: "Ligues" },
  { href: "/#sms", label: "SMS" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#F0EFEE]/80 bg-[#FAFAF9]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[88px] max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="LearnFlow — accueil">
          <Image
            src="/brand/logo-light.png"
            alt="LearnFlow"
            width={280}
            height={76}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-[#64748B] transition hover:text-[#1677FF]">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <StoreButtons compact />
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#F0EFEE] bg-white md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-[#1C1917] transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#1C1917] ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#1C1917] transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {open ? (
        <div className="border-t border-[#F0EFEE] bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 text-base font-bold text-[#1C1917]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a href={SUPPORT_MAILTO} className="rounded-xl px-3 py-2 text-base font-bold text-[#1677FF]">
              Support
            </a>
            <StoreButtons />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
