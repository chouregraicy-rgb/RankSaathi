"use client";

// src/app/student/crossword/page.tsx
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trophy, BookOpen, CheckCircle2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────
interface CrosswordWord { word: string; clue: string; topic?: string; }
interface PlacedWord { word: string; clue: string; topic?: string; row: number; col: number; direction: "across" | "down"; number: number; }
interface Cell { letter: string; wordNumbers: number[]; isBlack: boolean; }

// ── Chapter data ───────────────────────────────────────
const CHAPTERS: Record<string, string[]> = {
  biology: [
    "The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom",
    "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals",
    "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division",
    "Transport in Plants", "Mineral Nutrition", "Photosynthesis in Higher Plants",
    "Respiration in Plants", "Plant Growth and Development",
    "Digestion and Absorption", "Breathing and Exchange of Gases",
    "Body Fluids and Circulation", "Excretory Products and their Elimination",
    "Locomotion and Movement", "Neural Control and Coordination",
    "Chemical Coordination and Integration",
    "Reproduction in Organisms", "Sexual Reproduction in Flowering Plants",
    "Human Reproduction", "Reproductive Health",
    "Principles of Inheritance and Variation", "Molecular Basis of Inheritance",
    "Evolution", "Human Health and Disease",
    "Strategies for Enhancement in Food Production", "Microbes in Human Welfare",
    "Biotechnology: Principles and Processes", "Biotechnology and its Applications",
    "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation",
    "Environmental Issues",
  ],
  physics: [
    "Physical World", "Units and Measurements", "Motion in a Straight Line",
    "Motion in a Plane", "Laws of Motion", "Work, Energy and Power",
    "System of Particles and Rotational Motion", "Gravitation",
    "Mechanical Properties of Solids", "Mechanical Properties of Fluids",
    "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory",
    "Oscillations", "Waves",
    "Electric Charges and Fields", "Electrostatic Potential and Capacitance",
    "Current Electricity", "Moving Charges and Magnetism",
    "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current",
    "Electromagnetic Waves", "Ray Optics and Optical Instruments",
    "Wave Optics", "Dual Nature of Radiation and Matter",
    "Atoms", "Nuclei", "Semiconductor Electronics",
  ],
  chemistry: [
    "Some Basic Concepts of Chemistry", "Structure of Atom",
    "Classification of Elements and Periodicity in Properties",
    "Chemical Bonding and Molecular Structure", "States of Matter",
    "Thermodynamics", "Equilibrium", "Redox Reactions", "Hydrogen",
    "The s-Block Elements", "The p-Block Elements", "Organic Chemistry: Basic Principles",
    "Hydrocarbons", "Environmental Chemistry",
    "The Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics",
    "Surface Chemistry", "General Principles of Isolation of Elements",
    "The d and f Block Elements", "Coordination Compounds",
    "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers",
    "Aldehydes, Ketones and Carboxylic Acids", "Amines",
    "Biomolecules", "Polymers", "Chemistry in Everyday Life",
  ],
  mathematics: [
    "Sets", "Relations and Functions", "Trigonometric Functions",
    "Principle of Mathematical Induction", "Complex Numbers and Quadratic Equations",
    "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem",
    "Sequences and Series", "Straight Lines", "Conic Sections",
    "Introduction to Three Dimensional Geometry", "Limits and Derivatives",
    "Mathematical Reasoning", "Statistics", "Probability",
    "Relations and Functions (XII)", "Inverse Trigonometric Functions", "Matrices",
    "Determinants", "Continuity and Differentiability", "Application of Derivatives",
    "Integrals", "Application of Integrals", "Differential Equations",
    "Vector Algebra", "Three Dimensional Geometry", "Linear Programming",
    "Probability (XII)",
  ],
};

// ── Grid builder ───────────────────────────────────────
const GRID_SIZE = 15;

