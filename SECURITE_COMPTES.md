# Comptes élèves & GitHub — ce qui est secret

## En une phrase

**Les mots de passe des élèves ne sont jamais stockés dans le code LearnFlow ni poussés sur GitHub.**  
Ils sont envoyés à **Supabase Auth**, qui les **hashe** (bcrypt) dans sa base `auth.users`. Notre app ne garde que l’email / le profil (XP, classe…), **pas** le mot de passe.

---

## Ce qui se passe à l’inscription / connexion

1. L’élève tape email + mot de passe dans l’app.
2. L’app appelle `supabase.auth.signUp` / `signInWithPassword`.
3. Supabase enregistre un **hash** du mot de passe (pas le texte clair).
4. LearnFlow enregistre le profil (nom, classe, XP…) dans `student_profiles` — **sans colonne password**.

Dans le code, `pendingAuth` **retire** volontairement tout champ `password` avant de le mettre en `sessionStorage`.

---

## Ce qui ne doit JAMAIS apparaître sur GitHub

| À ne pas committer | Où ça vit chez toi | Protégé par |
|--------------------|--------------------|-------------|
| `.env.local`, `.env` | PC / serveur | `.gitignore` |
| Mot de passe élève | Uniquement chez Supabase (hash) | Jamais dans notre repo |
| Mot de passe admin | `ADMIN_PASSWORD_HASH` dans `admin/.env.local` | `.gitignore` + hash scrypt |
| `SUPABASE_SECRET_KEY` (service role) | `.env.local` admin | `.gitignore` |
| Clés API (Gemini, SMTP…) | `.env.local` | `.gitignore` |

Les fichiers `*.env.example` **peuvent** être sur GitHub : ils n’ont que des **placeholders vides**.

---

## Vérifier que Git ignore bien les secrets

Dans `Learnflow/` :

```powershell
git check-ignore -v admin/.env.local learnflow-web/.env.local mobile/.env
git status --ignored
```

Tu dois voir `!!` (ignored) devant les `.env.local`.  
Si un `.env` apparaît en vert / staged → **ne committe pas**, retire-le :

```powershell
git rm --cached chemin/vers/.env.local
```

---

## Admin (compte unique du tableau de bord)

Ce n’est **pas** un élève. Son secret doit être un **hash** dans `admin/.env.local` :

```powershell
cd admin
npm run hash-password
# ou migration automatique depuis un ADMIN_PASSWORD encore en clair :
node scripts/migrate-admin-password-to-hash.mjs
```

Guide détaillé : `admin/HACHAGE_MOT_DE_PASSE.md`

---

## Identifiants visibles côté app (normal)

Sur GitHub / dans le code, on peut voir :

- des **emails d’exemple** (`admin@learnflow.tg` dans `.env.example`)
- des **IDs de profil** une fois connecté (UUID Supabase) — ce ne sont pas des mots de passe

Ce qui ne doit **pas** être public : le **mot de passe**, la **clé service role** Supabase, les secrets SMTP / Gemini.

---

## Si tu as déjà poussé un secret par erreur

1. Change immédiatement le mot de passe / régénère les clés Supabase.
2. Remplace par un hash (admin) ou de nouvelles clés.
3. Purge l’historique Git si le secret a été committé (`git filter-repo` / support GitHub).
