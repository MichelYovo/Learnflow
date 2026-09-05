"use client";

import { ScreenHeader } from "@/components/ui";
import { PARENT_NOTES } from "@/data/mock";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function ParentsPage() {
  const { colors } = useAppTheme();
  const suivi = useLearnFlowStore((s) => s.suiviParental);
  const profile = useLearnFlowStore((s) => s.getActiveProfile());

  return (
    <div>
      <ScreenHeader title="Espace parent" backHref="/app/profil" />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-6 md:px-8">
        <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
          Carnet de {profile.firstName}. Les SMS ne sont que des félicitations (10/10, Challenger) — jamais de surveillance de session.
        </p>
        <div className="rounded-2xl border p-4" style={{ background: colors.white, borderColor: colors.border }}>
          <p className="text-sm font-extrabold">SMS passif</p>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {suivi.estSMSPassifActif ? "Actif" : "Désactivé"} · {suivi.telParent}
          </p>
          <p className="mt-1 text-xs font-semibold" style={{ color: colors.textMuted }}>
            Dernier envoi : {suivi.dernierSMSNotification ? new Date(suivi.dernierSMSNotification).toLocaleString("fr-FR") : "aucun"}
          </p>
        </div>
        {PARENT_NOTES.map((n) => (
          <div key={n.matiere} className="flex items-center justify-between rounded-2xl border p-4" style={{ background: colors.white, borderColor: colors.border }}>
            <span className="font-extrabold">{n.matiere}</span>
            <span className="text-lg font-black" style={{ color: colors.primary }}>
              {n.score}/20
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
