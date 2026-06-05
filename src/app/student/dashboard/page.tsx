// src/app/student/dashboard/page.tsx
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock, Target, BookOpen, TrendingUp, Zap, ArrowRight,
  Play, MapPin, Navigation, Loader2, Shield, Flame,
  BatteryLow, BatteryMedium, BatteryFull, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { EXAM_LABELS } from "@/utils";
import type { Student } from "@/types";
import Link from "next/link";
import { cn } from "@/utils";

// ── Battery Icon ──────────────────────────────────────────
function BatteryIcon({ level }: { level: number | null }) {
  if (level === null) return null;
  const Icon  = level > 70 ? BatteryFull : level > 30 ? BatteryMedium : BatteryLow;
  const color = level > 70 ? "text-green-500" : level > 30 ? "text-amber-500" : "text-red-500";
  return (
    <span className={cn("flex items-center gap-1 text-xs font-medium", color)}>
      <Icon className="h-3.5 w-3.5" /> {level}%
    </span>
  );
}

// ── Empty State Card ──────────────────────────────────────
function EmptyCard({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <Icon className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">No data yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Data will appear here once available</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string; value: string | null; subtitle?: string;
  icon: React.ElementType; color: "blue"|"green"|"purple"|"orange";
}) {
  const colors = {
    blue:   "bg-blue-500/10 text-blue-600",
    green:  "bg-green-500/10 text-green-600",
    purple: "bg-purple-500/10 text-purple-600",
    orange: "bg-orange-500/10 text-orange-600",
  };
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", colors[color])}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium truncate">{title}</p>
            {value !== null ? (
              <p className="text-xl font-display font-bold mt-0.5">{value}</p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1 italic">No data yet</p>
            )}
            {subtitle && value !== null && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Dashboard ────────────────────────────────────────
export default function StudentDashboard() {
  const supabase = createClient();
  const { user } = useAuthStore();

  const [realUserId, setRealUserId]         = useState<string | null>(null);
  const [realName, setRealName]             = useState<string>("Student");
  const [student, setStudent]               = useState<Student | null>(null);

  // Location state
  const [locationStatus, setLocationStatus] = useState<"idle"|"sharing"|"error"|"success">("idle");
  const [locationLabel, setLocationLabel]   = useState("");
  const [lastShared, setLastShared]         = useState<string|null>(null);
  const [isSharing, setIsSharing]           = useState(false);
  const [batteryLevel, setBatteryLevel]     = useState<number | null>(null);
  const autoShareRef = useRef<NodeJS.Timeout|null>(null);

  // ── 5-tap hidden demo coupon state ────────────────────────
  const [tapCount, setTapCount]           = useState(0);
  const [showCoupon, setShowCoupon]       = useState(false);
  const [couponInput, setCouponInput]     = useState("");
  const [couponMsg, setCouponMsg]         = useState<{ text: string; ok: boolean } | null>(null);
  const [demoActive, setDemoActive]       = useState(false);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTitleTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    // Reset tap count after 2 seconds of inactivity
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 2000);
    if (next >= 5) {
      setTapCount(0);
      setShowCoupon(true);
      setCouponInput("");
      setCouponMsg(null);
    }
  };

  const handleCouponSubmit = async () => {
    if (couponInput.trim().toUpperCase() !== "DEMO2025") {
      setCouponMsg({ text: "Invalid code. Try again.", ok: false });
      return;
    }
    // Grant session-level free access
    setDemoActive(true);
    setShowCoupon(false);
    setCouponMsg(null);
    // Store in sessionStorage so it persists across page navigations in this session
    sessionStorage.setItem("demo_access", "true");
  };

  // Check sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem("demo_access") === "true") {
      setDemoActive(true);
    }
  }, []);

  // Battery level
  useEffect(() => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.onlevelchange = () => setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  }, []);

  // Fetch real user ID and name
  useEffect(() => {
    const fetchRealUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      setRealUserId(authUser.id);
      const { data: profile } = await supabase
        .from("users").select("full_name").eq("id", authUser.id).single();
      if (profile?.full_name) {
        setRealName(profile.full_name);
      } else {
        const metaName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || "";
        if (metaName) setRealName(metaName);
      }
    };
    fetchRealUser();
  }, []);

  // Load student profile from DB
  useEffect(() => {
    async function loadData() {
      if (!realUserId) return;
      const { data } = await supabase
        .from("students").select("*").eq("user_id", realUserId).single();
      if (data) setStudent(data as Student);
    }
    loadData();
  }, [realUserId]);

  // Geocode helper
  async function getLocationLabel(lat: number, lng: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=17&addressdetails=1`
      );
      const d = await res.json();
      const a = d.address ?? {};
      return (
        a.amenity ?? a.shop ?? a.building ?? a.road ??
        a.neighbourhood ?? a.suburb ?? a.city_district ??
        a.town ?? a.city ?? a.county ?? "Unknown Area"
      );
    } catch { return "Unknown Area"; }
  }

  // Share location
  const shareLocation = useCallback(async (auto = false) => {
    if (!navigator.geolocation) { setLocationStatus("error"); return; }
    if (!realUserId) { setLocationStatus("error"); return; }
    if (!auto) setIsSharing(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy, speed } = pos.coords;
        const label = await getLocationLabel(latitude, longitude);
        setLocationLabel(label);
        try {
          const res = await fetch("/api/student/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId:     realUserId,
              latitude, longitude,
              accuracy:      Math.round(accuracy),
              locationLabel: label,
              batteryLevel,
              speed:         speed ?? null,
            }),
          });
          if (res.ok) {
            setLocationStatus("success");
            setLastShared(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
          } else {
            setLocationStatus("error");
          }
        } catch {
          setLocationStatus("error");
        } finally {
          setIsSharing(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationStatus("error");
        setIsSharing(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [realUserId, batteryLevel]);

  useEffect(() => {
    if (locationStatus === "success") {
      autoShareRef.current = setInterval(() => shareLocation(true), 15 * 60 * 1000);
    }
    return () => { if (autoShareRef.current) clearInterval(autoShareRef.current); };
  }, [locationStatus, shareLocation]);

  const firstName = realName.split(" ")[0];

  return (
    <DashboardLayout role="student" title="Dashboard">
      <div className="space-y-5">

        {/* Welcome banner with 5-tap trigger on name */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 p-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white" />
          </div>
          <div className="relative">
            <p className="text-brand-100 text-sm font-medium">Good morning 👋</p>
            {/* Tap this h2 five times to reveal demo coupon */}
            <h2
              className="font-display font-bold text-2xl mt-0.5 cursor-default select-none"
              onClick={handleTitleTap}
            >
              {firstName}
              {demoActive && (
                <span className="ml-2 text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full align-middle">
                  Demo ✓
                </span>
              )}
            </h2>
            {student?.exam_type && student.exam_type.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {student.exam_type.map(e => (
                  <span key={e} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {EXAM_LABELS[e] ?? e}
                  </span>
                ))}
              </div>
            )}
            <p className="text-brand-100 text-sm mt-3">Every hour counts. Keep going!</p>
          </div>
        </div>

        {/* ── Hidden demo coupon modal ─────────────────────────── */}
        {showCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCoupon(false)} />
            <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4">
              <button
                type="button"
                onClick={() => setShowCoupon(false)}
                className="absolute top-4 right-4 p-1 rounded-md hover:bg-accent text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="text-center space-y-1">
                <p className="text-2xl">🎟️</p>
                <p className="font-semibold text-base">Enter Demo Code</p>
                <p className="text-xs text-muted-foreground">Enter your access code to unlock a free demo session</p>
              </div>
              <input
                autoFocus
                type="text"
                value={couponInput}
                onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponMsg(null); }}
                onKeyDown={e => e.key === "Enter" && handleCouponSubmit()}
                placeholder="Enter code"
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm font-mono tracking-widest text-center outline-none focus:border-primary transition-colors"
              />
              {couponMsg && (
                <p className={cn("text-xs text-center font-medium", couponMsg.ok ? "text-green-500" : "text-red-500")}>
                  {couponMsg.text}
                </p>
              )}
              <Button className="w-full" onClick={handleCouponSubmit}>
                Activate Demo Access
              </Button>
            </div>
          </div>
        )}

        {/* Demo active banner */}
        {demoActive && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium">
            <span>✅</span>
            <span>Demo access active — all features unlocked for this session.</span>
            <button
              type="button"
              className="ml-auto text-xs underline opacity-70 hover:opacity-100"
              onClick={() => { setDemoActive(false); sessionStorage.removeItem("demo_access"); }}
            >
              Deactivate
            </button>
          </div>
        )}

        {/* Location sharing card */}
        <Card className={cn("border-2 transition-colors",
          locationStatus === "success" ? "border-green-500/30 bg-green-500/5" :
          locationStatus === "error"   ? "border-red-500/30 bg-red-500/5" : "border-border")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                locationStatus === "success" ? "bg-green-500/15" :
                locationStatus === "error"   ? "bg-red-500/15"   : "bg-primary/10")}>
                {locationStatus === "success"
                  ? <Shield className="h-5 w-5 text-green-500" />
                  : <MapPin  className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">
                    {locationStatus === "success" ? `📍 ${locationLabel}` :
                     locationStatus === "error"   ? "Location Error" : "Share Your Location"}
                  </p>
                  <BatteryIcon level={batteryLevel} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {locationStatus === "success"
                    ? `Last updated ${lastShared} · Auto-updates every 15 min`
                    : locationStatus === "error"
                    ? "Could not access location. Check browser permissions."
                    : "Let your parents know you're safe — auto-updates every 15 min"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => shareLocation(false)}
                disabled={isSharing || !realUserId}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0",
                  locationStatus === "success"
                    ? "bg-green-500/15 text-green-600 hover:bg-green-500/25 border border-green-500/30"
                    : locationStatus === "error"
                    ? "bg-red-500/15 text-red-600 hover:bg-red-500/25 border border-red-500/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/90",
                  (!realUserId) && "opacity-50 cursor-not-allowed"
                )}>
                {isSharing
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Getting…</>
                  : locationStatus === "success"
                  ? <><Navigation className="h-3.5 w-3.5" /> Update</>
                  : <><Navigation className="h-3.5 w-3.5" /> Share</>}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Real stats from DB */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Study Streak"
            value={student?.current_streak != null ? `${student.current_streak} days` : null}
            subtitle={student?.longest_streak ? `Best: ${student.longest_streak} days` : undefined}
            icon={Flame} color="orange"
          />
          <StatCard
            title="Total Study Hours"
            value={student?.total_study_hours != null ? `${Number(student.total_study_hours).toFixed(1)}h` : null}
            icon={Clock} color="blue"
          />
          <StatCard
            title="Rank Estimate"
            value={student?.rank_estimate ? `#${student.rank_estimate.toLocaleString()}` : null}
            subtitle="Based on tests"
            icon={TrendingUp} color="green"
          />
          <StatCard
            title="Target Year"
            value={student?.target_year ? `${student.target_year}` : null}
            icon={Target} color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border p-4 space-y-2">
          <p className="text-sm font-semibold mb-3">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Link href="/student/doubts">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Ask AI a Doubt
              </Button>
            </Link>
            <Link href="/student/tests">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Play className="h-4 w-4 text-green-500" /> Start a Practice Test
              </Button>
            </Link>
            <Link href="/student/revision">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" /> Revise a Chapter
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty state cards */}
        <div className="grid lg:grid-cols-2 gap-4">
          <EmptyCard title="Study Hours — Last 7 Days" icon={Clock} />
          <EmptyCard title="Test Scores — Last 7 Days" icon={Target} />
        </div>

        <EmptyCard title="Today's Targets" icon={Target} />
        <EmptyCard title="Subject Performance" icon={BookOpen} />

        {/* Settings prompt if no student profile */}
        {!student && realUserId && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <Target className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Complete Your Profile</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Set up your exam type and target year to get personalized insights.
                  </p>
                </div>
                <Link href="/student/settings">
                  <Button size="sm" variant="outline" className="flex-shrink-0">
                    Settings <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
