import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "../Icon";
import { useAppTheme } from "../../theme/useAppTheme";
import { appFont } from "../../theme/typography";
import type { QCMData } from "../../types/learnflow";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

function optionKind(i: number, selected: number | null, correct: number) {
  if (selected === null) return "idle" as const;
  if (i === correct) return "correct" as const;
  if (i === selected) return "wrong" as const;
  return "dim" as const;
}

export default function MiniAutoEval({ questions }: { questions: QCMData[] }) {
  const { colors } = useAppTheme();
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));

  useEffect(() => {
    setPicked(questions.map(() => null));
  }, [questions]);

  return (
    <View style={styles.wrap}>
      {questions.map((q, qi) => {
        const selected = picked[qi] ?? null;
        const answered = selected !== null;
        return (
          <View key={q.id || `${qi}-${q.enonceQuestion}`} style={styles.qBlock}>
            <Text style={[styles.kicker, { color: colors.textMuted }]}>
              Question {qi + 1} / {questions.length}
            </Text>
            <Text style={[styles.enonce, { color: colors.textDark }]}>{q.enonceQuestion}</Text>
            <View style={styles.options}>
              {q.optionsProposees.map((opt, i) => {
                const kind = optionKind(i, selected, q.indexReponseCorrecte);
                const bg = kind === "correct" ? colors.svtBg : kind === "wrong" ? colors.angBg : colors.white;
                const border =
                  kind === "correct" ? colors.secondary : kind === "wrong" ? colors.danger : colors.borderStrong;
                const badgeBg =
                  kind === "correct" ? colors.secondary : kind === "wrong" ? colors.danger : colors.surfaceAlt;
                const badgeFg = kind === "correct" || kind === "wrong" ? "#fff" : colors.textSecondary;
                return (
                  <Pressable
                    key={`${q.id}-${i}`}
                    disabled={answered}
                    onPress={() =>
                      setPicked((prev) => {
                        const next = [...prev];
                        next[qi] = i;
                        return next;
                      })
                    }
                    style={[styles.opt, { backgroundColor: bg, borderColor: border, opacity: kind === "dim" ? 0.42 : 1 }]}
                  >
                    <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                      {kind === "correct" ? (
                        <Icon name="check" size={14} color="#fff" />
                      ) : kind === "wrong" ? (
                        <Icon name="x" size={14} color="#fff" />
                      ) : (
                        <Text style={[styles.badgeText, { color: badgeFg }]}>{LETTERS[i] ?? String(i + 1)}</Text>
                      )}
                    </View>
                    <Text style={[styles.optText, { color: colors.textDark }]}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
            {answered && q.explicationPedagogique ? (
              <Text style={[styles.explain, { color: colors.textSecondary }]}>{q.explicationPedagogique}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16, gap: 24 },
  qBlock: { gap: 10 },
  kicker: { fontFamily: appFont, fontSize: 12, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" },
  enonce: { fontFamily: appFont, fontSize: 16, fontWeight: "800", lineHeight: 22 },
  options: { gap: 10 },
  opt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontFamily: appFont, fontSize: 12, fontWeight: "800" },
  optText: { flex: 1, fontFamily: appFont, fontSize: 15, fontWeight: "700", lineHeight: 21 },
  explain: { fontFamily: appFont, fontSize: 14, fontWeight: "600", lineHeight: 20 },
});
