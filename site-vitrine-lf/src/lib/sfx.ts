"use client";

export type SfxKind = "click" | "correct" | "wrong" | "warn" | "timesUp";

const FILES: Record<Exclude<SfxKind, "click">, string> = {
  correct: "/sfx/correct.wav",
  wrong: "/sfx/wrong.wav",
  warn: "/sfx/warn.wav",
  timesUp: "/sfx/times-up.wav",
};

const VOLUME: Record<Exclude<SfxKind, "click">, number> = {
  correct: 0.9,
  wrong: 0.82,
  warn: 0.78,
  timesUp: 0.9,
};

const POOL = 2;
const htmlPool: Partial<Record<Exclude<SfxKind, "click">, HTMLAudioElement[]>> = {};
const htmlCursor: Partial<Record<Exclude<SfxKind, "click">, number>> = {};

let ctx: AudioContext | null = null;
let unlockBound = false;

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
  };
  window.addEventListener("pointerdown", once, { capture: true });
}

function htmlPlayers(kind: Exclude<SfxKind, "click">) {
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

function playHtml(kind: Exclude<SfxKind, "click">) {
  const list = htmlPlayers(kind);
  const i = htmlCursor[kind] ?? 0;
  htmlCursor[kind] = (i + 1) % list.length;
  const a = list[i]!;
  try {
    a.pause();
    a.currentTime = 0;
    void a.play().catch(() => undefined);
  } catch {
    /* autoplay */
  }
}

function playClick() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(920, t);
  o.frequency.exponentialRampToValueAtTime(640, t + 0.07);
  g.gain.setValueAtTime(0.07, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  o.connect(g);
  g.connect(c.destination);
  o.start(t);
  o.stop(t + 0.1);
}

export function preloadSfx() {
  if (typeof window === "undefined") return;
  bindUnlock();
  (Object.keys(FILES) as Exclude<SfxKind, "click">[]).forEach((k) => htmlPlayers(k));
  const c = getCtx();
  if (c?.state === "suspended") void c.resume();
}

export function playSfx(kind: SfxKind) {
  if (typeof window === "undefined") return;
  preloadSfx();
  const c = getCtx();
  if (c?.state === "suspended") void c.resume();
  if (kind === "click") {
    playClick();
    return;
  }
  playHtml(kind);
}
