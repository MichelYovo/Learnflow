import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_EMAIL_DEFAULT } from "./brand";

export const SESSION_COOKIE = "lf_admin_session";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;

export type AdminSession = {
  email: string;
  iat: number;
  exp: number;
  nonce?: string;
};

function adminEmail() {
  return (process.env.ADMIN_EMAIL ?? ADMIN_EMAIL_DEFAULT).trim().toLowerCase();
}

function adminPassword() {
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

export function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = adminEmail();
  const expectedPassword = adminPassword();
  if (!expectedPassword) return false;
  const givenEmail = email.trim().toLowerCase();
  const emailOk = safeEqual(givenEmail, expectedEmail);
  const passwordOk = safeEqual(password, expectedPassword);
  return emailOk && passwordOk;
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
