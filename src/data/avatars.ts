import type { ImageSourcePropType } from "react-native";

/** 10 bustes 3D — catalogue actuel. */
export const AVATAR_SOURCES: Record<string, ImageSourcePropType> = {
  a01: require("../../assets/avatars/avatar-01.png"),
  a02: require("../../assets/avatars/avatar-02.png"),
  a03: require("../../assets/avatars/avatar-03.png"),
  a04: require("../../assets/avatars/avatar-04.png"),
  a05: require("../../assets/avatars/avatar-05.png"),
  a06: require("../../assets/avatars/avatar-06.png"),
  a07: require("../../assets/avatars/avatar-07.png"),
  a08: require("../../assets/avatars/avatar-08.png"),
  a09: require("../../assets/avatars/avatar-09.png"),
  a10: require("../../assets/avatars/avatar-10.png"),
};

const LEGACY_IDS: Record<string, string> = {
  sage: "a05",
  etoile: "a01",
  explorer: "a07",
  artiste: "a09",
  champion: "a02",
  lecteur: "a06",
  musicien: "a04",
  poete: "a01",
  stratege: "a03",
  botaniste: "a06",
  astronaute: "a10",
  eclaire: "a08",
};

export interface AvatarDef {
  id: string;
  source: ImageSourcePropType;
}

export const AVATAR_IDS = Object.keys(AVATAR_SOURCES);

export const AVATARS: AvatarDef[] = AVATAR_IDS.map((id) => ({
  id,
  source: AVATAR_SOURCES[id],
}));

export function resolveAvatarId(id?: string | null): string {
  if (!id) return AVATAR_IDS[0];
  if (id in AVATAR_SOURCES) return id;
  if (id in LEGACY_IDS) return LEGACY_IDS[id];
  const padded = id.replace(/^avatar-?/i, "").replace(/^a/i, "");
  const asNum = Number.parseInt(padded, 10);
  if (Number.isFinite(asNum) && asNum > 0) {
    const key = `a${String(((asNum - 1) % AVATAR_IDS.length) + 1).padStart(2, "0")}`;
    if (key in AVATAR_SOURCES) return key;
  }
  return AVATAR_IDS[0];
}

export function getAvatar(id?: string | null): AvatarDef {
  const resolved = resolveAvatarId(id);
  return { id: resolved, source: AVATAR_SOURCES[resolved] };
}

export function defaultAvatarId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_IDS[hash % AVATAR_IDS.length];
}

export function avatarByIndex(index: number): string {
  return AVATAR_IDS[Math.abs(index) % AVATAR_IDS.length];
}
