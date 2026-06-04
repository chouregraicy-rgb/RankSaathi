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
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 2000, temperature: 0.6 }),
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
    const { subject, chapter, exam = "NEET" } = await request.json();
    if (!subject || !chapter) return NextResponse.json({ error: "Subject and chapter required" }, { status: 400 });

    const prompt = `Create a concise study summary for ${exam} students.
Subject: ${subject}, Chapter: ${chapter}

Return ONLY a valid JSON object:
{
  "title": "${chapter}",
  "subject": "${subject}",
  "keyPoints": ["point 1", "point 2"],
  "concepts": [{"name": "concept", "explanation": "clear explanation", "example": "example"}],
  "formulas": [{"name": "formula name", "formula": "the formula", "use": "when to use"}],
  "quickRevision": "2-3 sentence summary for last-minute revision",
  "examTips": ["tip 1 for ${exam}", "tip 2"]
}
Include formulas only if relevant. Keep language simple for students.`;

    const content = await callGroq(prompt);
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("{"); const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON");
    const summary = JSON.parse(cleaned.slice(start, end + 1));
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Summary error:", error.message);
    return NextResponse.json({ error: "Could not generate summary. Please try again." }, { status: 500 });
  }
}
