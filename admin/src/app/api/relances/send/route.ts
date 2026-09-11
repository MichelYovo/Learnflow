import { NextResponse } from "next/server";
import type { AdminStudent } from "@/data/seed";
import { loadDashboardData } from "@/lib/catalog";
import { daysSince, inactiveStudents, weeksLabel, type InactiveStudent } from "@/lib/inactivity";
import { isMailConfigured, sendStudentEmail } from "@/lib/mail";
import {
  continueLink,
  filledRelance,
  loadRelanceTemplate,
  recordRelanceSend,
} from "@/lib/relance";
import { requireAdmin } from "@/lib/requireAdmin";

function asInactive(student: AdminStudent): InactiveStudent {
  const inactiveDays = daysSince(student.lastSeenAt || student.createdAt);
  return { ...student, inactiveDays, absenceLabel: weeksLabel(inactiveDays) };
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "Configure SMTP ou RESEND_API_KEY dans admin/.env.local pour envoyer les mails." },
      { status: 400 },
    );
  }

  const body = (await request.json()) as {
    studentIds?: string[];
    subject?: string;
    body?: string;
  };
  const data = await loadDashboardData();
  const inactifs = inactiveStudents(data.students, data.events);
  const allById = new Map(data.students.map((s) => [s.id, s]));
  const wanted = (body.studentIds?.length ? body.studentIds : inactifs.map((s) => s.id))
    .map((id) => inactifs.find((s) => s.id === id) ?? allById.get(id))
    .filter((s): s is AdminStudent => Boolean(s))
    .map(asInactive);

  if (!wanted.length) {
    return NextResponse.json({ error: "Aucun élève à relancer." }, { status: 400 });
  }

  const template = loadRelanceTemplate();
  const link = continueLink();
  const sent: { id: string; name: string; email: string }[] = [];
  const skipped: { id: string; name: string; reason: string }[] = [];

  for (const student of wanted) {
    if (!student.email) {
      skipped.push({ id: student.id, name: student.name, reason: "Pas d’email" });
      continue;
    }
    const filled = filledRelance(student, template);
    const subject = body.subject?.trim() || filled.subject;
    const text = body.body?.trim() || filled.body;
    const mail = await sendStudentEmail({ to: student.email, subject, body: text, link });
    if (!mail.ok) {
      skipped.push({ id: student.id, name: student.name, reason: mail.error || "Envoi impossible" });
      continue;
    }
    recordRelanceSend({
      studentId: student.id,
      email: student.email,
      name: student.name,
      subject,
      via: mail.via,
    });
    sent.push({ id: student.id, name: student.name, email: student.email });
  }

  return NextResponse.json({ sent, skipped, link });
}
