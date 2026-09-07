"use client";

import { useState } from "react";
import { useAppTheme } from "@/theme/useAppTheme";
import { getBrowserSupabase, isSupabaseConfigured } from "@/lib/supabase";

type Provider = "google" | "apple" | "facebook";

export default function SocialAuth({
  mode,
}: {
  mode: "login" | "signup";
  onProvider?: (provider: Provider) => void;
}) {
  const { colors } = useAppTheme();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const showPending = (name: "Apple" | "Facebook") => {
    setError("");
    setNotice(
      `La connexion ${name} est en cours de service. Utilise Google ou ton email pour l’instant.`,
    );
  };

  const startGoogle = async () => {
    setError("");
    setNotice("");
    const supabase = getBrowserSupabase();
    if (!isSupabaseConfigured || !supabase) {
      setError("Google n’est pas encore configuré. Ajoute les clés Supabase.");
      return;
    }
    setBusy(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
          access_type: "offline",
        },
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <span className="h-px flex-1" style={{ background: colors.border }} />
        <span className="text-[11px] font-semibold" style={{ color: colors.textMuted }}>
          {mode === "login" ? "ou se connecter avec" : "ou s'inscrire avec"}
        </span>
        <span className="h-px flex-1" style={{ background: colors.border }} />
      </div>
      <button
        type="button"
        onClick={() => void startGoogle()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 py-3.5 text-sm font-bold disabled:opacity-60"
        style={{ background: colors.white, borderColor: colors.border, color: colors.textDark }}
      >
        <GoogleMark />
        {busy ? "Ouverture de Google…" : "Continuer avec Google"}
      </button>
      {error ? <p className="text-center text-xs font-bold text-red-500">{error}</p> : null}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => showPending("Apple")}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 text-[13px] font-bold"
          style={{ background: colors.white, borderColor: colors.border, color: colors.textDark }}
        >
          <AppleMark color={colors.textDark} />
          Apple
        </button>
        <button
          type="button"
          onClick={() => showPending("Facebook")}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 text-[13px] font-bold"
          style={{ background: colors.white, borderColor: colors.border, color: colors.textDark }}
        >
          <FacebookMark />
          Facebook
        </button>
      </div>
      {notice ? (
        <p
          role="status"
          className="rounded-2xl border-2 px-3 py-2.5 text-center text-xs font-bold"
          style={{ borderColor: colors.border, background: colors.surfaceAlt, color: colors.textDark }}
        >
          {notice}
        </p>
      ) : null}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.7 0 2.9.7 3.6 1.3l2.4-2.4C16.6 3.7 14.5 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1-.2-1.5H12z" />
    </svg>
  );
}

function AppleMark({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.2c1.1-1.5 1.5-3 1.5-3.1-.1 0-2.8-1.1-2.8-4.4zM14.6 5.8c.6-.8 1.1-1.9.9-3-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.5 2.9-1.4z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </svg>
  );
}
