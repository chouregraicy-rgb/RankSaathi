// src/app/api/trial/activate/route.ts — DISABLED
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ skipped: true, message: "Trial disabled" });
}