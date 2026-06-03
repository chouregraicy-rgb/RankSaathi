import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLANS: Record<string, { amount: number; name: string; duration_days: number; plan_type: string }> = {
  student_monthly: { amount: 9900,   name: "Student Monthly",  duration_days: 30,  plan_type: "student" },
  student_yearly:  { amount: 79900,  name: "Student Yearly",   duration_days: 365, plan_type: "student" },
  family_monthly:  { amount: 14900,  name: "Family Monthly",   duration_days: 30,  plan_type: "family"  },
  family_yearly:   { amount: 119900, name: "Family Yearly",    duration_days: 365, plan_type: "family"  },
};

const DEMO_COUPON = "DEMO2025";

export async function POST(req: NextRequest) {
  try {
    const { plan_id, coupon_code, user_id } = await req.json();

    if (!plan_id || !PLANS[plan_id]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = PLANS[plan_id];

    // ── Demo coupon → 100% off → activate directly, skip Razorpay ────────────
    if (coupon_code?.toUpperCase().trim() === DEMO_COUPON) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("id, is_active")
        .eq("code", DEMO_COUPON)
        .single();

      if (!coupon?.is_active) {
        return NextResponse.json({ error: "Demo code is not active" }, { status: 400 });
      }

      const demoEnd = new Date();
      demoEnd.setDate(demoEnd.getDate() + 30);

      await supabase.from("subscriptions").upsert({
        user_id,
        plan_id,
        plan_type: plan.plan_type,
        status: "active",
        current_period_end: demoEnd.toISOString(),
        coupon_id: coupon.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      await supabase.from("payment_logs").insert({
        user_id,
        plan_id,
        status: "demo",
        coupon_code: DEMO_COUPON,
        razorpay_order_id: null,
        razorpay_payment_id: null,
      });

      return NextResponse.json({ demo_activated: true, period_end: demoEnd.toISOString() });
    }

    // ── Normal paid flow → create Razorpay order ─────────────────────────────
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: "INR",
      receipt: `vs_${user_id?.slice(0, 8)}_${Date.now()}`,
      notes: { plan_id, user_id: user_id || "" },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: plan.amount,
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY_ID,
      plan_name: plan.name,
    });
  } catch (err: any) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: err.message || "Order creation failed" }, { status: 500 });
  }
}
