// src/app/api/ai/chapter-questions/route.ts
import { NextResponse } from "next/server";

const GOOGLE_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`;

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
    const response = await fetch(GOOGLE_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 8000 },
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = content.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error: any) {
    console.error("Chapter questions error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
