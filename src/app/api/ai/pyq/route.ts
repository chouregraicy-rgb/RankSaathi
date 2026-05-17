import { NextResponse } from "next/server";

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
    },
    {
      "id": 2,
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": "B",
      "year": "JEE Main 2021",
      "explanation": "..."
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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "VidyaSaathi",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite",
        max_tokens: 3500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter PYQ error:", err);
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data   = await response.json();
    const raw    = data.choices?.[0]?.message?.content ?? "";
    console.log("PYQ raw response (first 300):", raw.slice(0, 300));

    // Strip markdown fences if any
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    // Extract JSON object robustly
    const start = cleaned.indexOf("{");
    const end   = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON object found in response");

    const jsonStr = cleaned.slice(start, end + 1);
    const parsed  = JSON.parse(jsonStr);

    if (!parsed.pyqQuestions || !Array.isArray(parsed.pyqQuestions)) {
      throw new Error("Invalid response structure — missing pyqQuestions array");
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("PYQ API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

