"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import ParentPhoneField from "@/components/ParentPhoneField";
import ClassPicker from "@/components/ClassPicker";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { classLabel } from "@/data/mock";
import { ensureBeginnerLeague, fetchOwnStudentProfile, trackActivity, upsertStudentProfile } from "@/lib/cloud";
import { isProfileComplete } from "@/lib/cloudTypes";
import { isValidTogoLocal, toTogoE164 } from "@/lib/phoneTogo";
import { notifySecureLogin } from "@/lib/secureAuth";
import { getBrowserSupabase } from "@/lib/supabase";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { ClasseAPC } from "@/types/learnflow";

export default function CompleteProfilePage() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [classe, setClasse] = useState<ClasseAPC | "">("");
  const [parentLocal, setParentLocal] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("Élève");

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) {
      router.replace("/login?error=config");
      return;
    }
    void supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }
      const existing = await fetchOwnStudentProfile();
      if (isProfileComplete(existing)) {
        applyCloudUser(
          {
            id: user.id,
            email: user.email ?? existing?.email ?? "",
            nom: existing?.name ?? String(user.user_metadata?.full_name ?? "Élève"),
            classe: existing?.class_level ?? "3eme",
            parentPhone: existing?.parent_phone ?? "",
            xpTotale: existing?.total_xp ?? 0,
            streak: existing?.streak ?? 0,
            lessonsDone: existing?.lessons_done ?? 0,
            avatarId: existing?.avatar_id ?? undefined,
          },
          { fresh: (existing?.total_xp ?? 0) === 0, authenticate: false },
        );
        void trackActivity("login", { provider: "google" });
        void notifySecureLogin("login");
        router.replace("/success");
        return;
      }
      setUserId(user.id);
      setEmail(user.email ?? "");
      const metaName = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "").trim();
      setDisplayName(metaName || user.email?.split("@")[0] || "Élève");
      setReady(true);
    });
  }, [applyCloudUser, router]);

  const submit = async () => {
    if (!classe) {
      setError("Choisis ta classe.");
      return;
    }
    const phone = isValidTogoLocal(parentLocal) ? toTogoE164(parentLocal) : undefined;
    setError("");
    setBusy(true);
    const result = await upsertStudentProfile({
      id: userId,
      parent_id: userId,
      name: displayName,
      email,
      class_level: classe,
      parent_phone: phone ?? null,
      platform: "web",
      total_xp: 0,
      streak: 0,
      lessons_done: 0,
    });
    if (result.error) {
      setError(result.error);
      setBusy(false);
      return;
    }
    applyCloudUser({
      id: userId,
      email,
      nom: displayName,
      classe,
      parentPhone: phone,
      xpTotale: 0,
      streak: 0,
      lessonsDone: 0,
      rang: 1,
    }, { fresh: true, authenticate: false });
    void ensureBeginnerLeague(userId);
    void trackActivity("profile_complete", { classe, platform: "web" });
    void notifySecureLogin(phone ? "parent_linked" : "profile_complete");
    router.replace("/success");
  };

  if (!ready) {
    return (
      <Page className="flex min-h-dvh items-center justify-center">
        <p className="text-sm font-bold" style={{ color: colors.textMuted }}>
          Chargement…
        </p>
      </Page>
    );
  }

  return (
    <Page>
      <AuthStage>
        <div className="flex flex-col items-center text-center">
          <Logo height="auth" />
          <h1 className="mt-6 text-xl font-black sm:text-[28px]" style={{ color: colors.primary }}>
            Dernière étape
          </h1>
          <p className="mt-1 text-sm font-semibold" style={{ color: colors.textSecondary }}>
            Compte Google : {email || displayName}. Choisis ta classe pour continuer.
          </p>
        </div>

        <label className="mt-6 block">
          <span className="text-xs font-bold" style={{ color: colors.textDark }}>
            Ma classe
          </span>
          <div className="mt-1.5">
            <ClassPicker value={classe} onChange={setClasse} />
          </div>
        </label>

        <ParentPhoneField value={parentLocal} onChange={setParentLocal} className="mt-4" />
        <p className="mt-2 text-[11px] font-semibold" style={{ color: colors.textMuted }}>
          Numéro parent facultatif. S’il est renseigné, un WhatsApp LearnFlow part aux parents à chaque connexion.
        </p>

        {error ? <p className="mt-3 text-xs font-bold text-red-500">{error}</p> : null}

        <div className="mt-5">
          <PrimaryButton onClick={() => void submit()} disabled={busy}>
            {busy ? "Enregistrement…" : "Continuer"}
          </PrimaryButton>
        </div>
        {classe ? (
          <p className="mt-3 text-center text-[11px] font-semibold" style={{ color: colors.textMuted }}>
            Classe sélectionnée : {classLabel(classe)}
          </p>
        ) : null}
      </AuthStage>
    </Page>
  );
}
