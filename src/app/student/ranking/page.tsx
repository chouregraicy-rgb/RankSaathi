// src/app/student/ranking/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy, Target, TrendingUp, TrendingDown, Minus,
  Shield, Star, Flame, Clock, BarChart2, Medal,
} from "lucide-react";
import { cn } from "@/utils";

// ── MOCK RANKING DATA ─────────────────────────────────
// Only YOU are named. Everyone else is anonymous.

function anonymousName(rank: number): string {
  const adjectives = ["Swift", "Focused", "Bright", "Sharp", "Bold", "Keen", "Wise", "Calm", "Alert", "Brave"];
  const nouns      = ["Hawk", "Eagle", "Tiger", "Lion", "Wolf", "Fox", "Bear", "Deer", "Owl", "Falcon"];
  // deterministic but looks random
  const adj  = adjectives[(rank * 7) % adjectives.length];
  const noun = nouns[(rank * 3) % nouns.length];
  return `${adj} ${noun}`;
}

const MY_RANK = 47;
const TOTAL_STUDENTS = 12480;
const MY_PERCENTILE  = Math.round(((TOTAL_STUDENTS - MY_RANK) / TOTAL_STUDENTS) * 100);

interface RankEntry {
  rank: number;
  isMe: boolean;
  score: number;
  accuracy: number;
  testsGiven: number;
  studyHours: number;
  streak: number;
  trend: "up" | "down" | "same";
  trendValue: number;
  city?: string;
}

function generateRankings(myRank: number, total: number): RankEntry[] {
  const entries: RankEntry[] = [];

  // Top 10
  for (let i = 1; i <= 10; i++) {
    entries.push({
      rank: i, isMe: i === myRank,
      score: Math.round(680 - (i - 1) * 3.5),
      accuracy: Math.round(95 - (i - 1) * 0.8),
      testsGiven: 80 - i, studyHours: 9, streak: 30 - i,
      trend: i % 3 === 0 ? "up" : i % 3 === 1 ? "down" : "same",
      trendValue: Math.floor(Math.random() * 5) + 1,
    });
  }

  // Around MY rank (show 5 above and 5 below)
  if (myRank > 15) {
    for (let i = Math.max(11, myRank - 5); i <= myRank + 5; i++) {
      entries.push({
        rank: i, isMe: i === myRank,
        score: Math.round(680 - i * 3.2),
        accuracy: Math.round(95 - i * 0.7),
        testsGiven: Math.max(20, 75 - i), studyHours: Math.max(4, 8 - Math.floor(i / 20)),
        streak: Math.max(1, 25 - Math.floor(i / 5)),
        trend: i === myRank ? "up" : i % 3 === 0 ? "up" : i % 3 === 1 ? "down" : "same",
        trendValue: Math.floor(i % 5) + 1,
      });
    }
  }

  return entries.sort((a, b) => a.rank - b.rank);
}

const OVERALL_RANKINGS = generateRankings(MY_RANK, TOTAL_STUDENTS);

const SUBJECT_RANKINGS: Record<string, Record<string, { myRank: number; total: number; score: number; maxScore: number }>> = {
  "NEET UG": {
    Physics:   { myRank: 38, total: TOTAL_STUDENTS, score: 142, maxScore: 180 },
    Chemistry: { myRank: 29, total: TOTAL_STUDENTS, score: 158, maxScore: 180 },
    Biology:   { myRank: 71, total: TOTAL_STUDENTS, score: 128, maxScore: 360 },
  },
  "JEE Main": {
    Physics:     { myRank: 38,  total: 8340, score: 142, maxScore: 120 },
    Chemistry:   { myRank: 29,  total: 8340, score: 98,  maxScore: 120 },
    Mathematics: { myRank: 112, total: 8340, score: 85,  maxScore: 120 },
  },
};

const EXAM_RANKINGS = {
  "NEET UG":    { myRank: 47,  total: 12480, percentile: 99.6 },
  "JEE Main":   { myRank: 215, total: 8340,  percentile: 97.4 },
};

const TREND_HISTORY = [
  { week: "4 weeks ago", rank: 89  },
  { week: "3 weeks ago", rank: 74  },
  { week: "2 weeks ago", rank: 61  },
  { week: "Last week",   rank: 53  },
  { week: "This week",   rank: 47  },
];

const SUBJECT_COLORS: Record<string, string> = {
  Physics:     "text-blue-500",
  Chemistry:   "text-green-500",
  Biology:     "text-purple-500",
  Mathematics: "text-orange-500",
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
      {rank}
    </span>
  );
}

