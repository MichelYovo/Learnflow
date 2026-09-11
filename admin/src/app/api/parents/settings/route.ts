import { NextResponse } from "next/server";
import { loadParentSettings, saveParentSettings, type ParentCadenceDays } from "@/lib/parentNotify";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  return NextResponse.json(loadParentSettings());
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const body = (await request.json()) as { cadenceDays?: number };
  const cadenceDays: ParentCadenceDays = body.cadenceDays === 7 ? 7 : 14;
  return NextResponse.json(saveParentSettings(cadenceDays));
}
