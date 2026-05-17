// src/app/api/ai/doubt/route.ts
import { NextResponse } from "next/server";
import { solveDoubt } from "@/services/aiService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, subject, imageBase64 } = body;

    if (!question && !imageBase64) {
      return NextResponse.json({ error: "Question or image required" }, { status: 400 });
    }

    const result = await solveDoubt(question, subject, imageBase64);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[api/ai/doubt]", error);
    return NextResponse.json({ error: "Service error" }, { status: 500 });
  }
}
