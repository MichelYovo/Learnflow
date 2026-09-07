import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { CELL_ORGANELLES } from "../../data/modeContent";
import { schemas3dForChapter, type Schema3DModel, type Schema3DPart } from "../../data/schemas3d";
import { usePublishedCatalog } from "../../data/publishedCache";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Schema3D">;
const ANGLES = ["Face", "Profil", "Coupe"] as const;

export default function Schema3DScreen({ navigation, route }: Props) {
  const chapterId = route.params?.chapterId;
  const catalogEpoch = usePublishedCatalog();
  const models = useMemo(() => schemas3dForChapter(chapterId), [chapterId, catalogEpoch]);
  if (models.length === 0) {
    return <LegacyCellModel navigation={navigation} />;
  }
  return <ImageSchema3D navigation={navigation} models={models} />;
}

function ImageSchema3D({
  navigation,
  models,
}: {
  navigation: Props["navigation"];
  models: Schema3DModel[];
}) {
  const [modelIdx, setModelIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(models[0].parts[0]?.id ?? null);
  const [quiz, setQuiz] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const model = models[modelIdx] ?? models[0];
  const part: Schema3DPart = model.parts.find((p) => p.id === picked) ?? model.parts[0];

  const startQuiz = () => {
    const target = model.parts[Math.floor(Math.random() * model.parts.length)];
    setQuiz(target.id);
    setFeedback(null);
    setPicked(null);
  };

  const tapPart = (id: string) => {
    if (quiz) {
      const ok = id === quiz;
      const name = model.parts.find((p) => p.id === quiz)?.label;
      setFeedback(ok ? `Oui — ${name}.` : `Pas celui-là. Cherche encore : ${name}.`);
      if (ok) setQuiz(null);
      setPicked(id);
      return;
    }
    setPicked(id);
    setFeedback(null);
  };

  const switchModel = (idx: number) => {
    setModelIdx(idx);
    setQuiz(null);
    setFeedback(null);
    setPicked(models[idx].parts[0]?.id ?? null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Modèle 3D · SVT</Text>
          <Text style={styles.sub}>{model.subtitle}</Text>
        </View>
        <Spira scene="schema" size={48} message="" />
      </View>

      {models.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {models.map((m, i) => {
            const on = i === modelIdx;
            return (
              <Pressable key={m.id} onPress={() => switchModel(i)} style={[styles.tab, on && styles.tabOn]}>
                <Text style={[styles.tabText, on && styles.tabTextOn]}>{m.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      <View style={styles.stage}>
        <Image source={model.image} style={styles.hero} resizeMode="contain" accessibilityLabel={model.title} />
        {model.parts.map((p) => {
          const on = picked === p.id;
          const target = quiz === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => tapPart(p.id)}
              accessibilityLabel={p.label}
              style={[
                styles.spot,
                { left: `${p.x}%`, top: `${p.y}%` },
                on && styles.spotOn,
                target && styles.spotQuiz,
              ]}
            />
          );
        })}
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.quizBtn} onPress={startQuiz}>
          <Text style={styles.quizText}>{quiz ? "Nouvelle cible" : "Quiz du modèle"}</Text>
        </Pressable>
      </View>

      {quiz ? (
        <Text style={styles.quizPrompt}>Touche : {model.parts.find((p) => p.id === quiz)?.label}</Text>
      ) : null}

      {part ? (
        <View style={styles.card}>
          <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{part.label}</Text>
            <Text style={styles.cardSub}>{part.role}</Text>
          </View>
        </View>
      ) : null}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </SafeAreaView>
  );
}

function LegacyCellModel({ navigation }: { navigation: Props["navigation"] }) {
  const [angle, setAngle] = useState(0);
  const [picked, setPicked] = useState<string | null>(CELL_ORGANELLES[0].id);
  const [quiz, setQuiz] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const organelle = CELL_ORGANELLES.find((o) => o.id === picked) ?? CELL_ORGANELLES[0];

  const startQuiz = () => {
    const target = CELL_ORGANELLES[Math.floor(Math.random() * CELL_ORGANELLES.length)];
    setQuiz(target.id);
    setFeedback(null);
    setPicked(null);
  };

  const tapPart = (id: string) => {
    if (quiz) {
      const ok = id === quiz;
      const name = CELL_ORGANELLES.find((o) => o.id === quiz)?.label;
      setFeedback(ok ? `Oui — ${name}.` : `Pas celui-là. Cherche encore : ${name}.`);
      if (ok) setQuiz(null);
      setPicked(id);
      return;
    }
    setPicked(id);
    setFeedback(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Modèle 3D · SVT</Text>
          <Text style={styles.sub}>Cellule eucaryote · tourne et explore</Text>
        </View>
        <Spira scene="schema" size={48} message="" />
      </View>

      <View style={styles.stage}>
        <View style={[styles.cell, angle === 1 && styles.cellProfil, angle === 2 && styles.cellCut]}>
          <Pressable onPress={() => tapPart("membrane")} style={[styles.membrane, picked === "membrane" && styles.glow]} />
          <Pressable onPress={() => tapPart("cyto")} style={[styles.cyto, picked === "cyto" && styles.glow]} />
          <Pressable
            onPress={() => tapPart("noyau")}
            style={[styles.noyau, angle === 1 && { left: 78 }, picked === "noyau" && styles.glow]}
          />
          <Pressable
            onPress={() => tapPart("mito")}
            style={[styles.mito, angle === 2 && { top: 118, left: 42 }, picked === "mito" && styles.glow]}
          />
          <Pressable
            onPress={() => tapPart("ribo")}
            style={[styles.ribo, angle === 1 && { left: 36, top: 46 }, picked === "ribo" && styles.glow]}
          />
        </View>
        <Text style={styles.angleLbl}>{ANGLES[angle]}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.rotate} onPress={() => setAngle((a) => (a + 1) % ANGLES.length)}>
          <Icon name="refresh-cw" size={16} color={colors.cyan} />
          <Text style={styles.rotateText}>Pivoter</Text>
        </Pressable>
        <Pressable style={styles.quizBtn} onPress={startQuiz}>
          <Text style={styles.quizText}>{quiz ? "Nouvelle cible" : "Quiz du modèle"}</Text>
        </Pressable>
      </View>

      {quiz ? (
        <Text style={styles.quizPrompt}>Touche : {CELL_ORGANELLES.find((o) => o.id === quiz)?.label}</Text>
      ) : null}

      <View style={styles.card}>
        <View style={[styles.dot, { backgroundColor: organelle.color }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{organelle.label}</Text>
          <Text style={styles.cardSub}>{organelle.role}</Text>
        </View>
      </View>
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontWeight: "800", fontSize: 18, color: colors.textDark },
  sub: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  tabs: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
  },
  tabOn: { borderColor: colors.secondary, backgroundColor: colors.svtBg },
  tabText: { fontWeight: "800", fontSize: 12, color: colors.textMuted },
  tabTextOn: { color: colors.secondary },
  stage: {
    marginHorizontal: 20,
    height: 320,
    backgroundColor: "#0B1220",
    borderRadius: 28,
    overflow: "hidden",
  },
  hero: { ...StyleSheet.absoluteFill, width: "100%", height: "100%" },
  spot: {
    position: "absolute",
    width: 22,
    height: 22,
    marginLeft: -11,
    marginTop: -11,
    borderRadius: 11,
    backgroundColor: "rgba(16,185,129,0.35)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  spotOn: { backgroundColor: "rgba(22,119,255,0.65)", borderColor: "#FFFFFF", transform: [{ scale: 1.2 }] },
  spotQuiz: { borderColor: "#FBBF24", backgroundColor: "rgba(251,191,36,0.45)" },
  cell: { width: 200, height: 200, alignItems: "center", justifyContent: "center" },
  cellProfil: { transform: [{ scaleX: 0.72 }] },
  cellCut: { transform: [{ rotate: "-12deg" }] },
  membrane: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: "#34D399",
  },
  cyto: {
    position: "absolute",
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: "rgba(6,182,212,0.18)",
  },
  noyau: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3B82F6",
    left: 68,
    top: 68,
  },
  mito: {
    position: "absolute",
    width: 36,
    height: 22,
    borderRadius: 12,
    backgroundColor: "#F59E0B",
    left: 28,
    top: 118,
  },
  ribo: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#A78BFA",
    left: 128,
    top: 42,
  },
  glow: { borderWidth: 3, borderColor: "#FFFFFF" },
  angleLbl: { position: "absolute", bottom: 12, color: "rgba(255,255,255,0.6)", fontWeight: "800", fontSize: 11 },
  controls: { flexDirection: "row", gap: 10, padding: 16 },
  rotate: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.pcBorder,
    paddingVertical: 12,
  },
  rotateText: { fontWeight: "800", color: colors.cyan },
  quizBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  quizText: { fontWeight: "800", color: colors.white, fontSize: 13 },
  quizPrompt: {
    textAlign: "center",
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 14,
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
  cardTitle: { fontWeight: "800", color: colors.textDark },
  cardSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  feedback: { textAlign: "center", marginTop: 10, fontWeight: "800", color: colors.textDark },
});
