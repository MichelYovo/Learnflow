import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../Icon";
import { useAppTheme } from "../../theme/useAppTheme";

export const QUIZ_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

export type QuizPlayProps = {
  kicker?: string;
  current: number;
  total: number;
  question: string;
  options: string[];
  correctIndex: number;
  selected: number | null;
  onPick: (index: number) => void;
  onBack: () => void;
  onContinue: () => void;
  explanation?: string;
  optionNotes?: string[];
  reviewLabel?: string;
  onReview?: () => void;
  headerRight?: React.ReactNode;
  continueLabel?: string;
};

function optionKind(i: number, selected: number | null, correct: number) {
  if (selected === null) return "idle" as const;
  if (i === correct) return "correct" as const;
  if (i === selected) return "wrong" as const;
  return "dim" as const;
}

export default function QuizPlay({
  kicker,
  current,
  total,
  question,
  options,
  correctIndex,
  selected,
  onPick,
  onBack,
  onContinue,
  explanation,
  optionNotes,
  reviewLabel,
  onReview,
  headerRight,
  continueLabel = "Continuer",
}: QuizPlayProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const answered = selected !== null;
  const ok = answered && selected === correctIndex;
  const progress = Math.min(1, (current + (answered ? 1 : 0.35)) / total);

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <View style={styles.top}>
        <Pressable
          onPress={onBack}
          accessibilityLabel="Fermer"
          style={[styles.close, { backgroundColor: colors.white, borderColor: colors.border }]}
        >
          <Icon name="x" size={18} color={colors.textDark} />
        </Pressable>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.counter, { color: colors.primary }]}>
          {current + 1}/{total}
        </Text>
        {headerRight}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: answered ? 24 : 24 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        {kicker ? <Text style={[styles.kicker, { color: colors.textMuted }]}>{kicker}</Text> : null}
        <Text style={[styles.question, { color: colors.textDark }]}>{question}</Text>
        <View style={styles.options}>
          {options.map((opt, i) => {
            const kind = optionKind(i, selected, correctIndex);
            const letter = QUIZ_LETTERS[i] ?? String(i + 1);
            const bg = kind === "correct" ? colors.svtBg : kind === "wrong" ? colors.angBg : colors.white;
            const border = kind === "correct" ? colors.secondary : kind === "wrong" ? colors.danger : colors.borderStrong;
            const badgeBg = kind === "correct" ? colors.secondary : kind === "wrong" ? colors.danger : colors.surfaceAlt;
            const badgeFg = kind === "correct" || kind === "wrong" ? "#fff" : colors.textSecondary;
            const note = answered ? optionNotes?.[i] : undefined;
            const tag = kind === "correct" ? "Bonne réponse" : kind === "wrong" ? "Ton choix" : null;
            return (
              <Pressable
                key={`${i}-${opt}`}
                disabled={answered}
                onPressIn={() => {
                  if (!answered) onPick(i);
                }}
                style={[
                  styles.opt,
                  {
                    backgroundColor: bg,
                    borderColor: border,
                    opacity: kind === "dim" ? 0.72 : 1,
                    alignItems: "flex-start",
                  },
                ]}
              >
                <View style={[styles.badge, { backgroundColor: badgeBg, marginTop: 2 }]}>
                  {kind === "correct" ? (
                    <Icon name="check" size={16} color="#fff" />
                  ) : kind === "wrong" ? (
                    <Icon name="x" size={16} color="#fff" />
                  ) : (
                    <Text style={[styles.badgeLetter, { color: badgeFg }]}>{letter}</Text>
                  )}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  {tag ? (
                    <Text style={[styles.optTag, { color: kind === "correct" ? colors.secondary : colors.danger }]}>{tag}</Text>
                  ) : null}
                  <Text style={[styles.optText, { color: colors.textDark }]}>{opt}</Text>
                  {note ? <Text style={[styles.optNote, { color: colors.textSecondary }]}>{note}</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {answered ? (
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: ok ? colors.svtBg : colors.angBg,
              borderTopColor: ok ? colors.svtBorder : colors.angBorder,
              paddingBottom: Math.max(12, insets.bottom + 8),
            },
          ]}
        >
          <View style={styles.sheetTitleRow}>
            <Icon name={ok ? "check-circle" : "alert-circle"} size={22} color={ok ? colors.secondary : colors.danger} />
            <Text style={[styles.sheetTitle, { color: ok ? colors.secondary : colors.danger }]}>
              {ok ? "C’est ça !" : "Pas tout à fait"}
            </Text>
          </View>
          {explanation ? <Text style={[styles.explain, { color: colors.textSecondary }]}>{explanation}</Text> : null}
          {!ok ? (
            <Text style={[styles.correctReveal, { color: colors.textDark }]}>La bonne réponse était : {options[correctIndex]}</Text>
          ) : null}
          {onReview && reviewLabel && !ok ? (
            <Pressable onPress={onReview} style={styles.linkBtn}>
              <Text style={[styles.linkText, { color: colors.primary }]}>{reviewLabel}</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={onContinue}
            style={[styles.continue, { backgroundColor: ok ? colors.secondary : colors.danger }]}
          >
            <Text style={styles.continueText}>{continueLabel}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  track: { flex: 1, height: 10, borderRadius: 999, overflow: "hidden" },
  fill: { height: 10, borderRadius: 999 },
  counter: { fontSize: 13, fontWeight: "800" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" },
  question: { marginTop: 8, fontSize: 22, fontWeight: "800", lineHeight: 28 },
  options: { marginTop: 22, gap: 12 },
  opt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLetter: { fontSize: 13, fontWeight: "900" },
  optText: { fontSize: 15, fontWeight: "700", lineHeight: 20 },
  optTag: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 },
  optNote: { marginTop: 6, fontSize: 12, fontWeight: "500", lineHeight: 18 },
  sheet: {
    borderTopWidth: 2,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sheetTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sheetTitle: { fontSize: 18, fontWeight: "800" },
  explain: { marginTop: 8, fontSize: 14, fontWeight: "500", lineHeight: 20 },
  correctReveal: { marginTop: 8, fontSize: 13, fontWeight: "700", lineHeight: 20 },
  linkBtn: { marginTop: 8, paddingVertical: 4 },
  linkText: { fontSize: 13, fontWeight: "800" },
  continue: { marginTop: 14, borderRadius: 16, paddingVertical: 15, alignItems: "center" },
  continueText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
