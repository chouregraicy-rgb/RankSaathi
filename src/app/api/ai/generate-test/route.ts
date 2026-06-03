import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Free model fallback chain — if first fails, tries next
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
        console.error(`OpenRouter model ${model} failed:`, err);
        lastError = new Error(err?.error?.message || `HTTP ${res.status}`);
        continue; // try next model
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response from model");
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
    const body = await request.json();
    const { subject, chapter, type, questionCount = 10, exam = "NEET" } = body;

    console.log("Generate test:", { type, subject, chapter, exam, questionCount });

    if (!subject || !chapter) {
      return NextResponse.json({ error: "Subject and chapter are required" }, { status: 400 });
    }

    const prompt = `You are an expert ${exam} exam question creator.

Generate ${questionCount} multiple choice questions for:
- Subject: ${subject}
- Chapter: ${chapter}
- Exam: ${exam}
- Type: ${type || "chapter"}

Requirements:
- Each question must have exactly 4 options (A, B, C, D)
- One correct answer per question
- Include a brief explanation for the correct answer
- Questions should be at ${exam} difficulty level
- Focus on conceptual understanding and application

Return ONLY a valid JSON array in this exact format, no extra text:
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct",
    "subject": "${subject}",
    "chapter": "${chapter}"
  }
]

correctAnswer is the index (0-3) of the correct option.`;

    const content = await callOpenRouter(prompt);

    // Parse JSON from response
    const cleaned = content
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array in response");

    const questions = JSON.parse(cleaned.slice(start, end + 1));
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Generate test error:", error.message);
    return NextResponse.json(
      { error: "Could not generate test. Please try again." },
      { status: 500 }
    );
  }
}
