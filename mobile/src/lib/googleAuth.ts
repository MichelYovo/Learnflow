import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { isSupabaseConfigured, supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

function pickParam(url: string, key: string): string | null {
  try {
    const parsed = Linking.parse(url);
    const q = parsed.queryParams?.[key];
    if (typeof q === "string" && q) return q;
  } catch {
    /* ignore */
  }
  try {
    const u = new URL(url.replace("learnflow://", "https://learnflow.local/"));
    const fromQuery = u.searchParams.get(key);
    if (fromQuery) return fromQuery;
    const hash = u.hash.replace(/^#/, "");
    if (hash) {
      const hp = new URLSearchParams(hash);
      return hp.get(key);
    }
  } catch {
    /* ignore */
  }
  return null;
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) {
    return { error: "Google n’est pas configuré. Ajoute les clés Supabase." };
  }

  const redirectTo = makeRedirectUri({ scheme: "learnflow", path: "auth/callback" });
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: { prompt: "select_account", access_type: "offline" },
    },
  });
  if (error || !data.url) {
    return { error: error?.message ?? "Impossible d’ouvrir Google." };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success" || !("url" in result) || !result.url) {
    return { error: "Connexion Google annulée." };
  }

  const code = pickParam(result.url, "code");
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) return { error: exchangeError.message };
    return {};
  }

  const access_token = pickParam(result.url, "access_token");
  const refresh_token = pickParam(result.url, "refresh_token");
  if (access_token && refresh_token) {
    const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
    if (sessionError) return { error: sessionError.message };
    return {};
  }

  return { error: "Réponse Google incomplète." };
}
