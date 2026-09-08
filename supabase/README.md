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
- `email_challenges` (codes 2FA hashés)
- `login_notices` (alertes email / WhatsApp)

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

3. **La clé secrète** (`service_role` ou `sb_secret_…`)  
   → `admin/.env.local` **et** `learnflow-web/.env.local` (serveur seulement, jamais `NEXT_PUBLIC_`).  
   L’admin lit tous les élèves ; le web élève s’en sert pour hasher les codes 2FA. Jamais dans `mobile`.

Pour `service_role` : clique l’œil **Reveal**, puis **Copy**. Ignore la ligne **JWT Secret**.

### 5c. Reconnaître ce que tu as copié

| Ça commence par… | C’est… | Tu colles où |
|---|---|---|
| `https://` … `.supabase.co` | l’URL | web + mobile + admin (`…_SUPABASE_URL`) |
| `eyJ…` avec le libellé **anon** / **public** | clé publique (ancienne) | web + mobile (`…_ANON_KEY`) |
| `sb_publishable_…` | clé publique (nouvelle) | web + mobile (même `…_ANON_KEY`) |
| `eyJ…` avec le libellé **service_role** | clé secrète (ancienne) | admin + web serveur (`SUPABASE_SECRET_KEY`) |
| `sb_secret_…` | clé secrète (nouvelle) | admin + web serveur (`SUPABASE_SECRET_KEY`) |

---

## Étape 6 — Fichiers `.env` dans le projet

Crée ces fichiers **à la main** (ils ne sont pas git).

### A. Web élève — `learnflow-web/.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3002
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_...
RESEND_FROM=LearnFlow <noreply@ton-domaine.tg>
OTP_PEPPER=une-chaine-secrete-longue
```

Puis **redémarre** `npm run dev` dans `learnflow-web` (port 3002).

### B. Mobile — `mobile/.env`

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_LEARNFLOW_API_URL=http://localhost:3002
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

`SUPABASE_SECRET_KEY` = la clé secrète (`service_role` ou `sb_secret_…`). Le web élève en a besoin **côté serveur** pour hasher les codes 2FA. L’admin l’utilise aussi pour lire tous les élèves. Jamais dans `mobile` ni en `NEXT_PUBLIC_`.

Redémarre `npm run dev` dans `admin` (port 3001).

### D. Production web (Vercel)

1. [Vercel](https://vercel.com) → projet **learnflow-web** → **Settings** → **Environment Variables**.
2. Ajoute les variables du web (URL, clé publique, `SUPABASE_SECRET_KEY`, Resend), avec  
   `NEXT_PUBLIC_SITE_URL=https://learnflow-web.vercel.app`
3. **Redeploy**.

---

## Étape 6b — Authentification type Jumia (code à 6 chiffres, pas de lien)

Après Google ou un mot de passe, **LearnFlow génère lui-même un code aléatoire à 6 chiffres** et l’envoie par email. L’élève le tape dans l’app pour confirmer que c’est bien lui.

**On n’envoie pas de mail « clique ici pour te connecter ».** Ce genre de lien ressemble à du spam / hameçonnage. Le mail LearnFlow contient **uniquement le code**, sans bouton et sans URL.

On ne redemande plus le numéro de téléphone pour entrer : si le profil existe déjà (classe renseignée), ça passe après le code.

### 1. Envoi du code (Gmail, pas besoin de domaine)

Sans nom de domaine, LearnFlow envoie le code **avec ton Gmail**.

