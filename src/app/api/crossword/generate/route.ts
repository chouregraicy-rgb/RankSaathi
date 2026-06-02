// src/app/api/crossword/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

const SUBJECT_TOPICS: Record<string, string> = {
  biology: "cell biology, genetics, evolution, ecology, human physiology, plant physiology, reproduction, biotechnology, microorganisms, biomolecules",
  physics: "mechanics, thermodynamics, electrostatics, magnetism, optics, modern physics, waves, gravitation, semiconductor, current electricity",
  chemistry: "organic chemistry, periodic table, chemical bonding, electrochemistry, coordination compounds, polymers, equilibrium, kinetics, solutions",
  mathematics: "calculus, algebra, trigonometry, coordinate geometry, vectors, probability, matrices, differential equations, integration, limits",
};

export async function POST(req: NextRequest) {
  const OR_URL = "https://openrouter.ai/api/v1/chat/completions";
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.error("OPENROUTER_API_KEY is not set");
    return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { subject = "biology", chapter, wordCount = 12 } = body;
    const normalizedSubject = subject.toLowerCase().trim();
    const subjectDisplay = normalizedSubject.charAt(0).toUpperCase() + normalizedSubject.slice(1);
    const topicHints = SUBJECT_TOPICS[normalizedSubject] || SUBJECT_TOPICS["biology"];
    const chapterLine = chapter
      ? `Focus specifically on the NEET/JEE chapter: "${chapter}". Every word must be a key term from this chapter.`
      : `Words should be important ${subjectDisplay} terms covering: ${topicHints}`;

    const prompt = `You are a NEET/JEE crossword puzzle creator. Generate exactly ${wordCount} crossword words for ${chapter ? `"${chapter}"` : subjectDisplay}.\n\n${chapterLine}\n\nRULES:\n1. Words from ${chapter || subjectDisplay} ONLY\n2. Each word: 4-12 uppercase A-Z letters only\n3. Clues must reference ${chapter || subjectDisplay}\n\nReturn ONLY raw JSON:\n{"subject":"${subjectDisplay}","words":[{"word":"EXAMPLE","clue":"clue here","topic":"topic name"}]}`;

    const response = await fetch(OR_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vidhyasaathi.online",
        "X-Title": "VidyaSaathi",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        max_tokens: 3000,
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter crossword error:", response.status, errText.slice(0, 300));
      return NextResponse.json({ error: "AI service unavailable. Please try again." }, { status: 502 });
    }

    const aiData = await response.json();
    const rawContent = aiData.choices?.[0]?.message?.content ?? "";
    const cleaned = rawContent.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return NextResponse.json({ error: "Failed to parse crossword." }, { status: 500 });

    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (!parsed.words || !Array.isArray(parsed.words)) return NextResponse.json({ error: "Invalid crossword data." }, { status: 500 });

    const otherKeywords = getOtherSubjectKeywords(normalizedSubject);
    let words = parsed.words.filter((w: any) => {
      const clue = (w.clue || "").toLowerCase();
      const topic = (w.topic || "").toLowerCase();
      return !otherKeywords.some((kw) => clue.includes(kw) || topic.includes(kw));
    });
    if (words.length < 5) words = parsed.words;
    words = words
      .map((w: any) => ({ ...w, word: (w.word || "").toUpperCase().replace(/[^A-Z]/g, "") }))
      .filter((w: any) => w.word.length >= 4 && w.word.length <= 12);

    return NextResponse.json({ success: true, crossword: { subject: subjectDisplay, chapter: chapter || "", words } });
  } catch (error: any) {
    console.error("Crossword error:", error.message);
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
