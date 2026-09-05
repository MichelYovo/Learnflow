"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { Page, PrimaryButton } from "@/components/ui";
import { useAppTheme } from "@/theme/useAppTheme";

export default function LoginPage() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  return (
    <Page className="flex flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
        <Link href="/profiles" className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: colors.surfaceAlt }}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Link>
        <Logo height={48} />
        <h1 className="mt-6 text-2xl font-black">Bon retour !</h1>
        <p className="mt-1 text-sm font-semibold" style={{ color: colors.textSecondary }}>
          Reprends là où tu t&apos;es arrêté.
        </p>
        <label className="mt-6 text-sm font-extrabold">Adresse email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="mt-2 rounded-2xl border px-4 py-3 text-sm font-semibold outline-none"
          style={{ borderColor: colors.border, background: colors.white, color: colors.textDark }}
          placeholder="kofi@learnflow.tg"
        />
        <label className="mt-4 text-sm font-extrabold">Mot de passe</label>
        <div className="relative mt-2">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPw ? "text" : "password"}
            className="w-full rounded-2xl border px-4 py-3 pr-12 text-sm font-semibold outline-none"
            style={{ borderColor: colors.border, background: colors.white, color: colors.textDark }}
          />
          <button type="button" className="absolute right-3 top-3" onClick={() => setShowPw((v) => !v)}>
            <Icon name={showPw ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
          </button>
        </div>
        <div className="mt-6">
          <PrimaryButton onClick={() => router.push("/otp")}>Continuer</PrimaryButton>
        </div>
        <p className="mt-6 text-center text-xs font-bold" style={{ color: colors.textMuted }}>
          Auth sociale (démo) — le profil local est toujours créé.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["Google", "Apple", "Facebook"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => router.push("/otp")}
              className="rounded-2xl border py-3 text-xs font-extrabold"
              style={{ borderColor: colors.border, background: colors.white }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </Page>
  );
}
