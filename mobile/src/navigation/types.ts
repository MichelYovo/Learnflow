export type MainTabParamList = {
  Accueil: undefined;
  Cours: { subjectId?: string; resetKey?: number } | undefined;
  Ligue: undefined;
  Profil: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  FocusMode: undefined;
  Main: { screen?: keyof MainTabParamList } | undefined;
  Agenda: undefined;
  QuizHub: undefined;
  Course: { chapterId?: string; mode?: string } | undefined;
  AssimilationQuiz: { chapterId: string; loopErrors?: boolean };
  GrandQuizz: { chapterId: string };
  Flashcards: { mode?: string; chapterId?: string } | undefined;
  Blitz: { challengeCode?: string; difficulte?: "Facile" | "Moyen" | "Difficile" } | undefined;
  Schema2D: { chapterId?: string } | undefined;
  Schema3D: { chapterId?: string } | undefined;
  FillBlanks: { chapterId: string };
  AITutor: undefined;
  ParentsGate: undefined;
  Parents: undefined;
  SessionCustomize: { mode: "Libre" | "Guide" | "Cramming"; chapterId?: string };
  ModeLibre: { chapterId?: string } | undefined;
  ModeGuide: undefined;
  ModeCramming: { chapterId?: string } | undefined;
  NotificationsInbox: undefined;
  NotificationsSettings: undefined;
  PrivacySettings: undefined;
  About: undefined;
  RateApp: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Splash: undefined;
  Profiles: undefined;
  SignUp: { requirePin?: boolean } | undefined;
  Login: undefined;
  OTP: { email?: string; flow?: "login" | "signup" | "google" } | undefined;
  Success: undefined;
  CompleteProfile: undefined;
};
