import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AgendaSession,
  ChapterProgress,
  ClasseAPC,
  FlashcardData,
  InboxKind,
  InboxNotification,
  Ligue,
  DifficulteFlash,
  ModeApprentissage,
  OutilRevisionId,
  ProfileEleve,
  SchoolClass,
  SessionRevision,
  SuiviParental,
} from "../types/learnflow";
import {
  FLASHCARDS,
  INITIAL_AGENDA,
  INITIAL_INBOX,
  INITIAL_TIMETABLE,
  LEAGUE_PLAYERS,
  BEGINNER_LIGUE,
  beginnerLeagueBoard,
  classLabel,
  isCloudProfileId,
  keepLocalTestProfiles,
  resolveLocalTestActiveId,
} from "../data/mock";
import type { LeaguePlayer } from "../data/mock";
import { resolveAvatarId } from "../data/avatars";
import { applySelfRating } from "../engine/spacedRepetition";
import { xpAssimilation, xpBlitz } from "../engine/xp";
import { createId, nowIso } from "../lib/ids";
import { AI_DAILY_QUOTA, remainingAiQuota, todayIsoDate } from "../data/tutor";
import { chapterActivityDone } from "../data/programme";
import { requestBackgroundSync } from "../lib/SyncManager";
import {
  addXpToProfile,
  insertStudySession,
  LOCAL_PARENT_ID,
  setProfileXp,
  updateLocalProfileAvatar,
  updateLocalProfileName,
  updateLocalPin,
  upsertProfile,
} from "../db";

interface LearnFlowState {
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  focusPromptPending: boolean;
  profiles: ProfileEleve[];
  activeProfileId: string;
  leagueBoard: LeaguePlayer[];
  ligue: Ligue;
  suiviParental: SuiviParental;
  flashcards: FlashcardData[];
  chapterProgress: Record<string, ChapterProgress>;
  aiQuotaRestant: number;
  aiQuotaDay: string;
  lastSession: SessionRevision | null;
  pendingMode: ModeApprentissage | null;
  customTools: OutilRevisionId[];
  agendaSessions: AgendaSession[];
  timetable: SchoolClass[];
  inbox: InboxNotification[];

