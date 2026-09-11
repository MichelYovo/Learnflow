import React, { useMemo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "./Icon";
import Spira from "./Spira";
import SpiraCelebrate from "./SpiraCelebrate";
import { useLearnFlowStore } from "../store/useLearnFlowStore";
import { useAppTheme } from "../theme/useAppTheme";
import type { IconName } from "./Icon";

export type RecapStat = {
  label: string;
  value: string;
  icon: IconName;
  color: string;
  bg: string;
};

export function useSessionStats(opts: { xp?: number; score?: number; total?: number; cards?: number }): RecapStat[] {
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const ligue = useLearnFlowStore((s) => s.ligue);
  return useMemo(() => {
    const rows: RecapStat[] = [];
    if (opts.xp != null) {
      rows.push({ label: "XP gagné", value: `+${opts.xp}`, icon: "zap", color: "#F59E0B", bg: "#FFFBEB" });
    }
    if (opts.score != null && opts.total) {
      rows.push({
        label: "Précision",
        value: `${Math.round((opts.score / Math.max(1, opts.total)) * 100)}%`,
        icon: "target",
        color: "#1677FF",
        bg: "#E6F4FF",
      });
    }
    if (opts.cards != null) {
      rows.push({ label: "Cartes", value: String(opts.cards), icon: "layers", color: "#8B5CF6", bg: "#F5F3FF" });
    }
    rows.push({ label: "Série", value: `${profile?.streak ?? 0} j`, icon: "flame", color: "#EF4444", bg: "#FEF2F2" });
    rows.push({ label: "Ligue", value: ligue.nomLigue, icon: "trophy", color: "#D97706", bg: "#FFFBEB" });
    return rows;
  }, [opts.xp, opts.score, opts.total, opts.cards, profile?.streak, ligue.nomLigue]);
}

export default function SessionRecap({
  success,
  title,
  subtitle,
  stats,
  children,
}: {
  success: boolean;
  title: string;
  subtitle?: string;
  stats: RecapStat[];
  children?: ReactNode;
}) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["bottom"]}>
      <LinearGradient colors={success ? ["#10B981", "#059669"] : ["#F97316", "#DC2626"]} style={styles.hero}>
        {success ? <SpiraCelebrate size={200} /> : <Spira scene="quiz.fail" size={96} message="" />}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </LinearGradient>
      <View style={styles.grid}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <View style={[styles.icon, { backgroundColor: s.bg }]}>
              <Icon name={s.icon} size={14} color={s.color} />
            </View>
            <Text style={[styles.value, { color: colors.textDark }]}>{s.value}</Text>
            <Text style={[styles.label, { color: colors.textMuted }]}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    gap: 8,
  },
  title: { color: "#fff", fontSize: 32, fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "600", textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 20, paddingTop: 20 },
  card: {
    width: "47.5%",
    flexGrow: 1,
    alignItems: "center",
    gap: 4,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  icon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  value: { fontSize: 18, fontWeight: "800" },
  label: { fontSize: 11, fontWeight: "700" },
  footer: { marginTop: "auto", paddingHorizontal: 20, paddingBottom: 16, paddingTop: 20, gap: 12 },
});
