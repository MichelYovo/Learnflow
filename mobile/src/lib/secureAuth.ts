import { Platform } from "react-native";
import { isSupabaseConfigured, supabase } from "./supabase";
import { verifyEmailOtp } from "./emailOtp";

type SecureAction = "send-otp" | "verify-otp" | "login-notice";
type OtpChannel = "learnflow" | "supabase";

type SecureJson = {
  ok?: boolean;
  error?: string;
  fallback?: string;
  channel?: OtpChannel;
  retryAfterSeconds?: number;
  attemptsLeft?: number;
};

const PRODUCTION_API = "https://learnflow-web.vercel.app";

let lastOtpChannel: OtpChannel = "learnflow";

function apiBase() {
  let base = (process.env.EXPO_PUBLIC_LEARNFLOW_API_URL ?? "").replace(/\/$/, "");
  if (!base) return PRODUCTION_API;
  const isLoopback = /localhost|127\.0\.0\.1/i.test(base);
  if (isLoopback && Platform.OS !== "web") {
    return PRODUCTION_API;
  }
  return base;
}

async function accessToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function callSecure(action: SecureAction, extra: Record<string, string> = {}): Promise<SecureJson | null> {
  const token = await accessToken();
  const base = apiBase();
  if (!token || !base) return null;
  try {
    const res = await fetch(`${base}/api/auth/secure`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, platform: "mobile", ...extra }),
    });
    const json = (await res.json().catch(() => ({}))) as SecureJson;
    if (!res.ok && !json.fallback) {
      return {
        error: json.error || "Impossible de vérifier le code. Réessaie.",
        retryAfterSeconds: json.retryAfterSeconds,
        attemptsLeft: json.attemptsLeft,
      };
    }
    return json;
  } catch {
    return { error: "Impossible de joindre LearnFlow. Réessaie." };
  }
}

export async function sendSecureEmailOtp(
  _email: string,
  options?: { shouldCreateUser?: boolean; data?: Record<string, string>; force?: boolean },
): Promise<{ error?: string; retryAfterSeconds?: number }> {
  const viaApi = await callSecure("send-otp", options?.force ? { force: "true" } : {});
  if (viaApi?.channel) lastOtpChannel = viaApi.channel;
  if (viaApi?.ok) return { retryAfterSeconds: viaApi.retryAfterSeconds ?? 60 };
  if (!apiBase()) {
    return { error: "Ajoute EXPO_PUBLIC_LEARNFLOW_API_URL (adresse du web LearnFlow) pour recevoir le code." };
  }
  return {
    error: viaApi?.error || "Session expirée. Repars de la connexion.",
    retryAfterSeconds: viaApi?.retryAfterSeconds,
  };
}

export async function verifySecureEmailOtp(email: string, token: string): Promise<{ error?: string; retryAfterSeconds?: number }> {
  const viaApi = await callSecure("verify-otp", { token });
  if (viaApi?.ok) return {};
  if (viaApi?.fallback === "supabase_otp" || lastOtpChannel === "supabase") {
    return verifyEmailOtp(email, token);
  }
  return {
    error: viaApi?.error || "Session expirée. Repars de la connexion.",
    retryAfterSeconds: viaApi?.retryAfterSeconds,
  };
}

export async function notifySecureLogin(event = "login"): Promise<void> {
  try {
    await callSecure("login-notice", { event });
  } catch {
    /* notification best-effort */
  }
}
