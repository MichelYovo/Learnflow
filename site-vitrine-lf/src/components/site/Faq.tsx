const ITEMS = [
  {
    q: "Ça marche vraiment sans internet ?",
    a: "Oui. LearnFlow est offline-first : cours, fiches, quiz, flashcards et ligue (cache local) restent disponibles dans le bus, à la maison ou à l’école. La sync cloud (ligue, profils) est optionnelle.",
  },
  {
    q: "C’est quel programme ?",
    a: "Le programme APC Togo, collège et lycée : 6e jusqu’à Terminale D. Mathématiques, SVT, Physique-Chimie, Histoire-Géo, Français, Anglais et EDHC. Les cours affichés dépendent de la classe.",
  },
  {
    q: "Pourquoi 10/10 ?",
    a: "Un chapitre n’est validé que lorsqu’il est vraiment acquis. Le quizz d’assimilation (10 questions) doit être parfait pour débloquer le Grand Quizz. En cas d’erreur, on reboucle uniquement sur les questions ratées.",
  },
  {
    q: "Spira, c’est l’intelligence artificielle ?",
    a: "Non. Spira est la mascotte : une scène et une humeur par écran. Le tuteur IA est un canal distinct, avec 5 requêtes cloud par jour, puis une FAQ locale.",
  },
  {
    q: "Plusieurs élèves sur le même téléphone ?",
    a: "Oui. Profils multiples, déverrouillage par PIN à 4 chiffres stocké localement (jamais envoyé hors appareil en mode démo).",
  },
  {
    q: "À quoi sert le SMS ?",
    a: "Si l’option est activée, LearnFlow envoie un SMS de félicitations au parent uniquement après un 10/10 ou un badge CHALLENGER. Jamais de surveillance de session, jamais de notes en temps réel. Ça se coupe dans Confidentialité.",
  },
  {
    q: "Les ligues, c’est obligatoire ?",
    a: "Non. C’est de la motivation, sans la pression : classement hebdo du groupe, paliers Bronze → Diamant, gel de ligue, et tu contrôles la visibilité de ton prénom.",
  },
  {
    q: "Où télécharger l’app ?",
    a: "LearnFlow 1.0.0 est une app Expo (Android / iOS). Les boutons stores s’activeront dès que les liens publics seront en ligne. Tu peux écrire à support@learnflow.tg pour la liste d’attente.",
  },
];

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {ITEMS.map((item) => (
        <details
          key={item.q}
          className="group rounded-[20px] border-2 border-[#F0EFEE] bg-white px-5 py-4 open:border-[#BAE0FF]"
        >
          <summary className="cursor-pointer list-none text-base font-extrabold text-[#1C1917] marker:content-none">
            <span className="flex items-center justify-between gap-4">
              {item.q}
              <span className="text-[#1677FF] transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-3 text-sm font-medium leading-relaxed text-[#64748B]">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
