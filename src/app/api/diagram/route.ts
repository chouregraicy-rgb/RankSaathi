// src/app/api/diagram/route.ts
import { NextRequest, NextResponse } from "next/server";
import { findDiagram } from "@/lib/biologyDiagrams";
import { getDiagram } from "@/lib/biologyDiagramsSVG";

export async function POST(req: NextRequest) {
  try {
    const { chapter } = await req.json();
    if (!chapter) {
      return NextResponse.json({ error: "Chapter required" }, { status: 400 });
    }

    // 1. Try Supabase real image first
    const supabaseImg = findDiagram(chapter);
    if (supabaseImg?.imageUrl) {
      return NextResponse.json({
        imageUrl: supabaseImg.imageUrl,
        title: supabaseImg.title,
        description: supabaseImg.description,
        labels: supabaseImg.labels,
        chapter,
        source: "supabase",
      });
    }

    // 2. Try hand-coded SVG
    const handCoded = getDiagram(chapter);
    if (handCoded) {
      return NextResponse.json({
        svg: handCoded.svg,
        neetFacts: handCoded.neetFacts,
        chapter,
        source: "handcoded",
      });
    }

    return NextResponse.json({ error: "No diagram available" }, { status: 404 });
  } catch (err: any) {
    console.error("Diagram error:", err.message);
    return NextResponse.json({ error: "Failed to get diagram" }, { status: 500 });
  }
}
