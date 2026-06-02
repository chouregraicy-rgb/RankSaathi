// src/app/api/ai/summary/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const OR_URL = "https://openrouter.ai/api/v1/chat/completions";
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return NextResponse.json({ error: "AI service not configured." }, { status: 500 });

  const { chapter, subject } = await request.json();

  const prompt = `You are an expert NEET/JEE tutor with 20 years experience. 
Write a detailed chapter summary for "${chapter}" from ${subject} for NEET UG and JEE Main/Advanced students.
Return ONLY this exact JSON (no markdown, no backticks):
{"keyPoints":["8 specific key points for ${chapter}"],"formulas":["actual formulas with variable definitions"],"examTips":["4 specific exam tips for ${chapter}"],"commonMistakes":["3 specific mistakes in ${chapter} questions"]}`;

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
        max_tokens: 2000,
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
    console.error("Summary API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
