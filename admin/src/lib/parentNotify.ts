import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { classLabel } from "./brand";
import type { AdminStudent } from "@/data/seed";
import { recapParentText, sendWhatsApp, waMeLink, welcomeParentText } from "./whatsapp";
import { insertLoginNotice } from "./supabase";
import { isValidTogoLocal, parentPhoneStatus } from "./phoneTogo";

const DIR = join(process.cwd(), ".data");
const SETTINGS_FILE = join(DIR, "parent-settings.json");
const SENDS_FILE = join(DIR, "parent-sends.json");

export const WELCOME_EVENTS = ["signup", "parent_linked", "parent_welcome"] as const;
export const RECAP_EVENTS = ["weekly_recap"] as const;

export type ParentCadenceDays = 7 | 14;

export type ParentSettings = {
  cadenceDays: ParentCadenceDays;
  updatedAt: string;
};

export type ParentSend = {
  id: string;
  studentId: string;
  name: string;
  phone: string;
  event: "parent_welcome" | "weekly_recap";
  status: "sent" | "skipped" | "error";
  detail?: string;
  sentAt: string;
};

export type LoginNotice = {
  id: string;
  student_id: string;
  channel: string;
  event: string;
  status: string;
  detail?: string | null;
  created_at: string;
};

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, value: unknown) {
  mkdirSync(DIR, { recursive: true });
  writeFileSync(file, JSON.stringify(value, null, 2), "utf8");
}

export function loadParentSettings(): ParentSettings {
  const stored = readJson<Partial<ParentSettings>>(SETTINGS_FILE, {});
  return {
    cadenceDays: stored.cadenceDays === 7 ? 7 : 14,
    updatedAt: stored.updatedAt || new Date().toISOString(),
  };
}

export function saveParentSettings(cadenceDays: ParentCadenceDays): ParentSettings {
  const next: ParentSettings = { cadenceDays, updatedAt: new Date().toISOString() };
  writeJson(SETTINGS_FILE, next);
  return next;
}

export function loadParentSends(): ParentSend[] {
  const rows = readJson<ParentSend[]>(SENDS_FILE, []);
  return Array.isArray(rows) ? rows : [];
}

export function recordParentSend(row: Omit<ParentSend, "id" | "sentAt">) {
  const next: ParentSend = { id: randomUUID(), sentAt: new Date().toISOString(), ...row };
  writeJson(SENDS_FILE, [next, ...loadParentSends()].slice(0, 800));
  return next;
}

function lastLocal(studentId: string, event: ParentSend["event"]) {
  return loadParentSends().find((s) => s.studentId === studentId && s.event === event && s.status === "sent");
}

function lastCloud(notices: LoginNotice[], studentId: string, events: readonly string[]) {
  return notices.find((n) => n.student_id === studentId && events.includes(n.event) && n.status === "sent");
}

export function lastWelcomeAt(studentId: string, notices: LoginNotice[]) {
  return lastLocal(studentId, "parent_welcome")?.sentAt || lastCloud(notices, studentId, WELCOME_EVENTS)?.created_at;
}

export function lastRecapAt(studentId: string, notices: LoginNotice[]) {
  return lastLocal(studentId, "weekly_recap")?.sentAt || lastCloud(notices, studentId, RECAP_EVENTS)?.created_at;
}

export function needsWelcome(student: AdminStudent, notices: LoginNotice[]) {
  return isValidTogoLocal(student.parentPhone ?? "") && !lastWelcomeAt(student.id, notices);
}

export function needsRecap(student: AdminStudent, notices: LoginNotice[], cadenceDays: number) {
  if (!isValidTogoLocal(student.parentPhone ?? "")) return false;
  const lastRecap = lastRecapAt(student.id, notices);
  const lastWelcome = lastWelcomeAt(student.id, notices);
  const last = lastRecap || lastWelcome;
  if (!last) return false;
  return Date.now() - new Date(last).getTime() >= cadenceDays * 86_400_000;
}

export function parentDraft(student: AdminStudent, kind: "parent_welcome" | "weekly_recap", cadenceDays: number) {
  const phone = student.parentPhone?.trim() ?? "";
  const text =
    kind === "parent_welcome"
      ? welcomeParentText({ name: student.name, classe: classLabel(student.classe), cadenceDays })
      : recapParentText({
          name: student.name,
          classe: classLabel(student.classe),
          xp: student.xpTotale,
          streak: student.streak,
          lessons: student.lessonsDone,
          league: student.leagueTier,
          lastSeen: student.lastSeenAt,
        });
  return {
    studentId: student.id,
    name: student.name,
    phone,
    event: kind,
    text,
    waLink: phone && isValidTogoLocal(phone) ? waMeLink(phone, text) : "",
    phoneStatus: parentPhoneStatus(phone),
  };
}

export async function sendParentMessage(
  student: AdminStudent,
  kind: "parent_welcome" | "weekly_recap",
  cadenceDays: number,
) {
  const draft = parentDraft(student, kind, cadenceDays);
  if (draft.phoneStatus !== "ok") {
    return { ok: false as const, skipped: true as const, error: "Numéro parent invalide.", draft };
  }
  const wa = await sendWhatsApp(draft.phone, draft.text);
  if (wa.ok) {
    recordParentSend({
      studentId: student.id,
      name: student.name,
      phone: draft.phone,
      event: kind,
      status: "sent",
    });
    await insertLoginNotice({
      student_id: student.id,
      channel: "whatsapp",
      event: kind,
      status: "sent",
      detail: "api",
    });
    return { ok: true as const, skipped: false as const, draft };
  }
  return { ok: false as const, skipped: true as const, error: wa.error, draft };
}
