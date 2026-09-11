"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AvatarChoiceGrid } from "@/components/AvatarPicker";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function AvatarGate() {
  const { colors } = useAppTheme();
  const pathname = usePathname();
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const avatarId = useLearnFlowStore((s) => s.getActiveProfile()?.avatarId);
  const updateProfileAvatar = useLearnFlowStore((s) => s.updateProfileAvatar);
  const wasProfil = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onProfil = pathname === "/app/profil" || pathname.startsWith("/app/profil/");
    if (onProfil) {
      wasProfil.current = true;
      return;
    }
    if (wasProfil.current && isAuthenticated && !avatarId) {
      setOpen(true);
    }
    wasProfil.current = false;
  }, [pathname, isAuthenticated, avatarId]);

  if (!open || !isAuthenticated || avatarId) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/45 md:items-center">
      <div
        className="relative z-10 w-full max-w-md rounded-t-[28px] px-4 pb-5 pt-5 md:rounded-[28px]"
        style={{ background: colors.white, paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <p className="text-[22px] font-extrabold" style={{ color: colors.textDark }}>
          Choisis ta personnalité
        </p>
        <p className="mt-2 text-[13px] font-medium leading-[18px]" style={{ color: colors.textMuted }}>
          Elle te suit dans les ligues et sur ton profil. Son look évolue avec ton rang — pas à chaque connexion.
        </p>
        <div className="mt-3">
          <AvatarChoiceGrid
            selectedId={avatarId}
            onSelect={(id) => {
              updateProfileAvatar(id);
              setOpen(false);
            }}
          />
        </div>
        <p className="mt-3 text-center text-xs font-bold" style={{ color: colors.textMuted }}>
          Touche une mascotte pour continuer.
        </p>
      </div>
    </div>
  );
}
