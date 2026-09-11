"use client";

import { useEffect } from "react";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";

export default function RewardToast() {
  const toast = useLearnFlowStore((s) => s.rewards?.lastUnlock);
  const clear = useLearnFlowStore((s) => s.clearRewardToast);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => clear(), 4500);
    return () => window.clearTimeout(t);
  }, [toast, clear]);

  if (!toast) return null;

  return (
    <button
      type="button"
      onClick={clear}
      className="fixed left-4 right-4 top-16 z-[80] rounded-[20px] bg-[#1677FF] px-4 py-3 text-left shadow-lg sm:left-auto sm:right-6 sm:w-[360px]"
    >
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#BFDBFE]">
        {toast.badge ? "Nouveau badge" : toast.xp ? "Défi réussi" : "Bravo"}
      </p>
      <p className="mt-0.5 text-sm font-extrabold text-white">{toast.title}</p>
      <p className="mt-1 text-xs font-semibold leading-4 text-[#DBEAFE]">{toast.body}</p>
    </button>
  );
}
