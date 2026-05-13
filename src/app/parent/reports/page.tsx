// src/app/parent/reports/page.tsx
"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Trophy, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SUBJECT_COLORS } from "@/utils";

const MONTHLY_DATA = [
  { month: "Feb", Physics: 60, Chemistry: 72, Biology: 58, Mathematics: 50 },
  { month: "Mar", Physics: 65, Chemistry: 75, Biology: 63, Mathematics: 55 },
  { month: "Apr", Physics: 70, Chemistry: 80, Biology: 67, Mathematics: 60 },
  { month: "May", Physics: 72, Chemistry: 85, Biology: 68, Mathematics: 61 },
];

const TEST_HISTORY = [
  { date: "May 6", test: "Physics — Electrostatics",   score: 72, max: 90 },
  { date: "May 3", test: "Biology Full Mock",           score: 134, max: 180 },
  { date: "Apr 28", test: "Chemistry — Organic",        score: 68, max: 90 },
  { date: "Apr 22", test: "JEE Main Full Mock",         score: 185, max: 300 },
  { date: "Apr 15", test: "NEET Full Mock",             score: 440, max: 720 },
];

export default function ParentReportsPage() {
  return (
    <DashboardLayout role="parent" title="Reports">
      <div className="space-y-5 max-w-4xl">

        {/* Header actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg">Monthly Report — May 2026</h2>
            <p className="text-sm text-muted-foreground">Rohit Sharma · NEET UG & JEE Main</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Study Hours",     value: "124h",    sub: "This month",    icon: Calendar,     up: true  },
            { label: "Tests Taken",     value: "18",      sub: "This month",    icon: Trophy,       up: true  },
            { label: "Avg Accuracy",    value: "74%",     sub: "+4% vs last",   icon: TrendingUp,   up: true  },
            { label: "Rank Estimate",   value: "#18.4K",  sub: "↑ 2.1K better", icon: TrendingDown, up: true  },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-card rounded-xl border p-4">
                <Icon className="h-5 w-5 text-brand-500 mb-2" />
                <p className="text-xl font-display font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                <p className={`text-xs mt-1 font-medium ${item.up ? "text-green-500" : "text-red-500"}`}>
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Monthly trend chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">4-Month Progress Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_DATA} margin={{ left: -25, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {["Physics", "Chemistry", "Biology", "Mathematics"].map((s) => (
                  <Bar key={s} dataKey={s} fill={SUBJECT_COLORS[s]} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test history */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TEST_HISTORY.map((test, i) => {
              const pct = Math.round((test.score / test.max) * 100);
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="text-xs text-muted-foreground w-14 flex-shrink-0">{test.date}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{test.test}</p>
                    <Progress value={pct} className="h-1 mt-1" />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">{test.score}/{test.max}</p>
                    <p className={`text-xs font-medium ${pct >= 75 ? "text-green-500" : pct >= 55 ? "text-amber-500" : "text-red-500"}`}>
                      {pct}%
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
