import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // service role — bypasses RLS
);

export async function POST(req: Request) {
  try {
    const { name, email, phone, source } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic phone validation
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const { error } = await supabase.from("leads").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: `+91${cleanPhone}`,
      source: source || "unknown",
      created_at: new Date().toISOString(),
    });

    if (error) {
      // Duplicate email — still return success (don't reveal if email exists)
      if (error.code === "23505") {
        return NextResponse.json({ success: true });
      }
      console.error("Lead insert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Optional: trigger Brevo email with PDF link here
    // await sendLeadEmail(name, email);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

