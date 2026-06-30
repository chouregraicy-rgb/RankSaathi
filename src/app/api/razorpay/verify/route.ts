// src/app/api/razorpay/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_CONFIG: Record<string, { label: string; durationDays: number; priceINR: number; type: "app" | "pdf" | "bundle" }> = {
  lifetime:        { label: "Lifetime Access",   durationDays: 36500, priceINR: 499, type: "app"    },
  pdf_only:        { label: "NEET PDF Pack",      durationDays: 36500, priceINR: 299, type: "pdf"    },
  bundle:          { label: "App + PDF Bundle",   durationDays: 36500, priceINR: 699, type: "bundle" },
  student_monthly: { label: "Student Monthly",    durationDays: 30,    priceINR: 99,  type: "app"    },
  student_yearly:  { label: "Student Yearly",     durationDays: 365,   priceINR: 799, type: "app"    },
  family_monthly:  { label: "Family Monthly",     durationDays: 30,    priceINR: 149, type: "app"    },
  family_yearly:   { label: "Family Yearly",      durationDays: 365,   priceINR: 1199,type: "app"    },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_id, user_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan_id || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const planConfig = PLAN_CONFIG[plan_id];
    if (!planConfig) return NextResponse.json({ error: `Unknown plan: ${plan_id}` }, { status: 400 });

    // Verify HMAC — no exceptions. Free/coupon activations never reach this
    // route at all; they're handled and written to the DB server-side in
    // create-order/route.ts at the moment a valid 100%-off coupon is
    // confirmed. This route only ever activates a REAL paid Razorpay order.
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expected !== razorpay_signature) {
      console.warn("[verify] Signature mismatch for user", user_id);
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + planConfig.durationDays);

    // Activate app subscription if needed
    if (planConfig.type === "app" || planConfig.type === "bundle") {
      const { error: subErr } = await supabase.from("subscriptions").upsert({
        user_id,
        plan_id,
        payment_id: razorpay_payment_id,
        order_id:   razorpay_order_id,
        amount:     planConfig.priceINR,
        status:     "active",
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      }, { onConflict: "user_id" });
      if (subErr) console.error("Sub upsert error:", subErr);
    }

    // Activate PDF access if needed
    if (planConfig.type === "pdf" || planConfig.type === "bundle") {
      const { error: pdfErr } = await supabase.from("pdf_purchases").upsert({
        user_id,
        plan_id,
        payment_id: razorpay_payment_id,
        order_id:   razorpay_order_id,
        amount:     planConfig.priceINR,
        status:     "active",
        created_at: now.toISOString(),
      }, { onConflict: "user_id" });
      if (pdfErr) console.error("PDF upsert error:", pdfErr);
    }

    return NextResponse.json({ success: true, planLabel: planConfig.label, expiresAt: expiresAt.toISOString() });
  } catch (err: any) {
    console.error("[verify] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}