"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { AppMain, ScreenHeader, SettingsToggleRow } from "@/components/ui";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function NotificationsSettingsPage() {
  const { colors } = useAppTheme();
  const prefs = useLearnFlowStore((s) => s.settings.notifications);
  const update = useLearnFlowStore((s) => s.updateNotificationPrefs);

  return (
    <div>
      <ScreenHeader title="Notifications" backHref="/app/profil" />
      <AppMain narrow className="space-y-3 py-5">
        <p className="text-[13px] font-medium leading-[18px]" style={{ color: colors.textSecondary }}>
          Choisis les rappels LearnFlow. Les préférences sont enregistrées sur cet appareil.
        </p>
        <Link
          href="/app/inbox"
          className="flex items-center gap-3 rounded-[20px] border-2 p-3.5"
          style={{ background: colors.white, borderColor: colors.border }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: colors.mathsBg }}>
            <Icon name="bell" size={16} color={colors.primary} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-extrabold">Mes messages</span>
            <span className="text-[11px] font-medium" style={{ color: colors.textMuted }}>
              Les notifications restent dans cette liste
            </span>
          </span>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </Link>
        <div className="overflow-hidden rounded-[20px] border-2" style={{ background: colors.white, borderColor: colors.border }}>
          <SettingsToggleRow
            label="Rappels d'étude"
            sub="Notification avant une séance planifiée (agenda)"
            value={prefs.studyReminders}
            onChange={(v) => update({ studyReminders: v })}
          />
          <SettingsToggleRow
            label="Série quotidienne"
            sub="Rappel si ta série de jours risque d'être perdue"
            value={prefs.streakReminders}
            onChange={(v) => update({ streakReminders: v })}
          />
          <SettingsToggleRow
            label="Instant T · Repos 1h"
            sub="Rappel après le quizz 10/10 si tu choisis Repos"
            value={prefs.reposReminders}
            onChange={(v) => update({ reposReminders: v })}
          />
          <SettingsToggleRow
            label="Ligues & classements"
            sub="Fin de semaine, promotions et gel de ligue"
            value={prefs.leagueUpdates}
            onChange={(v) => update({ leagueUpdates: v })}
          />
          <SettingsToggleRow
            label="Sons & vibrations"
            sub="Feedback sonore en Blitz et quiz"
            value={prefs.sounds}
            onChange={(v) => update({ sounds: v })}
            last
          />
        </div>
        <p className="text-[11px] font-semibold" style={{ color: colors.textMuted }}>
          État : {prefs.studyReminders ? "rappels d'étude activés" : "rappels d'étude désactivés"}.
        </p>
      </AppMain>
    </div>
  );
}
