import { learnflowApiBase } from "./secureAuth";
import { isSupabaseConfigured, supabase } from "./supabase";

type AuthFailure = { message?: string; code?: string } | null;

export function passwordAuthMessage(message: string) {
  const m = message.toLowerCase();
  if (m.includes("network") || m.includes("failed to fetch") || m.includes("load failed") || m.includes("network request failed")) {
    return "Connexion impossible. Vérifie ton réseau et réessaie.";
  }
  if (m.includes("rate") || m.includes("too many") || (m.includes("after") && m.includes("second"))) {
    return "Trop de tentatives. Réessaie dans une minute.";
  }
  if (m.includes("not confirmed")) {
    return "Ce compte n’est pas encore confirmé. Réessaie.";
  }
  if (m.includes("invalid") || m.includes("credential") || m.includes("incorrect")) {
    return "Email ou mot de passe incorrect.";
  }
  return "Connexion impossible. Réessaie.";
}

function isEmailNotConfirmed(error: AuthFailure) {
  if (!error) return false;
  const code = (error.code ?? "").toLowerCase();
  const message = (error.message ?? "").toLowerCase();
  return code === "email_not_confirmed" || message.includes("not confirmed");
}

/** Connexion email + mot de passe. Si Supabase bloque un ancien compte non confirmé, on le confirme puis on réessaie. */
export async function signInWithPasswordRecovered(email: string, password: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: "Supabase n’est pas configuré." };
  const normalized = email.trim().toLowerCase();

  const first = await supabase.auth.signInWithPassword({ email: normalized, password });
  if (!first.error) return {};
  if (!isEmailNotConfirmed(first.error)) return { error: passwordAuthMessage(first.error.message) };

  const base = learnflowApiBase();
  if (!base) return { error: "Connexion impossible. Réessaie." };
  try {
    const res = await fetch(`${base}/api/auth/confirm-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, password }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return { error: json.error || "Connexion impossible. Réessaie." };
  } catch {
    return { error: "Connexion impossible. Vérifie ton réseau et réessaie." };
  }

  const second = await supabase.auth.signInWithPassword({ email: normalized, password });
  if (second.error) return { error: passwordAuthMessage(second.error.message) };
  return {};
}
