// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  // ✅ Use x-forwarded-host (set by Render's proxy) to get the real public URL
  
  const appUrl = "https://VidyaSaathi.onrender.com";
    

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isApiRoute  = pathname.startsWith("/api/");
  const isStatic    = pathname.startsWith("/_next/") || pathname.startsWith("/favicon") || pathname.startsWith("/icons");
  const isAuthRoute = pathname.startsWith("/auth/");
  const isLinkPage  = pathname === "/parent/link";
  const isLanding   = pathname === "/";

  if (isApiRoute || isStatic || isAuthRoute || isLinkPage) return response;

  if (!user && !isLanding) return NextResponse.redirect(new URL("/", appUrl));

  if (user) {
    const metaRole = user.user_metadata?.role;
    const { data: profile, error: profileError } = await supabase
      .from("users").select("role").eq("id", user.id).single();
    const dbRole = profile?.role;

    console.log("=== MIDDLEWARE DEBUG ===");
    console.log("User ID:", user.id);
    console.log("appUrl:", appUrl);
    console.log("Meta role:", metaRole);
    console.log("DB role:", dbRole);
    console.log("DB error:", profileError?.message);

    const role = dbRole ?? metaRole ?? "student";
    console.log("Final role:", role);

    if (isLanding) return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    if (pathname.startsWith("/student/") && role !== "student") return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    if (pathname.startsWith("/parent/") && role !== "parent" && !isLinkPage) return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
    if (pathname.startsWith("/admin/") && role !== "admin") return NextResponse.redirect(new URL(`/${role}/dashboard`, appUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons).*)"],
};
