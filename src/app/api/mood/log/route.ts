// src/app/api/mood/log/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeMoodScores } from "@/services/moodService";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const signals = await request.json();
    const scores = computeMoodScores(signals);

    const { data, error } = await supabase.from("mood_logs").insert({
      student_id: user.id,
      ...scores,
      study_hours_today: signals.studyHoursToday,
      sessions_today: signals.sessionsToday,
      inactivity_minutes: signals.inactivityMinutes,
      logged_at: new Date().toISOString(),
    }).select().single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
