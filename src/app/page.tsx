"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────
interface LeadForm {
  name: string;
  email: string;
  phone: string;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            Vidya<span className="text-orange-500">Saathi</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
          <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-orange-500 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-orange-500 transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all">
            Log in
          </Link>
          <Link href="/signup" className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm">
            Start Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

function LeadCaptureForm({ source }: { source: string }) {
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-green-800 text-lg mb-1">You're on the list! 🎉</h3>
        <p className="text-green-700 text-sm mb-4">
          Your <strong>Free NEET Study Planner PDF</strong> is on its way to <strong>{form.email}</strong>
        </p>
        <Link
          href="/signup"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
        >
          Start Your NEET Prep Now →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Student's Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <div className="flex">
          <span className="flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium">
            +91
          </span>
          <input
            type="tel"
            placeholder="WhatsApp Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            pattern="[6-9][0-9]{9}"
            className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          />
        </div>
      </div>
      {errorMsg && (
        <p className="text-red-500 text-xs">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Get Free Study Planner PDF →"
        )}
      </button>
      <p className="text-xs text-gray-400 text-center">
        No spam. We'll also send you NEET prep tips on WhatsApp.
      </p>
    </form>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-orange-50 via-white to-white">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-40" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100 rounded-full translate-y-1/2 -translate-x-1/3 opacity-30" />

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              India's Smartest NEET & JEE Prep Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Crack NEET & JEE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                with AI by your side
              </span>
            </h1>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Personalised study plans, AI doubt solver, mock tests, and parent tracking — everything your NEET/JEE journey needs, starting at just <strong className="text-gray-800">₹99/month</strong>.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {["AI Doubt Solver", "Mock Tests", "Parent Dashboard", "Rank Predictor"].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                  <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {["🧑‍🎓", "👩‍🎓", "🧑‍🎓", "👩‍🎓"].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-sm">
                    {e}
                  </div>
                ))}
              </div>
              <span><strong className="text-gray-800">2,400+</strong> students already preparing</span>
            </div>
          </div>

