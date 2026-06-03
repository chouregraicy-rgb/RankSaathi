"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, Zap, Users, Loader2, ChevronRight, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window { Razorpay: any; }
}

const PLANS = {
  student: {
    icon: Zap,
    label: "Student",
    colorClass: "from-blue-500 to-cyan-400",
    borderClass: "border-blue-500/30",
    shadowClass: "shadow-blue-500/20",
    badge: null,
    monthly: { id: "student_monthly", price: 99,  period: "month", monthly_equiv: null as number | null },
    yearly:  { id: "student_yearly",  price: 799, period: "year",  monthly_equiv: 66 as number | null  },
    features: [
      "AI Doubt Solver (unlimited)",
      "Chapter Summaries — all subjects",
      "Mock Tests (NEET + JEE)",
      "Previous Year Questions",
      "Science Crossword puzzles",
      "Performance Analytics",
      "Revision Planner",
    ],
  },
  family: {
    icon: Users,
    label: "Family",
    colorClass: "from-violet-500 to-purple-400",
    borderClass: "border-violet-500/30",
    shadowClass: "shadow-violet-500/20",
    badge: "Most Popular",
    monthly: { id: "family_monthly", price: 149,  period: "month", monthly_equiv: null as number | null },
    yearly:  { id: "family_yearly",  price: 1199, period: "year",  monthly_equiv: 100 as number | null },
    features: [
      "Everything in Student plan",
      "Parent dashboard access",
      "Live location tracking",
      "Study progress reports",
      "Parent-student linking",
      "Daily study alerts",
      "Priority support",
    ],
  },
};

