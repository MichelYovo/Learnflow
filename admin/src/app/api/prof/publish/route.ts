import { NextResponse } from "next/server";
import { normalizePayload } from "@/lib/prof";
import { requireAdmin } from "@/lib/requireAdmin";
import { upsertRow } from "@/lib/supabase";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const body = (await request.json()) as {
    class_level: string;
    subject_id: string;
    chapter_id: string;
    chapter_title: string;
    payload: unknown;
    publish_web?: boolean;
    publish_mobile?: boolean;
  };
  if (!body.chapter_id || !body.class_level) {
    return NextResponse.json({ error: "Classe et chapitre requis." }, { status: 400 });
  }
  const now = new Date().toISOString();
  const result = await upsertRow(
    "published_lessons",
    {
      class_level: body.class_level,
      subject_id: body.subject_id,
      chapter_id: body.chapter_id,
      chapter_title: body.chapter_title,
      payload: normalizePayload(body.payload),
      publish_web: Boolean(body.publish_web),
      publish_mobile: Boolean(body.publish_mobile),
      published_at: now,
      updated_at: now,
    },
    "class_level,chapter_id",
  );
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true, published: result.data });
}
