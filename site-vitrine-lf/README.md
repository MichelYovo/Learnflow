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

## Accès web

Le bouton **Ouvrir LearnFlow** pointe vers l’app web. Par défaut : `https://learnflow-web.vercel.app`. Pour changer :

```
NEXT_PUBLIC_WEB_URL=https://learnflow-web.vercel.app
```

Contact : bouton **Nous contacter** (formulaire) — les messages arrivent dans l’admin, page Messages.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · Poppins · assets copiés depuis `LearnFlow/mobile/assets` (logo, Spira, badges, avatars, schémas).

Les téléphones du hero sont des cadres HTML/CSS + UI fidèle à l’app. Pas d’animation de page, sauf le petit salut de Spira en bas.
