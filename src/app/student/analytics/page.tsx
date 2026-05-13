// src/app/student/analytics/page.tsx
"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUBJECT_COLORS, MOOD_CONFIG } from "@/utils";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2 } from "lucide-react";

const RADAR_DATA = [
  { subject: "Physics",     score: 72 },
  { subject: "Chemistry",   score: 85 },
  { subject: "Biology",     score: 68 },
  { subject: "Mathematics", score: 61 },
  { subject: "Consistency", score: 78 },
];

const WEEKLY_SCORES = [
  { week: "W1", Physics: 65, Chemistry: 78, Biology: 60, Mathematics: 55 },
  { week: "W2", Physics: 70, Chemistry: 80, Biology: 65, Mathematics: 58 },
  { week: "W3", Physics: 68, Chemistry: 82, Biology: 70, Mathematics: 62 },
  { week: "W4", Physics: 75, Chemistry: 85, Biology: 72, Mathematics: 65 },
];

const MOOD_DIST = [
  { name: "Focused",      value: 35, color: MOOD_CONFIG.focused.color      },
  { name: "Normal",       value: 40, color: MOOD_CONFIG.normal.color       },
  { name: "Distracted",   value: 15, color: MOOD_CONFIG.distracted.color   },
  { name: "Fatigued",     value: 8,  color: MOOD_CONFIG.fatigued.color     },
  { name: "Burnout Risk", value: 2,  color: MOOD_CONFIG.burnout_risk.color },
];

const WEAK_CHAPTERS = [
  { chapter: "Integral Calculus",   subject: "Mathematics", accuracy: 42, attempts: 8  },
  { chapter: "Rotational Motion",   subject: "Physics",     accuracy: 48, attempts: 5  },
  { chapter: "Chemical Kinetics",   subject: "Chemistry",   accuracy: 55, attempts: 6  },
  { chapter: "Molecular Genetics",  subject: "Biology",     accuracy: 52, attempts: 7  },
];

const STRONG_CHAPTERS = [
  { chapter: "Electrostatics",      subject: "Physics",     accuracy: 92, attempts: 10 },
  { chapter: "Atomic Structure",    subject: "Chemistry",   accuracy: 88, attempts: 9  },
  { chapter: "Cell Division",       subject: "Biology",     accuracy: 90, attempts: 8  },
  { chapter: "Trigonometry",        subject: "Mathematics", accuracy: 85, attempts: 7  },
];

function TrendIcon({ value }: { value: number }) {
  if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout role="student" title="Analytics">
      <div className="space-y-5 max-w-5xl">
        <Tabs defaultValue="performance">
          <TabsList className="grid grid-cols-3 w-full max-w-sm">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="mood">Mood</TabsTrigger>
          </TabsList>

          {/* Performance tab */}
          <TabsContent value="performance" className="mt-5 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Radar chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Subject Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#2b7fff"
                        fill="#2b7fff"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly trend line chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">4-Week Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={WEEKLY_SCORES} margin={{ left: -25, right: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
                        <Line
                          key={subject}
                          type="monotone"
                          dataKey={subject}
                          stroke={color}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Subject accuracy bar chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Question Accuracy by Chapter Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { type: "MCQ",             Physics: 74, Chemistry: 88, Biology: 71 },
                      { type: "Integer",          Physics: 61, Chemistry: 72, Biology: 55 },
                      { type: "Assertion",        Physics: 68, Chemistry: 80, Biology: 65 },
                    ]}
                    margin={{ left: -25, right: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {["Physics", "Chemistry", "Biology"].map((subject) => (
                      <Bar
                        key={subject}
                        dataKey={subject}
                        fill={SUBJECT_COLORS[subject]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chapters tab */}
          <TabsContent value="chapters" className="mt-5 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Weak chapters */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <CardTitle className="text-base font-display">Weak Chapters — Focus Here</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {WEAK_CHAPTERS.map((item) => (
                    <div key={item.chapter}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="text-sm font-medium">{item.chapter}</p>
                          <p className="text-xs text-muted-foreground">{item.subject} · {item.attempts} attempts</p>
                        </div>
                        <span className="text-sm font-bold text-red-500">{item.accuracy}%</span>
                      </div>
                      <Progress value={item.accuracy} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Strong chapters */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <CardTitle className="text-base font-display">Strong Chapters — Keep it up!</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {STRONG_CHAPTERS.map((item) => (
                    <div key={item.chapter}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="text-sm font-medium">{item.chapter}</p>
                          <p className="text-xs text-muted-foreground">{item.subject} · {item.attempts} attempts</p>
                        </div>
                        <span className="text-sm font-bold text-green-500">{item.accuracy}%</span>
                      </div>
                      <Progress value={item.accuracy} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mood tab */}
          <TabsContent value="mood" className="mt-5 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Mood Distribution — Last 30 Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                      <Pie
                        data={MOOD_DIST}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {MOOD_DIST.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => [`${val}%`, ""]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Mood Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MOOD_DIST.map((m) => (
                    <div key={m.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-muted-foreground">{m.value}%</span>
                        </div>
                        <Progress value={m.value} className="h-1 mt-1" />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      💡 You&apos;re most productive between 8am–12pm. Shift difficult topics to morning sessions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
