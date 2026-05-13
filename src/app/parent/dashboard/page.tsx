// src/app/parent/dashboard/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { MoodIndicator } from "@/components/shared/MoodIndicator";
import { LocationMap } from "@/components/shared/LocationMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock, MapPin, CheckCircle2, AlertTriangle, Bell, Target,
  TrendingUp, BookOpen, Phone, MessageCircle, Calendar,
  RefreshCw, Loader2, Navigation,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { createClient } from "@/lib/supabase/client";

const STUDY_TREND = [
  { day: "Mon", hours: 7 }, { day: "Tue", hours: 5 }, { day: "Wed", hours: 8 },
  { day: "Thu", hours: 6 }, { day: "Fri", hours: 4 }, { day: "Sat", hours: 9 },
  { day: "Sun", hours: 7 },
];

const RECENT_ALERTS = [
  { type: "warning", message: "Student left safe zone at 4:15 PM", time: "2h ago" },
  { type: "info",    message: "New test result: Physics 72%",       time: "5h ago" },
  { type: "success", message: "7-day study streak maintained!",     time: "1 day ago" },
  { type: "warning", message: "Burnout risk detected — low focus",  time: "2 days ago" },
];

interface LocationPoint {
  id:             string;
  student_id:     string;
  latitude:       number;
  longitude:      number;
  accuracy:       number | null;
  location_label: string | null;
  timestamp:      string;
}

