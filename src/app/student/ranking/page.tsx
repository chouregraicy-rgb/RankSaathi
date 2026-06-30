// src/app/student/ranking/page.tsx
"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Trophy, Shield, Target } from "lucide-react";
import Link from "next/link";

// Cross-student ranking requires aggregating real test-attempt data across
// every student, which doesn't exist yet — this page previously showed
// fabricated leaderboard numbers (identical fake rank/percentile for every
// user). Showing an honest "not available yet" state instead until real
// ranking computation is built.

export default function RankingPage() {
  return (
    <DashboardLayout role="student" title="My Ranking">
      <div className="max-w-2xl mx-auto mt-12 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
          <Trophy className="w-7 h-7 text-primary" />
        </div>

        <h2 className="font-display font-bold text-xl">Rankings aren't available yet</h2>

        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Your rank is calculated by comparing real test performance across all
          VidyaSaathi students. We need a meaningful number of completed test
          attempts before rankings are accurate — take some tests and check
          back here soon.
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2.5 max-w-sm mx-auto">
          <Shield className="h-3.5 w-3.5 flex-shrink-0" />
          When rankings launch, your identity stays private to other students.
        </div>

        <Link
          href="/student/tests"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all"
        >
          <Target className="w-4 h-4" />
          Take a Test
        </Link>
      </div>
    </DashboardLayout>
  );
}
