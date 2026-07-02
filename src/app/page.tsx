"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LeadForm { name: string; email: string; phone: string; course: string; }

function LeadCaptureForm() {
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "", course: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.course) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "landing" }),
      }).catch(() => {});
      sessionStorage.setItem("vs_lead", JSON.stringify(form));
      window.location.href = "/auth?redirect=/pricing";
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

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

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    city: "Indore, MP",
    exam: "NEET 2025 Aspirant",
    avatar: "PS",
    color: "bg-pink-100 text-pink-600",
    rating: 5,
    text: "The AI Doubt Solver literally saved me at 1 AM before my bio exam. Asked about Krebs cycle and got a full explanation with diagram. My Allen sir takes 2 days to reply on WhatsApp 😂 This is so much better.",
    feature: "AI Doubt Solver",
  },
  {
    name: "Rahul Meena",
    city: "Jaipur, Rajasthan",
    exam: "NEET 2025 Aspirant",
    avatar: "RM",
    color: "bg-blue-100 text-blue-600",
    rating: 5,
    text: "Got 114 PDFs free with the app. I downloaded all the Biology notes for Class 11 and 12 — the same material my coaching sells for ₹800. Vidhyasaathi me ye free mila. Kya deal hai yaar!",
    feature: "Free NEET PDFs",
  },
  {
    name: "Ananya Kulkarni",
    city: "Pune, Maharashtra",
    exam: "NEET 2026 Aspirant",
    avatar: "AK",
    color: "bg-purple-100 text-purple-600",
    rating: 5,
    text: "My parents were always asking 'padh rahi ho?' now they just check the parent dashboard. My mom said she can see my study hours and location — she stopped calling me every hour. Best feature honestly.",
    feature: "Parent Dashboard",
  },
  {
    name: "Kiran Patel",
    city: "Ahmedabad, Gujarat",
    exam: "JEE Main 2025",
    avatar: "KP",
    color: "bg-green-100 text-green-600",
    rating: 5,
    text: "JEE student here — the mock tests are actually good quality. Physics questions especially. Got my weak chapters identified in the first week itself. Analytics is 🔥. Worth way more than ₹499.",
    feature: "Mock Tests + Analytics",
  },
  {
    name: "Sneha Yadav",
    city: "Lucknow, UP",
    exam: "NEET 2025 Aspirant",
    avatar: "SY",
    color: "bg-amber-100 text-amber-600",
    rating: 5,
    text: "The Biology mind maps are EXACTLY what I needed before NEET. All 38 chapters with diagrams. I used to draw them manually — now I just open the app. Saved me 3 hours every week minimum.",
    feature: "Biology Mind Maps",
  },
  {
    name: "Arjun Nair",
    city: "Thiruvananthapuram, Kerala",
    exam: "NEET 2026 Aspirant",
    avatar: "AN",
    color: "bg-cyan-100 text-cyan-600",
    rating: 5,
    text: "Tried 3 other apps before this. All had paywalls inside paywalls. VidyaSaathi is genuinely one payment, everything unlocked. I've been using it for 2 months and haven't been asked to pay anything extra.",
    feature: "No Hidden Charges",
  },
  {
    name: "Divya Mishra",
    city: "Bhopal, MP",
    exam: "NEET 2025 Aspirant",
    avatar: "DM",
    color: "bg-rose-100 text-rose-600",
    rating: 5,
    text: "Referred my friend from my coaching batch using my code. She got ₹50 off and I earned ₹50. Free app ki tarah kaam kar raha hai 😄 Told 4 more people from my batch already.",
    feature: "Refer & Earn",
  },
  {
    name: "Rohan Verma",
    city: "Varanasi, UP",
    exam: "NEET 2025 Aspirant",
    avatar: "RV",
    color: "bg-orange-100 text-orange-600",
    rating: 5,
    text: "Study community is really active. Asked a doubt about Human Physiology at 11 PM and got 3 replies in 10 minutes. Better than any Telegram group I've been in. No spam either.",
    feature: "Study Community",
  },
];