  getActiveProfile: () => ProfileEleve;
  login: () => void;
  logout: () => void;
  applyCloudUser: (
    user: {
      id: string;
      email: string;
      nom: string;
      classe: string;
      parentPhone?: string;
      xpTotale?: number;
      streak?: number;
      lessonsDone?: number;
      rang?: number;
      avatarId?: string;
    },
    opts?: { fresh?: boolean; authenticate?: boolean }
  ) => void;
  ingestCloudProgress: (data: {
    id: string;
    xpTotale: number;
    streak: number;
    lessonsDone: number;
    badgesDebloques: string[];
    avatarId?: string;
    chapterProgress: Record<string, ChapterProgress>;
    flashcards: FlashcardData[];
    ligue: {
      nomLigue: string;
      rangActuel: number;
      scoreHebdo: number;
      estGelee: boolean;
      groupe: number;
    };
  }) => void;
  selectProfile: (id: string) => void;
  dismissFocusPrompt: () => void;
  signUp: (data: {
    firstName: string;
    lastName: string;
    email: string;
    classe: ClasseAPC;
    pin?: string;
    avatarId?: string;
    multiProfile?: boolean;
    provider?: "email" | "google" | "apple" | "facebook";
    parentPhone?: string;
  }) => void;
  hydrateFromLocal: (payload: { profiles: ProfileEleve[]; activeProfileId: string }) => void;
  setLeagueBoard: (players: LeaguePlayer[]) => void;
  applyRemoteLeague: (studentId: string, weeklyXp: number, rank: number, tier?: string) => void;
  addAgendaSession: (session: Omit<AgendaSession, "id">) => void;
  deleteAgendaSession: (id: string) => void;
  postponeAgendaSession: (id: string) => void;
  addSchoolClass: (item: Omit<SchoolClass, "id">) => void;
  deleteSchoolClass: (id: string) => void;
  accumulerXP: (amount: number, meta?: { chapterId?: string; chapterTitle?: string }) => void;
  setPendingMode: (mode: ModeApprentissage | null) => void;
  setCustomTools: (tools: OutilRevisionId[]) => void;
  rateFlashcard: (id: string, rating: FlashcardData["difficulte"]) => void;
  recordAssimilation: (
    chapitreId: string,
    score: number,
    total: number,
    firstTry: boolean
  ) => { xp: number; unlocked: boolean; challenger: boolean };
  markChapterPart: (chapitreId: string, part: "essential" | "details") => void;
  lockGrandQuizzOneHour: (chapitreId: string) => void;
  unlockGrandQuizz: (chapitreId: string) => void;
  canAccessGrandQuizz: (chapitreId: string) => boolean;
  recordBlitz: (score: number, answered: number, difficulte?: DifficulteFlash) => number;
  setBlitzDifficulte: (difficulte: DifficulteFlash) => void;
  consumeAiQuota: () => boolean;
  getAiQuotaRestant: () => number;
  gelerLigue: (jours: number) => void;
  envoyerSMSFelicitation: (msg: string) => Promise<boolean>;
  settings: AppSettings;
  pushInbox: (item: { kind: InboxKind; title: string; body: string }) => void;
  markInboxRead: (id: string) => void;
  markAllInboxRead: () => void;
  updateNotificationPrefs: (patch: Partial<AppSettings["notifications"]>) => void;
  updatePrivacyPrefs: (patch: Partial<AppSettings["privacy"]>) => void;
  setAppRating: (rating: NonNullable<AppSettings["appRating"]>) => void;
  setDarkMode: (on: boolean) => void;
  clearLocalCache: () => void;
  updateProfileName: (nom: string) => void;
  updateProfileAvatar: (avatarId: string) => void;
  setMultiProfileEnabled: (on: boolean) => void;
  enableMultiProfile: (pin: string) => void;
  completeOnboarding: () => void;
}

export interface AppSettings {
  notifications: {
    studyReminders: boolean;
    streakReminders: boolean;
    reposReminders: boolean;
    leagueUpdates: boolean;
    sounds: boolean;
  };
  privacy: {
    showInLeague: boolean;
    shareBlitzScores: boolean;
    parentSmsPassive: boolean;
    anonymousAnalytics: boolean;
  };
  appRating: { stars: number; comment: string; at: string } | null;
  darkMode: boolean;
  blitzDifficulte: DifficulteFlash;
  multiProfileEnabled: boolean;
}

const FALLBACK_PROFILE: ProfileEleve = {
  id: "",
  compteId: LOCAL_PARENT_ID,
  nom: "Élève",
  firstName: "Élève",
  classe: "3eme",
  gradeLabel: "3ème",
  xpTotale: 0,
  streak: 0,
  rang: 1,
  lessonsDone: 0,
  badgesDebloques: [],
  color: "#1677FF",
  bg: "#E6F4FF",
  hasPin: false,
};

const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    studyReminders: true,
    streakReminders: true,
    reposReminders: true,
    leagueUpdates: true,
    sounds: true,
  },
  privacy: {
    showInLeague: true,
    shareBlitzScores: true,
    parentSmsPassive: true,
    anonymousAnalytics: false,
  },
  appRating: null,
  darkMode: false,
  blitzDifficulte: "Moyen",
  multiProfileEnabled: true,
};

const defaultChapter = (id: string): ChapterProgress => ({
  chapitreId: id,
  assimilationScore: null,
  assimilationPerfect: false,
  grandQuizzUnlocked: false,
  grandQuizzLockedUntil: null,
  firstTryPerfect: false,
  read: false,
  essentialRead: false,
  detailsRead: false,
});

