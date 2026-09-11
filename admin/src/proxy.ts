import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "lf_admin_session";

function isPublicPath(pathname: string) {
  if (pathname === "/login") return true;
  if (pathname === "/api/auth/login") return true;
  if (pathname === "/api/auth/logout") return true;
  if (pathname.startsWith("/api/public/")) return true;
  return false;
}

function encoder() {
  return new TextEncoder();
}

function toBase64Url(bytes: ArrayBuffer) {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  return atob(padded);
}

function timingEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function validAdminCookie(token: string | undefined, secret: string) {
  if (!token || secret.length < 16) return false;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = toBase64Url(await crypto.subtle.sign("HMAC", key, encoder().encode(payloadB64)));
  if (!timingEqual(signature, expected)) return false;
  try {
    const session = JSON.parse(fromBase64Url(payloadB64)) as { exp?: number };
    return typeof session.exp === "number" && session.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname)) return NextResponse.next();

  const needsGate = pathname.startsWith("/dashboard") || pathname.startsWith("/api/");
  if (!needsGate) return NextResponse.next();

  let ok = false;
  try {
    const secret = (process.env.ADMIN_SESSION_SECRET ?? "").trim();
    ok = await validAdminCookie(request.cookies.get(SESSION_COOKIE)?.value, secret);
  } catch {
    ok = false;
  }
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }
  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.search = "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
