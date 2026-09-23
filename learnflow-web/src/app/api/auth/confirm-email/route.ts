import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { rateLimited } from "@/lib/server/authRateLimit";
import { confirmUnconfirmedPassword } from "@/lib/server/authSecure";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const cors = corsHeaders(request);
  if (rateLimited("confirm-email", request, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans un moment." },
      { status: 429, headers: cors },
    );
  }
  let body: { email?: string; password?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400, headers: cors });
  }

  const result = await confirmUnconfirmedPassword(body.email ?? "", body.password ?? "");
  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400, headers: cors });
  }
  return NextResponse.json({ ok: true }, { headers: cors });
}
