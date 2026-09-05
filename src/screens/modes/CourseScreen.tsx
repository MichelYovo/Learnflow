import React, { useMemo, useState } from "react";
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AnalogieSpira from "../../components/AnalogieSpira";
import Icon from "../../components/Icon";
import { ficheForChapter } from "../../data/fiches";
import { chapterHas3dImage } from "../../data/schemas3d";
import { colors } from "../../theme/colors";
import type { SchemaCoursKind } from "../../types/learnflow";
import type { RootStackParamList } from "../../navigation/types";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, "Course">;
type Speed = "essentiel" | "details";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

type Piece = { key: string; text: string; bold?: boolean; mask?: string };

/** Découpe **gras** sans String.split (capturing groups flaky sur Hermes). */
function splitBold(raw: string): { text: string; bold: boolean }[] {
  const out: { text: string; bold: boolean }[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    if (m.index > last) out.push({ text: raw.slice(last, m.index), bold: false });
    out.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < raw.length) out.push({ text: raw.slice(last), bold: false });
  return out;
}

function wordTokens(plain: string): string[] {
  const out: string[] = [];
  const re = /[A-Za-zÀ-ÖØ-öø-ÿŒœ0-9Δδ]+/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(plain))) {
    if (m.index > last) out.push(plain.slice(last, m.index));
    out.push(m[0]);
    last = m.index + m[0].length;
  }
  if (last < plain.length) out.push(plain.slice(last));
  return out;
}

function piecesOf(raw: string, keywords: string[]): Piece[] {
  const keys = keywords.filter(Boolean).sort((a, b) => b.length - a.length);
  const out: Piece[] = [];
  let n = 0;

  const maskFor = (token: string): string | undefined =>
    keys.find((k) => normalize(k) === normalize(token));

  for (const chunk of splitBold(raw)) {
    if (chunk.bold) {
      out.push({
        key: `p${n++}`,
        text: chunk.text,
        bold: true,
        mask: maskFor(chunk.text) ?? chunk.text,
      });
      continue;
    }
    for (const token of wordTokens(chunk.text)) {
      out.push({
        key: `p${n++}`,
        text: token,
        mask: maskFor(token),
      });
    }
  }
  return out;
}

function RichLine({
  text,
  keywords,
  bionic,
  masked,
  revealed,
  onReveal,
  style,
}: {
  text: string;
  keywords: string[];
  bionic: boolean;
  masked: boolean;
  revealed: Set<string>;
  onReveal: (word: string) => void;
  style?: object;
}) {
  const pieces = useMemo(() => piecesOf(text, keywords), [text, keywords]);
  const boldChunks = useMemo(() => splitBold(text), [text]);

  if (!masked) {
    return (
      <Text style={style}>
        {boldChunks.map((p, i) => (
          <Text key={`b${i}`} style={bionic && p.bold ? styles.bold : undefined}>
            {p.text}
          </Text>
        ))}
      </Text>
    );
  }

  return (
    <View style={styles.line}>
      {pieces.map((p) => {
        const hide = Boolean(p.mask && !revealed.has(normalize(p.mask)));
        if (hide && p.mask) {
          return (
            <Pressable
              key={p.key}
              onPress={() => onReveal(p.mask!)}
              hitSlop={6}
              style={styles.maskChip}
              accessibilityRole="button"
              accessibilityLabel="Mot masqué, appuyer pour révéler"
            >
              <Text style={styles.maskChipText}>••••</Text>
            </Pressable>
          );
        }
        return (
          <Text key={p.key} style={[style, bionic && p.bold ? styles.bold : undefined]}>
            {p.text}
          </Text>
        );
      })}
    </View>
  );
}

