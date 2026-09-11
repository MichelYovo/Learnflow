import { NextResponse, type NextRequest } from "next/server";
import { parseSessionToken, SESSION_COOKIE } from "@/lib/auth";

function isPublicPath(pathname: string) {
  if (pathname === "/login") return true;
  if (pathname === "/api/auth/login") return true;
  if (pathname === "/api/auth/logout") return true;
  if (pathname.startsWith("/api/public/")) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname)) return NextResponse.next();

  const needsGate = pathname.startsWith("/dashboard") || pathname.startsWith("/api/");
  if (!needsGate) return NextResponse.next();

  let ok = false;
  try {
    ok = Boolean(parseSessionToken(request.cookies.get(SESSION_COOKIE)?.value));
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
