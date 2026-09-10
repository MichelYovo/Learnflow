import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { DifficulteFlash } from "../types/learnflow";
import { parseChallengeInput } from "./blitzChallenge";

export type DuelFighter = {
  userId: string;
  name: string;
  score: number;
  answered: number;
  done: boolean;
};

export type DuelState = {
  code: string;
  seed: number;
  difficulte: DifficulteFlash;
  role: "host" | "guest";
  me: DuelFighter;
  rival: DuelFighter | null;
  startedAt: number | null;
};

type PresenceMeta = DuelFighter & {
  role: "host" | "guest";
  seed: number;
  difficulte: DifficulteFlash;
  startedAt: number | null;
};

type ProgressPayload = {
  userId: string;
  score: number;
  answered: number;
  done: boolean;
};

type StartPayload = { startedAt: number };

const JOIN_WAIT_MS = 9000;

function client(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return supabase;
}

export async function currentDuelUserId(): Promise<string | null> {
  const sb = client();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.user.id ?? null;
}

function channelName(code: string) {
  return `blitz-duel-${code.replace(/[^A-Z0-9-]/gi, "")}`;
}

function metasFromChannel(channel: RealtimeChannel): PresenceMeta[] {
  const state = channel.presenceState();
  const out: PresenceMeta[] = [];
  for (const key of Object.keys(state)) {
    const raw = state[key];
    const row = (Array.isArray(raw) ? raw[0] : raw) as unknown as PresenceMeta | undefined;
    if (row?.userId && (row.role === "host" || row.role === "guest")) out.push(row);
  }
  return out;
}

function fighterFrom(meta: PresenceMeta): DuelFighter {
  return {
    userId: meta.userId,
    name: meta.name?.trim() || "Élève",
    score: meta.score ?? 0,
    answered: meta.answered ?? 0,
    done: Boolean(meta.done),
  };
}

export function extractDuelCode(input: string): string | null {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("duel") ?? url.searchParams.get("code");
    if (fromQuery) {
      const parsed = parseChallengeInput(fromQuery);
      return parsed?.code ?? fromQuery.trim().toUpperCase();
    }
  } catch {
    /* not a URL */
  }
  const parsed = parseChallengeInput(trimmed);
  return parsed?.code ?? null;
}

export function duelShareLink(code: string) {
  const base = (process.env.EXPO_PUBLIC_LEARNFLOW_API_URL ?? "https://learnflow-web.vercel.app").replace(/\/$/, "");
  return `${base}/app/blitz?duel=${encodeURIComponent(code)}`;
}

export class BlitzDuelSession {
  readonly code: string;
  readonly userId: string;
  private channel: RealtimeChannel;
  private onUpdate: (state: DuelState) => void;
  private presence: PresenceMeta;
  private startedAt: number | null = null;
  private rival: DuelFighter | null = null;
  private startSent = false;
  private closed = false;

  private constructor(
    code: string,
    channel: RealtimeChannel,
    presence: PresenceMeta,
    onUpdate: (state: DuelState) => void
  ) {
    this.code = code;
    this.channel = channel;
    this.presence = presence;
    this.onUpdate = onUpdate;
    this.userId = presence.userId;
    this.startedAt = presence.startedAt;
  }

  snapshot(): DuelState {
    return {
      code: this.code,
      seed: this.presence.seed,
      difficulte: this.presence.difficulte,
      role: this.presence.role,
      me: fighterFrom(this.presence),
      rival: this.rival,
      startedAt: this.startedAt,
    };
  }

  private emit() {
    if (this.closed) return;
    this.onUpdate(this.snapshot());
  }

  private applyPresence() {
    const people = metasFromChannel(this.channel);
    const others = people.filter((p) => p.userId !== this.userId);
    const host = people.find((p) => p.role === "host");
    const guest = people.find((p) => p.role === "guest" && p.userId !== host?.userId);

    if (this.presence.role === "host") {
      this.rival = guest ? fighterFrom(guest) : others[0] ? fighterFrom(others[0]) : this.startedAt ? this.rival : null;
    } else {
      this.rival = host ? fighterFrom(host) : others[0] ? fighterFrom(others[0]) : this.startedAt ? this.rival : null;
      if (host) {
        this.presence.seed = host.seed;
        this.presence.difficulte = host.difficulte;
      }
    }

    const remoteStart = people.find((p) => typeof p.startedAt === "number")?.startedAt ?? null;
    if (remoteStart && !this.startedAt) this.startedAt = remoteStart;
    this.emit();
    void this.maybeStart();
  }

  private async maybeStart() {
    if (this.closed || this.presence.role !== "host" || this.startSent || this.startedAt || !this.rival) return;
    this.startSent = true;
    const startedAt = Date.now() + 3000;
    this.startedAt = startedAt;
    this.presence = { ...this.presence, startedAt };
    await this.channel.track(this.presence);
    await this.channel.send({ type: "broadcast", event: "start", payload: { startedAt } satisfies StartPayload });
    this.emit();
  }

