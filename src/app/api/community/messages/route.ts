/**
 * GET  /api/community/messages?communityId=xxx  — fetch last 100 messages
 * POST /api/community/messages                  — send a message
 *      Body: { communityId, senderId, text, type }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Safely extract full_name whether Supabase returns object or array
function extractName(users: any): string {
  if (!users) return "Unknown";
  if (Array.isArray(users)) return users[0]?.full_name || "Unknown";
  return users.full_name || "Unknown";
}

export async function GET(req: NextRequest) {
  try {
    const communityId = req.nextUrl.searchParams.get("communityId");
    if (!communityId) return NextResponse.json({ error: "Missing communityId" }, { status: 400 });

    const { data, error } = await supabase
      .from("community_messages")
      .select("id, text, type, created_at, sender_id, users:sender_id(full_name)")
      .eq("community_id", communityId)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Normalize the users field before returning
    const messages = (data ?? []).map((m: any) => ({
      ...m,
      users: { full_name: extractName(m.users) },
    }));

    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { communityId, senderId, text, type = "text" } = await req.json();
    if (!communityId || !senderId || !text?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("community_messages")
      .insert({ community_id: communityId, sender_id: senderId, text: text.trim(), type })
      .select("id, text, type, created_at, sender_id, users:sender_id(full_name)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Normalize
    const message = {
      ...data,
      users: { full_name: extractName((data as any).users) },
    };

    return NextResponse.json({ message });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
