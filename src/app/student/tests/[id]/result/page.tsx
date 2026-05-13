// src/app/student/tests/[id]/result/page.tsx
"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trophy, Target, Clock, CheckCircle2, XCircle, Minus, Lightbulb, ArrowLeft, RotateCcw } from "lucide-react";
import { cn, scoreToGrade, SUBJECT_COLORS } from "@/utils";
import Link from "next/link";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from "recharts";

// Mock result — comes from Supabase + AI in production
const MOCK_RESULT = {
  score: 52,
  maxScore: 80,
  accuracy: 72,
  timeTaken: 38,
  rank_estimate: 18400,
  subject_breakdown: [
    { subject: "Physics",   correct: 8, wrong: 2, skipped: 3, score: 30 },
    { subject: "Chemistry", correct: 6, wrong: 1, skipped: 2, score: 22 },
  ],
  weak_topics: ["Gauss's Law", "Capacitor Combinations", "Energy Density"],
  strong_topics: ["Coulomb's Law", "Electric Field Lines"],
};

const RADAR_DATA = [
  { subject: "Speed",       score: 70 },
  { subject: "Accuracy",    score: 72 },
  { subject: "Consistency", score: 60 },
  { subject: "Concepts",    score: 65 },
  { subject: "Application", score: 58 },
];

export default function TestResultPage({ params }: { params: { id: string } }) {
  const [tips, setTips] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);

  useEffect(() => {
    // Fetch AI improvement tips
    fetch("/api/ai/test-tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: MOCK_RESULT.score,
        maxScore: MOCK_RESULT.maxScore,
        weakTopics: MOCK_RESULT.weak_topics,
        timeTaken: MOCK_RESULT.timeTaken,
        subject: "Physics",
      }),
    })
      .then((r) => r.json())
      .then((data) => setTips(data.tips ?? DEFAULT_TIPS))
      .catch(() => setTips(DEFAULT_TIPS))
      .finally(() => setLoadingTips(false));
  }, []);

  const DEFAULT_TIPS = [
    "Practice Gauss's Law problems using symmetry arguments — try 10 problems daily for a week",
    "For Capacitor Combinations, draw circuit diagrams before calculating — it prevents silly errors",
    "Review Energy Density formula derivation from first principles at least twice",
    "Your time per question was good (avg 2.3m) — focus on accuracy over speed now",
  ];

  const grade = scoreToGrade(MOCK_RESULT.accuracy);
  const pct = Math.round((MOCK_RESULT.score / MOCK_RESULT.maxScore) * 100);

  const GRADE_COLORS: Record<string, string> = {
    "A+": "text-green-500", A: "text-green-500", "B+": "text-blue-500",
    B: "text-blue-500", C: "text-amber-500", D: "text-red-500",
  };

  return (
    <DashboardLayout role="student" title="Test Result">
      <div className="max-w-3xl space-y-5">

        {/* Back */}
        <Link href="/student/tests">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Tests
          </Button>
        </Link>

        {/* Score hero */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white" />
          </div>
          <div className="relative">
            <Trophy className="h-10 w-10 mx-auto mb-2 text-brand-200" />
            <p className={cn("text-6xl font-display font-bold", GRADE_COLORS[grade]?.replace("text-", "text-") ?? "text-white")}>
              {grade}
            </p>
            <p className="text-3xl font-display font-bold mt-1">
              {MOCK_RESULT.score} / {MOCK_RESULT.maxScore}
            </p>
            <p className="text-brand-200 text-sm mt-1">{pct}% score</p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div>
                <p className="text-brand-200">Accuracy</p>
                <p className="font-bold">{MOCK_RESULT.accuracy}%</p>
              </div>
              <div>
                <p className="text-brand-200">Time Taken</p>
                <p className="font-bold">{MOCK_RESULT.timeTaken}m</p>
              </div>
              <div>
                <p className="text-brand-200">Rank Est.</p>
                <p className="font-bold">#{MOCK_RESULT.rank_estimate.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="grid gap-4">
          {MOCK_RESULT.subject_breakdown.map((item) => {
            const total = item.correct + item.wrong + item.skipped;
            return (
              <Card key={item.subject}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SUBJECT_COLORS[item.subject] }} />
                      <span className="font-semibold text-sm">{item.subject}</span>
                    </div>
                    <span className="font-bold">{item.score} marks</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm mb-3">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                      <p className="font-bold text-green-600">{item.correct}</p>
                      <p className="text-xs text-muted-foreground">Correct</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                      <p className="font-bold text-red-500">{item.wrong}</p>
                      <p className="text-xs text-muted-foreground">Wrong</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-bold">{item.skipped}</p>
                      <p className="text-xs text-muted-foreground">Skipped</p>
                    </div>
                  </div>
                  <Progress value={Math.round((item.correct / total) * 100)} className="h-1.5" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance radar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar dataKey="score" stroke="#2b7fff" fill="#2b7fff" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weak / Strong topics */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display text-red-500">Weak Topics — Revise These</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {MOCK_RESULT.weak_topics.map((topic) => (
                  <li key={topic} className="flex items-center gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display text-green-500">Strong Topics — Keep Going!</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {MOCK_RESULT.strong_topics.map((topic) => (
                  <li key={topic} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* AI improvement tips */}
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base font-display">AI Improvement Tips</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadingTips ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating personalised tips...
              </div>
            ) : (
              <ol className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/student/tests" className="flex-1">
            <Button variant="outline" className="w-full">View All Tests</Button>
          </Link>
          <Link href="/student/revision" className="flex-1">
            <Button className="w-full gap-2">
              <RotateCcw className="h-4 w-4" /> Revise Weak Topics
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
