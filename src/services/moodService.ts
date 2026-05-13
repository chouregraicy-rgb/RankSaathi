// src/services/moodService.ts
// Sensor-based mood tracking
// Sources: app usage patterns, study consistency, inactivity, typing speed, focus sessions

import { createClient } from "@/lib/supabase/client";
import { clamp } from "@/utils";
import type { MoodLog, MoodState } from "@/types";

// ---- Track inactivity ----
let lastActivityTime = Date.now();

function resetActivityTimer() {
  lastActivityTime = Date.now();
}

export function initActivityTracking() {
  if (typeof window === "undefined") return;
  ["mousemove", "keydown", "touchstart", "scroll", "click"].forEach((event) =>
    window.addEventListener(event, resetActivityTimer, { passive: true })
  );
}

export function getInactivityMinutes(): number {
  return Math.floor((Date.now() - lastActivityTime) / 60000);
}

// ---- Compute mood scores from signals ----
interface MoodSignals {
  studyHoursToday: number;
  sessionsToday: number;
  inactivityMinutes: number;
  testAccuracyToday: number | null;  // 0-100
  streakDays: number;
  avgSessionMinutes: number;
}

interface MoodScores {
  focusScore: number;
  burnoutRisk: number;
  distractionScore: number;
  consistencyScore: number;
  moodState: MoodState;
}

export function computeMoodScores(signals: MoodSignals): MoodScores {
  // Focus score — based on session length & inactivity
  const sessionFocus = clamp((signals.avgSessionMinutes / 45) * 100, 0, 100);
  const inactivityPenalty = clamp(signals.inactivityMinutes * 3, 0, 60);
  const focusScore = clamp(sessionFocus - inactivityPenalty, 0, 100);

  // Burnout risk — too many hours + low inactivity breaks
  const hoursBurnout = clamp((signals.studyHoursToday - 6) * 20, 0, 100);
  const breakBonus = signals.inactivityMinutes > 30 ? -20 : 0;
  const burnoutRisk = clamp(hoursBurnout + breakBonus, 0, 100);

  // Distraction score — inactivity spikes during session
  const distractionScore = clamp(signals.inactivityMinutes * 2, 0, 100);

  // Consistency — streak + sessions
  const streakBonus = clamp(signals.streakDays * 5, 0, 50);
  const sessionBonus = clamp(signals.sessionsToday * 15, 0, 50);
  const consistencyScore = clamp(streakBonus + sessionBonus, 0, 100);

  // Derive mood state
  let moodState: MoodState = "normal";
  if (burnoutRisk >= 70) {
    moodState = "burnout_risk";
  } else if (distractionScore >= 60 || focusScore < 30) {
    moodState = "distracted";
  } else if (signals.studyHoursToday >= 8 && burnoutRisk >= 40) {
    moodState = "fatigued";
  } else if (focusScore >= 70 && distractionScore < 30) {
    moodState = "focused";
  }

  return {
    focusScore: Math.round(focusScore),
    burnoutRisk: Math.round(burnoutRisk),
    distractionScore: Math.round(distractionScore),
    consistencyScore: Math.round(consistencyScore),
    moodState,
  };
}

// ---- Log mood to Supabase ----
export async function logMood(
  studentId: string,
  signals: MoodSignals
): Promise<MoodLog | null> {
  const scores = computeMoodScores(signals);
  const supabase = createClient();

  const { data } = await supabase
    .from("mood_logs")
    .upsert(
      {
        student_id: studentId,
        mood_state: scores.moodState,
        focus_score: scores.focusScore,
        burnout_risk: scores.burnoutRisk,
        distraction_score: scores.distractionScore,
        consistency_score: scores.consistencyScore,
        study_hours_today: signals.studyHoursToday,
        sessions_today: signals.sessionsToday,
        inactivity_minutes: signals.inactivityMinutes,
        logged_at: new Date().toISOString(),
      },
      { onConflict: "student_id,logged_at" }
    )
    .select()
    .single();

  return data as MoodLog | null;
}

// ---- Get last 7 days mood logs ----
export async function getMoodHistory(
  studentId: string,
  days = 7
): Promise<MoodLog[]> {
  const supabase = createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("student_id", studentId)
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: true });

  return (data as MoodLog[]) ?? [];
}

// ---- Get latest mood ----
export async function getLatestMood(studentId: string): Promise<MoodLog | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("student_id", studentId)
    .order("logged_at", { ascending: false })
    .limit(1)
    .single();

  return data as MoodLog | null;
}
