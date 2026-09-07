import { getBrowserSupabase } from "./supabase";

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
  return message || "Impossible d’envoyer le code. Réessaie.";
}

export async function sendEmailOtp(
  email: string,
  options?: { shouldCreateUser?: boolean; data?: Record<string, string>; force?: boolean },
): Promise<{ error?: string }> {
  const supabase = getBrowserSupabase();
  if (!supabase) return { error: "Supabase n’est pas configuré." };
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) return { error: "Adresse email invalide." };

  const prevOk = lastOkAt.get(trimmed) ?? 0;
  if (!options?.force && Date.now() - prevOk < DEDUPE_MS) return {};

  const pending = inFlight.get(trimmed);
  if (pending) return pending;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const task = (async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: options?.shouldCreateUser ?? true,
        data: options?.data,
        emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
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
  const supabase = getBrowserSupabase();
  if (!supabase) return { error: "Supabase n’est pas configuré." };
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
