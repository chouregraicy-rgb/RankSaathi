// src/app/api/razorpay/subscription-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ subscribed: false, status: "none" });

  try {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (!sub) {
      return NextResponse.json({ subscribed: false, status: "none" });
    }

    const now = new Date();
    const expiresAt = new Date(sub.expires_at);
    const isActive = expiresAt > now;

    if (!isActive) {
      return NextResponse.json({ subscribed: false, status: "expired" });
    }

    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isLifetime = daysLeft > 3000;

    return NextResponse.json({
      subscribed: true,
      status: "active",
      plan_id: sub.plan_id,
      plan_type: sub.plan_id?.includes("family") ? "family" : "student",
      days_left: isLifetime ? 99999 : daysLeft,
      current_period_end: sub.expires_at,
    });
  } catch (err: any) {
    console.error("[subscription-status]", err);
    return NextResponse.json({ subscribed: false, status: "none" });
  }
}
