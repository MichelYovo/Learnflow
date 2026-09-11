# LearnFlow Web

Version web élève de LearnFlow — collège et lycée, programme **APC Togo**.  
Fiches, flashcards, quiz 10/10, quatre modes de révision, ligues et Spira.

Même produit que l’app mobile (`LearnFlow/mobile`), adaptée au navigateur : **Next.js 16 · React 19 · Tailwind 4 · Zustand**.

## Lancer

Prérequis : Node.js 20+, npm.

```bash
cd LearnFlow/learnflow-web
npm install
npm run dev
```

Ouvre [http://localhost:3002](http://localhost:3002).

```bash
npm run build
npm start
```

## Vercel

Projet Vercel **learnflow-web** : **Settings → General → Root Directory** = `learnflow-web` (pas la racine du repo, sinon Vercel prend l’app Expo).

Variables : `NEXT_PUBLIC_SITE_URL=https://learnflow-web.vercel.app`, plus les clés Supabase / mail (voir `supabase/README.md`).

## Connexion

Inscription ou connexion **Google** (ou email). Après le choix du compte, un **code à 6 chiffres** part sur l’email. Si le profil existe déjà, l’élève entre sans redonner son numéro. Premier compte : classe (numéro parent facultatif). Le compte est enregistré dans Supabase (`student_profiles`, `league_scores`, activité).

Les alertes « connecté à LearnFlow » (email) et WhatsApp parents passent par `/api/auth/secure` — voir `supabase/README.md` (clés `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`).

## Parcours

1. Onboarding → splash → inscription / Google  
2. Mode concentration  
3. Accueil, Cours (matière → thème → chapitre → leçons), Ligues, Profil  
4. Agenda (révisions + emploi du temps)  
5. Modes Libre / Guidé / Cramming / Blitz 60s  
6. Fiches (Essentiel / Détails, mots masqués, analogie Spira)  
7. Quiz d’assimilation 10/10, Grand Quizz sprint ×2, flashcards (algo des J), textes à trous  
8. Schémas 2D (digestion) et 3D annotés (cœur, ADN, neurone, synapse, rein)  
9. Tuteur FAQ + quota cloud 5/jour, espace parent (sas maths)

## Identifiants

Support : [support@learnflow.tg](mailto:support@learnflow.tg)
