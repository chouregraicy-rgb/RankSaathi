"use client";
// src/components/doubt/TTSPlayer.tsx
// Phase 1 — Text-to-speech for the AI Doubt Solver answer
//
// Uses Web Speech Synthesis API — supported on Chrome, Edge, Safari, Firefox.
// Strips markdown/LaTeX before speaking so symbols aren't read aloud.
// Swappable: replace internals with ElevenLabs/Google Cloud TTS later
// without changing the props interface.

import { useState, useEffect, useCallback, useRef } from "react";
import { Volume2, VolumeX, Square, Loader2 } from "lucide-react";
import { cn } from "@/utils";
import type { VoiceLanguage } from "./VoiceInput";

interface TTSPlayerProps {
  text: string;                   // the AI answer text to speak
  language: VoiceLanguage;
  onSpeakingChange?: (isSpeaking: boolean) => void; // parent can react to speaking state
  className?: string;
}

type SpeakState = "idle" | "loading" | "speaking" | "paused";

// Strip markdown, LaTeX, and symbols that TTS would mangle
function cleanForSpeech(text: string): string {
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, " equation ")   // block LaTeX → "equation"
    .replace(/\$[^$]*?\$/g, " equation ")           // inline LaTeX
    .replace(/\*\*(.+?)\*\*/g, "$1")               // bold
    .replace(/\*(.+?)\*/g, "$1")                   // italic
    .replace(/#{1,6}\s/g, "")                       // headings
    .replace(/`[^`]*`/g, "")                        // code
    .replace(/[-–—]{2,}/g, ", ")                   // dashes
    .replace(/\n{2,}/g, ". ")                       // paragraph breaks → pause
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function TTSPlayer({
  text,
  language,
  onSpeakingChange,
  className,
}: TTSPlayerProps) {
  const [state, setState] = useState<SpeakState>("idle");
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
    // Cancel any ongoing speech when component unmounts
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  // When text changes (new answer), stop previous speech
  useEffect(() => {
    if (state !== "idle") {
      window.speechSynthesis?.cancel();
      setState("idle");
      onSpeakingChange?.(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const speak = useCallback(() => {
    if (!supported) return;

    // If paused, resume
    if (state === "paused") {
      window.speechSynthesis.resume();
      setState("speaking");
      onSpeakingChange?.(true);
      return;
    }

    window.speechSynthesis.cancel(); // clear queue

    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    setState("loading");
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = language;
    utterance.rate = 0.95;   // slightly slower than default — better for learning
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Pick best available voice for the language
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      v => v.lang.startsWith(language.split("-")[0]) && v.localService
    ) ?? voices.find(
      v => v.lang.startsWith(language.split("-")[0])
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart  = () => { setState("speaking"); onSpeakingChange?.(true); };
    utterance.onend    = () => { setState("idle");     onSpeakingChange?.(false); };
    utterance.onerror  = () => { setState("idle");     onSpeakingChange?.(false); };
    utterance.onpause  = () => { setState("paused");   onSpeakingChange?.(false); };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [supported, state, text, language, onSpeakingChange]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setState("paused");
    onSpeakingChange?.(false);
  }, [onSpeakingChange]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState("idle");
    onSpeakingChange?.(false);
  }, [onSpeakingChange]);

  if (!supported) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Main play/pause button */}
      <button
        type="button"
        onClick={state === "speaking" ? pause : speak}
        disabled={state === "loading"}
        title={state === "speaking" ? "Pause" : state === "paused" ? "Resume" : "Listen to answer"}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          state === "speaking"
            ? "bg-orange-100 text-orange-600 border border-orange-300 focus:ring-orange-400"
            : state === "paused"
            ? "bg-amber-100 text-amber-700 border border-amber-300 focus:ring-amber-400"
            : "bg-muted text-muted-foreground hover:bg-orange-50 hover:text-orange-600 border border-border focus:ring-orange-400"
        )}
        aria-label={state === "speaking" ? "Pause reading" : "Read answer aloud"}
      >
        {state === "loading" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : state === "speaking" ? (
          <>
            {/* Animated sound bars */}
            <span className="flex items-end gap-[2px] h-3.5">
              {[1, 3, 2, 4, 1].map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-orange-500"
                  style={{
                    height: `${h * 3}px`,
                    animation: `soundBar 0.8s ${i * 0.12}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </span>
            <span>Pause</span>
          </>
        ) : state === "paused" ? (
          <>
            <Volume2 className="h-3.5 w-3.5" />
            <span>Resume</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3.5 w-3.5" />
            <span>Listen</span>
          </>
        )}
      </button>

      {/* Stop button — only shown while active */}
      {(state === "speaking" || state === "paused") && (
        <button
          type="button"
          onClick={stop}
          title="Stop"
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted hover:bg-red-100 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          aria-label="Stop reading"
        >
          <Square className="h-3 w-3" />
        </button>
      )}

      {/* Sound bar animation keyframes */}
      <style>{`
        @keyframes soundBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
