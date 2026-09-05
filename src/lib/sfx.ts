import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useLearnFlowStore } from "../store/useLearnFlowStore";

export type SfxKind = "correct" | "wrong" | "warn" | "timesUp";

const SOURCES: Record<SfxKind, number> = {
  correct: require("../../assets/sfx/correct.wav"),
  wrong: require("../../assets/sfx/wrong.wav"),
  warn: require("../../assets/sfx/warn.wav"),
  timesUp: require("../../assets/sfx/times-up.wav"),
};

const players: Partial<Record<SfxKind, AudioPlayer>> = {};
let modeReady = false;
let modePromise: Promise<void> | null = null;

function soundsEnabled() {
  return useLearnFlowStore.getState().settings.notifications.sounds;
}

function ensureMode() {
  if (modeReady) return Promise.resolve();
  if (!modePromise) {
    modePromise = setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: "mixWithOthers",
    })
      .then(() => {
        modeReady = true;
      })
      .catch(() => {
        modePromise = null;
      });
  }
  return modePromise;
}

function getPlayer(kind: SfxKind) {
  if (!players[kind]) {
    const p = createAudioPlayer(SOURCES[kind]);
    p.volume = kind === "timesUp" ? 1 : kind === "correct" ? 0.95 : 0.88;
    players[kind] = p;
  }
  return players[kind]!;
}

async function haptic(kind: SfxKind) {
  try {
    if (kind === "correct") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (kind === "wrong") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (kind === "timesUp") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch {
    /* web / unsupported */
  }
}

export function preloadSfx() {
  if (!soundsEnabled()) return;
  void ensureMode().then(() => {
    (Object.keys(SOURCES) as SfxKind[]).forEach((k) => getPlayer(k));
  });
}

/** Ding / buzz / alarme — respectent Réglages → Sons & vibrations. */
export function playSfx(kind: SfxKind) {
  if (!soundsEnabled()) return;
  void haptic(kind);
  void ensureMode()
    .then(async () => {
      const p = getPlayer(kind);
      p.pause();
      await p.seekTo(0);
      p.play();
    })
    .catch(() => {
      /* audio optional */
    });
}