          {/* Right — Lead Form */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100 border border-orange-100 p-7">
              {/* PDF Upsell Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
                <div className="w-10 h-12 bg-orange-500 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-amber-900 text-sm">🎁 Free Gift for You!</p>
                  <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                    Download our <strong>NEET Study Planner PDF</strong> — 12-month subject-wise schedule trusted by toppers.
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-1">Get your free planner</h2>
              <p className="text-gray-500 text-sm mb-4">Fill in your details and we'll send it instantly.</p>

              <LeadCaptureForm source="hero" />
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              100% Free
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "bg-orange-100 text-orange-600",
    title: "AI Doubt Solver",
    desc: "Get chapter-by-chapter explanations in seconds. Ask in Hindi or English — our AI understands both.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    color: "bg-blue-100 text-blue-600",
    title: "Full Mock Tests",
    desc: "NEET & JEE pattern tests with auto-grading, detailed solutions, and rank prediction.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "bg-purple-100 text-purple-600",
    title: "Parent Dashboard",
    desc: "Parents get real-time study reports, location tracking, and performance updates — all in one place.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    color: "bg-green-100 text-green-600",
    title: "Smart Revision",
    desc: "Spaced repetition flashcards and weak-topic targeting built into your daily study flow.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: "bg-pink-100 text-pink-600",
    title: "Community Forum",
    desc: "Ask peers, share notes, form study groups. A safe, moderated NEET community.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "bg-amber-100 text-amber-600",
    title: "Performance Analytics",
    desc: "Chapter-wise accuracy charts, time-per-question analysis, and improvement trends.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Everything you need to crack NEET
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Not just another notes app. VidyaSaathi is your complete AI-powered exam partner.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-orange-100 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "Student Monthly",
    price: "₹99",
    period: "/month",
    annualPrice: "₹799",
    annualPeriod: "/year",
    annualSaving: "Save ₹389",
    color: "border-gray-200",
    badge: null,
    features: [
      "AI Doubt Solver (unlimited)",
      "Full Mock Tests",
      "Smart Revision",
      "Performance Analytics",
      "Community Access",
      "Chapter Summaries",
    ],
    cta: "Start Learning →",
    ctaStyle: "bg-gray-900 hover:bg-gray-700 text-white",
  },
  {
    name: "Family Plan",
    price: "₹149",
    period: "/month",
    annualPrice: "₹1,199",
    annualPeriod: "/year",
    annualSaving: "Save ₹589",
    color: "border-orange-400 ring-2 ring-orange-400",
    badge: "Most Popular",
    features: [
      "Everything in Student",
      "Parent Dashboard",
      "Real-time Location Sharing",
      "Study Time Reports",
      "Parent WhatsApp Alerts",
      "Priority Support",
    ],
    cta: "Get Family Plan →",
    ctaStyle: "bg-orange-500 hover:bg-orange-600 text-white",
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Simple, affordable pricing
          </h2>
          <p className="text-gray-500 text-lg">
            Less than a cup of chai per day. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl border-2 ${plan.color} p-8 transition-all hover:shadow-xl`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <h3 className="font-bold text-gray-900 text-lg mb-4">{plan.name}</h3>

              {/* Monthly price */}
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              {/* Annual price */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">or <strong>{plan.annualPrice}</strong>{plan.annualPeriod}</span>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{plan.annualSaving}</span>
              </div>

              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block w-full text-center font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          🔒 Secure payment via Razorpay · No hidden charges
        </p>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Is there a free trial?",
    a: "We don't offer a free trial, but our plans start at just ₹99/month — less than the cost of a single coaching class. You can cancel any time if you're not satisfied.",
  },
  {
    q: "What is the NEET Study Planner PDF?",
    a: "It's a free 12-month subject-wise schedule designed by our academic team, covering Physics, Chemistry, and Biology topics aligned with NTA's NEET syllabus. It's a planning tool — full study material is inside the app.",
  },
  {
    q: "What's the difference between Student and Family plans?",
    a: "Both plans give the student full access to all learning features. The Family plan additionally gives parents a separate dashboard with real-time updates, location sharing, and WhatsApp alerts.",
  },
  {
    q: "Does it work for JEE as well?",
    a: "Yes! VidyaSaathi covers both NEET (Biology/Chemistry/Physics) and JEE (Maths/Chemistry/Physics) with separate test series and AI-curated content for each.",
  },
  {
    q: "Can parents and student use the same account?",
    a: "No — parents get their own login linked to the student via an invite code. This keeps each dashboard clean and focused for its user.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. All data is encrypted, stored securely on Indian servers, and never shared with third parties. Read our Privacy Policy for full details.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Frequently asked questions</h2>
          <p className="text-gray-500">Got more questions? Email us at <a href="mailto:contact@globalwebsaas.org" className="text-orange-500 hover:underline">contact@globalwebsaas.org</a></p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button
                className="w-full px-5 py-4 flex items-center justify-between text-left text-gray-900 font-medium text-sm hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PDFCTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-rose-500">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              📥 Get your free NEET Study Planner PDF
            </h2>
            <p className="text-white/80 leading-relaxed">
              A complete 12-month subject-wise roadmap. Used by thousands of NEET aspirants to stay on track.
            </p>
          </div>
          <div className="w-full md:w-80 bg-white rounded-2xl p-6 shadow-2xl">
            <LeadCaptureForm source="pdf_cta" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">V</span>
              </div>
              <span className="font-bold text-white text-base">VidyaSaathi</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              India's AI-powered NEET & JEE preparation platform. Smart study, real results.
            </p>
            <p className="text-xs mt-3 text-gray-600">
              A GlobalWebSaaS product · contact@globalwebsaas.org
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Log in</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign up</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 VidyaSaathi · vidhyasaathi.online · All rights reserved.</p>
          <p>Made with ❤️ for India's NEET aspirants</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <PDFCTASection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
