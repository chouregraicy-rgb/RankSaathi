// src/components/shared/MoodIndicator.tsx
import { cn } from "@/utils";
import { MOOD_CONFIG } from "@/utils";
import type { MoodState } from "@/types";

interface MoodIndicatorProps {
  mood: MoodState;
  focusScore: number;
  burnoutRisk: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MoodIndicator({
  mood, focusScore, burnoutRisk, className, size = "md",
}: MoodIndicatorProps) {
  const config = MOOD_CONFIG[mood];

  const sizeClasses = {
    sm: { container: "p-3", emoji: "text-xl", label: "text-xs", score: "text-xs" },
    md: { container: "p-4", emoji: "text-2xl", label: "text-sm", score: "text-xs" },
    lg: { container: "p-5", emoji: "text-3xl", label: "text-base", score: "text-sm" },
  };

  const s = sizeClasses[size];

  return (
    <div className={cn(
      "rounded-xl border bg-card flex items-center gap-3",
      s.container, className
    )}>
      {/* Emoji with animated ring */}
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${config.color}20`, border: `2px solid ${config.color}` }}
        >
          <span className={s.emoji}>{config.emoji}</span>
        </div>
        {/* Pulse ring for burnout */}
        {mood === "burnout_risk" && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: config.color }}
          />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className={cn("font-semibold font-display", s.label)} style={{ color: config.color }}>
          {config.label}
        </p>
        <div className="flex gap-3 mt-1">
          <div>
            <p className={cn("text-muted-foreground", s.score)}>Focus</p>
            <p className={cn("font-bold", s.score)}>{focusScore}%</p>
          </div>
          {burnoutRisk > 0 && (
            <div>
              <p className={cn("text-muted-foreground", s.score)}>Burnout Risk</p>
              <p className={cn("font-bold", s.score, burnoutRisk >= 60 && "text-red-500")}>
                {burnoutRisk}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
