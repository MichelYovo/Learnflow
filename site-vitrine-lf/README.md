# Site vitrine LearnFlow

Landing de présentation de l’app **LearnFlow** (collège / lycée, programme APC Togo), avec mockups téléphone custom.

Dossier : `LearnFlow/Site-vitrine-Lf` (package npm : `site-vitrine-lf`).

## Lancer

```bash
cd LearnFlow/Site-vitrine-Lf
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Stores

Par défaut les boutons Android / iPhone sont en « bientôt ». Pour les activer, crée un `.env.local` :

```
NEXT_PUBLIC_PLAY_URL=https://play.google.com/store/apps/details?id=tg.learnflow.app
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/idXXXXXXXX
```

Liste d’attente : `support@learnflow.tg`.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · police Poppins · assets copiés depuis `LearnFlow/assets` (logo, Spira, badges, avatars, schémas).

Les téléphones sont des cadres HTML/CSS (Dynamic Island, boutons volume/power, glare) + UI fidèle à l’app (accueil, quiz 10/10, ligues, Blitz, fiche SVT, sas parent).
