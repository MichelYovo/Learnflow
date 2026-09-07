"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Spira from "@/components/Spira";
import { Page } from "@/components/ui";
import { useAppTheme } from "@/theme/useAppTheme";

export default function SplashPage() {
  const router = useRouter();
  const { colors } = useAppTheme();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/profiles"), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <Page className="flex flex-col items-center justify-center gap-8">
      <Logo height="hero" float />
      <Spira scene="splash" size={120} message="On révise. On maîtrise." />
      <p className="text-sm font-bold" style={{ color: colors.textMuted }}>
        Programme APC Togo · collège & lycée
      </p>
    </Page>
  );
}
