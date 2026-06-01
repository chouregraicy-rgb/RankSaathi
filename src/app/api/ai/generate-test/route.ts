// src/app/api/ai/generate-test/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const key = process.env.GOOGLE_AI_API_KEY;

  if (!key) {
    console.error("GOOGLE_AI_API_KEY is not set");
    return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
  }

  const GOOGLE_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  const { type, subject, chapter, exam, questionCount } = await request.json();
  console.log("Generate test request:", { type, subject, chapter, exam, questionCount });

  let prompt = "";

  if (type === "chapter") {
    prompt = `You are an expert NEET/JEE question setter. Generate exactly ${questionCount} fresh MCQ questions for "${chapter}" in ${subject}. Cover all subtopics. Mix easy, medium and hard difficulty. Return ONLY this JSON (no markdown, no backticks): {"title":"${chapter} Practice Test","subject":"${subject}","questions":[{"id":1,"question":"question text","options":{"A":"opt A","B":"opt B","C":"opt C","D":"opt D"},"correct":"A","explanation":"2-3 sentence explanation"}]}`;
  } else {
    const subjects = exam === "NEET" ? "Physics, Chemistry, Biology" : "Physics, Chemistry, Mathematics";
    const qPerSubject = Math.floor(questionCount / 3);
    prompt = `You are an expert ${exam} question setter. Generate exactly ${questionCount} MCQ questions for a full ${exam} mock test. ${qPerSubject} questions each for ${subjects}. Match actual ${exam} exam pattern. Return ONLY this JSON (no markdown, no backticks): {"title":"${exam} Full Mock Test","subject":"All","questions":[{"id":1,"subject":"Physics","question":"question text","options":{"A":"opt A","B":"opt B","C":"opt C","D":"opt D"},"correct":"A","explanation":"2-3 sentence explanation"}]}`;
  }

  try {
    const response = await fetch(GOOGLE_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 8000 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Google AI error:", response.status, errText.slice(0, 300));
      throw new Error(`Google AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("Generate test raw (first 200):", content.slice(0, 200));

    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    // Robust JSON extraction
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in response");

    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid response: missing questions array");
    }

    console.log(`Generated ${parsed.questions.length} questions`);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Generate test error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
