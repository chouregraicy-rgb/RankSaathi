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

    const prompt = `Create a detailed mind map for the ${subject} chapter: "${chapter}" for NEET/JEE preparation.

Return ONLY valid JSON in this exact structure:
{
  "chapter": "${chapter}",
  "subject": "${subject}",
  "color": "${isBiology ? "#10b981" : isPhysics ? "#3b82f6" : subject === "Chemistry" ? "#f59e0b" : "#8b5cf6"}",
  "nodes": {
    "id": "root",
    "label": "${chapter}",
    "type": "root",
    "children": [
      {
        "id": "n1",
        "label": "Key Concept 1",
        "type": "concept",
        "formula": ${isPhysics || isMaths ? '"F = ma (if applicable)"' : "null"},
        "note": "Brief explanation",
        "children": [
          {
            "id": "n1_1",
            "label": "Sub-topic",
            "type": "subtopic",
            "formula": null,
            "note": "Detail",
            "children": []
          }
        ]
      }
    ]
  }${isBiology ? `,
  "diagram": {
    "title": "Key Diagram for ${chapter}",
    "description": "Describe what the SVG diagram should show",
    "labels": ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"]
  }` : ""},
  "keyFormulas": ${isPhysics || isMaths ? `[
    {"label": "Formula name", "formula": "LaTeX formula string", "unit": "unit if applicable"},
    {"label": "Formula name 2", "formula": "LaTeX formula string 2", "unit": "unit"}
  ]` : "[]"},
  "mnemonics": ["Mnemonic 1 for remembering key points", "Mnemonic 2"],
  "neetWeightage": "High/Medium/Low",
  "importantTopics": ["Topic 1", "Topic 2", "Topic 3"]
}

Rules:
- Generate 4-6 main concept nodes, each with 2-4 sub-topics
- For Physics/Maths: include actual formulas in LaTeX notation (e.g. "F = ma", "v^2 = u^2 + 2as")
- For Biology: include diagram description with 4-6 labeled parts
- For Chemistry: include reaction equations as plain text
- mnemonics should be catchy and memorable
- Return ONLY the JSON, no extra text`;

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

    const mindmap = JSON.parse(cleaned.slice(start, end + 1));
    return NextResponse.json({ mindmap });
  } catch (err: any) {
    console.error("Mindmap error:", err.message);
    return NextResponse.json({ error: "Could not generate mind map" }, { status: 500 });
  }
}
