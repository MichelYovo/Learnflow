import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { AI_FAQ, findAiFaq } from "../../data/mock";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AITutor">;
type Msg = { role: "user" | "ai"; text: string };

export default function AITutorScreen({ navigation }: Props) {
  const aiQuotaRestant = useLearnFlowStore((s) => s.aiQuotaRestant);
  const consumeAiQuota = useLearnFlowStore((s) => s.consumeAiQuota);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Pose une question. 5 réponses cloud par jour, sinon FAQ locale." },
  ]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);

    const faq = findAiFaq(q);
    const usedCloud = consumeAiQuota();

    let answer: string;
    if (faq) {
      answer = usedCloud ? faq.a : `[FAQ locale] ${faq.a}`;
    } else if (usedCloud) {
      answer = "Bonne question ! Relis la fiche Δ : a ≠ 0, puis calcule b² − 4ac. Tu peux aussi lancer le Mode Guidé.";
    } else {
      answer = "Quota cloud épuisé (0/5). Voici la FAQ locale : " + AI_FAQ.map((f) => f.q).join(" · ");
    }
    setMsgs((m) => [...m, { role: "ai", text: answer }]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Tuteur IA</Text>
          <Text style={styles.sub}>Quota cloud restant : {aiQuotaRestant}/5</Text>
        </View>
      </View>

      <View style={styles.spiraNote}>
        <Spira
          scene={aiQuotaRestant > 0 ? "tutor.ready" : "tutor.exhausted"}
          size={56}
          message={aiQuotaRestant > 0 ? "" : undefined}
        />
      </View>

      <FlatList
        data={msgs}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === "user" ? styles.user : styles.ai]}>
            <Text style={[styles.bubbleText, item.role === "user" && { color: colors.white }]}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Pose ta question…"
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
        />
        <Pressable style={styles.send} onPress={send}>
          <Icon name="arrow-right" size={18} color={colors.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", alignItems: "center", gap: 10, padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { fontWeight: "800", color: colors.textDark, fontSize: 16 },
  sub: { fontSize: 11, color: colors.textMuted },
  spiraNote: { alignItems: "center", paddingVertical: 8 },
  list: { padding: 16, gap: 8 },
  bubble: { maxWidth: "85%", borderRadius: 16, padding: 12, marginBottom: 8 },
  user: { alignSelf: "flex-end", backgroundColor: colors.primary },
  ai: { alignSelf: "flex-start", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  bubbleText: { color: colors.textDark, fontSize: 14, lineHeight: 20 },
  inputRow: { flexDirection: "row", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  input: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: colors.textDark },
  send: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
});
