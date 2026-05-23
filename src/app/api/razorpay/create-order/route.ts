/**
 * POST /api/razorpay/create-order
 * Creates a Razorpay order server-side.
 * Body: { amount, planId, userId }
 */
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, planId, userId } = await req.json();
    if (!amount || !planId || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency: "INR",
      receipt:  `vs_${userId.slice(0, 8)}_${Date.now()}`,
      notes:    { userId, planId },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (err: any) {
    console.error("[razorpay/create-order]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
