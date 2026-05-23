import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DAYS: Record<string, number> = {
  student_monthly:  30,
  student_yearly:  365,
  family_monthly:   30,
  family_yearly:   365,
};

const PLAN_LABELS: Record<string, string> = {
  student_monthly: "Student Monthly",
  student_yearly:  "Student Yearly",
  family_monthly:  "Family Monthly",
  family_yearly:   "Family Yearly",
};

// TESTER7DAYS gives 7-day trial
const COUPON_DAYS: Record<string, number> = {
  TESTER7DAYS: 7,
};

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      userId,
      coupon,
      isFree,
    } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json({ error: "Missing plan or userId" }, { status: 400 });
    }

    // Verify HMAC signature for paid orders
    if (!isFree) {
      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expected !== razorpay_signature) {
        return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
      }
    }

    const now = new Date();
    const expiresAt = new Date(now);

    // Special coupon overrides duration
    const couponKey = coupon?.toUpperCase();
    const days = (couponKey && COUPON_DAYS[couponKey]) ?? DAYS[plan] ?? 30;
    expiresAt.setDate(expiresAt.getDate() + days);

    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id:    userId,
          plan_id:    plan,
          payment_id: isFree ? null : razorpay_payment_id,
          order_id:   isFree ? null : razorpay_order_id,
          amount:     isFree ? 0 : undefined,
          status:     "active",
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success:   true,
      planLabel: PLAN_LABELS[plan] ?? plan,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
