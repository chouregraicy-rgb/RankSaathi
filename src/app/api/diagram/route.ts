// src/app/api/diagram/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDiagram } from "@/lib/biologyDiagramsSVG";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

async function callGroq(model: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 6000,
      temperature: 0.1,
    }),
  });
  if (!res.ok) throw new Error(`Groq ${model} error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function buildPrompt(chapter: string): string {
  return `You are an expert SVG illustrator creating NCERT Biology diagrams for NEET students.
Create a labeled SVG diagram for: "${chapter}"

SVG RULES:
1. <svg viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
2. Use: rect, circle, ellipse, path, line, polygon, text, g, defs, linearGradient
3. NO foreignObject, NO script, NO CSS classes
4. All colors as hex (#rrggbb)
5. Every text: explicit x, y, font-size, fill, font-family="Arial,sans-serif"
6. Labels OUTSIDE structure with pointer lines
7. NEVER use ** or * in text labels — plain text only
8. Title at top, NEET facts box at bottom (yellow #fffde7)
9. Minimum 8 labeled parts

Return ONLY the SVG. No markdown, no backticks.`;
}

export async function POST(req: NextRequest) {
  try {
    const { chapter } = await req.json();
    if (!chapter) {
      return NextResponse.json({ error: "Chapter required" }, { status: 400 });
    }

    // 1. Try hand-coded diagram first (best quality)
    const handCoded = getDiagram(chapter);
    if (handCoded) {
      return NextResponse.json({
        svg: handCoded.svg,
        chapter,
        neetFacts: handCoded.neetFacts,
        source: "handcoded",
      });
    }

    // 2. Fall back to AI generation
    let svg = "";
    let lastError = "";

    for (const model of GROQ_MODELS) {
      try {
        const content = await callGroq(model, buildPrompt(chapter));
        const svgStart = content.indexOf("<svg");
        const svgEnd = content.lastIndexOf("</svg>");
        if (svgStart !== -1 && svgEnd !== -1) {
          svg = content.slice(svgStart, svgEnd + 6);
          const textCount = (svg.match(/<text/g) || []).length;
          if (textCount >= 6) break;
        }
      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    if (!svg) {
      return NextResponse.json(
        { error: lastError || "Could not generate diagram" },
        { status: 500 }
      );
    }

    // Strip markdown
    svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
    svg = svg.replace(/on\w+="[^"]*"/gi, "");
    svg = svg.replace(/\*\*([^*]+)\*\*/g, "$1");
    svg = svg.replace(/\*([^*]+)\*/g, "$1");

    return NextResponse.json({ svg, chapter, source: "ai" });
  } catch (err: any) {
    console.error("Diagram error:", err.message);
    return NextResponse.json({ error: "Failed to generate diagram" }, { status: 500 });
  }
}
