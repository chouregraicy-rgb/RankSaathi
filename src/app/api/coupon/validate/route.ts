import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { code, planId, userId } = await req.json();

    if (!code) return NextResponse.json({ error: "No coupon code" }, { status: 400 });

    // Fetch coupon
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 404 });
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // Check max uses
    if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // Check if user already used this coupon
    if (userId) {
      const { data: used } = await supabase
        .from("coupon_uses")
        .select("id")
        .eq("coupon_code", code.toUpperCase().trim())
        .eq("user_id", userId)
        .single();

      if (used) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
      }
    }

    return NextResponse.json({
      valid: true,
      type: coupon.type,       // 'percent' | 'trial_days' | 'full_free'
      value: coupon.value,     // % or days
      code: coupon.code,
    });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}