// src/app/api/ai/chapter-questions/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { chapter, subject } = await request.json();

  const prompt = `You are an expert NEET/JEE question setter with 20 years experience.
Generate exactly 50 multiple choice questions for the chapter "${chapter}" in ${subject} for NEET/JEE preparation.

Cover ALL subtopics of this chapter. Do not repeat similar questions.
Mix difficulty: 15 easy, 20 medium, 15 hard.

Return ONLY this exact JSON (no markdown, no backticks, no extra text):
{
  "questions": [
    {
      "id": 1,
      "question": "full question text here",
      "options": {
        "A": "option A",
        "B": "option B",
        "C": "option C",
        "D": "option D"
      },
      "correct": "A",
      "explanation": "detailed 2-3 sentence explanation of why this answer is correct and why others are wrong"
    }
  ]
}

Rules:
- All 50 questions must be unique and specific to "${chapter}" in ${subject}
- Cover every subtopic without repetition
- Each explanation must clearly explain the concept
- Match actual NEET/JEE exam question style and difficulty
- Include numerical, conceptual and application based questions`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "RankSaathi",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Chapter questions error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}