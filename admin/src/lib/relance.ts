import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  DEFAULT_RELANCE_BODY,
  DEFAULT_RELANCE_SUBJECT,
  type RelanceSend,
  type RelanceTemplate,
} from "./relanceTypes";

export {
  continueLink,
  DEFAULT_RELANCE_BODY,
  DEFAULT_RELANCE_SUBJECT,
  filledRelance,
  fillRelanceText,
  firstName,
  studentAppUrl,
  type RelanceSend,
  type RelanceTemplate,
} from "./relanceTypes";

const DIR = join(process.cwd(), ".data");
const TEMPLATE_FILE = join(DIR, "relance-template.json");
const SENDS_FILE = join(DIR, "relance-sends.json");

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

export function loadRelanceTemplate(): RelanceTemplate {
  const stored = readJson<Partial<RelanceTemplate>>(TEMPLATE_FILE, {});
  return {
    subject: stored.subject?.trim() || DEFAULT_RELANCE_SUBJECT,
    body: stored.body?.trim() || DEFAULT_RELANCE_BODY,
    updatedAt: stored.updatedAt || new Date().toISOString(),
  };
}

export function saveRelanceTemplate(input: { subject: string; body: string }): RelanceTemplate {
  const next: RelanceTemplate = {
    subject: input.subject.trim() || DEFAULT_RELANCE_SUBJECT,
    body: input.body.trim() || DEFAULT_RELANCE_BODY,
    updatedAt: new Date().toISOString(),
  };
  writeJson(TEMPLATE_FILE, next);
  return next;
}

export function loadRelanceSends(): RelanceSend[] {
  const rows = readJson<RelanceSend[]>(SENDS_FILE, []);
  return Array.isArray(rows) ? rows : [];
}

export function recordRelanceSend(row: Omit<RelanceSend, "id" | "sentAt"> & { via?: string }) {
  const next: RelanceSend = {
    id: randomUUID(),
    sentAt: new Date().toISOString(),
    ...row,
  };
  writeJson(SENDS_FILE, [next, ...loadRelanceSends()].slice(0, 800));
  return next;
}

export function lastSendFor(studentId: string) {
  return loadRelanceSends().find((s) => s.studentId === studentId);
}
