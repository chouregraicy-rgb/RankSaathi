import { NextRequest, NextResponse } from "next/server";

// openrouter/free automatically picks whatever free model is available
// Falls back to specific models if the router itself fails
const MODELS = [
  "openrouter/auto",           // auto-router (picks best available)
  "meta-llama/llama-4-scout:free",
  "deepseek/deepseek-r1:free",
  "qwen/qwen3-coder:free",
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
Rules: words must be 4-10 letters UPPERCASE, no spaces, no hyphens. Mix biology, physics, chemistry.`;

    let lastError = "";

    for (const model of MODELS) {
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
            max_tokens: 1200,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        const raw = await response.text();

        if (!response.ok) {
          try {
            lastError = JSON.parse(raw)?.error?.message || `${model} returned ${response.status}`;
          } catch {
            lastError = `${model} returned ${response.status}`;
          }
          console.warn(`[crossword] ${model} failed:`, lastError);
          continue;
        }

        const data = JSON.parse(raw);
        const text = data.choices?.[0]?.message?.content?.trim() || "";

        // Strip markdown fences
        const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

        // Extract JSON array
        const match = stripped.match(/\[[\s\S]*\]/);
        if (!match) {
          lastError = `${model}: No JSON array in response`;
          console.warn(`[crossword] ${lastError}. Preview:`, text.slice(0, 200));
          continue;
        }

        let words: any[];
        try {
          words = JSON.parse(match[0]);
        } catch {
          lastError = `${model}: JSON parse failed`;
          continue;
        }

        // Validate
        const valid = words.filter(
          (w: any) =>
            w.word &&
            typeof w.word === "string" &&
            /^[A-Z]{4,10}$/.test(w.word.trim()) &&
            w.clue &&
            typeof w.clue === "string"
        );

        if (valid.length < 5) {
          lastError = `${model}: Only ${valid.length} valid words`;
          continue;
        }

        console.log(`[crossword] Success with ${model}, ${valid.length} words`);
        return NextResponse.json({ words: valid });

      } catch (err: any) {
        lastError = `${model}: ${err.message}`;
        continue;
      }
    }

    return NextResponse.json(
      { error: `All models failed. Last: ${lastError}` },
      { status: 502 }
    );

  } catch (err: any) {
    console.error("[crossword] Fatal error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