export const useLearnFlowStore = create<LearnFlowState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      onboardingCompleted: false,
      focusPromptPending: true,
      profiles: [],
      activeProfileId: "",
      leagueBoard: LEAGUE_PLAYERS,
      ligue: { ...BEGINNER_LIGUE },
      suiviParental: {
        telParent: "+22890000000",
        estSMSPassifActif: true,
        dernierSMSNotification: null,
      },
      flashcards: FLASHCARDS,
      chapterProgress: {},
      aiQuotaRestant: AI_DAILY_QUOTA,
      aiQuotaDay: todayIsoDate(),
      lastSession: null,
      pendingMode: null,
      customTools: ["fiche", "flashcards", "schema"],
      agendaSessions: INITIAL_AGENDA,
      timetable: INITIAL_TIMETABLE,
      inbox: INITIAL_INBOX,
      settings: DEFAULT_SETTINGS,

      getActiveProfile: () => {
        const s = get();
        return s.profiles.find((p) => p.id === s.activeProfileId) ?? s.profiles[0] ?? FALLBACK_PROFILE;
      },

      login: () => set({ isAuthenticated: true, focusPromptPending: true }),
      logout: () => {
        set({ isAuthenticated: false, focusPromptPending: true });
        void import("../lib/supabase").then((m) => {
          if (m.isSupabaseConfigured) void m.supabase.auth.signOut();
        });
      },
      applyCloudUser: (user, opts) => {
        const existing = get().profiles.find((p) => p.id === user.id);
        const switching = get().activeProfileId !== user.id;
        const xp = user.xpTotale ?? 0;
        const startFresh = opts?.fresh === true;
        const parts = user.nom.trim().split(/\s+/);
        const firstName = parts[0] || "Élève";
        const avatarId = user.avatarId ?? existing?.avatarId;
        const rang = startFresh ? BEGINNER_LIGUE.rangActuel : (user.rang ?? existing?.rang ?? BEGINNER_LIGUE.rangActuel);
        const profile: ProfileEleve = {
          id: user.id,
          compteId: user.id,
          nom: user.nom.trim() || "Élève",
          firstName,
          lastName: parts.slice(1).join(" ") || undefined,
          email: user.email,
          classe: user.classe,
          gradeLabel: classLabel(user.classe),
          xpTotale: startFresh ? 0 : xp,
          streak: startFresh ? 0 : (user.streak ?? existing?.streak ?? 0),
          rang,
          lessonsDone: startFresh ? 0 : (user.lessonsDone ?? existing?.lessonsDone ?? 0),
          badgesDebloques: startFresh ? [] : (existing?.badgesDebloques ?? []),
          color: "#1677FF",
          bg: "#E6F4FF",
          avatarId,
          hasPin: false,
          parentPhone: user.parentPhone,
        };
        const others = get().profiles.filter((p) => p.id !== user.id);
        set({
          profiles: keepLocalTestProfiles([...others, profile]),
          activeProfileId: user.id,
          isAuthenticated: opts?.authenticate !== false,
          focusPromptPending: true,
          suiviParental: user.parentPhone
            ? { ...get().suiviParental, telParent: user.parentPhone }
            : get().suiviParental,
          ...(startFresh || switching
            ? {
                chapterProgress: {},
                lastSession: null,
                ligue: { ...BEGINNER_LIGUE },
                flashcards: FLASHCARDS,
              }
            : {}),
          ...(startFresh
            ? {
                leagueBoard: beginnerLeagueBoard(profile.nom, avatarId, firstName.slice(0, 2).toUpperCase()),
                inbox: [],
                agendaSessions: [],
              }
            : {}),
        });
        if (isCloudProfileId(user.id)) {
          void upsertProfile({
            id: user.id,
            parent_id: user.id,
            name: profile.nom,
            class_level: String(user.classe),
            total_xp: profile.xpTotale,
            first_name: firstName,
            last_name: profile.lastName ?? null,
            email: user.email,
            streak: profile.streak,
            rank: profile.rang,
            lessons_done: profile.lessonsDone,
            color: profile.color ?? null,
            bg: profile.bg ?? null,
            avatar_id: avatarId ?? null,
          }).catch((error) => console.warn("[LearnFlow] persist cloud profile", error));
          if (!startFresh) {
            void import("../lib/progressSync").then((m) => m.requestProgressSync());
          }
        }
      },
      ingestCloudProgress: (data) => {
        if (get().activeProfileId !== data.id) return;
        const ligueNom = data.ligue.nomLigue as Ligue["nomLigue"];
        set({
          profiles: get().profiles.map((p) =>
            p.id === data.id
              ? {
                  ...p,
                  xpTotale: Math.max(p.xpTotale, data.xpTotale),
                  streak: Math.max(p.streak, data.streak),
                  lessonsDone: Math.max(p.lessonsDone, data.lessonsDone),
                  badgesDebloques: Array.from(new Set([...p.badgesDebloques, ...data.badgesDebloques])),
                  avatarId: data.avatarId ?? p.avatarId,
                  rang: data.ligue.rangActuel || p.rang,
                }
              : p
          ),
          chapterProgress: data.chapterProgress,
          flashcards: data.flashcards.length ? data.flashcards : get().flashcards,
          ligue: {
            nomLigue: ligueNom || get().ligue.nomLigue,
            rangActuel: data.ligue.rangActuel || get().ligue.rangActuel,
            scoreHebdo: Math.max(get().ligue.scoreHebdo, data.ligue.scoreHebdo),
            estGelee: data.ligue.estGelee || get().ligue.estGelee,
            groupe: data.ligue.groupe || get().ligue.groupe,
          },
        });
        void setProfileXp(data.id, Math.max(data.xpTotale, get().getActiveProfile().xpTotale)).catch((error) =>
          console.warn("[LearnFlow] setProfileXp", error)
        );
      },

      selectProfile: (id) =>
        set({
          activeProfileId: resolveLocalTestActiveId(get().profiles, id),
          isAuthenticated: true,
          focusPromptPending: true,
        }),
      dismissFocusPrompt: () => set({ focusPromptPending: false }),

      hydrateFromLocal: ({ profiles, activeProfileId }) => {
        const current = get().profiles;
        const cloud = current.filter((p) => isCloudProfileId(p.id));
        const sqliteIds = new Set(profiles.map((p) => String(p.id)));
        const merged = keepLocalTestProfiles([
          ...profiles,
          ...cloud.filter((p) => !sqliteIds.has(p.id)),
        ]);
        const kept = merged.length > 0 ? merged : current;
        const preferred = isCloudProfileId(get().activeProfileId) ? get().activeProfileId : activeProfileId;
        set({
          profiles: kept,
          activeProfileId: resolveLocalTestActiveId(kept, preferred),
        });
      },

      setLeagueBoard: (players) => set({ leagueBoard: players }),

      applyRemoteLeague: (studentId, weeklyXp, rank, tier) => {
        const { ligue, profiles, activeProfileId } = get();
        if (String(activeProfileId) !== studentId) return;
        const nomLigue = (tier as Ligue["nomLigue"] | undefined) ?? ligue.nomLigue;
        set({
          ligue: { ...ligue, scoreHebdo: weeklyXp, rangActuel: rank, nomLigue },
          profiles: profiles.map((p) => (p.id === studentId ? { ...p, rang: rank } : p)),
        });
      },

      signUp: (data) => {
        set({
          settings: data.multiProfile
            ? { ...get().settings, multiProfileEnabled: true }
            : get().settings,
          suiviParental: data.parentPhone
            ? { ...get().suiviParental, telParent: data.parentPhone }
            : get().suiviParental,
        });
      },

      addAgendaSession: (session) => {
        const id = Date.now().toString();
        const next = [...get().agendaSessions, { ...session, id }];
        const studyOn = get().settings.notifications.studyReminders;
        const time = `${String(session.hour).padStart(2, "0")}:${String(session.minute).padStart(2, "0")}`;
        set({
          agendaSessions: next,
          inbox: studyOn
            ? [
                {
                  id: createId(),
                  kind: "study" as const,
                  title: "Séance planifiée",
                  body: `${session.subject} à ${time} · ${session.duration} min. Le rappel restera ici.`,
                  createdAt: nowIso(),
                  read: false,
                },
                ...get().inbox,
              ].slice(0, 50)
            : get().inbox,
        });
      },
      deleteAgendaSession: (id) => {
        set({ agendaSessions: get().agendaSessions.filter((s) => s.id !== id) });
      },
      postponeAgendaSession: (id) => {
        set({
          agendaSessions: get().agendaSessions.map((s) => {
            if (s.id !== id) return s;
            let hour = s.hour + 1;
            let day = s.day;
            if (hour >= 23) {
              hour = 8;
              day = Math.min(6, day + 1);
            }
            return { ...s, hour, day };
          }),
        });
      },
      addSchoolClass: (item) => {
        set({ timetable: [...get().timetable, { ...item, id: Date.now().toString() }] });
      },
      deleteSchoolClass: (id) => {
        set({ timetable: get().timetable.filter((c) => c.id !== id) });
      },

      accumulerXP: (amount, meta) => {
        if (amount <= 0) return;
        const { activeProfileId, profiles, ligue } = get();
        set({
          profiles: profiles.map((p) =>
            p.id === activeProfileId ? { ...p, xpTotale: p.xpTotale + amount } : p
          ),
          ligue: { ...ligue, scoreHebdo: ligue.scoreHebdo + amount },
        });
        void (async () => {
          try {
            await addXpToProfile(String(activeProfileId), amount);
            await insertStudySession({
              student_id: String(activeProfileId),
              xp_gained: amount,
              chapter_id: meta?.chapterId ?? null,
              chapter_title: meta?.chapterTitle ?? null,
            });
            requestBackgroundSync();
            void import("../lib/progressSync").then((m) => m.requestProgressSync());
            void import("../lib/cloud").then((m) =>
              m.trackActivity("xp_gain", { amount, chapterId: meta?.chapterId, chapterTitle: meta?.chapterTitle })
            );
          } catch (error) {
            console.warn("[LearnFlow] persist XP", error);
          }
        })();
      },

      setPendingMode: (mode) => {
        set({ pendingMode: mode });
        if (mode) {
          void import("../lib/cloud").then((m) => m.trackActivity("mode_start", { mode }));
        }
      },
      setCustomTools: (tools) => set({ customTools: tools }),

      rateFlashcard: (id, rating) => {
        set({
          flashcards: get().flashcards.map((c) =>
            c.id === id ? applySelfRating(c, rating) : c
          ),
        });
        void import("../lib/progressSync").then((m) => m.requestProgressSync());
      },

      markChapterPart: (chapitreId, part) => {
        const prev = get().chapterProgress[chapitreId] ?? defaultChapter(chapitreId);
        if (part === "essential" && prev.essentialRead) return;
        if (part === "details" && prev.detailsRead) return;
        const next = {
          ...prev,
          essentialRead: prev.essentialRead || part === "essential",
          detailsRead: prev.detailsRead || part === "details",
          read: true,
        };
        const profile = get().getActiveProfile();
        const gained = chapterActivityDone(next) - chapterActivityDone(prev);
        set({
          chapterProgress: {
            ...get().chapterProgress,
            [chapitreId]: next,
          },
          profiles:
            gained > 0 && profile
              ? get().profiles.map((p) => (p.id === profile.id ? { ...p, lessonsDone: p.lessonsDone + gained } : p))
              : get().profiles,
        });
        void import("../lib/progressSync").then((m) => m.requestProgressSync());
      },

      recordAssimilation: (chapitreId, score, total, firstTry) => {
        const profile = get().getActiveProfile();
        const perfect = score === total;
        const xp = xpAssimilation(score, total, profile.classe, firstTry);
        const challenger = perfect && firstTry;
        const prev = get().chapterProgress[chapitreId] ?? defaultChapter(chapitreId);

        if (perfect) {
          get().accumulerXP(xp, { chapterId: chapitreId });
          void import("../lib/cloud").then((m) =>
            m.trackActivity("quiz_complete", { chapterId: chapitreId, score, total, firstTry })
          );
          if (challenger && !profile.badgesDebloques.includes("CHALLENGER")) {
            set({
              profiles: get().profiles.map((p) =>
                p.id === profile.id
                  ? { ...p, badgesDebloques: [...p.badgesDebloques, "CHALLENGER"] }
                  : p
              ),
            });
            void get().envoyerSMSFelicitation(
              `${profile.firstName} a décroché le badge Challenger (10/10 au 1er essai) !`
            );
          } else {
            void get().envoyerSMSFelicitation(
              `${profile.firstName} a validé le 10/10 sur un chapitre LearnFlow !`
            );
          }
        }

        const next = {
          ...prev,
          assimilationScore: score,
          assimilationPerfect: perfect,
          grandQuizzUnlocked: perfect || prev.grandQuizzUnlocked,
          grandQuizzLockedUntil: null,
          firstTryPerfect: challenger || prev.firstTryPerfect,
        };
        const gained = chapterActivityDone(next) - chapterActivityDone(prev);

        set({
          chapterProgress: {
            ...get().chapterProgress,
            [chapitreId]: next,
          },
          profiles:
            gained > 0 && profile
              ? get().profiles.map((p) => (p.id === profile.id ? { ...p, lessonsDone: p.lessonsDone + gained } : p))
              : get().profiles,
        });
        void import("../lib/progressSync").then((m) => m.requestProgressSync());

        return { xp: perfect ? xp : 0, unlocked: perfect, challenger };
      },

      lockGrandQuizzOneHour: (chapitreId) => {
        const until = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        const prev = get().chapterProgress[chapitreId] ?? defaultChapter(chapitreId);
        set({
          chapterProgress: {
            ...get().chapterProgress,
            [chapitreId]: { ...prev, grandQuizzLockedUntil: until },
          },
        });
        void import("../lib/progressSync").then((m) => m.requestProgressSync());
      },

      unlockGrandQuizz: (chapitreId) => {
        const prev = get().chapterProgress[chapitreId] ?? defaultChapter(chapitreId);
        set({
          chapterProgress: {
            ...get().chapterProgress,
            [chapitreId]: { ...prev, grandQuizzLockedUntil: null, grandQuizzUnlocked: true },
          },
        });
        void import("../lib/progressSync").then((m) => m.requestProgressSync());
      },

      canAccessGrandQuizz: (chapitreId) => {
        const p = get().chapterProgress[chapitreId];
        if (!p?.assimilationPerfect) return false;
        if (p.grandQuizzLockedUntil && new Date(p.grandQuizzLockedUntil) > new Date()) {
          return false;
        }
        return true;
      },

      recordBlitz: (score, answered, difficulte) => {
        const profile = get().getActiveProfile();
        const niveau = difficulte ?? get().settings.blitzDifficulte;
        const xp = xpBlitz(score, answered, profile.classe, niveau);
        get().accumulerXP(xp);
        void import("../lib/cloud").then((m) =>
          m.trackActivity("blitz_complete", { score, answered, difficulte: niveau, xp })
        );
        return xp;
      },

      setBlitzDifficulte: (difficulte) => {
        set({ settings: { ...get().settings, blitzDifficulte: difficulte } });
      },

      getAiQuotaRestant: () => remainingAiQuota(get().aiQuotaRestant, get().aiQuotaDay),

      consumeAiQuota: () => {
        const today = todayIsoDate();
        const restant = remainingAiQuota(get().aiQuotaRestant, get().aiQuotaDay);
        if (restant <= 0) {
          if (get().aiQuotaDay !== today) set({ aiQuotaDay: today, aiQuotaRestant: 0 });
          return false;
        }
        set({ aiQuotaDay: today, aiQuotaRestant: restant - 1 });
        return true;
      },

      gelerLigue: (jours) => {
        const leagueOn = get().settings.notifications.leagueUpdates;
        set({
          ligue: { ...get().ligue, estGelee: true },
          inbox: leagueOn
            ? [
                {
                  id: createId(),
                  kind: "league" as const,
                  title: "Ligue gelée",
                  body: `Ton rang est protégé pendant ${jours} jour${jours > 1 ? "s" : ""}.`,
                  createdAt: nowIso(),
                  read: false,
                },
                ...get().inbox,
              ].slice(0, 50)
            : get().inbox,
        });
      },

      envoyerSMSFelicitation: async (msg) => {
        const suivi = get().suiviParental;
        const allowSms = get().settings.privacy.parentSmsPassive && suivi.estSMSPassifActif;
        if (!allowSms) return false;
        console.log("[SMS Parent Passif]", suivi.telParent, msg);
        set({
          suiviParental: {
            ...suivi,
            dernierSMSNotification: new Date().toISOString(),
          },
        });
        return true;
      },

      pushInbox: ({ kind, title, body }) => {
        set({
          inbox: [
            {
              id: createId(),
              kind,
              title,
              body,
              createdAt: nowIso(),
              read: false,
            },
            ...get().inbox,
          ].slice(0, 50),
        });
      },

      markInboxRead: (id) => {
        set({
          inbox: get().inbox.map((n) => (n.id === id ? { ...n, read: true } : n)),
        });
      },

      markAllInboxRead: () => {
        set({ inbox: get().inbox.map((n) => ({ ...n, read: true })) });
      },

      updateNotificationPrefs: (patch) => {
        set({
          settings: {
            ...get().settings,
            notifications: { ...get().settings.notifications, ...patch },
          },
        });
      },

      updatePrivacyPrefs: (patch) => {
        const next = { ...get().settings.privacy, ...patch };
        set({
          settings: { ...get().settings, privacy: next },
          suiviParental: {
            ...get().suiviParental,
            estSMSPassifActif: next.parentSmsPassive,
          },
        });
      },

      setAppRating: (rating) => {
        set({ settings: { ...get().settings, appRating: rating } });
      },

      setDarkMode: (on) => {
        set({ settings: { ...get().settings, darkMode: on } });
      },

      clearLocalCache: () => {
        set({
          chapterProgress: {},
          lastSession: null,
          aiQuotaRestant: AI_DAILY_QUOTA,
          aiQuotaDay: todayIsoDate(),
          pendingMode: null,
        });
      },

      updateProfileName: (nom) => {
        const firstName = nom.trim().split(/\s+/)[0] || nom;
        const id = get().activeProfileId;
        set({
          profiles: get().profiles.map((p) =>
            p.id === id ? { ...p, nom: nom.trim(), firstName } : p
          ),
        });
        void updateLocalProfileName(String(id), nom.trim()).then(() => {
          requestBackgroundSync();
          void import("../lib/progressSync").then((m) => m.requestProgressSync());
        });
      },

      updateProfileAvatar: (avatarId) => {
        const id = get().activeProfileId;
        set({
          profiles: get().profiles.map((p) => (p.id === id ? { ...p, avatarId } : p)),
          leagueBoard: get().leagueBoard.map((player) =>
            player.you ? { ...player, avatarId } : player
          ),
        });
        void updateLocalProfileAvatar(String(id), avatarId).then(() => {
          requestBackgroundSync();
          void import("../lib/progressSync").then((m) => m.requestProgressSync());
        });
      },

      setMultiProfileEnabled: (on) => {
        set({ settings: { ...get().settings, multiProfileEnabled: on } });
      },

      enableMultiProfile: (pin) => {
        const id = get().activeProfileId;
        set({
          settings: { ...get().settings, multiProfileEnabled: true },
          profiles: get().profiles.map((p) => (p.id === id ? { ...p, hasPin: true } : p)),
        });
        void updateLocalPin(String(id), pin).catch((error) =>
          console.warn("[LearnFlow] enable multi-profile PIN", error)
        );
      },

      completeOnboarding: () => set({ onboardingCompleted: true }),
    }),
    {
      name: "learnflow-store-v7",
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => {
        try {
          const p = (persisted ?? {}) as Partial<LearnFlowState>;
          const rawProfiles = Array.isArray(p.profiles) ? p.profiles : current.profiles;
          const mapped = keepLocalTestProfiles(rawProfiles).map((pr) => {
            return {
              ...pr,
              id: String(pr.id),
              compteId: String(pr.compteId ?? "local-parent"),
              avatarId: resolveAvatarId(pr.avatarId),
              hasPin: pr.hasPin ?? false,
            };
          });
          const profiles = mapped.length > 0 ? mapped : current.profiles;
          const persistedCards = Array.isArray(p.flashcards) ? p.flashcards : current.flashcards;
          const anyDue = persistedCards.some(
            (c) => c.due || new Date(c.prochaineRevision).getTime() <= Date.now()
          );
          const baseCards = anyDue ? persistedCards : current.flashcards;
          const have = new Set(baseCards.map((c) => c.id));
          const extraCards = FLASHCARDS.filter((c) => !have.has(c.id));
          const settingsPatch =
            p.settings && typeof p.settings === "object" ? p.settings : ({} as Partial<AppSettings>);
          return {
            ...current,
            isAuthenticated: Boolean(p.isAuthenticated ?? current.isAuthenticated),
            onboardingCompleted: Boolean(p.onboardingCompleted ?? current.onboardingCompleted),
            profiles,
            activeProfileId: resolveLocalTestActiveId(profiles, p.activeProfileId ?? current.activeProfileId),
            ligue: p.ligue ?? current.ligue,
            suiviParental: p.suiviParental ?? current.suiviParental,
            flashcards: extraCards.length ? [...baseCards, ...extraCards] : baseCards,
            chapterProgress: p.chapterProgress ?? current.chapterProgress,
            aiQuotaRestant: p.aiQuotaRestant ?? current.aiQuotaRestant,
            aiQuotaDay: typeof p.aiQuotaDay === "string" ? p.aiQuotaDay : "",
            customTools: p.customTools ?? current.customTools,
            agendaSessions: Array.isArray(p.agendaSessions) ? p.agendaSessions : current.agendaSessions,
            timetable: Array.isArray(p.timetable) ? p.timetable : current.timetable,
            inbox: Array.isArray(p.inbox) ? p.inbox : current.inbox,
            settings: {
              ...DEFAULT_SETTINGS,
              ...settingsPatch,
              notifications: {
                ...DEFAULT_SETTINGS.notifications,
                ...(settingsPatch.notifications ?? {}),
              },
              privacy: {
                ...DEFAULT_SETTINGS.privacy,
                ...(settingsPatch.privacy ?? {}),
              },
            },
          };
        } catch (error) {
          console.warn("[LearnFlow] persist merge", error);
          return current;
        }
      },
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        onboardingCompleted: s.onboardingCompleted,
        profiles: s.profiles,
        activeProfileId: s.activeProfileId,
        ligue: s.ligue,
        suiviParental: s.suiviParental,
        flashcards: s.flashcards,
        chapterProgress: s.chapterProgress,
        aiQuotaRestant: s.aiQuotaRestant,
        aiQuotaDay: s.aiQuotaDay,
        customTools: s.customTools,
        agendaSessions: s.agendaSessions,
        timetable: s.timetable,
        inbox: s.inbox,
        settings: s.settings,
      }),
    }
  )
);
