/**
 * GET /api/subscription/status
 * Returns the active subscription for the logged-in user.
 * Reads Bearer token from Authorization header.
 *
 * Column names used (matching your actual DB):
 *   plan_id | status | started_at | expires_at | amount
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_LABELS: Record<string, string> = {
  student_monthly: "Student Monthly",
  student_yearly:  "Student Yearly",
  family_monthly:  "Family Monthly",
  family_yearly:   "Family Yearly",
  trial:           "7-Day Free Trial",
};

export async function GET(req: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const token = req.headers.get("authorization")?.replace("Bearer ", "").trim();
    if (!token) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    // ── Fetch active, non-expired subscription ────────────────────────────────
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("plan_id, status, started_at, expires_at, amount")
      .eq("user_id", user.id)
      .eq("status", "active")
      .gte("expires_at", now)          // ← correct column name
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[subscription/status] DB error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ subscription: null, isTrial: false });
    }

    return NextResponse.json({
      subscription: {
        ...data,
        plan_name: PLAN_LABELS[data.plan_id] ?? data.plan_id,
      },
      isTrial: data.plan_id === "trial",
    });
  } catch (err: any) {
    console.error("[subscription/status] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
