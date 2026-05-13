// src/components/shared/StreakBadge.tsx
import { Flame } from "lucide-react";
import { cn } from "@/utils";

interface StreakBadgeProps {
  days: number;
  className?: string;
}

export function StreakBadge({ days, className }: StreakBadgeProps) {
  const isHot = days >= 7;
  const isSuperHot = days >= 30;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-xl border",
      isSuperHot
        ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
        : isHot
        ? "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800"
        : "bg-muted border-border",
      className
    )}>
      <Flame
        className={cn(
          "h-5 w-5",
          isSuperHot
            ? "text-red-500 animate-pulse-slow"
            : isHot
            ? "text-orange-500"
            : "text-muted-foreground"
        )}
      />
      <div>
        <p className="text-xs text-muted-foreground font-medium">Study Streak</p>
        <p className={cn(
          "text-lg font-display font-bold leading-tight",
          isSuperHot ? "text-red-500" : isHot ? "text-orange-500" : "text-foreground"
        )}>
          {days} {days === 1 ? "day" : "days"}
        </p>
      </div>
    </div>
  );
}
