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
          max_tokens: 2000,
          temperature: 0.8,
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
    const { subject, chapter } = await request.json();

    if (!subject || !chapter) {
      return NextResponse.json({ error: "Subject and chapter are required" }, { status: 400 });
    }

    const prompt = `Generate 8 crossword puzzle clues for NEET/JEE students.
Subject: ${subject}
Chapter: ${chapter}

Rules for answers:
- Single words only (no spaces, no hyphens)
- 4 to 12 letters long
- All uppercase
- Must be key terms from the chapter
- Varied lengths for crossword variety

Return ONLY a valid JSON array, no extra text:
[
  {
    "word": "MITOSIS",
    "clue": "Type of cell division that produces two identical daughter cells",
    "length": 7
  },
  {
    "word": "NUCLEUS",
    "clue": "Control center of the cell containing DNA",
    "length": 7
  }
]

Generate exactly 8 items. Ensure all words are single uppercase words with no spaces.`;

    const content = await callOpenRouter(prompt);

    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array in response");

    const words = JSON.parse(cleaned.slice(start, end + 1));

    // Validate and clean words
    const validWords = words
      .filter((w: any) => w.word && w.clue && typeof w.word === "string")
      .map((w: any) => ({
        word: w.word.toUpperCase().replace(/[^A-Z]/g, ""),
        clue: w.clue,
        length: w.word.replace(/[^A-Za-z]/g, "").length,
      }))
      .filter((w: any) => w.word.length >= 4 && w.word.length <= 12);

    if (validWords.length < 4) throw new Error("Not enough valid words generated");

    return NextResponse.json({ words: validWords });
  } catch (error: any) {
    console.error("Crossword error:", error.message);
    return NextResponse.json({ error: "Could not generate crossword. Please try again." }, { status: 500 });
  }
}
