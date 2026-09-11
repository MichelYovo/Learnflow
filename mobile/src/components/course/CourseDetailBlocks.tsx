import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { isDetailHeading, splitDetailParas, type DetailBlocks } from "../../data/lessonContent";
import { useAppTheme } from "../../theme/useAppTheme";
import { appFont } from "../../theme/typography";

function BlockCard({
  n,
  label,
  children,
}: {
  n: number;
  label: string;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.white }]}>
      <Text style={[styles.kicker, { color: colors.primary }]}>
        {n} / 3 · {label}
      </Text>
      {children}
    </View>
  );
}

export default function CourseDetailBlocks({ blocks }: { blocks: DetailBlocks }) {
  const { colors } = useAppTheme();
  const paras = splitDetailParas(blocks.developpement);

  return (
    <View style={styles.stack}>
      <BlockCard n={1} label="Contexte">
        <Text style={[styles.h2, { color: colors.textDark }]}>Situation-problème</Text>
        <Text style={[styles.body, { color: colors.textDark }]}>{blocks.situation.recit}</Text>
        <View style={[styles.callout, { backgroundColor: colors.hgBg }]}>
          <Text style={[styles.calloutText, { color: colors.textDark }]}>{blocks.situation.question}</Text>
        </View>
        <Text style={[styles.competence, { color: colors.textSecondary }]}>
          <Text style={{ color: colors.primary, fontWeight: "800" }}>Compétence visée. </Text>
          {blocks.situation.competenceVisee}
        </Text>
      </BlockCard>

      <BlockCard n={2} label="Savoirs & savoir-faire">
        {paras.map((para, i) => (
          <Text
            key={i}
            style={[isDetailHeading(para) ? styles.heading : styles.body, { color: isDetailHeading(para) ? colors.primary : colors.textDark }]}
          >
            {para}
          </Text>
        ))}
      </BlockCard>

      <BlockCard n={3} label="Exemple résolu">
        <Text style={[styles.h2, { color: colors.textDark }]}>Énoncé</Text>
        <Text style={[styles.body, { color: colors.textDark }]}>{blocks.exemple.enonce}</Text>
        <View style={styles.steps}>
          {blocks.exemple.etapes.map((etape, i) => (
            <View key={`${etape.titre}-${i}`} style={styles.stepRow}>
              <View style={[styles.stepBadge, { backgroundColor: colors.mathsBg }]}>
                <Text style={[styles.stepN, { color: colors.primary }]}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepTitle, { color: colors.primary }]}>{etape.titre}</Text>
                <Text style={[styles.stepBody, { color: colors.textDark }]}>{etape.texte}</Text>
              </View>
            </View>
          ))}
        </View>
        {blocks.exemple.reponseFinale ? (
          <View style={[styles.callout, { backgroundColor: colors.svtBg }]}>
            <Text style={[styles.calloutText, { color: colors.textDark }]}>{blocks.exemple.reponseFinale}</Text>
          </View>
        ) : null}
      </BlockCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  card: { borderRadius: 24, paddingHorizontal: 20, paddingVertical: 22, gap: 12 },
  kicker: { fontFamily: appFont, fontSize: 11, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" },
  h2: { fontFamily: appFont, fontSize: 16, fontWeight: "800" },
  body: { fontFamily: appFont, fontSize: 17, fontWeight: "500", lineHeight: 28 },
  heading: { fontFamily: appFont, fontSize: 16, fontWeight: "800", lineHeight: 24 },
  callout: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 },
  calloutText: { fontFamily: appFont, fontSize: 15, fontWeight: "700", lineHeight: 22 },
  competence: { fontFamily: appFont, fontSize: 14, fontWeight: "600", lineHeight: 21 },
  steps: { gap: 12 },
  stepRow: { flexDirection: "row", gap: 12 },
  stepBadge: {
    marginTop: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepN: { fontFamily: appFont, fontSize: 12, fontWeight: "800" },
  stepTitle: { fontFamily: appFont, fontSize: 14, fontWeight: "800" },
  stepBody: { fontFamily: appFont, fontSize: 15, fontWeight: "500", lineHeight: 22, marginTop: 2 },
});
