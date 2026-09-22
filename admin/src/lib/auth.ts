import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_EMAIL_DEFAULT } from "./brand";

export const SESSION_COOKIE = "lf_admin_session";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;

const SCRYPT_OPTS = { N: 16384, r: 8, p: 1 } as const;

export type AdminSession = {
  email: string;
  iat: number;
  exp: number;
  nonce?: string;
};

function adminEmail() {
  return (process.env.ADMIN_EMAIL ?? ADMIN_EMAIL_DEFAULT).trim().toLowerCase();
}

function adminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
}

/** @deprecated Prefer ADMIN_PASSWORD_HASH — plaintext only for local migration. */
function adminPasswordLegacy() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
  if (secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET manquant ou trop court (16 caractères min).");
  }
  return secret;
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Format: scrypt$<saltHex>$<hashHex> */
export function hashAdminPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64, SCRYPT_OPTS).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPasswordAgainstHash(password: string, encoded: string): boolean {
  const parts = encoded.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expectedHex] = parts;
  if (!salt || !expectedHex || expectedHex.length % 2 !== 0) return false;
  try {
    const computed = scryptSync(password, salt, 64, SCRYPT_OPTS);
    const expected = Buffer.from(expectedHex, "hex");
    if (computed.length !== expected.length) return false;
    return timingSafeEqual(computed, expected);
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = adminEmail();
  const givenEmail = email.trim().toLowerCase();
  const emailOk = safeEqual(givenEmail, expectedEmail);
  if (!emailOk) return false;

  const hashed = adminPasswordHash();
  if (hashed) {
    return verifyPasswordAgainstHash(password, hashed);
  }

  const legacy = adminPasswordLegacy();
  if (!legacy) return false;
  // Migration locale uniquement — produire un hash avec scripts/hash-admin-password.mjs
  return safeEqual(password, legacy);
}

function sign(payloadB64: string) {
  return createHmac("sha256", sessionSecret()).update(payloadB64).digest("base64url");
}

export function createSessionToken(email: string) {
  const now = Math.floor(Date.now() / 1000);
  const session: AdminSession = {
    email: email.trim().toLowerCase(),
    iat: now,
    exp: now + SESSION_TTL_SEC,
    nonce: randomBytes(8).toString("hex"),
  };
  const payloadB64 = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function parseSessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;
  const expected = sign(payloadB64);
  if (!safeEqual(signature, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as AdminSession;
    if (typeof session.email !== "string" || typeof session.exp !== "number") return null;
    if (session.exp * 1000 < Date.now()) return null;
    if (session.email !== adminEmail()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return parseSessionToken(jar.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  };
}
