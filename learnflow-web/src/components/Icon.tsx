"use client";

export type IconName =
  | "star"
  | "layers"
  | "trophy"
  | "book"
  | "flame"
  | "zap"
  | "arrow-left"
  | "chevron-right"
  | "chevron-left"
  | "target"
  | "lock"
  | "timer"
  | "feather"
  | "brain"
  | "coffee"
  | "settings"
  | "quiz"
  | "pen"
  | "moon"
  | "sun"
  | "bell"
  | "bell-off"
  | "shield"
  | "compass"
  | "user"
  | "log-out"
  | "plus"
  | "check"
  | "x"
  | "eye"
  | "eye-off"
  | "mail"
  | "calendar"
  | "message"
  | "share"
  | "play"
  | "grid"
  | "check-circle"
  | "home"
  | "calculator"
  | "atom"
  | "microscope"
  | "globe"
  | "quill"
  | "chatbubble"
  | "heart"
  | "leaf"
  | "flask"
  | "refresh"
  | "volume"
  | "trash"
  | "clock"
  | "edit"
  | "users"
  | "sparkles"
  | "alert"
  | "award"
  | "crown"
  | "people"
  | "play-circle"
  | "lightbulb"
  | "alert-circle"
  | "chevron-up"
  | "chevron-down";

