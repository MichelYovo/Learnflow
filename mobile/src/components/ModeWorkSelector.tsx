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
import ModeMascot from "./ModeMascot";
import {
  AppMode,
  MODE_DEFINITIONS,
  ModeCardStatus,
  ModeDefinition,
} from "../types/modes";
import { colors } from "../theme/colors";

const PRESS_DEPTH = 5;

export type ModeAvailability = Partial<
  Record<
    AppMode,
    {
      status: Exclude<ModeCardStatus, "selected">;
      reason?: string;
    }
  >
>;

type Props = {
  selectedMode?: AppMode | null;
  availability?: ModeAvailability;
  onSelectMode: (mode: AppMode) => void;
  showHelpOnDisabledPress?: boolean;
};

/**
 * ModeWorkSelector — grille des 4 modes (Accueil « Mode de travail »).
 * Cartes en boutons 3D (ombre solide) + mascottes Spira agrandies.
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
    <View accessibilityRole="radiogroup" accessibilityLabel="Mode de travail">
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
  const [pressed, setPressed] = useState(false);
  const mascotY = useRef(new Animated.Value(0)).current;

  const bounceMascot = () => {
    if (disabled) return;
    Animated.sequence([
      Animated.timing(mascotY, { toValue: -10, duration: 140, useNativeDriver: true }),
      Animated.spring(mascotY, { toValue: 0, useNativeDriver: true, speed: 28, bounciness: 8 }),
    ]).start();
  };

  const a11yHint = disabled ? (reason ?? "Mode indisponible") : def.purpose;
  const label = def.label.replace("Mode ", "").replace(" 60s", "");
  const ground = `${def.depth}33`;
  const depth = pressed || disabled ? 0 : PRESS_DEPTH;

  return (
    <View style={[styles.cardWrap, { marginBottom: PRESS_DEPTH }]}>
      {!disabled ? (
        <View
          style={[
            styles.shadowPlate,
            {
              backgroundColor: def.depth,
              height: PRESS_DEPTH + 22,
              opacity: pressed ? 0 : 1,
            },
          ]}
        />
      ) : null}

      <Pressable
        onPress={onPress}
        onPressIn={() => {
          if (disabled) return;
          setPressed(true);
          bounceMascot();
        }}
        onPressOut={() => setPressed(false)}
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
            borderWidth: 2,
            opacity: disabled ? 0.55 : 1,
            transform: [{ translateY: pressed && !disabled ? PRESS_DEPTH : 0 }],
            marginBottom: depth,
          },
        ]}
      >
        {disabled ? (
          <View style={styles.lockBadge}>
            <Icon name={status === "locked" ? "lock" : "alert-circle"} size={16} color="#94A3B8" />
          </View>
        ) : null}

        <Animated.View style={[styles.mascotSlot, { transform: [{ translateY: mascotY }] }]}>
          <ModeMascot mode={def.id} size={108} groundColor={ground} />
        </Animated.View>

        <Text style={[styles.label, { color: disabled ? "#94A3B8" : def.color }]}>{label}</Text>
      </Pressable>
    </View>
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
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  cardWrap: { width: "47%", position: "relative" },
  shadowPlate: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
  },
  card: {
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    minHeight: 168,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "visible",
    zIndex: 1,
  },
  lockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 4,
  },
  mascotSlot: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 6,
    minHeight: 112,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
    textAlign: "center",
  },
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
