import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const FREE_MODELS = [
  "meta-llama/llama-4-scout:free",
  "deepseek/deepseek-r1:free",
  "qwen/qwen3-coder:free",
  "mistralai/mistral-7b-instruct:free",
];

async function callOpenRouter(prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of FREE_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://vidhyasaathi.online",
          "X-Title": "VidyaSaathi",
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
    const { subject, chapter, difficulty = "medium", count = 10, exam = "NEET" } = await request.json();

    if (!subject || !chapter) {
      return NextResponse.json({ error: "Subject and chapter are required" }, { status: 400 });
    }

    const prompt = `Generate ${count} ${difficulty} difficulty MCQ questions for ${exam} exam.
Subject: ${subject}, Chapter: ${chapter}

Return ONLY a valid JSON array, no extra text:
[
  {
    "id": 1,
    "question": "Question text?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct",
    "difficulty": "${difficulty}"
  }
]`;

    const content = await callOpenRouter(prompt);

    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON in response");

    const questions = JSON.parse(cleaned.slice(start, end + 1));
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Chapter questions error:", error.message);
    return NextResponse.json({ error: "Could not generate questions. Please try again." }, { status: 500 });
  }
}
