"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Crown, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SubscriptionBadge({ className }: { className?: string }) {
  const { subscribed, status, plan_type, days_left } = useSubscription();

  if (status === "loading") return null;

  if (status === "active") {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1", className)}>
        <Crown className="w-3 h-3" />
        {plan_type === "family" ? "Family" : "Student"} · {days_left}d left
      </div>
    );
  }

  if (status === "trial") {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1", className)}>
        <Clock className="w-3 h-3" />
        Trial · {days_left}d left
      </div>
    );
  }

  return (
    <Link href="/student/pricing">
      <div className={cn("flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 cursor-pointer hover:bg-indigo-500/20 transition-colors", className)}>
        <AlertCircle className="w-3 h-3" />
        Upgrade to Pro
      </div>
    </Link>
  );
}
