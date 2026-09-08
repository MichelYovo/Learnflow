import { StyleSheet, Text, View } from "react-native";
import {
  normalizeKeyword,
  parseMaskedLine,
  splitLessonLines,
} from "../data/lessonContent";
import { appFont } from "../theme/typography";

type Props = {
  text: string;
  masked: boolean;
  revealed: Set<string>;
  onReveal: (word: string) => void;
  textColor?: string;
};

export default function InteractiveLessonText({ text, masked, revealed, onReveal, textColor = "#1C1917" }: Props) {
  const lines = splitLessonLines(text);

  return (
    <View style={styles.wrap} accessibilityRole="text">
      {lines.map((line, i) => {
        if (!line.trim()) {
          return <View key={`gap-${i}`} style={styles.paraGap} />;
        }
        const bullet = /^[•\-]\s+/.exec(line);
        const content = bullet ? line.slice(bullet[0].length) : line;
        const parsed = (
          <ParsedLine
            text={content}
            masked={masked}
            revealed={revealed}
            onReveal={onReveal}
            textColor={textColor}
          />
        );
        if (bullet) {
          return (
            <View key={`b-${i}`} style={styles.bulletRow}>
              <View style={styles.dot} />
              <View style={styles.bulletBody}>{parsed}</View>
            </View>
          );
        }
        return (
          <View key={`p-${i}`} style={styles.para}>
            {parsed}
          </View>
        );
      })}
    </View>
  );
}

function ParsedLine({
  text,
  masked,
  revealed,
  onReveal,
  textColor,
}: {
  text: string;
  masked: boolean;
  revealed: Set<string>;
  onReveal: (word: string) => void;
  textColor: string;
}) {
  const parts = parseMaskedLine(text);
  return (
    <Text style={[styles.body, { color: textColor }]}>
      {parts.map((p, i) => {
        if (p.kind === "text") {
          return (
            <Text key={i} style={[styles.run, { color: textColor }]}>
              {p.text}
            </Text>
          );
        }
        const hide = masked && !revealed.has(normalizeKeyword(p.text));
        if (hide) {
          return (
            <Text
              key={i}
              onPress={() => onReveal(p.text)}
              style={styles.mask}
              accessibilityRole="button"
              accessibilityLabel="Mot masqué, appuyer pour révéler"
            >
              {"••••"}
            </Text>
          );
        }
        return (
          <Text key={i} style={styles.cardinal}>
            {p.text}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  paraGap: { height: 14 },
  para: { marginBottom: 2 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 2 },
  bulletBody: { flex: 1 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1677FF", marginTop: 11 },
  body: {
    fontFamily: appFont,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "500",
  },
  run: {
    fontFamily: appFont,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "500",
  },
  cardinal: {
    fontFamily: appFont,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "700",
    color: "#1677FF",
  },
  mask: {
    fontFamily: appFont,
    backgroundColor: "#E7E5E4",
    color: "#78716C",
    fontWeight: "700",
    letterSpacing: 1.4,
    borderRadius: 5,
  },
});
