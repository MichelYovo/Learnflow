# LearnFlow Admin

Back-office Next.js de l’**administrateur unique** LearnFlow.  
Dossier : `LearnFlow/admin` · port **3001** (le site vitrine reste sur 3000).

Ce n’est pas un espace élèves : pas d’inscription, un seul identifiant.

## Identifiants

| | |
|---|---|
Les identifiants sont uniquement dans `admin/.env.local` (et les variables d’environnement Vercel en production) : `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`. Ne jamais les committer.

Dans `.env.local`, mets le mot de passe entre guillemets si tu utilises `#` : sinon il est lu comme un commentaire.

## Lancer

```bash
cd LearnFlow/admin
npm install
npm run dev
```

Ouvre [http://localhost:3001](http://localhost:3001).

## Vercel

Si tu déploies l’admin : **Root Directory** = `admin`. Variables : `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, plus les clés Supabase.

```bash
npm run build
npm start
```

## Stack

Même protocole que le site vitrine : Next.js App Router · TypeScript · Tailwind CSS 4 · Poppins · palette `#1677FF`.

Auth : email + mot de passe, session cookie HTTP-only signée (HMAC).  
Données élèves / ligues : lecture du même projet **Supabase** que l’app (`student_profiles`, `league_scores`, `activity_events`). Sans cloud, le tableau reste vide — plus de jeu de démo.

## Cloud (optionnel)

Dans `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SECRET_KEY=sb_secret_...
```

La clé secrète reste côté serveur. Ne jamais la préfixer `NEXT_PUBLIC_`.
