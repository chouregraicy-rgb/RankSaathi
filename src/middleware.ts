// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const appUrl = "https://vidhyasaathi.online";

  // ── Build response + Supabase client correctly ─────────────────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // First pass: set on request (for downstream reads)
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          // Rebuild response ONCE with updated request
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          // Second pass: set on response (for browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() must be called BEFORE any other query
  // so the session refresh cookies are set properly
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiRoute   = pathname.startsWith("/api/");
  const isStatic     = pathname.startsWith("/_next/") || pathname.startsWith("/favicon") || pathname.startsWith("/icons");
  const isAuthRoute  = pathname.startsWith("/auth/");
  const isLinkPage   = pathname === "/parent/link";
  const isLanding    = pathname === "/";
  const isPublicPage = ["/privacy", "/terms", "/contact", "/pricing"].includes(pathname);

  if (isApiRoute || isStatic || isAuthRoute || isLinkPage || isPublicPage) {
    return response;
  }

  if (!user && !isLanding) {
    return NextResponse.redirect(new URL("/", appUrl));
  }

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? user.user_metadata?.role ?? "student";

    if (isLanding) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    }

    if (pathname.startsWith("/student/") && role !== "student") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    }
    if (pathname.startsWith("/parent/") && role !== "parent" && !isLinkPage) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    }
    if (pathname.startsWith("/admin/") && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    }

    // ── Subscription gate ───────────────────────────────────────────────
    const isStudentRoute = pathname.startsWith("/student/");
    const isExemptPage = [
      "/student/settings",
      "/student/dashboard",
    ].some((p) => pathname.startsWith(p));

    if (isStudentRoute && !isExemptPage && role === "student") {
      const { data: sub, error: subError } = await supabase
        .from("subscriptions")
        .select("status, expires_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      
      

      if (!sub) {
        return NextResponse.redirect(new URL("/pricing", appUrl));
      }

      // Extra safety: check expiry in JS (avoids timezone comparison bugs)
      if (new Date(sub.expires_at) < new Date()) {
        return NextResponse.redirect(new URL("/pricing", appUrl));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons).*)"],
};
