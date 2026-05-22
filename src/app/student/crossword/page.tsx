"use client";

import { useState, useRef, useCallback } from "react";
import { Loader2, RefreshCw, CheckCircle, Eye, RotateCcw, Trophy, Zap, BookOpen } from "lucide-react";

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
  const [error, setError] = useState("");
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  // ── FIX: placeCrossword now returns { placed, finalRows, finalCols }
  // instead of calling setRows/setCols internally (which caused stale closure in buildGrid)
  function placeCrossword(wordList: Omit<WordEntry, "dir" | "row" | "col" | "num">[]): {
    placed: WordEntry[];
    finalRows: number;
    finalCols: number;
  } {
    const GRID = 20;
    const tempGrid: string[][] = Array.from({ length: GRID }, () => Array(GRID).fill(""));
    const placed: WordEntry[] = [];
    let wordNum = 1;

    const canPlace = (word: string, row: number, col: number, dir: "across" | "down"): boolean => {
      if (dir === "across" && (col < 0 || col + word.length > GRID)) return false;
      if (dir === "down" && (row < 0 || row + word.length > GRID)) return false;

      let intersects = placed.length === 0;

      for (let i = 0; i < word.length; i++) {
        const r = dir === "across" ? row : row + i;
        const c = dir === "across" ? col + i : col;
        if (r < 0 || r >= GRID || c < 0 || c >= GRID) return false;

        const cell = tempGrid[r][c];
        if (cell && cell !== word[i]) return false;
        if (cell === word[i]) { intersects = true; continue; }

        if (dir === "across") {
          if (r > 0 && tempGrid[r - 1][c]) return false;
          if (r < GRID - 1 && tempGrid[r + 1][c]) return false;
        } else {
          if (c > 0 && tempGrid[r][c - 1]) return false;
          if (c < GRID - 1 && tempGrid[r][c + 1]) return false;
        }
      }

      if (dir === "across") {
        if (col > 0 && tempGrid[row][col - 1]) return false;
        if (col + word.length < GRID && tempGrid[row][col + word.length]) return false;
      } else {
        if (row > 0 && tempGrid[row - 1][col]) return false;
        if (row + word.length < GRID && tempGrid[row + word.length]?.[col]) return false;
      }

      return intersects;
    };

    const doPlace = (word: string, row: number, col: number, dir: "across" | "down") => {
      for (let i = 0; i < word.length; i++) {
        const r = dir === "across" ? row : row + i;
        const c = dir === "across" ? col + i : col;
        tempGrid[r][c] = word[i];
      }
    };

    const sorted = [...wordList]
      .map(w => ({ ...w, word: w.word.toUpperCase().replace(/[^A-Z]/g, "") }))
      .filter(w => w.word.length >= 3)
      .sort((a, b) => b.word.length - a.word.length);

    if (sorted.length === 0) return { placed: [], finalRows: 15, finalCols: 15 };

    const first = sorted[0];
    const startRow = Math.floor(GRID / 2);
    const startCol = Math.floor((GRID - first.word.length) / 2);
    doPlace(first.word, startRow, startCol, "across");
    placed.push({ ...first, dir: "across", row: startRow, col: startCol, num: wordNum++ });

    for (let wi = 1; wi < sorted.length; wi++) {
      const w = sorted[wi];
      let placedWord = false;
      for (const pw of placed) {
        if (placedWord) break;
        const newDir: "across" | "down" = pw.dir === "across" ? "down" : "across";
        for (let pi = 0; pi < pw.word.length && !placedWord; pi++) {
          for (let wi2 = 0; wi2 < w.word.length && !placedWord; wi2++) {
            if (pw.word[pi] !== w.word[wi2]) continue;
            let r: number, c: number;
            if (newDir === "down") { r = pw.row - wi2; c = pw.col + pi; }
            else { r = pw.row + pi; c = pw.col - wi2; }
            if (canPlace(w.word, r, c, newDir)) {
              doPlace(w.word, r, c, newDir);
              placed.push({ ...w, dir: newDir, row: r, col: c, num: wordNum++ });
              placedWord = true;
            }
          }
        }
      }
    }

    if (placed.length < 2) return { placed, finalRows: 15, finalCols: 15 };

    // Calculate tight bounding box
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
    const finalRows = maxR - offsetR + pad + 2;
    const finalCols = maxC - offsetC + pad + 2;

    const adjusted = placed.map(w => ({ ...w, row: w.row - offsetR, col: w.col - offsetC }));
    return { placed: adjusted, finalRows, finalCols };
  }

  // ── FIX: buildGrid receives finalRows/finalCols as params — no stale closure
  function buildGrid(placed: WordEntry[], finalRows: number, finalCols: number): Cell[][] {
    const newGrid: Cell[][] = Array.from({ length: finalRows }, () =>
      Array.from({ length: finalCols }, () => ({ letter: "", filled: false, userInput: "", revealed: false }))
    );

    placed.forEach(w => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.dir === "across" ? w.row : w.row + i;
        const c = w.dir === "across" ? w.col + i : w.col;
        if (r < finalRows && c < finalCols) {
          newGrid[r][c].letter = w.word[i];
          newGrid[r][c].filled = true;
          if (i === 0 && !newGrid[r][c].num) newGrid[r][c].num = w.num;
        }
      }
    });

    return newGrid;
  }

  const generateCrossword = useCallback(async (customTopic?: string) => {
    setLoading(true);
    setError("");
    setChecked(false);
    setSolved(new Set());
    setSelectedCell(null);
    setSelectedWord(null);
    setShowComplete(false);
    setGrid([]);
    setWords([]);

    try {
      const response = await fetch("/api/crossword/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: customTopic || topic }),
      });

      const data = await response.json();
      if (!response.ok || !data.words || data.words.length === 0) {
        throw new Error(data.error || "No words returned from AI");
      }

      const wordList: Omit<WordEntry, "dir" | "row" | "col" | "num">[] = data.words;

      // ── FIX: get rows/cols back from placeCrossword synchronously
      const { placed, finalRows, finalCols } = placeCrossword(wordList);

      if (placed.length < 2) {
        throw new Error("Not enough words could be placed. Try a different topic.");
      }

      // ── FIX: pass finalRows/finalCols directly — no stale state
      const builtGrid = buildGrid(placed, finalRows, finalCols);

      setRows(finalRows);
      setCols(finalCols);
      setGrid(builtGrid);
      setWords(placed);
    } catch (err: any) {
      console.error("Failed to generate crossword:", err);
      setError(err.message || "Failed to generate crossword. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [topic]);

  function findWordAt(r: number, c: number, dir: "across" | "down") {
    return words.find(w => {
      if (w.dir !== dir) return false;
      if (dir === "across") return w.row === r && c >= w.col && c < w.col + w.word.length;
      return w.col === c && r >= w.row && r < w.row + w.word.length;
    }) || null;
  }

  function selectCell(r: number, c: number) {
    if (!grid[r]?.[c]?.filled) return;
    let dir = selectedDir;
    const wa = findWordAt(r, c, "across");
    const wd = findWordAt(r, c, "down");
    if (selectedCell?.[0] === r && selectedCell?.[1] === c) {
      dir = selectedDir === "across" ? "down" : "across";
    }
    if (dir === "across" && !wa) dir = "down";
    if (dir === "down" && !wd) dir = "across";
    setSelectedDir(dir);
    setSelectedCell([r, c]);
    setSelectedWord(dir === "across" ? wa : wd);
    setTimeout(() => inputRefs.current[`${r}-${c}`]?.focus(), 10);
  }

  function handleKeyDown(e: React.KeyboardEvent, r: number, c: number) {
    if (e.key === "Backspace") {
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      if (newGrid[r][c].userInput) { newGrid[r][c].userInput = ""; setGrid(newGrid); }
      else movePrev(r, c);
      e.preventDefault();
    } else if (e.key === "ArrowRight") { selectCell(r, c + 1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { selectCell(r, c - 1); e.preventDefault(); }
    else if (e.key === "ArrowDown") { selectCell(r + 1, c); e.preventDefault(); }
    else if (e.key === "ArrowUp") { selectCell(r - 1, c); e.preventDefault(); }
    else if (e.key === "Tab") {
      e.preventDefault();
      if (!selectedWord) return;
      const idx = words.indexOf(selectedWord);
      const next = words[(idx + 1) % words.length];
      setSelectedDir(next.dir); setSelectedWord(next); setSelectedCell([next.row, next.col]);
      setTimeout(() => inputRefs.current[`${next.row}-${next.col}`]?.focus(), 10);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>, r: number, c: number) {
    const val = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(-1);
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].userInput = val;
    newGrid[r][c].correct = undefined;
    setGrid(newGrid);
    if (val) moveNext(r, c);
    const w = selectedWord;
    if (w) {
      let full = "";
      for (let i = 0; i < w.word.length; i++) {
        const wr = w.dir === "across" ? w.row : w.row + i;
        const wc = w.dir === "across" ? w.col + i : w.col;
        full += newGrid[wr]?.[wc]?.userInput || "";
      }
      if (full === w.word) {
        const key = `${w.num}-${w.dir}`;
        setSolved(prev => {
          const next = new Set(prev);
          next.add(key);
          if (next.size === words.length) setShowComplete(true);
          return next;
        });
      }
    }
  }

  function moveNext(r: number, c: number) {
    if (!selectedWord) return;
    const w = selectedWord;
    if (w.dir === "across" && c < w.col + w.word.length - 1) selectCell(r, c + 1);
    else if (w.dir === "down" && r < w.row + w.word.length - 1) selectCell(r + 1, c);
  }

  function movePrev(r: number, c: number) {
    if (!selectedWord) return;
    const w = selectedWord;
    if (w.dir === "across" && c > w.col) selectCell(r, c - 1);
    else if (w.dir === "down" && r > w.row) selectCell(r - 1, c);
  }

  function checkAnswers() {
    setChecked(true);
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let correct = 0;
    words.forEach(w => {
      let allRight = true;
      for (let i = 0; i < w.word.length; i++) {
        const r = w.dir === "across" ? w.row : w.row + i;
        const c = w.dir === "across" ? w.col + i : w.col;
        if (newGrid[r]?.[c]) {
          const isRight = newGrid[r][c].userInput === w.word[i];
          if (newGrid[r][c].userInput) newGrid[r][c].correct = isRight;
          if (!isRight) allRight = false;
        }
      }
      if (allRight) correct++;
    });
    setGrid(newGrid);
    setScore(correct);
  }

  function revealLetter() {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].userInput = newGrid[r][c].letter;
    newGrid[r][c].revealed = true;
    newGrid[r][c].correct = true;
    setGrid(newGrid);
    moveNext(r, c);
  }

  function resetGrid() {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell, userInput: "", revealed: false, correct: undefined })));
    setGrid(newGrid);
    setSolved(new Set());
    setChecked(false);
    setScore(0);
    setShowComplete(false);
  }

  const isInSelectedWord = (r: number, c: number) => {
    if (!selectedWord) return false;
    const w = selectedWord;
    if (w.dir === "across") return w.row === r && c >= w.col && c < w.col + w.word.length;
    return w.col === c && r >= w.row && r < w.row + w.word.length;
  };

  const getCellClass = (r: number, c: number, cell: Cell) => {
    if (!cell.filled) return "bg-gray-900 dark:bg-gray-950";
    const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
    const isHighlighted = isInSelectedWord(r, c);
    if (cell.revealed) return "bg-blue-100 dark:bg-blue-900";
    if (cell.correct === true) return "bg-green-100 dark:bg-green-900";
    if (cell.correct === false) return "bg-red-100 dark:bg-red-900";
    if (isSelected) return "bg-violet-300 dark:bg-violet-700";
    if (isHighlighted) return "bg-violet-100 dark:bg-violet-900";
    return "bg-white dark:bg-gray-800";
  };

  const filteredWords = words.filter(w =>
    (filterSubject === "All" || w.subject === filterSubject.toLowerCase()) &&
    (filterDiff === "All" || w.difficulty === filterDiff.toLowerCase())
  );

  const acrossWords = filteredWords.filter(w => w.dir === "across").sort((a, b) => a.num - b.num);
  const downWords = filteredWords.filter(w => w.dir === "down").sort((a, b) => a.num - b.num);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-violet-600" />
              NEET & JEE Crossword
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI-generated puzzles — Biology, Physics & Chemistry</p>
          </div>
          <div className="flex items-center gap-2">
            {solved.size > 0 && (
              <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <Trophy className="w-4 h-4" />
                {solved.size}/{words.length} solved
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-4 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generateCrossword()}
            placeholder="Topic (e.g. Cell Division, Optics, Organic Chemistry)..."
            className="flex-1 min-w-48 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={() => generateCrossword()}
            disabled={loading}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {loading ? "Generating..." : "New Puzzle"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => setFilterSubject(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterSubject === s ? "bg-violet-600 text-white border-violet-600" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-violet-400"}`}>
              {s === "Biology" ? "🧬" : s === "Physics" ? "⚡" : s === "Chemistry" ? "🧪" : "📚"} {s}
            </button>
          ))}
          <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setFilterDiff(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterDiff === d ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"}`}>
              {d}
            </button>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <span>⚠️ {error}</span>
            <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                <p className="text-sm text-gray-500">AI is generating your crossword...</p>
              </div>
            ) : grid.length > 0 ? (
              <>
                <div
                  style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 30px)`, gap: "1px", backgroundColor: "#d1d5db" }}
                  className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
                >
                  {grid.slice(0, rows).map((row, r) =>
                    row.slice(0, cols).map((cell, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={`relative ${getCellClass(r, c, cell)} transition-colors`}
                        style={{ width: 30, height: 30 }}
                        onClick={() => cell.filled && selectCell(r, c)}
                      >
                        {cell.num && (
                          <span className="absolute top-0 left-0.5 text-[7px] text-gray-500 dark:text-gray-400 leading-none z-10 pointer-events-none">
                            {cell.num}
                          </span>
                        )}
                        {cell.filled && (
                          <input
                            ref={el => { if (el) inputRefs.current[`${r}-${c}`] = el; }}
                            maxLength={1}
                            value={cell.userInput}
                            onChange={e => handleInput(e, r, c)}
                            onKeyDown={e => handleKeyDown(e, r, c)}
                            onClick={() => selectCell(r, c)}
                            className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-center text-xs font-bold uppercase text-gray-900 dark:text-white caret-transparent cursor-pointer pt-2"
                            aria-label={`Cell row ${r + 1} col ${c + 1}`}
                            readOnly={cell.revealed}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={checkAnswers}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <CheckCircle className="w-4 h-4" /> Check
                  </button>
                  <button onClick={revealLetter}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <Eye className="w-4 h-4" /> Reveal letter
                  </button>
                  <button onClick={resetGrid}
                    className="flex items-center gap-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>

                {checked && (
                  <div className={`mt-3 px-4 py-2.5 rounded-xl text-sm font-medium ${score === words.length ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                    {score === words.length ? `Perfect! All ${words.length} words correct!` : `${score} of ${words.length} words correct. Red = wrong letter.`}
                  </div>
                )}

                {showComplete && (
                  <div className="mt-3 px-4 py-3 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-sm font-medium flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-violet-500" />
                    Congratulations! Puzzle complete! Generate a new one to keep practicing!
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
                <Zap className="w-8 h-8" />
                <p className="text-sm">Click "New Puzzle" to generate a crossword</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 lg:w-72 xl:w-80 flex-shrink-0 overflow-y-auto max-h-[600px]">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Clues</h2>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading clues...
              </div>
            ) : (
              <>
                {acrossWords.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Across</p>
                    <ul className="space-y-1">
                      {acrossWords.map(w => {
                        const key = `${w.num}-across`;
                        const isSolved = solved.has(key);
                        const isActive = selectedWord?.num === w.num && selectedWord?.dir === w.dir;
                        return (
                          <li key={key}
                            onClick={() => { setSelectedDir("across"); setSelectedWord(w); setSelectedCell([w.row, w.col]); setTimeout(() => inputRefs.current[`${w.row}-${w.col}`]?.focus(), 10); }}
                            className={`flex gap-2 p-1.5 rounded-lg cursor-pointer text-xs transition-colors ${isActive ? "bg-violet-50 dark:bg-violet-950" : "hover:bg-gray-50 dark:hover:bg-gray-800"} ${isSolved ? "opacity-50" : ""}`}>
                            <span className="font-bold text-gray-500 min-w-[18px]">{w.num}.</span>
                            <span className={`flex-1 ${isSolved ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>{w.clue}</span>
                            <div className="flex flex-col gap-0.5 items-end">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${SUBJECT_COLORS[w.subject]}`}>{w.subject.slice(0, 3)}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${DIFFICULTY_COLORS[w.difficulty]}`}>{w.difficulty.slice(0, 3)}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {downWords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Down</p>
                    <ul className="space-y-1">
                      {downWords.map(w => {
                        const key = `${w.num}-down`;
                        const isSolved = solved.has(key);
                        const isActive = selectedWord?.num === w.num && selectedWord?.dir === w.dir;
                        return (
                          <li key={key}
                            onClick={() => { setSelectedDir("down"); setSelectedWord(w); setSelectedCell([w.row, w.col]); setTimeout(() => inputRefs.current[`${w.row}-${w.col}`]?.focus(), 10); }}
                            className={`flex gap-2 p-1.5 rounded-lg cursor-pointer text-xs transition-colors ${isActive ? "bg-violet-50 dark:bg-violet-950" : "hover:bg-gray-50 dark:hover:bg-gray-800"} ${isSolved ? "opacity-50" : ""}`}>
                            <span className="font-bold text-gray-500 min-w-[18px]">{w.num}.</span>
                            <span className={`flex-1 ${isSolved ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>{w.clue}</span>
                            <div className="flex flex-col gap-0.5 items-end">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${SUBJECT_COLORS[w.subject]}`}>{w.subject.slice(0, 3)}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${DIFFICULTY_COLORS[w.difficulty]}`}>{w.difficulty.slice(0, 3)}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {!loading && words.length === 0 && (
                  <p className="text-xs text-gray-400">Generate a puzzle to see clues.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

