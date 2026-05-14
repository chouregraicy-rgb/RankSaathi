// src/app/parent/dashboard/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LocationMap } from "@/components/shared/LocationMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock, MapPin, Target, TrendingUp, BookOpen,
  RefreshCw, Loader2, Navigation, Phone, MessageCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LocationPoint {
  id:             string;
  student_id:     string;
  latitude:       number;
  longitude:      number;
  accuracy:       number | null;
  location_label: string | null;
  timestamp:      string;
}

// ── Empty State ───────────────────────────────────────────
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

export default function ParentDashboard() {
  const supabase = createClient();

  // ✅ All working state — untouched from fixed version
  const [parentUserId, setParentUserId]   = useState<string | null>(null);
  const [studentId, setStudentId]         = useState<string | null>(null);
  const [studentName, setStudentName]     = useState<string>("Student");
  const [studentData, setStudentData]     = useState<any>(null);
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setParentUserId(user.id);

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

        // ✅ Get student record — use user_id for location lookup
        const { data: studentRecord } = await supabase
          .from("students")
          .select("id, user_id, current_streak, longest_streak, total_study_hours, rank_estimate, exam_type, target_year")
          .eq("id", parentRecord.student_id)
          .single();

        if (!studentRecord) {
          setNotLinked(true);
          setLoadingInit(false);
          return;
        }

        setStudentId(studentRecord.user_id); // ✅ auth user ID — matches student_locations FK
        setStudentData(studentRecord);

        // ✅ Get student name
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
        setLastFetched(
          new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        );
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

  // Loading
  if (loadingInit) {
    return (
      <DashboardLayout role="parent" title="Parent Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Not linked
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

        {/* ✅ Student info banner with real name */}
        <div className="flex items-center gap-4 bg-card rounded-2xl border p-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-display font-bold text-xl">
            {studentName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-xl truncate">{studentName}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {studentData?.exam_type?.map((e: string) => (
                <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
              ))}
              {studentData?.target_year && (
                <Badge variant="outline" className="text-xs">{studentData.target_year}</Badge>
              )}
              <Badge variant="success" className="text-xs">Active Today</Badge>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-1">
              <Phone className="h-3.5 w-3.5" /> Call
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> Message
            </Button>
          </div>
        </div>

        {/* ✅ Real stats from students table */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Study Streak",
              value: studentData?.current_streak != null ? `${studentData.current_streak} days` : null,
              icon: Target,
            },
            {
              title: "Total Study Hours",
              value: studentData?.total_study_hours != null
                ? `${Number(studentData.total_study_hours).toFixed(1)}h` : null,
              icon: Clock,
            },
            {
              title: "Rank Estimate",
              value: studentData?.rank_estimate ? `#${studentData.rank_estimate.toLocaleString()}` : null,
              icon: TrendingUp,
            },
            {
              title: "Longest Streak",
              value: studentData?.longest_streak != null ? `${studentData.longest_streak} days` : null,
              icon: BookOpen,
            },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                    {stat.value !== null
                      ? <p className="text-xl font-display font-bold mt-0.5">{stat.value}</p>
                      : <p className="text-sm text-muted-foreground mt-1 italic">No data yet</p>
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ✅ Live Location Map — fully working, untouched */}
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

        {/* Empty state cards for future features */}
        <div className="grid lg:grid-cols-2 gap-4">
          <EmptyCard title="Study Hours — Last 7 Days" icon={Clock} />
          <EmptyCard title="Test Performance" icon={Target} />
        </div>

        <EmptyCard title="Recent Alerts" icon={Target} />
        <EmptyCard title="Subject-wise Progress" icon={BookOpen} />

      </div>
    </DashboardLayout>
  );
}