# LearnFlow Admin

Back-office Next.js de l’**administrateur unique** LearnFlow.  
Dossier : `LearnFlow/admin` · port **3001** (le site vitrine reste sur 3000).

Ce n’est pas un espace élèves : pas d’inscription, un seul identifiant.

## Identifiants

| | |
|---|---|
| Email | `admin@learnflow.tg` |
| Mot de passe | `Spira#Admin-Togo26` |

Dans `.env.local`, le mot de passe est entre guillemets (`ADMIN_PASSWORD="..."`) : le caractère `#` serait sinon lu comme un commentaire.

À changer en production dans `.env.local` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`).

## Lancer

```bash
cd LearnFlow/admin
npm install
npm run dev
```

Ouvre [http://localhost:3001](http://localhost:3001).

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
