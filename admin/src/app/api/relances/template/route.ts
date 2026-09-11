import { NextResponse } from "next/server";
import { loadRelanceTemplate, saveRelanceTemplate } from "@/lib/relance";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  return NextResponse.json(loadRelanceTemplate());
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const body = (await request.json()) as { subject?: string; body?: string };
  if (!body.body?.trim()) {
    return NextResponse.json({ error: "Le message automatique est vide." }, { status: 400 });
  }
  const saved = saveRelanceTemplate({
    subject: body.subject?.trim() || "Reviens continuer sur LearnFlow",
    body: body.body,
  });
  return NextResponse.json(saved);
}
