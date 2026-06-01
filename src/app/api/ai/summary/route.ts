// src/app/api/ai/summary/route.ts
import { NextResponse } from "next/server";

const GOOGLE_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`;

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
    const response = await fetch(GOOGLE_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 2000 },
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = content.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error: any) {
    console.error("Summary API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
