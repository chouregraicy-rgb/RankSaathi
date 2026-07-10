"use client";
// src/components/doubt/WhiteboardPanel.tsx
// Phase 2 — Visual Whiteboard with KaTeX equation rendering
//
// Parses the AI stepwise response into individual steps and renders them
// progressively (typewriter reveal) on a whiteboard-styled panel.
// Equations wrapped in $...$ (inline) or $$...$$ (block) are rendered by KaTeX.
// Biology text (no equations) renders as clean formatted steps.
// Swappable: the rendering layer is isolated — swap KaTeX for MathJax later
// without touching the parent page.

import { useEffect, useState, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";
import { cn } from "@/utils";

interface WhiteboardPanelProps {
  content: string;          // full stepwise AI response
  subject?: string;         // used to decide equation vs plain rendering
  isVisible: boolean;       // trigger the reveal animation
  className?: string;
}

// ── Step parser ─────────────────────────────────────────────────────────
// Splits the AI response into individual steps by detecting:
// "Step 1:", "Step 2:", numbered lines, or double newlines as separators
function parseSteps(text: string): string[] {
  // Try splitting by "Step N:" pattern first
  const stepPattern = /(?=Step\s+\d+[:.:])/gi;
  const byStep = text.split(stepPattern).filter(s => s.trim());
  if (byStep.length > 1) return byStep.map(s => s.trim());

  // Try numbered lines: "1.", "2.", etc
  const numbered = text.split(/\n(?=\d+[\.\)])/);
  if (numbered.length > 1) return numbered.map(s => s.trim()).filter(Boolean);

  // Fall back to double-newline paragraphs
  const byParagraph = text.split(/\n{2,}/);
  if (byParagraph.length > 1) return byParagraph.map(s => s.trim()).filter(Boolean);

  // Last resort: single newlines
  return text.split("\n").map(s => s.trim()).filter(Boolean);
}

// ── Inline KaTeX renderer ────────────────────────────────────────────────
// Renders a string that may contain $inline$ and $$block$$ LaTeX
function renderWithLatex(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match $$block$$ first, then $inline$
  const pattern = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Text before this equation
    if (match.index > lastIndex) {
      parts.push(
        <span key={`t-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }

    const raw = match[0];
    const isBlock = raw.startsWith("$$");
    const latex = isBlock ? raw.slice(2, -2).trim() : raw.slice(1, -1).trim();

    try {
      const html = katex.renderToString(latex, {
        displayMode: isBlock,
        throwOnError: false,
        output: "html",
      });
      parts.push(
        <span
          key={`eq-${match.index}`}
          className={cn("katex-render", isBlock && "block my-2 text-center")}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      // If KaTeX fails just show raw
      parts.push(<code key={`raw-${match.index}`} className="text-xs bg-muted px-1 rounded">{raw}</code>);
    }

    lastIndex = match.index + raw.length;
  }

  // Remaining text after last equation
  if (lastIndex < text.length) {
    parts.push(<span key={`t-end`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length ? parts : [<span key="plain">{text}</span>];
}

// ── Step card ────────────────────────────────────────────────────────────
function StepCard({
  step,
  index,
  visible,
  subject,
}: {
  step: string;
  index: number;
  visible: boolean;
  subject?: string;
}) {
  const isBiology = subject?.toLowerCase() === "biology";
  const hasLatex = /\$/.test(step);
  const useEquationRendering = !isBiology && hasLatex;

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <div className="flex gap-3 items-start">
        {/* Step number circle */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm">
          {index + 1}
        </div>

        {/* Step content */}
        <div className="flex-1 text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-[system-ui] min-w-0">
          {useEquationRendering
            ? renderWithLatex(step)
            : <span className="whitespace-pre-wrap">{step}</span>
          }
        </div>
      </div>

      {/* Ruled separator line (notebook feel) */}
      <div className="ml-10 mt-3 border-b border-blue-100 dark:border-blue-900/30" />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────
export function WhiteboardPanel({
  content,
  subject,
  isVisible,
  className,
}: WhiteboardPanelProps) {
  const steps = parseSteps(content);
  const [revealedCount, setRevealedCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Progressive reveal: show one step every 600ms when isVisible becomes true
  useEffect(() => {
    if (!isVisible) {
      setRevealedCount(0);
      return;
    }
    // Reset and start fresh
    setRevealedCount(0);
    let count = 0;

    const reveal = () => {
      count += 1;
      setRevealedCount(count);
      if (count < steps.length) {
        timerRef.current = setTimeout(reveal, 550);
      }
    };
    timerRef.current = setTimeout(reveal, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, content]); // re-run when content changes (new answer)

  if (!content) return null;

  return (
    <div
      className={cn(
        // Whiteboard styling
        "relative rounded-2xl border-2 border-blue-200 dark:border-blue-800",
        "bg-white dark:bg-gray-950",
        // Subtle ruled-notebook texture via repeating gradient
        "bg-[repeating-linear-gradient(transparent,transparent_31px,#DBEAFE_31px,#DBEAFE_32px)]",
        "dark:bg-[repeating-linear-gradient(transparent,transparent_31px,#1e3a5f_31px,#1e3a5f_32px)]",
        "p-5 pt-6 overflow-hidden shadow-inner",
        className
      )}
    >
      {/* Whiteboard header bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-orange-400 to-amber-400 dark:from-orange-600 dark:to-amber-600 rounded-t-xl flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
        <span className="text-white text-xs font-semibold ml-1">
          {subject ? `${subject} — Solution` : "Step-by-Step Solution"}
        </span>
        {/* Live writing indicator */}
        {revealedCount < steps.length && (
          <span className="ml-auto flex items-center gap-1 text-white/80 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Writing...
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="mt-4 space-y-4">
        {steps.map((step, i) => (
          <StepCard
            key={i}
            step={step}
            index={i}
            visible={i < revealedCount}
            subject={subject}
          />
        ))}
      </div>

      {/* Progress bar at bottom */}
      <div className="mt-4 h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${steps.length ? (revealedCount / steps.length) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}
