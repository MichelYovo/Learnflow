import { Ionicons } from "@expo/vector-icons";
import React from "react";

const MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  "home-fill": "home",
  book: "book-outline",
  "book-fill": "book",
  trophy: "trophy-outline",
  "trophy-fill": "trophy",
  user: "person-outline",
  "user-fill": "person",
  people: "people-outline",
  quiz: "help-circle-outline",
  "arrow-left": "arrow-back",
  "arrow-right": "arrow-forward",
  zap: "flash",
  flame: "flame",
  star: "star",
  sparkles: "sparkles",
  crown: "trophy",
  target: "locate",
  compass: "compass-outline",
  layers: "layers-outline",
  shield: "shield-checkmark-outline",
  lock: "lock-closed",
  clock: "time-outline",
  check: "checkmark",
  "check-circle": "checkmark-circle",
  x: "close",
  "x-circle": "close-circle",
  eye: "eye-outline",
  "eye-off": "eye-off-outline",
  bell: "notifications-outline",
  "bell-fill": "notifications",
  "bell-off": "notifications-off-outline",
  settings: "settings-outline",
  "chevron-right": "chevron-forward",
  "chevron-down": "chevron-down",
  "chevron-up": "chevron-up",
  "trending-up": "trending-up",
  "log-out": "log-out-outline",
  share: "share-social-outline",
  "message-square": "chatbubble-ellipses-outline",
  pen: "pencil",
  flag: "flag-outline",
  grid: "grid-outline",
  hexagon: "shapes-outline",
  diamond: "diamond-outline",
  lightbulb: "bulb-outline",
  "play-circle": "play-circle",
  "rotate-ccw": "refresh",
  "refresh-cw": "sync",
  plus: "add",
  minus: "remove",
  "alert-circle": "alert-circle",
  mail: "mail-outline",
  calculator: "calculator-outline",
  flask: "flask-outline",
  leaf: "leaf-outline",
  globe: "globe-outline",
  chatbubble: "chatbubble-outline",
  heart: "heart-outline",
  feather: "leaf-outline",
  brain: "hardware-chip-outline",
  coffee: "cafe-outline",
  timer: "timer-outline",
  send: "send",
  robot: "hardware-chip",
  atom: "planet-outline",
  microscope: "eyedrop-outline",
  quill: "create-outline",
  calendar: "calendar-outline",
  moon: "moon-outline",
  sunny: "sunny-outline",
  "logo-google": "logo-google",
  "logo-apple": "logo-apple",
  "logo-facebook": "logo-facebook",
};

export type IconName = keyof typeof MAP | string;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export default function Icon({ name, size = 20, color = "#1C1917" }: Props) {
  const glyph = MAP[name] ?? "ellipse-outline";
  return <Ionicons name={glyph} size={size} color={color} />;
}
