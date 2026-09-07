import { NextResponse } from "next/server";
import {
  handleLoginNotice,
  handleSendOtp,
  handleVerifyOtp,
  userFromBearer,
  type AuthPlatform,
  type SecureAction,
} from "@/lib/server/authSecure";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

export async function POST(request: Request) {
  const user = await userFromBearer(request.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "Session expirée. Reconnecte-toi." }, { status: 401, headers: cors });
  }

  let body: { action?: SecureAction; token?: string; platform?: AuthPlatform; event?: string; force?: boolean | string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400, headers: cors });
  }

  const platform: AuthPlatform = body.platform === "mobile" ? "mobile" : "web";

  if (body.action === "send-otp") {
    const result = await handleSendOtp(user, body.force === true || body.force === "true");
    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status ?? 400, headers: cors });
    }
    return NextResponse.json(result, { headers: cors });
  }

  if (body.action === "verify-otp") {
    const result = await handleVerifyOtp(user, body.token ?? "");
    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status ?? 400, headers: cors });
    }
    return NextResponse.json(result, { headers: cors });
  }

  if (body.action === "login-notice") {
    const result = await handleLoginNotice(user, { platform, event: body.event });
    return NextResponse.json(result, { headers: cors });
  }

  return NextResponse.json({ error: "Action inconnue." }, { status: 400, headers: cors });
}
