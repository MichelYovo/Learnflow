import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Avatar from "../../components/Avatar";
import AvatarPicker from "../../components/AvatarPicker";
import Icon from "../../components/Icon";
import LeagueBadge from "../../components/league/LeagueBadge";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { classLabel } from "../../data/mock";
import { openSystemFocusSettings } from "../../lib/focusMode";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { MainTabParamList, RootStackParamList } from "../../navigation/types";

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Profil">,
  NativeStackNavigationProp<RootStackParamList>
>;

type SettingKey = "focus" | "notifications" | "privacy" | "rate" | "about" | "switch" | "logout";

const SETTINGS: {
  key: SettingKey;
  icon: "moon" | "bell" | "shield" | "star" | "compass" | "user" | "log-out";
  label: string;
  getSub: (ctx: { notifOn: boolean; leagueVisible: boolean; rating: number | null }) => string;
  danger?: boolean;
}[] = [
  {
    key: "focus",
    icon: "moon",
    label: "Mode concentration",
    getSub: () => "Ne pas déranger · couper les réseaux",
  },
  {
    key: "notifications",
    icon: "bell",
    label: "Notifications",
    getSub: ({ notifOn }) => (notifOn ? "Rappels d'étude actifs" : "Rappels désactivés"),
  },
  {
    key: "privacy",
    icon: "shield",
    label: "Confidentialité",
    getSub: ({ leagueVisible }) =>
      leagueVisible ? "Profil visible en ligue" : "Profil masqué en ligue",
  },
  {
    key: "rate",
    icon: "star",
    label: "Évaluer l'app",
    getSub: ({ rating }) => (rating ? `Ton avis : ${rating}/5` : "Donner ton avis sur LearnFlow"),
  },
  {
    key: "about",
    icon: "compass",
    label: "À propos",
    getSub: () => "Version 1.0.0 · LearnFlow Togo",
  },
  {
    key: "switch",
    icon: "user",
    label: "Changer de profil",
    getSub: () => "PIN local · plusieurs élèves sur l'appareil",
  },
  {
    key: "logout",
    icon: "log-out",
    label: "Déconnexion",
    getSub: () => "Revenir à l'écran d'accueil",
    danger: true,
  },
];

