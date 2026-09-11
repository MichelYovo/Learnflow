import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth is client-side (AuthGuard + Zustand). The edge proxy must not call
 * Supabase or rewrite RSC headers — that returns 422 and trips error.tsx.
 */
export function proxy(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
