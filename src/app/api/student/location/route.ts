// src/app/api/student/location/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { studentId, latitude, longitude, accuracy, locationLabel, batteryLevel, speed } =
    await request.json();

  if (!studentId || !latitude || !longitude) {
    return NextResponse.json({ error: "studentId, latitude, longitude required" }, { status: 400 });
  }

  const { error } = await supabase.from("student_locations").insert({
    student_id:     studentId,
    latitude,
    longitude,
    accuracy:       accuracy ?? null,
    location_label: locationLabel ?? null,
    battery_level:  batteryLevel ?? null,
    speed:          speed ?? null,
    timestamp:      new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json({ error: "studentId is required" }, { status: 400 });
  }

  const { data: locations, error } = await supabase
    .from("student_locations")
    .select("id, student_id, latitude, longitude, accuracy, location_label, timestamp, battery_level, speed")
    .eq("student_id", studentId)
    .order("timestamp", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ locations: locations ?? [] });
}
