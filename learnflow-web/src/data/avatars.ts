export const AVATAR_IDS = ["a01", "a02", "a03", "a04", "a05", "a06", "a07", "a08", "a09", "a10"] as const;

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

export function avatarSrc(id?: string | null): string | undefined {
  const resolved = resolveAvatarId(id);
  if (!resolved) return undefined;
  const n = resolved.replace(/^a/, "");
  return `/avatars/avatar-${n}.png`;
}

export function resolveAvatarId(id?: string | null): string | undefined {
  if (!id) return undefined;
  if ((AVATAR_IDS as readonly string[]).includes(id)) return id;
  if (id in LEGACY_IDS) return LEGACY_IDS[id];
  const padded = id.replace(/^avatar-?/i, "").replace(/^a/i, "");
  const asNum = Number.parseInt(padded, 10);
  if (Number.isFinite(asNum) && asNum > 0) {
    const key = `a${String(((asNum - 1) % AVATAR_IDS.length) + 1).padStart(2, "0")}`;
    if ((AVATAR_IDS as readonly string[]).includes(key)) return key;
  }
  return undefined;
}

export function defaultAvatarId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_IDS[hash % AVATAR_IDS.length];
}
