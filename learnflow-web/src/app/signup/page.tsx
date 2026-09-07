"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import SocialAuth from "@/components/SocialAuth";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { CLASSES } from "@/data/mock";
import type { ClasseAPC } from "@/types/learnflow";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function SignUpPage() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const signUp = useLearnFlowStore((s) => s.signUp);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [classe, setClasse] = useState<ClasseAPC | "">("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const submit = (provider: "email" | "google" | "apple" | "facebook" = "email") => {
    if (provider === "email") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Indique ton prénom et ton nom.");
        return;
      }
      if (!email.includes("@")) {
        setError("Entre une adresse email valide.");
        return;
      }
      if (password.length < 8) {
        setError("Le mot de passe doit faire au moins 8 caractères.");
        return;
      }
      if (password !== confirm) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
      if (!classe) {
        setError("Choisis ta classe.");
        return;
      }
    }
    if (!classe) {
      if (provider !== "email") {
        setClasse("3eme");
      } else {
        setError("Choisis ta classe avant de continuer.");
        return;
      }
    }
    const chosenClasse = classe || "3eme";
    setError("");
    signUp({
      firstName: firstName.trim() || "Élève",
      lastName: lastName.trim() || provider,
      email: email.trim() || `${provider}@learnflow.tg`,
      classe: chosenClasse,
      provider,
    });
    router.push("/otp");
  };

  return (
    <Page>
      <AuthStage
        top={
          <Link href="/profiles" className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: colors.surfaceAlt }}>
            <Icon name="arrow-left" size={18} color={colors.textDark} />
          </Link>
        }
        footer={
          <p className="text-center text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-extrabold" style={{ color: colors.primary }}>
              Se connecter
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center text-center">
          <Logo height="auth" />
          <h1 className="mt-6 text-xl font-black sm:text-[28px]" style={{ color: colors.primary }}>
            Créer un compte
          </h1>
          <p className="mt-1 text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Inscris-toi pour commencer à apprendre.
          </p>
        </div>

        <Field label="Prénom" value={firstName} onChange={setFirstName} placeholder="Kofi" className="mt-6" />
        <Field label="Nom" value={lastName} onChange={setLastName} placeholder="Adjei" className="mt-3" />
        <Field label="Adresse email" value={email} onChange={setEmail} type="email" placeholder="kofi@learnflow.tg" className="mt-3" />

        <label className="mt-3 block">
          <span className="text-xs font-bold" style={{ color: colors.textDark }}>
            Mot de passe
          </span>
          <div className="relative mt-1.5">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPw ? "text" : "password"}
              placeholder="8 caractères minimum"
              className="w-full rounded-2xl border-2 px-4 py-3.5 pr-12 text-sm font-semibold outline-none"
              style={{ borderColor: colors.border, background: colors.surfaceAlt, color: colors.textDark }}
            />
            <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
              <Icon name={showPw ? "eye-off" : "eye"} size={16} color="#94A3B8" />
            </button>
          </div>
        </label>

        <Field
          label="Confirmer le mot de passe"
          value={confirm}
          onChange={setConfirm}
          type={showPw ? "text" : "password"}
          placeholder="Répète ton mot de passe"
          className="mt-3"
        />

        <label className="mt-3 block">
          <span className="text-xs font-bold" style={{ color: colors.textDark }}>
            Ma classe
          </span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {CLASSES.map((c) => {
              const on = classe === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setClasse(c.id)}
                  className="rounded-[14px] border-2 px-3.5 py-2.5 text-[13px] font-extrabold"
                  style={{
                    borderColor: on ? colors.primary : colors.border,
                    background: on ? colors.mathsBg : colors.white,
                    color: on ? colors.primary : colors.textMuted,
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </label>

        {error ? <p className="mt-3 text-xs font-bold text-red-500">{error}</p> : null}

        <div className="mt-4">
          <PrimaryButton onClick={() => submit("email")}>S&apos;inscrire</PrimaryButton>
        </div>

        <SocialAuth mode="signup" onProvider={(p) => submit(p)} />
      </AuthStage>
    </Page>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-bold" style={{ color: colors.textDark }}>
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        autoCapitalize={type === "email" ? "none" : undefined}
        className="mt-1.5 w-full rounded-2xl border-2 px-4 py-3.5 text-sm font-semibold outline-none"
        style={{ borderColor: colors.border, background: colors.surfaceAlt, color: colors.textDark }}
      />
    </label>
  );
}
