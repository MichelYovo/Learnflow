import { ensureBeginnerLeague, readOwnStudentProfile, trackActivity, upsertStudentProfile } from "./cloud";
import { isProfileComplete } from "./cloudTypes";
import { clearPendingAuth, loadPendingAuth } from "./pendingAuth";
import { markParentConfirmed } from "./parentConfirm";
import { notifySecureLogin } from "./secureAuth";
import { getBrowserSupabase } from "./supabase";
import type { SupabaseClient, User } from "@supabase/supabase-js";

async function currentAuthUser(supabase: SupabaseClient): Promise<User | null> {
  const first = await supabase.auth.getUser();
  if (first.data.user) return first.data.user;
  const session = await supabase.auth.getSession();
  return session.data.session?.user ?? null;
}

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
  const supabase = getBrowserSupabase();
  if (!supabase) return { next: "login", error: "config" };
  const user = await currentAuthUser(supabase);
  if (!user) return { next: "login", error: "session" };

  const pending = loadPendingAuth();
  const email = user.email ?? pending?.email ?? "";
  const metaName = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "").trim();

  const read = await readOwnStudentProfile();
  if (read.error === "read") return { next: "login", error: "profile" };
  if (read.error === "session") return { next: "login", error: "session" };
  if (read.error === "config") return { next: "login", error: "config" };
  const profile = read.profile;
  if (profile?.status === "suspendu") {
    await supabase.auth.signOut();
    return { next: "login", error: "suspended" };
  }

  const knownAccount = Boolean(profile);
  const otpOk = pending?.emailOtpVerified === true;
  // Email + mot de passe : pas de code email. Le code reste pour un premier compte Google.
  const passwordFlow = pending?.flow === "login" || pending?.flow === "signup";
  if (!knownAccount && !otpOk && !passwordFlow) {
    return { next: "otp" };
  }

  if (!profile && pending?.flow === "signup" && pending.classe && pending.parentPhone) {
    const nom = `${pending.firstName ?? ""} ${pending.lastName ?? ""}`.trim() || metaName || email.split("@")[0] || "Élève";
    const result = await upsertStudentProfile({
      id: user.id,
      parent_id: user.id,
      name: nom,
      email,
      class_level: pending.classe,
      parent_phone: pending.parentPhone,
      platform: "web",
      total_xp: 0,
      streak: 0,
      lessons_done: 0,
    });
    if (result.error) return { next: "login", error: "save" };
    await ensureBeginnerLeague(user.id);
    clearPendingAuth();
    void trackActivity("signup", { provider: "email" });
    void notifySecureLogin("signup");
    markParentConfirmed(user.id);
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

  if (!isProfileComplete(profile)) {
    return { next: "complete-profile" };
  }

  const xp = profile?.total_xp ?? 0;
  clearPendingAuth();
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
