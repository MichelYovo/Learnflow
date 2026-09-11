"use client";

import { useEffect } from "react";
import { isCloudProfileId } from "@/data/mock";
import { refreshPublishedCatalog } from "@/data/publishedCache";
import { fetchOwnStudentProfile, trackActivity } from "@/lib/cloud";
import { isProfileComplete } from "@/lib/cloudTypes";
import { fetchLeagueLeaderboard, subscribeLeagueLive } from "@/lib/leagueLive";
import { requestProgressSync, syncProgress } from "@/lib/progressSync";
import { getBrowserSupabase } from "@/lib/supabase";
import { pullEditorNotices } from "@/lib/editorNotices";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useHydrated } from "./useHydrated";

async function refreshLeaderboard(): Promise<void> {
  const state = useLearnFlowStore.getState();
  if (!state.isAuthenticated || !isCloudProfileId(state.activeProfileId)) return;
  const profile = state.getActiveProfile();
  const players = await fetchLeagueLeaderboard(state.ligue.nomLigue, String(state.activeProfileId), {
    name: profile.nom,
    avatarId: profile.avatarId,
    initials: profile.firstName?.slice(0, 2),
  });
  const store = useLearnFlowStore.getState();
  store.setLeagueBoard(players);
  const me = players.find((p) => p.you);
  if (me) {
    store.applyRemoteLeague(String(store.activeProfileId), me.xp, me.rank, store.ligue.nomLigue);
  }
}

export default function CloudSyncBootstrap() {
  const ready = useHydrated();

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    const restore = async () => {
      try {
        const supabase = getBrowserSupabase();
        const sessionUser = supabase ? (await supabase.auth.getSession()).data.session?.user : null;
        if (cancelled) return;

        if (sessionUser && supabase) {
          await refreshPublishedCatalog("web");
          if (cancelled) return;
          const profile = await fetchOwnStudentProfile();
          if (cancelled) return;
          if (profile?.status === "suspendu") {
            useLearnFlowStore.getState().logout();
            return;
          }
          if (profile) {
            useLearnFlowStore.getState().applyCloudUser({
              id: sessionUser.id,
              email: sessionUser.email ?? profile.email ?? "",
              nom: profile.name ?? String(sessionUser.user_metadata?.full_name ?? "Élève"),
              classe: profile.class_level ?? "3eme",
              parentPhone: profile.parent_phone ?? "",
              xpTotale: profile.total_xp ?? 0,
              streak: profile.streak ?? 0,
              lessonsDone: profile.lessons_done ?? 0,
              avatarId: profile.avatar_id ?? undefined,
            });
            if (typeof sessionStorage !== "undefined" && !sessionStorage.getItem("lf-login-logged")) {
              sessionStorage.setItem("lf-login-logged", "1");
              void trackActivity("login", { source: "restore", xp: profile.total_xp ?? 0 });
            }
            void trackActivity("heartbeat", { xp: profile.total_xp ?? 0, source: "restore" });
          } else if (!isProfileComplete(profile)) {
            return;
          }
        }

        useLearnFlowStore.getState().ensureDailyChallenges();
        useLearnFlowStore.getState().ensureWeeklyReviews();
        if (sessionUser) await pullEditorNotices();
        if (sessionUser && !cancelled) await syncProgress();
        if (sessionUser && !cancelled) await refreshLeaderboard();
      } catch {
        /* offline / malformed cloud payload */
      }
    };

    void restore();

    const onVis = () => {
      if (document.visibilityState === "visible") {
        void refreshPublishedCatalog("web");
        requestProgressSync();
        void refreshLeaderboard();
        void trackActivity("heartbeat", { source: "visible" });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    const interval = setInterval(() => {
      requestProgressSync();
      void refreshLeaderboard();
      void trackActivity("heartbeat", { source: "poll" });
    }, 20_000);
    const stopLive = subscribeLeagueLive(() => {
      void refreshLeaderboard();
    });
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(interval);
      stopLive();
    };
  }, [ready]);

  return null;
}
