// src/app/auth/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/toaster";
import { GraduationCap, Users, Loader2, ArrowLeft, Phone, Mail } from "lucide-react";
import { cn } from "@/utils";
import Link from "next/link";
import type { UserRole, ExamType } from "@/types";

type AuthStep = "method" | "phone_otp" | "email" | "otp_verify" | "onboard";
type LoginMethod = "phone" | "email" | "google";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "login";
  const initialRole = (searchParams.get("role") ?? "student") as UserRole;

  const [role, setRole] = useState<UserRole>(initialRole);
  const [step, setStep] = useState<AuthStep>("method");
  const [method, setMethod] = useState<LoginMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [examType, setExamType] = useState<ExamType[]>(["NEET"]);
  const [targetYear, setTargetYear] = useState(2026);

  const supabase = createClient();

  // --- Google login ---
  async function handleGoogleLogin() {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setIsLoading(false);
  }

  // --- Phone OTP send ---
  async function handleSendOTP() {
    if (!phone || phone.length < 10) {
      toast({ title: "Invalid phone", description: "Enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "OTP Sent!", description: "Check your SMS for the 6-digit code" });
      setStep("otp_verify");
    }
    setIsLoading(false);
  }

  // --- Verify OTP ---
  async function handleVerifyOTP() {
    if (!otp || otp.length < 6) {
      toast({ title: "Invalid OTP", description: "Enter the 6-digit code", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });
    if (error) {
      toast({ title: "Invalid OTP", description: error.message, variant: "destructive" });
    } else if (data.user) {
      const isNewUser = !data.user.user_metadata?.role;
      if (isNewUser) {
        setStep("onboard");
      } else {
        redirectToDashboard(data.user.user_metadata.role);
      }
    }
    setIsLoading(false);
  }

  // --- Email login/signup ---
  async function handleEmailAuth() {
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Enter email and password", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    if (tab === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else if (data.user) {
        setStep("onboard");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else if (data.user) {
        redirectToDashboard(data.user.user_metadata?.role ?? "student");
      }
    }
    setIsLoading(false);
  }

  // --- Onboard (save role & profile) ---
  async function handleOnboard() {
    if (!fullName.trim()) {
      toast({ title: "Required", description: "Enter your full name", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update user metadata with role
    await supabase.auth.updateUser({
      data: { role, full_name: fullName },
    });

    if (role === "student") {
      // Insert student profile
      await supabase.from("students").upsert({
        user_id: user.id,
        exam_type: examType,
        target_year: targetYear,
        class_level: "dropper",
        invite_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        current_streak: 0,
        total_study_hours: 0,
      });
    } else if (role === "parent") {
      await supabase.from("parents").upsert({ user_id: user.id });
    }

    toast({ title: "Welcome to RankSaathi! 🎉", variant: "success" } as any);
    redirectToDashboard(role);
    setIsLoading(false);
  }

  function redirectToDashboard(r: string) {
    const redirect = searchParams.get("redirect");
    router.push(redirect ?? `/${r}/dashboard`);
  }

  // ---- UI ----
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Toaster />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold">RS</span>
            </div>
            <span className="font-display font-bold text-xl">RankSaathi</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            {tab === "signup" ? "Create your account" : "Welcome back"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-6">
          {/* Back button for multi-step */}
          {step !== "method" && (
            <button
              onClick={() => setStep(step === "otp_verify" ? "method" : step === "onboard" ? "method" : "method")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}

          {/* STEP: Choose Role */}
          {step === "method" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">I am a</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["student", "parent"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        role === r
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {r === "student" ? (
                        <GraduationCap className={cn("h-6 w-6", role === r ? "text-primary" : "text-muted-foreground")} />
                      ) : (
                        <Users className={cn("h-6 w-6", role === r ? "text-primary" : "text-muted-foreground")} />
                      )}
                      <span className={cn("text-sm font-medium capitalize", role === r ? "text-primary" : "text-muted-foreground")}>
                        {r}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Google login */}
              <Button
                variant="outline"
                className="w-full h-11 gap-2"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              {/* Phone */}
              <Button
                variant="outline"
                className="w-full h-11 gap-2"
                onClick={() => { setMethod("phone"); setStep("phone_otp"); }}
              >
                <Phone className="h-4 w-4" />
                Mobile Number (OTP)
              </Button>

              {/* Email */}
              <Button
                variant="outline"
                className="w-full h-11 gap-2"
                onClick={() => { setMethod("email"); setStep("email"); }}
              >
                <Mail className="h-4 w-4" />
                Email & Password
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                <Link
                  href={tab === "login" ? "/auth?tab=signup" : "/auth"}
                  className="text-primary hover:underline font-medium"
                >
                  {tab === "login" ? "Sign up" : "Login"}
                </Link>
              </p>
            </div>
          )}

          {/* STEP: Phone OTP */}
          {step === "phone_otp" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-lg">Enter your mobile number</h2>
                <p className="text-sm text-muted-foreground">We'll send a 6-digit OTP to verify</p>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-muted rounded-lg border text-sm font-medium text-muted-foreground">
                    +91
                  </div>
                  <Input
                    type="tel"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    maxLength={10}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleSendOTP} disabled={isLoading || phone.length < 10}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
              </Button>
            </div>
          )}

          {/* STEP: OTP Verify */}
          {step === "otp_verify" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-lg">Verify OTP</h2>
                <p className="text-sm text-muted-foreground">Sent to +91 {phone}</p>
              </div>
              <div className="space-y-2">
                <Label>6-digit OTP</Label>
                <Input
                  type="number"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  maxLength={6}
                  className="text-center text-xl tracking-widest"
                />
              </div>
              <Button className="w-full" onClick={handleVerifyOTP} disabled={isLoading || otp.length < 6}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
              </Button>
              <button
                className="text-xs text-muted-foreground hover:text-foreground text-center w-full transition-colors"
                onClick={() => { setOtp(""); handleSendOTP(); }}
              >
                Didn't receive OTP? Resend
              </button>
            </div>
          )}

          {/* STEP: Email auth */}
          {step === "email" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-lg">
                  {tab === "signup" ? "Create account" : "Login"}
                </h2>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button className="w-full" onClick={handleEmailAuth} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : tab === "signup" ? "Sign Up" : "Login"}
              </Button>
            </div>
          )}

          {/* STEP: Onboarding */}
          {step === "onboard" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-lg">Complete your profile</h2>
                <p className="text-sm text-muted-foreground">Just a few details to personalise your experience</p>
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
              </div>

              {role === "student" && (
                <>
                  <div className="space-y-2">
                    <Label>Target Exam(s)</Label>
                    <div className="flex flex-wrap gap-2">
                      {(["NEET", "JEE_MAIN", "JEE_ADVANCED"] as ExamType[]).map((exam) => (
                        <button
                          key={exam}
                          onClick={() => setExamType((prev) =>
                            prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]
                          )}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            examType.includes(exam)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {exam === "NEET" ? "NEET UG" : exam === "JEE_MAIN" ? "JEE Main" : "JEE Advanced"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Year</Label>
                    <div className="flex gap-2">
                      {[2026, 2027].map((year) => (
                        <button
                          key={year}
                          onClick={() => setTargetYear(year)}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                            targetYear === year
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button className="w-full" onClick={handleOnboard} disabled={isLoading || !fullName.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Started 🚀"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
