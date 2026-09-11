"use client";

import { useState } from "react";
import { AppMain, ScreenHeader, SettingsToggleRow } from "@/components/ui";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function PrivacyPage() {
  const { colors } = useAppTheme();
  const prefs = useLearnFlowStore((s) => s.settings.privacy);
  const update = useLearnFlowStore((s) => s.updatePrivacyPrefs);
  const clearLocalCache = useLearnFlowStore((s) => s.clearLocalCache);
  const [confirm, setConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);

  return (
    <div>
      <ScreenHeader title="Confidentialité" backHref="/app/profil" />
      <AppMain narrow className="space-y-3 py-5">
        <p className="text-[13px] font-medium leading-[18px]" style={{ color: colors.textSecondary }}>
          Tes données élève restent offline-first sur cet appareil. Tu contrôles ce qui peut être partagé.
        </p>
        <div className="overflow-hidden rounded-[20px] border-2" style={{ background: colors.white, borderColor: colors.border }}>
          <SettingsToggleRow
            label="Profil visible en ligue"
            sub="Afficher ton prénom dans le classement du groupe"
            value={prefs.showInLeague}
            onChange={(v) => update({ showInLeague: v })}
          />
          <SettingsToggleRow
            label="Partage de score Blitz"
            sub="Autoriser le texte WhatsApp après un Blitz 60s"
            value={prefs.shareBlitzScores}
            onChange={(v) => update({ shareBlitzScores: v })}
          />
          <SettingsToggleRow
            label="WhatsApp parent"
            sub="Accueil + point de progrès toutes les 1 à 2 semaines — pas à chaque connexion"
            value={prefs.parentSmsPassive}
            onChange={(v) => update({ parentSmsPassive: v })}
          />
          <SettingsToggleRow
            label="Analytique anonyme"
            sub="Aider à améliorer LearnFlow sans contenu de cours"
            value={prefs.anonymousAnalytics}
            onChange={(v) => update({ anonymousAnalytics: v })}
            last
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setCleared(false);
            setConfirm(true);
          }}
          className="w-full rounded-2xl border-2 py-3.5 text-sm font-extrabold"
          style={{ background: colors.white, borderColor: "#FECACA", color: colors.danger }}
        >
          Effacer le cache local
        </button>
        {cleared ? (
          <p className="text-center text-[13px] font-bold" style={{ color: colors.secondary }}>
            Cache local nettoyé.
          </p>
        ) : null}
        <p className="text-[11px] font-medium leading-4" style={{ color: colors.textMuted }}>
          LearnFlow Togo · Les profils multi-élèves sont stockés localement. Aucun mot de passe n&apos;est envoyé hors
          appareil en mode démo.
        </p>
      </AppMain>

      {confirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6">
          <div className="w-full max-w-sm rounded-3xl p-5" style={{ background: colors.white }}>
            <p className="text-lg font-extrabold">Effacer le cache local ?</p>
            <p className="mt-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
              Les préférences et le profil actif sont conservés. Les sessions temporaires seront réinitialisées.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="flex-1 rounded-2xl py-3 text-sm font-extrabold"
                style={{ background: colors.surfaceAlt }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  clearLocalCache();
                  setConfirm(false);
                  setCleared(true);
                }}
                className="flex-1 rounded-2xl py-3 text-sm font-extrabold text-white"
                style={{ background: colors.danger }}
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
