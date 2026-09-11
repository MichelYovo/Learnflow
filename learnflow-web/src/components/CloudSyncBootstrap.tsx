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
        useLearnFlowStore.getState().pushInbox({
          id: "editor-notice-2026-09-11",
          kind: "system",
          title: "Message de l’éditeur",
          body: "L’accueil et les cours sont de nouveau disponibles. Bonne révision — l’équipe LearnFlow.",
        });
        useLearnFlowStore.getState().ensureDailyChallenges();
        useLearnFlowStore.getState().ensureWeeklyReviews();
        await pullEditorNotices();

        const supabase = getBrowserSupabase();
        if (!supabase) return;
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user || cancelled) return;

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
            id: user.id,
            email: user.email ?? profile.email ?? "",
            nom: profile.name ?? String(user.user_metadata?.full_name ?? "Élève"),
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
        if (!cancelled) await syncProgress();
        if (!cancelled) await refreshLeaderboard();
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
