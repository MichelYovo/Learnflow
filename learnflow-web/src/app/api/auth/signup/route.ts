import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { handleEmailSignup } from "@/lib/server/authSecure";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const cors = corsHeaders(request);

  let body: {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    class_level?: string;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400, headers: cors });
  }

  const result = await handleEmailSignup({
    email: body.email ?? "",
    password: body.password ?? "",
    user_metadata: {
      first_name: (body.first_name ?? "").trim(),
      last_name: (body.last_name ?? "").trim(),
      class_level: (body.class_level ?? "").trim(),
    },
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400, headers: cors });
  }

  return NextResponse.json(
    { ok: true, userId: "userId" in result ? result.userId : undefined },
    { headers: cors },
  );
}
