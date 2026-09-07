# LearnFlow

Application mobile élève pour collège et lycée (programme **APC Togo**).  
Fiches, flashcards, quiz 10/10, quatre modes de révision, ligues et Spira — **offline-first**.

Version **1.0.0** · React Native + Expo Go · identifiant `tg.learnflow.app`

---

## Stack

| Couche | Techno |
|---|---|
| App | React Native 0.86 · React 19 · Expo SDK 57 · TypeScript |
| Navigation | React Navigation 7 (native-stack + bottom-tabs) |
| État | Zustand + persist AsyncStorage |
| Local | expo-sqlite (WAL) |
| Cloud (optionnel) | Supabase Auth + `student_profiles` / `league_scores` |
| UI | NativeWind · Reanimated · LinearGradient · SVG |
| Thème | Clair / sombre, palette Figma `#1677FF` |

---

## Lancer

Prérequis : Node.js 20+, npm, [Expo Go](https://expo.dev/go) sur le téléphone.

```bash
cd LearnFlow/mobile
npm install
npm start
```

Scanne le QR code avec **Expo Go** (Android) ou l’appareil photo (iOS).

```bash
npm run android   # émulateur / device Android
npm run ios       # simulateur iOS (macOS)
npm run web       # aperçu web
```

### Cloud (optionnel)

Sans variables d’environnement, l’app tourne entièrement en local (démo).  
Pour activer la sync ligue / profils, crée un `.env` :

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Le client ignore les placeholders (`YOUR_PROJECT_REF`, clés `sb_secret_`).  
La session Auth est persistée dans AsyncStorage ; le sync se relance à la reconnexion.

---

## Produit

LearnFlow vise la **maîtrise**, pas le survol : un chapitre n’est validé qu’à **10/10**.  
Spira (mascotte) accompagne chaque écran. Le tuteur IA est un canal distinct, avec quota cloud.

**Classes** : 6e → Terminale D (`6eme` … `Tle`), selon le compte Google / email de l’élève.  
**Matières** : Mathématiques, SVT, PCT, Histoire-Géo, Français, Anglais, ECM.  
Les cours affichés dépendent de la classe. En SVT, les chapitres cœur, ADN, neurone, synapse et rein ont un **modèle 3D** annoté.

---

## Parcours élève

### Auth

1. **Onboarding** — Spira présente la règle 10/10, les 4 modes, les ligues, l’offline.
2. **Splash** — intro LearnFlow.
3. **Inscription / Google** — le compte Google est reconnu tout de suite. Pas de numéro obligatoire si le profil existe déjà.
4. **Code à 6 chiffres** envoyé à l’email du compte (2FA), puis **Succès**. Premier compte : classe seulement (numéro parent facultatif).
5. Après le code : email « connecté à LearnFlow ». WhatsApp parent si un numéro est enregistré.

Pour les alertes connexion, ajoute aussi :

```
EXPO_PUBLIC_LEARNFLOW_API_URL=http://localhost:3002
```

Le store `isAuthenticated` bascule ensuite vers l’app principale.

### Onglets

Barre custom (icônes Icons8 iOS / Android) + **FAB Agenda** au centre.

| Onglet | Rôle |
|---|---|
| **Accueil** | Avatar, cloche inbox, badge ligue, XP semaine, « Mes matières », sélecteur des 4 modes, séances du jour |
| **Cours** | Programme APC en 4 niveaux : matière → thème → chapitre → leçons |
| **Ligues** | Podium, classement du groupe, palier Bronze → Diamant, badges, gel de ligue |
| **Profil** | Stats (XP, série, rang, leçons), édition nom / avatar, thème sombre, réglages |

Le **Quiz** n’est plus un onglet : c’est l’écran `QuizHub` (stack), ouvert depuis Accueil / Cours.

### Écrans stack (après connexion)

| Écran | Contenu |
|---|---|
| Agenda | Séances de révision + emploi du temps scolaire (jour / semaine) |
| QuizHub | Hub assimilation, Grand Quizz, flashcards, Blitz |
| Course | Fiche Essentiel / Détails, lecture bionique, mots masqués, analogie Spira |
| AssimilationQuiz | QCM 10 questions, règle 10/10, Instant T |
| GrandQuizz | 20+ questions, XP sprint ×2, verrouillé sans 10/10 |
| Flashcards | Cartes + auto-notation Facile / Moyen / Difficile |
| Blitz | Arène 60 s, codes défi `LF-…`, partage WhatsApp |
| Schema2D / Schema3D | Schémas interactifs **SVT uniquement** |
| FillBlanks | Textes à trous (Cramming) |
| AITutor | Chat modal, quota 5 requêtes cloud / jour, fallback FAQ |
| ParentsGate / Parents | Sas maths (produit de 2 nombres) puis carnet + SMS passif |
| SessionCustomize | Recette d’outils (fiche, cartes, QCM, schéma, V/F, trous) |
| ModeLibre / ModeGuide / ModeCramming | Hubs des 3 modes calmes |
| NotificationsInbox | Fil local (étude, série, ligue, repos, système) |
| NotificationsSettings | Rappels étude / streak / repos 1 h / ligue / sons |
| PrivacySettings | Visibilité ligue, scores Blitz, SMS parent, analytique, cache |
| About | Mission, version, support `support@learnflow.tg` |
| RateApp | Note 1–5 + commentaire |

Un **chatbot flottant** (FAQ locale) reste au-dessus des onglets.

---

## Quatre modes

Définis dans `src/types/modes.ts` — source unique UI + logique.

| Mode | Idée | Outils par défaut | Accès |
|---|---|---|---|
| **Libre** | Assimilation sereine, sans chrono | Fiche · flashcards · schémas SVT | Toujours |
| **Guidé** | Spira ne montre que les cartes **dues aujourd’hui** (algo des J) | Flashcards | Inactif s’il n’y a aucune carte due |
| **Cramming** | Veille de devoir : une matière, un chapitre | QCM · textes à trous | Toujours |
| **Blitz 60s** | Survive 60 s, mix de chapitres | QCM | Toujours (plein écran) |

La recette d’outils se personnalise via **SessionCustomize**.

### Blitz

- Chrono 60 s, difficultés Facile / Moyen / Difficile (multiplicateur XP 0,8 / 1 / 1,4).
- Code défi `LF-{F\|M\|D}xxxx` (seed déterministe, alphabet 32 caractères).
- Même code = même deck pour un duel WhatsApp.
- Partage du score contrôlé par le réglage « Partage de score Blitz ».

---

## Pédagogie

### Garde-barrière 10/10

Le **quizz d’assimilation** (10 questions) doit être parfait pour débloquer le **Grand Quizz** du chapitre.

- 10/10 au **premier essai** → badge **CHALLENGER** + SMS parent de félicitations.
- Erreur → on reboucle sur les questions ratées (`loopErrors`).
- XP seulement si score parfait.

### Instant T (après 10/10)

- **Sprint** — enchaîne tout de suite le Grand Quizz (XP ×2).
- **Repos** — Grand Quizz **verrouillé 1 h** (`lockGrandQuizzOneHour`). Rappel inbox si l’option « Instant T · Repos 1h » est active.

### Flashcards — algorithme des J

`src/engine/spacedRepetition.ts` (type Ebbinghaus) :

| Auto-notation | Intervalles (jours) |
|---|---|
| Facile | 1 → 3 → 7 → 14 → 30 |
| Moyen | 1 → 2 → 4 → 8 → 16 |
| Difficile | 0 → 1 → 2 → 4 → 7 |

Les cartes `due` alimentent le Mode Guidé.

### XP

`XP = BaseXP × FacteurClasse × DensitéChapitre × MultiplicateurPrécision`

Facteur classe : 6e = 1,0 … Terminale = 1,5.

- Assimilation : `score × 25`, bonus ×1,5 si parfait, ×1,25 si premier essai parfait.
- Blitz : `score × 15` × densité 0,8 × niveau de difficulté.
- Grand Quizz sprint : XP calculé puis ×2.

L’XP s’écrit dans Zustand **et** SQLite (`StudySessions`), puis est poussée vers Supabase quand le réseau revient.

### Fiches de cours

- **L’Essentiel** — puces, < 300 mots.
- **En Détails** — sections APC dépliables.
- **Lecture bionique** — mots cardinaux en `**gras**`.
- **Mots masqués** — tap pour révéler un mot-clé.
- **Analogie de Spira** — « En d’autre terme » (concept + exemple).
- Schémas 2D / 3D réservés à la SVT (`chapterHasSchema`).

---

## Spira & tuteur

**Spira** n’est pas l’IA : c’est une mascotte à scènes (`src/data/spira.ts`).  
Chaque écran déclare une `SpiraScene` (accueil, 10/10, Blitz, sas parental…). Humeur liée au rôle : joyeux, calme, confiant, triste, énervé, etc.

**Tuteur IA** (`AITutor`) :

- 5 requêtes cloud / jour (`aiQuotaRestant`).
- Sinon FAQ locale (`AI_FAQ` / `findAiFaq`).
- Le FAB onglets utilise uniquement le tuteur **local** (pas de quota).

---

## Ligues

Paliers : **Bronze → Argent → Or → Platine → Diamant**.  
Classement hebdo du groupe (jusqu’à 30), podium, badges (Série 7, Blitz King, Lecteur Pro, CHALLENGER…).

- **Gel de ligue** : protège le rang N jours (`gelerLigue`).
- Cache SQLite `LeagueCache` pour l’affichage hors ligne.
- Sync : push XP pending → upsert `league_scores` → pull top 30 du palier.

---

## Agenda & emploi du temps

Deux onglets internes :

- **Agenda** — séances (matière, mode, horaire, durée 15–60 min, rappel 0–60 min). Report (+1 h) ou suppression.
- **Emploi du temps** — cours scolaires (prof, salle, créneaux).

Les rappels d’étude alimentent l’**inbox** locale (pas de push serveur en MVP).

---

## Espace parent

1. **Sas** : multiplication aléatoire (ex. 7 × 8) — anti-élève.
2. **Espace Parent** : carnet de notes, statut SMS passif, dernier envoi.

Le SMS n’est **que félicitations** (10/10, Challenger) — jamais de surveillance de session. Désactivable dans Confidentialité.

---

## Architecture

```
App.tsx
  AnimatedSplash
  OfflineBootstrap          → SQLite + SyncManager
    RootNavigator
      AuthStack             si !isAuthenticated
      MainTabs + stack      si connecté
```

### État (`useLearnFlowStore`)

Persisté (AsyncStorage) : auth, profils, ligue, flashcards, progression chapitres, agenda, inbox, settings, quota IA.

Côté SQLite (source de vérité offline pour le sync) :

| Table | Rôle |
|---|---|
| `LocalProfiles` | Élèves, XP, PIN hashé, avatar, flag `dirty` |
| `StudySessions` | XP par séance, `synced` 0/1 |
| `LeagueCache` | Classement du palier |
| `SyncMeta` | `last_sync_at` / `last_sync_error` |

Migrations additives via `PRAGMA table_info` (`SCHEMA_VERSION = 3`).

### Sync (`src/lib/SyncManager.ts`)

1. Restaure la session Supabase en silence.
2. Si online : push profils dirty + XP des sessions non sync.
3. Pull classement du palier, écrit `LeagueCache`, met à jour le store.
4. Relance au retour réseau (`expo-network`), debounce 800 ms, après `InteractionManager`.

Sans Supabase configuré, tout reste local.

### PIN local

`src/lib/pin.ts` : SHA-256 de `profileId:pin`, comparaison en temps constant.

---

## Arborescence

```
LearnFlow/mobile/
├── App.tsx
├── app.json
├── src/
│   ├── navigation/          RootNavigator, types de routes
│   ├── screens/
│   │   ├── auth/            Onboarding → OTP
│   │   ├── tabs/            Accueil, Cours, Ligue, Profil, Agenda, Inbox
│   │   ├── modes/           Libre, Guidé, Cramming, Blitz, quiz, fiches…
│   │   └── settings/        Notifs, confidentialité, à propos, note
│   ├── components/          Spira, TabBar, Avatar, ligue, chatbot…
│   ├── store/               Zustand
│   ├── engine/              XP, algo des J, codes Blitz
│   ├── db/                  SQLite schema, profils, sessions, ligue
│   ├── lib/                 Supabase, SyncManager, PIN, ids
│   ├── data/                Programme, fiches, mock, Spira, avatars
│   ├── theme/               colors, palette dark, useAppTheme
│   └── types/               learnflow, modes, database, supabase
└── assets/                  icônes, splash, badges ligue, avatars
```

---

## Thème

- Police **Poppins** (Regular → Black). Primary `#1677FF` (Figma). Accents matière : maths bleu, SVT vert, PCT cyan, HG ambre, FR violet, ANG rouge, ECM orange.
- Mode sombre : surfaces `#0F172A` / `#1E293B`, jamais de noir pur. `onPrimary` reste blanc.
- `userInterfaceStyle: automatic` ; le switch Profil pilote NativeWind + StatusBar.

---

## Identifiants

| | |
|---|---|
| Bundle iOS | `tg.learnflow.app` |
| Package Android | `tg.learnflow.app` |
| Scheme | `learnflow://` |
| Support | support@learnflow.tg |
