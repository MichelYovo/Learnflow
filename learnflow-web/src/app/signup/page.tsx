"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { Page, PrimaryButton } from "@/components/ui";
import { AVATAR_IDS } from "@/data/avatars";
import { CLASSES } from "@/data/mock";
import type { ClasseAPC } from "@/types/learnflow";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import Avatar from "@/components/Avatar";

export default function SignUpPage() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const signUp = useLearnFlowStore((s) => s.signUp);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classe, setClasse] = useState<ClasseAPC>("3eme");
  const [pin, setPin] = useState("");
  const [avatarId, setAvatarId] = useState("a07");
  const [error, setError] = useState("");

  const submit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Indique prénom et nom.");
      return;
    }
    if (!email.includes("@")) {
      setError("Email invalide.");
      return;
    }
    if (password.length < 8) {
      setError("Mot de passe : 8 caractères minimum.");
      return;
    }
    if (pin && !/^\d{4}$/.test(pin)) {
      setError("PIN : 4 chiffres.");
      return;
    }
    signUp({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), classe, pin, avatarId });
    router.push("/otp");
  };

  return (
    <Page className="flex flex-col">
      <div className="mx-auto w-full max-w-lg px-6 py-8">
        <Link href="/profiles" className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: colors.surfaceAlt }}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Link>
        <h1 className="text-2xl font-black">Créer un profil</h1>
        <p className="mt-1 text-sm font-semibold" style={{ color: colors.textSecondary }}>
          Un élève, une progression. Programme APC Togo.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Field label="Prénom" value={firstName} onChange={setFirstName} />
          <Field label="Nom" value={lastName} onChange={setLastName} />
        </div>
        <Field label="Email" value={email} onChange={setEmail} className="mt-3" />
        <Field label="Mot de passe" value={password} onChange={setPassword} type="password" className="mt-3" />
        <label className="mt-4 block text-sm font-extrabold">Classe</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CLASSES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setClasse(c.id)}
              className="rounded-full border px-3 py-1.5 text-xs font-extrabold"
              style={{
                borderColor: classe === c.id ? colors.primary : colors.border,
                background: classe === c.id ? "#E6F4FF" : colors.white,
                color: classe === c.id ? colors.primary : colors.textDark,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-extrabold">Avatar</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {AVATAR_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setAvatarId(id)}
              className="rounded-full ring-offset-2"
              style={{ outline: avatarId === id ? `3px solid ${colors.primary}` : "none" }}
            >
              <Avatar avatarId={id} size={44} />
            </button>
          ))}
        </div>
        <Field label="PIN 4 chiffres (optionnel)" value={pin} onChange={(v) => setPin(v.replace(/\D/g, "").slice(0, 4))} className="mt-3" />
        {error ? <p className="mt-3 text-sm font-bold text-red-500">{error}</p> : null}
        <div className="mt-6">
          <PrimaryButton onClick={submit}>Créer mon compte</PrimaryButton>
        </div>
      </div>
    </Page>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-extrabold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none"
        style={{ borderColor: colors.border, background: colors.white, color: colors.textDark }}
      />
    </label>
  );
}
