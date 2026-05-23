import { NextRequest, NextResponse } from "next/server";

const COUPONS: Record<string, { type: string; value: number; label: string }> = {
  VIDYASAATHI2026: { type: "percent",    value: 20,  label: "20% off" },
  LAUNCH50:        { type: "percent",    value: 50,  label: "50% off" },
  GRAICY100:       { type: "full_free",  value: 100, label: "100% free" },
  TESTER3DAYS:     { type: "trial_days", value: 3,   label: "3-day trial" },
};

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });
    const coupon = COUPONS[code.trim().toUpperCase()];
    if (!coupon) return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    return NextResponse.json({ ...coupon, code: code.trim().toUpperCase() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
