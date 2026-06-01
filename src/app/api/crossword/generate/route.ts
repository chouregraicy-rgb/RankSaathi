// src/app/api/crossword/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

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
  // FIX: build URL inside function so env var is resolved at runtime
  const GOOGLE_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`;

  try {
    const body = await req.json();
    const { subject, chapter, wordCount = 10 } = body;

    // Support both chapter-wise and subject-wise
    const normalizedSubject = (subject || "biology").toLowerCase().trim();
    const topicHints = SUBJECT_TOPICS[normalizedSubject] || SUBJECT_TOPICS["biology"];
    const subjectDisplay =
      normalizedSubject.charAt(0).toUpperCase() + normalizedSubject.slice(1);

    // If chapter provided, use it for more specific puzzle
    const chapterLine = chapter
      ? `Focus specifically on the chapter: "${chapter}". All words must be key terms from this chapter.`
      : `Words should be important ${subjectDisplay} terms covering: ${topicHints}`;

    const contextLabel = chapter ? `${chapter} (${subjectDisplay})` : subjectDisplay;

    const prompt = `You are a NEET/JEE crossword puzzle creator.
Generate exactly ${wordCount} crossword words strictly from ${contextLabel} for NEET/JEE.

${chapterLine}

CRITICAL RULES:
1. ALL words must be from ${contextLabel} ONLY — no words from other subjects
2. Each word: 4-12 uppercase letters only (A-Z, no spaces, no hyphens)
3. Each clue must clearly reference ${contextLabel}

Return ONLY this JSON (no markdown, no backticks):
{"subject":"${subjectDisplay}","chapter":"${chapter || ""}","words":[{"word":"EXAMPLE","clue":"clue specific to ${contextLabel}","topic":"chapter/topic name"}]}`;

    const response = await fetch(GOOGLE_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 3000 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Google AI crossword error:", errText);
      return NextResponse.json(
        { error: "AI service unavailable. Please try again." },
        { status: 502 }
      );
    }

    const aiData = await response.json();
    const rawContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = rawContent.replace(/```json|```/g, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("Crossword JSON parse error:", e);
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

    // Filter wrong-subject words and clean
    const otherSubjectKeywords = getOtherSubjectKeywords(normalizedSubject);
    let filteredWords = parsed.words.filter((w: any) => {
      const clue = (w.clue || "").toLowerCase();
      const topic = (w.topic || "").toLowerCase();
      return !otherSubjectKeywords.some((kw) => clue.includes(kw) || topic.includes(kw));
    });

    if (filteredWords.length < 5) filteredWords = parsed.words;

    filteredWords = filteredWords
      .map((w: any) => ({
        ...w,
        word: (w.word || "").toUpperCase().replace(/[^A-Z]/g, ""),
      }))
      .filter((w: any) => w.word.length >= 4 && w.word.length <= 12);

    return NextResponse.json({
      success: true,
      crossword: { subject: subjectDisplay, chapter: chapter || "", words: filteredWords },
    });
  } catch (error: any) {
    console.error("Crossword generation error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
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
