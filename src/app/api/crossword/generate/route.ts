// src/app/api/generate-crossword/route.ts
import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Subject-specific term banks as fallback/seed
const SUBJECT_TOPICS: Record<string, string> = {
  biology:
    "cell biology, genetics, evolution, ecology, human physiology, plant physiology, reproduction, biotechnology, microorganisms, biomolecules",
  physics:
    "mechanics, thermodynamics, electrostatics, magnetism, optics, modern physics, waves, gravitation, semiconductor, current electricity",
  chemistry:
    "organic chemistry, periodic table, chemical bonding, electrochemistry, coordination compounds, polymers, biomolecules, equilibrium, kinetics, solutions",
  mathematics:
    "calculus, algebra, trigonometry, coordinate geometry, vectors, probability, matrices, differential equations, integration, limits",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject = "biology", wordCount = 10 } = body;

    const normalizedSubject = subject.toLowerCase().trim();

    const topicHints =
      SUBJECT_TOPICS[normalizedSubject] ||
      SUBJECT_TOPICS["biology"];

    const subjectDisplay =
      normalizedSubject.charAt(0).toUpperCase() +
      normalizedSubject.slice(1);

    const systemPrompt = `You are a NEET/JEE crossword puzzle creator. Generate ONLY valid JSON with no markdown or code fences. Every single word and clue MUST be strictly from ${subjectDisplay} only.`;

    const userPrompt = `Create a crossword puzzle with exactly ${wordCount} words, ALL strictly from ${subjectDisplay} for NEET/JEE.

CRITICAL RULES:
1. ALL words and clues must be from ${subjectDisplay} ONLY
2. Do NOT include any words or clues from Physics, Chemistry, Biology, or Mathematics other than ${subjectDisplay}
3. Words should be important ${subjectDisplay} terms: ${topicHints}
4. Each word: 4–12 characters, uppercase, only A-Z letters (no spaces, hyphens)
5. Clue must clearly indicate it is a ${subjectDisplay} concept

Return ONLY this JSON (no markdown, no backticks):
{
  "subject": "${subjectDisplay}",
  "words": [
    {
      "word": "EXAMPLE",
      "clue": "${subjectDisplay} clue: definition or hint",
      "topic": "specific ${subjectDisplay} chapter/topic"
    }
  ]
}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://vidhyasaathi.online",
          "X-Title": "VidyaSaathi",
        },
        body: JSON.stringify({
          model: "google/gemini-flash-1.5",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3, // lower temp = more deterministic subject adherence
          max_tokens: 3000,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter crossword error:", errText);
      return NextResponse.json(
        { error: "AI service unavailable. Please try again." },
        { status: 502 }
      );
    }

    const aiData = await response.json();
    const rawContent =
      aiData?.choices?.[0]?.message?.content || "";

    // Strip markdown fences
    const cleaned = rawContent
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("Crossword JSON parse error:", e);
      console.error("Raw:", rawContent.slice(0, 500));
      return NextResponse.json(
        { error: "Failed to generate crossword. Please try again." },
        { status: 500 }
      );
    }

    if (!parsed.words || !Array.isArray(parsed.words)) {
      return NextResponse.json(
        { error: "Invalid crossword data. Please try again." },
        { status: 500 }
      );
    }

    // Post-process: filter out any words that snuck in from wrong subjects
    const subjectKeywords = getSubjectKeywords(normalizedSubject);
    const otherSubjectKeywords = getOtherSubjectKeywords(normalizedSubject);

    let filteredWords = parsed.words.filter((w: any) => {
      const clue = (w.clue || "").toLowerCase();
      const topic = (w.topic || "").toLowerCase();
      // Reject if clue/topic contains strong signals of wrong subject
      return !otherSubjectKeywords.some(
        (kw) => clue.includes(kw) || topic.includes(kw)
      );
    });

    // If too many filtered out, just use what we have
    if (filteredWords.length < 5) {
      filteredWords = parsed.words;
    }

    // Clean words: uppercase, letters only
    filteredWords = filteredWords.map((w: any) => ({
      ...w,
      word: (w.word || "").toUpperCase().replace(/[^A-Z]/g, ""),
    })).filter((w: any) => w.word.length >= 4);

    return NextResponse.json({
      success: true,
      crossword: {
        subject: subjectDisplay,
        words: filteredWords,
      },
    });
  } catch (error: any) {
    console.error("Crossword generation error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}

function getSubjectKeywords(subject: string): string[] {
  const map: Record<string, string[]> = {
    biology: ["cell", "gene", "dna", "rna", "enzyme", "tissue", "organ", "species", "ecology", "photosynthesis", "mitosis", "meiosis"],
    physics: ["force", "velocity", "acceleration", "momentum", "wave", "optics", "current", "voltage", "resistance", "quantum"],
    chemistry: ["atom", "molecule", "bond", "reaction", "acid", "base", "salt", "orbital", "polymer", "catalyst"],
    mathematics: ["derivative", "integral", "matrix", "vector", "probability", "trigonometry", "calculus", "algebra"],
  };
  return map[subject] || [];
}

function getOtherSubjectKeywords(subject: string): string[] {
  const all: Record<string, string[]> = {
    biology: ["force", "velocity", "newton", "ohm", "watt", "joule", "coulomb", "derivative", "integral", "matrix", "orbital", "valence", "molarity"],
    physics: ["cell", "dna", "rna", "gene", "enzyme", "photosynthesis", "mitosis", "meiosis", "molarity", "derivative", "integral"],
    chemistry: ["force", "velocity", "newton", "cell", "dna", "mitosis", "derivative", "integral", "matrix"],
    mathematics: ["cell", "dna", "rna", "force", "velocity", "newton", "molarity", "enzyme"],
  };
  return all[subject] || [];
}