type PlanKey = "student" | "family";
type BillingCycle = "monthly" | "yearly";

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PricingPage() {
  const router = useRouter();

  // Auth — get user from Supabase directly
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  const [billing, setBilling]             = useState<BillingCycle>("yearly");
  const [selectedPlan, setSelectedPlan]   = useState<PlanKey | null>(null);
  const [payLoading, setPayLoading]       = useState(false);
  const [payError, setPayError]           = useState("");
  const [successMsg, setSuccessMsg]       = useState("");

  // Hidden demo coupon — revealed after 5 title clicks
  const [logoClicks, setLogoClicks]       = useState(0);
  const [showDemoField, setShowDemoField] = useState(false);
  const [demoCoupon, setDemoCoupon]       = useState("");
  const [demoActive, setDemoActive]       = useState(false);

  function handleLogoClick() {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) setShowDemoField(true);
  }

  async function applyDemoCoupon() {
    if (!demoCoupon.trim() || !selectedPlan) {
      setPayError("Select a plan first, then apply the code.");
      return;
    }
    setPayError("");
    const res = await fetch("/api/coupon/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coupon_code: demoCoupon,
        plan_id: PLANS[selectedPlan][billing].id,
      }),
    });
    const data = await res.json();
    if (data.valid && data.final_amount === 0) {
      setDemoActive(true);
    } else {
      setPayError(data.error || "Invalid demo code.");
    }
  }

  async function handleCheckout(planKey: PlanKey) {
    if (!currentUser) { router.push("/auth/signin"); return; }

    setSelectedPlan(planKey);
    setPayError("");
    setSuccessMsg("");
    setPayLoading(true);

    try {
      const planId = PLANS[planKey][billing].id;
      const couponToSend = demoActive ? demoCoupon : undefined;

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: planId,
          coupon_code: couponToSend,
          user_id: currentUser.id,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setPayError(orderData.error || "Failed to create order");
        setPayLoading(false);
        return;
      }

      // Demo coupon → activated directly, no Razorpay popup
      if (orderData.demo_activated) {
        setSuccessMsg(`✅ Demo access activated for ${PLANS[planKey].label} plan!`);
        setPayLoading(false);
        return;
      }

      // Normal paid flow → open Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        setPayError("Failed to load payment gateway. Please try again.");
        setPayLoading(false);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: "INR",
        name: "VidyaSaathi",
        description: orderData.plan_name,
        order_id: orderData.order_id,
        prefill: {
          name: currentUser.user_metadata?.full_name || "",
          email: currentUser.email || "",
        },
        theme: { color: "#6366f1" },
        modal: { ondismiss: () => setPayLoading(false) },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              user_id: currentUser.id,
              plan_id: planId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSuccessMsg(`✅ Payment successful! Your ${PLANS[planKey].label} plan is now active.`);
          } else {
            setPayError("Payment received but activation failed. Contact contact@globalwebsaas.org");
          }
          setPayLoading(false);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res: any) => {
        setPayError(`Payment failed: ${res.error.description}`);
        setPayLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setPayError(err.message || "Something went wrong");
      setPayLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent cursor-default select-none"
            onClick={handleLogoClick}
          >
            Simple, Honest Pricing
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Crack NEET &amp; JEE with AI-powered preparation. Cancel anytime.
          </p>

          {/* Hidden demo field — 5 title clicks to reveal */}
          {showDemoField && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <input
                type="text"
                placeholder="Demo code"
                value={demoCoupon}
                onChange={(e) => {
                  setDemoCoupon(e.target.value.toUpperCase());
                  setDemoActive(false);
                }}
                className="bg-[#111118] border border-white/10 text-white text-sm px-3 py-1.5 rounded-lg font-mono w-36 focus:outline-none focus:border-indigo-500/50"
              />
              <button
                onClick={applyDemoCoupon}
                disabled={!demoCoupon}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors disabled:opacity-40"
              >
                Apply
              </button>
              {demoActive && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Demo active
                </span>
              )}
            </div>
          )}
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBilling(cycle)}
              className={[
                "px-5 py-2 rounded-full text-sm font-medium transition-all capitalize flex items-center gap-2",
                billing === cycle ? "bg-white text-black" : "text-gray-400 hover:text-white",
              ].join(" ")}
            >
              {cycle}
              {cycle === "yearly" && (
                <span className={[
                  "text-xs px-2 py-0.5 rounded-full font-semibold",
                  billing === "yearly" ? "bg-green-500 text-white" : "bg-green-500/20 text-green-400",
                ].join(" ")}>
                  Save 33%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {(Object.keys(PLANS) as PlanKey[]).map((planKey) => {
            const plan = PLANS[planKey];
            const cycle = plan[billing];
            const Icon = plan.icon;
            const isSelected = selectedPlan === planKey;
            const showFree = demoActive && isSelected;

            return (
              <div
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={[
                  "relative rounded-2xl border p-6 cursor-pointer transition-all duration-200 bg-[#111118] hover:bg-[#14141e]",
                  isSelected
                    ? `${plan.borderClass} shadow-lg ${plan.shadowClass}`
                    : "border-white/5",
                  plan.badge ? "ring-1 ring-violet-500/30" : "",
                ].join(" ")}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.colorClass} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-1">{plan.label}</h3>

                <div className="flex items-baseline gap-2 mb-1">
                  {showFree ? (
                    <>
                      <span className="text-3xl font-bold text-green-400">FREE</span>
                      <span className="text-gray-500 line-through text-lg">₹{cycle.price}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">₹{cycle.price}</span>
                      <span className="text-gray-400 text-sm">/{cycle.period}</span>
                    </>
                  )}
                </div>

                {cycle.monthly_equiv && !showFree && (
                  <p className="text-xs text-green-400 mb-2">= ₹{cycle.monthly_equiv}/month</p>
                )}

                <ul className="space-y-2 mb-6 mt-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-semibold transition-all text-white border-0 bg-gradient-to-r ${plan.colorClass} hover:opacity-90`}
                  onClick={(e) => { e.stopPropagation(); handleCheckout(planKey); }}
                  disabled={payLoading && isSelected}
                >
                  {payLoading && isSelected
                    ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    : <ChevronRight className="w-4 h-4 mr-1" />
                  }
                  {showFree ? "Activate Demo" : "Get Started"}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Status messages */}
        {payError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
            {payError}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm mb-4 font-medium">
            {successMsg}
          </div>
        )}

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 mt-8">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-green-500" /> Secure Razorpay payment
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-blue-400" /> Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> Instant activation
          </span>
        </div>

      </div>
    </div>
  );
}
