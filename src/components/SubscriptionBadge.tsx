"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Crown, Zap } from "lucide-react";
import Link from "next/link";

export function SubscriptionBadge({ className }: { className?: string }) {
  const { status, plan_id, days_left } = useSubscription();

  if (status === "loading") return null;

  if (status === "active") {
    const isLifetime = plan_id === "lifetime";
    return (
      <div className={`flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 ${className ?? ""}`}>
        <Crown className="w-3 h-3" />
        {isLifetime ? "Lifetime" : `Active · ${days_left}d left`}
      </div>
    );
  }

  // No subscription — show upgrade prompt
  return (
    <Link href="/pricing">
      <div className={`flex items-center gap-1.5 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 cursor-pointer hover:bg-orange-500/20 transition-colors ${className ?? ""}`}>
        <Zap className="w-3 h-3" />
        Get Access — ₹499
      </div>
    </Link>
  );
}
