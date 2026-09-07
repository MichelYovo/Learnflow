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
  keepLocalTestProfiles,
  PROFILES_DEMO,
  resolveLocalTestActiveId,
} from "../data/mock";
import type { LeaguePlayer } from "../data/mock";
import { defaultAvatarId, resolveAvatarId } from "../data/avatars";
import { applySelfRating } from "../engine/spacedRepetition";
import { xpAssimilation, xpBlitz } from "../engine/xp";
import { createId, nowIso } from "../lib/ids";
import { AI_DAILY_QUOTA, remainingAiQuota, todayIsoDate } from "../data/tutor";
import { requestBackgroundSync } from "../lib/SyncManager";
import {
  addXpToProfile,
  insertStudySession,
  LOCAL_PARENT_ID,
  updateLocalProfileAvatar,
  updateLocalProfileName,
  updateLocalPin,
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
  }) => void;
  hydrateFromLocal: (payload: { profiles: ProfileEleve[]; activeProfileId: string }) => void;
  setLeagueBoard: (players: LeaguePlayer[]) => void;
  applyRemoteLeague: (studentId: string, weeklyXp: number, rank: number) => void;
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
  ...PROFILES_DEMO[0],
  compteId: LOCAL_PARENT_ID,
  badgesDebloques: [],
  hasPin: true,
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
});

export const useLearnFlowStore = create<LearnFlowState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      onboardingCompleted: false,
      focusPromptPending: true,
      profiles: PROFILES_DEMO.map((p) => ({
        ...p,
        compteId: LOCAL_PARENT_ID,
        badgesDebloques: ["Série 7", "Blitz King", "Lecteur Pro"],
        hasPin: true,
      })),
      activeProfileId: "1",
      leagueBoard: LEAGUE_PLAYERS,
      ligue: {
        nomLigue: "Or",
        rangActuel: 3,
        scoreHebdo: 840,
        estGelee: false,
        groupe: 12,
      },
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
      logout: () => set({ isAuthenticated: false, focusPromptPending: true }),

      selectProfile: (id) =>
        set({
          activeProfileId: resolveLocalTestActiveId(get().profiles, id),
          isAuthenticated: true,
          focusPromptPending: true,
        }),
      dismissFocusPrompt: () => set({ focusPromptPending: false }),

      hydrateFromLocal: ({ profiles, activeProfileId }) => {
        const next = keepLocalTestProfiles(profiles);
        const kept = next.length > 0 ? next : get().profiles;
        set({
          profiles: kept,
          activeProfileId: resolveLocalTestActiveId(kept, activeProfileId),
        });
      },

      setLeagueBoard: (players) => set({ leagueBoard: players }),

      applyRemoteLeague: (studentId, weeklyXp, rank) => {
        const { ligue, profiles, activeProfileId } = get();
        if (String(activeProfileId) !== studentId) return;
        set({
          ligue: { ...ligue, scoreHebdo: weeklyXp, rangActuel: rank },
          profiles: profiles.map((p) => (p.id === studentId ? { ...p, rang: rank } : p)),
        });
      },

      signUp: (data) => {
        // Tests locaux : on ne crée pas de 3e profil — Kofi + Ama restent les seuls comptes.
        set({
          settings: data.multiProfile
            ? { ...get().settings, multiProfileEnabled: true }
            : get().settings,
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
          } catch (error) {
            console.warn("[LearnFlow] persist XP", error);
          }
        })();
      },

      setPendingMode: (mode) => set({ pendingMode: mode }),
      setCustomTools: (tools) => set({ customTools: tools }),

      rateFlashcard: (id, rating) => {
        set({
          flashcards: get().flashcards.map((c) =>
            c.id === id ? applySelfRating(c, rating) : c
          ),
        });
      },

      recordAssimilation: (chapitreId, score, total, firstTry) => {
        const profile = get().getActiveProfile();
        const perfect = score === total;
        const xp = xpAssimilation(score, total, profile.classe, firstTry);
        const challenger = perfect && firstTry;
        const prev = get().chapterProgress[chapitreId] ?? defaultChapter(chapitreId);

        if (perfect) {
          get().accumulerXP(xp, { chapterId: chapitreId });
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

        set({
          chapterProgress: {
            ...get().chapterProgress,
            [chapitreId]: {
              ...prev,
              assimilationScore: score,
              assimilationPerfect: perfect,
              grandQuizzUnlocked: perfect,
              grandQuizzLockedUntil: null,
              firstTryPerfect: challenger || prev.firstTryPerfect,
            },
          },
        });

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
      },

      unlockGrandQuizz: (chapitreId) => {
        const prev = get().chapterProgress[chapitreId] ?? defaultChapter(chapitreId);
        set({
          chapterProgress: {
            ...get().chapterProgress,
            [chapitreId]: { ...prev, grandQuizzLockedUntil: null, grandQuizzUnlocked: true },
          },
        });
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
        void updateLocalProfileName(String(id), nom.trim()).then(() => requestBackgroundSync());
      },

      updateProfileAvatar: (avatarId) => {
        const id = get().activeProfileId;
        set({
          profiles: get().profiles.map((p) => (p.id === id ? { ...p, avatarId } : p)),
          leagueBoard: get().leagueBoard.map((player) =>
            player.you ? { ...player, avatarId } : player
          ),
        });
        void updateLocalProfileAvatar(String(id), avatarId).then(() => requestBackgroundSync());
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
      name: "learnflow-store-v5",
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => {
        try {
          const p = (persisted ?? {}) as Partial<LearnFlowState>;
          const demoById = new Map(PROFILES_DEMO.map((d) => [String(d.id), d]));
          const rawProfiles = Array.isArray(p.profiles) ? p.profiles : current.profiles;
          const mapped = keepLocalTestProfiles(rawProfiles).map((pr) => {
            const demo = demoById.get(String(pr.id));
            return {
              ...pr,
              id: String(pr.id),
              compteId: String(pr.compteId ?? "local-parent"),
              avatarId: resolveAvatarId(pr.avatarId ?? defaultAvatarId(String(pr.id))),
              hasPin: pr.hasPin ?? true,
              ...(demo
                ? {
                    classe: demo.classe,
                    gradeLabel: demo.gradeLabel,
                  }
                : {}),
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
