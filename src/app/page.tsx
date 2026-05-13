// src/app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, GraduationCap, Users, Zap, Shield, TrendingUp, MapPin, Loader2, BookOpen, Target, Star } from "lucide-react";
import { cn } from "@/utils";

type Role = "student" | "parent";
type Mode = "login" | "signup";

export default function LandingPage() {
  const router   = useRouter();
  const [role, setRole]         = useState<Role>("student");
  const [mode, setMode]         = useState<Mode>("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const supabase = createClient();

  // ✅ If already logged in, redirect using role from public.users (not metadata)
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.session.user.id)
          .single();
        const r = profile?.role ?? "student";
        router.replace(`/${r}/dashboard`);
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

        // ✅ Always read role from public.users table, not user_metadata
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const userRole = profile?.role ?? role;
        const base = typeof window !== "undefined" ? window.location.origin : "";
        window.location.href = `${base}/${userRole}/dashboard`;
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

  const features = role === "student"
    ? [
        { icon: BookOpen, text: "50 practice questions per chapter" },
        { icon: Target,   text: "AI-powered doubt solver" },
        { icon: Zap,      text: "Chapter tests + full mocks" },
        { icon: Star,     text: "Real-time rank tracking" },
      ]
    : [
        { icon: MapPin,     text: "Live GPS location tracking" },
        { icon: TrendingUp, text: "Test scores & performance" },
        { icon: Shield,     text: "Safe zone alerts" },
        { icon: Users,      text: "Mood & burnout monitoring" },
      ];

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── LEFT PANEL — Branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 right-1/3 w-96 h-96 rounded-full bg-white/5" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-display font-bold text-2xl">RankSaathi</span>
          </div>

          <h1 className="text-5xl font-display font-bold text-white leading-tight mb-4">
            {role === "student"
              ? "Crack NEET & JEE with AI"
              : "Your child's success, always in sight"}
          </h1>
          <p className="text-brand-100 text-lg leading-relaxed mb-10">
            {role === "student"
              ? "Smart revision, AI doubt solving, chapter tests, and rank tracking — everything you need to top the exam."
              : "Real-time location, test scores, mood tracking, and alerts — stay connected with your child's preparation journey."}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex gap-8">
          {[
            { value: "1,23,000+", label: "Students" },
            { value: "98%",       label: "Satisfaction" },
            { value: "Top 100",   label: "Avg Rank Improvement" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-white font-display font-bold text-2xl">{s.value}</p>
              <p className="text-brand-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Auth Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">RankSaathi</span>
          </div>

          {/* Role toggle */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8">
            <button type="button" onClick={() => { setRole("student"); setError(""); }}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                role === "student" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
              <GraduationCap className="h-4 w-4" /> Student
            </button>
            <button type="button" onClick={() => { setRole("parent"); setError(""); }}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                role === "parent" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
              <Users className="h-4 w-4" /> Parent
            </button>
          </div>

          <h2 className="text-2xl font-display font-bold mb-1">
            {mode === "login" ? "Welcome back!" : `Create ${role} account`}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {mode === "login"
              ? `Sign in to your ${role} account`
              : `Join thousands of ${role === "student" ? "students cracking NEET/JEE" : "parents monitoring their child"}`}
          </p>

          {/* Google OAuth */}
          <button type="button" onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-accent transition-all text-sm font-medium mb-4">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Full Name</label>
                <input
                  type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder={role === "student" ? "Your full name" : "Parent's full name"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" minLength={6}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3.5 py-2.5 text-xs text-green-600 dark:text-green-400">
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-1">
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Please wait…</>
                : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              className="text-primary font-medium hover:underline">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {role === "parent" && mode === "login" && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              After login, link your child using their 8-char invite code from their Settings page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
