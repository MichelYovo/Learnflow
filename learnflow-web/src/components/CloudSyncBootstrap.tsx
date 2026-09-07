"use client";

import { useEffect } from "react";
import { isCloudProfileId } from "@/data/mock";
import { fetchOwnStudentProfile } from "@/lib/cloud";
import { isProfileComplete } from "@/lib/cloudTypes";
import { requestProgressSync, syncProgress } from "@/lib/progressSync";
import { getBrowserSupabase } from "@/lib/supabase";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useHydrated } from "./useHydrated";

export default function CloudSyncBootstrap() {
  const ready = useHydrated();

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    const restore = async () => {
      const supabase = getBrowserSupabase();
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user || cancelled) return;

      const state = useLearnFlowStore.getState();
      const alreadyCloud = isCloudProfileId(state.activeProfileId) && state.activeProfileId === user.id && state.isAuthenticated;
      if (!alreadyCloud) {
        const profile = await fetchOwnStudentProfile();
        if (cancelled || !isProfileComplete(profile)) return;
        useLearnFlowStore.getState().applyCloudUser({
          id: user.id,
          email: user.email ?? profile?.email ?? "",
          nom: profile?.name ?? String(user.user_metadata?.full_name ?? "Élève"),
          classe: profile?.class_level ?? "3eme",
          parentPhone: profile?.parent_phone ?? "",
          xpTotale: profile?.total_xp ?? 0,
          streak: profile?.streak ?? 0,
          lessonsDone: profile?.lessons_done ?? 0,
          avatarId: profile?.avatar_id ?? undefined,
        });
      }
      if (!cancelled) await syncProgress();
    };

    void restore();

    const onVis = () => {
      if (document.visibilityState === "visible") requestProgressSync();
    };
    document.addEventListener("visibilitychange", onVis);
    const interval = setInterval(() => requestProgressSync(), 45_000);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(interval);
    };
  }, [ready]);

  return null;
}
