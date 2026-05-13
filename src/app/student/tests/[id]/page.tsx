// src/app/student/tests/[id]/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils";
import {
  Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, X,
  Send, BookmarkPlus, RotateCcw, CheckCircle2,
} from "lucide-react";

// Mock test data — comes from Supabase in production
const MOCK_TEST = {
  id: "t1",
  title: "Physics — Electrostatics Full",
  duration_minutes: 45,
  total_marks: 90,
  negative_marking: -0.25,
  questions: [
    {
      id: "q1", type: "mcq", subject: "Physics",
      question_text: "Two point charges q₁ = 2μC and q₂ = -3μC are placed 30 cm apart. The force between them is:",
      option_a: "0.6 N repulsive", option_b: "0.6 N attractive",
      option_c: "6 N repulsive",   option_d: "6 N attractive",
      marks: 4,
    },
    {
      id: "q2", type: "mcq", subject: "Physics",
      question_text: "Electric field lines for a uniform field are:",
      option_a: "Diverging", option_b: "Converging",
      option_c: "Parallel and equally spaced", option_d: "Circular",
      marks: 4,
    },
    {
      id: "q3", type: "integer", subject: "Physics",
      question_text: "A capacitor of capacitance 4μF is charged to 100V. The energy stored (in mJ) is:",
      option_a: null, option_b: null, option_c: null, option_d: null,
      marks: 4,
    },
    {
      id: "q4", type: "assertion_reason", subject: "Physics",
      question_text: "Assertion (A): Electric potential is a scalar quantity.\nReason (R): Electric potential does not have a definite direction.",
      option_a: "Both A and R are true, and R is the correct explanation of A",
      option_b: "Both A and R are true, but R is not the correct explanation of A",
      option_c: "A is true but R is false",
      option_d: "A is false but R is true",
      marks: 4,
    },
    {
      id: "q5", type: "mcq", subject: "Physics",
      question_text: "The electric flux through a closed surface enclosing a charge q is:",
      option_a: "q/ε₀", option_b: "q·ε₀", option_c: "ε₀/q", option_d: "Zero",
      marks: 4,
    },
  ],
};

type Status = "unseen" | "answered" | "marked" | "skipped";

