import { NextResponse } from "next/server";
import { chatJson, extractPdfText } from "@/lib/ai";
import { normalizePayload, PROF_SYSTEM } from "@/lib/prof";
import { requireAdmin } from "@/lib/requireAdmin";
import { insertRow } from "@/lib/supabase";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const form = await request.formData();
  const file = form.get("file");
  const classLevel = String(form.get("class_level") || "3eme");
  const subjectId = String(form.get("subject_id") || "svt");
  const chapterId = String(form.get("chapter_id") || `ch-${Date.now()}`);
  const chapterTitle = String(form.get("chapter_title") || "Nouveau chapitre");
  let sourceText = String(form.get("text") || "");
  let sourceName = "texte";
  if (file instanceof File && file.size > 0) {
    sourceName = file.name;
    const buf = Buffer.from(await file.arrayBuffer());
    if (file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf")) {
      sourceText = extractPdfText(buf) || sourceText;
    } else {
      sourceText = buf.toString("utf8");
    }
  }
  if (sourceText.trim().length < 40) {
    return NextResponse.json({ error: "PDF ou texte trop court. Colle le cours ou envoie un PDF lisible." }, { status: 400 });
  }
  const user = `Classe: ${classLevel}. Matière: ${subjectId}. Chapitre: ${chapterTitle} (${chapterId}).
Cours source :
${sourceText.slice(0, 18000)}`;
  const ai = await chatJson(PROF_SYSTEM, user);
  if (ai.error && !ai.json) return NextResponse.json({ error: ai.error }, { status: 502 });
  const payload = normalizePayload(ai.json);
  const title = String((ai.json as { chapter_title?: string } | undefined)?.chapter_title || chapterTitle);
  const saved = await insertRow("course_drafts", {
    class_level: classLevel,
    subject_id: subjectId,
    chapter_id: chapterId,
    chapter_title: title,
    source_name: sourceName,
    payload,
    status: "draft",
  });
  if (!saved.ok) return NextResponse.json({ error: saved.error }, { status: 500 });
  const row = Array.isArray(saved.data) ? saved.data[0] : saved.data;
  return NextResponse.json({ ok: true, draft: row, warning: ai.error });
}
