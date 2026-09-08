import { NextResponse } from "next/server";
import {
  handleLoginNotice,
  handleSendOtp,
  handleVerifyOtp,
  userFromBearer,
  type AuthPlatform,
  type SecureAction,
} from "@/lib/server/authSecure";

export const runtime = "nodejs";

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

  let body: {
    action?: SecureAction;
    token?: string;
    platform?: AuthPlatform;
    event?: string;
    force?: boolean | string;
    create_user?: boolean | string;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400, headers: cors });
  }

  const platform: AuthPlatform = body.platform === "mobile" ? "mobile" : "web";

  if (body.action === "send-otp") {
    const result = await handleSendOtp(
      user,
      body.force === true || body.force === "true",
      body.create_user === true || body.create_user === "true",
    );
    if ("error" in result && result.error) {
      const status = "status" in result ? (result.status ?? 400) : 400;
      const retryAfterSeconds = "retryAfterSeconds" in result ? result.retryAfterSeconds : undefined;
      return NextResponse.json({ error: result.error, retryAfterSeconds }, { status, headers: cors });
    }
    return NextResponse.json(result, { headers: cors });
  }

  if (body.action === "verify-otp") {
    const result = await handleVerifyOtp(user, body.token ?? "");
    if ("error" in result && result.error) {
      const status = "status" in result ? (result.status ?? 400) : 400;
      return NextResponse.json(
        {
          error: result.error,
          attemptsLeft: "attemptsLeft" in result ? result.attemptsLeft : undefined,
          retryAfterSeconds: "retryAfterSeconds" in result ? result.retryAfterSeconds : undefined,
        },
        { status, headers: cors },
      );
    }
    return NextResponse.json(result, { headers: cors });
  }

  if (body.action === "login-notice") {
    const result = await handleLoginNotice(user, { platform, event: body.event });
    return NextResponse.json(result, { headers: cors });
  }

  return NextResponse.json({ error: "Action inconnue." }, { status: 400, headers: cors });
}
