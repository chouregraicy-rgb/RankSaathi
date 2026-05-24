"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Check, Zap, Users, Building2, Sparkles, Tag, X } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    icon: Sparkles,
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "from-slate-500 to-slate-700",
    badge: null,
    features: [
      "5 AI doubt solutions/day",
      "Basic test series",
      "Community access",
      "Basic analytics",
    ],
    cta: "Get Started Free",
  },
  {
    id: "student",
    name: "Student",
    icon: Zap,
    monthlyPrice: 99,
    yearlyPrice: 799,
    color: "from-violet-500 to-purple-700",
    badge: "Most Popular",
    features: [
      "Unlimited AI doubt solving",
      "Full NEET/JEE test series",
      "Detailed performance analytics",
      "Revision scheduler",
      "Priority support",
      "Offline access",
    ],
    cta: "Start Learning",
  },
  {
    id: "family",
    name: "Family",
    icon: Users,
    monthlyPrice: 149,
    yearlyPrice: 1199,
    color: "from-blue-500 to-cyan-600",
    badge: "Best Value",
    features: [
      "Everything in Student",
      "Parent dashboard",
      "Live location tracking",
      "Progress reports for parents",
      "Up to 3 students",
      "Family analytics",
    ],
    cta: "Get Family Plan",
  },
  {
    id: "institution",
    name: "Institution",
    icon: Building2,
    monthlyPrice: null,
    yearlyPrice: null,
    color: "from-amber-500 to-orange-600",
    badge: "Enterprise",
    features: [
      "Everything in Family",
      "Unlimited students",
      "Admin dashboard",
      "Custom branding",
      "Bulk student import",
      "Dedicated support",
    ],
    cta: "Contact Us",
  },
];

