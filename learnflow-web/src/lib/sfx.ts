"use client";

import { useLearnFlowStore } from "@/store/useLearnFlowStore";

export type SfxKind = "correct" | "wrong" | "warn" | "timesUp";

const FILES: Record<SfxKind, string> = {
  correct: "/sfx/correct.wav",
  wrong: "/sfx/wrong.wav",
  warn: "/sfx/warn.wav",
  timesUp: "/sfx/times-up.wav",
};

const VOLUME: Record<SfxKind, number> = {
  correct: 0.95,
  wrong: 0.88,
  warn: 0.88,
  timesUp: 1,
};

const ALIASES: Record<string, SfxKind> = {
  correct: "correct",
  wrong: "wrong",
  warn: "warn",
  timesUp: "timesUp",
  "times-up": "timesUp",
};

const POOL = 2;
const htmlPool: Partial<Record<SfxKind, HTMLAudioElement[]>> = {};
const htmlCursor: Partial<Record<SfxKind, number>> = {};
const buffers: Partial<Record<SfxKind, AudioBuffer>> = {};

let ctx: AudioContext | null = null;
let loadPromise: Promise<void> | null = null;
let unlockBound = false;

function soundsEnabled() {
  try {
    return useLearnFlowStore.getState().settings.notifications.sounds !== false;
  } catch {
    return true;
  }
}

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function bindUnlock() {
  if (unlockBound || typeof window === "undefined") return;
  unlockBound = true;
  const once = () => {
    const c = getCtx();
    if (c?.state === "suspended") void c.resume();
    window.removeEventListener("pointerdown", once, true);
    window.removeEventListener("keydown", once, true);
    window.removeEventListener("touchstart", once, true);
  };
  window.addEventListener("pointerdown", once, { capture: true });
  window.addEventListener("keydown", once, { capture: true });
  window.addEventListener("touchstart", once, { capture: true, passive: true });
}

function htmlPlayers(kind: SfxKind) {
  if (!htmlPool[kind]) {
    const list: HTMLAudioElement[] = [];
    for (let i = 0; i < POOL; i++) {
      const a = new Audio(FILES[kind]);
      a.preload = "auto";
      a.volume = VOLUME[kind];
      list.push(a);
    }
    htmlPool[kind] = list;
    htmlCursor[kind] = 0;
  }
  return htmlPool[kind]!;
}

function playHtml(kind: SfxKind) {
  const list = htmlPlayers(kind);
  const i = htmlCursor[kind] ?? 0;
  htmlCursor[kind] = (i + 1) % list.length;
  const a = list[i]!;
  try {
    a.pause();
    a.currentTime = 0;
    void a.play().catch(() => undefined);
  } catch {
    /* autoplay / decode */
  }
}

function playBuffer(kind: SfxKind) {
  const c = getCtx();
  const buf = buffers[kind];
  if (!c || c.state !== "running" || !buf) return false;
  const src = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  gain.gain.value = VOLUME[kind];
  src.connect(gain);
  gain.connect(c.destination);
  src.start(0);
  return true;
}

async function decodeAll() {
  const c = getCtx();
  if (!c) return;
  await Promise.all(
    (Object.keys(FILES) as SfxKind[]).map(async (kind) => {
      if (buffers[kind]) return;
      const res = await fetch(FILES[kind], { cache: "force-cache" });
      const data = await res.arrayBuffer();
      try {
        buffers[kind] = await c.decodeAudioData(data.slice(0));
      } catch {
        buffers[kind] = await new Promise<AudioBuffer>((resolve, reject) => {
          void c.decodeAudioData(data.slice(0), resolve, reject);
        });
      }
    })
  );
}

/** Charge et déverrouille l’audio dès le premier geste — comme l’app mobile. */
export function preloadSfx() {
  if (typeof window === "undefined") return;
  bindUnlock();
  (Object.keys(FILES) as SfxKind[]).forEach((k) => htmlPlayers(k));
  if (!loadPromise) {
    loadPromise = decodeAll().catch(() => {
      loadPromise = null;
    });
  }
  const c = getCtx();
  if (c?.state === "suspended") void c.resume();
}

/** Ding / buzz / alarme — respectent Réglages → Sons & vibrations. */
export function playSfx(name: keyof typeof ALIASES | SfxKind) {
  if (typeof window === "undefined") return;
  if (!soundsEnabled()) return;
  const kind = ALIASES[name];
  if (!kind) return;
  preloadSfx();
  const c = getCtx();
  if (c?.state === "suspended") void c.resume();
  if (playBuffer(kind)) return;
  playHtml(kind);
}
