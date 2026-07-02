// src/app/api/razorpay/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLANS: Record<string, { name: string; amountPaise: number }> = {
  lifetime:        { name: "VidyaSaathi Lifetime",    amountPaise: 49900  },
  pdf_only:        { name: "NEET PDF Pack",           amountPaise: 29900  },
  bundle:          { name: "App + PDF Bundle",        amountPaise: 69900  },
  student_monthly: { name: "Student Monthly",         amountPaise: 9900   },
  student_yearly:  { name: "Student Yearly",          amountPaise: 79900  },
  family_monthly:  { name: "Family Monthly",          amountPaise: 14900  },
  family_yearly:   { name: "Family Yearly",           amountPaise: 119900 },
};

export async function POST(req: NextRequest) {
  try {
    const { plan_id, user_id, coupon_code, referral_code } = await req.json();
    if (!plan_id || !user_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const plan = PLANS[plan_id];
    if (!plan) return NextResponse.json({ error: `Unknown plan: ${plan_id}` }, { status: 400 });

    let finalAmount = plan.amountPaise;
    let referrerUserId: string | null = null;

    // Apply coupon if provided
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .maybeSingle();

      if (coupon) {
        const discount = coupon.discount_value || 0;
        finalAmount = Math.round(finalAmount * (1 - discount / 100));

        if (finalAmount === 0) {
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setDate(expiresAt.getDate() + 36500);

          const { error: subErr } = await supabase.from("subscriptions").upsert({
            user_id,
            plan_id,
            payment_id: null,
            order_id:   `coupon_${coupon_code.toUpperCase()}_${Date.now()}`,
            amount:     0,
            status:     "active",
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
          }, { onConflict: "user_id" });

          if (subErr) {
            console.error("[create-order] Coupon activation error:", subErr);
            return NextResponse.json({ error: "Could not activate access. Contact support." }, { status: 500 });
          }

          return NextResponse.json({ demo_activated: true, plan_name: plan.name });
        }
      }
    }

    // Apply referral code if provided (₹50 flat discount, server-validated)
    if (referral_code && !coupon_code) {
      const validateRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("supabase.co", "supabase.co") ?? ""}/functions/v1/referral-validate`, {
        method: "POST",
      }).catch(() => null);

      // Inline validation (avoid network hop to self)
      const code = referral_code.toUpperCase().trim();
      const { data: student } = await supabase
        .from("students")
        .select("user_id")
        .eq("invite_code", code)
        .maybeSingle();

      if (student && student.user_id !== user_id) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", student.user_id)
          .eq("status", "active")
          .maybeSingle();

        const { data: existingRef } = await supabase
          .from("referrals")
          .select("id")
          .eq("referee_user_id", user_id)
          .maybeSingle();

        if (sub && !existingRef) {
          finalAmount = Math.max(0, finalAmount - 5000); // ₹50 off
          referrerUserId = student.user_id;
        }
      }
    }

    const order = await razorpay.orders.create({
      amount:   finalAmount,
      currency: "INR",
      receipt:  `order_${Date.now()}`,
    });

    return NextResponse.json({
      order_id:          order.id,
      amount:            order.amount,
      currency:          order.currency,
      key_id:            process.env.RAZORPAY_KEY_ID,
      plan_name:         plan.name,
      referrer_user_id:  referrerUserId,
      referral_code:     referrerUserId ? referral_code?.toUpperCase() : null,
      referral_discount: referrerUserId ? 50 : 0,
    });
  } catch (err: any) {
    console.error("[create-order] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
