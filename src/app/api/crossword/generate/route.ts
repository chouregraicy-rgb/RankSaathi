import { NextRequest, NextResponse } from "next/server";

// Free models to try in order (fallback chain)
const FREE_MODELS = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-2-9b-it:free",
];

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    const topicPrompt = topic ? `Focus on topic: ${topic}.` : "Mix NEET/JEE topics.";
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

    const prompt = `Generate 15 crossword words for NEET/JEE students. ${topicPrompt}
Return ONLY a JSON array, nothing else, no explanation, no markdown:
[{"word":"MITOSIS","clue":"Cell division producing identical daughter cells","subject":"biology","difficulty":"easy"}]
Important: words must be 4-10 letters UPPERCASE, no spaces, no hyphens. Mix biology, physics, chemistry.`;

    // Try each model until one works
    let lastError = "";
    for (const model of FREE_MODELS) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://vidhyasaathi.online",
            "X-Title": "VidyaSaathi",
          },
          body: JSON.stringify({
            model,
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        const raw = await response.text();

        if (!response.ok) {
          const err = JSON.parse(raw)?.error?.message || `Model ${model} failed`;
          lastError = err;
          console.warn(`[crossword] Model ${model} failed:`, err);
          continue; // try next model
        }

        const data = JSON.parse(raw);
        const text = data.choices?.[0]?.message?.content?.trim() || "";

        // Strip markdown fences
        const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

        // Extract JSON array
        const match = stripped.match(/\[[\s\S]*\]/);
        if (!match) {
          lastError = "No JSON array in response";
          continue;
        }

        const words = JSON.parse(match[0]);

        // Validate entries
        const valid = words.filter(
          (w: any) =>
            w.word &&
            typeof w.word === "string" &&
            /^[A-Z]{4,10}$/.test(w.word) &&
            w.clue &&
            typeof w.clue === "string"
        );

        if (valid.length < 5) {
          lastError = "Too few valid words returned";
          continue;
        }

        return NextResponse.json({ words: valid });
      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    // All models failed
    return NextResponse.json({ error: `All models failed. Last error: ${lastError}` }, { status: 502 });
  } catch (err: any) {
    console.error("[crossword] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
