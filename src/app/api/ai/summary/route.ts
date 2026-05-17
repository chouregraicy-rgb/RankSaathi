import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { chapter, subject } = await request.json();

  const prompt = `You are an expert NEET/JEE tutor with 20 years experience. 
Write a detailed chapter summary for "${chapter}" from ${subject} for NEET UG and JEE Main/Advanced students.

Return ONLY this exact JSON format with NO markdown, NO backticks:
{
  "keyPoints": [
    "write 8 detailed, specific key points about ${chapter} that a student must know for the exam",
    "each point should be a complete fact, concept or principle - not a generic instruction",
    "include specific values, definitions, laws, theorems relevant to this chapter"
  ],
  "formulas": [
    "write the actual formulas used in ${chapter} with variable definitions",
    "example: F = ma, where F is force in Newtons, m is mass in kg, a is acceleration in m/s²"
  ],
  "examTips": [
    "write 4 specific exam tips for ${chapter} based on actual NEET/JEE question patterns",
    "mention common question types from this chapter"
  ],
  "commonMistakes": [
    "write 3 specific mistakes students make in ${chapter} questions",
    "be specific to this chapter, not generic advice"
  ]
}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "VidyaSaathi",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter error:", err);
      throw new Error(err);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    console.log("Summary response:", content.slice(0, 200));
    
    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Summary API error:", error.message);
    // Return error info so we can debug
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
