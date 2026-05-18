"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Check, Zap, Users, Building2, Sparkles } from "lucide-react";

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
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (plan: (typeof plans)[0]) => {
    if (plan.id === "free") {
      router.push("/dashboard");
      return;
    }

    if (plan.id === "institution") {
      window.location.href = "mailto:contact@globalwebsaas.org?subject=VidyaSaathi Institution Plan";
      return;
    }

    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoading(plan.id);

    const amount = billing === "monthly" ? plan.monthlyPrice! : plan.yearlyPrice!;
    const planId = `${plan.id}_${billing}`;

    try {
      // Create order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, planId, userId: user.id }),
      });

      const { orderId } = await res.json();

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "VidyaSaathi",
        description: `${plan.name} Plan - ${billing === "monthly" ? "Monthly" : "Yearly"}`,
        image: "/logo.png",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
                userId: user.id,
                amount,
              }),
            });

            const result = await verifyRes.json();
            if (result.success) {
              router.push("/dashboard?payment=success");
            } else {
              alert("Payment verification failed. Contact support.");
            }
          } catch {
            alert("Payment verification error. Contact support.");
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => setLoading(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const yearlySavings = (monthly: number, yearly: number) =>
    Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          Choose the plan that fits your preparation journey
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-slate-800 rounded-full p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billing === "monthly"
                ? "bg-violet-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              billing === "yearly"
                ? "bg-violet-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Yearly
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save up to 33%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const isPopular = plan.badge === "Most Popular";

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col border transition-all duration-300 hover:scale-105 ${
                isPopular
                  ? "border-violet-500 bg-violet-950/50 shadow-xl shadow-violet-500/20"
                  : "border-slate-700 bg-slate-900/50"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.color}`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Icon + Name */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>

              {/* Price */}
              <div className="mb-2">
                {price === null ? (
                  <p className="text-3xl font-bold text-white">Custom</p>
                ) : price === 0 ? (
                  <p className="text-3xl font-bold text-white">Free</p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-white">
                      ₹{price}
                      <span className="text-sm font-normal text-slate-400">
                        /{billing === "monthly" ? "mo" : "yr"}
                      </span>
                    </p>
                    {billing === "yearly" && plan.monthlyPrice && (
                      <p className="text-xs text-green-400 mt-1">
                        Save {yearlySavings(plan.monthlyPrice, plan.yearlyPrice!)}% vs monthly
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePayment(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isPopular
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90 shadow-lg"
                    : plan.id === "free"
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-slate-500 text-sm mt-12">
        Secure payments via Razorpay · All plans include 7-day free trial · Cancel anytime
      </p>
    </div>
  );
}