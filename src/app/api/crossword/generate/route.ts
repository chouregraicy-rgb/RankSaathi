// src/app/api/crossword/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

const SUBJECT_TOPICS: Record<string, string> = {
  biology: "cell biology, genetics, evolution, ecology, human physiology, plant physiology, reproduction, biotechnology, microorganisms, biomolecules",
  physics: "mechanics, thermodynamics, electrostatics, magnetism, optics, modern physics, waves, gravitation, semiconductor, current electricity",
  chemistry: "organic chemistry, periodic table, chemical bonding, electrochemistry, coordination compounds, polymers, equilibrium, kinetics, solutions",
  mathematics: "calculus, algebra, trigonometry, coordinate geometry, vectors, probability, matrices, differential equations, integration, limits",
};

export async function POST(req: NextRequest) {
  const key = process.env.GOOGLE_AI_API_KEY;

  if (!key) {
    console.error("GOOGLE_AI_API_KEY is not set");
    return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
  }

  const GOOGLE_AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  try {
    const body = await req.json();
    const { subject = "biology", chapter, wordCount = 12 } = body;

    const normalizedSubject = subject.toLowerCase().trim();
    const subjectDisplay = normalizedSubject.charAt(0).toUpperCase() + normalizedSubject.slice(1);
    const topicHints = SUBJECT_TOPICS[normalizedSubject] || SUBJECT_TOPICS["biology"];
    const chapterLine = chapter
      ? `Focus specifically on the NEET/JEE chapter: "${chapter}". Every word must be a key term from this chapter.`
      : `Words should be important ${subjectDisplay} terms covering: ${topicHints}`;

    const prompt = `You are a NEET/JEE crossword puzzle creator.
Generate exactly ${wordCount} crossword words for ${chapter ? `"${chapter}"` : subjectDisplay}.

${chapterLine}

RULES:
1. Words must be from ${chapter || subjectDisplay} ONLY
2. Each word: 4-12 uppercase letters, A-Z only (no spaces, hyphens, numbers)
3. Each clue must reference ${chapter || subjectDisplay} clearly

Return ONLY raw JSON, no markdown, no backticks:
{"subject":"${subjectDisplay}","words":[{"word":"EXAMPLE","clue":"clue here","topic":"topic name"}]}`;

    console.log(`Generating crossword for: ${chapter || subjectDisplay}`);

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
      console.error("Google AI error:", response.status, errText.slice(0, 300));
      return NextResponse.json({ error: "AI service unavailable. Please try again." }, { status: 502 });
    }

    const aiData = await response.json();
    const rawContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("Crossword raw (first 200):", rawContent.slice(0, 200));

    const cleaned = rawContent.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    // Extract JSON robustly
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) {
      console.error("No JSON found in response:", cleaned.slice(0, 200));
      return NextResponse.json({ error: "Failed to parse crossword. Please try again." }, { status: 500 });
    }

    const parsed = JSON.parse(cleaned.slice(start, end + 1));

    if (!parsed.words || !Array.isArray(parsed.words)) {
      return NextResponse.json({ error: "Invalid crossword data. Please try again." }, { status: 500 });
    }

    // Filter wrong-subject words
    const otherKeywords = getOtherSubjectKeywords(normalizedSubject);
    let words = parsed.words.filter((w: any) => {
      const clue = (w.clue || "").toLowerCase();
      const topic = (w.topic || "").toLowerCase();
      return !otherKeywords.some((kw) => clue.includes(kw) || topic.includes(kw));
    });
    if (words.length < 5) words = parsed.words;

    // Clean words
    words = words
      .map((w: any) => ({ ...w, word: (w.word || "").toUpperCase().replace(/[^A-Z]/g, "") }))
      .filter((w: any) => w.word.length >= 4 && w.word.length <= 12);

    console.log(`Crossword generated: ${words.length} words`);

    return NextResponse.json({
      success: true,
      crossword: { subject: subjectDisplay, chapter: chapter || "", words },
    });
  } catch (error: any) {
    console.error("Crossword generation error:", error.message);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}

function getOtherSubjectKeywords(subject: string): string[] {
  const all: Record<string, string[]> = {
    biology: ["force", "velocity", "newton", "ohm", "watt", "joule", "coulomb", "derivative", "integral", "matrix", "orbital", "valence", "molarity"],
    physics: ["cell", "dna", "rna", "gene", "enzyme", "photosynthesis", "mitosis", "meiosis", "molarity", "derivative", "integral"],
    chemistry: ["force", "velocity", "newton", "cell", "dna", "mitosis", "derivative", "integral"],
    mathematics: ["cell", "dna", "rna", "force", "velocity", "newton", "molarity", "enzyme"],
  };
  return all[subject] || [];
}
