// src/services/aiService.ts
// Reusable AI service using OpenRouter API
// Model: google/gemini-flash-1.5 — fast, cheap, multimodal (handles images)

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const MODEL = "google/gemini-3.1-flash-lite";

interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string | AIContentPart[];
}

interface AIContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
}

// ---- Core request function ----
async function callOpenRouter(
  messages: AIMessage[],
  systemPrompt?: string,
  maxTokens = 1500
): Promise<AIResponse> {
  try {
    const body = {
      model: MODEL,
      max_tokens: maxTokens,
      messages: systemPrompt
        ? [{ role: "system", content: systemPrompt }, ...messages]
        : messages,
    };

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "RankSaathi",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    return { success: true, content };
  } catch (error: any) {
    console.error("[aiService] Error:", error.message);
    return { success: false, content: "", error: error.message };
  }
}

// ---- Doubt Solver ----
export async function solveDoubt(
  questionText: string,
  subject?: string,
  imageBase64?: string // base64 image from student upload
): Promise<{
  stepwise: string;
  simplified: string;
  relatedConcepts: string[];
  similarQuestions: string[];
}> {
  const systemPrompt = `You are RankSaathi's expert AI tutor specialising in NEET UG, JEE Main and JEE Advanced.
When a student asks a question:
1. Solve it step-by-step clearly
2. Give a simplified plain-language explanation
3. List 3-5 related concepts to revise
4. Suggest 2-3 similar question types

Always respond in this exact JSON format (no markdown fences):
{
  "stepwise": "...",
  "simplified": "...",
  "relatedConcepts": ["concept1","concept2","concept3"],
  "similarQuestions": ["question1","question2"]
}`;

  const userContent: AIContentPart[] = [
    { type: "text", text: `Subject: ${subject ?? "General"}\n\nQuestion: ${questionText}` },
  ];

  if (imageBase64) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
    });
  }

  const result = await callOpenRouter(
    [{ role: "user", content: userContent }],
    systemPrompt,
    2000
  );

  if (!result.success) {
    return {
      stepwise: "Sorry, I couldn't solve this right now. Please try again.",
      simplified: result.error ?? "Error occurred",
      relatedConcepts: [],
      similarQuestions: [],
    };
  }

  try {
    // Strip any accidental markdown fences
    const cleaned = result.content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // If JSON parse fails return raw text
    return {
      stepwise: result.content,
      simplified: "",
      relatedConcepts: [],
      similarQuestions: [],
    };
  }
}

// ---- AI Chapter Summary ----
export async function generateChapterSummary(
  chapterName: string,
  subject: string,
  examType: string
): Promise<string> {
  const prompt = `Create a concise revision summary for the chapter "${chapterName}" 
in ${subject} for ${examType} exam preparation.

Include:
- Key concepts (bullet points)
- Important formulas (if applicable)
- Common exam traps / mistakes to avoid
- High-weightage topics

Keep it under 400 words. Use simple language a Class 11/12 student can understand.`;

  const result = await callOpenRouter(
    [{ role: "user", content: prompt }],
    undefined,
    800
  );

  return result.success ? result.content : "Could not generate summary.";
}

// ---- AI Study Recommendations ----
export async function getStudyRecommendations(params: {
  weakChapters: string[];
  recentScores: number[];
  studyHoursToday: number;
  daysUntilExam: number;
  moodState: string;
}): Promise<string> {
  const prompt = `You are a caring study coach for a student preparing for NEET/JEE.

Student stats:
- Weak chapters: ${params.weakChapters.join(", ")}
- Recent test scores (%): ${params.recentScores.join(", ")}
- Study hours today: ${params.studyHoursToday}h
- Days until exam: ${params.daysUntilExam}
- Current mood: ${params.moodState}

Give 3-5 specific, actionable study recommendations for today.
Be encouraging, practical, and concise (max 200 words).`;

  const result = await callOpenRouter(
    [{ role: "user", content: prompt }],
    undefined,
    500
  );

  return result.success
    ? result.content
    : "Focus on your weak chapters and take a practice test today!";
}

// ---- AI Improvement Tips after test ----
export async function getTestImprovementTips(params: {
  score: number;
  maxScore: number;
  weakTopics: string[];
  timeTakenMinutes: number;
  subject: string;
}): Promise<string[]> {
  const prompt = `A student scored ${params.score}/${params.maxScore} in ${params.subject} 
in ${params.timeTakenMinutes} minutes.
Weak topics: ${params.weakTopics.join(", ")}.

Give exactly 4 specific improvement tips as a JSON array of strings. 
No markdown, just the array.`;

  const result = await callOpenRouter(
    [{ role: "user", content: prompt }],
    undefined,
    400
  );

  try {
    const cleaned = result.content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [
      "Review your weak chapters thoroughly",
      "Practice more questions on error-prone topics",
      "Work on time management during tests",
      "Attempt previous year questions for these topics",
    ];
  }
}
