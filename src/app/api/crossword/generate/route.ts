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
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 2000, temperature: 0.8 }),
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
    const { subject, chapter } = await request.json();
    if (!subject || !chapter) return NextResponse.json({ error: "Subject and chapter required" }, { status: 400 });

    const prompt = `Generate 8 crossword puzzle clues for NEET/JEE students.
Subject: ${subject}, Chapter: ${chapter}

Rules:
- Single words only (no spaces, no hyphens)
- 4 to 12 letters long
- All uppercase
- Key terms from the chapter
- Varied lengths

Return ONLY a valid JSON array, no extra text:
[
  {"word": "MITOSIS", "clue": "Type of cell division producing two identical daughter cells", "length": 7},
  {"word": "NUCLEUS", "clue": "Control center of the cell containing DNA", "length": 7}
]

Generate exactly 8 items. All words must be single uppercase words with no spaces.`;

    const content = await callGroq(prompt);
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("["); const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array in response");

    const words = JSON.parse(cleaned.slice(start, end + 1));
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
