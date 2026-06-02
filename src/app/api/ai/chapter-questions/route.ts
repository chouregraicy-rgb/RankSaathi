// src/app/api/ai/chapter-questions/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const OR_URL = "https://openrouter.ai/api/v1/chat/completions";
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return NextResponse.json({ error: "AI service not configured." }, { status: 500 });

  const { chapter, subject } = await request.json();

  const prompt = `You are an expert NEET/JEE question setter with 20 years experience.
Generate exactly 50 multiple choice questions for the chapter "${chapter}" in ${subject} for NEET/JEE preparation.
Cover ALL subtopics. Mix difficulty: 15 easy, 20 medium, 15 hard.
Return ONLY this exact JSON (no markdown, no backticks):
{"questions":[{"id":1,"question":"full question text","options":{"A":"option A","B":"option B","C":"option C","D":"option D"},"correct":"A","explanation":"detailed 2-3 sentence explanation"}]}`;

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
        model: "google/gemini-2.0-flash-exp:free",
        max_tokens: 8000,
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("{"); const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in response");
    return NextResponse.json(JSON.parse(cleaned.slice(start, end + 1)));
  } catch (error: any) {
    console.error("Chapter questions error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
