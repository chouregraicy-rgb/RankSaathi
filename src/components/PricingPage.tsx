"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, Zap, Loader2, ChevronRight, Shield, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window { Razorpay: any; }
}

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

const FEATURES = [
  "AI Doubt Solver (unlimited)",
  "Chapter Summaries — all subjects",
  "Mock Tests (NEET + JEE)",
  "Previous Year Questions",
  "Interactive Mind Maps with Diagrams",
  "Science Crossword Puzzles",
  "Performance Analytics",
  "Revision Planner",
  "Parent Dashboard Access",
  "Live Location Tracking",
  "Study Progress Reports",
  "Community & Group Study",
  "Lifetime Updates — free forever",
];

export default function PricingPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  const [payLoading, setPayLoading]   = useState(false);
  const [payError, setPayError]       = useState("");
  const [successMsg, setSuccessMsg]   = useState("");

  // Hidden demo coupon — 5 title clicks
  const [logoClicks, setLogoClicks]       = useState(0);
  const [showDemoField, setShowDemoField] = useState(false);
  const [demoCoupon, setDemoCoupon]       = useState("");
  const [demoActive, setDemoActive]       = useState(false);
  const [couponError, setCouponError]     = useState("");

  function handleLogoClick() {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) setShowDemoField(true);
  }

  async function applyDemoCoupon() {
    if (!demoCoupon.trim()) return;
    setCouponError("");
    const res = await fetch("/api/coupon/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coupon_code: demoCoupon.trim().toUpperCase(),
        plan_id: "lifetime",
      }),
    });
    const data = await res.json();
    if (data.valid && data.final_amount === 0) {
      setDemoActive(true);
    } else {
      setCouponError(data.error || "Invalid code.");
    }
  }

  async function handleCheckout() {
    if (!currentUser) { router.push("/auth/signin"); return; }

    setPayError("");
    setSuccessMsg("");
    setPayLoading(true);

    try {
      const couponToSend = demoActive ? demoCoupon.trim().toUpperCase() : undefined;

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: "lifetime",
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

      // Demo/coupon → activated directly
      if (orderData.demo_activated) {
        setSuccessMsg("✅ Access activated! Redirecting to dashboard...");
        setPayLoading(false);
        setTimeout(() => router.push("/student/dashboard"), 1500);
        return;
      }

      // Normal paid flow
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
        description: "Lifetime Access — NEET/JEE AI Prep",
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
              plan_id: "lifetime",
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSuccessMsg("✅ Payment successful! Lifetime access activated.");
            setTimeout(() => router.push("/student/dashboard"), 1500);
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
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-indigo-300 font-medium">Launch Offer — Limited Time</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent cursor-default select-none"
            onClick={handleLogoClick}
          >
            One Price. Everything.
          </h1>
          <p className="text-gray-400 text-lg">
            Full lifetime access to VidyaSaathi — no monthly fees, no hidden charges.
          </p>

          {/* Hidden demo field */}
          {showDemoField && (
            <div className="mt-5 flex flex-col items-center gap-2">
              <p className="text-xs text-indigo-400/70">Enter your access code</p>
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Access code"
                  value={demoCoupon}
                  onChange={(e) => {
                    setDemoCoupon(e.target.value.toUpperCase());
                    setDemoActive(false);
                    setCouponError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && applyDemoCoupon()}
                  className="bg-[#111118] border border-indigo-500/30 text-white text-sm px-3 py-1.5 rounded-lg font-mono w-40 focus:outline-none focus:border-indigo-500 tracking-widest text-center"
                />
                <button
                  onClick={applyDemoCoupon}
                  disabled={!demoCoupon}
                  className="text-xs px-4 py-1.5 rounded-lg bg-indigo-500/30 text-indigo-300 hover:bg-indigo-500/50 transition-colors disabled:opacity-40 font-semibold"
                >
                  Apply
                </button>
              </div>
              {demoActive && (
                <span className="text-xs text-green-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Code applied! Click below to activate.
                </span>
              )}
              {couponError && (
                <span className="text-xs text-red-400">{couponError}</span>
              )}
            </div>
          )}
        </div>

        {/* Single Plan Card */}
        <div className="relative rounded-2xl border border-indigo-500/40 bg-[#111118] p-8 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/20 mb-6">

          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-xs font-bold px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Crown className="w-3 h-3" /> LIFETIME ACCESS
            </span>
          </div>

          {/* Price */}
          <div className="text-center mt-2 mb-6">
            <div className="flex items-baseline justify-center gap-2">
              {demoActive ? (
                <>
                  <span className="text-5xl font-bold text-green-400">FREE</span>
                  <span className="text-gray-500 line-through text-2xl">₹499</span>
                </>
              ) : (
                <>
                  <span className="text-gray-400 text-xl">₹</span>
                  <span className="text-6xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">499</span>
                </>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-1">One-time payment · No renewals ever</p>
            {!demoActive && (
              <p className="text-green-400 text-xs mt-1 font-medium">
                🎉 Launch price — was ₹1499
              </p>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-2.5 mb-8">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-green-400" />
                </div>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            className="w-full h-12 font-bold text-base transition-all text-white border-0 bg-gradient-to-r from-indigo-600 to-violet-500 hover:opacity-90 hover:scale-[1.02] shadow-lg shadow-indigo-500/30"
            onClick={handleCheckout}
            disabled={payLoading}
          >
            {payLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Zap className="w-5 h-5 mr-2" />
            )}
            {demoActive ? "Activate Free Access" : "Get Lifetime Access — ₹499"}
          </Button>

          <p className="text-center text-xs text-gray-500 mt-3">
            Includes Student + Family features · Both NEET &amp; JEE
          </p>
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
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 mt-4">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-green-500" /> Secure Razorpay payment
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-blue-400" /> No subscription
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> Instant activation
          </span>
        </div>

      </div>
    </div>
  );
}
