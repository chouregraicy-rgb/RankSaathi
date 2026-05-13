// src/app/student/schedule/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, SUBJECT_COLORS } from "@/utils";
import { Clock, Plus, CheckCircle2, Circle, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SCHEDULE: Record<string, { time: string; subject: string; topic: string; duration: number; done: boolean }[]> = {
  Mon: [
    { time: "06:00", subject: "Physics",   topic: "Electrostatics - Coulomb's Law", duration: 90,  done: true  },
    { time: "08:00", subject: "Chemistry", topic: "Atomic Structure",               duration: 60,  done: true  },
    { time: "10:00", subject: "Biology",   topic: "Cell Biology Revision",          duration: 90,  done: false },
    { time: "16:00", subject: "Physics",   topic: "Practice Test — Mechanics",      duration: 60,  done: false },
    { time: "19:00", subject: "Chemistry", topic: "Organic — Hydrocarbons",         duration: 90,  done: false },
  ],
  Tue: [
    { time: "06:00", subject: "Mathematics", topic: "Integral Calculus",            duration: 120, done: false },
    { time: "09:00", subject: "Physics",     topic: "Current Electricity",          duration: 90,  done: false },
    { time: "16:00", subject: "Biology",     topic: "Genetics & Heredity",          duration: 90,  done: false },
    { time: "19:00", subject: "Chemistry",   topic: "Chemical Equilibrium",         duration: 60,  done: false },
  ],
  Wed: [
    { time: "06:00", subject: "Physics",   topic: "Magnetism",                     duration: 90,  done: false },
    { time: "08:30", subject: "Chemistry", topic: "Electrochemistry",              duration: 60,  done: false },
    { time: "10:30", subject: "Biology",   topic: "Photosynthesis",                duration: 90,  done: false },
    { time: "16:00", subject: "Mathematics", topic: "Probability",                 duration: 90,  done: false },
  ],
  Thu: [
    { time: "06:00", subject: "Biology",   topic: "Human Physiology",              duration: 120, done: false },
    { time: "09:00", subject: "Physics",   topic: "Optics",                        duration: 90,  done: false },
    { time: "16:00", subject: "Chemistry", topic: "Coordination Compounds",        duration: 90,  done: false },
  ],
  Fri: [
    { time: "06:00", subject: "Mathematics", topic: "Vectors & 3D",               duration: 90,  done: false },
    { time: "08:30", subject: "Physics",     topic: "Modern Physics",             duration: 90,  done: false },
    { time: "16:00", subject: "Biology",     topic: "Ecology",                    duration: 60,  done: false },
    { time: "18:00", subject: "Chemistry",   topic: "P-Block Elements",           duration: 90,  done: false },
  ],
  Sat: [
    { time: "07:00", subject: "Physics",   topic: "Full Mock — JEE Main Pattern", duration: 180, done: false },
    { time: "14:00", subject: "Chemistry", topic: "Test Analysis & Revision",     duration: 120, done: false },
  ],
  Sun: [
    { time: "09:00", subject: "Biology",   topic: "NEET Biology Full Mock",       duration: 120, done: false },
    { time: "14:00", subject: "Physics",   topic: "Weak Chapter Revision",        duration: 90,  done: false },
    { time: "17:00", subject: "Chemistry", topic: "Inorganic Recap",             duration: 60,  done: false },
  ],
};

export default function SchedulePage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const [selectedDay, setSelectedDay] = useState(DAYS.find((d) => d === today) ?? "Mon");

  const sessions = SCHEDULE[selectedDay] ?? [];
  const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
  const completedHours = sessions.filter((s) => s.done).reduce((acc, s) => acc + s.duration, 0) / 60;

  return (
    <DashboardLayout role="student" title="Study Schedule">
      <div className="max-w-3xl space-y-5">

        {/* AI suggestion */}
        <div className="bg-gradient-to-r from-purple-50 to-brand-50 dark:from-purple-950/30 dark:to-brand-950/30 border border-purple-100 dark:border-purple-900 rounded-xl p-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">AI recommends:</span>{" "}
            <span className="text-muted-foreground">Prioritise Integral Calculus today — low accuracy (42%) and high JEE weightage.</span>
          </p>
        </div>

        {/* Day selector */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 flex-1 p-1 bg-muted rounded-xl">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                  selectedDay === day
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  day === today && selectedDay !== day && "text-primary"
                )}
              >
                {day}
                {day === today && (
                  <span className="block w-1 h-1 rounded-full bg-primary mx-auto mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Day summary */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{totalHours.toFixed(1)}h planned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="font-medium">{completedHours.toFixed(1)}h done</span>
          </div>
          <Button size="sm" variant="outline" className="ml-auto gap-1">
            <Plus className="h-4 w-4" /> Add Session
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-all",
                session.done
                  ? "bg-muted/40 opacity-70"
                  : "bg-card hover:shadow-sm"
              )}
            >
              {/* Time */}
              <div className="text-xs text-muted-foreground font-mono w-11 flex-shrink-0 pt-0.5">
                {session.time}
              </div>

              {/* Color bar */}
              <div
                className="w-1 rounded-full flex-shrink-0 self-stretch min-h-[2rem]"
                style={{ backgroundColor: SUBJECT_COLORS[session.subject] ?? "#2b7fff" }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs" style={{ color: SUBJECT_COLORS[session.subject] }}>
                    {session.subject}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{session.duration}m</span>
                </div>
                <p className={cn(
                  "text-sm font-medium mt-0.5",
                  session.done && "line-through text-muted-foreground"
                )}>
                  {session.topic}
                </p>
              </div>

              {/* Done toggle */}
              <button className="flex-shrink-0 mt-0.5">
                {session.done ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground hover:text-green-500 transition-colors" />
                )}
              </button>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No sessions planned</p>
              <p className="text-xs mt-1">Add sessions for this day</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
