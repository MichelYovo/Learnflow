import React, { useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LeagueBadgeHero from "../../components/league/LeagueBadgeHero";
import LeagueLeaderboardRow from "../../components/league/LeagueLeaderboardRow";
import LeaguePodium from "../../components/league/LeaguePodium";
import LeagueTierScroller from "../../components/league/LeagueTierScroller";
import { LEAGUE_BADGE_IMAGES } from "../../components/league/badgeAssets";
import { SectionLabel } from "../../components/ui";
import { LEAGUE_TIERS } from "../../data/mock";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import type { LigueNom } from "../../types/learnflow";
import { useAppTheme } from "../../theme/useAppTheme";

const TIER_ORDER: LigueNom[] = ["Bronze", "Argent", "Or", "Platine", "Diamant"];

export default function LigueScreen() {
  const ligue = useLearnFlowStore((s) => s.ligue);
  const leagueBoard = useLearnFlowStore((s) => s.leagueBoard);
  const gelerLigue = useLearnFlowStore((s) => s.gelerLigue);
  const badgesDebloques = useLearnFlowStore((s) => s.getActiveProfile()?.badgesDebloques ?? []);
  const myAvatarId = useLearnFlowStore((s) => s.getActiveProfile()?.avatarId);
  const { colors, darkMode } = useAppTheme();
  const [selectedTier, setSelectedTier] = useState<LigueNom>(ligue.nomLigue);
  const [tab, setTab] = useState<"classement" | "badges">("classement");

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
  const isCurrentTier = selectedTier === ligue.nomLigue;
  const currentIndex = TIER_ORDER.indexOf(ligue.nomLigue);

  const achievementBadges = [
    { label: "Série 7", key: "Série 7", color: colors.danger, icon: "flame" as const },
    { label: "Blitz King", key: "Blitz King", color: colors.accent, icon: "flash" as const },
    { label: "Lecteur Pro", key: "Lecteur Pro", color: colors.primary, icon: "book" as const },
    { label: "CHALLENGER", key: "CHALLENGER", color: colors.accent, icon: "trophy" as const },
    { label: "Étoile d'Or", key: "Étoile d'Or", color: colors.primary, icon: "star" as const },
    { label: "Diamant", key: "Diamant", color: colors.cyan, icon: "diamond" as const },
  ];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: darkMode ? "#0F172A" : colors.surface }]}
      edges={["top"]}
    >
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
                accessibilityState={{ selected: active }}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? (darkMode ? "#0C1A33" : "#E6F4FF") : colors.surfaceAlt,
                    borderColor: active ? colors.primary : "transparent",
                  },
                ]}
              >
                <Ionicons
                  name={
                    t === "classement"
                      ? active
                        ? "podium"
                        : "podium-outline"
                      : active
                        ? "ribbon"
                        : "ribbon-outline"
                  }
                  size={16}
                  color={active ? colors.primary : colors.textMuted}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: active ? "800" : "600",
                    color: active ? colors.primary : colors.textMuted,
                  }}
                >
                  {t === "classement" ? "Classement" : "Badges"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {tab === "classement" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          stickyHeaderIndices={[0]}
        >
          <View style={{ backgroundColor: darkMode ? "#0F172A" : colors.surface, paddingVertical: 12 }}>
            <LeagueTierScroller
              selected={selectedTier}
              onSelect={setSelectedTier}
              currentTier={ligue.nomLigue}
            />
          </View>

          <LeagueBadgeHero
            tier={tierMeta}
            title={`Ligue ${tierMeta.label}`}
            subtitle={
              isCurrentTier
                ? `Rang #${ligue.rangActuel}`
                : "Palier à débloquer"
            }
          />

          {isCurrentTier ? (
            <>
              {first && second && third ? (
                <LeaguePodium first={first} second={second} third={third} />
              ) : null}

              <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 8 }}>
                <SectionLabel>Classement</SectionLabel>
              </View>

              {rest.map((player) => (
                <LeagueLeaderboardRow key={player.rank} player={player} />
              ))}

              <Pressable
                accessibilityRole="button"
                style={[styles.gelBtn, { backgroundColor: colors.white, borderColor: colors.border }]}
                onPress={() => {
                  gelerLigue(7);
                  Alert.alert("Ligue gelée", "Ton rang est protégé pendant 7 jours (démo).");
                }}
              >
                <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 15 }}>
                  Geler ma ligue (7j)
                </Text>
              </Pressable>
            </>
          ) : null}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: 16 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            <SectionLabel>Paliers</SectionLabel>
          </View>

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
                  <Image
                    source={LEAGUE_BADGE_IMAGES[tier.badgeKey]}
                    style={{ width: 72, height: 72 }}
                    resizeMode="contain"
                  />
                  <Text style={{ fontWeight: "800", fontSize: 14, color: colors.textDark }}>
                    {tier.label}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>
                    {unlocked ? (tier.id === ligue.nomLigue ? "Palier actuel" : "Débloqué") : "Verrouillé"}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 12 }}>
            <SectionLabel>Succès</SectionLabel>
          </View>

          <View style={styles.badges}>
            {achievementBadges.map((b) => {
              const earned =
                badgesDebloques.includes(b.key) ||
                ["Série 7", "Blitz King", "Lecteur Pro"].includes(b.key);
              return (
                <View
                  key={b.label}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.border,
                      opacity: earned ? 1 : 0.45,
                    },
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
                    <Ionicons name={b.icon} size={22} color={b.color} />
                  </View>
                  <Text style={{ fontWeight: "800", fontSize: 14, color: colors.textDark }}>{b.label}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>
                    {earned ? "Débloqué" : "Verrouillé"}
                  </Text>
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
    gap: 4,
  },
  title: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
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
