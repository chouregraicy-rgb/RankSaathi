// src/app/student/dashboard/page.tsx
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { MoodIndicator } from "@/components/shared/MoodIndicator";
import { StreakBadge } from "@/components/shared/StreakBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Clock, Target, BookOpen, TrendingUp, Zap, ArrowRight,
  CheckCircle2, AlertCircle, Play, MapPin, Navigation, Loader2, Shield,
  Battery, BatteryLow, BatteryMedium, BatteryFull,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { SUBJECT_COLORS, EXAM_LABELS } from "@/utils";
import { getLatestMood } from "@/services/moodService";
import type { Student, MoodLog } from "@/types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Link from "next/link";
import { cn } from "@/utils";

const WEEK_DATA = [
  { day: "Mon", hours: 4, score: 65 }, { day: "Tue", hours: 6, score: 72 },
  { day: "Wed", hours: 5, score: 68 }, { day: "Thu", hours: 7, score: 80 },
  { day: "Fri", hours: 3, score: 58 }, { day: "Sat", hours: 8, score: 85 },
  { day: "Sun", hours: 6, score: 78 },
];
const TODAY_TARGETS = [
  { label: "Physics — Electrostatics",   done: true,  duration: "2h"   },
  { label: "Chemistry — Equilibrium",    done: true,  duration: "1.5h" },
  { label: "Biology — Genetics",         done: false, duration: "2h"   },
  { label: "Math — Integral Calculus",   done: false, duration: "1.5h" },
  { label: "Mock Test — Chemistry Full", done: false, duration: "1h"   },
];

function BatteryIcon({ level }: { level: number | null }) {
  if (level === null) return null;
  const Icon = level > 70 ? BatteryFull : level > 30 ? BatteryMedium : BatteryLow;
  const color = level > 70 ? "text-green-500" : level > 30 ? "text-amber-500" : "text-red-500";
  return (
    <span className={cn("flex items-center gap-1 text-xs font-medium", color)}>
      <Icon className="h-3.5 w-3.5" /> {level}%
    </span>
  );
}

