import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/site/Footer";
import Header from "../../components/site/Header";
import SupportButton from "../../components/site/SupportButton";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site vitrine LearnFlow.",
};

export default function LegalPage() {
  return (
    <>
      <Header />
      <article className="mx-auto max-w-3xl flex-1 px-5 py-14">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#1677FF]">Légal</p>
        <h1 className="mt-2 text-4xl font-black text-[#1C1917]">Mentions légales</h1>
        <div className="mt-8 space-y-6 text-base font-medium leading-relaxed text-[#475569]">
          <p>
            <strong className="text-[#1C1917]">LearnFlow</strong> est une application mobile d’apprentissage pour
            collégiens et lycéens (programme APC Togo). Identifiant : <code>tg.learnflow.app</code>. Version 1.0.0.
          </p>
          <p>
            Éditeur du site vitrine : LearnFlow Togo. Contact :{" "}
            <SupportButton className="font-extrabold text-[#1677FF]">formulaire de support</SupportButton>
            .
          </p>
          <p>
            Ce site présente le produit. Il ne collecte pas de comptes élèves. Les boutons de téléchargement stores
            s’activent uniquement lorsque les URLs publiques sont configurées.
          </p>
          <p>
            Marque, logo, mascotte Spira et captures d’interface : LearnFlow. Icônes de navigation de l’app : Icons8.
          </p>
          <p>Hébergement : selon le déploiement choisi (à renseigner lors de la mise en ligne).</p>
        </div>
        <Link href="/" className="mt-10 inline-block font-extrabold text-[#1677FF]">
          ← Retour au site
        </Link>
      </article>
      <Footer />
    </>
  );
}
