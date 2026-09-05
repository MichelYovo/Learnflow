"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import Spira from "@/components/Spira";
import { ScreenHeader } from "@/components/ui";
import { useAppTheme } from "@/theme/useAppTheme";

export default function AboutPage() {
  const { colors } = useAppTheme();
  return (
    <div>
      <ScreenHeader title="À propos" backHref="/app/profil" />
      <div className="mx-auto max-w-xl space-y-3.5 px-5 py-5">
        <div className="flex flex-col items-center gap-2.5 py-4">
          <Logo height={100} />
          <p className="text-[13px] font-semibold" style={{ color: colors.textMuted }}>
            Version 1.0.0 · Togo · APC
          </p>
        </div>
        <div className="flex justify-center">
          <Spira scene="settings.about" size={72} message="" />
        </div>
        <div className="rounded-[20px] border-2 p-4" style={{ background: colors.white, borderColor: colors.border }}>
          <p className="text-[15px] font-extrabold">Mission</p>
          <p className="mt-1.5 text-[13px] font-medium leading-[18px]" style={{ color: colors.textSecondary }}>
            Application d&apos;apprentissage pour collégiens et lycéens : fiches, flashcards (algo des J), règle du 10/10, 4
            modes (Libre, Guidé, Cramming, Blitz) et ligues.
          </p>
        </div>
        <div className="rounded-[20px] border-2 p-4" style={{ background: colors.white, borderColor: colors.border }}>
          <p className="text-[15px] font-extrabold">Crédits</p>
          <p className="mt-1.5 text-[13px] font-medium leading-[18px]" style={{ color: colors.textSecondary }}>
            LearnFlow MVP · Design Figma · Next.js · Offline-first
          </p>
          <a href="https://icons8.com" className="mt-2 inline-block text-[13px] font-semibold" style={{ color: colors.primary }}>
            Icônes de navigation : Icons8
          </a>
        </div>
        <a
          href="mailto:support@learnflow.tg?subject=LearnFlow%20Support"
          className="flex items-center gap-2 rounded-[16px] border-2 px-4 py-3.5 font-extrabold"
          style={{ background: colors.white, borderColor: colors.mathsBorder, color: colors.primary }}
        >
          <Icon name="mail" size={16} color={colors.primary} />
          Contacter le support
        </a>
        <Link
          href="/app/settings/privacy"
          className="flex items-center gap-2 rounded-[16px] border-2 px-4 py-3.5 font-extrabold"
          style={{ background: colors.white, borderColor: colors.mathsBorder, color: colors.primary }}
        >
          <Icon name="shield" size={16} color={colors.primary} />
          Politique de confidentialité
        </Link>
      </div>
    </div>
  );
}
