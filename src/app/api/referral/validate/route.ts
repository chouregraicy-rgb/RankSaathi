// src/app/api/referral/validate/route.ts
// Validates a referral/invite code at checkout.
// Returns the referrer's user_id and confirms the code is valid and usable.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { referral_code, user_id } = await req.json();

    if (!referral_code || !user_id) {
      return NextResponse.json({ valid: false, error: "Missing fields" }, { status: 400 });
    }

    const code = referral_code.toUpperCase().trim();

    // Find the student who owns this invite code
    const { data: student } = await supabase
      .from("students")
      .select("user_id, invite_code")
      .eq("invite_code", code)
      .maybeSingle();

    if (!student) {
      return NextResponse.json({ valid: false, error: "Invalid referral code" });
    }

    // Can't refer yourself
    if (student.user_id === user_id) {
      return NextResponse.json({ valid: false, error: "You can't use your own referral code" });
    }

    // Check if this user has already used a referral code
    const { data: existing } = await supabase
      .from("referrals")
      .select("id")
      .eq("referee_user_id", user_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ valid: false, error: "You've already used a referral code" });
    }

    // Check if the referrer is actually a paid subscriber
    // (only paid users can refer — prevents abuse)
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", student.user_id)
      .eq("status", "active")
      .maybeSingle();

    if (!sub) {
      return NextResponse.json({ valid: false, error: "Referral code is not active" });
    }

    return NextResponse.json({
      valid:            true,
      referrer_user_id: student.user_id,
      discount:         50,
      message:          "✅ Referral code applied! ₹50 discount added.",
    });
  } catch (err: any) {
    console.error("[referral/validate]", err);
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}
