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
          content: `Generate exactly 18 crossword words for NEET/JEE students. ${topicPrompt}
Mix Biology, Physics, Chemistry. Mix Easy/Medium/Hard difficulty.
Return ONLY valid JSON array, no markdown:
[{"word":"MITOSIS","clue":"Cell division producing identical daughter cells","subject":"biology","difficulty":"easy"}]
Rules: words 4-12 letters UPPERCASE, clues max 60 chars, 6 each subject, 6 each difficulty, all different.`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: "OpenRouter failed", details: err }, { status: 500 });
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const words = JSON.parse(clean);
    return NextResponse.json({ words });
  } catch (err: any) {
    console.error("Crossword error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}