"use client";
// src/components/doubt/VoiceInput.tsx
// Phase 1 — Voice-to-text for the AI Doubt Solver
//
// Uses Web Speech API (SpeechRecognition) — Chrome/Edge/Android Chrome only.
// Gracefully hides the mic button on unsupported browsers (Firefox, Safari/iOS).
// Designed to be swappable: replace the internals with Google Cloud STT later
// without changing the props interface.

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/utils";

// ── Web Speech API type shim ─────────────────────────────────────────────
// TypeScript's default lib doesn't include these — use `any` to avoid errors.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpeechRecognition = any;

export type VoiceLanguage = "en-IN" | "hi-IN";

interface VoiceInputProps {
  onTranscript: (text: string) => void;   // called with final transcript
  onInterimTranscript?: (text: string) => void; // called during speech (live preview)
  language: VoiceLanguage;
  disabled?: boolean;
  className?: string;
}

type ListeningState = "idle" | "listening" | "processing";

export function VoiceInput({
  onTranscript,
  onInterimTranscript,
  language,
  disabled = false,
  className,
}: VoiceInputProps) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<ListeningState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<AnySpeechRecognition | null>(null);

  // Check browser support on mount
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState("idle");
  }, []);

  const startListening = useCallback(() => {
    setErrorMsg(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition: AnySpeechRecognition = new SpeechRecognitionAPI();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setState("listening");

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim && onInterimTranscript) onInterimTranscript(interim);
      if (final) {
        onTranscript(final.trim());
        setState("idle");
      }
    };

    recognition.onerror = (event: any) => {
      const msgMap: Record<string, string> = {
        "no-speech":     "No speech detected. Please try again.",
        "audio-capture": "Microphone not found. Check permissions.",
        "not-allowed":   "Microphone access denied. Allow it in browser settings.",
        "network":       "Network error. Check your connection.",
        "aborted":       "",
      };
      const msg = msgMap[event.error] ?? `Voice error: ${event.error}`;
      if (msg) setErrorMsg(msg);
      setState("idle");
    };

    recognition.onend = () => {
      if (state === "listening") setState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onTranscript, onInterimTranscript, state]);

  const handleClick = () => {
    if (state === "listening") {
      stopListening();
    } else {
      startListening();
    }
  };

  // Hide entirely if browser doesn't support STT
  if (!supported) return null;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={state === "listening" ? "Stop recording" : "Speak your doubt"}
        className={cn(
          "relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          state === "listening"
            ? "bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white"
            : "bg-orange-500 hover:bg-orange-600 focus:ring-orange-400 text-white",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-label={state === "listening" ? "Stop recording" : "Start voice input"}
      >
        {/* Pulsing ring while listening */}
        {state === "listening" && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />
            <span className="absolute inset-0 rounded-full bg-red-300 animate-pulse opacity-40" />
          </>
        )}

        {state === "listening" ? (
          <Square className="h-4 w-4 relative z-10" />
        ) : (
          <Mic className="h-4 w-4 relative z-10" />
        )}
      </button>

      {/* Status label */}
      <span className={cn(
        "text-[10px] font-medium leading-none transition-colors",
        state === "listening" ? "text-red-500" : "text-muted-foreground"
      )}>
        {state === "listening" ? "Listening..." : "Speak"}
      </span>

      {/* Error message */}
      {errorMsg && (
        <p className="text-[10px] text-red-500 text-center max-w-[120px] leading-tight mt-0.5">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
