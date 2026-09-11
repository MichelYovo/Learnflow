import { NextResponse } from "next/server";
import { classLabel } from "@/lib/brand";
import { loadDashboardData } from "@/lib/catalog";
import {
  lastRecapAt,
  lastWelcomeAt,
  loadParentSends,
  loadParentSettings,
  needsRecap,
  needsWelcome,
  parentDraft,
} from "@/lib/parentNotify";
import { parentPhoneStatus } from "@/lib/phoneTogo";
import { requireAdmin } from "@/lib/requireAdmin";
import { fetchLoginNotices } from "@/lib/supabase";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const data = await loadDashboardData();
  const notices = (await fetchLoginNotices()).data ?? [];
  const settings = loadParentSettings();
  const students = data.students.map((s) => {
    const status = parentPhoneStatus(s.parentPhone);
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      classe: s.classe,
      classLabel: classLabel(s.classe),
      parentPhone: s.parentPhone,
      phoneStatus: status,
      xpTotale: s.xpTotale,
      welcomeDue: needsWelcome(s, notices),
      recapDue: needsRecap(s, notices, settings.cadenceDays),
      lastWelcomeAt: lastWelcomeAt(s.id, notices),
      lastRecapAt: lastRecapAt(s.id, notices),
      welcomeLink: status === "ok" ? parentDraft(s, "parent_welcome", settings.cadenceDays).waLink : "",
      recapLink: status === "ok" ? parentDraft(s, "weekly_recap", settings.cadenceDays).waLink : "",
    };
  });
  return NextResponse.json({
    cadenceDays: settings.cadenceDays,
    whatsappReady: isWhatsAppConfigured(),
    withPhone: students.filter((s) => s.phoneStatus !== "missing").length,
    valid: students.filter((s) => s.phoneStatus === "ok").length,
    invalid: students.filter((s) => s.phoneStatus === "invalid").length,
    missing: students.filter((s) => s.phoneStatus === "missing").length,
    welcomeDue: students.filter((s) => s.welcomeDue).length,
    recapDue: students.filter((s) => s.recapDue).length,
    students,
    sends: loadParentSends().slice(0, 24),
  });
}
