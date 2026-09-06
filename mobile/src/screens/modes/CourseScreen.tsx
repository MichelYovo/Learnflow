import React, { useMemo, useState } from "react";
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View, type StyleProp, type TextStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AnalogieSpira from "../../components/AnalogieSpira";
import Icon from "../../components/Icon";
import { countWords, ficheForChapter } from "../../data/fiches";
import { chapterHas3dImage } from "../../data/schemas3d";
import { useAppTheme } from "../../theme/useAppTheme";
import { appFont } from "../../theme/typography";
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

type Piece = { key: string; text: string; cardinal?: boolean; mask?: string };

function splitBold(raw: string): { text: string; cardinal: boolean }[] {
  const out: { text: string; cardinal: boolean }[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    if (m.index > last) out.push({ text: raw.slice(last, m.index), cardinal: false });
    out.push({ text: m[1], cardinal: true });
    last = m.index + m[0].length;
  }
  if (last < raw.length) out.push({ text: raw.slice(last), cardinal: false });
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
    if (chunk.cardinal) {
      out.push({
        key: `p${n++}`,
        text: chunk.text,
        cardinal: true,
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
  masked,
  revealed,
  onReveal,
  style,
}: {
  text: string;
  keywords: string[];
  masked: boolean;
  revealed: Set<string>;
  onReveal: (word: string) => void;
  style?: StyleProp<TextStyle>;
}) {
  const pieces = useMemo(() => piecesOf(text, keywords), [text, keywords]);

  if (!masked) {
    return (
      <Text style={[styles.body, style]}>
        {splitBold(text).map((p, i) => (
          <Text key={`b${i}`} style={p.cardinal ? styles.cardinal : styles.bodyRun}>
            {p.text}
          </Text>
        ))}
      </Text>
    );
  }

  return (
    <Text style={[styles.body, style]}>
      {pieces.map((p) => {
        const hide = Boolean(p.mask && !revealed.has(normalize(p.mask)));
        if (hide && p.mask) {
          return (
            <Text
              key={p.key}
              onPress={() => onReveal(p.mask!)}
              style={styles.maskInline}
              accessibilityRole="button"
              accessibilityLabel="Mot masqué, appuyer pour révéler"
            >
              {"••••"}
            </Text>
          );
        }
        return (
          <Text key={p.key} style={p.cardinal ? styles.cardinal : styles.bodyRun}>
            {p.text}
          </Text>
        );
      })}
    </Text>
  );
}

function apcKind(titre: string): string | null {
  const t = titre.toLowerCase();
  if (t.includes("compétence")) return "Compétence";
  if (t.includes("savoir-faire")) return "Savoir-faire";
  if (t.includes("savoir")) return "Savoirs";
  if (t.includes("exemple")) return "Exemple";
  return null;
}

export default function CourseScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const chapterId = route.params?.chapterId ?? "eq2";
  const fiche = useMemo(() => ficheForChapter(chapterId), [chapterId]);
  const [speed, setSpeed] = useState<Speed>("essentiel");
  const [masked, setMasked] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Record<string, boolean>>({
    [fiche.sectionsDetaillees[0]?.id ?? ""]: true,
  });

  const wordCount = useMemo(() => countWords(fiche.pucesEssentiel), [fiche.pucesEssentiel]);
  const show2d = fiche.schema === "2d" || fiche.schema === "both";
  const show3d = fiche.schema === "3d" || fiche.schema === "both" || chapterHas3dImage(chapterId);
  const analogieAfter = Math.min(1, Math.max(0, fiche.sectionsDetaillees.length - 1));

  const reveal = (word: string) => {
    setRevealed((prev) => new Set(prev).add(normalize(word)));
  };

  const setSpeedTab = (next: Speed) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSpeed(next);
    if (next === "details") {
      setMasked(false);
      setRevealed(new Set());
    }
  };

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = (shown: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next: Record<string, boolean> = {};
    for (const s of fiche.sectionsDetaillees) next[s.id] = shown;
    setOpen(next);
  };

  const rich = (text: string, extra?: StyleProp<TextStyle>, withMask = false) => (
    <RichLine
      text={text}
      keywords={fiche.motsClesMasques}
      masked={withMask && masked}
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]} accessibilityLabel="Retour">
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.textDark }]} numberOfLines={1}>
            {fiche.titre}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.speedRow}>
          <Pressable
            onPress={() => setSpeedTab("essentiel")}
            style={[
              styles.speed,
              { backgroundColor: colors.white, borderColor: colors.border },
              speed === "essentiel" && { borderColor: colors.primary, backgroundColor: colors.mathsBg },
            ]}
          >
            <Text style={[styles.speedLabel, { color: colors.textMuted }, speed === "essentiel" && { color: colors.primary }]}>
              L'Essentiel
            </Text>
            <Text style={[styles.speedHint, speed === "essentiel" && { color: colors.primary }]}>
              Synthèse · {wordCount} mots
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSpeedTab("details")}
            style={[
              styles.speed,
              { backgroundColor: colors.white, borderColor: colors.border },
              speed === "details" && { borderColor: colors.primary, backgroundColor: colors.mathsBg },
            ]}
          >
            <Text style={[styles.speedLabel, { color: colors.textMuted }, speed === "details" && { color: colors.primary }]}>
              En Détails
            </Text>
            <Text style={[styles.speedHint, speed === "details" && { color: colors.primary }]}>Cours APC complet</Text>
          </Pressable>
        </View>

        {speed === "essentiel" ? (
          <>
            <Pressable
              onPress={() => {
                setMasked((v) => !v);
                setRevealed(new Set());
              }}
              style={[
                styles.maskToggle,
                { backgroundColor: colors.white, borderColor: colors.border },
                masked && { backgroundColor: colors.hgBg, borderColor: colors.hgBorder },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: masked }}
            >
              <Icon name={masked ? "eye-off" : "eye"} size={16} color={masked ? colors.accent : colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.maskTitle, { color: colors.textDark }]}>Texte masqué</Text>
                <Text style={[styles.maskSub, { color: colors.textMuted }]}>
                  {masked ? "Appuie sur un mot pour le révéler." : "Cache les mots-clés, révèle-les au tap."}
                </Text>
              </View>
              <View style={[styles.maskBadge, { backgroundColor: masked ? colors.accent : colors.surfaceAlt }]}>
                <Text style={[styles.maskBadgeText, { color: masked ? "#FFFFFF" : colors.textMuted }]}>
                  {masked ? "ON" : "OFF"}
                </Text>
              </View>
            </Pressable>

            <View style={[styles.card, { backgroundColor: colors.white }]}>
              {fiche.pucesEssentiel.map((puce, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  <View style={{ flex: 1 }}>{rich(puce, { color: colors.textDark }, true)}</View>
                </View>
              ))}
            </View>
            {analogieBox}
          </>
        ) : (
          <View style={styles.detailsWrap}>
            <View style={styles.detailsBar}>
              <Text style={[styles.detailsLead, { color: colors.textSecondary }]}>
                Vue dépliable — cours développé, conforme aux exigences APC.
              </Text>
              <Pressable onPress={() => toggleAll(!fiche.sectionsDetaillees.every((s) => open[s.id]))} hitSlop={8}>
                <Text style={[styles.detailsToggle, { color: colors.primary }]}>
                  {fiche.sectionsDetaillees.every((s) => open[s.id]) ? "Replier tout" : "Déplier tout"}
                </Text>
              </Pressable>
            </View>

            {fiche.sectionsDetaillees.map((section, idx) => {
              const shown = open[section.id] ?? false;
              const kind = apcKind(section.titre);
              return (
                <React.Fragment key={section.id}>
                  {idx === analogieAfter ? analogieBox : null}
                  <View style={[styles.acc, { backgroundColor: colors.white }]}>
                    <Pressable onPress={() => toggleSection(section.id)} style={styles.accHead} accessibilityState={{ expanded: shown }}>
                      <View style={{ flex: 1, gap: 4 }}>
                        {kind ? (
                          <Text style={[styles.accKind, { color: colors.primary }]}>{kind}</Text>
                        ) : null}
                        <Text style={[styles.accTitle, { color: colors.textDark }]}>{section.titre}</Text>
                      </View>
                      <Icon name={shown ? "chevron-up" : "chevron-down"} size={18} color={colors.primary} />
                    </Pressable>
                    {shown
                      ? section.paragraphes.map((p, pi) => (
                          <View key={pi} style={styles.accBody}>
                            {rich(p, { color: colors.textDark })}
                          </View>
                        ))
                      : null}
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}

        {show2d || show3d ? (
          <View style={[styles.schemaBox, { backgroundColor: colors.svtBg }]}>
            <View style={styles.schemaRow}>
              {show2d ? (
                <Pressable style={[styles.schemaBtn, { backgroundColor: colors.white }]} onPress={() => openSchema("2d")}>
                  <Icon name="grid" size={18} color={colors.secondary} />
                  <Text style={[styles.schemaBtnText, { color: colors.textDark }]}>Schéma 2D</Text>
                </Pressable>
              ) : null}
              {show3d ? (
                <Pressable style={[styles.schemaBtn, { backgroundColor: colors.white }]} onPress={() => openSchema("3d")}>
                  <Icon name="atom" size={18} color={colors.cyan} />
                  <Text style={[styles.schemaBtnText, { color: colors.textDark }]}>Modèle 3D</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        <Pressable
          style={[styles.primary, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("AssimilationQuiz", { chapterId })}
        >
          <Text style={styles.primaryText}>Passer le quizz d'assimilation</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontFamily: appFont, fontWeight: "800", fontSize: 18 },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  speedRow: { flexDirection: "row", gap: 10 },
  speed: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    gap: 2,
  },
  speedLabel: { fontFamily: appFont, fontSize: 16, fontWeight: "800", textAlign: "center" },
  speedHint: { fontFamily: appFont, fontSize: 11, fontWeight: "600", textAlign: "center", color: "#94A3B8" },
  maskToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  maskTitle: { fontFamily: appFont, fontSize: 15, fontWeight: "800" },
  maskSub: { fontFamily: appFont, fontSize: 12, fontWeight: "500", marginTop: 2 },
  maskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  maskBadgeText: { fontFamily: appFont, fontSize: 11, fontWeight: "800" },
  card: { borderRadius: 24, paddingHorizontal: 20, paddingVertical: 22, gap: 18 },
  bulletRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 9 },
  body: {
    fontFamily: appFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  bodyRun: {
    fontFamily: appFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  cardinal: {
    fontFamily: appFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: "#1677FF",
  },
  maskInline: {
    fontFamily: appFont,
    backgroundColor: "#E7E5E4",
    color: "#78716C",
    fontWeight: "700",
    letterSpacing: 1.4,
    borderRadius: 5,
  },
  detailsWrap: { gap: 12 },
  detailsBar: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  detailsLead: { flex: 1, fontFamily: appFont, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  detailsToggle: { fontFamily: appFont, fontSize: 13, fontWeight: "800" },
  acc: { borderRadius: 20, overflow: "hidden" },
  accHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  accKind: { fontFamily: appFont, fontSize: 11, fontWeight: "800", letterSpacing: 0.4, textTransform: "uppercase" },
  accTitle: { fontFamily: appFont, fontSize: 16, fontWeight: "800" },
  accBody: { paddingHorizontal: 18, paddingBottom: 16 },
  schemaBox: { borderRadius: 24, padding: 16 },
  schemaRow: { flexDirection: "row", gap: 8 },
  schemaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
  },
  schemaBtnText: { fontFamily: appFont, fontWeight: "800", fontSize: 15 },
  primary: { borderRadius: 18, paddingVertical: 18, alignItems: "center" },
  primaryText: { fontFamily: appFont, color: "#FFFFFF", fontWeight: "800", fontSize: 17 },
});
