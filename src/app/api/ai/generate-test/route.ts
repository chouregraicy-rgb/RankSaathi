// src/app/api/ai/generate-test/route.ts
import { NextResponse } from "next/server";

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GOOGLE_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;

export async function POST(request: Request) {
  const { type, subject, chapter, exam, questionCount } = await request.json();

  let prompt = "";

  if (type === "chapter") {
    prompt = `You are an expert NEET/JEE question setter. Generate exactly ${questionCount} fresh MCQ questions for "${chapter}" in ${subject}. Cover all subtopics. Mix easy, medium and hard difficulty. Return ONLY this JSON (no markdown, no backticks): {"title":"${chapter} Practice Test","subject":"${subject}","questions":[{"id":1,"question":"question text","options":{"A":"opt A","B":"opt B","C":"opt C","D":"opt D"},"correct":"A","explanation":"2-3 sentence explanation"}]}`;
  } else {
    const subjects =
      exam === "NEET"
        ? "Physics, Chemistry, Biology"
        : "Physics, Chemistry, Mathematics";
    const qPerSubject = Math.floor(questionCount / 3);
    prompt = `You are an expert ${exam} question setter. Generate exactly ${questionCount} MCQ questions for a full ${exam} mock test. ${qPerSubject} questions each for ${subjects}. Match actual ${exam} exam pattern. Return ONLY this JSON (no markdown, no backticks): {"title":"${exam} Full Mock Test","subject":"All","questions":[{"id":1,"subject":"Physics","question":"question text","options":{"A":"opt A","B":"opt B","C":"opt C","D":"opt D"},"correct":"A","explanation":"2-3 sentence explanation"}]}`;
  }

  try {
    const response = await fetch(GOOGLE_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8000,
        },
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = content.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error: any) {
    console.error("Generate test error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
