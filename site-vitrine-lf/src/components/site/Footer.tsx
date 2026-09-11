import Link from "next/link";
import { WEB_URL } from "../../lib/brand";
import BrandLogo from "./BrandLogo";
import SpiraWave from "./SpiraWave";
import SupportButton from "./SupportButton";

export default function Footer() {
  return (
    <footer className="border-t border-[#F0EFEE] bg-white">
      <div className="lf-container grid gap-10 py-10 sm:py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <BrandLogo size="footer" variant="onLight" />
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[#64748B]">
            L’app de révision pour collégiens et lycéens du Togo. Tes cours, des quiz, et un chapitre validé seulement
            à 10/10.
          </p>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#A8A29E]">Sur cette page</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#1C1917]">
            <li>
              <Link href="/#parcours" className="hover:text-[#1677FF]">
                Comment ça marche
              </Link>
            </li>
            <li>
              <Link href="/#modes" className="hover:text-[#1677FF]">
                Les 4 modes
              </Link>
            </li>
            <li>
              <Link href="/#ligues" className="hover:text-[#1677FF]">
                Ligues
              </Link>
            </li>
            <li>
              <Link href="/#parents" className="hover:text-[#1677FF]">
                Parents
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-[#1677FF]">
                Questions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#A8A29E]">Contact</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#1C1917]">
            <li>
              <SupportButton className="font-extrabold text-[#1677FF] hover:underline">Nous contacter</SupportButton>
            </li>
            <li>
              <a href={WEB_URL} className="hover:text-[#1677FF]">
                Ouvrir LearnFlow
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#A8A29E]">Légal</p>
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
      <div className="border-t border-[#F0EFEE] px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-6 text-center">
        <SpiraWave />
        <p className="mt-1 pb-5 text-xs font-semibold text-[#A8A29E]">
          LearnFlow Togo · Collège et lycée · Version 1.0.0
        </p>
      </div>
    </footer>
  );
}