  private bind() {
    this.channel.on("presence", { event: "sync" }, () => this.applyPresence());
    this.channel.on("presence", { event: "join" }, () => this.applyPresence());
    this.channel.on("presence", { event: "leave" }, () => this.applyPresence());
    this.channel.on("broadcast", { event: "start" }, ({ payload }) => {
      const startedAt = (payload as StartPayload | undefined)?.startedAt;
      if (typeof startedAt === "number" && startedAt > 0) {
        this.startedAt = startedAt;
        this.emit();
      }
    });
    this.channel.on("broadcast", { event: "progress" }, ({ payload }) => {
      const data = payload as ProgressPayload | undefined;
      if (!data?.userId || data.userId === this.userId) return;
      this.rival = {
        userId: data.userId,
        name: this.rival?.name || "Rival",
        score: data.score,
        answered: data.answered,
        done: data.done,
      };
      this.emit();
    });
  }

  async report(score: number, answered: number, done = false) {
    if (this.closed) return;
    this.presence = { ...this.presence, score, answered, done };
    await this.channel.send({
      type: "broadcast",
      event: "progress",
      payload: { userId: this.userId, score, answered, done } satisfies ProgressPayload,
    });
    void this.channel.track(this.presence);
    this.emit();
  }

  leave() {
    if (this.closed) return;
    this.closed = true;
    const sb = client();
    void this.channel.untrack();
    if (sb) void sb.removeChannel(this.channel);
  }

  private static async attach(
    sb: SupabaseClient,
    code: string,
    presence: PresenceMeta,
    onUpdate: (state: DuelState) => void
  ): Promise<BlitzDuelSession | { error: string }> {
    const channel = sb.channel(channelName(code), {
      config: {
        presence: { key: presence.userId },
        broadcast: { self: false },
      },
    });
    const session = new BlitzDuelSession(code, channel, presence, onUpdate);
    session.bind();
    const joined = await new Promise<string>((resolve) => {
      channel.subscribe((status) => resolve(status));
    });
    if (joined !== "SUBSCRIBED") {
      session.closed = true;
      void sb.removeChannel(channel);
      return { error: "Impossible d'ouvrir l'arène. Réessaie dans un instant." };
    }
    await channel.track(presence);
    session.emit();
    return session;
  }

  static async host(input: {
    code: string;
    seed: number;
    difficulte: DifficulteFlash;
    name: string;
    onUpdate: (state: DuelState) => void;
  }): Promise<BlitzDuelSession | { error: string }> {
    const sb = client();
    const userId = await currentDuelUserId();
    if (!sb || !userId) return { error: "Connecte-toi pour ouvrir un Duel Blitz." };
    return BlitzDuelSession.attach(
      sb,
      input.code,
      {
        userId,
        name: input.name.trim() || "Élève",
        role: "host",
        seed: input.seed,
        difficulte: input.difficulte,
        score: 0,
        answered: 0,
        done: false,
        startedAt: null,
      },
      input.onUpdate
    );
  }

  static async join(input: {
    code: string;
    name: string;
    onUpdate: (state: DuelState) => void;
  }): Promise<BlitzDuelSession | { error: string }> {
    const sb = client();
    const userId = await currentDuelUserId();
    if (!sb || !userId) return { error: "Connecte-toi pour rejoindre un Duel Blitz." };
    const parsed = parseChallengeInput(input.code);
    if (!parsed) return { error: "Code invalide. Exemple : LF-M7K2" };

    const session = await BlitzDuelSession.attach(
      sb,
      parsed.code,
      {
        userId,
        name: input.name.trim() || "Rival",
        role: "guest",
        seed: parsed.seed,
        difficulte: parsed.difficulte,
        score: 0,
        answered: 0,
        done: false,
        startedAt: null,
      },
      input.onUpdate
    );
    if ("error" in session) return session;

    const host = await new Promise<PresenceMeta | "full" | "self" | null>((resolve) => {
      const timeout = setTimeout(() => resolve(null), JOIN_WAIT_MS);
      const check = () => {
        const people = metasFromChannel(session.channel);
        const hostMeta = people.find((p) => p.role === "host");
        if (hostMeta?.userId === userId) {
          clearTimeout(timeout);
          resolve("self");
          return;
        }
        const extraGuest = people.some((p) => p.role === "guest" && p.userId !== userId);
        if (hostMeta && extraGuest) {
          clearTimeout(timeout);
          resolve("full");
          return;
        }
        if (hostMeta) {
          clearTimeout(timeout);
          resolve(hostMeta);
        }
      };
      session.channel.on("presence", { event: "sync" }, check);
      session.channel.on("presence", { event: "join" }, check);
      check();
    });

    if (host === "self") {
      session.leave();
      return { error: "C'est ton arène. Envoie le code à un ami, ne le colle pas ici." };
    }
    if (host === "full") {
      session.leave();
      return { error: "Cette arène est déjà complète." };
    }
    if (!host) {
      session.leave();
      return { error: "Aucune arène ouverte avec ce code. Ton ami doit t'inviter et rester dans le lobby." };
    }

    session.presence.seed = host.seed;
    session.presence.difficulte = host.difficulte;
    session.rival = fighterFrom(host);
    if (host.startedAt) session.startedAt = host.startedAt;
    session.emit();
    return session;
  }
}
