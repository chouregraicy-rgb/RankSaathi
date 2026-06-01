// src/app/api/ai/pyq/route.ts
import { NextResponse } from "next/server";

const GOOGLE_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`;

export async function POST(request: Request) {
  const { chapter, subject } = await request.json();

  const prompt = `You are an expert NEET/JEE question bank curator with 20 years experience.
Generate 8 previous year exam style questions for "${chapter}" from ${subject} for NEET UG / JEE Main students.

Return ONLY valid JSON — no markdown, no backticks, no explanation before or after.

{
  "pyqQuestions": [
    {
      "id": 1,
      "question": "Full question text specific to ${chapter}",
      "options": {
        "A": "first option",
        "B": "second option",
        "C": "third option",
        "D": "fourth option"
      },
      "correct": "A",
      "year": "NEET 2022",
      "explanation": "Detailed explanation of why this answer is correct, which concept or formula applies, and why other options are wrong."
    }
  ]
}

Rules:
- All 8 questions must be specific to the chapter and subject given
- Mix difficulty: 3 easy, 3 medium, 2 hard
- year must be one of: NEET 2017, NEET 2018, NEET 2019, NEET 2020, NEET 2021, NEET 2022, NEET 2023, NEET 2024, JEE Main 2019, JEE Main 2020, JEE Main 2021, JEE Main 2022, JEE Main 2023, NEET Pattern
- correct must be exactly one of: A, B, C, or D
- explanation must be 2-3 sentences mentioning the concept used
- Wrong options must be plausible misconceptions, not obviously wrong
- Return ONLY the JSON object, nothing else`;

  try {
    const response = await fetch(GOOGLE_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 3500 },
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON object found in response");

    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (!parsed.pyqQuestions || !Array.isArray(parsed.pyqQuestions)) {
      throw new Error("Invalid response structure — missing pyqQuestions array");
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("PYQ API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
