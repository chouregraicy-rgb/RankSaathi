"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Clock, Zap } from "lucide-react";
import Link from "next/link";

export function SubscriptionBadge() {
  const { subscription, isTrial, isPaid, loading, daysLeft } = useSubscription();

  if (loading) return <div className="h-7 w-28 bg-muted animate-pulse rounded-full" />;

  if (isPaid && subscription) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-indigo-600 text-white gap-1.5 px-3 py-1">
          <Crown className="w-3.5 h-3.5" />
          {subscription.plan_name}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {daysLeft > 0 ? `${daysLeft}d left` : "Expires today"}
        </span>
      </div>
    );
  }

  if (isTrial && subscription) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-amber-400 text-amber-600 gap-1.5 px-3 py-1">
          <Clock className="w-3.5 h-3.5" />
          Free Trial
        </Badge>
        <span className="text-xs text-muted-foreground">
          {daysLeft > 0 ? `${daysLeft}d left` : "Ends today"}
        </span>
        <Link href="/pricing">
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-indigo-600">
            Upgrade
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Link href="/pricing">
      <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
        <Zap className="w-3.5 h-3.5" />
        Upgrade to Pro
      </Button>
    </Link>
  );
}

