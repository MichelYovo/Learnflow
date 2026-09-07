"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import ParentPhoneField from "@/components/ParentPhoneField";
import { AuthStage, Page, PrimaryButton } from "@/components/ui";
import { CLASSES, classLabel } from "@/data/mock";
import { ensureBeginnerLeague, trackActivity, upsertStudentProfile } from "@/lib/cloud";
import { isValidTogoLocal, toTogoE164 } from "@/lib/phoneTogo";
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
    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);
      setEmail(user.email ?? "");
      const metaName = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "").trim();
      setDisplayName(metaName || user.email?.split("@")[0] || "Élève");
      setReady(true);
    });
  }, [router]);

  const submit = async () => {
    if (!classe) {
      setError("Choisis ta classe.");
      return;
    }
    if (!isValidTogoLocal(parentLocal)) {
      setError("Indique le numéro parent togolais (8 chiffres après +228).");
      return;
    }
    setError("");
    setBusy(true);
    const phone = toTogoE164(parentLocal);
    const result = await upsertStudentProfile({
      id: userId,
      parent_id: userId,
      name: displayName,
      email,
      class_level: classe,
      parent_phone: phone,
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
    }, { fresh: true });
    void ensureBeginnerLeague(userId);
    void trackActivity("profile_complete", { classe, platform: "web" });
    router.replace("/focus");
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
            Compte Google : {email || displayName}. Indique ta classe et le numéro d’un parent.
          </p>
        </div>

        <label className="mt-6 block">
          <span className="text-xs font-bold" style={{ color: colors.textDark }}>
            Ma classe
          </span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {CLASSES.map((c) => {
              const on = classe === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setClasse(c.id)}
                  className="rounded-[14px] border-2 px-3.5 py-2.5 text-[13px] font-extrabold"
                  style={{
                    borderColor: on ? colors.primary : colors.border,
                    background: on ? colors.mathsBg : colors.white,
                    color: on ? colors.primary : colors.textMuted,
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </label>

        <ParentPhoneField value={parentLocal} onChange={setParentLocal} className="mt-4" />

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
