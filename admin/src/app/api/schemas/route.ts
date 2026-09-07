import { NextResponse } from "next/server";
import { chatJson } from "@/lib/ai";
import { requireAdmin } from "@/lib/requireAdmin";
import { insertRow } from "@/lib/supabase";

const SYSTEM = `Tu analyses un schéma pédagogique (SVT/PCT/maths). Réponds en JSON :
{"title":string,"subtitle":string,"parts":[{"id":string,"label":string,"role":string,"x":number,"y":number}]}
x et y sont des pourcentages 5–95 de la position du libellé sur l’image. 6 à 12 pastilles. Français simple.`;

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const secretKey = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!secretKey) return NextResponse.json({ models: [] });
  const res = await fetch(`${supabaseUrl}/rest/v1/schema_models?select=*&order=created_at.desc`, {
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json({ models: [], error: await res.text() });
  return NextResponse.json({ models: await res.json() });
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const form = await request.formData();
  const file = form.get("file");
  const classLevel = String(form.get("class_level") || "3eme");
  const chapterId = String(form.get("chapter_id") || "schema");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Envoie une image du schéma." }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "image/jpeg";
  const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
  const ai = await chatJson(SYSTEM, `Classe ${classLevel}, chapitre ${chapterId}. Propose les pastilles du schéma.`, dataUrl);
  const parsed = (ai.json ?? {}) as {
    title?: string;
    subtitle?: string;
    parts?: { id: string; label: string; role: string; x: number; y: number }[];
  };
  const parts = Array.isArray(parsed.parts)
    ? parsed.parts.map((p, i) => ({
        id: String(p.id || `p${i + 1}`),
        label: String(p.label || `Zone ${i + 1}`),
        role: String(p.role || ""),
        x: Math.min(95, Math.max(5, Number(p.x) || 50)),
        y: Math.min(95, Math.max(5, Number(p.y) || 50)),
      }))
    : [];
  const saved = await insertRow("schema_models", {
    class_level: classLevel,
    chapter_id: chapterId,
    title: parsed.title || file.name.replace(/\.[^.]+$/, ""),
    subtitle: parsed.subtitle || "Schéma annoté",
    image_url: dataUrl,
    parts,
    publish_web: false,
    publish_mobile: false,
  });
  if (!saved.ok) return NextResponse.json({ error: saved.error, warning: ai.error }, { status: 500 });
  return NextResponse.json({ ok: true, model: Array.isArray(saved.data) ? saved.data[0] : saved.data, warning: ai.error });
}