const FEATURES = [
  { icon: "🤖", color: "bg-orange-100", title: "AI Doubt Solver", desc: "Instant explanations for any NEET & JEE question. Available 24/7 — no waiting for teachers." },
  { icon: "📄", color: "bg-green-100", title: "114 NEET PDFs Free", desc: "Complete Biology, Chemistry & Physics notes for Class 11 & 12. Instant download via Google Drive." },
  { icon: "📝", color: "bg-blue-100", title: "Full Mock Tests", desc: "NEET & JEE pattern tests with auto-grading, detailed solutions, and performance tracking." },
  { icon: "🧠", color: "bg-purple-100", title: "Biology Mind Maps", desc: "Visual mind maps for all 38 Biology chapters with NCERT diagrams and NEET key facts." },
  { icon: "👨‍👩‍👧", color: "bg-pink-100", title: "Parent Dashboard", desc: "Real-time study hours, location tracking, and performance reports — parents stay informed." },
  { icon: "📊", color: "bg-amber-100", title: "Performance Analytics", desc: "Chapter-wise accuracy, weak topic detection, and improvement trends to guide your prep." },
  { icon: "🔄", color: "bg-cyan-100", title: "Smart Revision", desc: "Spaced repetition flashcards and crossword puzzles. Never forget what you studied." },
  { icon: "👥", color: "bg-rose-100", title: "Study Community", desc: "Ask peers, share notes, form study groups. A moderated community of serious NEET aspirants." },
  { icon: "🎁", color: "bg-lime-100", title: "Refer & Earn ₹50", desc: "Share your code. Your friend gets ₹50 off. You earn ₹50 to your UPI. Real cash, automatically." },
  { icon: "📱", color: "bg-indigo-100", title: "Works on Any Device", desc: "Browser-based — phone, tablet, or laptop. Android app coming soon." },
];

const STATS = [
  { number: "38", label: "Biology Chapters\nwith Mind Maps" },
  { number: "114", label: "NEET PDFs\nIncluded Free" },
  { number: "24/7", label: "AI Doubt\nSolver" },
  { number: "₹499", label: "Lifetime Access\nNo Renewals" },
];

const WHAT_YOU_GET = [
  { icon: "🧬", label: "Biology Notes XI", sub: "35MB Complete" },
  { icon: "🧬", label: "Biology Notes XII", sub: "20MB Complete" },
  { icon: "🧬", label: "Biology Handbook", sub: "Quick Reference" },
  { icon: "⚗️", label: "Chemistry Notes XI", sub: "Complete Notes" },
  { icon: "⚗️", label: "Chemistry Notes XII", sub: "Complete Notes" },
  { icon: "⚗️", label: "Chemistry Revision", sub: "NEET Formulas" },
  { icon: "⚡", label: "Physics Notes XI", sub: "Complete Notes" },
  { icon: "⚡", label: "Physics Notes XII", sub: "Complete Notes" },
  { icon: "❓", label: "Biology Q-Bank", sub: "1000+ MCQs" },
  { icon: "⚡", label: "Quick Revision", sub: "All Chapters" },
  { icon: "🗺️", label: "Mind Map PDFs", sub: "All Subjects" },
  { icon: "📋", label: "+ 103 More Files", sub: "Instant Access" },
];

