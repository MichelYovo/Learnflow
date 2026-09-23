import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeagueBadgeHero from "../../components/league/LeagueBadgeHero";
import LeagueLeaderboardRow from "../../components/league/LeagueLeaderboardRow";
import LeaguePodium from "../../components/league/LeaguePodium";
import LeagueTierScroller from "../../components/league/LeagueTierScroller";
import { LeagueBadgeCircle } from "../../components/league/LeagueBadge";
import Icon from "../../components/Icon";
import { isCloudProfileId, LEAGUE_TIERS, type LeaguePlayer } from "../../data/mock";
import { fetchLeagueLeaderboard, orderLeaguePlayers } from "../../lib/leagueLive";
import { formatFreezeUntil, leagueFreezeActive } from "../../lib/leagueFreeze";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import type { LigueNom } from "../../types/learnflow";
import { useAppTheme } from "../../theme/useAppTheme";

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
  const gelerLigue = useLearnFlowStore((s) => s.gelerLigue);
  const leagueBoard = useLearnFlowStore((s) => s.leagueBoard);
  const badgesDebloques = useLearnFlowStore((s) => s.getActiveProfile()?.badgesDebloques ?? []);
  const myAvatarId = useLearnFlowStore((s) => s.getActiveProfile()?.avatarId);
  const activeProfileId = useLearnFlowStore((s) => s.activeProfileId);
  const { colors, darkMode } = useAppTheme();
  const [selectedTier, setSelectedTier] = useState<LigueNom>(ligue.nomLigue);
  const [tab, setTab] = useState<"classement" | "badges">("classement");
  const [tierBoard, setTierBoard] = useState<LeaguePlayer[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const state = useLearnFlowStore.getState();
    if (!isCloudProfileId(state.activeProfileId)) {
      setTierBoard(null);
      return;
    }
    const profile = state.getActiveProfile();
    void fetchLeagueLeaderboard(selectedTier, String(state.activeProfileId), {
      name: profile.nom,
      avatarId: profile.avatarId,
      initials: profile.firstName?.slice(0, 2),
    }).then((players) => {
      if (!cancelled) setTierBoard(players);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedTier, leagueBoard, activeProfileId]);

  const sorted = useMemo(() => {
    const source = tierBoard ?? (selectedTier === ligue.nomLigue ? leagueBoard : []);
    return orderLeaguePlayers(source.map((p) => (p.you && myAvatarId ? { ...p, avatarId: myAvatarId } : p)));
  }, [tierBoard, leagueBoard, selectedTier, ligue.nomLigue, myAvatarId]);
  const first = sorted.find((p) => p.rank === 1);
  const second = sorted.find((p) => p.rank === 2);
  const third = sorted.find((p) => p.rank === 3);
  const rest = sorted.filter((p) => p.rank >= 4 && p.rank <= 30);

  const tierMeta = LEAGUE_TIERS.find((t) => t.id === selectedTier) ?? LEAGUE_TIERS[0];
  const isCurrent = selectedTier === ligue.nomLigue;
  const frozen = leagueFreezeActive(ligue);
  const liveRank = sorted.find((p) => p.you)?.rank ?? ligue.rangActuel;
  const myRank = isCurrent && frozen ? Math.min(liveRank, ligue.rangProtege || ligue.rangActuel) : liveRank;
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
                ? `Rang #${myRank} · cette semaine`
                : `${sorted.length} élève${sorted.length > 1 ? "s" : ""} · classés par XP`
            }
            subtitleColor={isCurrent ? tierMeta.color : colors.textMuted}
            rank={isCurrent ? myRank : null}
          />

          {sorted.length > 0 ? (
            <>
              {first && second && third ? (
                <LeaguePodium first={first} second={second} third={third} tier={selectedTier} />
              ) : null}
              <Text style={[styles.section, { color: colors.textDark }]}>Classement</Text>
              {(first && second && third ? rest : sorted).map((player) => (
                <LeagueLeaderboardRow key={`${player.studentId ?? player.name}-${player.rank}`} player={player} tier={selectedTier} />
              ))}
            </>
          ) : (
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              Le classement est vide pour l’instant. Dès qu’un élève se connecte, il apparaît ici — dernier tant qu’il n’a pas encore d’XP.
            </Text>
          )}
          {isCurrent ? (
            frozen && ligue.geleJusqua ? (
              <Text style={[styles.hint, { color: colors.textMuted, marginTop: 8 }]}>
                Rang #{ligue.rangProtege || myRank} protégé jusqu’au {formatFreezeUntil(ligue.geleJusqua)}. Il peut monter, il ne recule pas.
              </Text>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => gelerLigue(7)}
                style={{
                  marginTop: 12,
                  marginHorizontal: 16,
                  minHeight: 52,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 14,
                  borderRadius: 18,
                  borderWidth: 1.5,
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                }}
              >
                <Icon name="shield" size={20} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 15 }}>Geler ma ligue (7j)</Text>
              </Pressable>
            )
          ) : null}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: 16 }]} showsVerticalScrollIndicator={false}>
          <Text style={[styles.section, { color: colors.textDark }]}>Paliers</Text>
          <View style={styles.badges}>
            {LEAGUE_TIERS.map((tier) => {
              const current = tier.id === ligue.nomLigue;
              return (
                <View
                  key={tier.id}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.white,
                      borderColor: current ? tier.color : colors.border,
                    },
                  ]}
                >
                  <LeagueBadgeCircle nom={tier.id} size={72} selected={current} />
                  <Text style={{ fontWeight: "800", fontSize: 14, color: colors.textDark }}>{tier.label}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>
                    {current ? "Palier actuel" : "Ouverte"}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={[styles.section, { color: colors.textDark, marginTop: 8 }]}>Succès</Text>
          <Text style={[styles.hint, { color: colors.textMuted, marginTop: -4 }]}>
            Ils se débloquent tout seuls : 10/10, défis, Blitz duo, série de 7 jours.
          </Text>
          <View style={styles.badges}>
            {ACHIEVEMENTS.map((b) => {
              const earned = badgesDebloques.includes(b.key);
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
