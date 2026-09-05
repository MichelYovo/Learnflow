import Image from "next/image";
import Link from "next/link";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "../../lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-[#F0EFEE] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/brand/logo-light.png" alt="LearnFlow" width={160} height={38} className="h-9 w-auto" />
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[#64748B]">
            Application mobile d’apprentissage pour collégiens et lycéens du Togo. Programme APC, règle du 10/10,
            offline-first.
          </p>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#A8A29E]">Produit</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#1C1917]">
            <li>
              <Link href="/#modes" className="hover:text-[#1677FF]">
                Quatre modes
              </Link>
            </li>
            <li>
              <Link href="/#ligues" className="hover:text-[#1677FF]">
                Ligues
              </Link>
            </li>
            <li>
              <Link href="/#sms" className="hover:text-[#1677FF]">
                SMS de fierté
              </Link>
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
            <li>
              <a href={SUPPORT_MAILTO} className="hover:text-[#1677FF]">
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#F0EFEE] py-5 text-center text-xs font-semibold text-[#A8A29E]">
        LearnFlow Togo · APC · Version 1.0.0 · tg.learnflow.app
      </div>
    </footer>
  );
}
