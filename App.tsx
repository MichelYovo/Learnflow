import "./global.css";
import "react-native-gesture-handler";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import RootNavigator from "./src/navigation/RootNavigator";
import AnimatedSplash from "./src/components/AnimatedSplash";
import OfflineBootstrap from "./src/providers/OfflineBootstrap";
import { useLearnFlowStore } from "./src/store/useLearnFlowStore";
import { useAppTheme } from "./src/theme/useAppTheme";

export default function App() {
  const { darkMode, colors } = useAppTheme();
  const { setColorScheme } = useColorScheme();
  const onboardingCompleted = useLearnFlowStore((s) => s.onboardingCompleted);
  const persistApi = useLearnFlowStore.persist;
  const [hydrated, setHydrated] = useState(() => {
    try {
      return persistApi?.hasHydrated() ?? true;
    } catch {
      return true;
    }
  });
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    setColorScheme(darkMode ? "dark" : "light");
  }, [darkMode, setColorScheme]);

  useEffect(() => {
    if (hydrated || !persistApi?.onFinishHydration) return;
    const unsub = persistApi.onFinishHydration(() => setHydrated(true));
    const t = setTimeout(() => setHydrated(true), 1200);
    return () => {
      unsub?.();
      clearTimeout(t);
    };
  }, [hydrated, persistApi]);

  const onSplashFinish = useCallback(() => setSplashDone(true), []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.surface }}>
      <SafeAreaProvider>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <OfflineBootstrap>
          <RootNavigator />
          {!splashDone ? (
            <AnimatedSplash ready={hydrated} cinematic={!onboardingCompleted} onFinish={onSplashFinish} />
          ) : null}
        </OfflineBootstrap>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