export default function RankingPage() {
  const [exam, setExam] = useState<"NEET UG" | "JEE Main">("NEET UG");

  const examData = EXAM_RANKINGS[exam];

  return (
    <DashboardLayout role="student" title="My Ranking">
      <div className="max-w-4xl space-y-5">

        {/* Exam selector */}
        <div className="flex gap-2">
          {(["NEET UG", "JEE Main"] as const).map((e) => (
            <button key={e} onClick={() => setExam(e)}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                exam === e ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent")}>
              {e}
            </button>
          ))}
        </div>

        {/* MY RANK HERO CARD */}
        <div className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 rounded-2xl p-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white" />
          </div>
          <div className="relative">
            {/* Privacy badge */}
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-brand-200" />
              <span className="text-xs text-brand-200">Your identity is private to other students</span>
            </div>

            <div className="grid md:grid-cols-3 gap-5 items-center">
              {/* Rank */}
              <div className="text-center">
                <p className="text-brand-200 text-sm font-medium">Your Rank</p>
                <p className="text-6xl font-display font-bold mt-1">#{examData.myRank}</p>
                <p className="text-brand-200 text-xs mt-1">out of {examData.total.toLocaleString()} students</p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-white/20 h-20 mx-auto" />

              {/* Percentile */}
              <div className="text-center">
                <p className="text-brand-200 text-sm font-medium">Percentile</p>
                <p className="text-5xl font-display font-bold mt-1">{examData.percentile}</p>
                <p className="text-brand-200 text-xs mt-1">Top {(100 - examData.percentile).toFixed(1)}% of all students</p>
              </div>
            </div>

            {/* Trend */}
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-300" />
              <span className="text-sm text-green-300 font-medium">↑ Moved up 6 ranks this week</span>
            </div>
          </div>
        </div>

        {/* Rank trend */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-500" />
              <CardTitle className="text-base font-display">Rank Trend — Last 5 Weeks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              {TREND_HISTORY.map((item, i) => {
                const isLatest = i === TREND_HISTORY.length - 1;
                const maxRank  = Math.max(...TREND_HISTORY.map((t) => t.rank));
                const barH     = Math.round(((maxRank - item.rank + 10) / (maxRank + 10)) * 100);
                return (
                  <div key={item.week} className="flex-1 flex flex-col items-center gap-1">
                    <span className={cn("text-xs font-bold", isLatest ? "text-primary" : "text-muted-foreground")}>
                      #{item.rank}
                    </span>
                    <div
                      className={cn("w-full rounded-t-lg transition-all", isLatest ? "bg-primary" : "bg-muted")}
                      style={{ height: `${barH * 0.8}px`, minHeight: "20px" }}
                    />
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{item.week.replace(" ago","")}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overall">
          <TabsList className="grid grid-cols-3 w-full max-w-sm">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="subject">Subject-wise</TabsTrigger>
            <TabsTrigger value="stats">My Stats</TabsTrigger>
          </TabsList>

          {/* ── OVERALL LEADERBOARD ── */}
          <TabsContent value="overall" className="mt-4 space-y-3">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span className="text-amber-800 dark:text-amber-200 text-xs">Other students are shown with anonymous names to protect their privacy. Only you can see your own name.</span>
            </div>

            <div className="space-y-2">
              {OVERALL_RANKINGS.map((entry, idx) => {
                const showGap = idx > 0 && entry.rank - OVERALL_RANKINGS[idx - 1].rank > 1;
                return (
                  <div key={entry.rank}>
                    {/* Gap indicator */}
                    {showGap && (
                      <div className="flex items-center gap-2 py-1">
                        <div className="flex-1 border-t border-dashed border-border" />
                        <span className="text-xs text-muted-foreground">· · ·</span>
                        <div className="flex-1 border-t border-dashed border-border" />
                      </div>
                    )}

                    <div className={cn(
                      "rounded-xl border p-3 flex items-center gap-3 transition-all",
                      entry.isMe
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:bg-muted/30"
                    )}>
                      {/* Rank */}
                      <div className="flex-shrink-0 w-9 flex justify-center">
                        <RankBadge rank={entry.rank} />
                      </div>

                      {/* Avatar */}
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white",
                        entry.isMe
                          ? "bg-gradient-to-br from-primary to-purple-600"
                          : "bg-gradient-to-br from-gray-400 to-gray-600"
                      )}>
                        {entry.isMe ? "Y" : "?"}
                      </div>

                      {/* Name & info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm font-semibold", entry.isMe && "text-primary")}>
                            {entry.isMe ? "You" : anonymousName(entry.rank)}
                          </p>
                          {entry.isMe && (
                            <Badge variant="default" className="text-xs">You</Badge>
                          )}
                          {!entry.isMe && (
                            <Shield className="h-3 w-3 text-muted-foreground" aria-label="Anonymous" />
                          )}
                        </div>
                        <div className="flex gap-3 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            Score: <span className="font-medium text-foreground">{entry.score}</span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Accuracy: <span className="font-medium text-foreground">{entry.accuracy}%</span>
                          </span>
                        </div>
                      </div>

                      {/* Trend */}
                      <div className="flex-shrink-0 text-right">
                        {entry.trend === "up" && (
                          <div className="flex items-center gap-0.5 text-green-500 justify-end">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">+{entry.trendValue}</span>
                          </div>
                        )}
                        {entry.trend === "down" && (
                          <div className="flex items-center gap-0.5 text-red-500 justify-end">
                            <TrendingDown className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">-{entry.trendValue}</span>
                          </div>
                        )}
                        {entry.trend === "same" && (
                          <div className="flex items-center gap-0.5 text-muted-foreground justify-end">
                            <Minus className="h-3.5 w-3.5" />
                            <span className="text-xs">-</span>
                          </div>
                        )}
                        <div className="flex items-center gap-0.5 text-orange-400 justify-end mt-0.5">
                          <Flame className="h-3 w-3" />
                          <span className="text-xs">{entry.streak}d</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ── SUBJECT-WISE RANK ── */}
          <TabsContent value="subject" className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">Your rank in each subject based on test performance</p>
            {Object.entries(SUBJECT_RANKINGS[exam]).map(([subject, data]) => {
              const pct = Math.round(((data.total - data.myRank) / data.total) * 100 * 10) / 10;
              const scorePercent = Math.round((data.score / data.maxScore) * 100);
              return (
                <Card key={subject}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-8 rounded-full", {
                          "bg-blue-500":   subject === "Physics",
                          "bg-green-500":  subject === "Chemistry",
                          "bg-purple-500": subject === "Biology",
                          "bg-orange-500": subject === "Mathematics",
                        })} />
                        <div>
                          <p className="font-semibold text-sm">{subject}</p>
                          <p className="text-xs text-muted-foreground">Top {(100 - pct).toFixed(1)}% · {data.total.toLocaleString()} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-2xl font-display font-bold", SUBJECT_COLORS[subject])}>
                          #{data.myRank}
                        </p>
                        <p className="text-xs text-muted-foreground">{pct}th percentile</p>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-medium">{data.score}/{data.maxScore} ({scorePercent}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", {
                            "bg-blue-500":   subject === "Physics",
                            "bg-green-500":  subject === "Chemistry",
                            "bg-purple-500": subject === "Biology",
                            "bg-orange-500": subject === "Mathematics",
                          })}
                          style={{ width: `${scorePercent}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* ── MY STATS ── */}
          <TabsContent value="stats" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Overall Rank",      value: `#${examData.myRank}`,  icon: Trophy,    color: "text-brand-500"  },
                { label: "Percentile",         value: `${examData.percentile}`,icon: Star,     color: "text-amber-500"  },
                { label: "Tests Given",        value: "42",                   icon: Target,    color: "text-green-500"  },
                { label: "Avg Accuracy",       value: "74%",                  icon: BarChart2, color: "text-blue-500"   },
                { label: "Study Hours (Total)",value: "386h",                 icon: Clock,     color: "text-purple-500" },
                { label: "Current Streak",     value: "12 days",              icon: Flame,     color: "text-orange-500" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-card rounded-xl border p-4 text-center">
                    <Icon className={cn("h-6 w-6 mx-auto mb-1", stat.color)} />
                    <p className="text-xl font-display font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* What to improve */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">To Reach Top 10</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { subject: "Biology",     gap: "Need +32 marks",    action: "Focus on Genetics & Human Physiology"    },
                  { subject: "Chemistry",   gap: "Need +18 marks",    action: "Improve Organic Chemistry accuracy"      },
                  { subject: "Physics",     gap: "Need +14 marks",    action: "Practice more Electrostatics numericals" },
                ].map((item) => (
                  <div key={item.subject} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1.5", {
                      "bg-purple-500": item.subject === "Biology",
                      "bg-green-500":  item.subject === "Chemistry",
                      "bg-blue-500":   item.subject === "Physics",
                    })} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.subject}</span>
                        <Badge variant="secondary" className="text-xs">{item.gap}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.action}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy note */}
            <div className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Your Privacy is Protected</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Other students can never see your name, score, or profile in the leaderboard.
                  You appear as an anonymous name to everyone else.
                  Only you can see your own rank and performance.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