const PATHS: Record<IconName, string> = {
  star: "M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z",
  layers: "M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 16l9 5 9-5",
  trophy: "M8 4h8v3a4 4 0 01-8 0V4zM6 5H4v2a4 4 0 004 4M18 5h2v2a4 4 0 01-4 4M9 20h6M12 13v7",
  book: "M4 5a2 2 0 012-2h12v16H6a2 2 0 01-2-2V5zm4 2h8M8 11h8",
  flame: "M12 3s5 5 5 9a5 5 0 11-10 0c0-2 2-5 5-9z",
  zap: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  "arrow-left": "M15 6l-6 6 6 6M9 12h11",
  "chevron-right": "M9 6l6 6-6 6",
  "chevron-left": "M15 6l-6 6 6 6",
  target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12h.01",
  lock: "M8 11V8a4 4 0 118 0v3M6 11h12v9H6v-9z",
  timer: "M12 8v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18zM9 3h6",
  feather: "M20 4c-7 1-12 8-13 14l3 3c6-1 13-6 14-13-2 0-4-2-4-4zM6 18l4-4",
  brain: "M8 8a3 3 0 013-3 3 3 0 013 3 3 3 0 013 3v4a3 3 0 01-3 3H9a3 3 0 01-3-3V9a3 3 0 012-2zM9 12h6",
  coffee: "M5 8h11v6a4 4 0 01-4 4H9a4 4 0 01-4-4V8zm11 1h2a3 3 0 010 6h-2M7 20h8M8 4v2M12 4v2",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM4 12l2-1 1-2 2-1 1-2h2l1 2 2 1 1 2 2 1-2 1-1 2-2 1-1 2h-2l-1-2-2-1-1-2-2-1z",
  quiz: "M8 7h8M8 11h5M6 4h12v16H6V4zM9 16h2",
  pen: "M4 20l4-1 11-11-3-3L5 16l-1 4z",
  moon: "M18 13A7 7 0 119 5a7 7 0 009 8z",
  sun: "M12 4V2M12 22v-2M4.9 4.9L3.5 3.5M20.5 20.5l-1.4-1.4M4 12H2M22 12h-2M4.9 19.1L3.5 20.5M20.5 3.5l-1.4 1.4M12 17a5 5 0 100-10 5 5 0 000 10z",
  bell: "M6 17h12l-1-6a5 5 0 00-10 0l-1 6zM10 17a2 2 0 004 0",
  "bell-off": "M6 17h12l-1-6a5 5 0 00-3-8M4 4l16 16M10 17a2 2 0 004 0",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  compass: "M12 21a9 9 0 100-18 9 9 0 000 18zM14.5 9.5l-2 5-5 2 2-5 5-2z",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM5 20c1.2-3 3.6-5 7-5s5.8 2 7 5",
  "log-out": "M10 6H6v12h4M14 16l4-4-4-4M18 12H10",
  plus: "M12 5v14M5 12h14",
  check: "M5 12l5 5L20 7",
  x: "M6 6l12 12M18 6L6 18",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  "eye-off": "M3 3l18 18M9.9 9.9A3 3 0 0014 14M6 7C3.5 8.6 2 12 2 12s4 7 10 7c1.7 0 3.2-.4 4.5-1.1M10.6 5.1A10 10 0 0112 5c6 0 10 7 10 7a16 16 0 01-3.2 3.8",
  mail: "M4 6h16v12H4V6zm0 0l8 7 8-7",
  calendar: "M5 6h14v14H5V6zm0 5h14M9 3v4M15 3v4",
  message: "M5 6h14v10H8l-3 3V6z",
  share: "M16 8a3 3 0 100-6 3 3 0 000 6zM8 14a3 3 0 100-6 3 3 0 000 6zM16 22a3 3 0 100-6 3 3 0 000 6zM10.6 12.2l4.8-2.4M10.6 13.8l4.8 2.4",
  play: "M8 5v14l12-7L8 5z",
  grid: "M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z",
  "check-circle": "M12 21a9 9 0 100-18 9 9 0 000 18zM8 12l3 3 5-6",
  home: "M4 11l8-7 8 7v9H4v-9zM9 20v-6h6v6",
  calculator: "M6 3h12v18H6V3zm3 4h6M9 12h2m4 0h2M9 16h2m4 0h2",
  atom: "M12 13a1 1 0 100-2 1 1 0 000 2zM12 12c5 0 8-2 8-4s-3-4-8-4-8 2-8 4 3 4 8 4zm0 0c5 3 6 7 4 8s-6-1-8-4 0-8 4-8 8 1 8 4-3 5-8 4z",
  microscope: "M9 4h4v6H9V4zM8 10h6v2H8v-2zM12 12v4M7 20h10M9 16h6",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9z",
  quill: "M5 19c6-2 10-8 14-16-1 6-4 11-10 14l-4 2z",
  chatbubble: "M6 6h12v9H9l-3 3V6z",
  heart: "M12 20s-7-4.5-7-9a4 4 0 017-2 4 4 0 017 2c0 4.5-7 9-7 9z",
  leaf: "M5 19c8-1 13-8 14-15-8 1-14 7-14 15zM8 16l8-8",
  flask: "M9 3h6M10 3v6L5 19h14L14 9V3",
  refresh: "M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M20 5v6h-6M4 19v-6h6",
  volume: "M5 10v4h3l4 3V7L8 10H5zM16 9a4 4 0 010 6",
  trash: "M5 7h14M9 7V5h6v2M8 7l1 13h6l1-13",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v6l4 2",
  edit: "M4 20h4l10-10-4-4L4 16v4zM14 6l4 4",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zM16 12a3 3 0 100-6M4 19c.8-3 2.8-5 5-5s4.2 2 5 5M15 14c2 0 3.6 1.4 4.3 4",
  sparkles: "M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3zM18 15l.7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15z",
  alert: "M12 9v4M12 17h.01M10.3 4.7L2.8 18a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 4.7a2 2 0 00-3.4 0z",
  award: "M8 14l-2 7 6-3 6 3-2-7M12 15a6 6 0 100-12 6 6 0 000 12z",
  crown: "M3 17h18M5 17L4 8l5 4 3-7 3 7 5-4-1 9H5z",
  people: "M9 11a3 3 0 100-6 3 3 0 000 6zM16 12a3 3 0 100-6M4 19c.8-3 2.8-5 5-5s4.2 2 5 5M15 14c2 0 3.6 1.4 4.3 4",
  "play-circle": "M12 21a9 9 0 100-18 9 9 0 000 18zM10 8l6 4-6 4V8z",
  lightbulb: "M9 18h6M10 21h4M12 3a6 6 0 00-3 11c.4.5.8 1.2 1 2h4c.2-.8.6-1.5 1-2A6 6 0 0012 3z",
  "alert-circle": "M12 21a9 9 0 100-18 9 9 0 000 18zM12 8v5M12 16h.01",
  "chevron-up": "M6 15l6-6 6 6",
  "chevron-down": "M6 9l6 6 6-6",
};

export default function Icon({
  name,
  size = 18,
  color = "currentColor",
  className,
}: {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d={PATHS[name] ?? PATHS.star}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