export default function StudentDashboard() {
  const supabase = createClient();
  const { user } = useAuthStore();

  const [realUserId, setRealUserId]   = useState<string | null>(null);
  const [realName, setRealName]       = useState<string>("Student");
  const [student, setStudent]         = useState<Student | null>(null);
  const [moodLog, setMoodLog]         = useState<MoodLog | null>(null);

  // ✅ KEY FIX: track students.id separately from auth user id
  const [studentRecordId, setStudentRecordId] = useState<string | null>(null);

  const [locationStatus, setLocationStatus] = useState<"idle"|"sharing"|"error"|"success">("idle");
  const [locationLabel, setLocationLabel]   = useState("");
  const [lastShared, setLastShared]         = useState<string|null>(null);
  const [isSharing, setIsSharing]           = useState(false);
  const [batteryLevel, setBatteryLevel]     = useState<number | null>(null);
  const autoShareRef = useRef<NodeJS.Timeout|null>(null);

  // Get battery level
  useEffect(() => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.onlevelchange = () => setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  }, []);

  // ✅ Fetch real user ID and full_name
  useEffect(() => {
    const fetchRealUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      setRealUserId(authUser.id);

      const { data: profile } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", authUser.id)
        .single();

      if (profile?.full_name) {
        setRealName(profile.full_name);
      } else {
        const metaName =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name || "";
        if (metaName) setRealName(metaName);
      }
    };
    fetchRealUser();
  }, []);

  // ✅ Load student profile — also saves students.id (NOT auth user id)
  useEffect(() => {
    async function loadData() {
      if (!realUserId) return;
      const { data } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", realUserId)
        .single();
      if (data) {
        setStudent(data as Student);
        setStudentRecordId(data.id); // ✅ This is students.id — used for location FK
      }
      const mood = await getLatestMood(realUserId);
      if (mood) setMoodLog(mood);
    }
    loadData();
  }, [realUserId]);

  async function getLocationLabel(lat: number, lng: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=17&addressdetails=1`
      );
      const d = await res.json();
      const a = d.address ?? {};
      return (
        a.amenity       ?? a.shop         ?? a.building     ??
        a.road          ?? a.neighbourhood ?? a.suburb       ??
        a.city_district ?? a.town          ?? a.city         ??
        a.county        ?? "Unknown Area"
      );
    } catch { return "Unknown Area"; }
  }

  // ✅ KEY FIX: uses studentRecordId (students.id) NOT realUserId (auth user id)
  const shareLocation = useCallback(async (auto = false) => {
    if (!navigator.geolocation) { setLocationStatus("error"); return; }
    if (!studentRecordId) {
      console.error("Student record ID not loaded yet");
      setLocationStatus("error");
      return;
    }
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
              studentId:     studentRecordId, // ✅ students.id — matches student_locations FK
              latitude,
              longitude,
              accuracy:      Math.round(accuracy),
              locationLabel: label,
              batteryLevel:  batteryLevel,   // ✅ battery level included
              speed:         speed ?? null,
            }),
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error);
          setLocationStatus("success");
          setLastShared(
            new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
          );
        } catch (err) {
          console.error("Share location error:", err);
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
  }, [realUserId, studentRecordId, batteryLevel]);

  useEffect(() => {
    if (locationStatus === "success") {
      autoShareRef.current = setInterval(() => shareLocation(true), 15 * 60 * 1000);
    }
    return () => { if (autoShareRef.current) clearInterval(autoShareRef.current); };
  }, [locationStatus, shareLocation]);

  const completedTargets = TODAY_TARGETS.filter(t => t.done).length;
  const targetProgress   = Math.round((completedTargets / TODAY_TARGETS.length) * 100);

  return (
    <DashboardLayout role="student" title="Dashboard">
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 p-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white" />
          </div>
          <div className="relative">
            <p className="text-brand-100 text-sm font-medium">Good morning 👋</p>
            <h2 className="font-display font-bold text-2xl mt-0.5">{realName.split(" ")[0]}</h2>
            {student?.exam_type && (
              <div className="flex flex-wrap gap-2 mt-2">
                {student.exam_type.map(e => (
                  <span key={e} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {EXAM_LABELS[e]}
                  </span>
                ))}
              </div>
            )}
            <p className="text-brand-100 text-sm mt-3">Every hour counts. Keep going!</p>
          </div>
        </div>

        {/* Location sharing card */}
        <Card className={cn("border-2 transition-colors",
          locationStatus === "success" ? "border-green-500/30 bg-green-500/5" :
          locationStatus === "error"   ? "border-red-500/30   bg-red-500/5"   : "border-border")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                locationStatus === "success" ? "bg-green-500/15" :
                locationStatus === "error"   ? "bg-red-500/15"   : "bg-primary/10")}>
                {locationStatus === "success"
                  ? <Shield  className="h-5 w-5 text-green-500" />
                  : <MapPin  className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">
                    {locationStatus === "success" ? `📍 ${locationLabel}` :
                     locationStatus === "error"   ? "Location Error" :
                     "Share Your Location"}
                  </p>
                  {/* ✅ Battery level shown inline */}
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
                disabled={isSharing || !studentRecordId}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0",
                  locationStatus === "success"
                    ? "bg-green-500/15 text-green-600 hover:bg-green-500/25 border border-green-500/30"
                    : locationStatus === "error"
                    ? "bg-red-500/15   text-red-600   hover:bg-red-500/25   border border-red-500/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/90",
                  (!studentRecordId) && "opacity-50 cursor-not-allowed"
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Study Hours Today" value="5.5h" subtitle="Target: 8h" icon={Clock} color="blue" trend={{ value: 12, label: "vs yesterday" }} />
          <StatCard title="Tests This Week"   value="4"    subtitle="Avg score: 74%" icon={Target} color="green" />
          <StatCard title="Chapters Revised"  value="12"   subtitle="This week" icon={BookOpen} color="purple" />
          <StatCard title="Rank Estimate"     value={student?.rank_estimate ? `#${student.rank_estimate.toLocaleString()}` : "—"} subtitle="Based on recent tests" icon={TrendingUp} color="orange" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <StreakBadge days={student?.current_streak ?? 0} className="h-fit" />
          <MoodIndicator mood={moodLog?.mood_state ?? "normal"} focusScore={moodLog?.focus_score ?? 70} burnoutRisk={moodLog?.burnout_risk ?? 20} size="md" />
          <div className="bg-card rounded-xl border p-4 space-y-2">
            <p className="text-sm font-semibold mb-3">Quick Actions</p>
            <Link href="/student/doubts"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Zap className="h-4 w-4 text-amber-500" /> Ask AI a Doubt</Button></Link>
            <Link href="/student/tests"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><Play className="h-4 w-4 text-green-500" /> Start a Practice Test</Button></Link>
            <Link href="/student/revision"><Button variant="outline" size="sm" className="w-full justify-start gap-2"><BookOpen className="h-4 w-4 text-blue-500" /> Revise a Chapter</Button></Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-display">Study Hours — Last 7 Days</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={WEEK_DATA} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <defs><linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2b7fff" stopOpacity={0.3}/><stop offset="95%" stopColor="#2b7fff" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }}/>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={val => [`${val}h`, "Study Hours"]}/>
                  <Area type="monotone" dataKey="hours" stroke="#2b7fff" strokeWidth={2} fill="url(#hoursGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-display">Test Scores — Last 7 Days</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={WEEK_DATA} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f5a0" stopOpacity={0.3}/><stop offset="95%" stopColor="#00f5a0" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }}/><YAxis domain={[0,100]} tick={{ fontSize: 11 }}/>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={val => [`${val}%`, "Score"]}/>
                  <Area type="monotone" dataKey="score" stroke="#00f5a0" strokeWidth={2} fill="url(#scoreGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display">Today's Targets</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{completedTargets}/{TODAY_TARGETS.length}</span>
                <Badge variant={targetProgress >= 80 ? "success" : targetProgress >= 50 ? "warning" : "secondary"}>{targetProgress}%</Badge>
              </div>
            </div>
            <Progress value={targetProgress} className="h-1.5 mt-2"/>
          </CardHeader>
          <CardContent className="space-y-2">
            {TODAY_TARGETS.map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                {t.done
                  ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0"/>
                  : <AlertCircle  className="h-5 w-5 text-muted-foreground flex-shrink-0"/>}
                <span className={`text-sm flex-1 ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.duration}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display">Subject Performance</CardTitle>
              <Link href="/student/analytics"><Button variant="ghost" size="sm" className="gap-1 text-xs">See all <ArrowRight className="h-3 w-3"/></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { subject: "Physics",     accuracy: 72, questions: 120 },
              { subject: "Chemistry",   accuracy: 85, questions: 98  },
              { subject: "Biology",     accuracy: 68, questions: 145 },
              { subject: "Mathematics", accuracy: 61, questions: 87  },
            ].map(item => (
              <div key={item.subject}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: SUBJECT_COLORS[item.subject] }}/>
                    <span className="text-sm font-medium">{item.subject}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{item.questions} Qs</span>
                    <span className="text-sm font-bold">{item.accuracy}%</span>
                  </div>
                </div>
                <Progress value={item.accuracy} className="h-1.5"/>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
