import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/site/Footer";
import Header from "../../components/site/Header";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Politique de confidentialité LearnFlow — offline-first, données élève sur l’appareil.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <article className="mx-auto max-w-3xl flex-1 px-5 py-14">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Légal</p>
        <h1 className="mt-2 text-4xl font-black text-[#1C1917]">Confidentialité</h1>
        <p className="mt-4 text-sm font-semibold text-[#A8A29E]">LearnFlow Togo · Version 1.0.0</p>
        <div className="mt-8 space-y-6 text-base font-medium leading-relaxed text-[#475569]">
          <p>
            Tes données élève restent <strong className="text-[#1C1917]">offline-first</strong> sur l’appareil. Les
            profils multi-élèves sont stockés localement. Tu contrôles ce qui peut être partagé.
          </p>
          <h2 className="text-xl font-extrabold text-[#1C1917]">Ce qui reste sur le téléphone</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Profils, PIN (empreinte SHA-256 locale), progression, flashcards, agenda, inbox</li>
            <li>Sessions d’étude et cache de ligue (SQLite)</li>
          </ul>
          <h2 className="text-xl font-extrabold text-[#1C1917]">Ce que tu peux activer</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Profil visible en ligue (prénom dans le classement du groupe)</li>
            <li>Partage de score Blitz (texte WhatsApp)</li>
            <li>SMS parent passif : félicitations uniquement (10/10, Challenger) — jamais de surveillance</li>
            <li>Analytique anonyme, sans contenu de cours</li>
          </ul>
          <h2 className="text-xl font-extrabold text-[#1C1917]">Cloud optionnel</h2>
          <p>
            Sans configuration Supabase, l’app tourne entièrement en local. Avec cloud, seuls les profils et scores de
            ligue nécessaires à la sync sont envoyés. En mode démo, aucun mot de passe n’est envoyé hors appareil.
          </p>
          <h2 className="text-xl font-extrabold text-[#1C1917]">Contact</h2>
          <p>
            Questions :{" "}
            <a className="font-extrabold text-[#1677FF]" href="mailto:support@learnflow.tg">
              support@learnflow.tg
            </a>
          </p>
        </div>
        <Link href="/" className="mt-10 inline-block font-extrabold text-[#1677FF]">
          ← Retour au site
        </Link>
      </article>
      <Footer />
    </>
  );
}
