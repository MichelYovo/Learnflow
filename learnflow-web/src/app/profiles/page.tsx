"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import { Page, PrimaryButton } from "@/components/ui";
import { classLabel } from "@/data/mock";
import { DEMO_PIN, pinsMatch } from "@/lib/pin";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { ProfileEleve } from "@/types/learnflow";

export default function ProfilesPage() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const profiles = useLearnFlowStore((s) => s.profiles);
  const selectProfile = useLearnFlowStore((s) => s.selectProfile);
  const [pending, setPending] = useState<ProfileEleve | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const unlock = () => {
    if (!pending) return;
    if (!pinsMatch(pin, DEMO_PIN)) {
      setError("Code PIN incorrect. Démo : 1234");
      return;
    }
    selectProfile(pending.id);
    router.replace("/focus");
  };

  return (
    <Page className="flex flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-10">
        <Logo height={44} />
        <h1 className="mt-8 text-2xl font-black">Qui révise aujourd&apos;hui ?</h1>
        <p className="mt-2 text-sm font-semibold" style={{ color: colors.textMuted }}>
          Chaque élève garde sa progression séparée. PIN démo : 1234
        </p>
        <div className="mt-6 space-y-3">
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setError(null);
                setPin("");
                if (p.hasPin) setPending(p);
                else {
                  selectProfile(p.id);
                  router.replace("/focus");
                }
              }}
              className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left"
              style={{ background: colors.white, borderColor: colors.border }}
            >
              <Avatar avatarId={p.avatarId} size={56} initials={p.firstName} fallbackColor={p.color} />
              <span className="flex-1">
                <span className="block text-base font-extrabold">{p.nom}</span>
                <span className="text-sm font-semibold" style={{ color: colors.textMuted }}>
                  {classLabel(p.classe)} · {p.xpTotale.toLocaleString()} XP
                </span>
              </span>
            </button>
          ))}
        </div>
        {pending ? (
          <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: colors.mathsBorder, background: colors.white }}>
            <p className="text-sm font-extrabold">PIN de {pending.firstName}</p>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              maxLength={4}
              className="mt-3 w-full rounded-xl border px-4 py-3 text-center text-2xl font-black tracking-[0.4em] outline-none"
              style={{ borderColor: colors.border, background: colors.surface, color: colors.textDark }}
              placeholder="••••"
            />
            {error ? <p className="mt-2 text-sm font-bold text-red-500">{error}</p> : null}
            <div className="mt-3">
              <PrimaryButton onClick={unlock}>Déverrouiller</PrimaryButton>
            </div>
          </div>
        ) : null}
        <div className="mt-auto space-y-3 pt-8">
          <PrimaryButton href="/signup">Créer un profil</PrimaryButton>
          <Link href="/login" className="block text-center text-sm font-extrabold" style={{ color: colors.primary }}>
            J&apos;ai déjà un compte
          </Link>
        </div>
      </div>
    </Page>
  );
}
