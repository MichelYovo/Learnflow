#!/usr/bin/env node
/**
 * Lit ADMIN_PASSWORD dans .env.local, génère ADMIN_PASSWORD_HASH, vide ADMIN_PASSWORD.
 * N'affiche jamais le mot de passe en clair.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, scryptSync } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

if (!existsSync(envPath)) {
  console.error("Fichier manquant : admin/.env.local");
  console.error("Crée-le d'abord (copie .env.example) puis relance.");
  process.exit(1);
}

const raw = readFileSync(envPath, "utf8");
const lines = raw.split(/\r?\n/);
let password = "";
for (const line of lines) {
  const m = line.match(/^\s*ADMIN_PASSWORD\s*=\s*(.*)$/);
  if (m) {
    password = m[1].trim().replace(/^["']|["']$/g, "");
  }
}

if (!password || password.length < 8) {
  console.error("ADMIN_PASSWORD est vide ou trop court dans .env.local.");
  console.error("Soit mets un mot de passe temporaire, soit utilise : npm run hash-password");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
const encoded = `scrypt$${salt}$${hash}`.replaceAll("$", "\\$");

let hasHash = false;
let hasPassword = false;
const next = lines.map((line) => {
  if (/^\s*ADMIN_PASSWORD_HASH\s*=/.test(line)) {
    hasHash = true;
    return `ADMIN_PASSWORD_HASH=${encoded}`;
  }
  if (/^\s*ADMIN_PASSWORD\s*=/.test(line)) {
    hasPassword = true;
    return "ADMIN_PASSWORD=";
  }
  return line;
});

if (!hasHash) {
  const insertAt = next.findIndex((l) => /^\s*ADMIN_EMAIL\s*=/.test(l));
  const row = `ADMIN_PASSWORD_HASH=${encoded}`;
  if (insertAt >= 0) next.splice(insertAt + 1, 0, row);
  else next.unshift(row);
}
if (!hasPassword) next.push("ADMIN_PASSWORD=");

writeFileSync(envPath, next.join("\n").replace(/\n*$/, "\n"), "utf8");

console.log("OK — admin/.env.local mis à jour :");
console.log("  • ADMIN_PASSWORD_HASH = (hash scrypt, sans le mot de passe)");
console.log("  • ADMIN_PASSWORD = vide");
console.log("Ce fichier reste ignoré par Git (ne sera pas sur GitHub).");
console.log("Redémarre l'admin : npm run dev");
