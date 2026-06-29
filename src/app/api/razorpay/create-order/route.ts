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
    const { plan_id, user_id, coupon_code } = await req.json();
    if (!plan_id || !user_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const plan = PLANS[plan_id];
    if (!plan) return NextResponse.json({ error: `Unknown plan: ${plan_id}` }, { status: 400 });

    let finalAmount = plan.amountPaise;

    // Apply coupon if provided
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .maybeSingle();

      if (coupon) {
        const discount = coupon.discount_percent || 0;
        finalAmount = Math.round(finalAmount * (1 - discount / 100));

        if (finalAmount === 0) {
          // Free order — activate directly
          return NextResponse.json({ demo_activated: true, plan_name: plan.name });
        }
      }
    }

    const order = await razorpay.orders.create({
      amount:   finalAmount,
      currency: "INR",
      receipt:  `order_${Date.now()}`,
    });

    return NextResponse.json({
      order_id:  order.id,
      amount:    order.amount,
      currency:  order.currency,
      key_id:    process.env.RAZORPAY_KEY_ID,
      plan_name: plan.name,
    });
  } catch (err: any) {
    console.error("[create-order] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
