import { ensureBeginnerLeague, fetchOwnStudentProfile, isProfileComplete, trackActivity, upsertStudentProfile } from "./cloud";
import { clearPendingAuth, loadPendingAuth } from "./pendingAuth";
import { notifySecureLogin } from "./secureAuth";
import { isSupabaseConfigured, supabase } from "./supabase";

export type CloudUserInput = {
  id: string;
  email: string;
  nom: string;
  classe: string;
  parentPhone?: string;
  xpTotale?: number;
  streak?: number;
  lessonsDone?: number;
  rang?: number;
  avatarId?: string;
};

export async function settleVerifiedUser(): Promise<
  | { next: "login"; error?: string }
  | { next: "otp" }
  | { next: "complete-profile" }
  | { next: "ready"; user: CloudUserInput; fresh: boolean; event: "login" | "signup" | "profile_complete" }
> {
  if (!isSupabaseConfigured) return { next: "login", error: "config" };
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { next: "login", error: "session" };

  const pending = await loadPendingAuth();
  if (pending?.email && pending.emailOtpVerified !== true) {
    return { next: "otp" };
  }
  const email = user.email ?? pending?.email ?? "";
  const metaName = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "").trim();

  if (pending?.flow === "signup" && pending.classe && pending.parentPhone) {
    const nom = `${pending.firstName ?? ""} ${pending.lastName ?? ""}`.trim() || metaName || email.split("@")[0] || "Élève";
    if (pending.password) {
      await supabase.auth.updateUser({ password: pending.password });
    }
    const result = await upsertStudentProfile({
      id: user.id,
      parent_id: user.id,
      name: nom,
      email,
      class_level: pending.classe,
      parent_phone: pending.parentPhone,
      platform: "mobile",
      total_xp: 0,
      streak: 0,
      lessons_done: 0,
    });
    if (result.error) return { next: "login", error: result.error };
    await ensureBeginnerLeague(user.id);
    await clearPendingAuth();
    void trackActivity("signup", { provider: "email" });
    void notifySecureLogin("signup");
    return {
      next: "ready",
      fresh: true,
      event: "signup",
      user: {
        id: user.id,
        email,
        nom,
        classe: pending.classe,
        parentPhone: pending.parentPhone,
        xpTotale: 0,
        streak: 0,
        lessonsDone: 0,
        rang: 1,
      },
    };
  }

  const profile = await fetchOwnStudentProfile();
  if (profile?.status === "suspendu") {
    await supabase.auth.signOut();
    return { next: "login", error: "suspended" };
  }
  if (!isProfileComplete(profile)) {
    return { next: "complete-profile" };
  }

  const xp = profile?.total_xp ?? 0;
  await clearPendingAuth();
  const event = pending?.flow === "signup" ? "signup" : "login";
  void trackActivity(event, { provider: pending?.flow ?? "email" });
  void notifySecureLogin(event);
  return {
    next: "ready",
    fresh: false,
    event,
    user: {
      id: user.id,
      email: email || profile?.email || "",
      nom: profile?.name ?? (metaName || "Élève"),
      classe: profile?.class_level ?? "3eme",
      parentPhone: profile?.parent_phone ?? "",
      xpTotale: xp,
      streak: profile?.streak ?? 0,
      lessonsDone: profile?.lessons_done ?? 0,
      avatarId: profile?.avatar_id ?? undefined,
    },
  };
}
