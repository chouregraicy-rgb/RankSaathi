/**
 * POST /api/trial/activate
 * Called once after signup. Inserts a 3-day trial row into `subscriptions`.
 * Uses your actual column names: plan_id, expires_at (not ends_at).
 * No-ops if the user already has any subscription row.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TRIAL_DAYS = 3;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "").trim();
    if (!token) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    // Already has a subscription? Skip.
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ skipped: true, message: "Already has subscription" });
    }

    // Insert 3-day trial
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + TRIAL_DAYS);

    const { error: insertErr } = await supabase.from("subscriptions").insert({
      user_id:    user.id,
      plan_id:    "trial",
      payment_id: null,
      order_id:   null,
      amount:     0,
      status:     "active",
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    if (insertErr) {
      console.error("[trial/activate] Insert error:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success:   true,
      expiresAt: expiresAt.toISOString(),
      message:   `Trial active until ${expiresAt.toLocaleDateString("en-IN")}`,
    });
  } catch (err: any) {
    console.error("[trial/activate] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}