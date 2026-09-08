import { makeRedirectUri } from "expo-auth-session";
import { isSupabaseConfigured, supabase } from "./supabase";

/** Ancien envoi Magic Link Supabase — ne plus l’utiliser pour entrer dans LearnFlow. */

const lastOkAt = new Map<string, number>();
const inFlight = new Map<string, Promise<{ error?: string }>>();
const DEDUPE_MS = 20_000;
const VERIFY_TYPES = ["email", "magiclink", "signup"] as const;

export function mapOtpError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("after") && m.includes("seconds")) {
    return "Attends quelques secondes avant de renvoyer le code.";
  }
  if (m.includes("rate") || m.includes("too many")) {
    return "Trop de tentatives. Réessaie dans une minute.";
  }
  if (m.includes("invalid") || m.includes("token") || m.includes("otp") || m.includes("expired")) {
    return "Code incorrect ou expiré. Vérifie tes emails (et les spams) ou renvoie un code.";
  }
  if (m.includes("signups not allowed") || m.includes("email logins are disabled")) {
    return "Le fournisseur Email n’est pas activé dans Supabase (Authentication → Providers).";
  }
  if (m.includes("smtp") || m.includes("error sending") || m.includes("unable to send") || m.includes("mailer")) {
    return "L’email n’a pas pu partir. Vérifie Authentication → Email (fournisseur activé) et les spams, puis renvoie le code.";
  }
  return message || "Impossible d’envoyer le code. Réessaie.";
}

export async function sendEmailOtp(
  email: string,
  options?: { shouldCreateUser?: boolean; data?: Record<string, string>; force?: boolean },
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Supabase n’est pas configuré." };
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) return { error: "Adresse email invalide." };

  const prevOk = lastOkAt.get(trimmed) ?? 0;
  if (!options?.force && Date.now() - prevOk < DEDUPE_MS) return {};

  const pending = inFlight.get(trimmed);
  if (pending) return pending;

  const redirectTo = makeRedirectUri({ scheme: "learnflow", path: "auth/callback" });
  const task = (async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: options?.shouldCreateUser ?? false,
        data: options?.data,
        emailRedirectTo: redirectTo,
      },
    });
    if (error) return { error: mapOtpError(error.message) };
    lastOkAt.set(trimmed, Date.now());
    return {};
  })();

  inFlight.set(trimmed, task);
  try {
    return await task;
  } finally {
    inFlight.delete(trimmed);
  }
}

export async function verifyEmailOtp(email: string, token: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Supabase n’est pas configuré." };
  const trimmed = email.trim().toLowerCase();
  const code = token.trim();
  let lastMessage = "";
  for (const type of VERIFY_TYPES) {
    const { error } = await supabase.auth.verifyOtp({ email: trimmed, token: code, type });
    if (!error) return {};
    lastMessage = error.message;
  }
  return { error: mapOtpError(lastMessage) };
}