export default function ParentDashboard() {
  const supabase = createClient();

  // ✅ Real IDs from DB
  const [parentUserId, setParentUserId]   = useState<string | null>(null);
  const [studentId, setStudentId]         = useState<string | null>(null);
  const [studentName, setStudentName]     = useState<string>("Student");
  const [locations, setLocations]         = useState<LocationPoint[]>([]);
  const [loadingInit, setLoadingInit]     = useState(true);
  const [loadingMap, setLoadingMap]       = useState(false);
  const [lastFetched, setLastFetched]     = useState<string | null>(null);
  const [mapError, setMapError]           = useState(false);
  const [notLinked, setNotLinked]         = useState(false);

  // ✅ Step 1: Get real parent user ID → find linked student
  useEffect(() => {
    const init = async () => {
      setLoadingInit(true);
      try {
        // Get logged-in parent
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setParentUserId(user.id);

        // Find linked student from parents table
        const { data: parentRecord } = await supabase
          .from("parents")
          .select("student_id")
          .eq("user_id", user.id)
          .single();

        if (!parentRecord?.student_id) {
          setNotLinked(true);
          setLoadingInit(false);
          return;
        }

        // Get student's user_id and name
        const { data: studentRecord } = await supabase
          .from("students")
          .select("id, user_id")
          .eq("id", parentRecord.student_id)
          .single();

        if (!studentRecord) {
          setNotLinked(true);
          setLoadingInit(false);
          return;
        }

        setStudentId(studentRecord.id);

        // Get student name
        const { data: studentUser } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", studentRecord.user_id)
          .single();

        if (studentUser?.full_name) setStudentName(studentUser.full_name);

      } catch (e) {
        console.error("Init error:", e);
      } finally {
        setLoadingInit(false);
      }
    };
    init();
  }, []);

  // ✅ Step 2: Fetch locations once studentId is known
  const fetchLocations = useCallback(async () => {
    if (!studentId) return;
    setLoadingMap(true);
    setMapError(false);
    try {
      const res  = await fetch(`/api/student/location?studentId=${studentId}`);
      const data = await res.json();
      if (data.locations) {
        setLocations(data.locations);
        setLastFetched(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      }
    } catch { setMapError(true); }
    finally  { setLoadingMap(false); }
  }, [studentId]);

  useEffect(() => {
    if (!studentId) return;
    fetchLocations();
    const interval = setInterval(fetchLocations, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [studentId, fetchLocations]);

  const latestLocation = locations[0] ?? null;

  const timeline = locations.slice(0, 8).map((loc) => ({
    label: loc.location_label ?? "Unknown Area",
    time:  new Date(loc.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  }));

  // Show loading while fetching parent/student info
  if (loadingInit) {
    return (
      <DashboardLayout role="parent" title="Parent Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Show "not linked" state
  if (notLinked) {
    return (
      <DashboardLayout role="parent" title="Parent Dashboard">
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/30" />
          <h2 className="font-display font-bold text-xl">No Student Linked</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            You haven&apos;t linked to a student yet. Ask your child for their 8-character invite code from Settings.
          </p>
          <Button onClick={() => window.location.href = "/parent/link"}>
            Link a Student
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="parent" title="Parent Dashboard">
      <div className="space-y-5 max-w-4xl">

        {/* Student info banner */}
        <div className="flex items-center gap-4 bg-card rounded-2xl border p-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-display font-bold text-xl">
            {studentName[0]}
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-xl">{studentName}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline">NEET UG 2026</Badge>
              <Badge variant="outline">JEE Main 2026</Badge>
              <Badge variant="success">Active Today</Badge>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-1"><Phone className="h-3.5 w-3.5" /> Call</Button>
            <Button variant="outline" size="sm" className="gap-1"><MessageCircle className="h-3.5 w-3.5" /> Message</Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Study Hours Today"    value="7.5h"    icon={Clock}      color="blue"   subtitle="Target: 8h" />
          <StatCard title="Weekly Avg"           value="6.8h"    icon={TrendingUp} color="green"  subtitle="Per day"    />
          <StatCard title="Attendance Streak"    value="12 days" icon={Calendar}   color="purple" />
          <StatCard title="Test Avg (This Week)" value="74%"     icon={Target}     color="orange" />
        </div>

        {/* Mood */}
        <MoodIndicator mood="focused" focusScore={78} burnoutRisk={15} size="md" />

        {/* Live Location Map */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-500" />
                <CardTitle className="text-base font-display">Live Location</CardTitle>
                {latestLocation && (
                  <Badge variant="success" className="text-xs ml-1">Safe Zone ✓</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {lastFetched && (
                  <span className="text-xs text-muted-foreground">Updated {lastFetched}</span>
                )}
                <button type="button" onClick={fetchLocations} disabled={loadingMap}
                  className="p-1.5 rounded-lg border border-border hover:bg-accent transition-all">
                  {loadingMap
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    : <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
              </div>
            </div>

            {latestLocation && (
              <div className="flex items-center gap-2 mt-2 bg-muted/40 rounded-lg px-3 py-2">
                <Navigation className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{latestLocation.location_label ?? "Unknown Area"}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(latestLocation.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {loadingMap && locations.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 bg-muted/40 rounded-xl border border-border" style={{ height: "300px" }}>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading map…</p>
              </div>
            ) : mapError ? (
              <div className="flex flex-col items-center justify-center gap-2 bg-red-500/5 rounded-xl border border-red-500/20" style={{ height: "300px" }}>
                <MapPin className="h-6 w-6 text-red-400" />
                <p className="text-xs text-red-400">Could not load location data</p>
                <button type="button" onClick={fetchLocations} className="text-xs text-primary underline">Retry</button>
              </div>
            ) : (
              <LocationMap locations={locations} height="300px" />
            )}

            {timeline.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Today&apos;s Movement</p>
                <div className="space-y-1.5">
                  {timeline.map((loc, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? "bg-primary ring-2 ring-primary/30" : "bg-muted-foreground/40"}`} />
                      <span className={`flex-1 font-medium ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>{loc.label}</span>
                      <span className="text-xs text-muted-foreground">{loc.time}</span>
                      {i === 0 && <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">Now</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {locations.length === 0 && !loadingMap && (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">No location shared yet today.</p>
                <p className="text-[10px] text-muted-foreground">
                  Ask your child to tap <strong>Share Location</strong> in their dashboard.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study hours chart */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Study Hours — Last 7 Days</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={STUDY_TREND} margin={{ left: -25, right: 5 }}>
                <defs>
                  <linearGradient id="parentHoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2b7fff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2b7fff" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={val => [`${val}h`, "Study Hours"]}
                />
                <Area type="monotone" dataKey="hours" stroke="#2b7fff" strokeWidth={2} fill="url(#parentHoursGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent alerts */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-base font-display">Recent Alerts</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {RECENT_ALERTS.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                alert.type === "warning" ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900" :
                alert.type === "success" ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900" :
                "bg-muted/40 border-border"}`}>
                {alert.type === "warning"
                  ? <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  : alert.type === "success"
                  ? <CheckCircle2  className="h-4 w-4 text-green-500  flex-shrink-0 mt-0.5" />
                  : <Bell          className="h-4 w-4 text-blue-500   flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Subject performance */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Subject-wise Progress</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { subject: "Physics",     pct: 72, tests: 8,  trend: "+5%" },
              { subject: "Chemistry",   pct: 85, tests: 6,  trend: "+8%" },
              { subject: "Biology",     pct: 68, tests: 10, trend: "-2%" },
              { subject: "Mathematics", pct: 61, tests: 5,  trend: "+3%" },
            ].map(item => (
              <div key={item.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.tests} tests</span>
                    <Badge variant={item.trend.startsWith("+") ? "success" : "destructive"} className="text-xs">{item.trend}</Badge>
                    <span className="text-sm font-bold">{item.pct}%</span>
                  </div>
                </div>
                <Progress value={item.pct} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}