import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function supabaseEnv() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const anon = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).trim();
  const ok =
    /^https?:\/\//i.test(url) &&
    !url.includes("YOUR_PROJECT_REF") &&
    anon.length > 0 &&
    !anon.startsWith("sb_secret_");
  return ok ? { url, anon } : null;
}

function isPublicPath(pathname: string) {
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") return true;
  if (pathname === "/splash" || pathname === "/onboarding" || pathname === "/otp") return true;
  if (pathname.startsWith("/auth/")) return true;
  return false;
}

function isInternalNextRequest(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.startsWith("/_next/")) return true;
  if (searchParams.has("_rsc")) return true;
  if (request.headers.get("rsc") === "1") return true;
  if (request.headers.get("next-router-prefetch")) return true;
  if (request.headers.get("next-router-segment-prefetch")) return true;
  if (request.headers.get("next-router-state-tree")) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  // Skip RSC / prefetch: a broad matcher + getUser() was returning 422 on /app.
  if (isPublicPath(request.nextUrl.pathname) || isInternalNextRequest(request)) {
    return NextResponse.next();
  }

  const env = supabaseEnv();
  if (!env) return NextResponse.next();

  try {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(env.url, env.anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("auth-timeout")), 2500);
      }),
    ]);
    return response;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
