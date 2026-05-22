/**
 * POST /api/community/join
 * Joins a community by invite code. Returns community data.
 * Body: { code, userId }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { code, userId } = await req.json();
    if (!code || !userId) {
      return NextResponse.json({ error: "Missing code or userId" }, { status: 400 });
    }

    // Find community by code
    const { data: community, error: findErr } = await supabase
      .from("communities")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .maybeSingle();

    if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 });
    if (!community) return NextResponse.json({ error: "Invalid code. No community found." }, { status: 404 });

    // Check if already a member
    const { data: existing } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", community.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "You are already a member of this community!" }, { status: 409 });
    }

    // Add as member
    const { error: memberErr } = await supabase
      .from("community_members")
      .insert({ community_id: community.id, user_id: userId, role: "member" });

    if (memberErr) return NextResponse.json({ error: memberErr.message }, { status: 500 });

    return NextResponse.json({ community });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
