// src/app/api/student/location/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST — save a new location ping
export async function POST(request: Request) {
  const { studentId, latitude, longitude, accuracy, locationLabel } = await request.json();
  if (!studentId || !latitude || !longitude) {
    return NextResponse.json({ error: "studentId, latitude, longitude required" }, { status: 400 });
  }

  const { error } = await supabase.from("student_locations").insert({
    student_id:     studentId,
    latitude,
    longitude,
    accuracy:       accuracy ?? null,
    location_label: locationLabel ?? null,
    timestamp:      new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// GET — fetch today's locations for a student
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("student_locations")
    .select("*")
    .eq("student_id", studentId)
    .gte("timestamp", todayStart.toISOString())
    .order("timestamp", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ locations: data ?? [] });
}