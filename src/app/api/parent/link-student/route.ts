// src/app/api/parent/link-student/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { parentUserId, inviteCode } = await request.json();

  if (!parentUserId || !inviteCode) {
    return NextResponse.json({ error: "parentUserId and inviteCode are required" }, { status: 400 });
  }

  const code = inviteCode.trim().toUpperCase();

  // 1. Find student with this invite code
  const { data: student, error: studentErr } = await supabase
    .from("students")
    .select("id, user_id, invite_code")
    .eq("invite_code", code)
    .single();

  if (studentErr || !student) {
    return NextResponse.json({ error: "Invalid invite code. Please check and try again." }, { status: 404 });
  }

  // 2. Prevent self-linking
  if (student.user_id === parentUserId) {
    return NextResponse.json({ error: "You cannot link to your own account." }, { status: 400 });
  }

  // 3. Get student name for confirmation
  const { data: studentUser } = await supabase
    .from("users")
    .select("full_name, email")
    .eq("id", student.user_id)
    .single();

  // 4. Check if already linked to this student
  const { data: existingParent } = await supabase
    .from("parents")
    .select("id, student_id")
    .eq("user_id", parentUserId)
    .single();

  if (existingParent?.student_id === student.id) {
    return NextResponse.json({
      error: "You are already linked to this student.",
      alreadyLinked: true,
    }, { status: 400 });
  }

  // ✅ 5. Auto-create parent in public.users if not exists (prevents foreign key error)
  const { data: authParent } = await supabase.auth.admin.getUserById(parentUserId);
  if (authParent?.user) {
    await supabase.from("users").upsert({
      id: parentUserId,
      email: authParent.user.email,
      full_name: authParent.user.user_metadata?.full_name ||
                 authParent.user.user_metadata?.name ||
                 authParent.user.email?.split("@")[0] || "Parent",
      role: "parent",
    }, { onConflict: "id" });
  }

  // 6. Upsert parent record with student link
  const { error: linkErr } = await supabase
    .from("parents")
    .upsert({
      user_id: parentUserId,
      student_id: student.id,
      invite_code_used: code,
    }, { onConflict: "user_id" });

  if (linkErr) {
    return NextResponse.json({ error: linkErr.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    student: {
      id: student.id,
      name: studentUser?.full_name || "Student",
      email: studentUser?.email || "",
    },
  });
}