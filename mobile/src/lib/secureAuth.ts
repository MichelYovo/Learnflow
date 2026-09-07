import { isSupabaseConfigured, supabase } from "./supabase";
import { mapOtpError, sendEmailOtp, verifyEmailOtp } from "./emailOtp";

type SecureAction = "send-otp" | "verify-otp" | "login-notice";

let lastOtpMode: "learnflow" | "supabase" = "supabase";

function apiBase() {
  return (process.env.EXPO_PUBLIC_LEARNFLOW_API_URL ?? "").replace(/\/$/, "");
}

async function accessToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function callSecure(
  action: SecureAction,
  extra: Record<string, string> = {},
): Promise<{ ok?: boolean; fallback?: string; error?: string } | null> {
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
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      fallback?: string;
      error?: string;
    };
    if (!res.ok && !json.fallback) {
      return { error: json.error || mapOtpError("otp") };
    }
    return json;
  } catch {
    return null;
  }
}

export async function sendSecureEmailOtp(
  email: string,
  options?: { shouldCreateUser?: boolean; data?: Record<string, string>; force?: boolean },
): Promise<{ error?: string }> {
  const trimmed = email.trim().toLowerCase();
  const secure = await callSecure("send-otp", options?.force ? { force: "true" } : {});
  if (secure?.ok && !secure.fallback) {
    lastOtpMode = "learnflow";
    return {};
  }
  if (secure?.error && /trop de tentatives|une heure/i.test(secure.error)) {
    return { error: secure.error };
  }
  lastOtpMode = "supabase";
  return sendEmailOtp(trimmed, options);
}

export async function verifySecureEmailOtp(email: string, token: string): Promise<{ error?: string }> {
  if (lastOtpMode === "learnflow") {
    const secure = await callSecure("verify-otp", { token });
    if (secure?.ok) return {};
    if (secure?.error && !secure.fallback) return { error: secure.error };
  }
  return verifyEmailOtp(email, token);
}

export async function notifySecureLogin(event = "login"): Promise<void> {
  try {
    await callSecure("login-notice", { event });
  } catch {
    /* notification best-effort */
  }
}
