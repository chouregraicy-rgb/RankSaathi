import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      userId,
      amount,
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update user subscription in Supabase
    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: userId,
        plan_id: planId,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount,
        status: "active",
        started_at: new Date().toISOString(),
        expires_at: getExpiryDate(planId),
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

function getExpiryDate(planId: string): string {
  const now = new Date();
  if (planId.includes("yearly")) {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setMonth(now.getMonth() + 1);
  }
  return now.toISOString();
}