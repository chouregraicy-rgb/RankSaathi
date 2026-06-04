// src/app/student/revision/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Flame, CheckCircle2, RotateCcw, FileText,
  Calculator, AlertTriangle, Star, ChevronDown, ChevronUp,
  Loader2, Lightbulb, Target, XCircle, Play, Trophy,
  ArrowRight, ArrowLeft, CheckSquare,
} from "lucide-react";
import { cn } from "@/utils";

// ── COMPLETE SYLLABUS ──────────────────────────────────────
const SUBJECTS_DATA = [
  {
    subject: "Physics", units: [
      { name: "Physical World & Measurement", chapters: [{ name: "Physical World", revised: 0, confidence: 3, due: false }, { name: "Units & Measurements", revised: 1, confidence: 3, due: false }] },
      { name: "Kinematics", chapters: [{ name: "Motion in a Straight Line", revised: 2, confidence: 4, due: false }, { name: "Motion in a Plane", revised: 1, confidence: 3, due: true }] },
      { name: "Laws of Motion", chapters: [{ name: "Newton's Laws of Motion", revised: 3, confidence: 4, due: false }, { name: "Friction", revised: 2, confidence: 3, due: false }, { name: "Circular Motion", revised: 1, confidence: 2, due: true }] },
      { name: "Work, Energy & Power", chapters: [{ name: "Work & Energy", revised: 2, confidence: 3, due: true }, { name: "Power & Collisions", revised: 1, confidence: 2, due: true }] },
      { name: "Rotational Motion", chapters: [{ name: "Centre of Mass", revised: 1, confidence: 2, due: true }, { name: "Rotational Motion & Torque", revised: 1, confidence: 2, due: true }, { name: "Moment of Inertia", revised: 0, confidence: 1, due: true }] },
      { name: "Gravitation", chapters: [{ name: "Gravitation & Kepler's Laws", revised: 2, confidence: 3, due: false }, { name: "Satellites & Escape Velocity", revised: 1, confidence: 3, due: false }] },
      { name: "Properties of Matter", chapters: [{ name: "Elasticity", revised: 1, confidence: 3, due: false }, { name: "Fluid Mechanics", revised: 1, confidence: 2, due: true }, { name: "Surface Tension & Viscosity", revised: 0, confidence: 2, due: true }] },
      { name: "Thermodynamics", chapters: [{ name: "Thermal Properties of Matter", revised: 1, confidence: 3, due: false }, { name: "Thermodynamics Laws", revised: 2, confidence: 3, due: false }, { name: "Kinetic Theory of Gases", revised: 1, confidence: 2, due: true }] },
      { name: "Oscillations & Waves", chapters: [{ name: "Simple Harmonic Motion", revised: 2, confidence: 3, due: false }, { name: "Waves & Sound", revised: 1, confidence: 2, due: true }, { name: "Doppler Effect", revised: 0, confidence: 2, due: true }] },
      { name: "Electrostatics", chapters: [{ name: "Electric Charges & Coulomb's Law", revised: 3, confidence: 4, due: false }, { name: "Electric Field & Potential", revised: 2, confidence: 3, due: false }, { name: "Gauss's Law", revised: 1, confidence: 2, due: true }, { name: "Capacitors", revised: 2, confidence: 3, due: true }] },
      { name: "Current Electricity", chapters: [{ name: "Ohm's Law & Resistance", revised: 2, confidence: 4, due: false }, { name: "Kirchhoff's Laws", revised: 1, confidence: 3, due: false }, { name: "Wheatstone Bridge", revised: 1, confidence: 3, due: false }] },
      { name: "Magnetic Effects", chapters: [{ name: "Magnetic Force on Current", revised: 1, confidence: 3, due: false }, { name: "Biot-Savart & Ampere's Law", revised: 1, confidence: 2, due: true }, { name: "Magnetism & Matter", revised: 0, confidence: 2, due: true }] },
      { name: "Electromagnetic Induction", chapters: [{ name: "Faraday's Laws & EMF", revised: 1, confidence: 3, due: false }, { name: "AC Circuits & LCR", revised: 1, confidence: 2, due: true }, { name: "Transformers", revised: 0, confidence: 2, due: true }] },
      { name: "Optics", chapters: [{ name: "Ray Optics & Mirrors", revised: 2, confidence: 4, due: false }, { name: "Refraction & Lenses", revised: 2, confidence: 3, due: false }, { name: "Wave Optics & Interference", revised: 1, confidence: 2, due: true }, { name: "Diffraction & Polarisation", revised: 0, confidence: 1, due: true }] },
      { name: "Modern Physics", chapters: [{ name: "Dual Nature of Radiation", revised: 1, confidence: 3, due: false }, { name: "Atoms & Nuclei", revised: 1, confidence: 2, due: true }, { name: "Radioactivity", revised: 0, confidence: 2, due: true }, { name: "Semiconductors & Devices", revised: 1, confidence: 3, due: false }] },
    ],
  },
  {
    subject: "Chemistry", units: [
      { name: "Basic Concepts", chapters: [{ name: "Mole Concept & Stoichiometry", revised: 2, confidence: 4, due: false }, { name: "Atomic Structure", revised: 2, confidence: 4, due: false }, { name: "Chemical Bonding & Hybridisation", revised: 2, confidence: 3, due: false }] },
      { name: "States of Matter", chapters: [{ name: "Gaseous State", revised: 1, confidence: 3, due: false }, { name: "Liquid & Solid State", revised: 1, confidence: 2, due: true }] },
      { name: "Thermodynamics & Equilibrium", chapters: [{ name: "Thermodynamics", revised: 1, confidence: 3, due: false }, { name: "Chemical Equilibrium", revised: 2, confidence: 3, due: false }, { name: "Ionic Equilibrium", revised: 1, confidence: 2, due: true }] },
      { name: "Electrochemistry & Kinetics", chapters: [{ name: "Redox Reactions", revised: 2, confidence: 4, due: false }, { name: "Electrochemistry", revised: 1, confidence: 2, due: true }, { name: "Chemical Kinetics", revised: 1, confidence: 2, due: true }] },
      { name: "s & p Block Elements", chapters: [{ name: "Hydrogen & s-Block", revised: 1, confidence: 3, due: false }, { name: "p-Block: Group 13 & 14", revised: 1, confidence: 2, due: true }, { name: "p-Block: Group 15, 16 & 17", revised: 1, confidence: 2, due: true }, { name: "p-Block: Noble Gases (Group 18)", revised: 0, confidence: 2, due: true }] },
      { name: "d, f Block & Coordination", chapters: [{ name: "d & f Block Elements", revised: 1, confidence: 2, due: true }, { name: "Coordination Compounds", revised: 1, confidence: 2, due: true }] },
      { name: "Organic Chemistry", chapters: [{ name: "Basic Organic Chemistry", revised: 2, confidence: 3, due: false }, { name: "Hydrocarbons", revised: 2, confidence: 3, due: false }, { name: "Haloalkanes & Haloarenes", revised: 1, confidence: 2, due: true }, { name: "Alcohols, Phenols & Ethers", revised: 1, confidence: 2, due: true }, { name: "Aldehydes & Ketones", revised: 1, confidence: 2, due: true }, { name: "Carboxylic Acids & Derivatives", revised: 0, confidence: 1, due: true }, { name: "Amines", revised: 0, confidence: 1, due: true }, { name: "Biomolecules & Polymers", revised: 1, confidence: 3, due: false }, { name: "Chemistry in Everyday Life", revised: 1, confidence: 3, due: false }] },
      { name: "Solutions & Surface Chemistry", chapters: [{ name: "Solutions & Colligative Properties", revised: 1, confidence: 2, due: true }, { name: "Surface Chemistry", revised: 0, confidence: 2, due: true }] },
    ],
  },
  {
    subject: "Biology", units: [
      { name: "Diversity of Living Organisms", chapters: [{ name: "The Living World", revised: 1, confidence: 3, due: false }, { name: "Biological Classification", revised: 1, confidence: 3, due: false }, { name: "Plant Kingdom", revised: 1, confidence: 2, due: true }, { name: "Animal Kingdom", revised: 1, confidence: 2, due: true }] },
      { name: "Structural Organisation", chapters: [{ name: "Morphology of Flowering Plants", revised: 1, confidence: 3, due: false }, { name: "Anatomy of Flowering Plants", revised: 1, confidence: 2, due: true }, { name: "Structural Organisation in Animals", revised: 0, confidence: 2, due: true }] },
      { name: "Cell Biology", chapters: [{ name: "Cell: The Unit of Life", revised: 2, confidence: 4, due: false }, { name: "Biomolecules", revised: 1, confidence: 3, due: false }, { name: "Cell Cycle & Cell Division", revised: 2, confidence: 3, due: false }] },
      { name: "Plant Physiology", chapters: [{ name: "Transport in Plants", revised: 1, confidence: 3, due: false }, { name: "Mineral Nutrition", revised: 0, confidence: 2, due: true }, { name: "Photosynthesis", revised: 2, confidence: 4, due: false }, { name: "Respiration in Plants", revised: 1, confidence: 3, due: false }, { name: "Plant Growth & Development", revised: 0, confidence: 2, due: true }] },
      { name: "Human Physiology", chapters: [{ name: "Digestion & Absorption", revised: 1, confidence: 3, due: false }, { name: "Breathing & Exchange of Gases", revised: 1, confidence: 3, due: false }, { name: "Body Fluids & Circulation", revised: 1, confidence: 2, due: true }, { name: "Excretory Products & Elimination", revised: 1, confidence: 2, due: true }, { name: "Locomotion & Movement", revised: 0, confidence: 2, due: true }, { name: "Neural Control & Coordination", revised: 1, confidence: 2, due: true }, { name: "Chemical Coordination", revised: 0, confidence: 1, due: true }] },
      { name: "Reproduction", chapters: [{ name: "Reproduction in Organisms", revised: 1, confidence: 3, due: false }, { name: "Sexual Reproduction in Plants", revised: 1, confidence: 2, due: true }, { name: "Human Reproduction", revised: 2, confidence: 3, due: false }, { name: "Reproductive Health", revised: 1, confidence: 3, due: false }] },
      { name: "Genetics & Evolution", chapters: [{ name: "Principles of Inheritance", revised: 2, confidence: 4, due: false }, { name: "Molecular Basis of Inheritance", revised: 1, confidence: 2, due: true }, { name: "Evolution", revised: 1, confidence: 3, due: false }] },
      { name: "Biology in Human Welfare", chapters: [{ name: "Human Health & Disease", revised: 1, confidence: 3, due: false }, { name: "Microbes in Human Welfare", revised: 0, confidence: 2, due: true }, { name: "Biotechnology: Principles", revised: 1, confidence: 2, due: true }, { name: "Biotechnology & Its Applications", revised: 0, confidence: 2, due: true }] },
      { name: "Ecology", chapters: [{ name: "Organisms & Populations", revised: 1, confidence: 3, due: false }, { name: "Ecosystem", revised: 1, confidence: 2, due: true }, { name: "Biodiversity & Conservation", revised: 0, confidence: 2, due: true }, { name: "Environmental Issues", revised: 0, confidence: 2, due: true }] },
    ],
  },
  {
    subject: "Mathematics", units: [
      { name: "Algebra", chapters: [{ name: "Sets, Relations & Functions", revised: 2, confidence: 4, due: false }, { name: "Complex Numbers", revised: 1, confidence: 3, due: false }, { name: "Sequences & Series", revised: 1, confidence: 3, due: false }, { name: "Quadratic Equations", revised: 2, confidence: 4, due: false }, { name: "Permutations & Combinations", revised: 1, confidence: 3, due: false }, { name: "Binomial Theorem", revised: 1, confidence: 3, due: false }, { name: "Mathematical Induction", revised: 0, confidence: 2, due: true }] },
      { name: "Trigonometry", chapters: [{ name: "Trigonometric Functions", revised: 2, confidence: 4, due: false }, { name: "Inverse Trigonometric Functions", revised: 1, confidence: 3, due: false }, { name: "Heights & Distances", revised: 1, confidence: 3, due: false }] },
      { name: "Coordinate Geometry", chapters: [{ name: "Straight Lines", revised: 2, confidence: 4, due: false }, { name: "Circles", revised: 1, confidence: 3, due: false }, { name: "Parabola", revised: 1, confidence: 2, due: true }, { name: "Ellipse", revised: 1, confidence: 2, due: true }, { name: "Hyperbola", revised: 0, confidence: 2, due: true }] },
      { name: "Calculus", chapters: [{ name: "Limits & Continuity", revised: 2, confidence: 3, due: false }, { name: "Differentiation", revised: 2, confidence: 4, due: false }, { name: "Applications of Derivatives", revised: 1, confidence: 3, due: false }, { name: "Integral Calculus", revised: 1, confidence: 2, due: true }, { name: "Definite Integrals & Area", revised: 1, confidence: 2, due: true }, { name: "Differential Equations", revised: 0, confidence: 1, due: true }] },
      { name: "Vectors & 3D Geometry", chapters: [{ name: "Vectors", revised: 1, confidence: 3, due: false }, { name: "3D Geometry", revised: 1, confidence: 2, due: true }] },
      { name: "Statistics & Probability", chapters: [{ name: "Statistics & Measures", revised: 1, confidence: 3, due: false }, { name: "Probability", revised: 1, confidence: 3, due: false }, { name: "Bayes Theorem & Distributions", revised: 0, confidence: 2, due: true }] },
      { name: "Matrices & Determinants", chapters: [{ name: "Matrices", revised: 1, confidence: 3, due: false }, { name: "Determinants", revised: 1, confidence: 3, due: false }] },
      { name: "Linear Programming", chapters: [{ name: "Linear Programming", revised: 0, confidence: 2, due: true }] },
    ],
  },
];