function buildGrid(words: CrosswordWord[]): { grid: Cell[][]; placed: PlacedWord[] } {
  const grid: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ letter: "", wordNumbers: [], isBlack: true }))
  );
  const placed: PlacedWord[] = [];
  let wordNum = 1;

  const canPlace = (word: string, row: number, col: number, dir: "across" | "down"): boolean => {
    if (dir === "across" && col + word.length > GRID_SIZE) return false;
    if (dir === "down" && row + word.length > GRID_SIZE) return false;
    if (row < 0 || col < 0) return false;
    for (let i = 0; i < word.length; i++) {
      const r = dir === "across" ? row : row + i;
      const c = dir === "across" ? col + i : col;
      if (!grid[r][c].isBlack && grid[r][c].letter !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (word: string, clue: string, topic: string | undefined, row: number, col: number, dir: "across" | "down") => {
    for (let i = 0; i < word.length; i++) {
      const r = dir === "across" ? row : row + i;
      const c = dir === "across" ? col + i : col;
      grid[r][c].letter = word[i];
      grid[r][c].isBlack = false;
      if (i === 0) grid[r][c].wordNumbers.push(wordNum);
    }
    placed.push({ word, clue, topic, row, col, direction: dir, number: wordNum });
    wordNum++;
  };

  if (words.length === 0) return { grid, placed };
  const first = words[0];
  placeWord(first.word, first.clue, first.topic, Math.floor(GRID_SIZE / 2), Math.floor((GRID_SIZE - first.word.length) / 2), "across");

  for (let wi = 1; wi < words.length; wi++) {
    const { word, clue, topic } = words[wi];
    let placed_ = false;
    for (const p of placed) {
      for (let pi = 0; pi < p.word.length && !placed_; pi++) {
        for (let wi2 = 0; wi2 < word.length && !placed_; wi2++) {
          if (p.word[pi] !== word[wi2]) continue;
          const pr = p.direction === "across" ? p.row : p.row + pi;
          const pc = p.direction === "across" ? p.col + pi : p.col;
          if (p.direction === "across") {
            if (canPlace(word, pr - wi2, pc, "down")) { placeWord(word, clue, topic, pr - wi2, pc, "down"); placed_ = true; }
          } else {
            if (canPlace(word, pr, pc - wi2, "across")) { placeWord(word, clue, topic, pr, pc - wi2, "across"); placed_ = true; }
          }
        }
      }
    }
    if (!placed_) {
      for (let r = 1; r < GRID_SIZE - word.length && !placed_; r++)
        for (let c = 1; c < GRID_SIZE - 1 && !placed_; c++)
          if (canPlace(word, r, c, "across")) { placeWord(word, clue, topic, r, c, "across"); placed_ = true; }
    }
  }
  return { grid, placed };
}

// ── Component ──────────────────────────────────────────
export default function CrosswordPage() {
  const [subject, setSubject] = useState<string>("biology");
  const [chapter, setChapter] = useState<string>(CHAPTERS["biology"][0]);
  const [loading, setLoading] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [selectedWord, setSelectedWord] = useState<PlacedWord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subjects = [
    { value: "biology", label: "Biology" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "mathematics", label: "Mathematics" },
  ];

  const generateCrossword = useCallback(async (subj: string, chap: string) => {
    setLoading(true);
    setChecked(false);
    setScore(null);
    setUserAnswers({});
    setSelectedWord(null);
    setError(null);
    try {
      const res = await fetch("/api/crossword/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subj, chapter: chap, wordCount: 12 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to generate crossword");
      const words: CrosswordWord[] = data.crossword.words;
      const { grid: newGrid, placed } = buildGrid(words);
      setGrid(newGrid);
      setPlacedWords(placed);
      const initAnswers: Record<string, string> = {};
      placed.forEach((pw) => {
        for (let i = 0; i < pw.word.length; i++) {
          const r = pw.direction === "across" ? pw.row : pw.row + i;
          const c = pw.direction === "across" ? pw.col + i : pw.col;
          initAnswers[`${r}-${c}`] = "";
        }
      });
      setUserAnswers(initAnswers);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { generateCrossword(subject, chapter); }, []); // eslint-disable-line

  const handleSubjectChange = (val: string) => {
    const first = CHAPTERS[val][0];
    setSubject(val);
    setChapter(first);
    generateCrossword(val, first);
  };

  const handleChapterChange = (val: string) => {
    setChapter(val);
    generateCrossword(subject, val);
  };

  const handleCellInput = (row: number, col: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [`${row}-${col}`]: value.toUpperCase().slice(-1) }));
  };

  const handleCheck = () => {
    let correct = 0;
    placedWords.forEach((pw) => {
      let ok = true;
      for (let i = 0; i < pw.word.length; i++) {
        const r = pw.direction === "across" ? pw.row : pw.row + i;
        const c = pw.direction === "across" ? pw.col + i : pw.col;
        if ((userAnswers[`${r}-${c}`] || "") !== pw.word[i]) { ok = false; break; }
      }
      if (ok) correct++;
    });
    setScore({ correct, total: placedWords.length });
    setChecked(true);
  };

  const getCellState = (row: number, col: number) => {
    if (!checked) return "neutral";
    const cell = grid[row]?.[col];
    if (!cell || cell.isBlack) return "neutral";
    return userAnswers[`${row}-${col}`] === cell.letter ? "correct" : "wrong";
  };

  const acrossClues = placedWords.filter((w) => w.direction === "across");
  const downClues = placedWords.filter((w) => w.direction === "down");

  return (
    <div className="p-6 space-y-6">
      {/* Header — matches app dark theme */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Crossword</h1>
          <p className="text-sm text-gray-400 mt-1">Chapter-wise NEET/JEE vocabulary puzzles</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={subject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-36 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {subjects.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-white hover:bg-gray-700">{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={chapter} onValueChange={handleChapterChange}>
            <SelectTrigger className="w-56 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select chapter" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-72 overflow-y-auto">
              {CHAPTERS[subject].map((ch) => (
                <SelectItem key={ch} value={ch} className="text-white hover:bg-gray-700">{ch}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => generateCrossword(subject, chapter)}
            disabled={loading}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            New Puzzle
          </Button>

          {placedWords.length > 0 && !checked && (
            <Button onClick={handleCheck} className="bg-blue-600 hover:bg-blue-700 text-white">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Check Answers
            </Button>
          )}
        </div>
      </div>

      {/* Current chapter badge */}
      {chapter && !loading && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Current chapter:</span>
          <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium border border-blue-600/30">
            {chapter}
          </span>
        </div>
      )}

      {/* Score banner */}
      {score && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${score.correct === score.total ? "bg-green-900/30 border-green-700/50" : "bg-yellow-900/30 border-yellow-700/50"}`}>
          <Trophy className={`h-5 w-5 ${score.correct === score.total ? "text-green-400" : "text-yellow-400"}`} />
          <p className="font-semibold text-white">
            {score.correct === score.total ? "🎉 Perfect! All words correct!" : `${score.correct} / ${score.total} words correct`}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
            <p className="text-gray-400 text-sm">Generating crossword for {chapter}…</p>
          </div>
        </div>
      )}

      {/* Grid + Clues */}
      {!loading && grid.length > 0 && (
        <div className="flex flex-col xl:flex-row gap-6">

          {/* Grid */}
          <div className="flex-shrink-0 bg-gray-800/50 rounded-2xl border border-gray-700/50 p-4 overflow-auto">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, 2rem)`,
                gap: "2px",
              }}
            >
              {grid.map((row, ri) =>
                row.map((cell, ci) => {
                  if (cell.isBlack) {
                    return (
                      <div key={`${ri}-${ci}`} style={{ width: "2rem", height: "2rem", background: "#111827", borderRadius: "2px" }} />
                    );
                  }
                  const state = getCellState(ri, ci);
                  const bg = state === "correct" ? "#14532d" : state === "wrong" ? "#7f1d1d" : "#1f2937";
                  const border = state === "correct" ? "#16a34a" : state === "wrong" ? "#dc2626" : "#374151";
                  return (
                    <div
                      key={`${ri}-${ci}`}
                      style={{ width: "2rem", height: "2rem", background: bg, border: `1px solid ${border}`, borderRadius: "2px", position: "relative" }}
                    >
                      {cell.wordNumbers.length > 0 && (
                        <span style={{ position: "absolute", top: 1, left: 2, fontSize: "0.4rem", fontWeight: 700, color: "#9ca3af", lineHeight: 1 }}>
                          {cell.wordNumbers[0]}
                        </span>
                      )}
                      <input
                        maxLength={1}
                        value={userAnswers[`${ri}-${ci}`] || ""}
                        onChange={(e) => handleCellInput(ri, ci, e.target.value)}
                        disabled={checked}
                        style={{
                          width: "100%", height: "100%", textAlign: "center",
                          fontSize: "0.75rem", fontWeight: 700, background: "transparent",
                          border: "none", outline: "none", color: "#ffffff",
                          textTransform: "uppercase",
                          paddingTop: cell.wordNumbers.length > 0 ? "6px" : "0",
                          cursor: checked ? "default" : "text",
                        }}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Clues */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Across */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3 pb-3 border-b border-gray-700">
                <BookOpen className="h-4 w-4 text-blue-400" /> Across
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {acrossClues.map((w) => (
                  <div
                    key={w.number}
                    onClick={() => setSelectedWord(w)}
                    className={`text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedWord?.number === w.number
                        ? "bg-blue-600/20 border border-blue-600/40"
                        : "hover:bg-gray-700/50"
                    }`}
                  >
                    <span className="font-bold text-blue-400 mr-1">{w.number}.</span>
                    <span className="text-gray-300">{w.clue}</span>
                    {w.topic && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-gray-700 text-gray-400">{w.topic}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Down */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3 pb-3 border-b border-gray-700">
                <BookOpen className="h-4 w-4 text-purple-400" /> Down
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {downClues.map((w) => (
                  <div
                    key={w.number}
                    onClick={() => setSelectedWord(w)}
                    className={`text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedWord?.number === w.number
                        ? "bg-purple-600/20 border border-purple-600/40"
                        : "hover:bg-gray-700/50"
                    }`}
                  >
                    <span className="font-bold text-purple-400 mr-1">{w.number}.</span>
                    <span className="text-gray-300">{w.clue}</span>
                    {w.topic && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-gray-700 text-gray-400">{w.topic}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
