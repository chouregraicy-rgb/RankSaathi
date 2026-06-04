import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Groq free models — fast and reliable
const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

async function callGroq(prompt: string): Promise<string> {
  let lastError: Error | null = null;
  for (const model of MODELS) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        lastError = new Error(err?.error?.message || `HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response");
      return content;
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error("All models failed");
}

export async function POST(request: NextRequest) {
  try {
    const { subject, chapter, type, questionCount = 10, exam = "NEET" } = await request.json();
    if (!subject || !chapter) return NextResponse.json({ error: "Subject and chapter required" }, { status: 400 });

    console.log("Generate test:", { type, subject, chapter, exam, questionCount });

    const prompt = `You are an expert ${exam} exam question creator.
Generate ${questionCount} multiple choice questions for:
- Subject: ${subject}
- Chapter: ${chapter}
- Exam: ${exam}

Requirements:
- Each question must have exactly 4 options
- One correct answer per question
- Include a brief explanation
- ${exam} difficulty level

Return ONLY a valid JSON array, no extra text:
[
  {
    "id": 1,
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct",
    "subject": "${subject}",
    "chapter": "${chapter}"
  }
]
correctAnswer is the index (0-3) of the correct option.`;

    const content = await callGroq(prompt);
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array in response");
    const questions = JSON.parse(cleaned.slice(start, end + 1));
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Generate test error:", error.message);
    return NextResponse.json({ error: "Could not generate test. Please try again." }, { status: 500 });
  }
}
