import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const { data, error } = await supabase
    .from("students")
    .select("invite_code")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    const code = generateCode();
    const { data: inserted, error: insertErr } = await supabase
      .from("students")
      .insert({ user_id: userId, invite_code: code })
      .select("invite_code")
      .single();
    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
    return NextResponse.json({ invite_code: inserted.invite_code });
  }

  return NextResponse.json({ invite_code: data.invite_code });
}

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  let code = "";
  let attempts = 0;
  while (attempts < 10) {
    const candidate = generateCode();
    const { data } = await supabase
      .from("students")
      .select("id")
      .eq("invite_code", candidate)
      .maybeSingle();
    if (!data) { code = candidate; break; }
    attempts++;
  }
  if (!code) return NextResponse.json({ error: "Could not generate unique code" }, { status: 500 });

  const { error } = await supabase
    .from("students")
    .update({ invite_code: code })
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invite_code: code });
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}