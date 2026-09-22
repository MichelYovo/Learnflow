#!/usr/bin/env node
/**
 * Génère ADMIN_PASSWORD_HASH (scrypt) pour LearnFlow Admin.
 *
 * Usage :
 *   node scripts/hash-admin-password.mjs
 *   node scripts/hash-admin-password.mjs "MonMotDePasseFort"
 *
 * Voir HACHAGE_MOT_DE_PASSE.md pour le guide complet.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function printResult(encoded) {
  console.log("");
  console.log("========== À COPIER DANS admin/.env.local ==========");
  console.log(`ADMIN_PASSWORD_HASH=${encoded}`);
  console.log("====================================================");
  console.log("");
  console.log("Ensuite :");
  console.log("  1. Ouvre (ou crée) le fichier : admin/.env.local");
  console.log("  2. Colle la ligne ADMIN_PASSWORD_HASH=... ci-dessus");
  console.log("  3. Mets ADMIN_PASSWORD=  (vide, rien après le =)");
  console.log("  4. Vérifie : git check-ignore -v .env.local");
  console.log("  5. Redémarre : npm run dev");
  console.log("");
  console.log("Guide détaillé : HACHAGE_MOT_DE_PASSE.md");
  console.log("Ne committe JAMAIS .env.local ni le mot de passe en clair.");
  console.log("");
}

async function readHiddenPassword() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question("Tape ton mot de passe admin (min. 8 caractères) : ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const fromArg = process.argv[2];
let password = fromArg;

if (!password) {
  password = await readHiddenPassword();
}

password = String(password ?? "").trim();
if (password.length < 8) {
  console.error("");
  console.error("Erreur : le mot de passe doit faire au moins 8 caractères.");
  console.error('Exemple : node scripts/hash-admin-password.mjs "Lf#Admin2026!Tg"');
  console.error("");
  process.exit(1);
}

printResult(hashPassword(password));
