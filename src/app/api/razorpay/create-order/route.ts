import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PRICES: Record<string, number> = {
  student_monthly:  99,
  student_yearly:  799,
  family_monthly:  149,
  family_yearly:  1199,
};

const COUPONS: Record<string, number> = {
  VIDYASAATHI2026: 100, // 100% off
  TESTER7DAYS:     100,
  LAUNCH50:         50, // 50% off
};

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, coupon } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json({ error: "Missing plan or userId" }, { status: 400 });
    }

    const baseAmount = PRICES[plan];
    if (!baseAmount) {
      return NextResponse.json({ error: "Invalid plan: " + plan }, { status: 400 });
    }

    // Apply coupon discount
    const discountPct = coupon ? (COUPONS[coupon.toUpperCase()] ?? 0) : 0;
    const finalAmount = Math.round(baseAmount * (1 - discountPct / 100));

    // Free order (100% coupon)
    if (finalAmount === 0) {
      return NextResponse.json({
        orderId: `free_${Date.now()}`,
        amount:  0,
        free:    true,
      });
    }

    const order = await razorpay.orders.create({
      amount:   finalAmount * 100, // paise
      currency: "INR",
      receipt:  `vs_${userId.slice(0, 8)}_${Date.now()}`,
      notes:    { userId, plan },
    });

    return NextResponse.json({
      orderId: order.id,
      amount:  finalAmount * 100, // paise for Razorpay modal
      free:    false,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
