import React from "react";
import { View } from "react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useLearnFlowStore } from "../store/useLearnFlowStore";
import LearnFlowTabBar from "../components/TabBar";
import FloatingChatbot from "../components/FloatingChatbot";
import { useAppTheme } from "../theme/useAppTheme";
import { poppinsNavFonts } from "../theme/typography";
import type { AuthStackParamList, MainTabParamList, RootStackParamList } from "./types";

import SplashScreen from "../screens/auth/SplashScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import ProfilesScreen from "../screens/auth/ProfilesScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import OTPScreen from "../screens/auth/OTPScreen";
import SuccessScreen from "../screens/auth/SuccessScreen";

import HomeScreen from "../screens/tabs/HomeScreen";
import ApprendreScreen from "../screens/tabs/ApprendreScreen";
import QuizTabScreen from "../screens/tabs/QuizTabScreen";
import LigueScreen from "../screens/tabs/LigueScreen";
import ProfilScreen from "../screens/tabs/ProfilScreen";
import AgendaScreen from "../screens/tabs/AgendaScreen";

import CourseScreen from "../screens/modes/CourseScreen";
import AssimilationQuizScreen from "../screens/modes/AssimilationQuizScreen";
import GrandQuizzScreen from "../screens/modes/GrandQuizzScreen";
import FlashcardsScreen from "../screens/modes/FlashcardsScreen";
import BlitzScreen from "../screens/modes/BlitzScreen";
import Schema2DScreen from "../screens/modes/Schema2DScreen";
import Schema3DScreen from "../screens/modes/Schema3DScreen";
import FillBlanksScreen from "../screens/modes/FillBlanksScreen";
import AITutorScreen from "../screens/modes/AITutorScreen";
import ParentsGateScreen from "../screens/modes/ParentsGateScreen";
import ParentsScreen from "../screens/modes/ParentsScreen";
import SessionCustomizeScreen from "../screens/modes/SessionCustomizeScreen";
import ModeLibreScreen from "../screens/modes/ModeLibreScreen";
import ModeGuideScreen from "../screens/modes/ModeGuideScreen";
import ModeCrammingScreen from "../screens/modes/ModeCrammingScreen";
import NotificationsInboxScreen from "../screens/tabs/NotificationsInboxScreen";
import NotificationsSettingsScreen from "../screens/settings/NotificationsSettingsScreen";
import PrivacySettingsScreen from "../screens/settings/PrivacySettingsScreen";
import AboutScreen from "../screens/settings/AboutScreen";
import RateAppScreen from "../screens/settings/RateAppScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Profiles" component={ProfilesScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
      <AuthStack.Screen name="Success" component={SuccessScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <LearnFlowTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            width: "100%",
            overflow: "visible",
          },
        }}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Cours" component={ApprendreScreen} />
        <Tab.Screen name="Ligue" component={LigueScreen} />
        <Tab.Screen name="Profil" component={ProfilScreen} />
      </Tab.Navigator>
      <FloatingChatbot />
    </View>
  );
}

export default function RootNavigator() {
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const { darkMode, colors } = useAppTheme();
  const navTheme = darkMode
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.surface,
          card: colors.white,
          text: colors.textDark,
          border: colors.border,
          primary: colors.primary,
        },
        fonts: poppinsNavFonts,
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.surface,
          card: colors.white,
          text: colors.textDark,
          border: colors.border,
          primary: colors.primary,
        },
        fonts: poppinsNavFonts,
      };

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen name="Agenda" component={AgendaScreen} />
            <RootStack.Screen name="QuizHub" component={QuizTabScreen} />
            <RootStack.Screen name="Course" component={CourseScreen} />
            <RootStack.Screen name="AssimilationQuiz" component={AssimilationQuizScreen} />
            <RootStack.Screen name="GrandQuizz" component={GrandQuizzScreen} />
            <RootStack.Screen name="Flashcards" component={FlashcardsScreen} />
            <RootStack.Screen name="Blitz" component={BlitzScreen} options={{ presentation: "fullScreenModal" }} />
            <RootStack.Screen name="Schema2D" component={Schema2DScreen} />
            <RootStack.Screen name="Schema3D" component={Schema3DScreen} />
            <RootStack.Screen name="FillBlanks" component={FillBlanksScreen} />
            <RootStack.Screen name="AITutor" component={AITutorScreen} options={{ presentation: "modal" }} />
            <RootStack.Screen name="ParentsGate" component={ParentsGateScreen} />
            <RootStack.Screen name="Parents" component={ParentsScreen} />
            <RootStack.Screen name="SessionCustomize" component={SessionCustomizeScreen} options={{ presentation: "modal" }} />
            <RootStack.Screen name="ModeLibre" component={ModeLibreScreen} />
            <RootStack.Screen name="ModeGuide" component={ModeGuideScreen} />
            <RootStack.Screen name="ModeCramming" component={ModeCrammingScreen} />
            <RootStack.Screen name="NotificationsInbox" component={NotificationsInboxScreen} />
            <RootStack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />
            <RootStack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
            <RootStack.Screen name="About" component={AboutScreen} />
            <RootStack.Screen name="RateApp" component={RateAppScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
