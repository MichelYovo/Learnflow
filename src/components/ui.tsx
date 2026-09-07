import React, { useEffect, type ReactNode } from "react";
import { Pressable, ScrollView, Text, View, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAppTheme } from "../theme/useAppTheme";

/** Carte premium — coins doux, ombre légère, fond thématisé */
export function Card({
  children,
  className = "",
  style,
  ...rest
}: ViewProps & { className?: string }) {
  const { colors, darkMode } = useAppTheme();
  return (
    <View
      className={`rounded-3xl border p-5 ${className}`}
      style={[
        {
          backgroundColor: colors.white,
          borderColor: colors.border,
          shadowColor: "#0F172A",
          shadowOpacity: darkMode ? 0 : 0.07,
          shadowRadius: darkMode ? 0 : 14,
          shadowOffset: { width: 0, height: 4 },
          elevation: darkMode ? 0 : 3,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

type BoneProps = { className?: string; height?: number; width?: number | `${number}%`; radius?: number };

/** Os de skeleton — pulsation douce */
export function SkeletonBone({ className = "", height = 16, width = "100%", radius = 12 }: BoneProps) {
  const { darkMode } = useAppTheme();
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={className}
      style={[
        {
          height,
          width: width as number | `${number}%`,
          borderRadius: radius,
          backgroundColor: darkMode ? "#334155" : "#E2E8F0",
        },
        anim,
      ]}
    />
  );
}

/** Skeleton Accueil — mime les cartes dashboard */
export function HomeSkeleton() {
  return (
    <View className="flex-1 px-5 pt-4 gap-4">
      <View className="flex-row items-center gap-3">
        <SkeletonBone height={44} width={44} radius={14} />
        <View className="flex-1 gap-2">
          <SkeletonBone height={12} width="40%" />
          <SkeletonBone height={16} width="55%" />
        </View>
        <SkeletonBone height={32} width={72} radius={12} />
      </View>
      <View className="rounded-3xl border border-slate-200 dark:border-slate-700 p-5 gap-3 bg-white/0">
        <SkeletonBone height={10} width="45%" />
        <SkeletonBone height={20} width="70%" />
        <SkeletonBone height={8} width="50%" />
        <View className="flex-row justify-end">
          <SkeletonBone height={44} width={88} radius={16} />
        </View>
      </View>
      <View className="flex-row flex-wrap gap-3">
        {[0, 1, 2, 3].map((i) => (
          <View key={i} className="w-[47%] rounded-3xl p-4 gap-3 border border-slate-200 dark:border-slate-700">
            <SkeletonBone height={40} width={40} radius={14} />
            <SkeletonBone height={14} width="80%" />
            <SkeletonBone height={10} width="60%" />
          </View>
        ))}
      </View>
      {[0, 1, 2].map((i) => (
        <View key={i} className="flex-row items-center gap-3 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
          <SkeletonBone height={44} width={44} radius={14} />
          <View className="flex-1 gap-2">
            <SkeletonBone height={14} width="65%" />
            <SkeletonBone height={8} width="100%" />
          </View>
          <SkeletonBone height={14} width={36} />
        </View>
      ))}
    </View>
  );
}

/** Skeleton liste de cours */
export function CoursesSkeleton() {
  return (
    <View className="flex-1 px-4 pt-4 gap-3">
      <SkeletonBone height={18} width="40%" />
      <SkeletonBone height={12} width="70%" />
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} className="flex-row items-center gap-3 rounded-3xl p-4 border border-slate-200 dark:border-slate-700">
          <SkeletonBone height={56} width={56} radius={16} />
          <View className="flex-1 gap-2">
            <SkeletonBone height={14} width="75%" />
            <SkeletonBone height={10} width="50%" />
            <SkeletonBone height={6} width="100%" radius={99} />
          </View>
        </View>
      ))}
    </View>
  );
}

type BtnProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({ label, onPress, variant = "primary", className = "" }: BtnProps) {
  const { colors } = useAppTheme();
  const bg =
    variant === "primary" ? colors.primaryDark || "#4F46E5" : variant === "secondary" ? colors.white : "transparent";
  const border = variant === "secondary" ? colors.borderStrong : "transparent";
  const color = variant === "primary" ? "#FFFFFF" : colors.textDark;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`min-h-touch items-center justify-center rounded-2xl px-5 py-3.5 ${className}`}
      style={{
        backgroundColor: bg,
        borderWidth: variant === "secondary" ? 2 : 0,
        borderColor: border,
        minHeight: 48,
      }}
    >
      <Text style={{ color, fontWeight: "800", fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

export function SectionLabel({ children }: { children: string }) {
  const { colors } = useAppTheme();
  return (
    <Text
      className="text-[17px] font-extrabold"
      style={{ color: colors.textDark }}
    >
      {children}
    </Text>
  );
}

/** Colonne auth comme le web `AuthStage` : top / contenu / footer collé. */
export function AuthStage({
  children,
  top,
  footer,
}: {
  children: ReactNode;
  top?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <View style={{ flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", paddingHorizontal: 20, paddingVertical: 16 }}>
      {top ? <View>{top}</View> : null}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: footer ? "flex-start" : "center", paddingVertical: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer ? <View style={{ paddingTop: 12 }}>{footer}</View> : null}
    </View>
  );
}

/** Apparition slide comme `.lf-slide-in` web. */
export function SlideIn({
  children,
  id,
  style,
}: {
  children: ReactNode;
  id: string | number;
  style?: object;
}) {
  const y = useSharedValue(18);
  const o = useSharedValue(0);

  useEffect(() => {
    y.value = 18;
    o.value = 0;
    y.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) });
    o.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [id, o, y]);

  const anim = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ translateY: y.value }, { scale: 0.98 + 0.02 * o.value }],
  }));

  return <Animated.View style={[{ flex: 1 }, style, anim]}>{children}</Animated.View>;
}
