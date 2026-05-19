"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, RefreshCw, CheckCircle, Eye, RotateCcw, Trophy, Zap, BookOpen, FlaskConical } from "lucide-react";

interface WordEntry {
  word: string;
  clue: string;
  subject: "biology" | "physics" | "chemistry";
  difficulty: "easy" | "medium" | "hard";
  dir: "across" | "down";
  row: number;
  col: number;
  num: number;
}

interface Cell {
  letter: string;
  filled: boolean;
  num?: number;
  userInput: string;
  revealed: boolean;
  correct?: boolean;
}

const SUBJECTS = ["All", "Biology", "Physics", "Chemistry"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  hard: "bg-red-100 text-red-700 border-red-300",
};

const SUBJECT_COLORS: Record<string, string> = {
  biology: "bg-emerald-50 text-emerald-700 border-emerald-200",
  physics: "bg-blue-50 text-blue-700 border-blue-200",
  chemistry: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function CrosswordPage() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [loading, setLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedDir, setSelectedDir] = useState<"across" | "down">("across");
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState("");
  const [showComplete, setShowComplete] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  const generateCrossword = useCallback(async (customTopic?: string) => {
    setLoading(true);
    setChecked(false);
    setSolved(new Set());
    setSelectedCell(null);
    setSelectedWord(null);
    setShowComplete(false);

    const topicPrompt = customTopic || topic
      ? `Focus on the topic: ${customTopic || topic}.`
      : "Mix topics from NEET and JEE syllabus.";

    try {
      const response = await fetch("/api/crossword/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ topic: customTopic || topic }),
});

const data = await response.json();
if (!data.words) throw new Error("No words returned");
const wordList: Omit<WordEntry, "dir" | "row" | "col" | "num">[] = data.words;

      const placed = placeCrossword(wordList);
      if (placed.length > 0) {
        buildGrid(placed);
        setWords(placed);
      }
    } catch (err) {
      console.error("Failed to generate crossword:", err);
    } finally {
      setLoading(false);
    }
  }, [topic]);

function placeCrossword(wordList: Omit<WordEntry, "dir" | "row" | "col" | "num">[]): WordEntry[] {
  const GRID = 20;
  const grid: string[][] = Array.from({ length: GRID }, () => Array(GRID).fill(""));
  const placed: WordEntry[] = [];
  let wordNum = 1;

  const canPlace = (word: string, row: number, col: number, dir: "across" | "down"): boolean => {
    if (dir === "across" && col + word.length > GRID) return false;
    if (dir === "down" && row + word.length > GRID) return false;
    if (dir === "across" && col < 0) return false;
    if (dir === "down" && row < 0) return false;

    let intersects = placed.length === 0;

    for (let i = 0; i < word.length; i++) {
      const r = dir === "across" ? row : row + i;
      const c = dir === "across" ? col + i : col;

      if (r < 0 || r >= GRID || c < 0 || c >= GRID) return false;

      const cell = grid[r][c];
      if (cell && cell !== word[i]) return false;
      if (cell === word[i]) { intersects = true; continue; }

      // Check adjacent cells don't create invalid words
      if (dir === "across") {
        if (r > 0 && grid[r-1][c]) return false;
        if (r < GRID-1 && grid[r+1][c]) return false;
      } else {
        if (c > 0 && grid[r][c-1]) return false;
        if (c < GRID-1 && grid[r][c+1]) return false;
      }
    }

    // Check ends are clear
    if (dir === "across") {
      if (col > 0 && grid[row][col-1]) return false;
      if (col + word.length < GRID && grid[row][col + word.length]) return false;
    } else {
      if (row > 0 && grid[row-1][col]) return false;
      if (row + word.length < GRID && grid[row + word.length]?.[col]) return false;
    }

    return intersects;
  };

  const doPlace = (word: string, row: number, col: number, dir: "across" | "down") => {
    for (let i = 0; i < word.length; i++) {
      const r = dir === "across" ? row : row + i;
      const c = dir === "across" ? col + i : col;
      grid[r][c] = word[i];
    }
  };

  const sorted = [...wordList]
    .map(w => ({ ...w, word: w.word.toUpperCase().replace(/[^A-Z]/g, "") }))
    .filter(w => w.word.length >= 3)
    .sort((a, b) => b.word.length - a.word.length);

  // Place first word in center horizontally
  const first = sorted[0];
  const startRow = Math.floor(GRID / 2);
  const startCol = Math.floor((GRID - first.word.length) / 2);
  doPlace(first.word, startRow, startCol, "across");
  placed.push({ ...first, dir: "across", row: startRow, col: startCol, num: wordNum++ });

  // Try to place remaining words
  for (let wi = 1; wi < sorted.length; wi++) {
    const w = sorted[wi];
    let placedWord = false;

    // Try intersecting with each placed word
    for (const pw of placed) {
      if (placedWord) break;
      const newDir: "across" | "down" = pw.dir === "across" ? "down" : "across";

      for (let pi = 0; pi < pw.word.length && !placedWord; pi++) {
        for (let wi2 = 0; wi2 < w.word.length && !placedWord; wi2++) {
          if (pw.word[pi] !== w.word[wi2]) continue;

          let r: number, c: number;
          if (newDir === "down") {
            r = pw.row - wi2;
            c = pw.col + pi;
          } else {
            r = pw.row + pi;
            c = pw.col - wi2;
          }

          if (canPlace(w.word, r, c, newDir)) {
            doPlace(w.word, r, c, newDir);
            placed.push({ ...w, dir: newDir, row: r, col: c, num: wordNum++ });
            placedWord = true;
          }
        }
      }
    }
  }

  if (placed.length < 5) return placed;

  // Trim grid to used area
  let minR = GRID, minC = GRID, maxR = 0, maxC = 0;
  placed.forEach(w => {
    minR = Math.min(minR, w.row);
    minC = Math.min(minC, w.col);
    const endR = w.dir === "across" ? w.row : w.row + w.word.length - 1;
    const endC = w.dir === "across" ? w.col + w.word.length - 1 : w.col;
    maxR = Math.max(maxR, endR);
    maxC = Math.max(maxC, endC);
  });

  const pad = 1;
  const offsetR = Math.max(0, minR - pad);
  const offsetC = Math.max(0, minC - pad);
  const newRows = maxR - offsetR + pad + 1;
  const newCols = maxC - offsetC + pad + 1;

  setRows(newRows);
  setCols(newCols);

  return placed.map(w => ({ ...w, row: w.row - offsetR, col: w.col - offsetC }));
}