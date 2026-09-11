import { NextResponse } from "next/server";
import { loadDashboardData } from "@/lib/catalog";
import { recordParentSend } from "@/lib/parentNotify";
import { requireAdmin } from "@/lib/requireAdmin";
import { insertLoginNotice } from "@/lib/supabase";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const body = (await request.json()) as {
    studentId?: string;
    name?: string;
    phone?: string;
    event?: "parent_welcome" | "weekly_recap";
  };
  if (!body.studentId || !body.event) {
    return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
  }
  const data = await loadDashboardData();
  const student = data.students.find((s) => s.id === body.studentId);
  recordParentSend({
    studentId: body.studentId,
    name: body.name || student?.name || "Élève",
    phone: body.phone || student?.parentPhone || "",
    event: body.event,
    status: "sent",
    detail: "wa.me",
  });
  await insertLoginNotice({
    student_id: body.studentId,
    channel: "whatsapp",
    event: body.event,
    status: "sent",
    detail: "wa.me",
  });
  return NextResponse.json({ ok: true });
}
