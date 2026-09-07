import { isSupabaseConfigured, supabase } from "./supabase";

export function mapOtpError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("after") && m.includes("seconds")) {
    return "Attends quelques secondes avant de renvoyer le code.";
  }
  if (m.includes("rate") || m.includes("too many")) {
    return "Trop de tentatives. Réessaie dans une minute.";
  }
  if (m.includes("invalid") || m.includes("token") || m.includes("otp") || m.includes("expired")) {
    return "Code incorrect ou expiré. Vérifie tes emails ou renvoie un code.";
  }
  if (m.includes("signups not allowed") || m.includes("email logins are disabled")) {
    return "Le fournisseur Email n’est pas activé dans Supabase (Authentication → Providers).";
  }
  return message || "Impossible d’envoyer le code. Réessaie.";
}

export async function sendEmailOtp(
  email: string,
  options?: { shouldCreateUser?: boolean; data?: Record<string, string> }
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Supabase n’est pas configuré." };
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) return { error: "Adresse email invalide." };
  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      shouldCreateUser: options?.shouldCreateUser ?? true,
      data: options?.data,
    },
  });
  if (error) return { error: mapOtpError(error.message) };
  return {};
}

export async function verifyEmailOtp(email: string, token: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Supabase n’est pas configuré." };
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: "email",
  });
  if (error) return { error: mapOtpError(error.message) };
  return {};
}
