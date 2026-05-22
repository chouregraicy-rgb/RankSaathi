/**
 * POST /api/community/create
 * Creates a new community and adds the creator as admin member.
 * Body: { name, exam, description, userId }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { name, exam, description, userId } = await req.json();
    if (!name || !exam || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique code (retry if collision)
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data } = await supabase.from("communities").select("id").eq("code", code).maybeSingle();
      if (!data) break;
      code = generateCode();
    }

    // Insert community
    const { data: community, error: commErr } = await supabase
      .from("communities")
      .insert({ name, code, exam, description: description || "", created_by: userId })
      .select()
      .single();

    if (commErr || !community) {
      return NextResponse.json({ error: commErr?.message || "Failed to create community" }, { status: 500 });
    }

    // Add creator as admin member
    const { error: memberErr } = await supabase
      .from("community_members")
      .insert({ community_id: community.id, user_id: userId, role: "admin" });

    if (memberErr) {
      // Rollback community if member insert fails
      await supabase.from("communities").delete().eq("id", community.id);
      return NextResponse.json({ error: "Failed to add creator as member" }, { status: 500 });
    }

    return NextResponse.json({ community });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
