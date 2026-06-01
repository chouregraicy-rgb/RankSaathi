// src/app/api/debug-ai/route.ts
// TEMPORARY — delete after confirming AI works
import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GOOGLE_AI_API_KEY;
  
  if (!key) {
    return NextResponse.json({ error: "GOOGLE_AI_API_KEY is missing", env: Object.keys(process.env).filter(k => k.includes("GOOGLE") || k.includes("AI") || k.includes("OPEN")) });
  }

  // Test the actual Google AI call
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say "OK" and nothing else.' }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });

    const raw = await res.text();
    
    if (!res.ok) {
      return NextResponse.json({ 
        error: "Google AI API call failed",
        status: res.status,
        response: raw.slice(0, 500),
        keyPrefix: key.slice(0, 10) + "..."
      });
    }

    const data = JSON.parse(raw);
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return NextResponse.json({ 
      success: true, 
      response: content,
      keyPrefix: key.slice(0, 10) + "..."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
