// src/app/api/referral/payout/route.ts
// Triggers a ₹50 Razorpay payout to the referrer when their referral converts.
// This route is called from verify/route.ts after a successful payment.
//
// ⚠️  REQUIRES Razorpay Payouts to be enabled on your Razorpay account:
//     Dashboard → Payouts → Enable Payouts → Add bank account → Complete KYC
//     Until enabled, referrals accumulate as "pending_payout" in the DB
//     and this route returns early without error.
//
// Required env vars (add to Render when Payouts is enabled):
//   RAZORPAY_KEY_ID      (already set)
//   RAZORPAY_KEY_SECRET  (already set)
//   RAZORPAY_ACCOUNT_NUMBER  (your Razorpay payout account number, e.g. "4564563325961")

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAYOUTS_ENABLED = !!(
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  process.env.RAZORPAY_ACCOUNT_NUMBER
);

export async function POST(req: NextRequest) {
  try {
    const { referral_id, referrer_user_id } = await req.json();

    if (!referral_id || !referrer_user_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Get referrer contact info and UPI for payout
    const { data: user } = await supabase
      .from("users")
      .select("email, phone")
      .eq("id", referrer_user_id)
      .single();

    const { data: student } = await supabase
      .from("students")
      .select("upi_id")
      .eq("user_id", referrer_user_id)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: "Referrer not found" }, { status: 404 });
    }

    if (!PAYOUTS_ENABLED) {
      if (!student?.upi_id) {
        console.log(`[referral/payout] No UPI ID set for referrer ${referrer_user_id} — payout queued.`);
      } else {
        console.log(`[referral/payout] Payouts disabled — referral ${referral_id} queued for ${student.upi_id}`);
      }
      return NextResponse.json({ queued: true, message: "Payout queued — Razorpay Payouts not yet enabled" });
    }

    if (!student?.upi_id) {
      console.warn(`[referral/payout] Referrer ${referrer_user_id} has no UPI ID — cannot pay out yet.`);
      return NextResponse.json({ queued: true, message: "No UPI ID set — student must add UPI in Settings" });
    }

    // ── Razorpay Payout API ──────────────────────────────────────────────
    // Docs: https://razorpay.com/docs/api/payouts/
    const authHeader = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const payoutRes = await fetch("https://api.razorpay.com/v1/payouts", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Basic ${authHeader}`,
        "X-Payout-Idempotency": referral_id, // prevents duplicate payouts
      },
      body: JSON.stringify({
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
        fund_account: {
          account_type: "vpa",
          vpa: { address: student.upi_id },
          contact: {
            name:    "VidyaSaathi Student",
            email:   user.email,
            contact: user.phone ?? "",
            type:    "customer",
          },
        },
        amount:    5000, // ₹50 in paise
        currency:  "INR",
        mode:      "UPI",
        purpose:   "payout",
        narration: "VidyaSaathi Referral Reward",
        notes: {
          referral_id,
          referrer_user_id,
        },
      }),
    });

    const payout = await payoutRes.json();

    if (!payoutRes.ok) {
      console.error("[referral/payout] Razorpay error:", payout);
      await supabase
        .from("referrals")
        .update({ status: "failed" })
        .eq("id", referral_id);
      return NextResponse.json({ error: payout.error?.description ?? "Payout failed" }, { status: 500 });
    }

    // Update referral record with payout details
    await supabase
      .from("referrals")
      .update({
        status:             "paid",
        razorpay_payout_id: payout.id,
        paid_at:            new Date().toISOString(),
      })
      .eq("id", referral_id);

    return NextResponse.json({ success: true, payout_id: payout.id });
  } catch (err: any) {
    console.error("[referral/payout]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
