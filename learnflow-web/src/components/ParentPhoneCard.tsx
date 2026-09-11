"use client";

import { useState } from "react";
import ParentPhoneField from "@/components/ParentPhoneField";
import { upsertStudentProfile } from "@/lib/cloud";
import { isValidTogoLocal, normalizeTogoLocal, toTogoE164, TOGO_MOBILE_ERROR } from "@/lib/phoneTogo";
import { markParentConfirmed } from "@/lib/parentConfirm";
import { notifySecureLogin } from "@/lib/secureAuth";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function ParentPhoneCard() {
  const { colors } = useAppTheme();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [local, setLocal] = useState(() => normalizeTogoLocal(profile.parentPhone || ""));
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");

  const save = async () => {
    if (!isValidTogoLocal(local)) {
      setError(TOGO_MOBILE_ERROR);
      return;
    }
    if (!confirmed) {
      setError("Coche la case pour confirmer que ce numéro est celui d’un parent.");
      return;
    }
    setBusy(true);
    setError("");
    setFlash("");
    const phone = toTogoE164(local);
    const result = await upsertStudentProfile({
      id: profile.id,
      name: profile.nom,
      class_level: String(profile.classe),
      parent_phone: phone,
      email: profile.email,
      total_xp: profile.xpTotale,
      streak: profile.streak,
      lessons_done: profile.lessonsDone,
    });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    applyCloudUser({
      id: profile.id,
      email: profile.email ?? "",
      nom: profile.nom,
      classe: profile.classe,
      parentPhone: phone,
      xpTotale: profile.xpTotale,
      streak: profile.streak,
      lessonsDone: profile.lessonsDone,
      avatarId: profile.avatarId,
    });
    void notifySecureLogin("parent_linked");
    markParentConfirmed(profile.id);
    setFlash("Le parent va recevoir un WhatsApp d’accueil LearnFlow.");
  };

  return (
    <article className="mt-6 rounded-3xl border-2 p-4" style={{ background: colors.white, borderColor: colors.border }}>
      <h2 className="text-[18px] font-extrabold">Suivi parent</h2>
      <p className="mt-1 text-[13px] font-medium leading-5" style={{ color: colors.textSecondary }}>
        Ce numéro n’est pas le tien. C’est celui de ton père, ta mère ou ton tuteur.
      </p>
      <ParentPhoneField
        value={local}
        onChange={setLocal}
        confirmed={confirmed}
        onConfirmChange={setConfirmed}
        className="mt-3"
        optional
      />
      {error ? <p className="mt-2 text-xs font-bold text-red-500">{error}</p> : null}
      {flash ? <p className="mt-2 text-xs font-bold" style={{ color: colors.secondary }}>{flash}</p> : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => void save()}
        className="mt-3 w-full rounded-2xl bg-[#1677FF] py-3 text-sm font-extrabold text-white disabled:opacity-60"
      >
        {busy ? "Envoi…" : profile.parentPhone ? "Mettre à jour le numéro parent" : "Enregistrer le WhatsApp parent"}
      </button>
    </article>
  );
}
