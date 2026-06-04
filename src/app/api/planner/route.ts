import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { name, exam, email } = await req.json();
    if (!name || !exam) return NextResponse.json({ error: "Name and exam required" }, { status: 400 });

    const examLabel = exam === "BOTH" ? "NEET & JEE" : exam;

    const prompt = `Create a detailed 12-month ${examLabel} study planner for a student named ${name}.

Return ONLY a valid JSON object:
{
  "studentName": "${name}",
  "exam": "${examLabel}",
  "months": [
    {
      "month": "Month 1 — June 2025",
      "focus": "Foundation & Basics",
      "physics": ["Chapter 1: Physical World", "Chapter 2: Units & Measurements", "Chapter 3: Motion in a Straight Line"],
      "chemistry": ["Chapter 1: Some Basic Concepts", "Chapter 2: Structure of Atom"],
      "biology": ["Chapter 1: The Living World", "Chapter 2: Biological Classification"],
      "targets": ["Complete 2 mock tests", "Revise all chapters weekly", "Solve 50 PYQs"],
      "tip": "Focus on building strong conceptual foundation. Don't skip NCERT."
    }
  ],
  "generalTips": [
    "Study 6-8 hours daily with 1 hour breaks",
    "Solve minimum 100 PYQs every month",
    "Revise each chapter within 48 hours of studying",
    "Take full mock tests every Sunday",
    "Maintain an error notebook for mistakes"
  ],
  "importantBooks": {
    "physics": ["NCERT Physics XI & XII", "HC Verma Concepts of Physics", "DC Pandey"],
    "chemistry": ["NCERT Chemistry XI & XII", "OP Tandon Physical Chemistry", "JD Lee Inorganic"],
    "biology": ["NCERT Biology XI & XII", "Trueman's Biology", "Pradeep Biology"]
  }
}

Generate all 12 months from June 2025 to May 2026. Each month must have specific chapters for all subjects (Physics, Chemistry, Biology${exam === "JEE" ? " and Mathematics" : ""}).
Cover the COMPLETE ${examLabel} syllabus across 12 months progressively.
Return ONLY the JSON, no extra text.`;

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    });

    if (!res.ok) throw new Error("Groq API error");
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in response");

    const planner = JSON.parse(cleaned.slice(start, end + 1));
    return NextResponse.json({ planner });
  } catch (err: any) {
    console.error("Planner error:", err.message);
    return NextResponse.json({ error: "Could not generate planner" }, { status: 500 });
  }
}
