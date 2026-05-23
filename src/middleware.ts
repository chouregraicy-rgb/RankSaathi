// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
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

  // Public routes — always accessible
  const publicPaths = ["/", "/auth/callback", "/parent/link"];
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith("/auth/"));
  const isApiRoute = pathname.startsWith("/api/");
  const isStatic = pathname.startsWith("/_next/") || pathname.startsWith("/favicon");

  if (isApiRoute || isStatic) return response;

  // Not logged in — redirect to landing
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Logged in — redirect away from landing page
  if (user && pathname === "/") {
    const role = user.user_metadata?.role ?? "student";
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }

  // Role protection — student can't access /parent/* and vice versa
  if (user) {
    const role = user.user_metadata?.role ?? "student";

    if (pathname.startsWith("/student/") && role !== "student") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    if (pathname.startsWith("/parent/") && role !== "parent") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    if (pathname.startsWith("/admin/") && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons).*)",
  ],
};

