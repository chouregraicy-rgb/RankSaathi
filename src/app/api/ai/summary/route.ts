import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"];

async function callGroq(prompt: string): Promise<string> {
  let lastError: Error | null = null;
  for (const model of MODELS) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2500,
          temperature: 0.5,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        lastError = new Error(err?.error?.message || `HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response");
      return content;
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error("All models failed");
}

export async function POST(request: NextRequest) {
  try {
    const { subject, chapter, exam = "NEET" } = await request.json();
    if (!subject || !chapter) {
      return NextResponse.json({ error: "Subject and chapter are required" }, { status: 400 });
    }

    const prompt = `You are an expert ${exam} teacher creating a last-minute revision guide for students.

Create a DETAILED revision summary for:
Subject: ${subject}
Chapter: ${chapter}
Exam: ${exam}

Return ONLY a valid JSON object with NO extra text or markdown:
{
  "keyPoints": [
    "Write at least 8-10 important points students MUST remember for this chapter",
    "Each point should be a complete, exam-ready fact or concept",
    "Include definitions, laws, principles, and important statements",
    "Make each point specific and directly useful for ${exam} exam"
  ],
  "formulas": [
    {
      "name": "Formula/Law name",
      "formula": "The actual formula or equation",
      "use": "When and how to apply this formula in ${exam}"
    }
  ],
  "examTips": [
    "Write 5-7 specific exam tips for this chapter in ${exam}",
    "Include which topics are most frequently asked",
    "Include common question patterns and tricks",
    "Include what to focus on for last-minute revision"
  ],
  "commonMistakes": [
    "Write 5-7 common mistakes students make in ${exam} for this chapter",
    "Include sign errors, unit mistakes, conceptual confusions",
    "Include tricky areas where students lose marks",
    "Be very specific to this chapter"
  ],
  "quickRevision": "Write a 3-4 sentence summary of the entire chapter covering the most important concepts for last-minute reading before the exam"
}

IMPORTANT RULES:
- keyPoints must have AT LEAST 8 complete, detailed points
- formulas must have AT LEAST 3-5 relevant formulas (if chapter has formulas); if no formulas exist write key equations or relationships
- examTips must have AT LEAST 5 specific tips
- commonMistakes must have AT LEAST 5 specific mistakes
- All content must be specific to ${chapter} in ${subject}, not generic
- Return ONLY the JSON object, no other text`;

    const content = await callGroq(prompt);

    // Parse JSON
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in response");

    const summary = JSON.parse(cleaned.slice(start, end + 1));

    // Normalize formulas to string array for display
    const formulasNormalized = (summary.formulas || []).map((f: any) => {
      if (typeof f === "string") return f;
      return `${f.name}: ${f.formula}${f.use ? ` — ${f.use}` : ""}`;
    });

    return NextResponse.json({
      summary: {
        keyPoints:       summary.keyPoints       || [],
        formulas:        formulasNormalized,
        examTips:        summary.examTips        || [],
        commonMistakes:  summary.commonMistakes  || [],
        quickRevision:   summary.quickRevision   || "",
      }
    });
  } catch (error: any) {
    console.error("Summary error:", error.message);
    return NextResponse.json(
      { error: "Could not generate summary. Please try again." },
      { status: 500 }
    );
  }
}
