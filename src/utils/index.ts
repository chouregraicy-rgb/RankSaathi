// src/utils/index.ts
// Shared utility functions used throughout the app

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ---- Tailwind class merger ----
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- Format study duration ----
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

// ---- Format date ----
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ---- Format relative time ----
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// ---- Generate a random invite code ----
export function generateInviteCode(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

// ---- Subject colors ----
export const SUBJECT_COLORS: Record<string, string> = {
  Physics:     "#2b7fff",
  Chemistry:   "#00f5a0",
  Biology:     "#8b5cf6",
  Mathematics: "#ff6b35",
};

// ---- Mood state labels & colors ----
export const MOOD_CONFIG = {
  focused:      { label: "Focused",       color: "#00f5a0", emoji: "🎯" },
  normal:       { label: "Normal",        color: "#2b7fff", emoji: "😊" },
  distracted:   { label: "Distracted",    color: "#ff6b35", emoji: "😵" },
  fatigued:     { label: "Fatigued",      color: "#f59e0b", emoji: "😴" },
  burnout_risk: { label: "Burnout Risk",  color: "#ef4444", emoji: "🔥" },
};

// ---- Exam labels ----
export const EXAM_LABELS = {
  NEET:         "NEET UG",
  JEE_MAIN:     "JEE Main",
  JEE_ADVANCED: "JEE Advanced",
};

// ---- Score to grade ----
export function scoreToGrade(accuracy: number): string {
  if (accuracy >= 90) return "A+";
  if (accuracy >= 80) return "A";
  if (accuracy >= 70) return "B+";
  if (accuracy >= 60) return "B";
  if (accuracy >= 50) return "C";
  return "D";
}

// ---- Haversine distance (for geo) ----
export function getDistanceMeters(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---- Clamp number ----
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ---- Random between ----
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
