import { NextRequest, NextResponse } from "next/server";
const COUPONS: Record<string, any> = { VIDYASAATHI2026: { type: "percent", value: 20 }, LAUNCH50: { type: "percent", value: 50 }, GRAICY100: { type: "full_free", value: 100 }, TESTER3DAYS: { type: "trial_days", value: 3 } };
export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const coupon = COUPONS[code?.trim().toUpperCase()];
  if (!coupon) return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
  return NextResponse.json({ ...coupon, code: code.trim().toUpperCase() });
}
