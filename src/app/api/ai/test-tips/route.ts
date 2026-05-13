// src/app/api/ai/test-tips/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTestImprovementTips } from "@/services/aiService";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { score, maxScore, weakTopics, timeTaken, subject } = body;

    const tips = await getTestImprovementTips({
      score,
      maxScore,
      weakTopics: weakTopics ?? [],
      timeTakenMinutes: timeTaken,
      subject,
    });

    return NextResponse.json({ tips });
  } catch (err: any) {
    console.error("[api/ai/test-tips]", err);
    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
