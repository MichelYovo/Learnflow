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

const POOL = 2;
const players: Partial<Record<SfxKind, AudioPlayer[]>> = {};
const cursor: Partial<Record<SfxKind, number>> = {};
let modeReady = false;
let modePromise: Promise<void> | null = null;

function soundsEnabled() {
  return useLearnFlowStore.getState().settings.notifications.sounds;
}

function volumeFor(kind: SfxKind) {
  return kind === "timesUp" ? 1 : kind === "correct" ? 0.95 : 0.88;
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
  return modePromise ?? Promise.resolve();
}

function poolFor(kind: SfxKind) {
  if (!players[kind]) {
    const list: AudioPlayer[] = [];
    for (let i = 0; i < POOL; i++) {
      const p = createAudioPlayer(SOURCES[kind]);
      p.volume = volumeFor(kind);
      list.push(p);
    }
    players[kind] = list;
    cursor[kind] = 0;
  }
  return players[kind]!;
}

function nextPlayer(kind: SfxKind) {
  const list = poolFor(kind);
  const i = cursor[kind] ?? 0;
  cursor[kind] = (i + 1) % list.length;
  return list[i]!;
}

function restart(p: AudioPlayer) {
  try {
    const busy = Boolean((p as AudioPlayer & { playing?: boolean }).playing);
    const t = (p as AudioPlayer & { currentTime?: number }).currentTime ?? 0;
    if (busy) p.pause();
    if (busy || t > 0.02) {
      void p.seekTo(0).then(() => {
        p.play();
      });
      return;
    }
    p.play();
  } catch {
    try {
      p.play();
    } catch {
      /* audio optional */
    }
  }
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
    (Object.keys(SOURCES) as SfxKind[]).forEach((k) => poolFor(k));
  });
}

/** Ding / buzz / alarme — respectent Réglages → Sons & vibrations. */
export function playSfx(kind: SfxKind) {
  if (!soundsEnabled()) return;
  void haptic(kind);
  const fire = () => restart(nextPlayer(kind));
  if (modeReady) {
    fire();
    return;
  }
  void ensureMode().then(fire).catch(() => undefined);
}
