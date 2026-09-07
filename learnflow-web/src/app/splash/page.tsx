"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { useAppTheme } from "@/theme/useAppTheme";

export default function SplashPage() {
  const { colors } = useAppTheme();

  return (
    <Page>
      <AuthStage
        footer={
          <div className="space-y-3">
            <PrimaryButton href="/signup">Créer un compte</PrimaryButton>
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-2xl border-2 px-5 py-3.5 text-sm font-extrabold"
              style={{ borderColor: colors.borderStrong, background: colors.white, color: colors.textDark }}
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Logo height={88} />
          <p className="text-base font-bold" style={{ color: colors.primary }}>
            Programme APC Togo
          </p>
          <p className="max-w-sm text-[15px] font-medium leading-[22px]" style={{ color: colors.textSecondary }}>
            Fiches, quiz 10/10 et ligues — collège et lycée, même hors ligne.
          </p>
        </div>
      </AuthStage>
    </Page>
  );
}
