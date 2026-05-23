import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
export async function POST(req: NextRequest) {
  try {
    const { amount, planId, userId } = await req.json();
    const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt: `vs_${userId.slice(0,8)}_${Date.now()}`, notes: { userId, planId } });
    return NextResponse.json({ orderId: order.id });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
