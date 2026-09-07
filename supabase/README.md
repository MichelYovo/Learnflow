# Guide : brancher Google + Supabase (LearnFlow)

Tu as **3 comptes** à relier : Google, Supabase, et LearnFlow (web / mobile / admin).  
Suis les étapes **dans l’ordre**. À la fin, « Continuer avec Google » ouvre le vrai choix de compte.

---

## Ce dont tu as besoin

- Un projet [Supabase](https://supabase.com/dashboard) (gratuit)
- Un projet [Google Cloud](https://console.cloud.google.com/) (gratuit)
- 10–15 minutes

Tu vas copier **4 valeurs** :

| Nom | Où la prendre | Où la coller |
|---|---|---|
| URL du projet | Supabase → Settings → API | web, mobile, admin |
| Clé `anon` | Supabase → Settings → API | web, mobile, admin |
| Clé `service_role` | Supabase → Settings → API | **admin seulement** |
| Client ID + Secret Google | Google Cloud → Credentials | Supabase → Auth → Google |

Ne commite jamais ces clés dans Git.

---

## Étape 1 — Créer (ou ouvrir) le projet Supabase

1. Va sur [https://supabase.com/dashboard](https://supabase.com/dashboard) et connecte-toi.
2. Ouvre ton projet LearnFlow (ou **New project**).
3. En haut à gauche, note l’URL du projet. Elle ressemble à :

   `https://abcdefghijk.supabase.co`

   → c’est `xxxx` dans les exemples plus bas.

---

## Étape 2 — Lancer le SQL (tables élèves + activité)

1. Dans le menu gauche : **SQL Editor**.
2. Clique **New query**.
3. Ouvre le fichier du repo `supabase/schema.sql`.
4. **Sélectionne tout** (Ctrl+A), copie, colle dans l’éditeur Supabase.
5. Clique **Run** (en bas à droite).

**OK si tu vois** : `Success. No rows returned` (ou un bandeau vert).

Si tu as encore `uuid = text`, tu n’as pas collé la **dernière** version de `schema.sql`. Reprend le fichier du projet, colle à nouveau, Run.

Pour vérifier : menu **Table Editor** → tu dois voir au moins :

- `student_profiles` (avec colonne `progress`)
- `league_scores`
- `activity_events`

---

## Étape 3 — Google Cloud : écran de consentement + identifiants

### 3a. Écran de consentement OAuth (une fois)

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Choisis (ou crée) un projet, ex. `LearnFlow`.
3. Menu **APIs & Services** → **OAuth consent screen**.
4. Type **External** → Create.
5. App name : `LearnFlow`  
   User support email : ton Gmail  
   Developer contact : le même.
6. Save and Continue jusqu’à la fin.  
   En mode **Testing**, ajoute ton Gmail dans **Test users**, sinon Google bloque la connexion.

### 3b. Créer le Client OAuth « Web »

1. **APIs & Services** → **Credentials**.
2. **+ Create credentials** → **OAuth client ID**.
3. Application type : **Web application**.
4. Name : `LearnFlow Web`.

**Authorized JavaScript origins** — clique **Add URI**, une ligne par URL :

```
http://localhost:3002
https://learnflow-web.vercel.app
```

Ajoute aussi l’URL Supabase (remplace `xxxx`) :

```
https://xxxx.supabase.co
```

**Authorized redirect URIs** — **une seule** suffit pour Google → Supabase :

```
https://xxxx.supabase.co/auth/v1/callback
```

(`xxxx` = le même nom que dans l’URL Supabase, sans rien changer après.)

5. **Create**.
6. Une popup affiche :
   - **Client ID** (se termine souvent par `.apps.googleusercontent.com`)
   - **Client secret**
7. Copie les deux dans un bloc-notes (tu les colles à l’étape 4).

---

## Étape 4 — Activer Google dans Supabase

1. Retour dashboard Supabase.
2. Menu **Authentication** → **Sign In / Providers** (parfois **Providers**).
3. Clique **Google**.
4. Active **Enable Sign in with Google**.
5. Colle :
   - **Client ID** Google
   - **Client Secret** Google
6. **Save**.

### URLs de redirection LearnFlow (toujours dans Auth)

1. **Authentication** → **URL Configuration**.
2. **Site URL** (local) : `http://localhost:3002`
3. **Redirect URLs** — **Add URL** pour chacune :

```
http://localhost:3002/auth/callback
https://learnflow-web.vercel.app/auth/callback
learnflow://auth/callback
```

La ligne `learnflow://…` sert à l’app mobile Expo.

---

## Étape 5 — Copier l’URL et les clés (le plus simple)

Tu as **3 choses** à copier. Ce n’est pas Google : ce sont les clés **Supabase**.

### 5a. Où cliquer

Dans Supabase, en bas à gauche : **Project Settings** (engrenage).

Deux présentations possibles — prends celle que tu vois.

**Écran A — « API Keys »** (nouveau)

1. Menu **API Keys**.
2. Ou le bouton **Connect** en haut du projet : il affiche déjà l’URL + une clé publique.

**Écran B — « API »** (ancien)

1. Menu **API**.
2. En haut : **Project URL**.
3. Plus bas : tableau **Project API keys**.

### 5b. Les 3 tiroirs

1. **L’adresse du projet** — une URL `https://….supabase.co`  
   → collée partout, sous le nom `…_SUPABASE_URL`.

2. **La clé publique** (élève : web + téléphone)  
   À l’écran : `anon` / `public` / `legacy anon`, **ou** **Publishable key** (`sb_publishable_…`).  
   → web + mobile seulement. C’est une clé « visible » : elle n’ouvre que ce que tes règles RLS autorisent.

3. **La clé secrète admin** (dashboard LearnFlow admin)  
   À l’écran : `service_role`, **ou** **Secret key** (`sb_secret_…`).  
   → uniquement `admin/.env.local` sous le nom `SUPABASE_SECRET_KEY`.  
   Elle lit **tous** les élèves. Jamais dans `learnflow-web` ni `mobile`.

Pour `service_role` : clique l’œil **Reveal**, puis **Copy**. Ignore la ligne **JWT Secret**.

### 5c. Reconnaître ce que tu as copié

| Ça commence par… | C’est… | Tu colles où |
|---|---|---|
| `https://` … `.supabase.co` | l’URL | web + mobile + admin (`…_SUPABASE_URL`) |
| `eyJ…` avec le libellé **anon** / **public** | clé publique (ancienne) | web + mobile (`…_ANON_KEY`) |
| `sb_publishable_…` | clé publique (nouvelle) | web + mobile (même `…_ANON_KEY`) |
| `eyJ…` avec le libellé **service_role** | clé secrète (ancienne) | admin (`SUPABASE_SECRET_KEY`) |
| `sb_secret_…` | clé secrète (nouvelle) | admin (`SUPABASE_SECRET_KEY`) |

---

## Étape 6 — Fichiers `.env` dans le projet

Crée ces fichiers **à la main** (ils ne sont pas git).

### A. Web élève — `learnflow-web/.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

Puis **redémarre** `npm run dev` dans `learnflow-web` (port 3002).

### B. Mobile — `mobile/.env`

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Puis **redémarre** Expo (`npm start` dans `mobile`).

### C. Admin — `admin/.env.local`

Garde `ADMIN_EMAIL` / `ADMIN_PASSWORD` déjà là, et ajoute :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

`SUPABASE_SECRET_KEY` = la clé secrète (`service_role` ou `sb_secret_…`), **pas** la clé `anon`.

Redémarre `npm run dev` dans `admin` (port 3001).

### D. Production web (Vercel)

1. [Vercel](https://vercel.com) → projet **learnflow-web** → **Settings** → **Environment Variables**.
2. Ajoute les 3 variables du web, avec  
   `NEXT_PUBLIC_SITE_URL=https://learnflow-web.vercel.app`
3. **Redeploy**.

---

## Étape 6b — Activer l’email (code à 6 chiffres)

Sans ça, Google connecte tout de suite et le code n’arrive pas.

1. Supabase → **Authentication** → **Providers** → **Email** → **Enable**.
2. **Authentication** → **Email Templates** → **Magic Link**.
3. Dans le mail, garde bien `{{ .Token }}` (c’est le code à 6 chiffres).
4. Tu peux désactiver **Confirm email** : le code OTP suffit déjà à vérifier l’adresse.

Après Google **ou** email + mot de passe, LearnFlow envoie ce code, puis ouvre l’app.

---

## Étape 7 — Tester

1. Web : `http://localhost:3002` → Connexion → **Continuer avec Google**.
2. Google doit demander **quel compte** utiliser (même si tu es déjà connecté).
3. Ensuite : écran **Vérification** — un code à 6 chiffres arrive sur l’email Google.
4. Premier compte : écran **classe + numéro parent (+228)**.
5. L’élève démarre en **ligue Bronze**, stats à **0**, cours de sa classe sans progression.
6. Admin `http://localhost:3001` : l’élève et l’activité apparaissent (source « Supabase »).

---

## Si ça bloque

| Message / symptôme | Cause fréquente |
|---|---|
| « Google n’est pas encore configuré » | `.env.local` web manquant, ou serveur pas redémarré |
| Redirect mismatch / `redirect_uri_mismatch` | L’URI `https://xxxx.supabase.co/auth/v1/callback` n’est pas dans Google Cloud |
| Écran Google « app not verified » / accès bloqué | Ajoute ton Gmail en **Test user** (étape 3a) |
| SQL `uuid = text` | Ancien `schema.sql` — relance la version actuelle |
| Admin toujours en « démo locale » | `SUPABASE_SECRET_KEY` absente ou pas redémarré |
| Mobile : rien ne s’ouvre | `learnflow://auth/callback` manquant dans Supabase Redirect URLs |

Tu n’as **pas** besoin de Client ID Android/iOS pour tester Expo avec le flux Web actuel.