declare global {
  interface Window { Razorpay: any; }
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setCoupon(null);
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, userId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) setCouponError(data.error);
      else setCoupon(data);
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const getDiscountedPrice = (originalPrice: number) => {
    if (!coupon) return originalPrice;
    if (coupon.type === "full_free") return 0;
    if (coupon.type === "percent") return Math.round(originalPrice * (1 - coupon.value / 100));
    return originalPrice;
  };

  // Single function that calls verify-payment and always awaits the result
  const writeSubscription = async (payload: object): Promise<boolean> => {
    try {
      const res = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Activation failed: " + (data.error || "Unknown error"));
        return false;
      }
      return true;
    } catch (e: any) {
      alert("Network error: " + e.message);
      return false;
    }
  };

  const handlePayment = async (planObj: (typeof plans)[0]) => {
    if (planObj.id === "institution") {
      window.location.href = "mailto:contact@globalwebsaas.org?subject=VidyaSaathi Institution Plan";
      return;
    }

    if (!user) {
      router.push("/auth?tab=login&redirect=/pricing");
      return;
    }

    // plan key sent to API: "student_monthly", "student_yearly", "family_monthly", "family_yearly"
    const planKey = planObj.id === "free"
      ? "student_monthly"
      : `${planObj.id}_${billing}`;

    const originalAmount = billing === "monthly" ? planObj.monthlyPrice! : planObj.yearlyPrice!;

    setLoading(planObj.id);

    // ── Free tier ──────────────────────────────────────────────────────────
    if (planObj.id === "free") {
      const ok = await writeSubscription({
        plan: planKey,
        userId: user.id,
        isFree: true,
        razorpay_order_id: "free_" + Date.now(),
        razorpay_payment_id: "free_" + Date.now(),
        razorpay_signature: "free",
      });
      setLoading(null);
      if (ok) router.push("/student/dashboard");
      return;
    }

    // ── Trial-days coupon (e.g. TESTER3DAYS) ─────────────────────────────
    if (coupon?.type === "trial_days") {
      const ok = await writeSubscription({
        plan: planKey,
        userId: user.id,
        isFree: true,
        trialDays: coupon.value,
        coupon: coupon.code,
        razorpay_order_id: "trial_" + Date.now(),
        razorpay_payment_id: "trial_" + Date.now(),
        razorpay_signature: "free",
      });
      setLoading(null);
      if (ok) router.push("/student/dashboard?payment=trial");
      return;
    }

    const finalAmount = getDiscountedPrice(originalAmount);

    // ── 100% free coupon (e.g. GRAICY100) ────────────────────────────────
    if (finalAmount === 0) {
      const ok = await writeSubscription({
        plan: planKey,
        userId: user.id,
        isFree: true,
        coupon: coupon?.code,
        razorpay_order_id: "free_" + Date.now(),
        razorpay_payment_id: "free_" + Date.now(),
        razorpay_signature: "free",
      });
      setLoading(null);
      if (ok) router.push("/student/dashboard?payment=success");
      return;
    }

    // ── Paid — open Razorpay modal ────────────────────────────────────────
    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, userId: user.id, coupon: coupon?.code }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "VidyaSaathi",
        description: planKey,
        order_id: orderData.orderId,
        prefill: {
          name: user.user_metadata?.full_name ?? "",
          email: user.email ?? "",
        },
        theme: { color: "#7c3aed" },
        handler: async (response: any) => {
          const ok = await writeSubscription({
            plan: planKey,
            userId: user.id,
            isFree: false,
            coupon: coupon?.code,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setLoading(null);
          if (ok) router.push("/student/dashboard?payment=success");
        },
        modal: { ondismiss: () => setLoading(null) },
      });

      rzp.on("payment.failed", (r: any) => {
        alert(r.error?.description || "Payment failed. Please try again.");
        setLoading(null);
      });

      rzp.open();
    } catch (e: any) {
      alert(e.message || "Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  const yearlySavings = (monthly: number, yearly: number) =>
    Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 text-lg mb-8">Choose the plan that fits your preparation journey</p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-slate-800 rounded-full p-1 mb-8">
          <button onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
            Monthly
          </button>
          <button onClick={() => setBilling("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billing === "yearly" ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
            Yearly
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Save up to 33%</span>
          </button>
        </div>

        {/* Coupon Input */}
        <div className="max-w-md mx-auto">
          {!coupon ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  placeholder="Have a coupon code?"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
                />
              </div>
              <button onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-900/30 border border-green-500/50 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                <span className="font-medium">{coupon.code}</span>
                <span className="text-green-300">
                  {coupon.type === "percent"    && `${coupon.value}% off applied!`}
                  {coupon.type === "trial_days" && `${coupon.value}-day free trial!`}
                  {coupon.type === "full_free"  && "100% free access!"}
                </span>
              </div>
              <button onClick={removeCoupon} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {couponError && <p className="text-red-400 text-sm mt-2">{couponError}</p>}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const originalPrice = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const finalPrice    = originalPrice !== null ? getDiscountedPrice(originalPrice) : null;
          const isPopular     = plan.badge === "Most Popular";
          const hasDiscount   = coupon && originalPrice && finalPrice !== originalPrice;

          return (
            <div key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col border transition-all duration-300 hover:scale-105 ${
                isPopular
                  ? "border-violet-500 bg-violet-950/50 shadow-xl shadow-violet-500/20"
                  : "border-slate-700 bg-slate-900/50"
              }`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.color}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>

              <div className="mb-2">
                {finalPrice === null ? (
                  <p className="text-3xl font-bold text-white">Custom</p>
                ) : finalPrice === 0 && originalPrice === 0 ? (
                  <p className="text-3xl font-bold text-white">Free</p>
                ) : (
                  <>
                    {hasDiscount && (
                      <p className="text-sm text-slate-400 line-through">
                        ₹{originalPrice}/{billing === "monthly" ? "mo" : "yr"}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-white">
                      {finalPrice === 0 ? "FREE" : `₹${finalPrice}`}
                      {finalPrice !== 0 && (
                        <span className="text-sm font-normal text-slate-400">
                          /{billing === "monthly" ? "mo" : "yr"}
                        </span>
                      )}
                    </p>
                    {billing === "yearly" && plan.monthlyPrice && !coupon && (
                      <p className="text-xs text-green-400 mt-1">
                        Save {yearlySavings(plan.monthlyPrice, plan.yearlyPrice!)}% vs monthly
                      </p>
                    )}
                    {hasDiscount && coupon?.type === "percent" && (
                      <p className="text-xs text-green-400 mt-1">{coupon.value}% off applied!</p>
                    )}
                  </>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isPopular
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 shadow-lg"
                    : plan.id === "free"
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                } disabled:opacity-50 disabled:cursor-not-allowed`}>
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </span>
                ) : coupon?.type === "trial_days" && plan.id !== "free" && plan.id !== "institution"
                  ? `Start ${coupon.value}-Day Free Trial`
                  : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-slate-500 text-sm mt-12">
        Secure payments via Razorpay · All plans include 7-day free trial · Cancel anytime
      </p>
    </div>
  );
}
