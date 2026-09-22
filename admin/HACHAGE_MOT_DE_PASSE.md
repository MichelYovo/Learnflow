# Mot de passe admin — hachage (Guide clair)

Ce guide sert à **ne jamais mettre un mot de passe en clair** dans GitHub ni dans `.env.example`.

## Ce qu’il faut comprendre

| Élément | Où ça vit | Committer sur GitHub ? |
|--------|-----------|-------------------------|
| Mot de passe en clair (`MonSecret123!`) | Uniquement dans ta tête / un gestionnaire de mots de passe | **NON** |
| Hash `ADMIN_PASSWORD_HASH=scrypt$...` | Fichier `admin/.env.local` sur **ton PC** | **NON** |
| Fichier `.env.example` | Dépôt Git (placeholders vides) | OUI (sans secrets) |

Le hash n’est **pas** réversible : l’admin tape le vrai mot de passe à la connexion ; le serveur compare avec scrypt. Si quelqu’un vole le hash seul, il ne peut pas se connecter facilement (scrypt + sel).

Les mots de passe **élèves** sont déjà hashés par **Supabase Auth** — tu n’as rien à faire de plus pour eux.

---

## Étapes (Windows / PowerShell)

### 1. Ouvre un terminal dans le dossier admin

```powershell
cd c:\PROJET\Learnflow\Learnflow\admin
```

### 2. Choisis un mot de passe fort

- Au moins **8 caractères** (12+ recommandé)
- Mélange lettres, chiffres, symbololes
- **Ne le colle nulle part dans un fichier Git**

Exemple (à remplacer) : `Lf#Admin2026!Tg`

### 3. Génère le hash

```powershell
node scripts/hash-admin-password.mjs "Lf#Admin2026!Tg"
```

Ou sans argument (le script te demande le mot de passe sans l’afficher) :

```powershell
node scripts/hash-admin-password.mjs
```

Tu verras quelque chose comme :

```text
========== À COPIER DANS admin/.env.local ==========
ADMIN_PASSWORD_HASH=scrypt$abc123...$def456...
====================================================
```

### 4. Crée / édite `admin/.env.local`

Si le fichier n’existe pas, copie `.env.example` :

```powershell
Copy-Item .env.example .env.local
```

Puis ouvre `.env.local` et mets **exactement** :

```env
ADMIN_EMAIL=admin@learnflow.tg
ADMIN_PASSWORD_HASH=scrypt$...colle_ici_le_hash_entier...
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=une-chaine-aleatoire-de-32-caracteres-min
```

Points importants :

1. `ADMIN_PASSWORD=` doit rester **vide** (plus de mot de passe en clair).
2. Une seule ligne `ADMIN_PASSWORD_HASH=...` sans guillemets, sans espace.
3. `ADMIN_SESSION_SECRET` = autre secret long (différent du mot de passe).

### 5. Vérifie que Git ignore le fichier

```powershell
git check-ignore -v .env.local
```

Tu dois voir une ligne qui confirme que `.env.local` est ignoré.  
Si `git status` affiche `.env.local` → **ne committe pas** ; corrige le `.gitignore`.

### 6. Redémarre l’admin et connecte-toi

```powershell
npm run dev
```

Va sur http://localhost:3001 et connecte-toi avec :

- Email = valeur de `ADMIN_EMAIL`
- Mot de passe = celui que tu as tapé à l’étape 2 (le **vrai**, pas le hash)

---

## Production / autre machine

1. Sur le serveur (Vercel, VPS, etc.), crée les **variables d’environnement** :
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH` (le même hash, ou un nouveau si tu changes le mot de passe)
   - `ADMIN_SESSION_SECRET`
2. Ne mets **jamais** `ADMIN_PASSWORD` en production.
3. Si tu changes le mot de passe : regénère un hash (étape 3) et remplace `ADMIN_PASSWORD_HASH`.

---

## Erreurs fréquentes

| Symptôme | Cause | Solution |
|----------|--------|----------|
| « Email ou mot de passe incorrect » | Hash mal collé / espaces / guillemets | Recoller la ligne entière sans `"` |
| Login OK en local, KO en prod | Variable manquante sur l’hébergeur | Ajouter `ADMIN_PASSWORD_HASH` dans le dashboard |
| `.env.local` apparaît dans `git status` | Pas ignoré | Vérifier `.gitignore` (`.env*` / `.env.local`) |
| Tu as poussé un mot de passe par erreur | Fuite | Change le mot de passe, régénère le hash, purge l’historique Git si besoin |

---

## Récap en 3 lignes

1. `node scripts/hash-admin-password.mjs` → copie le hash  
2. Colle-le dans `admin/.env.local` sous `ADMIN_PASSWORD_HASH=`  
3. Laisse `ADMIN_PASSWORD` vide et **ne committe jamais** `.env.local`
