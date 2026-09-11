import { NextResponse } from "next/server";
import { chatJson, extractPdfText } from "@/lib/ai";
import { validateUploadBuffer } from "@/lib/files";
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
  let imageDataUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    sourceName = file.name || "fichier";
    const buf = Buffer.from(await file.arrayBuffer());
    const sniffed = validateUploadBuffer(buf, ["pdf", "image", "text"]);
    if (sniffed.error) return NextResponse.json({ error: sniffed.error }, { status: 400 });
    if (sniffed.kind === "pdf") {
      sourceText = extractPdfText(buf) || sourceText;
    } else if (sniffed.kind === "image") {
      const mime = file.type.startsWith("image/") ? file.type : "image/jpeg";
      imageDataUrl = `data:${mime};base64,${buf.toString("base64")}`;
    } else {
      sourceText = buf.toString("utf8");
    }
  }
  if (!imageDataUrl && sourceText.trim().length < 40) {
    return NextResponse.json({ error: "PDF, image ou texte trop court. Dépose un fichier ou colle le cours." }, { status: 400 });
  }
  const user = imageDataUrl
    ? `Classe: ${classLevel}. Matière: ${subjectId}. Chapitre: ${chapterTitle} (${chapterId}).
Lis cette image de cours (photo, capture, fiche) et produis le JSON pédagogique.
${sourceText.trim() ? `Texte collé en complément :\n${sourceText.slice(0, 4000)}` : ""}`
    : `Classe: ${classLevel}. Matière: ${subjectId}. Chapitre: ${chapterTitle} (${chapterId}).
Cours source :
${sourceText.slice(0, 18000)}`;
  const ai = await chatJson(PROF_SYSTEM, user, imageDataUrl);
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
