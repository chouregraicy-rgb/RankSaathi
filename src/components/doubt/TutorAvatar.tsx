"use client";
// src/components/doubt/TutorAvatar.tsx
// Phase 3 — Animated AI Tutor Avatar
//
// Pure CSS + SVG avatar — no external dependencies, no Lottie, works offline.
// Three states: idle (gentle bob), thinking (loading dots), speaking (excited bob + glow).
// Designed to sit beside the whiteboard on desktop and above it on mobile.
// Swappable: replace the SVG/CSS with a Lottie animation later without
// changing props or the parent layout.

import { cn } from "@/utils";

export type AvatarState = "idle" | "thinking" | "speaking";

interface TutorAvatarProps {
  state: AvatarState;
  subject?: string;
  className?: string;
}

// Subject → color theme for the avatar glow ring
const SUBJECT_COLORS: Record<string, { ring: string; glow: string; badge: string }> = {
  physics:     { ring: "from-blue-400 to-indigo-500",   glow: "shadow-blue-300",   badge: "⚡" },
  chemistry:   { ring: "from-green-400 to-emerald-500", glow: "shadow-green-300",  badge: "⚗️" },
  biology:     { ring: "from-pink-400 to-rose-500",     glow: "shadow-pink-300",   badge: "🧬" },
  mathematics: { ring: "from-purple-400 to-violet-500", glow: "shadow-purple-300", badge: "📐" },
  default:     { ring: "from-orange-400 to-amber-500",  glow: "shadow-orange-300", badge: "🤖" },
};

function getTheme(subject?: string) {
  const key = subject?.toLowerCase() ?? "default";
  return SUBJECT_COLORS[key] ?? SUBJECT_COLORS.default;
}

// ── The SVG face ─────────────────────────────────────────────────────────
function AvatarFace({ state }: { state: AvatarState }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="40" cy="40" r="36" fill="url(#headGrad)" />
      <defs>
        <radialGradient id="headGrad" cx="40%" cy="35%" r="60%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <ellipse cx="10" cy="40" rx="6" ry="8" fill="#F59E0B" />
      <ellipse cx="70" cy="40" rx="6" ry="8" fill="#F59E0B" />

      {/* Eyes */}
      {state === "thinking" ? (
        // Thinking: squinted eyes
        <>
          <path d="M24 34 Q28 31 32 34" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 34 Q52 31 56 34" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : state === "speaking" ? (
        // Speaking: wide happy eyes with shine
        <>
          <ellipse cx="28" cy="34" rx="6" ry="7" fill="#1F2937" />
          <ellipse cx="52" cy="34" rx="6" ry="7" fill="#1F2937" />
          <circle cx="30" cy="31" r="2" fill="white" />
          <circle cx="54" cy="31" r="2" fill="white" />
          {/* Rosy cheeks */}
          <ellipse cx="18" cy="44" rx="6" ry="4" fill="#FBBF24" opacity="0.5" />
          <ellipse cx="62" cy="44" rx="6" ry="4" fill="#FBBF24" opacity="0.5" />
        </>
      ) : (
        // Idle: normal calm eyes
        <>
          <ellipse cx="28" cy="34" rx="5" ry="6" fill="#1F2937" />
          <ellipse cx="52" cy="34" rx="5" ry="6" fill="#1F2937" />
          <circle cx="29.5" cy="32" r="1.5" fill="white" />
          <circle cx="53.5" cy="32" r="1.5" fill="white" />
        </>
      )}

      {/* Mouth */}
      {state === "speaking" ? (
        // Open mouth — talking
        <>
          <path d="M28 52 Q40 64 52 52" fill="#1F2937" />
          <path d="M28 52 Q40 60 52 52" fill="#EF4444" />
          <path d="M30 52 Q40 57 50 52" fill="white" opacity="0.9" />
        </>
      ) : state === "thinking" ? (
        // Slightly open — pondering
        <path d="M30 54 Q40 58 50 54" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      ) : (
        // Idle — gentle smile
        <path d="M28 52 Q40 62 52 52" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}

      {/* Graduate cap — always visible */}
      <rect x="18" y="14" width="44" height="6" rx="2" fill="#1F2937" />
      <polygon points="40,4 60,14 40,14 20,14" fill="#374151" />
      <line x1="60" y1="14" x2="66" y2="24" stroke="#F59E0B" strokeWidth="2" />
      <circle cx="66" cy="26" r="3" fill="#F59E0B" />
    </svg>
  );
}

// ── Thinking dots ────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 justify-center mt-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-orange-400"
          style={{
            animation: `thinkDot 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes thinkDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────
export function TutorAvatar({ state, subject, className }: TutorAvatarProps) {
  const theme = getTheme(subject);

  const stateLabel: Record<AvatarState, string> = {
    idle:     "VidyaSaathi Tutor",
    thinking: "Thinking...",
    speaking: "Speaking",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2 select-none", className)}>
      {/* Avatar container with animated ring */}
      <div className="relative">
        {/* Outer glow ring — pulses when speaking */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br",
            theme.ring,
            "opacity-30",
            state === "speaking" && "animate-ping",
            state === "thinking" && "animate-pulse"
          )}
          style={{ margin: "-4px" }}
        />

        {/* Secondary ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br",
            theme.ring,
            "opacity-60"
          )}
          style={{ margin: "-2px" }}
        />

        {/* Avatar circle */}
        <div
          className={cn(
            "relative w-20 h-20 rounded-full bg-white shadow-lg",
            state === "speaking" && `shadow-xl ${theme.glow}`,
            "overflow-hidden"
          )}
          style={{
            animation:
              state === "speaking"
                ? "avatarBob 0.5s ease-in-out infinite alternate"
                : state === "thinking"
                ? "avatarThink 2s ease-in-out infinite"
                : "avatarIdle 3s ease-in-out infinite",
          }}
        >
          <AvatarFace state={state} />
        </div>

        {/* Subject badge — top right */}
        {subject && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-[11px]">
            {theme.badge}
          </div>
        )}

        {/* Speaking: sound ripple rings */}
        {state === "speaking" && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-orange-300 animate-ping opacity-40" style={{ margin: "-8px" }} />
            <div className="absolute inset-0 rounded-full border border-orange-200 animate-ping opacity-20" style={{ margin: "-16px", animationDelay: "0.2s" }} />
          </>
        )}
      </div>

      {/* State label */}
      <div className="text-center">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          {stateLabel[state]}
        </p>
        {state === "thinking" && <ThinkingDots />}
        {state === "speaking" && (
          <div className="flex items-center justify-center gap-[2px] mt-0.5">
            {[1, 3, 2, 4, 1, 3].map((h, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-orange-400 inline-block"
                style={{
                  height: `${h * 2}px`,
                  animation: `avatarSound 0.7s ${i * 0.1}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* All keyframe animations */}
      <style>{`
        @keyframes avatarIdle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes avatarBob {
          from { transform: translateY(-3px) rotate(-2deg); }
          to   { transform: translateY(3px)  rotate(2deg);  }
        }
        @keyframes avatarThink {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-3deg); }
          75% { transform: translateY(-1px) rotate(3deg);  }
        }
        @keyframes avatarSound {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
}
