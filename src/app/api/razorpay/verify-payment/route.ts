/**
 * POST /api/razorpay/verify-payment
 * Verifies Razorpay signature and saves subscription to DB.
 *
 * Body:
 *   razorpay_order_id, razorpay_payment_id, razorpay_signature
 *   planId, userId, amount, couponCode?
 *   trialDays? (for trial coupons)
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Plan duration mapping
const PLAN_DURATION: Record<string, number> = {
  student_monthly:  30,
  student_yearly:   365,
  family_monthly:   30,
  family_yearly:    365,
  student_monthly_trial: 3,
  student_yearly_trial:  3,
  family_monthly_trial:  3,
  family_yearly_trial:   3,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      userId,
      amount,
      couponCode,
      trialDays,
    } = body;

    if (!planId || !userId) {
      return NextResponse.json({ error: "Missing planId or userId" }, { status: 400 });
    }

    // ── Verify signature (skip for free/trial orders) ─────────────────────
    const isFree = String(razorpay_order_id).startsWith("free_") ||
                   String(razorpay_order_id).startsWith("trial_") ||
                   amount === 0;

    if (!isFree) {
      if (!razorpay_signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
      }
      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expected !== razorpay_signature) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }
    }

    // ── Calculate expiry ──────────────────────────────────────────────────
    const now = new Date();
    const expiresAt = new Date(now);
    const days = trialDays ?? PLAN_DURATION[planId] ?? 30;
    expiresAt.setDate(expiresAt.getDate() + days);

    // ── Upsert subscription ───────────────────────────────────────────────
    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id:    userId,
          plan_id:    planId,
          payment_id: isFree ? null : razorpay_payment_id,
          order_id:   isFree ? null : razorpay_order_id,
          amount:     amount ?? 0,
          status:     "active",
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("[razorpay/verify-payment] DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, expiresAt: expiresAt.toISOString() });
  } catch (err: any) {
    console.error("[razorpay/verify-payment]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
