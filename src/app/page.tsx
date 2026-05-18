// src/app/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Eye, EyeOff, GraduationCap, Users, Zap, Shield, TrendingUp,
  MapPin, Loader2, BookOpen, Target, Star, Brain, Clock,
  ChevronRight, Check, ArrowRight, Flame, Trophy, AlertCircle,
  HeartCrack, Lightbulb, Rocket
} from "lucide-react";
import { cn } from "@/utils";

type Role = "student" | "parent";
type Mode = "login" | "signup";

export default function LandingPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const authRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("users").select("role").eq("id", data.session.user.id).single();
        const r = profile?.role ?? "student";
        window.location.href = `https://vidhyasaathi.online/${r}/dashboard`;
      }
    };
    check();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { error: signupErr } = await supabase.auth.signUp({
          email, password,
          options: { data: { role, full_name: fullName } },
        });
        if (signupErr) throw signupErr;
        setSuccess("Account created! Check your email to verify, then log in.");
        setMode("login");
      } else {
        const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
        if (loginErr) throw loginErr;
        const { data: profile } = await supabase
          .from("users").select("role").eq("id", data.user.id).single();
        const userRole = profile?.role ?? role;
        window.location.href = `https://vidhyasaathi.online/${userRole}/dashboard`;
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
  }

  const scrollToAuth = () => {
    authRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const painPoints = [
    { icon: HeartCrack, text: "Studied 10 hours but still blanked in the exam?", color: "text-red-400" },
    { icon: Clock, text: "Wasted months on wrong topics while rank slipped away?", color: "text-orange-400" },
    { icon: AlertCircle, text: "No one to solve your doubts at 2AM before the test?", color: "text-yellow-400" },
    { icon: Brain, text: "Forgot everything you studied just days before NEET?", color: "text-purple-400" },
  ];

  const features = [
    { icon: Brain, title: "AI Doubt Solver", desc: "Get instant, accurate answers to any NEET/JEE question — 24/7, no waiting.", color: "from-violet-500 to-purple-600" },
    { icon: Target, title: "Smart Revision", desc: "AI schedules what you need to revise and when, so nothing slips through.", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, title: "Chapter Tests", desc: "50+ questions per chapter with detailed explanations after each attempt.", color: "from-amber-500 to-orange-500" },
    { icon: TrendingUp, title: "Rank Tracker", desc: "Know exactly where you stand among lakhs of aspirants in real-time.", color: "from-green-500 to-emerald-500" },
    { icon: MapPin, title: "Parent Dashboard", desc: "Parents track location, scores, and mood — stay connected, stay calm.", color: "from-pink-500 to-rose-500" },
    { icon: Shield, title: "Burnout Guard", desc: "Detects stress patterns and suggests breaks before you break down.", color: "from-indigo-500 to-violet-500" },
  ];

  const testimonials = [
    { name: "Priya S.", score: "NEET 650+", text: "The AI doubt solver saved me during my last 2 months. Got answers instantly at midnight!", avatar: "P" },
    { name: "Arjun M.", score: "JEE Adv. 98%ile", text: "Smart revision made sure I never forgot what I studied. Game changer for retention.", avatar: "A" },
    { name: "Sneha K.", score: "NEET 620+", text: "My parents could track my progress without calling me every hour. Less stress for all!", avatar: "S" },
  ];

  const plans = [
    { name: "Free", price: 0, features: ["5 AI doubts/day", "Basic tests", "Community"], cta: "Start Free", color: "border-slate-600" },
    { name: "Student", price: 99, yearly: 799, features: ["Unlimited AI doubts", "Full test series", "Analytics", "Rank tracking"], cta: "Start Learning", color: "border-violet-500", popular: true },
    { name: "Family", price: 149, yearly: 1199, features: ["Everything in Student", "Parent dashboard", "Live location", "3 students"], cta: "Get Family Plan", color: "border-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">VidyaSaathi</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <button onClick={scrollToAuth}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
            <Flame className="w-4 h-4" />
            India's #1 AI-Powered NEET & JEE Prep Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="text-white">Stop Studying Hard.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Start Studying Smart.
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join <strong className="text-white">1,23,000+ aspirants</strong> who use AI to solve doubts instantly,
            revise smarter, and crack NEET & JEE with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={scrollToAuth}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 flex items-center gap-2">
              Start Free — No Credit Card <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#features"
              className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
              See how it works <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 mt-16">
            {[
              { value: "1,23,000+", label: "Students" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "Top 100", label: "Avg Rank Improvement" },
              { value: "24/7", label: "AI Support" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sound familiar? <span className="text-violet-400">You're not alone.</span>
            </h2>
            <p className="text-slate-400 text-lg">Every NEET/JEE aspirant faces these struggles. VidyaSaathi fixes all of them.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {painPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
                <div className={`shrink-0 mt-0.5 ${p.color}`}>
                  <p.icon className="w-5 h-5" />
                </div>
                <p className="text-slate-300 font-medium">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 text-green-400 font-semibold text-lg">
              <Lightbulb className="w-5 h-5" />
              VidyaSaathi solves every single one of these.
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to <span className="text-violet-400">crack the exam</span></h2>
            <p className="text-slate-400 text-lg">Built specifically for NEET & JEE aspirants by people who understand the grind.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all hover:bg-white/8 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-violet-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Students who <span className="text-violet-400">made it</span></h2>
            <p className="text-slate-400">Real results from real aspirants.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-violet-400 text-xs font-medium">{t.score}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">"{t.text}"</p>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple <span className="text-violet-400">pricing</span></h2>
            <p className="text-slate-400">Start free. Upgrade when you're ready. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`relative bg-white/5 border-2 ${plan.color} rounded-2xl p-6 flex flex-col ${plan.popular ? "scale-105 bg-violet-950/30" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <p className="text-4xl font-bold text-white">Free</p>
                  ) : (
                    <>
                      <p className="text-4xl font-bold text-white">₹{plan.price}<span className="text-base font-normal text-slate-400">/mo</span></p>
                      <p className="text-sm text-green-400 mt-1">or ₹{plan.yearly}/yr (save up to 33%)</p>
                    </>
                  )}
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={scrollToAuth}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-6">
            Have a coupon? Apply it on the <a href="/pricing" className="text-violet-400 hover:underline">full pricing page</a> for discounts!
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 rounded-3xl" />
          <Rocket className="w-12 h-12 text-white/80 mx-auto mb-4 relative" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative">
            Your rank won't improve by itself.
          </h2>
          <p className="text-white/80 text-lg mb-8 relative">
            Start your free 3-day trial today. No credit card required.
          </p>
          <button onClick={scrollToAuth}
            className="bg-white text-violet-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-all hover:scale-105 relative">
            Start Free Now →
          </button>
        </div>
      </section>

      {/* Auth Section */}
      <section ref={authRef} id="auth" className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-950">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Join VidyaSaathi</h2>
            <p className="text-slate-400">Start your journey to NEET/JEE success today.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {/* Role Toggle */}
            <div className="flex gap-1 p-1 bg-white/10 rounded-xl mb-6">
              <button onClick={() => { setRole("student"); setError(""); }}
                className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                  role === "student" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white")}>
                <GraduationCap className="h-4 w-4" /> Student
              </button>
              <button onClick={() => { setRole("parent"); setError(""); }}
                className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                  role === "parent" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white")}>
                <Users className="h-4 w-4" /> Parent
              </button>
            </div>

            <h3 className="text-xl font-bold mb-1">{mode === "login" ? "Welcome back!" : `Create ${role} account`}</h3>
            <p className="text-slate-400 text-sm mb-6">
              {mode === "login" ? `Sign in to your ${role} account` : `Join thousands of ${role === "student" ? "students cracking NEET/JEE" : "parents monitoring their child"}`}
            </p>

            {/* Google */}
            <button onClick={handleGoogle} disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium mb-4">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Full Name</label>
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-500" />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" minLength={6}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-500" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5 text-xs text-red-400">{error}</div>}
              {success && <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3.5 py-2.5 text-xs text-green-400">{success}</div>}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 mt-1">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Please wait…</> : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-4">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
                className="text-violet-400 font-medium hover:underline">
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span>© 2026 GlobalWebSaaS</span>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}