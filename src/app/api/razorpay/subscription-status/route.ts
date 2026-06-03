import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (!sub) return NextResponse.json({ subscribed: false, status: "none" });

  const now = new Date();
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;

  if (sub.status === "active" && periodEnd && periodEnd > now) {
    const daysLeft = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return NextResponse.json({
      subscribed: true,
      status: "active",
      plan_id: sub.plan_id,
      plan_type: sub.plan_type,
      current_period_end: sub.current_period_end,
      days_left: daysLeft,
    });
  }

  return NextResponse.json({ subscribed: false, status: "expired", plan_id: sub.plan_id });
}
