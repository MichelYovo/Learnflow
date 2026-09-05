import "./global.css";
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import RootNavigator from "./src/navigation/RootNavigator";
import AnimatedSplash from "./src/components/AnimatedSplash";
import OfflineBootstrap from "./src/providers/OfflineBootstrap";
import { useAppTheme } from "./src/theme/useAppTheme";
import { poppinsFontMap } from "./src/theme/typography";

export default function App() {
  const { darkMode, colors } = useAppTheme();
  const { setColorScheme } = useColorScheme();
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded, fontError] = useFonts(poppinsFontMap);

  useEffect(() => {
    setColorScheme(darkMode ? "dark" : "light");
  }, [darkMode, setColorScheme]);

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: "#070B14" }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.surface }}>
      <SafeAreaProvider>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <OfflineBootstrap>
          <RootNavigator />
          {!splashDone ? <AnimatedSplash onFinish={() => setSplashDone(true)} /> : null}
        </OfflineBootstrap>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
