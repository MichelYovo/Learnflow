const FILES: Record<string, string> = {
  correct: "/sfx/correct.wav",
  wrong: "/sfx/wrong.wav",
  warn: "/sfx/warn.wav",
  "times-up": "/sfx/times-up.wav",
};

export function playSfx(name: keyof typeof FILES | "correct" | "wrong" | "warn" | "times-up") {
  if (typeof window === "undefined") return;
  try {
    const muted = window.localStorage.getItem("learnflow-mute-sfx") === "1";
    if (muted) return;
    const src = FILES[name];
    if (!src) return;
    const audio = new Audio(src);
    audio.volume = 0.55;
    void audio.play().catch(() => undefined);
  } catch {
    /* ignore autoplay restrictions */
  }
}

export function preloadSfx() {
  if (typeof window === "undefined") return;
  Object.values(FILES).forEach((src) => {
    const a = new Audio();
    a.preload = "auto";
    a.src = src;
  });
}
