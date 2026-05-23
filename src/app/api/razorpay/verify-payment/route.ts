import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const DAYS: Record<string, number> = { student_monthly:30, student_yearly:365, family_monthly:30, family_yearly:365 };
export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, userId, amount, trialDays } = await req.json();
    const isFree = !razorpay_order_id || String(razorpay_order_id).startsWith("free_") || String(razorpay_order_id).startsWith("trial_") || amount === 0;
    if (!isFree && razorpay_signature) {
      const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
      if (expected !== razorpay_signature) return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + (trialDays ?? DAYS[planId] ?? 30));
    const { error } = await supabase.from("subscriptions").upsert({ user_id: userId, plan_id: planId, payment_id: isFree ? null : razorpay_payment_id, order_id: isFree ? null : razorpay_order_id, amount: amount ?? 0, status: "active", started_at: now.toISOString(), expires_at: expiresAt.toISOString() }, { onConflict: "user_id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, expiresAt: expiresAt.toISOString() });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
