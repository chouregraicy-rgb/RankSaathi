// src/app/api/tests/submit/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { test_id, answers, time_taken_seconds } = await request.json();

    // Get test + questions (using admin to bypass RLS on questions)
    const { data: test } = await supabase.from("tests").select("*").eq("id", test_id).single();
    if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

    const { data: questions } = await supabase
      .from("questions")
      .select("id, correct_answer, type")
      .in("id", Object.keys(answers));

    // Score the attempt
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    for (const question of (questions ?? [])) {
      const studentAnswer = answers[question.id];
      if (!studentAnswer) { skipped++; continue; }
      if (studentAnswer === question.correct_answer) {
        score += 4;
        correct++;
      } else {
        score += test.negative_marking ?? -1;
        wrong++;
      }
    }

    const accuracy = correct + wrong > 0
      ? Math.round((correct / (correct + wrong)) * 100)
      : 0;

    // Save attempt
    const { data: attempt } = await supabase.from("test_attempts").insert({
      test_id,
      student_id: user.id,
      answers,
      score,
      max_score: test.total_marks,
      accuracy,
      time_taken_seconds,
      submitted_at: new Date().toISOString(),
      status: "submitted",
    }).select().single();

    return NextResponse.json({ attempt_id: attempt?.id, score, accuracy });
  } catch (err: any) {
    console.error("[api/tests/submit]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
