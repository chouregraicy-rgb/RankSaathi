import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    const topicPrompt = topic ? `Focus on topic: ${topic}.` : "Mix NEET/JEE topics.";
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://vidhyasaathi.online",
        "X-Title": "VidyaSaathi",
      },
      body: JSON.stringify({
        model: "google/gemma-3-12b-it:free",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Generate 15 crossword words for NEET/JEE students. ${topicPrompt}
Return ONLY a JSON array, nothing else, no explanation, no markdown:
[{"word":"MITOSIS","clue":"Cell division producing identical daughter cells","subject":"biology","difficulty":"easy"}]
Important: words must be 4-10 letters UPPERCASE, no spaces, no hyphens. Mix biology, physics, chemistry.`
        }]
      })
    });

    const raw = await response.text();

    // Guard: OpenRouter error (non-2xx)
    if (!response.ok) {
      let errMsg = `OpenRouter error ${response.status}`;
      try { errMsg = JSON.parse(raw)?.error?.message || errMsg; } catch {}
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    const data = JSON.parse(raw);
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    // Strip markdown fences if present (```json ... ```)
    const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    // Extract JSON array via regex
    const match = stripped.match(/\[[\s\S]*\]/);
    if (!match) {
      console.error("[crossword] No JSON array found in response:", text.slice(0, 300));
      return NextResponse.json({ error: "Invalid response format from AI" }, { status: 500 });
    }

    let words: any[];
    try {
      words = JSON.parse(match[0]);
    } catch (parseErr) {
      console.error("[crossword] JSON parse failed:", match[0].slice(0, 300));
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    // Validate & sanitize each word entry
    const valid = words.filter(
      (w) =>
        w.word &&
        typeof w.word === "string" &&
        /^[A-Z]{4,10}$/.test(w.word) &&
        w.clue &&
        typeof w.clue === "string"
    );

    if (valid.length === 0) {
      return NextResponse.json({ error: "No valid words in AI response" }, { status: 500 });
    }

    return NextResponse.json({ words: valid });
  } catch (err: any) {
    console.error("[crossword] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}