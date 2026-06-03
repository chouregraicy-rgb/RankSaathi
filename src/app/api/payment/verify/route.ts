/**
 * POST /api/payment/verify
 *
 * Verifies Razorpay HMAC signature, then upserts into `subscriptions`.
 * Skips HMAC for 100%-off coupon orders (order_id starts with "free_").
 *
 * Column names match your actual DB:
 *   user_id | plan_id | payment_id | order_id | amount | status | started_at | expires_at
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_CONFIG: Record<string, { label: string; durationDays: number; priceINR: number }> = {
  student_monthly: { label: "Student Monthly",  durationDays: 30,  priceINR: 99   },
  student_yearly:  { label: "Student Yearly",   durationDays: 365, priceINR: 799  },
  family_monthly:  { label: "Family Monthly",   durationDays: 30,  priceINR: 149  },
  family_yearly:   { label: "Family Yearly",    durationDays: 365, priceINR: 1199 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      userId,
      isFree,
    } = body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !plan || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const planConfig = PLAN_CONFIG[plan];
    if (!planConfig) {
      return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    // ── Verify HMAC (skip for free/coupon orders) ─────────────────────────────
    const isFreeOrder = isFree === true || String(razorpay_order_id).startsWith("free_");

    if (!isFreeOrder) {
      if (!razorpay_signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
      }
      const expectedSig = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSig !== razorpay_signature) {
        console.warn("[payment/verify] Signature mismatch for user", userId);
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }
    }

    // ── Calculate expiry ──────────────────────────────────────────────────────
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + planConfig.durationDays);

    // ── Upsert subscription (YOUR actual column names) ────────────────────────
    const { error: upsertErr } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id:    userId,
          plan_id:    plan,
          payment_id: isFreeOrder ? null : razorpay_payment_id,
          order_id:   isFreeOrder ? null : razorpay_order_id,
          amount:     isFreeOrder ? 0 : planConfig.priceINR,
          status:     "active",
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertErr) {
      console.error("[payment/verify] DB upsert error:", upsertErr);
      return NextResponse.json({ error: upsertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success:   true,
      planLabel: planConfig.label,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: any) {
    console.error("[payment/verify] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
