// src/lib/auth/logout.ts
// Call this from any component to log out
import { createClient } from "@/lib/supabase/client";

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = "/";
}
