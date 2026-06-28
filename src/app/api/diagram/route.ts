// src/app/api/diagram/route.ts
import { NextRequest, NextResponse } from "next/server";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
  "mixtral-8x7b-32768",
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
      max_tokens: 4000,
      temperature: 0.1,
    }),
  });
  if (!res.ok) throw new Error(`Groq ${model} error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function buildPrompt(chapter: string): string {
  return `You are an expert Biology teacher and SVG illustrator creating NCERT-standard educational diagrams for NEET students.

Create a detailed, accurate, LABELED SVG diagram for the Biology chapter: "${chapter}"

STRICT SVG RULES:
1. viewBox must be "0 0 600 500"
2. Use ONLY these SVG elements: rect, circle, ellipse, path, line, polyline, polygon, text, g, defs, linearGradient
3. NO foreignObject, NO JavaScript, NO external images, NO CSS classes
4. All colors as hex or rgb() — NO named colors except black/white
5. Text must be inside <text> tags with explicit x, y, font-size, fill attributes
6. Font: font-family="Arial,sans-serif"
7. Make it look like a real NCERT Biology textbook diagram
8. Include a title at top and labels pointing to all major parts
9. Use arrows (lines with small triangles) to point to labeled parts
10. Background: white (#ffffff)
11. Minimum 8 labeled parts

DIAGRAM REQUIREMENTS for "${chapter}":
- Draw the actual anatomical/biological structure taught in NCERT
- Label ALL important parts that appear in NEET exams
- Use different colors to distinguish different parts/regions
- Add a legend box if needed
- Include a small "NEET Important" note box at bottom with 2-3 key facts

Return ONLY the raw SVG code starting with <svg and ending with </svg>. No explanation, no markdown, no backticks.`;
}

export async function POST(req: NextRequest) {
  try {
    const { chapter } = await req.json();
    if (!chapter) {
      return NextResponse.json({ error: "Chapter required" }, { status: 400 });
    }

    let svg = "";
    let lastError = "";

    // Try each model in fallback chain
    for (const model of GROQ_MODELS) {
      try {
        const content = await callGroq(model, buildPrompt(chapter));
        
        // Extract SVG
        const svgStart = content.indexOf("<svg");
        const svgEnd = content.lastIndexOf("</svg>");
        
        if (svgStart !== -1 && svgEnd !== -1) {
          svg = content.slice(svgStart, svgEnd + 6);
          
          // Basic validation — must have text labels
          const textCount = (svg.match(/<text/g) || []).length;
          if (textCount >= 4) break; // Good enough diagram
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

    // Sanitize SVG — remove any script tags just in case
    svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
    svg = svg.replace(/on\w+="[^"]*"/gi, "");

    return NextResponse.json({ svg, chapter });
  } catch (err: any) {
    console.error("Diagram error:", err.message);
    return NextResponse.json({ error: "Failed to generate diagram" }, { status: 500 });
  }
}
