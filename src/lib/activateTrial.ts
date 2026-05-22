/**
 * activateTrial.ts
 * Call this right after supabase.auth.signUp() succeeds.
 *
 * Example (in your signup page):
 *   const { data, error } = await supabase.auth.signUp({ email, password });
 *   if (data.session) await activateTrial(data.session.access_token);
 */
export async function activateTrial(accessToken: string): Promise<void> {
  try {
    const res = await fetch("/api/trial/activate", {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${accessToken}`,
      },
    });
    const json = await res.json();
    if (!res.ok) console.warn("[activateTrial] Failed:", json.error);
    else if (!json.skipped) console.log("[activateTrial]", json.message);
  } catch (err) {
    // Non-fatal — never block the signup flow
    console.warn("[activateTrial] Network error:", err);
  }
}
