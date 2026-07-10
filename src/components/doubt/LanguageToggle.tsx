"use client";
// src/components/doubt/LanguageToggle.tsx
// Phase 1 — Hindi / English toggle for voice input and output
// Persists selection to localStorage so student doesn't need to re-select each session.

import { useEffect } from "react";
import { cn } from "@/utils";
import type { VoiceLanguage } from "./VoiceInput";

const STORAGE_KEY = "vs_voice_lang";

interface LanguageToggleProps {
  value: VoiceLanguage;
  onChange: (lang: VoiceLanguage) => void;
  className?: string;
}

const OPTIONS: { lang: VoiceLanguage; label: string; flag: string }[] = [
  { lang: "en-IN", label: "English", flag: "🇬🇧" },
  { lang: "hi-IN", label: "हिंदी",   flag: "🇮🇳" },
];

export function LanguageToggle({ value, onChange, className }: LanguageToggleProps) {
  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as VoiceLanguage | null;
      if (saved && (saved === "en-IN" || saved === "hi-IN")) onChange(saved);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(lang: VoiceLanguage) {
    onChange(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-muted p-0.5 gap-0.5",
        className
      )}
      role="group"
      aria-label="Voice language"
    >
      {OPTIONS.map(({ lang, label, flag }) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleChange(lang)}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
            "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1",
            value === lang
              ? "bg-white dark:bg-card shadow-sm text-orange-600 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={value === lang}
          title={`Switch voice to ${label}`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