const TROPHIES = [
  { icon: "flame" as const, color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", label: "Série 7" },
  { icon: "zap" as const, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", label: "Blitz" },
  { icon: "book" as const, color: "#1677FF", bg: "#E6F4FF", border: "#BAE0FF", label: "Lecteur" },
];

export default function ProfilScreen() {
  const nav = useNavigation<Nav>();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const ligue = useLearnFlowStore((s) => s.ligue);
  const logout = useLearnFlowStore((s) => s.logout);
  const updateProfileName = useLearnFlowStore((s) => s.updateProfileName);
  const updateProfileAvatar = useLearnFlowStore((s) => s.updateProfileAvatar);
  const setDarkMode = useLearnFlowStore((s) => s.setDarkMode);
  const multiProfileEnabled = useLearnFlowStore((s) => s.settings.multiProfileEnabled);
  const setMultiProfileEnabled = useLearnFlowStore((s) => s.setMultiProfileEnabled);
  const enableMultiProfile = useLearnFlowStore((s) => s.enableMultiProfile);
  const { colors, darkMode } = useAppTheme();
  const [editing, setEditing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draftName, setDraftName] = useState(profile.nom);
  const [pinDraft, setPinDraft] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPinSetup, setShowPinSetup] = useState(false);

  const grade = profile.gradeLabel ?? classLabel(profile.classe);
  const stats = [
    { label: "XP Total", value: profile.xpTotale.toLocaleString(), icon: "zap" as const, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Série", value: `${profile.streak}j`, icon: "flame" as const, color: "#EF4444", bg: "#FEF2F2" },
    { label: "Rang", value: `#${profile.rang}`, icon: "award" as const, color: "#1677FF", bg: "#E6F4FF" },
    { label: "Leçons", value: `${profile.lessonsDone}`, icon: "book" as const, color: "#10B981", bg: "#ECFDF5" },
  ];

  const onSetting = (key: SettingKey) => {
    if (key === "focus") {
      void openSystemFocusSettings().then((opened) => {
        if (!opened) {
          Alert.alert("Réglages", "Ouvre Ne pas déranger ou Concentration dans les réglages de ton téléphone.");
        }
      });
    } else if (key === "notifications") nav.navigate("NotificationsSettings");
    else if (key === "privacy") nav.navigate("PrivacySettings");
    else if (key === "about") nav.navigate("About");
    else if (key === "rate") nav.navigate("RateApp");
    else if (key === "switch") {
      Alert.alert("Changer de profil", "Revenir à la sélection des profils ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Changer", onPress: logout },
      ]);
    }
    else if (key === "logout") {
      Alert.alert("Déconnexion", "Revenir à l'écran d'accueil ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Se déconnecter", style: "destructive", onPress: logout },
      ]);
    }
  };

  const saveName = () => {
    const trimmed = draftName.trim();
    if (trimmed.length < 2) {
      Alert.alert("Nom invalide", "Entre au moins 2 caractères.");
      return;
    }
    updateProfileName(trimmed);
    setEditing(false);
    Alert.alert("Profil mis à jour", "Ton nom a été enregistré.");
  };

  const onToggleMultiProfile = (on: boolean) => {
    if (!on) {
      setShowPinSetup(false);
      setPinDraft("");
      setPinConfirm("");
      setPinError("");
      setMultiProfileEnabled(false);
      return;
    }
    if (profile.hasPin) {
      setMultiProfileEnabled(true);
      setShowPinSetup(false);
      return;
    }
    setShowPinSetup(true);
    setPinError("");
  };

  const saveMultiProfilePin = () => {
    if (!/^\d{4}$/.test(pinDraft)) {
      setPinError("Choisis un code PIN à 4 chiffres.");
      return;
    }
    if (pinDraft !== pinConfirm) {
      setPinError("Les codes PIN ne correspondent pas.");
      return;
    }
    enableMultiProfile(pinDraft);
    setShowPinSetup(false);
    setPinDraft("");
    setPinConfirm("");
    setPinError("");
    Alert.alert("Multi-profil activé", "Ce profil est maintenant protégé par un PIN.");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textDark }]}>Mon profil</Text>
        <Pressable
          style={[styles.editBtn, { backgroundColor: colors.surfaceAlt }]}
          onPress={() => {
            if (editing) saveName();
            else {
              setDraftName(profile.nom);
              setEditing(true);
            }
          }}
        >
          <Icon name={editing ? "check" : "settings"} size={13} color={colors.textDark} />
          <Text style={[styles.editText, { color: colors.textDark }]}>{editing ? "Enregistrer" : "Modifier"}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={styles.avatarWrap}
            accessibilityRole="button"
            accessibilityLabel="Changer d'avatar"
          >
            <Avatar
              avatarId={profile.avatarId}
              size={96}
              initials={profile.firstName[0]}
              fallbackColor={profile.color ?? colors.primary}
              animated
            />
            <View style={styles.editBadge}>
              <Icon name="pen" size={11} color={colors.onPrimary} />
            </View>
          </Pressable>
          {editing ? (
            <TextInput
              style={[styles.nameInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.mathsBorder }]}
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Ton nom"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />
          ) : (
            <Text style={[styles.name, { color: colors.textDark }]}>{profile.nom}</Text>
          )}
          <View style={styles.pillsRow}>
            <View style={[styles.pill, styles.pillBlue]}>
              <Text style={[styles.pillText, { color: colors.primary }]}>{grade}</Text>
            </View>
            <View style={[styles.pill, styles.pillGold]}>
              <Text style={[styles.pillText, { color: colors.accent }]}>Ligue {ligue.nomLigue}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                <Icon name={s.icon} size={14} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.textDark }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Ma ligue</Text>
        <Pressable style={styles.leagueCard} onPress={() => nav.navigate("Ligue")}>
          <LeagueBadge nom={ligue.nomLigue} size={64} />
          <View style={styles.leagueBody}>
            <View style={styles.leagueTitleRow}>
              <Text style={styles.leagueTitle}>Ligue {ligue.nomLigue}</Text>
              <View style={styles.groupPill}>
                <Text style={styles.groupPillText}>Groupe {ligue.groupe}</Text>
              </View>
            </View>
            <Text style={styles.leagueMeta}>#{profile.rang}</Text>
            <View style={styles.leagueProgressRow}>
              <View style={styles.leagueTrack}>
                <View style={[styles.leagueFill, { width: "30%" }]} />
              </View>
              <Text style={styles.leagueProgressText}>Platine</Text>
            </View>
          </View>
          <View style={styles.leagueChevron}>
            <Icon name="chevron-right" size={14} color={colors.accent} />
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabelInline}>Trophées débloqués</Text>
          <Pressable style={styles.seeAll} onPress={() => nav.navigate("Ligue")}>
            <Text style={styles.seeAllText}>Voir tout</Text>
            <Icon name="chevron-right" size={10} color={colors.primary} />
          </Pressable>
        </View>
        <View style={styles.trophiesRow}>
          {TROPHIES.map((t) => (
            <View key={t.label} style={[styles.trophy, { backgroundColor: t.bg, borderColor: t.border }]}>
              <Icon name={t.icon} size={18} color={t.color} />
              <Text style={[styles.trophyLabel, { color: t.color }]}>{t.label}</Text>
            </View>
          ))}
          <View style={[styles.trophy, styles.trophyMore]}>
            <Icon name="lock" size={18} color={colors.textMuted} />
            <Text style={styles.trophyMoreText}>+3</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Apparence</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <View style={styles.settingsRow}>
            <View style={[styles.settingsIcon, { backgroundColor: darkMode ? "#0C1A33" : colors.mathsBg }]}>
              <Icon name={darkMode ? "moon" : "sunny"} size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingsLabel, { color: colors.textDark }]}>Mode sombre</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.borderStrong, true: colors.mathsBorder }}
              thumbColor={darkMode ? colors.primary : colors.surfaceAlt}
              accessibilityRole="switch"
              accessibilityLabel="Mode sombre"
              accessibilityState={{ checked: darkMode }}
            />
          </View>
          <View style={[styles.settingsBorder, { borderBottomColor: colors.border }]} />
          <View style={styles.settingsRow}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.mathsBg }]}>
              <Icon name="people" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingsLabel, { color: colors.textDark }]}>Multi-profil</Text>
            </View>
            <Switch
              value={multiProfileEnabled || showPinSetup}
              onValueChange={onToggleMultiProfile}
              trackColor={{ false: colors.borderStrong, true: colors.mathsBorder }}
              thumbColor={multiProfileEnabled || showPinSetup ? colors.primary : colors.surfaceAlt}
              accessibilityRole="switch"
              accessibilityLabel="Multi-profil"
              accessibilityState={{ checked: multiProfileEnabled || showPinSetup }}
            />
          </View>
          {showPinSetup ? (
            <View style={styles.pinSetup}>
              <Text style={[styles.pinHint, { color: colors.textMuted }]}>
                Choisis un PIN à 4 chiffres pour protéger ce profil.
              </Text>
              <TextInput
                style={[styles.pinInput, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }]}
                placeholder="PIN"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={pinDraft}
                onChangeText={(t) => setPinDraft(t.replace(/\D/g, "").slice(0, 4))}
              />
              <TextInput
                style={[styles.pinInput, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }]}
                placeholder="Confirmer"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={pinConfirm}
                onChangeText={(t) => setPinConfirm(t.replace(/\D/g, "").slice(0, 4))}
              />
              {pinError ? <Text style={styles.pinErr}>{pinError}</Text> : null}
              <Pressable style={[styles.pinSave, { backgroundColor: colors.primary }]} onPress={saveMultiProfilePin}>
                <Text style={[styles.pinSaveText, { color: colors.onPrimary }]}>Enregistrer le PIN</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Paramètres</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
          {SETTINGS.map((item, i) => (
            <Pressable
              key={item.key}
              style={[styles.settingsRow, i < SETTINGS.length - 1 && [styles.settingsBorder, { borderBottomColor: colors.border }]]}
              onPress={() => onSetting(item.key)}
            >
              <View style={[styles.settingsIcon, { backgroundColor: colors.surfaceAlt }, item.danger && { backgroundColor: darkMode ? "#2A1010" : "#FEF2F2" }]}>
                <Icon name={item.icon} size={16} color={item.danger ? colors.danger : colors.textDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingsLabel, { color: item.danger ? colors.danger : colors.textDark }]}>{item.label}</Text>
              </View>
              {!item.danger ? <Icon name="chevron-right" size={14} color="#C4C2BF" /> : null}
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <AvatarPicker
        visible={pickerOpen}
        selectedId={profile.avatarId}
        onSelect={updateProfileAvatar}
        onClose={() => setPickerOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 22, fontWeight: "800", color: colors.textDark },
  headerBrand: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  editBtn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  editText: { fontSize: 14, fontWeight: "700", color: "#44403C" },
  scroll: { paddingBottom: 110 },
  center: { alignItems: "center", paddingTop: 28, paddingBottom: 24, paddingHorizontal: 20 },
  avatarWrap: { marginBottom: 12, position: "relative" },
  editBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 20, fontWeight: "800", color: colors.textDark },
  nameInput: {
    minWidth: 200,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: colors.textDark,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.mathsBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillsRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 2,
  },
  pillBlue: { backgroundColor: "#E6F4FF", borderColor: "#BAE0FF" },
  pillGold: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  pillText: { fontSize: 13, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 15, fontWeight: "800", color: colors.textDark },
  statLabel: { fontSize: 12, fontWeight: "600", color: colors.textMuted },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textDark,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionLabelInline: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textDark,
  },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 15, fontWeight: "700", color: colors.primary },
  leagueCard: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 24,
    padding: 16,
  },
  leagueBody: { flex: 1, minWidth: 0 },
  leagueTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  leagueTitle: { fontSize: 16, fontWeight: "800", color: "#78350F" },
  groupPill: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  groupPillText: { fontSize: 12, fontWeight: "800", color: colors.white },
  leagueMeta: { fontSize: 14, fontWeight: "600", color: "#92400E", marginBottom: 8 },
  leagueProgressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  leagueTrack: { flex: 1, height: 8, backgroundColor: "#FDE68A", borderRadius: 99 },
  leagueFill: { height: 8, backgroundColor: colors.accent, borderRadius: 99 },
  leagueProgressText: { fontSize: 13, fontWeight: "800", color: colors.accent },
  leagueChevron: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  trophiesRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20 },
  trophy: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  trophyLabel: { fontSize: 13, fontWeight: "800" },
  trophyMore: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.borderStrong,
    opacity: 0.45,
  },
  trophyMoreText: { fontSize: 13, fontWeight: "800", color: colors.textMuted },
  settingsCard: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  settingsBorder: { borderBottomWidth: 1, borderBottomColor: colors.surfaceAlt },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsLabel: { fontSize: 16, fontWeight: "800", color: colors.textDark },
  pinSetup: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
  pinHint: { fontSize: 12, fontWeight: "500", lineHeight: 16 },
  pinInput: {
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 6,
    textAlign: "center",
  },
  pinErr: { color: colors.danger, fontSize: 12, fontWeight: "700" },
  pinSave: { borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  pinSaveText: { fontWeight: "800", fontSize: 14 },
});
