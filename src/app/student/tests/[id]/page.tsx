// src/app/student/tests/[id]/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";
import {
  Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle,
  Send, BookmarkPlus, RotateCcw, CheckCircle2,
} from "lucide-react";

// ── Normalize question format ─────────────────────────────────────────────────
// AI returns: { question, options: ["text A", "text B", ...], correctAnswer: 0 }
// Mock uses:  { question_text, option_a, option_b, option_c, option_d }
// This normalizes both into one consistent shape
interface NormalizedQuestion {
  id: string;
  type: "mcq" | "integer" | "assertion_reason";
  subject: string;
  question_text: string;
  options: string[];       // always 4 items for MCQ
  marks: number;
  correctAnswer?: number;
  explanation?: string;
}

function normalizeQuestion(q: any, index: number): NormalizedQuestion {
  // AI format: q.options is an array
  if (Array.isArray(q.options) && q.options.length > 0) {
    return {
      id: q.id?.toString() || `q${index + 1}`,
      type: "mcq",
      subject: q.subject || "General",
      question_text: q.question || q.question_text || "",
      options: q.options,
      marks: q.marks || 4,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  }
  // Mock format: option_a, option_b, option_c, option_d
  return {
    id: q.id?.toString() || `q${index + 1}`,
    type: q.type || "mcq",
    subject: q.subject || "General",
    question_text: q.question_text || q.question || "",
    options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
    marks: q.marks || 4,
  };
}

type Status = "unseen" | "answered" | "marked" | "skipped";

const STATUS_COLORS: Record<Status, string> = {
  unseen:   "bg-muted text-muted-foreground",
  answered: "bg-green-500 text-white",
  marked:   "bg-amber-400 text-white",
  skipped:  "bg-red-400 text-white",
};

// @ts-ignore
export default function TestTakingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [questions, setQuestions]           = useState<NormalizedQuestion[]>([]);
  const [testTitle, setTestTitle]           = useState("Loading Test...");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [loading, setLoading]               = useState(true);
  const [currentQ, setCurrentQ]             = useState(0);
  const [answers, setAnswers]               = useState<Record<string, string>>({});
  const [integerInput, setIntegerInput]     = useState("");
  const [statuses, setStatuses]             = useState<Record<string, Status>>({});
  const [timeLeft, setTimeLeft]             = useState(30 * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isPaused, setIsPaused]             = useState(false);

  // ── Load questions ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadTest() {
      setLoading(true);
      try {
        // Read params from URL: ?subject=Physics&chapter=Physical World&exam=NEET&count=10
        const subject  = searchParams.get("subject")  || "Physics";
        const chapter  = searchParams.get("chapter")  || "Physical World";
        const exam     = searchParams.get("exam")      || "NEET";
        const count    = parseInt(searchParams.get("count") || "10");

        setTestTitle(`${chapter} — ${exam} Test`);
        setDurationMinutes(Math.max(15, count * 2)); // 2 min per question

        const res = await fetch("/api/ai/generate-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, chapter, exam, questionCount: count, type: "chapter" }),
        });

        const data = await res.json();
        if (!res.ok || !data.questions?.length) throw new Error(data.error || "No questions");

        const normalized = data.questions.map(normalizeQuestion);
        setQuestions(normalized);
        setTimeLeft(Math.max(15, count * 2) * 60);
      } catch (err: any) {
        console.error("Test load error:", err.message);
        // Fallback to empty state with error message
        setTestTitle("Error loading test");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [searchParams]);

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || loading || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, loading, questions.length]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft < 300;
  const question  = questions[currentQ];
  const total     = questions.length;

  function selectAnswer(opt: string) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: opt }));
    setStatuses((prev) => ({ ...prev, [question.id]: "answered" }));
  }

  function markForReview() {
    if (!question) return;
    setStatuses((prev) => ({ ...prev, [question.id]: "marked" }));
    goNext();
  }

  function clearAnswer() {
    if (!question) return;
    setAnswers((prev) => { const n = { ...prev }; delete n[question.id]; return n; });
    setStatuses((prev) => ({ ...prev, [question.id]: "skipped" }));
    setIntegerInput("");
  }

  function goNext() { if (currentQ < total - 1) setCurrentQ(currentQ + 1); }
  function goPrev() { if (currentQ > 0) setCurrentQ(currentQ - 1); }

  function handleSubmit() {
    router.push(`/student/tests/${params.id}/result`);
  }

  const answered = Object.values(statuses).filter((s) => s === "answered").length;
  const marked   = Object.values(statuses).filter((s) => s === "marked").length;
  const skipped  = Object.values(statuses).filter((s) => s === "skipped").length;

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground font-medium">Generating your test...</p>
        <p className="text-xs text-muted-foreground">This takes 10–20 seconds</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive font-medium">Could not load test questions.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-card border-b flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{testTitle}</p>
          <p className="text-xs text-muted-foreground">Q {currentQ + 1} of {total}</p>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold",
          isLowTime
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
            : "bg-muted"
        )}>
          <Clock className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>

        <Button variant="destructive" size="sm" onClick={() => setShowSubmitConfirm(true)}>
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
              <Badge variant="outline">MCQ</Badge>
              <Badge variant="outline">{question.subject}</Badge>
              <Badge variant="outline">{question.marks} marks</Badge>
            </div>

            {/* Question text */}
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {question.question_text}
              </p>
            </div>

            {/* Options */}
            {question.type !== "integer" && question.options.length > 0 && (
              <div className="space-y-2">
                {question.options.map((optText, idx) => {
                  const optLabel = ["A", "B", "C", "D"][idx];
                  const isSelected = answers[question.id] === optLabel;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(optLabel)}
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
                        {optLabel}
                      </span>
                      <span className="mt-0.5">{optText}</span>
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
              <Button
                variant="outline" size="sm"
                className="gap-1 text-amber-600 border-amber-200 hover:bg-amber-50"
                onClick={markForReview}
              >
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

          <div className="space-y-1 mb-3">
            {[
              { label: "Answered",    color: "bg-green-500" },
              { label: "Marked",      color: "bg-amber-400" },
              { label: "Skipped",     color: "bg-red-400"   },
              { label: "Not Visited", color: "bg-muted"     },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1 text-center text-xs mb-4 bg-muted/40 rounded-lg p-2">
            <div><p className="font-bold text-green-600">{answered}</p><p className="text-muted-foreground">Done</p></div>
            <div><p className="font-bold text-amber-500">{marked}</p><p className="text-muted-foreground">Review</p></div>
            <div><p className="font-bold text-red-500">{skipped}</p><p className="text-muted-foreground">Skip</p></div>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {questions.map((q, i) => {
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
                <h3 className="font-bold">Submit Test?</h3>
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
