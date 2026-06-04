import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"];

async function callGroq(prompt: string): Promise<string> {
  let lastError: Error | null = null;
  for (const model of MODELS) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 3000, temperature: 0.5 }),
      });
      if (!res.ok) { const err = await res.json(); lastError = new Error(err?.error?.message); continue; }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response");
      return content;
    } catch (err: any) { lastError = err; continue; }
  }
  throw lastError || new Error("All models failed");
}

export async function POST(request: NextRequest) {
  try {
    const { subject, chapter, year, exam = "NEET", count = 10 } = await request.json();
    if (!subject || !chapter) return NextResponse.json({ error: "Subject and chapter required" }, { status: 400 });

    const yearFilter = year ? `from year ${year}` : "from past 10 years (2014-2024)";
    const prompt = `Generate ${count} Previous Year Question style MCQs ${yearFilter} for ${exam}.
Subject: ${subject}, Chapter: ${chapter}
Style similar to actual ${exam} previous year papers.

Return ONLY a valid JSON array:
[{"id":1,"question":"?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"detailed explanation","year":2023,"exam":"${exam}"}]`;

    const content = await callGroq(prompt);
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("["); const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON");
    const questions = JSON.parse(cleaned.slice(start, end + 1));
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("PYQ error:", error.message);
    return NextResponse.json({ error: "Could not load questions. Please try again." }, { status: 500 });
  }
}
