// src/app/api/mindmap/route.ts
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { subject, chapter } = await req.json();
    if (!subject || !chapter) {
      return NextResponse.json({ error: "Subject and chapter required" }, { status: 400 });
    }

    const isBiology = subject === "Biology";
    const isPhysics = subject === "Physics";
    const isMaths = subject === "Mathematics";
    const color = isBiology ? "#10b981" : isPhysics ? "#3b82f6" : subject === "Chemistry" ? "#f59e0b" : "#8b5cf6";

    const prompt = `You are an expert NEET/JEE tutor. Create a detailed mind map for the ${subject} chapter: "${chapter}".

CRITICAL RULES:
1. Mnemonics MUST be 100% specific to "${chapter}" — NOT generic biology/science mnemonics. Create original mnemonics that help remember key facts ONLY from this specific chapter.
2. Generate EXACTLY 4 main concept nodes (not more, not less) to keep the mind map compact.
3. Each concept node should have EXACTLY 2-3 sub-topics (not more).
4. Node labels must be SHORT (max 3 words).
5. Return ONLY valid JSON, no extra text.

Return this exact JSON structure:
{
  "chapter": "${chapter}",
  "subject": "${subject}",
  "color": "${color}",
  "nodes": {
    "id": "root",
    "label": "${chapter.length > 20 ? chapter.substring(0, 18) + "..." : chapter}",
    "type": "root",
    "children": [
      {
        "id": "n1",
        "label": "Short Concept Name",
        "type": "concept",
        "formula": ${isPhysics || isMaths ? '"actual formula from this chapter"' : "null"},
        "note": "one line explanation",
        "children": [
          {"id": "n1_1", "label": "Sub-topic", "type": "subtopic", "formula": null, "note": "detail", "children": []},
          {"id": "n1_2", "label": "Sub-topic 2", "type": "subtopic", "formula": null, "note": "detail", "children": []}
        ]
      }
    ]
  }${isBiology ? `,
  "diagram": {
    "title": "Key Diagram: ${chapter}",
    "description": "Labeled cross-section or anatomical diagram specific to ${chapter} as taught in NCERT Biology",
    "labels": ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6"]
  }` : ""},
  "keyFormulas": ${isPhysics || isMaths ? `[
    {"label": "Formula 1 name", "formula": "actual formula from ${chapter}", "unit": "SI unit"},
    {"label": "Formula 2 name", "formula": "actual formula", "unit": "unit"},
    {"label": "Formula 3 name", "formula": "actual formula", "unit": "unit"}
  ]` : "[]"},
  "mnemonics": [
    "CHAPTER-SPECIFIC mnemonic 1 for remembering key topics/parts of ${chapter} ONLY",
    "CHAPTER-SPECIFIC mnemonic 2 for a specific list or sequence in ${chapter} ONLY",
    "CHAPTER-SPECIFIC mnemonic 3 for a key fact or classification in ${chapter} ONLY"
  ],
  "neetWeightage": "${isBiology ? "High" : "Medium"}",
  "importantTopics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
}

For Biology diagrams, use real anatomical part names from NCERT for "${chapter}".
For mnemonics, they MUST help remember something SPECIFIC to "${chapter}" — e.g. if chapter is "Anatomy of Flowering Plants", mnemonics should be about tissue layers, not about kingdoms.`;

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
        temperature: 0.2,
      }),
    });

    if (!res.ok) throw new Error("Groq API error");
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in response");

    const mindmap = JSON.parse(cleaned.slice(start, end + 1));
    return NextResponse.json({ mindmap });
  } catch (err: any) {
    console.error("Mindmap error:", err.message);
    return NextResponse.json({ error: "Could not generate mind map" }, { status: 500 });
  }
}