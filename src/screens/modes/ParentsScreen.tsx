import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import { PARENT_NOTES } from "../../data/mock";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Parents">;

export default function ParentsScreen({ navigation }: Props) {
  const suivi = useLearnFlowStore((s) => s.suiviParental);
  const profile = useLearnFlowStore((s) => s.getActiveProfile());

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <Text style={styles.title}>Espace Parent</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sub}>Suivi de {profile.nom} · SMS passif uniquement</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SMS félicitations</Text>
          <Text style={styles.muted}>
            {suivi.estSMSPassifActif ? "Actif" : "Inactif"} · {suivi.telParent}
          </Text>
          <Text style={styles.muted}>
            Dernier : {suivi.dernierSMSNotification ? new Date(suivi.dernierSMSNotification).toLocaleString() : "aucun"}
          </Text>
        </View>
        <Text style={styles.section}>Carnet de notes</Text>
        {PARENT_NOTES.map((n) => (
          <View key={n.matiere} style={styles.noteRow}>
            <Text style={styles.noteMat}>{n.matiere}</Text>
            <Text style={styles.noteScore}>{n.score}/20</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", alignItems: "center", gap: 10, padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { fontWeight: "800", fontSize: 16, color: colors.textDark },
  scroll: { padding: 20, gap: 10 },
  sub: { color: colors.textMuted, marginBottom: 8 },
  card: { backgroundColor: colors.white, borderRadius: 16, borderWidth: 2, borderColor: colors.border, padding: 14, gap: 4 },
  cardTitle: { fontWeight: "800", color: colors.textDark },
  muted: { fontSize: 12, color: colors.textMuted },
  section: { marginTop: 12, fontWeight: "800", color: colors.textDark },
  noteRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  noteMat: { fontWeight: "700", color: colors.textDark },
  noteScore: { fontWeight: "800", color: colors.primary },
});
