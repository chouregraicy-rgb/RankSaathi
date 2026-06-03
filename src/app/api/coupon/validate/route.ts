import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEMO_COUPON = "DEMO2025";

export async function POST(req: NextRequest) {
  try {
    const { coupon_code } = await req.json();

    if (!coupon_code) {
      return NextResponse.json({ valid: false, error: "No code provided" });
    }

    const code = coupon_code.toUpperCase().trim();

    if (code !== DEMO_COUPON) {
      return NextResponse.json({ valid: false, error: "Invalid code" });
    }

    const { data: coupon } = await supabase
      .from("coupons")
      .select("id, is_active")
      .eq("code", DEMO_COUPON)
      .single();

    if (!coupon?.is_active) {
      return NextResponse.json({ valid: false, error: "Code is not active" });
    }

    return NextResponse.json({
      valid: true,
      discount_type: "percent",
      discount_value: 100,
      discount_label: "Demo — 100% off",
      final_amount: 0,
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}
