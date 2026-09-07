"use client";

import { AvatarChoiceGrid } from "@/components/AvatarPicker";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function AvatarGate() {
  const { colors } = useAppTheme();
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const avatarId = useLearnFlowStore((s) => s.getActiveProfile()?.avatarId);
  const updateProfileAvatar = useLearnFlowStore((s) => s.updateProfileAvatar);

  if (!isAuthenticated || avatarId) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/45 md:items-center">
      <div
        className="relative z-10 w-full max-w-md rounded-t-[28px] px-4 pb-5 pt-5 md:rounded-[28px]"
        style={{ background: colors.white, paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <p className="text-[22px] font-extrabold" style={{ color: colors.textDark }}>
          Choisis ton avatar
        </p>
        <p className="mt-2 text-[13px] font-medium leading-[18px]" style={{ color: colors.textMuted }}>
          Une seule fois : il t’identifie dans les ligues et sur ton profil. Personne ne te l’attribue à ta place.
        </p>
        <div className="mt-3">
          <AvatarChoiceGrid selectedId={avatarId} onSelect={updateProfileAvatar} />
        </div>
        <p className="mt-3 text-center text-xs font-bold" style={{ color: colors.textMuted }}>
          Touche un visage pour continuer.
        </p>
      </div>
    </div>
  );
}
