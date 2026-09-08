import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { fetchSupportMessages, insertRow, type SupportMessage } from "./supabase";

const FILE = join(process.cwd(), ".data", "support-messages.json");

export type IncomingSupport = {
  name: string;
  email: string;
  message: string;
  topic: "support" | "waitlist";
};

function readLocal(): SupportMessage[] {
  try {
    const raw = readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw) as SupportMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(rows: SupportMessage[]) {
  mkdirSync(join(process.cwd(), ".data"), { recursive: true });
  writeFileSync(FILE, JSON.stringify(rows, null, 2), "utf8");
}

export async function saveSupportMessage(input: IncomingSupport): Promise<{ ok: true } | { ok: false; error: string }> {
  const row: SupportMessage = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    message: input.message,
    topic: input.topic,
    status: "new",
    created_at: new Date().toISOString(),
  };

  const local = readLocal();
  writeLocal([row, ...local].slice(0, 500));
  await insertRow("support_messages", row);
  return { ok: true };
}

export async function listSupportMessages(): Promise<{ data: SupportMessage[]; error?: string }> {
  const cloud = await fetchSupportMessages();
  const local = readLocal();
  const byId = new Map<string, SupportMessage>();
  for (const m of [...(cloud.data ?? []), ...local]) {
    byId.set(m.id, m);
  }
  const data = [...byId.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return { data, error: cloud.data ? undefined : cloud.error };
}

export async function markLocalRead(id: string): Promise<boolean> {
  const local = readLocal();
  const next = local.map((m) => (m.id === id ? { ...m, status: "read" } : m));
  if (JSON.stringify(local) === JSON.stringify(next)) return false;
  writeLocal(next);
  return true;
}
