import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import { SettingsHeader } from "../../components/SettingsUI";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { InboxKind, InboxNotification } from "../../types/learnflow";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationsInbox">;

const KIND_META: Record<InboxKind, { icon: string; color: string; bg: string; label: string }> = {
  study: { icon: "calendar", color: "#1677FF", bg: "#E6F4FF", label: "Étude" },
  streak: { icon: "flame", color: "#D97706", bg: "#FEF3C7", label: "Série" },
  league: { icon: "trophy", color: "#D97706", bg: "#FFFBEB", label: "Ligue" },
  repos: { icon: "moon", color: "#8B5CF6", bg: "#F5F3FF", label: "Repos" },
  system: { icon: "bell", color: "#1677FF", bg: "#E6F4FF", label: "LearnFlow" },
};

function formatWhen(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.max(0, Math.round(diff / 60_000));
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "Hier" : `Il y a ${d} j`;
}

export default function NotificationsInboxScreen({ navigation }: Props) {
  const inbox = useLearnFlowStore((s) => s.inbox);
  const markInboxRead = useLearnFlowStore((s) => s.markInboxRead);
  const markAllInboxRead = useLearnFlowStore((s) => s.markAllInboxRead);
  const { colors, darkMode } = useAppTheme();
  const unread = useMemo(() => inbox.filter((n) => !n.read).length, [inbox]);

  const open = (n: InboxNotification) => {
    markInboxRead(n.id);
    if (n.kind === "study") navigation.navigate("Agenda");
    else if (n.kind === "league") navigation.navigate("Main", { screen: "Ligue" });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <SettingsHeader title="Notifications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.toolbar}>
          <Text style={[styles.count, { color: colors.textMuted }]}>
            {unread > 0 ? `${unread} non lue${unread > 1 ? "s" : ""}` : "Tout est lu"}
          </Text>
          {unread > 0 ? (
            <Pressable onPress={markAllInboxRead} hitSlop={8} accessibilityRole="button">
              <Text style={[styles.markAll, { color: colors.primary }]}>Tout marquer lu</Text>
            </Pressable>
          ) : null}
        </View>

        {inbox.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <Icon name="bell" size={28} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textDark }]}>Aucune notification</Text>
            <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
              Les rappels d'étude, de série et de ligue resteront ici.
            </Text>
          </View>
        ) : (
          inbox.map((n) => {
            const meta = KIND_META[n.kind];
            return (
              <Pressable
                key={n.id}
                onPress={() => open(n)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.white,
                    borderColor: n.read ? colors.border : colors.mathsBorder,
                    opacity: n.read ? 0.78 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: !n.read }}
              >
                <View style={[styles.iconWrap, { backgroundColor: darkMode ? colors.surfaceAlt : meta.bg }]}>
                  <Icon name={meta.icon} size={16} color={meta.color} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.kind, { color: meta.color }]}>{meta.label}</Text>
                    <Text style={[styles.when, { color: colors.textMuted }]}>{formatWhen(n.createdAt)}</Text>
                  </View>
                  <Text style={[styles.title, { color: colors.textDark }]}>{n.title}</Text>
                  <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{n.body}</Text>
                </View>
                {!n.read ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  body: { padding: 16, gap: 10, paddingBottom: 28 },
  toolbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4 },
  count: { fontSize: 12, fontWeight: "700" },
  markAll: { fontSize: 12, fontWeight: "800" },
  empty: {
    marginTop: 24,
    borderWidth: 2,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", marginTop: 4 },
  emptyBody: { fontSize: 12, fontWeight: "500", textAlign: "center", lineHeight: 18 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 2,
    borderRadius: 20,
    padding: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  kind: { fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 },
  when: { fontSize: 10, fontWeight: "600" },
  title: { fontSize: 14, fontWeight: "800", marginTop: 2 },
  bodyText: { fontSize: 12, fontWeight: "500", marginTop: 4, lineHeight: 17 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
});
