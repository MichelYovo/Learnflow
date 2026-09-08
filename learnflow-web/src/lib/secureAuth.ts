import { getBrowserSupabase } from "./supabase";
import { verifyEmailOtp } from "./emailOtp";

type SecureAction = "send-otp" | "verify-otp" | "login-notice";
type Platform = "web" | "mobile";
type OtpChannel = "learnflow" | "supabase";

type SecureJson = {
  ok?: boolean;
  error?: string;
  fallback?: string;
  channel?: OtpChannel;
  retryAfterSeconds?: number;
  attemptsLeft?: number;
};

let lastOtpChannel: OtpChannel = "learnflow";

async function accessToken(): Promise<string | null> {
  const supabase = getBrowserSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function callSecure(action: SecureAction, extra: Record<string, string> = {}): Promise<SecureJson | null> {
  const token = await accessToken();
  if (!token) return null;
  try {
    const res = await fetch("/api/auth/secure", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, platform: "web" satisfies Platform, ...extra }),
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