export default function TestTakingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [integerInput, setIntegerInput] = useState("");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [timeLeft, setTimeLeft] = useState(MOCK_TEST.duration_minutes * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const question = MOCK_TEST.questions[currentQ];
  const total = MOCK_TEST.questions.length;

  // Timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const timePercent = (timeLeft / (MOCK_TEST.duration_minutes * 60)) * 100;
  const isLowTime = timeLeft < 300; // < 5 minutes

  function selectAnswer(opt: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: opt }));
    setStatuses((prev) => ({ ...prev, [question.id]: "answered" }));
  }

  function markForReview() {
    setStatuses((prev) => ({ ...prev, [question.id]: "marked" }));
    goNext();
  }

  function clearAnswer() {
    setAnswers((prev) => { const n = { ...prev }; delete n[question.id]; return n; });
    setStatuses((prev) => ({ ...prev, [question.id]: "skipped" }));
  }

  function goNext() {
    if (currentQ < total - 1) setCurrentQ(currentQ + 1);
  }

  function goPrev() {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  }

  function handleSubmit() {
    // In production: POST to /api/tests/submit
    router.push(`/student/tests/${params.id}/result`);
  }

  const answered = Object.values(statuses).filter((s) => s === "answered").length;
  const marked = Object.values(statuses).filter((s) => s === "marked").length;
  const skipped = Object.values(statuses).filter((s) => s === "skipped").length;

  const STATUS_COLORS: Record<Status, string> = {
    unseen:   "bg-muted text-muted-foreground",
    answered: "bg-green-500 text-white",
    marked:   "bg-amber-400 text-white",
    skipped:  "bg-red-400 text-white",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-card border-b flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{MOCK_TEST.title}</p>
          <p className="text-xs text-muted-foreground">Q {currentQ + 1} of {total}</p>
        </div>

        {/* Timer */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold",
          isLowTime ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse" : "bg-muted"
        )}>
          <Clock className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowSubmitConfirm(true)}
        >
          <Send className="h-4 w-4 mr-1" /> Submit
        </Button>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className={cn("h-full transition-all", isLowTime ? "bg-red-500" : "bg-primary")}
          style={{ width: `${((currentQ + 1) / total) * 100}%` }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main question area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-5">

            {/* Question meta */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{question.type === "mcq" ? "MCQ" : question.type === "integer" ? "Integer" : "Assertion-Reason"}</Badge>
              <Badge variant="outline">{question.subject}</Badge>
              <Badge variant="success">{question.marks} marks</Badge>
              {MOCK_TEST.negative_marking !== 0 && (
                <Badge variant="destructive">{MOCK_TEST.negative_marking} per wrong</Badge>
              )}
            </div>

            {/* Question text */}
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {question.question_text}
              </p>
            </div>

            {/* MCQ / Assertion options */}
            {question.type !== "integer" && (
              <div className="space-y-2">
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const text = question[`option_${opt.toLowerCase()}` as keyof typeof question];
                  if (!text) return null;
                  const isSelected = answers[question.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => selectAnswer(opt)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <span className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        {opt}
                      </span>
                      <span className="mt-0.5">{text as string}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Integer input */}
            {question.type === "integer" && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Enter your integer answer:</p>
                <input
                  type="number"
                  value={integerInput}
                  onChange={(e) => {
                    setIntegerInput(e.target.value);
                    setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }));
                    setStatuses((prev) => ({ ...prev, [question.id]: "answered" }));
                  }}
                  className="w-full max-w-[200px] h-12 text-xl text-center font-bold rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none"
                  placeholder="0"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={clearAnswer}>
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </Button>
              <Button variant="outline" size="sm" className="gap-1 text-amber-600 border-amber-200 hover:bg-amber-50" onClick={markForReview}>
                <BookmarkPlus className="h-3.5 w-3.5" /> Mark for Review
              </Button>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={goPrev} disabled={currentQ === 0}>
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button size="sm" onClick={goNext} disabled={currentQ === total - 1}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Right panel: Question palette */}
        <aside className="hidden lg:flex flex-col w-56 border-l bg-card p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Question Palette</p>

          {/* Legend */}
          <div className="space-y-1 mb-3">
            {[
              { label: "Answered",   color: "bg-green-500" },
              { label: "Marked",     color: "bg-amber-400" },
              { label: "Skipped",    color: "bg-red-400"   },
              { label: "Not Visited",color: "bg-muted"     },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1 text-center text-xs mb-4 bg-muted/40 rounded-lg p-2">
            <div><p className="font-bold text-green-600">{answered}</p><p className="text-muted-foreground">Done</p></div>
            <div><p className="font-bold text-amber-500">{marked}</p><p className="text-muted-foreground">Review</p></div>
            <div><p className="font-bold text-red-500">{skipped}</p><p className="text-muted-foreground">Skip</p></div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-5 gap-1">
            {MOCK_TEST.questions.map((q, i) => {
              const status = statuses[q.id] ?? "unseen";
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    STATUS_COLORS[status],
                    currentQ === i && "ring-2 ring-primary ring-offset-1"
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Submit confirmation */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-display font-bold">Submit Test?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm bg-muted/40 rounded-xl p-3 mb-4">
              <div><p className="font-bold text-green-600">{answered}</p><p className="text-xs text-muted-foreground">Answered</p></div>
              <div><p className="font-bold text-amber-500">{marked}</p><p className="text-xs text-muted-foreground">Marked</p></div>
              <div><p className="font-bold text-muted-foreground">{total - answered - marked - skipped}</p><p className="text-xs text-muted-foreground">Unseen</p></div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowSubmitConfirm(false)}>
                Continue
              </Button>
              <Button className="flex-1" onClick={handleSubmit}>
                <CheckCircle2 className="h-4 w-4 mr-1" /> Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
