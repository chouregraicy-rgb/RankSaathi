// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const appUrl = "https://vidhyasaathi.online";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isApiRoute   = pathname.startsWith("/api/");
  const isStatic     = pathname.startsWith("/_next/") || pathname.startsWith("/favicon") || pathname.startsWith("/icons");
  const isAuthRoute  = pathname.startsWith("/auth/");
  const isLinkPage   = pathname === "/parent/link";
  const isLanding    = pathname === "/";
  const isPublicPage = ["/privacy", "/terms", "/contact", "/pricing"].includes(pathname);

  // ── Always allow: API, static, auth, public pages ─────────────────────
  if (isApiRoute || isStatic || isAuthRoute || isLinkPage || isPublicPage) {
    return response;
  }

  // ── Not logged in → landing ────────────────────────────────────────────
  if (!user && !isLanding) {
    return NextResponse.redirect(new URL("/", appUrl));
  }

  if (user) {
    // ── Role check ───────────────────────────────────────────────────────
    const { data: profile } = await supabase
      .from("users").select("role").eq("id", user.id).single();
    const role = profile?.role ?? user.user_metadata?.role ?? "student";

    // Redirect landing → dashboard
    if (isLanding) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    }

    // Wrong role → correct dashboard
    if (pathname.startsWith("/student/") && role !== "student") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    }
    if (pathname.startsWith("/parent/") && role !== "parent" && !isLinkPage) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    }
    if (pathname.startsWith("/admin/") && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    }

    // ── Subscription gate (students only) ────────────────────────────────
    // Only check for student routes, skip settings & pricing-adjacent pages
    const isStudentRoute = pathname.startsWith("/student/");
    const isExemptPage   = [
      "/student/settings",
      "/student/dashboard",  // allow dashboard so they see the upgrade prompt
    ].some(p => pathname.startsWith(p));

    if (isStudentRoute && !isExemptPage && role === "student") {
      const now = new Date().toISOString();
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, expires_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .gte("expires_at", now)
        .limit(1)
        .maybeSingle();

      if (!sub) {
        // No active subscription → redirect to pricing
        return NextResponse.redirect(new URL("/pricing", appUrl));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons).*)"],
};

