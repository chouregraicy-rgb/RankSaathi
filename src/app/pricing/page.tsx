// src/app/pricing/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Zap, Shield, Star, Crown, ArrowLeft } from "lucide-react";

declare global { interface Window { Razorpay: any; } }

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const FEATURES = [
  "114 NEET PDFs — Biology, Chemistry, Physics (Class 11 + 12)",
  "AI Doubt Solver (unlimited questions, 24/7)",
  "Full Mock Tests — NEET + JEE pattern",
  "Interactive Mind Maps — 38 Biology chapters",
  "NCERT Diagram Library with NEET key facts",
  "Performance Analytics & Weak Topic Targeting",
  "Smart Revision — Flashcards + Crossword Puzzles",
  "Parent Dashboard with Real-time Updates",
  "Live Location Tracking for Parents",
  "Study Community & Group Discussion",
  "Revision Planner PDF Generator",
  "All Future Updates — Free Forever",
];

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser]       = useState<any>(null);
  const [paying, setPaying]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [coupon, setCoupon]   = useState("");
  const [logoTaps, setLogoTaps] = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponActive, setCouponActive] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  function handleLogoTap() {
    const n = logoTaps + 1;
    setLogoTaps(n);
    if (n >= 5) setShowCoupon(true);
  }

  async function applyCoupon() {
    setCouponError("");
    const res = await fetch("/api/coupon/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupon_code: coupon.toUpperCase(), plan_id: "lifetime" }),
    });
    const data = await res.json();
    if (data.valid && data.final_amount === 0) {
      setCouponActive(true);
    } else {
      setCouponError(data.error || "Invalid code");
    }
  }

  async function handleBuy() {
    if (!user) {
      // Save intent and redirect to auth
      sessionStorage.setItem("vs_post_auth", "/pricing");
      router.push("/auth");
      return;
    }
    setPaying(true);
    setError("");
    setSuccess("");
    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: "lifetime",
          user_id: user.id,
          coupon_code: couponActive ? coupon.toUpperCase() : undefined,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setError(orderData.error || "Failed"); setPaying(false); return; }

      if (orderData.demo_activated) {
        setSuccess("✅ Access activated! Redirecting...");
        setTimeout(() => router.push("/student/dashboard"), 1500);
        setPaying(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) { setError("Payment gateway failed"); setPaying(false); return; }

      const rzp = new window.Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: "INR",
        name: "VidyaSaathi",
        description: "Lifetime Access — App + 114 NEET PDFs",
        order_id: orderData.order_id,
        prefill: { name: user.user_metadata?.full_name || "", email: user.email || "" },
        theme: { color: "#f97316" },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, user_id: user.id, plan_id: "lifetime" }),
          });
          const vd = await verifyRes.json();
          if (vd.success) {
            setSuccess("✅ Payment successful! Lifetime access activated.");
            setTimeout(() => router.push("/student/dashboard"), 1500);
          } else {
            setError("Payment received but activation failed. Contact contact@globalwebsaas.org");
          }
          setPaying(false);
        },
      });
      rzp.on("payment.failed", (res: any) => {
        setError(`Payment failed: ${res.error.description}`);
        setPaying(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message);
      setPaying(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">

      {/* Nav */}
      <nav className="bg-white/90 backdrop-blur border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center cursor-pointer"
              onClick={handleLogoTap}>
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="font-bold text-gray-900">Vidya<span className="text-orange-500">Saathi</span></span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4"/> Back
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
            🔥 Launch Offer — Limited Time
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            One Price. Everything Included.
          </h1>
          <p className="text-gray-500">No monthly fees. No renewals. Pay once, use forever.</p>
        </div>

        {/* Status messages */}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 text-sm mb-4 font-medium">{success}</div>}

        {/* Main card */}
        <div className="bg-white rounded-2xl border-2 border-orange-300 shadow-xl p-8 relative">

          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold px-6 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
              <Crown className="w-3.5 h-3.5"/> LIFETIME ACCESS
            </span>
          </div>

          {/* Price */}
          <div className="text-center mt-3 mb-6">
            {couponActive ? (
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-5xl font-extrabold text-green-500">FREE</span>
                <span className="text-gray-400 line-through text-2xl">₹499</span>
              </div>
            ) : (
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-gray-400 text-xl">₹</span>
                <span className="text-6xl font-extrabold text-gray-900">499</span>
                <div className="text-left">
                  <span className="text-gray-400 line-through text-lg block">₹1,499</span>
                  <span className="text-green-600 text-sm font-bold">Save 67%</span>
                </div>
              </div>
            )}
            <p className="text-gray-400 text-sm mt-1">One-time payment · No subscription · Instant activation</p>
            <p className="text-orange-500 text-xs font-semibold mt-1">🎁 Includes 114 NEET PDFs worth ₹999 — Free</p>
          </div>

          {/* Features */}
          <div className="space-y-2.5 mb-7">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-green-600"/>
                </div>
                {f}
              </div>
            ))}
          </div>

          {/* Hidden coupon field */}
          {showCoupon && (
            <div className="mb-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-xs text-orange-600 mb-2 font-medium">Enter access code</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponActive(false); setCouponError(""); }}
                  placeholder="ACCESS CODE"
                  className="flex-1 bg-white border border-orange-200 text-gray-900 text-sm px-3 py-1.5 rounded-lg font-mono tracking-widest focus:outline-none focus:border-orange-400"
                />
                <button onClick={applyCoupon} className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg">
                  Apply
                </button>
              </div>
              {couponActive && <p className="text-green-600 text-xs mt-1 font-semibold">✅ Code applied!</p>}
              {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleBuy}
            disabled={paying}
            className="w-full h-14 rounded-xl font-bold text-base text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 transition-all shadow-lg shadow-orange-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {paying ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5"/>
                {couponActive ? "Activate Free Access" : "Get Lifetime Access — ₹499"}
              </>
            )}
          </button>

          {!user && (
            <p className="text-center text-xs text-gray-400 mt-3">
              <Link href="/auth/signin?redirect=/pricing" className="text-orange-500 font-medium hover:underline">
                Sign in
              </Link>{" "}or{" "}
              <Link href="/auth/signup?redirect=/pricing" className="text-orange-500 font-medium hover:underline">
                create account
              </Link>{" "}to continue
            </p>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-400 mt-6">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500"/>Secure Razorpay payment</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400"/>Instant activation</span>
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-400"/>No renewals ever</span>
        </div>

        {/* Compare */}
        <div className="mt-8 bg-orange-50 rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-gray-700 mb-1">Compare the value</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="text-center">
              <p className="text-red-500 font-bold text-lg">₹50,000+</p>
              <p className="text-xs">Coaching classes/year</p>
            </div>
            <div className="text-2xl text-gray-300">vs</div>
            <div className="text-center">
              <p className="text-green-600 font-bold text-lg">₹499</p>
              <p className="text-xs">VidyaSaathi lifetime</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions? Email us at{" "}
          <a href="mailto:contact@globalwebsaas.org" className="text-orange-500">contact@globalwebsaas.org</a>
        </p>
      </div>
    </div>
  );
}