const NOTE_TYPES = [
  { key: "quick_notes",   label: "Quick Notes",       icon: FileText      },
  { key: "formula_sheet", label: "Formula Sheet",     icon: Calculator    },
  { key: "mistakes",      label: "Mistakes to Avoid", icon: AlertTriangle },
  { key: "pyq",           label: "PYQ Highlights",    icon: Star          },
];

const CONFIDENCE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Very Weak", color: "text-red-500"    },
  2: { label: "Weak",      color: "text-orange-500" },
  3: { label: "Average",   color: "text-amber-500"  },
  4: { label: "Good",      color: "text-blue-500"   },
  5: { label: "Excellent", color: "text-green-500"  },
};

interface SummaryData {
  keyPoints: string[];
  formulas: string[];
  examTips: string[];
  commonMistakes: string[];
  quickRevision?: string;
}

interface Question {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: string;
  explanation: string;
}

type PracticeStage = "idle" | "loading" | "attempt" | "result";

interface PYQQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: string;
  year: string;
  explanation: string;
}

export default function RevisionPage() {
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [activeNote, setActiveNote]           = useState("quick_notes");
  const [showSummary, setShowSummary]         = useState(false);
  const [summary, setSummary]                 = useState<SummaryData | null>(null);
  const [loadingSummary, setLoadingSummary]   = useState(false);
  const [searchQuery, setSearchQuery]         = useState("");

  // Notes tab content — reuses summary API, cached per chapter
  const [notesData, setNotesData]             = useState<SummaryData | null>(null);
  const [loadingNotes, setLoadingNotes]       = useState(false);

  // PYQ tab state
  const [pyqQuestions, setPyqQuestions]       = useState<PYQQuestion[]>([]);
  const [loadingPyq, setLoadingPyq]           = useState(false);
  const [pyqRevealed, setPyqRevealed]         = useState<Record<number, boolean>>({});
  const [pyqSelected, setPyqSelected]         = useState<Record<number, string>>({});
  const [pyqError, setPyqError]               = useState<string | null>(null);

  // Practice test state
  const [practiceStage, setPracticeStage]     = useState<PracticeStage>("idle");
  const [questions, setQuestions]             = useState<Question[]>([]);
  const [currentQ, setCurrentQ]               = useState(0);
  const [answers, setAnswers]                 = useState<Record<number, string>>({});
  const [submitted, setSubmitted]             = useState(false);

  const subjectData = SUBJECTS_DATA.find((s) => s.subject === selectedSubject);

  const dueChapters = SUBJECTS_DATA.flatMap((s) =>
    s.units.flatMap((u) => u.chapters.filter((c) => c.due).map((c) => ({ ...c, subject: s.subject })))
  );

  const totalChapters   = SUBJECTS_DATA.flatMap((s) => s.units.flatMap((u) => u.chapters)).length;
  const revisedChapters = SUBJECTS_DATA.flatMap((s) => s.units.flatMap((u) => u.chapters.filter((c) => c.revised > 0))).length;

  const filteredUnits = subjectData?.units.map((unit) => ({
    ...unit,
    chapters: unit.chapters.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
  })).filter((u) => u.chapters.length > 0);

  async function handleToggleSummary() {
    if (showSummary) { setShowSummary(false); return; }
    if (summary)     { setShowSummary(true);  return; }
    setLoadingSummary(true);
    setShowSummary(true);
    try {
      const res  = await fetch("/api/ai/summary", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter: selectedChapter, subject: selectedSubject }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const s = data.summary ?? data;
      setSummary({
        keyPoints: s.keyPoints ?? [],
        formulas: (s.formulas ?? []).map((f: any) => typeof f === "string" ? f : `${f.name}: ${f.formula}`),
        examTips: s.examTips ?? [],
        commonMistakes: s.commonMistakes ?? [],
        quickRevision: s.quickRevision ?? "",
      });
    } catch { setSummary(null); }
    finally  { setLoadingSummary(false); }
  }

  async function handleStartPractice() {
    setPracticeStage("loading");
    setAnswers({});
    setCurrentQ(0);
    setSubmitted(false);
    try {
      const res  = await fetch("/api/ai/chapter-questions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter: selectedChapter, subject: selectedSubject }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.questions);
      setPracticeStage("attempt");
    } catch {
      setPracticeStage("idle");
      alert("Could not load questions. Please try again.");
    }
  }

  async function fetchNotesData(chapter: string, subject: string) {
    setLoadingNotes(true);
    try {
      const res  = await fetch("/api/ai/summary", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter, subject }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const s = data.summary ?? data;
      setNotesData({
        keyPoints: s.keyPoints ?? [],
        formulas: (s.formulas ?? []).map((f: any) => typeof f === "string" ? f : `${f.name}: ${f.formula}`),
        examTips: s.examTips ?? [],
        commonMistakes: s.commonMistakes ?? [],
        quickRevision: s.quickRevision ?? "",
      });
    } catch { setNotesData(null); }
    finally  { setLoadingNotes(false); }
  }

  async function fetchPyq(chapter: string, subject: string) {
    if (pyqQuestions.length > 0) return; // already cached for this chapter
    setLoadingPyq(true);
    setPyqError(null);
    setPyqRevealed({});
    setPyqSelected({});
    try {
      const res  = await fetch("/api/ai/pyq", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter, subject }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const pyqs = data.pyqQuestions ?? data.questions ?? [];
      if (!pyqs.length) throw new Error("No questions returned");
      const normalized = pyqs.map((q: any, i: number) => ({
        ...q,
        id: q.id ?? i + 1,
        question: q.question ?? q.question_text ?? "",
        options: Array.isArray(q.options)
          ? { A: q.options[0], B: q.options[1], C: q.options[2], D: q.options[3] }
          : q.options,
        correct: q.correct ?? ["A","B","C","D"][q.correctAnswer ?? 0],
        year: q.year?.toString() ?? "",
      }));
      setPyqQuestions(normalized);
    } catch (err: any) {
      console.error("PYQ fetch error:", err.message);
      setPyqError(err.message ?? "Failed to load questions");
      setPyqQuestions([]);
    } finally {
      setLoadingPyq(false);
    }
  }

  function handleAnswer(qId: number, option: string) {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  }

  function handleSubmit() {
    setSubmitted(true);
    setPracticeStage("result");
  }

  function selectChapter(name: string) {
    setSelectedChapter(name);
    setShowSummary(false);
    setSummary(null);
    setPracticeStage("idle");
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setActiveNote("quick_notes");
    // Reset notes + PYQ cache and auto-fetch notes for new chapter
    setNotesData(null);
    setPyqQuestions([]);
    setPyqRevealed({});
    setPyqSelected({});
    setPyqError(null);
    fetchNotesData(name, selectedSubject);
  }

  // ── SCORE CALCULATION ──
  const correctCount   = questions.filter((q) => answers[q.id] === q.correct).length;
  const wrongCount     = questions.filter((q) => answers[q.id] && answers[q.id] !== q.correct).length;
  const skippedCount   = questions.filter((q) => !answers[q.id]).length;
  const scorePercent   = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <DashboardLayout role="student" title="Smart Revision">
      <div className="space-y-5 max-w-5xl">

        {/* Progress bar */}
        <div className="bg-card rounded-xl border p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium">Overall Syllabus Progress</span>
              <span className="text-muted-foreground">{revisedChapters}/{totalChapters} chapters</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.round((revisedChapters / totalChapters) * 100)}%` }} />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-display font-bold">{Math.round((revisedChapters / totalChapters) * 100)}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>

        {/* Due revisions banner */}
        {dueChapters.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
            <Flame className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">{dueChapters.length} chapters due for revision today</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {dueChapters.slice(0, 8).map((c, i) => (
                  <button key={i} onClick={() => { setSelectedSubject(c.subject); selectChapter(c.name); }}
                    className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full hover:bg-amber-200 transition-colors">
                    {c.name}
                  </button>
                ))}
                {dueChapters.length > 8 && <span className="text-xs text-amber-600">+{dueChapters.length - 8} more</span>}
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-5">

          {/* Left: Chapter list */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
              {SUBJECTS_DATA.map((s) => (
                <button key={s.subject}
                  onClick={() => { setSelectedSubject(s.subject); setSelectedChapter(null); setSummary(null); setShowSummary(false); setSearchQuery(""); setPracticeStage("idle"); }}
                  className={cn("text-xs font-medium py-1.5 rounded-md transition-all", selectedSubject === s.subject ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                  {s.subject}
                </button>
              ))}
            </div>

            <input type="text" placeholder="Search chapters..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />

            <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin pr-1">
              {filteredUnits?.map((unit) => (
                <div key={unit.name}>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5 px-1 sticky top-0 bg-background py-1">{unit.name}</p>
                  <div className="space-y-0.5">
                    {unit.chapters.map((chapter) => {
                      const conf = CONFIDENCE_LABELS[chapter.confidence];
                      return (
                        <button key={chapter.name} onClick={() => selectChapter(chapter.name)}
                          className={cn("w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all",
                            selectedChapter === chapter.name ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-medium">{chapter.name}</p>
                            <p className={cn("text-xs", selectedChapter === chapter.name ? "text-primary-foreground/70" : conf.color)}>{conf.label}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {chapter.due && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                            {chapter.revised > 0 && <span className={cn("text-xs", selectedChapter === chapter.name ? "text-primary-foreground/70" : "text-muted-foreground")}>×{chapter.revised}</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-2 space-y-4">
            {selectedChapter ? (
              <>
                {/* ── CHAPTER SUMMARY TOGGLE ── */}
                <div className="rounded-xl border overflow-hidden">
                  <button onClick={handleToggleSummary}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-950/30 dark:to-blue-950/30 hover:from-brand-100 hover:to-blue-100 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">Chapter Summary</p>
                        <p className="text-xs text-muted-foreground">Key points · Formulas · Exam tips</p>
                      </div>
                    </div>
                    {showSummary ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </button>

                  {showSummary && (
                    <div className="p-4 border-t border-border space-y-5 bg-card">
                      {loadingSummary ? (
                        <div className="flex items-center gap-2 py-6 justify-center text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Preparing summary...</span>
                        </div>
                      ) : summary ? (
                        <>
                          <div>
                            <div className="flex items-center gap-2 mb-3"><Target className="h-4 w-4 text-brand-500" /><p className="text-sm font-semibold">Key Points to Remember</p></div>
                            <ul className="space-y-2">
                              {summary.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm">
                                  <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                  <span className="text-muted-foreground leading-relaxed">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {summary.formulas?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3"><Calculator className="h-4 w-4 text-purple-500" /><p className="text-sm font-semibold">Important Formulas</p></div>
                              <div className="grid gap-2">
                                {summary.formulas.map((f, i) => <div key={i} className="bg-muted px-3 py-2 rounded-lg font-mono text-xs border">{f}</div>)}
                              </div>
                            </div>
                          )}
                          {summary.examTips?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3"><Lightbulb className="h-4 w-4 text-amber-500" /><p className="text-sm font-semibold">Exam Tips</p></div>
                              <ul className="space-y-2">
                                {summary.examTips.map((tip, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />{tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {summary.commonMistakes?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3"><XCircle className="h-4 w-4 text-red-500" /><p className="text-sm font-semibold">Common Mistakes to Avoid</p></div>
                              <ul className="space-y-2">
                                {summary.commonMistakes.map((m, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />{m}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Practice button — appears after summary */}
                          <div className="pt-2 border-t border-border">
                            <button onClick={handleStartPractice}
                              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm">
                              <Play className="h-4 w-4" />
                              Practice This Chapter — 50 Questions
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">Could not load summary. Please try again.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* ── PRACTICE TEST: LOADING ── */}
                {practiceStage === "loading" && (
                  <div className="bg-card rounded-xl border p-8 flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="font-medium">Generating 50 questions for {selectedChapter}...</p>
                    <p className="text-xs">This may take 15-20 seconds</p>
                  </div>
                )}

                {/* ── PRACTICE TEST: ATTEMPT ── */}
                {practiceStage === "attempt" && questions.length > 0 && (
                  <div className="bg-card rounded-xl border overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-display font-bold text-sm">{selectedChapter} — Practice Test</p>
                        <span className="text-xs text-muted-foreground">{Object.keys(answers).length}/{questions.length} answered</span>
                      </div>
                      <Progress value={(Object.keys(answers).length / questions.length) * 100} className="h-1.5" />
                    </div>

                    {/* Question navigation pills */}
                    <div className="p-3 border-b border-border flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {questions.map((q, i) => (
                        <button key={q.id} onClick={() => setCurrentQ(i)}
                          className={cn("w-7 h-7 rounded-lg text-xs font-bold transition-all flex-shrink-0",
                            currentQ === i ? "bg-primary text-primary-foreground" :
                            answers[q.id] ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                            "bg-muted text-muted-foreground hover:bg-accent")}>
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    {/* Current question */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-muted-foreground">Q{currentQ + 1} of {questions.length}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed mb-4">{questions[currentQ].question}</p>

                      <div className="space-y-2">
                        {(["A", "B", "C", "D"] as const).map((opt) => (
                          <button key={opt} onClick={() => handleAnswer(questions[currentQ].id, opt)}
                            className={cn("w-full flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-all",
                              answers[questions[currentQ].id] === opt
                                ? "border-primary bg-primary/10 font-medium"
                                : "border-border hover:border-primary/50 hover:bg-muted/50")}>
                            <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                              answers[questions[currentQ].id] === opt ? "bg-primary text-primary-foreground" : "bg-muted")}>
                              {opt}
                            </span>
                            <span className="mt-0.5">{questions[currentQ].options[opt]}</span>
                          </button>
                        ))}
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
                          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        {currentQ < questions.length - 1 ? (
                          <Button size="sm" onClick={() => setCurrentQ(currentQ + 1)}>
                            Next <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1" onClick={handleSubmit}>
                            <CheckSquare className="h-4 w-4" /> Submit All
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PRACTICE TEST: RESULTS ── */}
                {practiceStage === "result" && questions.length > 0 && (
                  <div className="space-y-4">
                    {/* Score card */}
                    <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-5 text-white text-center">
                      <Trophy className="h-10 w-10 mx-auto mb-2 text-brand-200" />
                      <p className="text-4xl font-display font-bold">{scorePercent}%</p>
                      <p className="text-brand-200 text-sm mt-1">{selectedChapter}</p>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="bg-white/10 rounded-xl p-2">
                          <p className="text-xl font-bold text-green-300">{correctCount}</p>
                          <p className="text-xs text-brand-200">Correct</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-2">
                          <p className="text-xl font-bold text-red-300">{wrongCount}</p>
                          <p className="text-xs text-brand-200">Wrong</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-2">
                          <p className="text-xl font-bold text-brand-200">{skippedCount}</p>
                          <p className="text-xs text-brand-200">Skipped</p>
                        </div>
                      </div>
                    </div>

                    {/* All questions with answers and explanations */}
                    <div className="space-y-3">
                      <p className="font-display font-bold text-sm">All Questions — Review</p>
                      {questions.map((q, i) => {
                        const studentAnswer = answers[q.id];
                        const isCorrect     = studentAnswer === q.correct;
                        const isWrong       = studentAnswer && !isCorrect;
                        const isSkipped     = !studentAnswer;
                        return (
                          <div key={q.id} className={cn("rounded-xl border p-4 space-y-3",
                            isCorrect ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20" :
                            isWrong   ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20" :
                            "border-border bg-muted/30")}>
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-bold text-muted-foreground flex-shrink-0 mt-0.5">Q{i + 1}.</span>
                              <p className="text-sm font-medium leading-relaxed">{q.question}</p>
                              <div className="flex-shrink-0">
                                {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                {isWrong   && <XCircle      className="h-5 w-5 text-red-500"   />}
                                {isSkipped && <AlertTriangle className="h-5 w-5 text-amber-400" />}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-1.5">
                              {(["A", "B", "C", "D"] as const).map((opt) => (
                                <div key={opt} className={cn("flex items-start gap-2 px-3 py-1.5 rounded-lg text-xs",
                                  opt === q.correct              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-semibold" :
                                  opt === studentAnswer && isWrong ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200" :
                                  "text-muted-foreground")}>
                                  <span className="font-bold flex-shrink-0">{opt}.</span>
                                  <span>{q.options[opt]}</span>
                                  {opt === q.correct && <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0 ml-auto" />}
                                </div>
                              ))}
                            </div>

                            {/* Explanation */}
                            <div className="bg-white dark:bg-card border border-border rounded-lg p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-xs font-semibold">Explanation</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Try again */}
                    <Button className="w-full gap-2" onClick={handleStartPractice}>
                      <Play className="h-4 w-4" /> Try Again with New Questions
                    </Button>
                  </div>
                )}

                {/* ── NOTES CARD (shown only when not in practice) ── */}
                {practiceStage === "idle" && (
                  <Card>
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <p className="font-display font-semibold">{selectedChapter}</p>
                      <Button size="sm" variant="outline" className="gap-1">
                        <RotateCcw className="h-3 w-3" /> Mark Revised
                      </Button>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex gap-1 flex-wrap mb-4">
                        {NOTE_TYPES.map((note) => {
                          const Icon = note.icon;
                          return (
                            <button type="button" key={note.key} onClick={() => {
                              setActiveNote(note.key);
                              if (note.key === "pyq" && selectedChapter) fetchPyq(selectedChapter, selectedSubject);
                            }}
                              className={cn("flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium",
                                activeNote === note.key ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent")}>
                              <Icon className="h-3 w-3" />{note.label}
                            </button>
                          );
                        })}
                      </div>
                      <div className="bg-muted/40 rounded-xl p-4 min-h-[160px] text-sm">

                        {/* ── QUICK NOTES ── */}
                        {activeNote === "quick_notes" && (
                          loadingNotes ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-6 justify-center">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-xs">Loading key concepts…</span>
                            </div>
                          ) : notesData?.keyPoints?.length ? (
                            <div className="space-y-2">
                              <h4 className="font-semibold flex items-center gap-1.5 mb-3">
                                <Lightbulb className="h-4 w-4 text-amber-400" />
                                Key Concepts — {selectedChapter}
                              </h4>
                              <ul className="space-y-2">
                                {notesData.keyPoints.map((point, i) => (
                                  <li key={i} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-xs text-center py-6">Select a chapter to load key concepts.</p>
                          )
                        )}

                        {/* ── FORMULA SHEET ── */}
                        {activeNote === "formula_sheet" && (
                          loadingNotes ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-6 justify-center">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-xs">Compiling formulas…</span>
                            </div>
                          ) : notesData?.formulas?.length ? (
                            <div className="space-y-2">
                              <h4 className="font-semibold flex items-center gap-1.5 mb-3">
                                <Calculator className="h-4 w-4 text-blue-400" />
                                Formula Sheet — {selectedChapter}
                              </h4>
                              <div className="grid gap-2">
                                {notesData.formulas.map((formula, i) => (
                                  <div key={i} className="flex items-start gap-2 bg-background/70 border border-border rounded-lg px-3 py-2">
                                    <span className="text-blue-400 font-bold text-xs mt-0.5 flex-shrink-0">f{i + 1}</span>
                                    <span className="font-mono text-xs leading-relaxed text-foreground">{formula}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-xs text-center py-6">No formulas found for this chapter.</p>
                          )
                        )}

                        {/* ── MISTAKES TO AVOID ── */}
                        {activeNote === "mistakes" && (
                          loadingNotes ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-6 justify-center">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-xs">Analysing common mistakes…</span>
                            </div>
                          ) : notesData?.commonMistakes?.length ? (
                            <div className="space-y-2">
                              <h4 className="font-semibold flex items-center gap-1.5 mb-3">
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                                Common Mistakes — {selectedChapter}
                              </h4>
                              <ul className="space-y-2">
                                {notesData.commonMistakes.map((mistake, i) => (
                                  <li key={i} className="flex items-start gap-2 bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2 text-muted-foreground leading-relaxed">
                                    <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>{mistake}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-xs text-center py-6">No mistakes data available for this chapter.</p>
                          )
                        )}

                        {/* ── PYQ HIGHLIGHTS ── */}
                        {activeNote === "pyq" && (
                          loadingPyq ? (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground py-8 justify-center">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              <span className="text-xs">Fetching previous year questions…</span>
                            </div>
                          ) : pyqQuestions.length > 0 ? (
                            <div className="space-y-3">
                              <h4 className="font-semibold flex items-center gap-1.5 mb-3">
                                <Star className="h-4 w-4 text-yellow-400" />
                                Previous Year Questions — {selectedChapter}
                                <span className="ml-auto text-[10px] font-normal text-muted-foreground">{pyqQuestions.length} questions</span>
                              </h4>
                              {pyqQuestions.map((q, qi) => {
                                const selected  = pyqSelected[q.id];
                                const revealed  = pyqRevealed[q.id];
                                const isCorrect = selected === q.correct;
                                return (
                                  <div key={q.id} className="border border-border rounded-xl overflow-hidden bg-background/60">
                                    {/* Question header */}
                                    <div className="px-3 py-2.5 flex items-start gap-2">
                                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">{qi + 1}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 text-yellow-600 border-yellow-400/40 bg-yellow-400/10">{q.year}</Badge>
                                        </div>
                                        <p className="text-xs font-medium leading-relaxed">{q.question}</p>
                                      </div>
                                    </div>

                                    {/* Options */}
                                    <div className="px-3 pb-2 grid grid-cols-1 gap-1">
                                      {(["A", "B", "C", "D"] as const).map((opt) => {
                                        const isSelected  = selected === opt;
                                        const isAnswer    = opt === q.correct;
                                        let optClass = "border border-border text-muted-foreground hover:bg-accent";
                                        if (revealed) {
                                          if (isAnswer)                      optClass = "border border-green-500 bg-green-500/10 text-green-700 dark:text-green-300 font-medium";
                                          else if (isSelected && !isAnswer)  optClass = "border border-red-500 bg-red-500/10 text-red-700 dark:text-red-300";
                                        } else if (isSelected) {
                                          optClass = "border border-primary bg-primary/10 text-primary font-medium";
                                        }
                                        return (
                                          <button type="button" key={opt}
                                            disabled={revealed}
                                            onClick={() => setPyqSelected((prev) => ({ ...prev, [q.id]: opt }))}
                                            className={cn("flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-all w-full", optClass)}>
                                            <span className="font-bold flex-shrink-0 w-3">{opt}.</span>
                                            <span className="flex-1">{q.options[opt]}</span>
                                            {revealed && isAnswer    && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />}
                                            {revealed && isSelected && !isAnswer && <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Show Answer button */}
                                    {!revealed && (
                                      <div className="px-3 pb-3">
                                        <button type="button"
                                          onClick={() => setPyqRevealed((prev) => ({ ...prev, [q.id]: true }))}
                                          className="w-full text-xs py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-all font-medium">
                                          {selected ? "Check Answer" : "Show Answer"}
                                        </button>
                                      </div>
                                    )}

                                    {/* Explanation — shown after reveal */}
                                    {revealed && (
                                      <div className="mx-3 mb-3 bg-amber-500/8 border border-amber-500/20 rounded-lg p-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                          {isCorrect && selected
                                            ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                            : <Lightbulb className="h-3.5 w-3.5 text-amber-500" />}
                                          <span className="text-xs font-semibold">
                                            {selected
                                              ? isCorrect ? "Correct! " : `Incorrect — Answer is ${q.correct}. `
                                              : `Answer: ${q.correct}. `}
                                            Explanation
                                          </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : pyqError ? (
                            <div className="flex flex-col items-center gap-3 py-8 text-center">
                              <XCircle className="h-8 w-8 text-red-400/60" />
                              <div>
                                <p className="text-xs font-medium text-red-400">Failed to load questions</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{pyqError}</p>
                              </div>
                              <button type="button"
                                onClick={() => { setPyqError(null); setPyqQuestions([]); if(selectedChapter) fetchPyq(selectedChapter, selectedSubject); }}
                                className="text-xs px-3 py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-all font-medium">
                                Retry
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 py-8 text-center">
                              <Star className="h-8 w-8 text-yellow-400/40" />
                              <p className="text-xs text-muted-foreground">Loading previous year questions for <strong>{selectedChapter}</strong>…</p>
                            </div>
                          )
                        )}

                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Rate your confidence after revising:</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button type="button" key={n} className={cn("flex-1 py-1.5 text-xs rounded-lg border transition-all font-medium hover:bg-accent border-border", CONFIDENCE_LABELS[n].color)}>{n}</button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-0.5">
                          <span>Very Weak</span><span>Excellent</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mb-3 opacity-30" />
                <p className="font-medium">Select a chapter to start revising</p>
                <p className="text-xs mt-1">{totalChapters} chapters across all subjects</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
