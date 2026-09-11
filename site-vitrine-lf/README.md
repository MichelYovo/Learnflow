# Site vitrine LearnFlow

Landing de présentation de l’app **LearnFlow** (collège / lycée, programme APC Togo).

Dossier : `LearnFlow/site-vitrine-lf` (package npm : `site-vitrine-lf`).

## Lancer

```bash
cd LearnFlow/site-vitrine-lf
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

Contact : bouton **Contact** (formulaire) — les messages arrivent dans l’admin, page Messages.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · Fraunces (titres) + Poppins (texte) · assets copiés depuis `LearnFlow/mobile/assets` (logo, Spira, badges, avatars, schémas).

Les téléphones du hero sont des cadres HTML/CSS (Dynamic Island, boutons volume/power) + UI fidèle à l’app. Pas d’animation de page, sauf le petit salut de Spira en bas.
