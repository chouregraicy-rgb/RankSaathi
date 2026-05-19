import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    const topicPrompt = topic
      ? `Focus on topic: ${topic}.`
      : "Mix NEET/JEE topics across all chapters.";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://vidhyasaathi.online",
        "X-Title": "VidyaSaathi",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        messages: [{
          role: "user",
          content: `Generate exactly 18 crossword words for NEET/JEE students. ${topicPrompt}
Mix Biology, Physics, Chemistry. Mix Easy/Medium/Hard difficulty.
Return ONLY valid JSON array, no markdown, no explanation:
[{"word":"MITOSIS","clue":"Cell division producing identical daughter cells","subject":"biology","difficulty":"easy"},...]
Rules:
- Words 4-12 letters UPPERCASE no spaces or hyphens
- Clues max 60 chars exam-relevant
- 6 biology 6 physics 6 chemistry words
- 6 easy 6 medium 6 hard
- All different words`
        }]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const words = JSON.parse(clean);
    return NextResponse.json({ words });
  } catch (err) {
    console.error("Crossword generation error:", err);
    return NextResponse.json({ error: "Failed to generate crossword" }, { status: 500 });
  }
}