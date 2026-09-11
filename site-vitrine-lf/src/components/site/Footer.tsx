import Link from "next/link";
import BrandLogo from "./BrandLogo";
import SpiraWave from "./SpiraWave";
import SupportButton from "./SupportButton";

export default function Footer() {
  return (
    <footer className="border-t border-[#1C1917]/8 bg-[#F6F3EE]">
      <div className="lf-container grid gap-10 py-12 sm:py-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <BrandLogo size="footer" variant="onLight" />
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[#5F5A55]">
            Pour les collégiens et lycéens qui veulent être vraiment bons dans leurs cours.
          </p>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#A39C94]">Sur cette page</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#1C1917]">
            <li>
              <Link href="/#parcours" className="hover:text-[#1677FF]">
                Comment ça marche
              </Link>
            </li>
            <li>
              <Link href="/#pourquoi" className="hover:text-[#1677FF]">
                Pourquoi
              </Link>
            </li>
            <li>
              <Link href="/#modes" className="hover:text-[#1677FF]">
                Modes
              </Link>
            </li>
            <li>
              <Link href="/#parents" className="hover:text-[#1677FF]">
                Parents
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-[#1677FF]">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#A39C94]">Contact</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#1C1917]">
            <li>
              <SupportButton className="font-extrabold text-[#1677FF] hover:underline">Nous contacter</SupportButton>
            </li>
            <li>
              <SupportButton topic="waitlist" className="hover:text-[#1677FF]">
                Liste d’attente
              </SupportButton>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#A39C94]">Légal</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#1C1917]">
            <li>
              <Link href="/confidentialite" className="hover:text-[#1677FF]">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-[#1677FF]">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#1C1917]/8 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-6 text-center">
        <SpiraWave />
        <p className="mt-1 pb-5 text-xs font-semibold text-[#A39C94]">
          LearnFlow © 2026 · Fait pour les collégiens et lycéens du Togo.
        </p>
      </div>
    </footer>
  );
}
