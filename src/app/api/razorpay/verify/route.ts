import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_DURATIONS: Record<string, number> = {
  student_monthly: 30,
  student_yearly:  365,
  family_monthly:  30,
  family_yearly:   365,
};

const PLAN_TYPES: Record<string, string> = {
  student_monthly: "student",
  student_yearly:  "student",
  family_monthly:  "family",
  family_yearly:   "family",
};

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      plan_id,
    } = await req.json();

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Activate subscription
    const durationDays = PLAN_DURATIONS[plan_id] || 30;
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + durationDays);

    const { error: subError } = await supabase.from("subscriptions").upsert({
      user_id,
      plan_id,
      plan_type: PLAN_TYPES[plan_id] || "student",
      status: "active",
      razorpay_order_id,
      razorpay_payment_id,
      current_period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (subError) throw subError;

    await supabase.from("payment_logs").insert({
      user_id,
      razorpay_order_id,
      razorpay_payment_id,
      plan_id,
      status: "success",
    });

    return NextResponse.json({ success: true, period_end: periodEnd.toISOString() });
  } catch (err: any) {
    console.error("verify error:", err);
    return NextResponse.json({ error: err.message || "Verification failed" }, { status: 500 });
  }
}
