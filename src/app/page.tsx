"use client";

import { useState } from "react";
import Link from "next/link";

interface LeadForm { name: string; email: string; phone: string; course: string; }

function LeadCaptureForm({ t }: { t: any }) {
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "", course: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.course) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      // Save lead
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "landing" }),
      }).catch(() => {});
      // Store in sessionStorage so pricing page can use it
      sessionStorage.setItem("vs_lead", JSON.stringify(form));
      // Go directly to pricing page
      window.location.href = "/auth?redirect=/pricing";
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-green-800 text-lg mb-1">Taking you to checkout! 🎉</h3>
        <p className="text-green-700 text-sm mb-4">Complete your ₹499 payment to unlock everything.</p>
        <Link href="/pricing" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
          Go to Checkout →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {(["NEET", "JEE", "BOTH"] as const).map((c) => (
          <button key={c} type="button" onClick={() => setForm({ ...form, course: c })}
            className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${form.course === c ? "bg-orange-500 border-orange-500 text-white shadow-md" : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"}`}>
            {c}
          </button>
        ))}
      </div>
      {!form.course && <p className="text-xs text-orange-500 font-medium">Please select your exam above</p>}
      <input type="text" placeholder="Student's Full Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      <input type="email" placeholder="Email Address" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      <div className="flex">
        <span className="flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium">+91</span>
        <input type="tel" placeholder="WhatsApp Number" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} required pattern="[6-9][0-9]{9}"
          className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>
      {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}
      <button type="submit" disabled={status === "loading"}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md">
        {status === "loading" ? "Redirecting..." : "Get Lifetime Access — ₹499 →"}
      </button>
      <p className="text-xs text-gray-400 text-center">🔒 Secure payment via Razorpay · No spam</p>
    </form>
  );
}

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const FEATURES = [
    { icon: "🤖", color: "bg-orange-100", title: "AI Doubt Solver", desc: "Get instant explanations for any NEET & JEE question in English. Available 24/7 — no waiting for teachers." },
    { icon: "📄", color: "bg-green-100", title: "114 NEET PDFs Included", desc: "Complete Biology, Chemistry & Physics notes for Class 11 & 12. Quick revision, question banks, mind maps — all free." },
    { icon: "📝", color: "bg-blue-100", title: "Full Mock Tests", desc: "NEET & JEE pattern tests with auto-grading, detailed solutions, and rank prediction after every test." },
    { icon: "🧠", color: "bg-purple-100", title: "Interactive Mind Maps", desc: "Visual mind maps for all 38 Biology chapters with NCERT diagrams, mnemonics, and NEET key facts." },
    { icon: "👨‍👩‍👧", color: "bg-pink-100", title: "Parent Dashboard", desc: "Real-time study reports, location tracking, and performance updates — parents stay connected." },
    { icon: "📊", color: "bg-amber-100", title: "Performance Analytics", desc: "Chapter-wise accuracy charts, weak topic targeting, and improvement trends to guide your study." },
    { icon: "🔄", color: "bg-cyan-100", title: "Smart Revision", desc: "Spaced repetition flashcards and crossword puzzles make revision stick. Never forget what you studied." },
    { icon: "👥", color: "bg-rose-100", title: "Study Community", desc: "Ask peers, share notes, form study groups. A safe moderated community of NEET aspirants." },
  ];

  const STATS = [
    { number: "38", label: "Biology Chapters\nwith AI Diagrams" },
    { number: "114", label: "NEET PDFs\nIncluded Free" },
    { number: "24/7", label: "AI Doubt\nSolver" },
    { number: "₹499", label: "Lifetime Access\nNo Renewals" },
  ];

  const FAQS = [
    { q: "What's included in ₹499 lifetime?", a: "Everything — AI Doubt Solver, 114 NEET PDFs (Biology, Chemistry, Physics Class 11+12), Full Mock Tests, Interactive Mind Maps, Performance Analytics, Parent Dashboard, Community access, and all future updates. No hidden charges, no renewals ever." },
    { q: "Do I get all 114 PDFs immediately?", a: "Yes! Once you pay ₹499, you get instant access to all 114 PDFs via Google Drive — Biology Handbook, Class 11 & 12 complete notes, Question Banks, Quick Revision notes, Mind Map PDFs for all subjects." },
    { q: "Is there a free trial?", a: "No free trial — at ₹499 lifetime, it's less than one coaching class for both NEET & JEE students. You get instant access to everything including 114 PDFs, AI tools, and all features forever." },
    { q: "Does it work for JEE too?", a: "Yes! VidyaSaathi covers both NEET and JEE with separate test series, AI-curated content, and subject-wise material for each." },
    { q: "Can parents and student use together?", a: "Parents get their own separate dashboard linked to the student via invite code. Both login separately." },
    { q: "What devices does it work on?", a: "Works on any browser — phone, tablet, laptop. Android app coming soon on Play Store." },
  ];

  const WHAT_YOU_GET = [
    { icon: "🧬", label: "Biology Notes XI", sub: "35MB Complete" },
    { icon: "🧬", label: "Biology Notes XII", sub: "20MB Complete" },
    { icon: "🧬", label: "Biology Handbook", sub: "Quick Reference" },
    { icon: "⚗️", label: "Chemistry Notes XI", sub: "Complete Notes" },
    { icon: "⚗️", label: "Chemistry Notes XII", sub: "Complete Notes" },
    { icon: "⚗️", label: "Chemistry Revision", sub: "NEET Formula" },
    { icon: "⚡", label: "Physics Notes XI", sub: "Complete Notes" },
    { icon: "⚡", label: "Physics Notes XII", sub: "Complete Notes" },
    { icon: "❓", label: "Biology Q-Bank", sub: "1000+ MCQs" },
    { icon: "⚡", label: "Quick Revision", sub: "All Chapters" },
    { icon: "🗺️", label: "Mind Map PDFs", sub: "All Subjects" },
    { icon: "📋", label: "+ 103 More Files", sub: "Instant Access" },
  ];

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">Vidya<span className="text-orange-500">Saathi</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
            <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
            <a href="#pdfs" className="hover:text-orange-500 transition-colors">PDFs</a>
            <a href="#pricing" className="hover:text-orange-500 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-orange-500 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all">Log in</Link>
            <Link href="/auth" className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm">Start Now →</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-b from-orange-50 via-white to-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full -translate-y-1/3 translate-x-1/3 opacity-30 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100 rounded-full translate-y-1/2 -translate-x-1/3 opacity-30 blur-2xl" />

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              {/* Left — Hero content */}
              <div className="pt-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-5 shadow-sm">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"/>
                  India's AI-Powered NEET & JEE Prep Platform
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                  Crack NEET & JEE<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                    with AI by your side
                  </span>
                </h1>

                <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                  AI Doubt Solver + Mock Tests (NEET & JEE) + Mind Maps + Parent Dashboard + 114 NEET PDFs — everything in one app at just <strong className="text-gray-900">₹499 lifetime</strong>.
                </p>

                {/* Value props */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {["AI Doubt Solver 24/7", "114 NEET PDFs (Free)", "Mock Tests NEET+JEE", "Parent Dashboard", "Interactive Mind Maps", "Lifetime Access"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <Link href="/auth"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-orange-200">
                    Get Lifetime Access — ₹499 →
                  </Link>
                  <Link href="/auth" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                    Already have account? <span className="text-orange-500 font-medium">Log in</span>
                  </Link>
                </div>

                <p className="text-xs text-gray-400">One-time payment · Instant access · No renewals ever</p>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mt-8 pt-6 border-t border-gray-100">
                  {STATS.map(s => (
                    <div key={s.number} className="text-center">
                      <p className="text-2xl font-extrabold text-orange-500">{s.number}</p>
                      <p className="text-xs text-gray-500 whitespace-pre-line leading-tight mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
                <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl p-4 mb-5 text-center">
                  <p className="font-bold text-lg">Get Lifetime Access</p>
                  <p className="text-orange-100 text-sm">App + 114 PDFs + All Features</p>
                  <div className="flex items-baseline justify-center gap-2 mt-1">
                    <span className="text-3xl font-extrabold">₹499</span>
                    <span className="text-orange-200 line-through text-sm">₹1,499</span>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">67% OFF</span>
                  </div>
                </div>
                <LeadCaptureForm t={{}} />
              </div>
            </div>
          </div>
        </section>

        {/* PDF VALUE SECTION */}
        <section id="pdfs" className="py-16 bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
                📚 FREE WITH YOUR ₹499 PLAN
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                114 NEET Study Files — <span className="text-green-600">Absolutely Free</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Complete NEET study material — Biology, Chemistry & Physics for Class 11 & 12. JEE students get full app access with AI tools & mock tests.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {WHAT_YOU_GET.map((item, i) => (
                <div key={i} className="bg-white border border-green-100 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-gray-800 text-sm font-semibold leading-tight">{item.label}</p>
                    <p className="text-gray-400 text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-center text-white">
              <p className="font-bold text-xl mb-1">Worth ₹999 · Yours for FREE</p>
              <p className="text-green-100 text-sm mb-4">NEET students: all 114 PDFs unlock instantly. JEE students: full AI tools, mock tests, mind maps & analytics.</p>
              <Link href="/auth"
                className="inline-flex items-center gap-2 bg-white text-green-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-green-50 transition-all shadow-lg">
                Get App + PDFs for ₹499 →
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                Everything you need to crack NEET & JEE
              </h2>
              <p className="text-gray-500 text-lg">Complete AI-powered prep for NEET & JEE — with NEET PDF study material included free.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Why VidyaSaathi?</h2>
              <p className="text-gray-500">Compare with what you're already spending</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                <div className="p-4 text-sm font-bold text-gray-600">Feature</div>
                <div className="p-4 text-center">
                  <p className="text-sm font-bold text-gray-400">Coaching Classes</p>
                  <p className="text-xs text-gray-400">₹50,000+/year</p>
                </div>
                <div className="p-4 text-center bg-orange-50">
                  <p className="text-sm font-bold text-orange-600">VidyaSaathi</p>
                  <p className="text-xs text-orange-500 font-bold">₹499 lifetime</p>
                </div>
              </div>
              {[
                ["AI Doubt Solver 24/7", "❌", "✅"],
                ["Complete NEET Notes (114 PDFs)", "❌", "✅ Free"],
                ["Interactive Mind Maps + Diagrams", "❌", "✅"],
                ["Mock Tests with Solutions", "Limited", "✅ Unlimited"],
                ["Parent Dashboard", "❌", "✅"],
                ["Performance Analytics", "❌", "✅"],
                ["English Interface", "Limited", "✅"],
                ["Access from Phone/Tablet/PC", "❌", "✅"],
                ["Lifetime Access", "❌", "✅"],
              ].map(([feat, coaching, vs], i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="p-3 text-sm text-gray-700 font-medium">{feat}</div>
                  <div className="p-3 text-center text-sm text-gray-400">{coaching}</div>
                  <div className="p-3 text-center text-sm text-green-600 font-semibold bg-orange-50/50">{vs}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-16 bg-white">
          <div className="max-w-lg mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">One price. Everything included.</h2>
            <p className="text-gray-500 mb-8">No monthly fees. No renewals. Pay once, use forever.</p>

            <div className="bg-gradient-to-br from-orange-50 to-rose-50 border-2 border-orange-300 rounded-2xl p-8 relative shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg">
                  🔥 LAUNCH OFFER — LIMITED TIME
                </span>
              </div>

              <div className="flex items-baseline justify-center gap-3 mb-2 mt-2">
                <span className="text-6xl font-extrabold text-gray-900">₹499</span>
                <div>
                  <span className="text-gray-400 line-through text-xl block">₹1,499</span>
                  <span className="text-green-600 text-sm font-bold">Save ₹1,000</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-6">One-time payment · Lifetime access · No renewals</p>

              <div className="grid grid-cols-2 gap-2 mb-6 text-left">
                {[
                  "114 NEET PDFs (Biology, Chem, Phy)",
                  "AI Doubt Solver (unlimited)",
                  "Full Mock Tests (NEET + JEE)",
                  "Interactive Mind Maps (38 chapters)",
                  "Performance Analytics",
                  "Parent Dashboard",
                  "Study Community",
                  "Crossword Puzzles",
                  "Smart Revision Tools",
                  "All Future Updates",
                  "English Interface",
                  "Lifetime Access",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>

              <Link href="/auth"
                className="block w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 text-white font-bold py-4 rounded-xl text-base transition-all shadow-lg shadow-orange-200 mb-3">
                Get Lifetime Access — ₹499 →
              </Link>
              <Link href="/pricing"
                className="block w-full border-2 border-orange-300 text-orange-600 font-bold py-3 rounded-xl text-sm hover:bg-orange-50 transition-all">
                Buy Now for ₹499
              </Link>
              <p className="text-xs text-gray-400 mt-3">🔒 Secure payment · Instant access · contact@globalwebsaas.org</p>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL PLACEHOLDER */}
        <section className="py-12 bg-orange-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Trusted by NEET aspirants across India</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Priya S.", city: "Indore", text: "The AI doubt solver is amazing — I get instant answers at midnight when I'm studying. Worth every rupee!", exam: "NEET 2025" },
                { name: "Rahul M.", city: "Bhopal", text: "Got all the Biology PDFs free with the app. Saved me ₹500 on study material. Best investment!", exam: "NEET 2025" },
                { name: "Ananya K.", city: "Jabalpur", text: "My parents love the dashboard. They can see exactly what I'm studying. Made them trust me more!", exam: "NEET 2026" },
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 text-left">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-sm">★</span>)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.city} · {t.exam}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 bg-white">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Frequently asked questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                    <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {faqOpen === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              More questions? Email us at <a href="mailto:contact@globalwebsaas.org" className="text-orange-500 font-medium">contact@globalwebsaas.org</a>
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-rose-500">
          <div className="max-w-2xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Ready to crack NEET & JEE?</h2>
            <p className="text-orange-100 text-lg mb-6">Get instant access to everything. Get AI Doubt Solver, NEET & JEE Mock Tests, 114 NEET PDFs, Mind Maps & more — all for ₹499 lifetime.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-orange-50 transition-all shadow-lg">
                Get Lifetime Access — ₹499 →
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:border-white transition-all">
                Buy Now ₹499
              </Link>
            </div>
            <p className="text-orange-200 text-xs mt-4">Instant access · No renewals · Lifetime updates</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">V</span>
                </div>
                <span className="font-bold text-white text-base">Vidya<span className="text-orange-400">Saathi</span></span>
              </div>
              <p className="text-sm leading-relaxed">India's AI-powered NEET & JEE preparation platform. Smart study, real results. NEET PDF material included free.</p>
              <p className="text-xs mt-2 text-gray-500">A GlobalWebSaaS product</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-3 text-sm">Platform</p>
              <div className="space-y-2 text-sm">
                <Link href="/auth" className="block hover:text-orange-400 transition-colors">Log in</Link>
                <Link href="/auth" className="block hover:text-orange-400 transition-colors">Sign up</Link>
                <Link href="/pricing" className="block hover:text-orange-400 transition-colors">Pricing</Link>
                <Link href="/student/resources" className="block hover:text-orange-400 transition-colors">Study Resources</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-3 text-sm">Legal</p>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block hover:text-orange-400 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-orange-400 transition-colors">Terms of Service</Link>
                <a href="mailto:contact@globalwebsaas.org" className="block hover:text-orange-400 transition-colors">Contact Us</a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-3 text-sm">Contact</p>
              <div className="space-y-2 text-sm">
                <p>📧 contact@globalwebsaas.org</p>
                <p>🌐 vidhyasaathi.online</p>
                <p>📍 Indore, Madhya Pradesh</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs">© 2026 VidyaSaathi · vidhyasaathi.online · All rights reserved.</p>
            <p className="text-xs">Made with ❤️ for India's NEET aspirants</p>
          </div>
        </div>
      </footer>
    </>
  );
}
