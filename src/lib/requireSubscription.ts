import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function requireSubscription(userId: string | undefined) {
  if (!userId) return { allowed: false, reason: "unauthenticated" };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .single();

  if (!sub) return { allowed: false, reason: "no_subscription" };

  const now = new Date();
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;

  if (sub.status === "active" && periodEnd && periodEnd > now) {
    return { allowed: true, status: "active" };
  }

  return { allowed: false, reason: "expired" };
}
