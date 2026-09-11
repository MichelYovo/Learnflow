"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import SocialAuth from "@/components/SocialAuth";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { advanceFromSession } from "@/lib/advanceAuth";
import { savePendingAuth } from "@/lib/pendingAuth";
import { getBrowserSupabase } from "@/lib/supabase";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function LoginInner() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const params = useSearchParams();
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const googleError = params.get("error");
  const fromRelance = params.get("from") === "relance";

  const goApp = async () => {
    setError("");
    if (!email.includes("@")) {
      setError("Entre l’adresse email de ton compte.");
      return;
    }
    if (password.length < 8) {
      setError("Entre ton mot de passe.");
      return;
    }
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Supabase n’est pas configuré. Ajoute les clés puis réessaie.");
      return;
    }
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError) {
      setBusy(false);
      setError("Email ou mot de passe incorrect.");
      return;
    }
    savePendingAuth({ email: email.trim().toLowerCase(), flow: "login", emailOtpVerified: false });
    await advanceFromSession(applyCloudUser, (path) => router.replace(path));
    setBusy(false);
  };

  return (
    <Page>
      <AuthStage
        top={
          <Link href="/splash" className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: colors.surfaceAlt }}>
            <Icon name="arrow-left" size={18} color={colors.textDark} />
          </Link>
        }
        footer={
          <p className="text-center text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Pas encore de compte ?{" "}
            <Link href="/signup" className="font-extrabold" style={{ color: colors.primary }}>
              S&apos;inscrire
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center text-center">
          <Logo height="auth" />
          <h1 className="mt-6 text-xl font-black sm:text-[28px]" style={{ color: colors.primary }}>
            {fromRelance ? "Reviens continuer !" : "Bon retour !"}
          </h1>
          <p className="mt-1 text-sm font-semibold" style={{ color: colors.textSecondary }}>
            {fromRelance
              ? "Tes cours t’attendent. Connecte-toi pour reprendre exactement où tu t’étais arrêté."
              : "Reprends là où tu t'es arrêté."}
          </p>
        </div>

        <label className="mt-6 block">
          <span className="text-xs font-bold" style={{ color: colors.textDark }}>
            Adresse email
          </span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoCapitalize="none"
            placeholder="kofi@learnflow.tg"
            className="mt-1.5 w-full rounded-2xl border-2 px-4 py-3.5 text-sm font-semibold outline-none"
            style={{ borderColor: colors.border, background: colors.surfaceAlt, color: colors.textDark }}
          />
        </label>

        <label className="mt-3 block">
          <span className="flex items-center justify-between text-xs font-bold" style={{ color: colors.textDark }}>
            Mot de passe
            <span className="font-bold" style={{ color: colors.primary }}>
              Mot de passe oublié ?
            </span>
          </span>
          <div className="relative mt-1.5">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-2xl border-2 px-4 py-3.5 pr-12 text-sm font-semibold outline-none"
              style={{ borderColor: colors.border, background: colors.surfaceAlt, color: colors.textDark }}
            />
            <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
              <Icon name={showPw ? "eye-off" : "eye"} size={16} color="#94A3B8" />
            </button>
          </div>
        </label>

        <div className="mt-5">
          <PrimaryButton onClick={() => void goApp()} disabled={busy}>
            {busy ? "Connexion…" : "Se connecter"}
          </PrimaryButton>
        </div>

        {error ? <p className="mt-3 text-center text-xs font-bold text-red-500">{error}</p> : null}

        {googleError === "suspended" ? (
          <p className="mt-3 text-center text-xs font-bold text-red-500">
            Compte suspendu. Contacte l’admin LearnFlow.
          </p>
        ) : googleError ? (
          <p className="mt-3 text-center text-xs font-bold text-red-500">
            {googleError === "config"
              ? "Google n’est pas configuré. Ajoute les clés Supabase."
              : "Connexion Google interrompue. Réessaie et choisis ton compte."}
          </p>
        ) : null}

        <SocialAuth mode="login" onProvider={() => setError("Utilise Google, ou connecte-toi par email.")} />
      </AuthStage>
    </Page>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
