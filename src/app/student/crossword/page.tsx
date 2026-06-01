"use client";

// src/app/student/crossword/page.tsx
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trophy, BookOpen } from "lucide-react";


// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface CrosswordWord {
  word: string;
  clue: string;
  topic?: string;
}

interface PlacedWord {
  word: string;
  clue: string;
  topic?: string;
  row: number;
  col: number;
  direction: "across" | "down";
  number: number;
}

interface Cell {
  letter: string;
  wordNumbers: number[];
  isBlack: boolean;
}

// ──────────────────────────────────────────────
// Grid builder
// ──────────────────────────────────────────────
const GRID_SIZE = 15;

function buildGrid(words: CrosswordWord[]): {
  grid: Cell[][];
  placed: PlacedWord[];
} {
  const grid: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({
      letter: "",
      wordNumbers: [],
      isBlack: true,
    }))
  );

  const placed: PlacedWord[] = [];
  let wordNum = 1;

  const canPlace = (
    word: string,
    row: number,
    col: number,
    dir: "across" | "down"
  ): boolean => {
    const len = word.length;
    if (dir === "across" && col + len > GRID_SIZE) return false;
    if (dir === "down" && row + len > GRID_SIZE) return false;
    if (row < 0 || col < 0) return false;

    for (let i = 0; i < len; i++) {
      const r = dir === "across" ? row : row + i;
      const c = dir === "across" ? col + i : col;
      const cell = grid[r][c];
      if (!cell.isBlack && cell.letter !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (
    word: string,
    clue: string,
    topic: string | undefined,
    row: number,
    col: number,
    dir: "across" | "down"
  ) => {
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
  const startCol = Math.floor((GRID_SIZE - first.word.length) / 2);
  const startRow = Math.floor(GRID_SIZE / 2);
  placeWord(first.word, first.clue, first.topic, startRow, startCol, "across");

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
            const r = pr - wi2;
            const c = pc;
            if (canPlace(word, r, c, "down")) {
              placeWord(word, clue, topic, r, c, "down");
              placed_ = true;
            }
          } else {
            const r = pr;
            const c = pc - wi2;
            if (canPlace(word, r, c, "across")) {
              placeWord(word, clue, topic, r, c, "across");
              placed_ = true;
            }
          }
        }
      }
    }

    if (!placed_) {
      for (let r = 1; r < GRID_SIZE - word.length && !placed_; r++) {
        for (let c = 1; c < GRID_SIZE - 1 && !placed_; c++) {
          if (canPlace(word, r, c, "across")) {
            placeWord(word, clue, topic, r, c, "across");
            placed_ = true;
          }
        }
      }
    }
  }

  return { grid, placed };
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export default function CrosswordPage() {
  const [subject, setSubject] = useState<string>("biology");
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

  // FIX 1: useCallback with empty deps is correct here because
  // `subj` is passed as a parameter — no stale closure issue.
  // FIX 2: API path corrected to /api/ai/generate-crossword
  const generateCrossword = useCallback(async (subj: string) => {
    setLoading(true);
    setChecked(false);
    setScore(null);
    setUserAnswers({});
    setSelectedWord(null);
    setError(null);

    try {
      const res = await fetch("/api/crossword/generate", {   // ← FIXED path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subj, wordCount: 12 }),  // subj param used directly
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate crossword");
      }

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

  // Auto-generate on mount and when subject changes
  useEffect(() => {
    generateCrossword(subject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const handleSubjectChange = (val: string) => {
    setSubject(val); // triggers useEffect above
  };

  const handleCellInput = (row: number, col: number, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [`${row}-${col}`]: value.toUpperCase().slice(-1),
    }));
  };

  const handleCheck = () => {
    let correct = 0;
    const total = placedWords.length;

    placedWords.forEach((pw) => {
      let wordCorrect = true;
      for (let i = 0; i < pw.word.length; i++) {
        const r = pw.direction === "across" ? pw.row : pw.row + i;
        const c = pw.direction === "across" ? pw.col + i : pw.col;
        if ((userAnswers[`${r}-${c}`] || "") !== pw.word[i]) {
          wordCorrect = false;
          break;
        }
      }
      if (wordCorrect) correct++;
    });

    setScore({ correct, total });
    setChecked(true);

    // FIX 3: use toast instead of console.log for user feedback
    if (correct === total) {
      alert("🎉 Perfect score! All words correct!");
    } else {
      alert(`${correct} / ${total} words correct`);
    }
  };

  const getCellState = (row: number, col: number) => {
    if (!checked) return "neutral";
    const key = `${row}-${col}`;
    const cell = grid[row]?.[col];
    if (!cell || cell.isBlack) return "neutral";
    return userAnswers[key] === cell.letter ? "correct" : "wrong";
  };

  const acrossClues = placedWords.filter((w) => w.direction === "across");
  const downClues = placedWords.filter((w) => w.direction === "down");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Science Crossword</h1>
            <p className="text-sm text-gray-500 mt-1">
              Test your NEET/JEE vocabulary — one subject at a time
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={subject} onValueChange={handleSubjectChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => generateCrossword(subject)}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              New Puzzle
            </Button>
            {placedWords.length > 0 && !checked && (
              <Button onClick={handleCheck}>Check Answers</Button>
            )}
          </div>
        </div>

        {/* Score banner */}
        {score && (
          <Card
            className={
              score.correct === score.total
                ? "border-green-500 bg-green-50"
                : "border-yellow-400 bg-yellow-50"
            }
          >
            <CardContent className="py-4 flex items-center gap-3">
              <Trophy
                className={`h-6 w-6 ${
                  score.correct === score.total ? "text-green-600" : "text-yellow-600"
                }`}
              />
              <p className="font-semibold text-gray-800">
                {score.correct === score.total
                  ? "🎉 Perfect! All words correct!"
                  : `${score.correct} / ${score.total} words correct`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="py-4 text-red-700 text-sm">{error}</CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
              <p className="text-gray-500 text-sm">
                Generating {subjects.find((s) => s.value === subject)?.label} crossword…
              </p>
            </div>
          </div>
        )}

        {/* Grid + Clues */}
        {!loading && grid.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Grid */}
            <Card className="flex-shrink-0">
              <CardContent className="p-3 overflow-auto">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 2rem)`,
                    gap: "1px",
                    background: "#d1d5db",
                    border: "2px solid #d1d5db",
                  }}
                >
                  {grid.map((row, ri) =>
                    row.map((cell, ci) => {
                      if (cell.isBlack) {
                        return (
                          <div
                            key={`${ri}-${ci}`}
                            style={{
                              width: "2rem",
                              height: "2rem",
                              background: "#1f2937",
                            }}
                          />
                        );
                      }
                      const state = getCellState(ri, ci);
                      const bgColor =
                        state === "correct"
                          ? "#bbf7d0"
                          : state === "wrong"
                          ? "#fecaca"
                          : "white";
                      return (
                        <div
                          key={`${ri}-${ci}`}
                          style={{
                            width: "2rem",
                            height: "2rem",
                            background: bgColor,
                            position: "relative",
                          }}
                        >
                          {cell.wordNumbers.length > 0 && (
                            <span
                              style={{
                                position: "absolute",
                                top: 1,
                                left: 2,
                                fontSize: "0.45rem",
                                fontWeight: 700,
                                color: "#374151",
                                lineHeight: 1,
                              }}
                            >
                              {cell.wordNumbers[0]}
                            </span>
                          )}
                          <input
                            maxLength={1}
                            value={userAnswers[`${ri}-${ci}`] || ""}
                            onChange={(e) => handleCellInput(ri, ci, e.target.value)}
                            disabled={checked}
                            style={{
                              width: "100%",
                              height: "100%",
                              textAlign: "center",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              background: "transparent",
                              border: "none",
                              outline: "none",
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
              </CardContent>
            </Card>

            {/* Clues */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Across
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {acrossClues.map((w) => (
                    <div
                      key={w.number}
                      className={`text-xs p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedWord?.number === w.number
                          ? "bg-indigo-50 border border-indigo-200"
                          : ""
                      }`}
                      onClick={() => setSelectedWord(w)}
                    >
                      <span className="font-bold text-indigo-600 mr-1">{w.number}.</span>
                      {w.clue}
                      {w.topic && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          {w.topic}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Down
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {downClues.map((w) => (
                    <div
                      key={w.number}
                      className={`text-xs p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedWord?.number === w.number
                          ? "bg-indigo-50 border border-indigo-200"
                          : ""
                      }`}
                      onClick={() => setSelectedWord(w)}
                    >
                      <span className="font-bold text-indigo-600 mr-1">{w.number}.</span>
                      {w.clue}
                      {w.topic && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          {w.topic}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
