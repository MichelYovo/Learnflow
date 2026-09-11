import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "./Icon";
import Spira from "./Spira";
import { spiraMoodForMode } from "../data/spira";
import {
  AppMode,
  MODE_DEFINITIONS,
  ModeCardStatus,
  ModeDefinition,
} from "../types/modes";
import { colors } from "../theme/colors";

export type ModeAvailability = Partial<
  Record<
    AppMode,
    {
      status: Exclude<ModeCardStatus, "selected">;
      /** Pourquoi inactive / locked — affiché sous la carte + annonce a11y */
      reason?: string;
    }
  >
>;

type Props = {
  /** Mode actuellement sélectionné (surbrillance) */
  selectedMode?: AppMode | null;
  /**
   * Disponibilité par mode.
   * Ex. Mode Guidé inactive : { guide: { status: "inactive", reason: "…" } }
   */
  availability?: ModeAvailability;
  /** Callback au lancement d'un mode disponible */
  onSelectMode: (mode: AppMode) => void;
  /** Affiche le bandeau d'aide sous la grille quand un mode inactif est pressé */
  showHelpOnDisabledPress?: boolean;
};

/**
 * ModeWorkSelector — grille des 4 modes (maquette Accueil « Mode de travail »).
 *
 * Contrôle de type radiogroup : un seul mode « sélectionné » à la fois.
 * Les cartes inactive/locked restent focusables pour annoncer le motif (a11y),
 * mais n'appellent pas onSelectMode.
 */
export default function ModeWorkSelector({
  selectedMode = null,
  availability = {},
  onSelectMode,
  showHelpOnDisabledPress = true,
}: Props) {
  const [helpText, setHelpText] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(1)).current;
  const helpOpacity = useRef(new Animated.Value(0)).current;

  const resolveStatus = (mode: AppMode): ModeCardStatus => {
    if (selectedMode === mode) return "selected";
    return availability[mode]?.status ?? "available";
  };

  const resolveReason = (mode: AppMode) => availability[mode]?.reason;

  // Transition fluide à chaque changement de sélection / disponibilité
  useEffect(() => {
    fade.setValue(0.88);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selectedMode, availability, fade]);

  useEffect(() => {
    if (!helpText) {
      helpOpacity.setValue(0);
      return;
    }
    Animated.timing(helpOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [helpText, helpOpacity]);

  const modes = useMemo(() => MODE_DEFINITIONS, []);

  const handlePress = (def: ModeDefinition) => {
    const status = resolveStatus(def.id);
    const reason = resolveReason(def.id);

    if (status === "inactive" || status === "locked") {
      const msg =
        reason ??
        (status === "locked"
          ? "Ce mode est verrouillé pour le moment."
          : "Ce mode est inactif pour le moment.");
      if (showHelpOnDisabledPress) setHelpText(msg);
      void AccessibilityInfo.announceForAccessibility(msg);
      return;
    }

    setHelpText(null);
    onSelectMode(def.id);
  };

  return (
    <View
      // radiogroup : une seule option « cochée » (selected) parmi les modes
      accessibilityRole="radiogroup"
      accessibilityLabel="Mode de travail"
    >
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>Modes</Text>
      </View>

      <Animated.View style={[styles.grid, { opacity: fade }]}>
        {modes.map((def) => {
          const status = resolveStatus(def.id);
          const reason = resolveReason(def.id);
          const disabled = status === "inactive" || status === "locked";
          const selected = status === "selected";

          return (
            <ModeCard
              key={def.id}
              definition={def}
              status={status}
              reason={reason}
              disabled={disabled}
              selected={selected}
              onPress={() => handlePress(def)}
            />
          );
        })}
      </Animated.View>

      {helpText ? (
        <Animated.View style={[styles.helpBanner, { opacity: helpOpacity }]}>
          <Icon name="lightbulb" size={14} color={colors.accent} />
          <Text style={styles.helpText}>{helpText}</Text>
          <Pressable
            onPress={() => setHelpText(null)}
            accessibilityRole="button"
            accessibilityLabel="Fermer l'aide"
            hitSlop={8}
          >
            <Icon name="x" size={14} color="#92400E" />
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

type CardProps = {
  definition: ModeDefinition;
  status: ModeCardStatus;
  reason?: string;
  disabled: boolean;
  selected: boolean;
  onPress: () => void;
};

function ModeCard({ definition: def, status, reason, disabled, selected, onPress }: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const a11yHint = disabled
    ? reason ?? "Mode indisponible"
    : def.purpose;

  return (
    <Animated.View style={[styles.cardWrap, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        // radio : état coché = mode sélectionné
        accessibilityRole="radio"
        accessibilityState={{
          disabled,
          checked: selected,
          selected,
        }}
        accessibilityLabel={def.label}
        accessibilityHint={a11yHint}
        style={[
          styles.card,
          {
            backgroundColor: def.bg,
            borderColor: selected ? def.color : def.border,
            borderWidth: selected ? 2 : 1,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {/* Curseur not-allowed n'existe pas en RN natif ; on signale via opacity + badge + a11y */}
        <View style={styles.cardTop}>
          <View style={styles.iconBox}>
            <Spira mood={spiraMoodForMode(def.id)} size={40} animated interactive={false} />
          </View>
          {disabled ? (
            <Icon name={status === "locked" ? "lock" : "alert-circle"} size={16} color="#94A3B8" />
          ) : null}
        </View>

        <Text style={[styles.label, { color: disabled ? "#94A3B8" : def.color }]}>{def.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textDark,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  cardWrap: { width: "48%" },
  card: {
    borderRadius: 24,
    padding: 18,
    minHeight: 128,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  label: { fontSize: 16, fontWeight: "800" },
  helpBanner: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 16,
    padding: 14,
  },
  helpText: { flex: 1, fontSize: 14, color: "#92400E", lineHeight: 20, fontWeight: "600" },
});
