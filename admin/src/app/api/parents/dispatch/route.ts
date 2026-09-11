import { NextResponse } from "next/server";
import { loadDashboardData } from "@/lib/catalog";
import {
  loadParentSettings,
  needsRecap,
  needsWelcome,
  parentDraft,
  sendParentMessage,
} from "@/lib/parentNotify";
import { requireAdmin } from "@/lib/requireAdmin";
import { fetchLoginNotices } from "@/lib/supabase";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  let body: { kind?: "due" | "welcome" | "recap"; studentIds?: string[] } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }
  const kind = body.kind === "welcome" || body.kind === "recap" ? body.kind : "due";
  const data = await loadDashboardData();
  const notices = (await fetchLoginNotices()).data ?? [];
  const settings = loadParentSettings();
  const wantedIds = body.studentIds?.length ? new Set(body.studentIds) : null;
  const pool = data.students.filter((s) => s.parentPhone && (!wantedIds || wantedIds.has(s.id)));

  const jobs: { id: string; kind: "parent_welcome" | "weekly_recap" }[] = [];
  for (const s of pool) {
    if ((kind === "welcome" || kind === "due") && needsWelcome(s, notices)) {
      jobs.push({ id: s.id, kind: "parent_welcome" });
    }
    if (kind === "recap" || (kind === "due" && needsRecap(s, notices, settings.cadenceDays))) {
      jobs.push({ id: s.id, kind: "weekly_recap" });
    }
  }

  const sent: { name: string; event: string }[] = [];
  const skipped: { name: string; reason: string }[] = [];
  const drafts: ReturnType<typeof parentDraft>[] = [];

  for (const job of jobs) {
    const student = pool.find((s) => s.id === job.id);
    if (!student) continue;
    const result = await sendParentMessage(student, job.kind, settings.cadenceDays);
    if (result.ok) sent.push({ name: student.name, event: job.kind });
    else {
      skipped.push({ name: student.name, reason: result.error || "sans API WhatsApp" });
      if (result.draft?.waLink) drafts.push(result.draft);
    }
  }

  return NextResponse.json({
    sent,
    skipped,
    drafts,
    jobs: jobs.length,
    via: sent.length ? "api" : "wa.me",
  });
}
