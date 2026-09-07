import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeagueBadgeHero from "../../components/league/LeagueBadgeHero";
import LeagueLeaderboardRow from "../../components/league/LeagueLeaderboardRow";
import LeaguePodium from "../../components/league/LeaguePodium";
import LeagueTierScroller from "../../components/league/LeagueTierScroller";
import { LeagueBadgeCircle } from "../../components/league/LeagueBadge";
import Icon from "../../components/Icon";
import { LEAGUE_TIERS } from "../../data/mock";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import type { LigueNom } from "../../types/learnflow";
import { useAppTheme } from "../../theme/useAppTheme";

const TIER_ORDER: LigueNom[] = ["Bronze", "Argent", "Or", "Platine", "Diamant"];

const ACHIEVEMENTS = [
  { label: "Série 7", key: "Série 7", color: "#EF4444", icon: "flame" as const },
  { label: "Blitz King", key: "Blitz King", color: "#F59E0B", icon: "zap" as const },
  { label: "Lecteur Pro", key: "Lecteur Pro", color: "#1677FF", icon: "book" as const },
  { label: "CHALLENGER", key: "CHALLENGER", color: "#F59E0B", icon: "award" as const },
  { label: "Étoile d'Or", key: "Étoile d'Or", color: "#1677FF", icon: "star" as const },
  { label: "Diamant", key: "Diamant", color: "#06B6D4", icon: "sparkles" as const },
];

export default function LigueScreen() {
  const ligue = useLearnFlowStore((s) => s.ligue);
  const leagueBoard = useLearnFlowStore((s) => s.leagueBoard);
  const gelerLigue = useLearnFlowStore((s) => s.gelerLigue);
  const badgesDebloques = useLearnFlowStore((s) => s.getActiveProfile()?.badgesDebloques ?? []);
  const myAvatarId = useLearnFlowStore((s) => s.getActiveProfile()?.avatarId);
  const { colors, darkMode } = useAppTheme();
  const [selectedTier, setSelectedTier] = useState<LigueNom>(ligue.nomLigue);
  const [tab, setTab] = useState<"classement" | "badges">("classement");
  const [gelMsg, setGelMsg] = useState(false);

  const sorted = useMemo(
    () =>
      [...leagueBoard]
        .map((p) => (p.you && myAvatarId ? { ...p, avatarId: myAvatarId } : p))
        .sort((a, b) => a.rank - b.rank),
    [leagueBoard, myAvatarId]
  );
  const first = sorted.find((p) => p.rank === 1);
  const second = sorted.find((p) => p.rank === 2);
  const third = sorted.find((p) => p.rank === 3);
  const rest = sorted.filter((p) => p.rank >= 4 && p.rank <= 30);

  const tierMeta = LEAGUE_TIERS.find((t) => t.id === selectedTier) ?? LEAGUE_TIERS[2];
  const isCurrent = selectedTier === ligue.nomLigue;
  const currentIndex = TIER_ORDER.indexOf(ligue.nomLigue);
  const selectedIndex = TIER_ORDER.indexOf(selectedTier);
  const isUnlocked = selectedIndex <= currentIndex;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textDark }]}>Ligues</Text>
        <View style={styles.tabs}>
          {(["classement", "badges"] as const).map((t) => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                accessibilityRole="button"
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? (darkMode ? "#0C1A33" : "#E6F4FF") : colors.surfaceAlt,
                    borderColor: active ? colors.primary : "transparent",
                  },
                ]}
              >
                <Icon name={t === "classement" ? "award" : "star"} size={16} color={active ? colors.primary : colors.textMuted} />
                <Text style={{ fontSize: 13, fontWeight: "800", color: active ? colors.primary : colors.textMuted }}>
                  {t === "classement" ? "Classement" : "Badges"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {tab === "classement" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <LeagueTierScroller selected={selectedTier} onSelect={setSelectedTier} currentTier={ligue.nomLigue} />

          <LeagueBadgeHero
            tier={tierMeta}
            title={`Ligue ${tierMeta.label}`}
            subtitle={
              isCurrent
                ? `Rang #${ligue.rangActuel} · cette semaine`
                : isUnlocked
                  ? "Palier débloqué"
                  : "Palier à débloquer"
            }
            subtitleColor={isCurrent ? tierMeta.color : colors.textMuted}
            rank={isCurrent ? ligue.rangActuel : null}
            dimmed={!isUnlocked}
          />

          {!isCurrent ? (
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              {isUnlocked
                ? "Tu as déjà dépassé ce palier. Le classement s’affiche pour ta ligue actuelle."
                : "Gagne de l’XP cette semaine pour viser ce palier."}
            </Text>
          ) : null}

          {isCurrent && first && second && third ? (
            <>
              <LeaguePodium first={first} second={second} third={third} />
              <Text style={[styles.section, { color: colors.textDark }]}>Classement</Text>
              {rest.map((player) => (
                <LeagueLeaderboardRow key={player.rank} player={player} />
              ))}
              <Pressable
                accessibilityRole="button"
                style={[styles.gelBtn, { backgroundColor: colors.white, borderColor: colors.border }]}
                onPress={() => {
                  gelerLigue(7);
                  setGelMsg(true);
                }}
              >
                <Icon name="shield" size={20} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 15 }}>Geler ma ligue (7j)</Text>
              </Pressable>
              {gelMsg || ligue.estGelee ? (
                <Text style={[styles.hint, { color: colors.textMuted }]}>Ton rang est protégé pendant 7 jours (démo).</Text>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: 16 }]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.section, { color: colors.textDark }]}>Paliers</Text>
          <View style={styles.badges}>
            {LEAGUE_TIERS.map((tier, index) => {
              const unlocked = index <= currentIndex;
              return (
                <View
                  key={tier.id}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.white,
                      borderColor: unlocked ? tier.color : colors.border,
                      opacity: unlocked ? 1 : 0.4,
                    },
                  ]}
                >
                  <LeagueBadgeCircle nom={tier.id} size={72} selected={tier.id === ligue.nomLigue} />
                  <Text style={{ fontWeight: "800", fontSize: 14, color: colors.textDark }}>{tier.label}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>
                    {unlocked ? (tier.id === ligue.nomLigue ? "Palier actuel" : "Débloqué") : "Verrouillé"}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={[styles.section, { color: colors.textDark, marginTop: 8 }]}>Succès</Text>
          <View style={styles.badges}>
            {ACHIEVEMENTS.map((b) => {
              const earned = badgesDebloques.includes(b.key) || ["Série 7", "Blitz King", "Lecteur Pro"].includes(b.key);
              return (
                <View
                  key={b.label}
                  style={[
                    styles.badge,
                    { backgroundColor: colors.white, borderColor: colors.border, opacity: earned ? 1 : 0.45 },
                  ]}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: darkMode ? "#0F172A" : "#F8FAFC",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={b.icon} size={22} color={b.color} />
                  </View>
                  <Text style={{ fontWeight: "800", fontSize: 14, color: colors.textDark }}>{b.label}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{earned ? "Débloqué" : "Verrouillé"}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  tabs: { flexDirection: "row", gap: 8, marginTop: 12 },
  tab: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  scroll: { paddingBottom: 120 },
  section: { fontSize: 18, fontWeight: "800", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  hint: { textAlign: "center", fontSize: 14, fontWeight: "600", paddingHorizontal: 24, marginBottom: 8 },
  gelBtn: {
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    minHeight: 52,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 16,
  },
  badge: {
    width: "47%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    minHeight: 140,
    alignItems: "center",
  },
});