export default function CourseScreen({ navigation, route }: Props) {
  const chapterId = route.params?.chapterId ?? "eq2";
  const fiche = useMemo(() => ficheForChapter(chapterId), [chapterId]);
  const [speed, setSpeed] = useState<Speed>("essentiel");
  const [bionic, setBionic] = useState(true);
  const [masked, setMasked] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Record<string, boolean>>({
    [fiche.sectionsDetaillees[0]?.id ?? ""]: true,
  });

  const show2d = fiche.schema === "2d" || fiche.schema === "both";
  const show3d = fiche.schema === "3d" || fiche.schema === "both" || chapterHas3dImage(chapterId);
  const analogieAfter = Math.min(1, Math.max(0, fiche.sectionsDetaillees.length - 1));

  const reveal = (word: string) => {
    setRevealed((prev) => new Set(prev).add(normalize(word)));
  };

  const setSpeedTab = (next: Speed) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSpeed(next);
  };

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const rich = (text: string, extra?: object) => (
    <RichLine
      text={text}
      keywords={fiche.motsClesMasques}
      bionic={bionic}
      masked={masked}
      revealed={revealed}
      onReveal={reveal}
      style={extra}
    />
  );

  const analogieBox = fiche.analogie ? <AnalogieSpira analogie={fiche.analogie} /> : null;

  const openSchema = (kind: SchemaCoursKind) => {
    if (kind === "3d") navigation.navigate("Schema3D", { chapterId });
    else navigation.navigate("Schema2D", { chapterId });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} accessibilityLabel="Retour">
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {fiche.titre}
          </Text>
        </View>
      </View>

      <View style={styles.tools}>
        <Pressable
          onPress={() => setBionic((v) => !v)}
          style={[styles.chip, bionic && styles.chipOn]}
        >
          <Text style={[styles.chipText, bionic && styles.chipTextOn]}>
            {bionic ? "Bionique ON" : "Bionique OFF"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setMasked((v) => !v);
            setRevealed(new Set());
          }}
          style={[styles.chip, masked && styles.chipMaskOn]}
        >
          <Icon name={masked ? "eye-off" : "eye"} size={12} color={masked ? colors.accent : colors.primary} />
          <Text style={[styles.chipText, masked && { color: colors.accent }]}>
            {masked ? "Texte masqué" : "Masquer les mots"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.speedRow}>
          <Pressable
            onPress={() => setSpeedTab("essentiel")}
            style={[styles.speed, speed === "essentiel" && styles.speedActive]}
          >
            <Text style={[styles.speedLabel, speed === "essentiel" && styles.speedLabelOn]}>
              L'Essentiel
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSpeedTab("details")}
            style={[styles.speed, speed === "details" && styles.speedActive]}
          >
            <Text style={[styles.speedLabel, speed === "details" && styles.speedLabelOn]}>
              En Détails
            </Text>
          </Pressable>
        </View>

          {speed === "essentiel" ? (
          <View style={styles.card}>
            {fiche.pucesEssentiel.map((puce, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.dot} />
                <View style={{ flex: 1 }}>{rich(puce, styles.body)}</View>
              </View>
            ))}
            {masked ? (
              <Text style={styles.maskHint}>Appuie sur un mot masqué pour le révéler.</Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.detailsWrap}>
            {fiche.sectionsDetaillees.map((section, idx) => {
              const shown = open[section.id] ?? false;
              return (
                <React.Fragment key={section.id}>
                  {idx === analogieAfter ? analogieBox : null}
                  <View style={styles.acc}>
                    <Pressable onPress={() => toggleSection(section.id)} style={styles.accHead}>
                      <Text style={styles.accTitle}>{section.titre}</Text>
                      <Icon
                        name={shown ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={colors.primary}
                      />
                    </Pressable>
                    {shown
                      ? section.paragraphes.map((p, pi) => (
                          <View key={pi} style={styles.accBody}>
                            {rich(p, styles.body)}
                          </View>
                        ))
                      : null}
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}

        {speed === "essentiel" ? analogieBox : null}

        {show2d || show3d ? (
          <View style={styles.schemaBox}>
            <View style={styles.schemaRow}>
              {show2d ? (
                <Pressable style={styles.schemaBtn} onPress={() => openSchema("2d")}>
                  <Icon name="grid" size={18} color={colors.secondary} />
                  <Text style={styles.schemaBtnText}>Schéma 2D</Text>
                </Pressable>
              ) : null}
              {show3d ? (
                <Pressable style={styles.schemaBtn} onPress={() => openSchema("3d")}>
                  <Icon name="atom" size={18} color={colors.cyan} />
                  <Text style={styles.schemaBtnText}>Modèle 3D</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        <Pressable
          style={styles.primary}
          onPress={() => navigation.navigate("AssimilationQuiz", { chapterId })}
        >
          <Text style={styles.primaryText}>Passer le quizz d'assimilation</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontWeight: "800", color: colors.textDark, fontSize: 18 },
  tools: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingTop: 12 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.mathsBg, borderColor: colors.mathsBorder },
  chipMaskOn: { backgroundColor: colors.hgBg, borderColor: colors.hgBorder },
  chipText: { fontSize: 14, fontWeight: "700", color: colors.primary },
  chipTextOn: { color: colors.primary },
  scroll: { padding: 20, gap: 18, paddingBottom: 40 },
  speedRow: { flexDirection: "row", gap: 10 },
  speed: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speedActive: { borderColor: colors.primary, backgroundColor: colors.mathsBg },
  speedLabel: { fontSize: 16, fontWeight: "800", color: colors.textMuted, textAlign: "center" },
  speedLabelOn: { color: colors.primary },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  bulletRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 7,
  },
  body: { fontSize: 16, lineHeight: 26, color: "#44403C" },
  bold: { fontWeight: "800", color: colors.primary },
  line: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", flex: 1 },
  maskChip: {
    backgroundColor: "#E7E5E4",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  maskChipText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1.2,
  },
  maskHint: { fontSize: 14, fontWeight: "600", color: colors.textMuted, marginTop: 4 },
  detailsWrap: { gap: 12 },
  acc: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: "hidden",
  },
  accHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  accTitle: { flex: 1, fontSize: 16, fontWeight: "800", color: colors.textDark },
  accBody: { paddingHorizontal: 18, paddingBottom: 16 },
  schemaBox: {
    backgroundColor: colors.svtBg,
    borderRadius: 24,
    padding: 16,
    gap: 10,
  },
  schemaRow: { flexDirection: "row", gap: 8 },
  schemaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
  },
  schemaBtnText: { fontWeight: "800", color: colors.textDark, fontSize: 15 },
  primary: { backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 18, alignItems: "center" },
  primaryText: { color: colors.white, fontWeight: "800", fontSize: 17 },
});
