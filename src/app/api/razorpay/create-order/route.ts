import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", planId, userId } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId,
        userId,
      },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}