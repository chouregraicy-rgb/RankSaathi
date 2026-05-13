// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_URL = "https://ranksaathi.onrender.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
      await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: user.user_metadata?.role || "student",
      }, { onConflict: "id" });
    }

    if (!error && data.user) {
      const role = data.user.user_metadata?.role ?? "student";
      const hasProfile = !!data.user.user_metadata?.full_name;
      if (!hasProfile) {
        return NextResponse.redirect(`${APP_URL}/auth?tab=signup&step=onboard`);
      }
      return NextResponse.redirect(`${APP_URL}/${role}/dashboard`);
    }
  }

  return NextResponse.redirect(`${APP_URL}/?error=callback_failed`);
}