const FAQS = [
  { q: "What's included in ₹499 lifetime?", a: "Everything — AI Doubt Solver, 114 NEET PDFs (Biology, Chemistry, Physics Class 11+12), Full Mock Tests, Interactive Mind Maps, Performance Analytics, Parent Dashboard, Refer & Earn, Community access, and all future updates. No hidden charges, no renewals ever." },
  { q: "Do I get all 114 PDFs immediately after payment?", a: "Yes! The moment your payment goes through, all 114 PDFs unlock instantly via Google Drive. You can download them to your phone or access anytime online. No waiting, no manual approval." },
  { q: "Is there a free trial?", a: "No free trial — at ₹499 lifetime, it's already less than one coaching class. You get instant access to everything including 114 PDFs, AI tools, and all features permanently." },
  { q: "Does it work for JEE too?", a: "Yes! VidyaSaathi covers both NEET and JEE with separate test series, AI Doubt Solver, subject-wise analytics, and chapter-wise content for each exam pattern." },
  { q: "How does the Refer & Earn work?", a: "Once you're a paid student, you get a unique referral code. Share it with a friend — they get ₹50 off (pay ₹449 instead of ₹499). You earn ₹50 directly to your UPI ID. Automatic, no manual claiming needed." },
  { q: "Can parents and students use it together?", a: "Parents get their own separate dashboard linked to the student via an invite code. Both login separately — student uses the main app, parent gets a monitoring dashboard with study hours, location, and performance." },
  { q: "What devices does it work on?", a: "Works on any browser — phone, tablet, laptop. Android app coming soon on Play Store." },
  { q: "What if I'm not satisfied?", a: "Email us at contact@globalwebsaas.org within 7 days of purchase. We'll sort it out — we're a small team and we genuinely care about every student's experience." },
];

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [studentCount] = useState(247);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx(i => (i + 3 >= TESTIMONIALS.length ? 0 : i + 3));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleTestimonials = TESTIMONIALS.slice(testimonialIdx, testimonialIdx + 3).concat(
    testimonialIdx + 3 > TESTIMONIALS.length ? TESTIMONIALS.slice(0, (testimonialIdx + 3) - TESTIMONIALS.length) : []
  );

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
            <a href="#testimonials" className="hover:text-orange-500 transition-colors">Reviews</a>
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
        <section className="relative pt-20 md:pt-24 pb-12 md:pb-16 overflow-hidden bg-gradient-to-b from-orange-50 via-white to-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full -translate-y-1/3 translate-x-1/3 opacity-30 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100 rounded-full translate-y-1/2 -translate-x-1/3 opacity-30 blur-2xl" />

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-5 shadow-sm">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"/>
                  India's AI-Powered NEET & JEE Prep Platform
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                  Crack NEET & JEE<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                    with AI by your side
                  </span>
                </h1>

                <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                  AI Doubt Solver + Mock Tests (NEET & JEE) + Mind Maps + Parent Dashboard + 114 NEET PDFs — everything in one app at just <strong className="text-gray-900">₹499 lifetime</strong>.
                </p>

                {/* Social proof bar */}
                <div className="flex items-center gap-2 md:gap-3 mb-5 bg-green-50 border border-green-200 rounded-xl px-3 md:px-4 py-2.5 flex-wrap">
                  <div className="flex -space-x-2 flex-shrink-0">
                    {["PS", "RM", "AK", "KP", "SY"].map((a, i) => (
                      <div key={i} className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 border-2 border-white flex items-center justify-center text-white text-[8px] md:text-[9px] font-bold">
                        {a}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-green-700 font-medium">
                    <strong>247+ students</strong> already enrolled this month
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {["AI Doubt Solver 24/7", "114 NEET PDFs (Free)", "Mock Tests NEET+JEE", "Parent Dashboard", "Refer & Earn ₹50", "Lifetime Access"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Link href="/auth"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-orange-200">
                    Get Lifetime Access — ₹499 →
                  </Link>
                  <Link href="/auth" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                    Already have account? <span className="text-orange-500 font-medium">Log in</span>
                  </Link>
                </div>

                <p className="text-xs text-gray-400">One-time payment · Instant access · No renewals ever</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-gray-100">
                  {STATS.map(s => (
                    <div key={s.number} className="text-center">
                      <p className="text-2xl font-extrabold text-orange-500">{s.number}</p>
                      <p className="text-xs text-gray-500 whitespace-pre-line leading-tight mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
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
                <LeadCaptureForm />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="py-6 bg-white border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2">🔒 Razorpay Secured</span>
              <span className="flex items-center gap-2">⚡ Instant Activation</span>
              <span className="flex items-center gap-2">♾️ Lifetime Access</span>
              <span className="flex items-center gap-2">📱 Works on Any Device</span>
              <span className="flex items-center gap-2">🎁 114 PDFs Free</span>
              <span className="flex items-center gap-2">💰 Refer & Earn ₹50</span>
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
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">
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
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">
                Everything you need to crack NEET & JEE
              </h2>
              <p className="text-gray-500 text-lg">Complete AI-powered prep — with NEET PDF study material included free.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-16 bg-gradient-to-b from-orange-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
                ⭐ REAL STUDENT REVIEWS
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">
                What NEET & JEE aspirants say
              </h2>
              <p className="text-gray-500">From students across India who are using VidyaSaathi right now</p>
            </div>

            {/* Auto-rotating testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6">
              {visibleTestimonials.map((t, i) => (
                <div key={`${testimonialIdx}-${i}`}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-base">★</span>)}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">"{t.text}"</p>
                  {/* Feature tag */}
                  <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 w-fit">
                    ✓ Used: {t.feature}
                  </div>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.city} · {t.exam}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: Math.ceil(TESTIMONIALS.length / 3) }).map((_, i) => (
                <button key={i}
                  onClick={() => setTestimonialIdx(i * 3)}
                  className={`w-2 h-2 rounded-full transition-all ${Math.floor(testimonialIdx / 3) === i ? "bg-orange-500 w-6" : "bg-gray-300"}`}
                />
              ))}
            </div>

            {/* Overall rating */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 bg-white border border-orange-100 rounded-2xl px-6 py-3 shadow-sm">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-lg">★</span>)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm">4.9 / 5 rating</p>
                  <p className="text-xs text-gray-400">Based on {studentCount}+ student reviews</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REFER & EARN HIGHLIGHT */}
        <section className="py-12 bg-gradient-to-r from-rose-500 to-orange-500">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
              <div>
                <div className="text-2xl mb-2">🎁</div>
                <h3 className="text-xl md:text-2xl font-extrabold mb-2">Refer & Earn ₹50 per friend</h3>
                <p className="text-orange-100 text-sm max-w-md">
                  Every paid student gets a unique referral code. Share it with your batch. Your friend pays ₹449 (₹50 off). You earn ₹50 directly to your UPI. No limits on how many friends you can refer.
                </p>
              </div>
              <div className="bg-white/20 rounded-2xl p-5 text-center flex-shrink-0">
                <p className="text-4xl font-extrabold">₹50</p>
                <p className="text-orange-100 text-sm mt-1">per successful referral</p>
                <p className="text-orange-200 text-xs mt-2">Auto-transferred to your UPI</p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Why VidyaSaathi?</h2>
              <p className="text-gray-500">Compare with what you're already spending</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                <div className="p-2 md:p-4 text-xs md:text-sm font-bold text-gray-600">Feature</div>
                <div className="p-2 md:p-4 text-center">
                  <p className="text-xs md:text-sm font-bold text-gray-400">Coaching</p>
                  <p className="text-[10px] md:text-xs text-gray-400">₹50k+/yr</p>
                </div>
                <div className="p-2 md:p-4 text-center bg-orange-50">
                  <p className="text-xs md:text-sm font-bold text-orange-600">VidyaSaathi</p>
                  <p className="text-[10px] md:text-xs text-orange-500 font-bold">₹499 lifetime</p>
                </div>
              </div>
              {[
                ["AI Doubt Solver 24/7", "❌", "✅"],
                ["114 NEET PDFs (Free)", "❌", "✅ Free"],
                ["Interactive Mind Maps", "❌", "✅"],
                ["Mock Tests with Solutions", "Limited", "✅ Unlimited"],
                ["Parent Dashboard", "❌", "✅"],
                ["Performance Analytics", "❌", "✅"],
                ["Refer & Earn Cash", "❌", "✅ ₹50/referral"],
                ["Works on Phone/Tablet/PC", "❌", "✅"],
                ["Lifetime Access", "❌", "✅"],
              ].map(([feat, coaching, vs], i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="p-2 md:p-3 text-xs md:text-sm text-gray-700 font-medium leading-tight">{feat}</div>
                  <div className="p-2 md:p-3 text-center text-xs md:text-sm text-gray-400">{coaching}</div>
                  <div className="p-2 md:p-3 text-center text-xs md:text-sm text-green-600 font-semibold bg-orange-50/50">{vs}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-16 bg-white">
          <div className="max-w-lg mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">One price. Everything included.</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 text-left">
                {[
                  "114 NEET PDFs (Bio, Chem, Phy)",
                  "AI Doubt Solver (unlimited)",
                  "Full Mock Tests (NEET + JEE)",
                  "Interactive Mind Maps (38 ch)",
                  "Performance Analytics",
                  "Parent Dashboard",
                  "Study Community",
                  "Refer & Earn ₹50/referral",
                  "Smart Revision Tools",
                  "Crossword Puzzles",
                  "All Future Updates",
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
              <p className="text-xs text-gray-400 mt-3">🔒 Secure payment · Instant access · 7-day support guarantee</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-8">Frequently asked questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
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
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3">Ready to crack NEET & JEE?</h2>
            <p className="text-orange-100 text-lg mb-6">
              Join {studentCount}+ students already using VidyaSaathi. AI Doubt Solver, NEET & JEE Mock Tests, 114 NEET PDFs, Mind Maps & more — ₹499 lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-orange-50 transition-all shadow-lg">
                Get Lifetime Access — ₹499 →
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:border-white transition-all">
                View Full Details
              </Link>
            </div>
            <p className="text-orange-200 text-xs mt-4">Instant access · No renewals · Lifetime updates · Refer & Earn ₹50</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">V</span>
                </div>
                <span className="font-bold text-white text-base">Vidya<span className="text-orange-400">Saathi</span></span>
              </div>
              <p className="text-sm leading-relaxed">India's AI-powered NEET & JEE preparation platform. Smart study, real results. 114 NEET PDFs included free.</p>
              <p className="text-xs mt-2 text-gray-500">A GlobalWebSaaS product</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-3 text-sm">Platform</p>
              <div className="space-y-2 text-sm">
                <Link href="/auth" className="block hover:text-orange-400 transition-colors">Log in</Link>
                <Link href="/auth" className="block hover:text-orange-400 transition-colors">Sign up</Link>
                <Link href="/pricing" className="block hover:text-orange-400 transition-colors">Pricing</Link>
                <Link href="/student/resources" className="block hover:text-orange-400 transition-colors">Study Resources</Link>
                <Link href="/student/referral" className="block hover:text-orange-400 transition-colors">Refer & Earn</Link>
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
