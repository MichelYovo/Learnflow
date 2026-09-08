import Link from "next/link";
import BrandLogo from "./BrandLogo";
import SupportButton from "./SupportButton";

export default function Footer() {
  return (
    <footer className="border-t border-[#F0EFEE] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <BrandLogo size="footer" variant="onLight" />
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[#64748B]">
            L’app de révision pour collégiens et lycéens du Togo. Tes cours, des quiz, et un chapitre validé seulement
            à 10/10. Même sans internet.
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
              <Link href="/#contact" className="hover:text-[#1677FF]">
                Contact
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
              <SupportButton topic="waitlist" className="hover:text-[#1677FF]">
                Liste d’attente
              </SupportButton>
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
      <div className="border-t border-[#F0EFEE] py-5 text-center text-xs font-semibold text-[#A8A29E]">
        LearnFlow Togo · Collège et lycée · Version 1.0.0
      </div>
    </footer>
  );
}
