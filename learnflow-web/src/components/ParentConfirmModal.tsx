"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isCloudProfileId } from "@/data/mock";
import { hasParentConfirmed, markParentConfirmed } from "@/lib/parentConfirm";
import { isLikelyTogoMobile, maskTogoPhone } from "@/lib/phoneTogo";
import { notifySecureLogin } from "@/lib/secureAuth";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function ParentConfirmModal() {
  const { colors } = useAppTheme();
  const pathname = usePathname();
  const router = useRouter();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const authenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const [mode, setMode] = useState<"confirm" | "invalid" | null>(null);

  useEffect(() => {
    if (!authenticated || !isCloudProfileId(profile.id)) {
      setMode(null);
      return;
    }
    if (pathname.startsWith("/app/profil") || pathname.startsWith("/app/settings")) {
      setMode(null);
      return;
    }
    const phone = profile.parentPhone || "";
    if (!phone) {
      setMode(null);
      return;
    }
    if (!isLikelyTogoMobile(phone)) {
      setMode("invalid");
      return;
    }
    if (hasParentConfirmed(profile.id)) {
      setMode(null);
      return;
    }
    setMode("confirm");
  }, [authenticated, pathname, profile.id, profile.parentPhone]);

  if (!mode || !profile.parentPhone) return null;

  const confirm = () => {
    markParentConfirmed(profile.id);
    void notifySecureLogin("parent_linked");
    setMode(null);
  };

  const goFix = () => {
    setMode(null);
    router.push("/app/profil");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-[24px] p-5" style={{ background: colors.white }}>
        {mode === "invalid" ? (
          <>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#EF4444]">Numéro à corriger</p>
            <h2 className="mt-1 text-lg font-black text-[#1C1917]">Ce WhatsApp parent n’est pas un mobile Togo</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed" style={{ color: colors.textSecondary }}>
              Tu as enregistré {maskTogoPhone(profile.parentPhone)}. Un numéro Togo commence par 7 (Moov) ou 9
              (Togocel). Corrige-le pour que ton parent puisse recevoir les messages.
            </p>
            <button
              type="button"
              onClick={goFix}
              className="mt-4 w-full rounded-2xl bg-[#1677FF] py-3 text-sm font-extrabold text-white"
            >
              Corriger le numéro
            </button>
          </>
        ) : (
          <>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#1677FF]">Vérification</p>
            <h2 className="mt-1 text-lg font-black text-[#1C1917]">C’est bien le WhatsApp de ton parent ?</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed" style={{ color: colors.textSecondary }}>
              Tu as enregistré {maskTogoPhone(profile.parentPhone)}. LearnFlow enverra un message d’accueil et un
              petit point de progrès à ce numéro — pas au tien.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={confirm}
                className="rounded-2xl bg-[#1677FF] py-3 text-sm font-extrabold text-white"
              >
                Oui, c’est mon père, ma mère ou mon tuteur
              </button>
              <button
                type="button"
                onClick={goFix}
                className="rounded-2xl bg-[#F0EFEE] py-3 text-sm font-extrabold text-[#1C1917]"
              >
                Non, je corrige le numéro
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
