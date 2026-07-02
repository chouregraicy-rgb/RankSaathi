// src/app/student/settings/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User, Bell, Sun, Moon, Smartphone,
  Save, GraduationCap, CheckCircle2,
  Link2, Copy, RefreshCw, Share2, Users, IndianRupee,
} from "lucide-react";
import { cn } from "@/utils";
import { createClient } from "@/lib/supabase/client";

const EXAMS       = ["NEET", "JEE Main", "JEE Advanced"];
const YEARS       = [2025, 2026, 2027];
const CLASS_LEVELS = ["Class 11", "Class 12", "Dropper"];

export default function SettingsPage() {
  const [saved, setSaved]             = useState(false);
  const [mounted, setMounted]         = useState(false); // ✅ fix hydration
  const { theme, setTheme }           = useTheme();

  // ✅ Real user ID from Supabase auth
  const [userId, setUserId]           = useState<string | null>(null);
  const [inviteCode, setInviteCode]   = useState("--------");
  const [loadingCode, setLoadingCode] = useState(false);
  const [copied, setCopied]           = useState(false);
  const [upiId, setUpiId]             = useState("");
  const [upiSaved, setUpiSaved]       = useState(false);
  const [upiError, setUpiError]       = useState("");

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport:  true,
    streakAlert:   true,
    testResults:   true,
    revisionDue:   true,
  });

  const [profile, setProfile] = useState({
    fullName:    "",
    email:       "",
    phone:       "",
    targetExams: ["NEET"],
    targetYear:  2026,
    classLevel:  "Class 12",
    coachingName:"",
    city:        "",
  });

  // ✅ Fix hydration — only render theme UI after mount
  useEffect(() => { setMounted(true); }, []);

  // ✅ Get real user ID on mount
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Prefill profile from DB
      const { data: profile } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfile(prev => ({
          ...prev,
          fullName: profile.full_name ?? "",
          email:    profile.email ?? "",
        }));
      }

      // Load UPI ID from students table
      const { data: student } = await supabase
        .from("students")
        .select("upi_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (student?.upi_id) setUpiId(student.upi_id);
    };
    init();
  }, []);

  // Fetch invite code once userId is known
  useEffect(() => {
    if (!userId) return;
    fetchInviteCode();
  }, [userId]);

  async function fetchInviteCode() {
    if (!userId) return;
    setLoadingCode(true);
    try {
      const res  = await fetch(`/api/student/invite-code?userId=${userId}`);
      if (!res.ok) { setInviteCode("OFFLINE1"); return; }
      const data = await res.json();
      if (data.invite_code) setInviteCode(data.invite_code);
    } catch { setInviteCode("OFFLINE1"); }
    finally  { setLoadingCode(false); }
  }

  async function regenerateCode() {
    if (!userId) return;
    setLoadingCode(true);
    try {
      const res  = await fetch("/api/student/invite-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.invite_code) setInviteCode(data.invite_code);
    } catch { /* keep current */ }
    finally  { setLoadingCode(false); }
  }

  function copyCode() {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareCode() {
    if (navigator.share) {
      navigator.share({
        title: "Join me on VidyaSaathi",
        text:  `Use my invite code ${inviteCode} to link as my parent on VidyaSaathi!`,
        url:   `${window.location.origin}/parent/link?code=${inviteCode}`,
      });
    } else {
      copyCode();
    }
  }

  async function saveUpi() {
    if (!userId || !upiId.trim()) return;
    setUpiError("");
    // Basic UPI format validation: something@something
    if (!/^[\w.\-]+@[\w.\-]+$/.test(upiId.trim())) {
      setUpiError("Enter a valid UPI ID (e.g. yourname@upi or 9876543210@paytm)");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from("students")
      .update({ upi_id: upiId.trim().toLowerCase() })
      .eq("user_id", userId);
    if (error) { setUpiError("Could not save. Try again."); return; }
    setUpiSaved(true);
    setTimeout(() => setUpiSaved(false), 3000);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <DashboardLayout role="student" title="Settings">
      <div className="max-w-2xl space-y-5">

        {/* Profile */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-brand-500" />
              <CardTitle className="text-base font-display">Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name</Label>
                <Input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} placeholder="Your full name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="your@email.com" type="email" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">City</Label>
                <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="Your city" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Coaching Centre (optional)</Label>
                <Input value={profile.coachingName} onChange={(e) => setProfile({ ...profile, coachingName: e.target.value })} placeholder="Allen, FIITJEE, etc." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam Preferences */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-brand-500" />
              <CardTitle className="text-base font-display">Payout Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Add your UPI ID to receive ₹50 referral rewards automatically when a friend you referred purchases VidyaSaathi.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs">UPI ID</Label>
              <div className="flex gap-2">
                <Input
                  value={upiId}
                  onChange={(e) => { setUpiId(e.target.value); setUpiError(""); setUpiSaved(false); }}
                  placeholder="yourname@upi  or  9876543210@paytm"
                  className="font-mono text-sm"
                />
                <Button onClick={saveUpi} size="sm" className="px-4 shrink-0">
                  {upiSaved ? <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Saved</> : "Save"}
                </Button>
              </div>
              {upiError && <p className="text-xs text-red-500">{upiError}</p>}
              {upiSaved && <p className="text-xs text-green-600">✅ UPI ID saved — referral payouts will go here.</p>}
            </div>
            <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs text-muted-foreground">
              Accepted formats: <span className="font-mono">name@upi</span>, <span className="font-mono">number@paytm</span>, <span className="font-mono">number@ybl</span>, <span className="font-mono">name@okaxis</span>
            </div>
          </CardContent>
        </Card>

        {/* Exam Preferences */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-brand-500" />
              <CardTitle className="text-base font-display">Exam Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs mb-2 block">Target Exam(s)</Label>
              <div className="flex flex-wrap gap-2">
                {EXAMS.map((exam) => (
                  <button key={exam} type="button"
                    onClick={() => setProfile((prev) => ({
                      ...prev,
                      targetExams: prev.targetExams.includes(exam)
                        ? prev.targetExams.filter((e) => e !== exam)
                        : [...prev.targetExams, exam],
                    }))}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      profile.targetExams.includes(exam)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Target Year</Label>
              <div className="flex gap-2">
                {YEARS.map((year) => (
                  <button key={year} type="button"
                    onClick={() => setProfile({ ...profile, targetYear: year })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                      profile.targetYear === year
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Class Level</Label>
              <div className="flex gap-2 flex-wrap">
                {CLASS_LEVELS.map((level) => (
                  <button key={level} type="button"
                    onClick={() => setProfile({ ...profile, classLevel: level })}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
                      profile.classLevel === level
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand-500" />
              <CardTitle className="text-base font-display">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {[
              { key: "dailyReminder", label: "Daily Study Reminder",   desc: "Get reminded to study every day"          },
              { key: "weeklyReport",  label: "Weekly Progress Report", desc: "Summary of your week every Sunday"        },
              { key: "streakAlert",   label: "Streak Alerts",          desc: "Get notified about your study streak"     },
              { key: "testResults",   label: "Test Result Alerts",     desc: "Notification when test results are ready" },
              { key: "revisionDue",   label: "Revision Due Reminders", desc: "When chapters are due for revision"       },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button type="button"
                  onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={cn(
                    "w-11 h-6 rounded-full transition-all relative flex-shrink-0",
                    notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span className={cn(
                    "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                    notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ✅ Appearance — only renders after mount to fix hydration */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-brand-500" />
              <CardTitle className="text-base font-display">Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Label className="text-xs mb-2 block">Theme</Label>
            {!mounted ? (
              <div className="grid grid-cols-3 gap-3">
                {["Light", "Dark", "System"].map((t) => (
                  <div key={t} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border">
                    <div className="h-5 w-5 rounded bg-muted" />
                    <span className="text-xs font-medium text-muted-foreground">{t}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "light",  label: "Light",  icon: Sun        },
                  { key: "dark",   label: "Dark",   icon: Moon       },
                  { key: "system", label: "System", icon: Smartphone },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button key={t.key} type="button"
                      onClick={() => setTheme(t.key)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                        theme === t.key ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", theme === t.key ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-xs font-medium", theme === t.key ? "text-primary" : "text-muted-foreground")}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parent Link */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-500" />
              <CardTitle className="text-base font-display">Parent Link</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Share this code with your parent so they can monitor your progress, study hours, and location on VidyaSaathi.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center justify-center bg-muted rounded-xl py-4 px-3">
                <span className="font-mono text-2xl font-bold tracking-[0.3em] text-primary select-all">
                  {loadingCode ? "········" : inviteCode}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <button type="button" onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-accent text-xs font-medium transition-all">
                  {copied
                    ? <><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Copied!</>
                    : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                </button>
                <button type="button" onClick={shareCode}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-accent text-xs font-medium transition-all">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link2 className="h-3 w-3" />
                <span>Your parent uses this at <strong>vidhyasaathi.online/parent/link</strong></span>
              </div>
              <button type="button" onClick={regenerateCode} disabled={loadingCode}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className={cn("h-3 w-3", loadingCode && "animate-spin")} />
                New code
              </button>
            </div>
            <p className="text-[10px] text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              ⚠ Generating a new code will disconnect your current parent link. Share the new code again.
            </p>
          </CardContent>
        </Card>

        {/* Save */}
        <Button className="w-full gap-2" size="lg" onClick={handleSave}>
          {saved
            ? <><CheckCircle2 className="h-4 w-4" /> Saved!</>
            : <><Save className="h-4 w-4" /> Save Settings</>}
        </Button>

      </div>
    </DashboardLayout>
  );
}

