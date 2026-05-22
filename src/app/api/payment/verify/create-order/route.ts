/**
 * POST /api/payment/create-order
 * Creates a Razorpay order and returns the orderId + final amount.
 * Body: { plan, userId, coupon? }
 */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Prices in paise (INR × 100)
const PLAN_PRICES: Record<string, number> = {
  student_monthly:  9900,
  student_yearly:   79900,
  family_monthly:   14900,
  family_yearly:    119900,
};

// Coupon discounts
const COUPONS: Record<string, { discountPct: number }> = {
  VIDYASAATHI2026: { discountPct: 20 },
  LAUNCH50:        { discountPct: 50 },
  GRAICY100:       { discountPct: 100 },
};

function applyDiscount(basePaise: number, coupon?: string): number {
  if (!coupon) return basePaise;
  const c = COUPONS[coupon.toUpperCase()];
  if (!c) return basePaise;
  return Math.round(basePaise * (1 - c.discountPct / 100));
}

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, coupon } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json({ error: "Missing plan or userId" }, { status: 400 });
    }

    const baseAmount = PLAN_PRICES[plan];
    if (baseAmount === undefined) {
      return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    const finalAmount = applyDiscount(baseAmount, coupon);

    // 100% coupon — skip Razorpay, return synthetic order ID
    if (finalAmount === 0) {
      return NextResponse.json({ orderId: `free_${userId}_${Date.now()}`, free: true, amount: 0 });
    }

    const order = await razorpay.orders.create({
      amount:   finalAmount,
      currency: "INR",
      receipt:  `vs_${userId.slice(0, 8)}_${Date.now()}`,
      notes:    { userId, plan, coupon: coupon || "" },
    });

    return NextResponse.json({ orderId: order.id, amount: finalAmount, free: false });
  } catch (err: any) {
    console.error("[payment/create-order] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