1. Ouvre [Google — mots de passe des applications](https://myaccount.google.com/apppasswords) (la validation en 2 étapes doit être activée).
2. Nom : `LearnFlow` → Créer. Google affiche **16 lettres**.
3. Dans `learnflow-web/.env.local` (et Vercel → Environment Variables) :

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=ton.gmail@gmail.com
SMTP_PASS=xxxxxxxxxxxxxxxx
SMTP_FROM=LearnFlow <ton.gmail@gmail.com>
```

`SMTP_PASS` = les 16 lettres, **pas** le mot de passe Gmail habituel. Ne commite jamais ce fichier.

4. Redémarre `npm run dev`. Sur Vercel, ajoute les mêmes variables (Production + Preview `dev`) puis redéploie.

Le mail part de ton Gmail vers n’importe quel élève. Plus tard tu pourras passer sur un domaine + Resend.

`SUPABASE_SECRET_KEY` reste obligatoire (hash du code). Relance `schema.sql` si `email_challenges` n’existe pas.

Dans Supabase : **Authentication → Providers → Email** → **Confirm email : désactivé**.

En bas de l’écran OTP : minuteur **1:00** avant « Renvoyer le code ». **10 essais** par code.

### 2. Modèles Supabase (filet de sécurité, pas le login)

Si Supabase envoie encore un mail d’auth (confirmation de compte, etc.), il ne doit **pas** contenir de bouton de connexion.

1. **Authentication → Email Templates**.
2. **Magic Link** : colle `supabase/email-templates/magic-link.html` (code seulement, « Aucun lien à cliquer »).
3. **Confirm signup** : colle `supabase/email-templates/confirm-signup.html`.
4. Subject, par exemple : `LearnFlow : ton code de confirmation`.

LearnFlow **n’utilise plus** ces modèles pour entrer dans l’app.

### 3. Alerte « connecté à LearnFlow » + WhatsApp parents

Après le code, LearnFlow envoie :

- un email à l’élève : *connexion à LearnFlow, date, heure (Togo), web ou mobile*
- un WhatsApp au numéro parent s’il est enregistré : *l’élève X s’est connecté avec votre numéro pour le suivi*

Ces envois passent par `learnflow-web` (`POST /api/auth/secure`).

WhatsApp — un des trois :

- **Twilio** : `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
- **WhatsApp Cloud API** : `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` (et un modèle `WHATSAPP_TEMPLATE_NAME` si Meta l’exige)
- **Webhook** : `PARENT_NOTIFY_WEBHOOK_URL`

Mobile : dans `mobile/.env`, pointe vers le web :

```
EXPO_PUBLIC_LEARNFLOW_API_URL=http://localhost:3002
```

Sur un téléphone réel, utilise l’IP du PC (`http://192.168.x.x:3002`), pas `localhost`. En production : l’URL Vercel du web.

Sans Resend (domaine non vérifié), **le code part quand même** via le mailer Supabase (6 chiffres, pas de lien). Sans WhatsApp, seule l’alerte parents est sautée.

---

## Étape 7 — Tester

1. Web : `http://localhost:3002` → Connexion → **Continuer avec Google**.
2. Google doit demander **quel compte** utiliser (même si tu es déjà connecté).
3. Premier compte Google : écran **code à 6 chiffres** (email Google), puis **classe** si le profil n’existe pas encore. Le numéro parent est **facultatif**.
4. Compte déjà dans LearnFlow : Google → code email → entrée, **sans** redemander le téléphone.
5. Après le code : email « connecté à LearnFlow » + WhatsApp parent si un numéro est enregistré.
6. L’élève démarre en **ligue Bronze**, stats à **0**, cours de sa classe sans progression.
7. Admin `http://localhost:3001` : l’élève et l’activité apparaissent (source « Supabase »).

### Classement réel (après le SQL)

Re-colle `schema.sql` si tu l’avais déjà lancé : ça ajoute la fonction `league_leaderboard_for_tier` et le temps réel sur `league_scores`.

Pour recalculer les ligues à partir de l’historique XP (toutes les ligues) :

```
python supabase/scripts/update_leagues.py
python supabase/scripts/update_leagues.py --promote
```

Il faut `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Un nouvel élève sans XP est dernier. Les avatars ne sont **pas** attribués automatiquement : l’élève choisit le sien dans l’app.

---

## Si ça bloque

| Message / symptôme | Cause fréquente |
|---|---|
| « Google n’est pas encore configuré » | `.env.local` web manquant, ou serveur pas redémarré |
| Code email qui n’arrive pas | Regarde **spams / promotions**. En mode test Resend, LearnFlow bascule sur le mailer Supabase : colle les modèles HTML (code seulement). Relance aussi `schema.sql` (`email_challenges`). |
| Mail avec un bouton « se connecter » | Ancien modèle Magic Link, ou **Confirm email** encore activé. Désactive Confirm email ; colle les modèles HTML du repo (code seulement). |
| Inscription puis « Session expirée » | **Confirm email** est encore ON : l’élève n’a pas de session, donc pas de code LearnFlow. |
| Pas d’alerte « connecté » / WhatsApp | `RESEND_API_KEY` / clés WhatsApp absentes, ou `EXPO_PUBLIC_LEARNFLOW_API_URL` mobile manquant |
| Redirect mismatch / `redirect_uri_mismatch` | L’URI `https://xxxx.supabase.co/auth/v1/callback` n’est pas dans Google Cloud |
| Écran Google « app not verified » / accès bloqué | Ajoute ton Gmail en **Test user** (étape 3a) |
| SQL `uuid = text` | Ancien `schema.sql` — relance la version actuelle |
| Admin toujours en « démo locale » | `SUPABASE_SECRET_KEY` absente ou pas redémarré |
| Mobile : rien ne s’ouvre | `learnflow://auth/callback` manquant dans Supabase Redirect URLs |

Tu n’as **pas** besoin de Client ID Android/iOS pour tester Expo avec le flux Web actuel.
