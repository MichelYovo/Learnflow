import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import { SettingsHeader, SettingsToggleRow } from "../../components/SettingsUI";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationsSettings">;

export default function NotificationsSettingsScreen({ navigation }: Props) {
  const prefs = useLearnFlowStore((s) => s.settings.notifications);
  const update = useLearnFlowStore((s) => s.updateNotificationPrefs);
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <SettingsHeader title="Notifications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          Choisis les rappels LearnFlow. Les préférences sont enregistrées sur cet appareil.
        </Text>
        <Pressable
          onPress={() => navigation.navigate("NotificationsInbox")}
          style={[styles.inboxBtn, { backgroundColor: colors.white, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir mes notifications"
        >
          <View style={[styles.inboxIcon, { backgroundColor: colors.mathsBg }]}>
            <Icon name="bell" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inboxTitle, { color: colors.textDark }]}>Mes messages</Text>
            <Text style={[styles.inboxSub, { color: colors.textMuted }]}>Les notifications restent dans cette liste</Text>
          </View>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </Pressable>
        <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <SettingsToggleRow
            label="Rappels d'étude"
            sub="Notification avant une séance planifiée (agenda)"
            value={prefs.studyReminders}
            onValueChange={(v) => update({ studyReminders: v })}
          />
          <SettingsToggleRow
            label="Série quotidienne"
            sub="Rappel si ta série de jours risque d'être perdue"
            value={prefs.streakReminders}
            onValueChange={(v) => update({ streakReminders: v })}
          />
          <SettingsToggleRow
            label="Instant T · Repos 1h"
            sub="Rappel après le quizz 10/10 si tu choisis Repos"
            value={prefs.reposReminders}
            onValueChange={(v) => update({ reposReminders: v })}
          />
          <SettingsToggleRow
            label="Ligues & classements"
            sub="Fin de semaine, promotions et gel de ligue"
            value={prefs.leagueUpdates}
            onValueChange={(v) => update({ leagueUpdates: v })}
          />
          <SettingsToggleRow
            label="Sons & vibrations"
            sub="Feedback sonore en Blitz et quiz"
            value={prefs.sounds}
            onValueChange={(v) => update({ sounds: v })}
          />
        </View>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          État : {prefs.studyReminders ? "rappels d'étude activés" : "rappels d'étude désactivés"}.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  body: { padding: 20, gap: 12 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  inboxBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderRadius: 20,
    padding: 14,
  },
  inboxIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inboxTitle: { fontSize: 14, fontWeight: "800" },
  inboxSub: { fontSize: 11, fontWeight: "500", marginTop: 2 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: "hidden",
  },
  hint: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
});
