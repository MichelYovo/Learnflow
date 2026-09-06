import React, { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import { AI_FAQ } from "../../data/mock";
import { AI_DAILY_QUOTA, askTutor, remainingAiQuota, type TutorSource } from "../../data/tutor";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AITutor">;
type Msg = { role: "user" | "ai"; text: string; source?: TutorSource };

function sourceLabel(source?: TutorSource): string | null {
  if (source === "faq") return "FAQ locale";
  if (source === "cloud") return "Question cloud";
  if (source === "exhausted") return "Quota atteint";
  return null;
}

export default function AITutorScreen({ navigation }: Props) {
  const consumeAiQuota = useLearnFlowStore((s) => s.consumeAiQuota);
  const aiQuotaRestant = useLearnFlowStore((s) => remainingAiQuota(s.aiQuotaRestant, s.aiQuotaDay));
  const { colors } = useAppTheme();
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: `Je suis le tuteur, distinct de Spira. FAQ hors ligne illimitée, ${AI_DAILY_QUOTA} questions cloud par jour.`,
    },
  ]);

  const send = (raw?: string) => {
    const q = (raw ?? input).trim();
    if (!q) return;
    setInput("");
    const reply = askTutor(q, consumeAiQuota);
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: reply.text, source: reply.source }]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textDark }]}>Tuteur</Text>
          <Text style={styles.sub}>
            FAQ locale · cloud {aiQuotaRestant}/{AI_DAILY_QUOTA}
          </Text>
        </View>
      </View>

      <FlatList
        data={msgs}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const tag = sourceLabel(item.source);
          return (
            <View
              style={[
                styles.bubble,
                item.role === "user"
                  ? { alignSelf: "flex-end", backgroundColor: colors.primary }
                  : { alignSelf: "flex-start", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
              ]}
            >
              {tag ? <Text style={[styles.sourceTag, { color: colors.primary }]}>{tag}</Text> : null}
              <Text style={[styles.bubbleText, { color: item.role === "user" ? colors.onPrimary : colors.textDark }]}>
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        keyboardShouldPersistTaps="handled"
      >
        {AI_FAQ.slice(0, 6).map((f) => (
          <Pressable
            key={f.q}
            onPress={() => send(f.q)}
            style={[styles.chip, { backgroundColor: colors.mathsBg, borderColor: colors.mathsBorder }]}
          >
            <Text style={[styles.chipText, { color: colors.primary }]}>{f.q}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.white }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textDark }]}
          placeholder="Pose ta question…"
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send()}
        />
        <Pressable style={styles.send} onPress={() => send()}>
          <Icon name="arrow-right" size={18} color={colors.onPrimary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { fontWeight: "800", color: colors.textDark, fontSize: 16 },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 2, fontWeight: "600" },
  list: { padding: 16, gap: 8 },
  bubble: { maxWidth: "85%", borderRadius: 16, padding: 12, marginBottom: 8 },
  sourceTag: { fontSize: 10, fontWeight: "800", marginBottom: 4, textTransform: "uppercase" },
  bubbleText: { color: colors.textDark, fontSize: 14, lineHeight: 20 },
  chips: { paddingHorizontal: 12, paddingBottom: 8, gap: 8, alignItems: "center" },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { fontSize: 11, fontWeight: "700" },
  inputRow: { flexDirection: "row", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  input: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: colors.textDark },
  send: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
});
