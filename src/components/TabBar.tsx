import React, { useContext } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from "react-native";
import { BottomTabBarHeightCallbackContext, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Logo from "./Logo";
import { useAppTheme } from "../theme/useAppTheme";

type TabKey = "Accueil" | "Cours" | "Ligue" | "Profil";

const TABS: { name: TabKey; label: string }[] = [
  { name: "Accueil", label: "Accueil" },
  { name: "Cours", label: "Cours" },
  { name: "Ligue", label: "Ligues" },
  { name: "Profil", label: "Profil" },
];

/** Icons8 — iOS Glyphs/Filled (SF-like) + Material Outlined/Rounded (Android) */
const TAB_ICONS: Record<TabKey, { outline: ImageSourcePropType; fill: ImageSourcePropType }> = {
  Accueil: Platform.select({
    ios: {
      outline: require("../../assets/icons/navbar/ios/home.png"),
      fill: require("../../assets/icons/navbar/ios/home-fill.png"),
    },
    default: {
      outline: require("../../assets/icons/navbar/android/home.png"),
      fill: require("../../assets/icons/navbar/android/home-fill.png"),
    },
  })!,
  Cours: Platform.select({
    ios: {
      outline: require("../../assets/icons/navbar/ios/book.png"),
      fill: require("../../assets/icons/navbar/ios/book-fill.png"),
    },
    default: {
      outline: require("../../assets/icons/navbar/android/book.png"),
      fill: require("../../assets/icons/navbar/android/book-fill.png"),
    },
  })!,
  Ligue: Platform.select({
    ios: {
      outline: require("../../assets/icons/navbar/ios/trophy.png"),
      fill: require("../../assets/icons/navbar/ios/trophy-fill.png"),
    },
    default: {
      outline: require("../../assets/icons/navbar/android/trophy.png"),
      fill: require("../../assets/icons/navbar/android/trophy-fill.png"),
    },
  })!,
  Profil: Platform.select({
    ios: {
      outline: require("../../assets/icons/navbar/ios/user.png"),
      fill: require("../../assets/icons/navbar/ios/user-fill.png"),
    },
    default: {
      outline: require("../../assets/icons/navbar/android/user.png"),
      fill: require("../../assets/icons/navbar/android/user-fill.png"),
    },
  })!,
};

const FAB = 80;
const LIFT = 36;
const FAB_BLUE = "#1677FF";
const INACTIVE = "#A8A29E";

export default function LearnFlowTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const { colors, darkMode } = useAppTheme();
  const { width } = useWindowDimensions();
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const bottomPad = Math.max(insets.bottom, 10);

  const openAgenda = () => {
    const parent = navigation.getParent();
    if (parent) parent.navigate("Agenda" as never);
  };

  const goTab = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    const isFocused = state.index === state.routes.indexOf(route);
    if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
  };

  return (
    <View
      onLayout={(e) => onHeightChange?.(e.nativeEvent.layout.height)}
      style={[styles.wrap, { width, paddingTop: LIFT }]}
    >
      <View
        style={[
          styles.bar,
          {
            width,
            backgroundColor: colors.white,
            borderTopColor: darkMode ? colors.border : "#E7E5E4",
            paddingBottom: bottomPad,
          },
        ]}
      >
        {TABS.slice(0, 2).map((tab) => (
          <TabItem
            key={tab.name}
            tab={tab}
            focused={state.routes[state.index]?.name === tab.name}
            activeColor={FAB_BLUE}
            onPress={() => goTab(tab.name)}
          />
        ))}

        <View style={styles.slot}>
          <Pressable
            onPress={openAgenda}
            accessibilityRole="button"
            accessibilityLabel="Ouvrir l'agenda"
            hitSlop={4}
            style={({ pressed }) => [
              styles.fab,
              {
                backgroundColor: colors.white,
                borderColor: darkMode ? colors.border : "#E2E8F0",
                shadowColor: darkMode ? "#38BDF8" : "#1677FF",
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Logo variant="mark" height={56} />
          </Pressable>
        </View>

        {TABS.slice(2).map((tab) => (
          <TabItem
            key={tab.name}
            tab={tab}
            focused={state.routes[state.index]?.name === tab.name}
            activeColor={FAB_BLUE}
            onPress={() => goTab(tab.name)}
          />
        ))}
      </View>
    </View>
  );
}

function TabItem({
  tab,
  focused,
  activeColor,
  onPress,
}: {
  tab: (typeof TABS)[number];
  focused: boolean;
  activeColor: string;
  onPress: () => void;
}) {
  const color = focused ? activeColor : INACTIVE;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      onPress={onPress}
      hitSlop={6}
      style={styles.slot}
    >
      <View style={styles.iconHit}>
        <Image
          source={focused ? TAB_ICONS[tab.name].fill : TAB_ICONS[tab.name].outline}
          style={[styles.tabIcon, { tintColor: color }]}
          resizeMode="contain"
        />
      </View>
      <Text numberOfLines={1} style={[styles.label, { color, fontWeight: focused ? "700" : "500" }]}>
        {tab.label}
      </Text>
      <View style={[styles.dot, { backgroundColor: focused ? activeColor : "transparent" }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "stretch",
    overflow: "visible",
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    overflow: "visible",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  slot: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    minHeight: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 2,
    overflow: "visible",
  },
  iconHit: {
    minWidth: 44,
    minHeight: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    textAlign: "center",
    includeFontPadding: false,
    width: "100%",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 3,
  },
  fab: {
    width: FAB,
    height: FAB,
    borderRadius: FAB / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    overflow: "hidden",
    marginTop: -LIFT,
    marginBottom: 4,
    shadowOpacity: 0.26,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 9,
  },
});
