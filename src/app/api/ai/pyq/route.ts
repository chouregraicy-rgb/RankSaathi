// src/app/api/ai/pyq/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const OR_URL = "https://openrouter.ai/api/v1/chat/completions";
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return NextResponse.json({ error: "AI service not configured." }, { status: 500 });

  const { chapter, subject } = await request.json();

  const prompt = `You are an expert NEET/JEE question bank curator with 20 years experience.
Generate 8 previous year exam style questions for "${chapter}" from ${subject} for NEET UG / JEE Main students.
Return ONLY valid JSON — no markdown, no backticks:
{"pyqQuestions":[{"id":1,"question":"Full question text","options":{"A":"first option","B":"second option","C":"third option","D":"fourth option"},"correct":"A","year":"NEET 2022","explanation":"Detailed explanation mentioning concept used."}]}
Rules: all 8 questions specific to "${chapter}" in ${subject}, mix 3 easy/3 medium/2 hard, year from NEET 2017-2024 or JEE Main 2019-2023, correct is A/B/C/D only.`;

  try {
    const response = await fetch(OR_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vidhyasaathi.online",
        "X-Title": "VidyaSaathi",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        max_tokens: 3500,
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("{"); const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in response");
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (!parsed.pyqQuestions || !Array.isArray(parsed.pyqQuestions)) throw new Error("Missing pyqQuestions array");
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("PYQ API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
