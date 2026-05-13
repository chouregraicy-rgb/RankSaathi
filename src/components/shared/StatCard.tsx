// src/components/shared/StatCard.tsx
import { cn } from "@/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "blue" | "green" | "purple" | "orange" | "red";
  className?: string;
}

const COLOR_MAP = {
  blue:   { bg: "bg-brand-50 dark:bg-brand-950/50",  icon: "bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400",  trend: "text-brand-600 dark:text-brand-400"  },
  green:  { bg: "bg-green-50 dark:bg-green-950/50",  icon: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",  trend: "text-green-600 dark:text-green-400"  },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/50", icon: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400", trend: "text-purple-600 dark:text-purple-400" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/50", icon: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400", trend: "text-orange-600 dark:text-orange-400" },
  red:    { bg: "bg-red-50 dark:bg-red-950/50",      icon: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",          trend: "text-red-600 dark:text-red-400"      },
};

export function StatCard({
  title, value, subtitle, icon: Icon, trend, color = "blue", className,
}: StatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div className={cn(
      "rounded-xl border bg-card p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200",
      className
    )}>
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", colors.icon)}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground font-medium truncate">{title}</p>
        <p className="text-2xl font-display font-bold mt-0.5 leading-tight">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        {trend && (
          <p className={cn("text-xs font-medium mt-1", colors.trend)}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
