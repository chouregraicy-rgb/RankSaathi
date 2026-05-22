"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export type Subscription = {
  plan_id:    string;
  plan_name:  string;
  status:     string;
  started_at: string;
  expires_at: string;
  amount:     number;
} | null;

export function useSubscription() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [subscription, setSubscription] = useState<Subscription>(null);
  const [isTrial, setIsTrial]     = useState(false);
  const [loading, setLoading]     = useState(true);

  const refetch = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { setSubscription(null); return; }

      const res  = await fetch("/api/subscription/status", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache:   "no-store",
      });
      const json = await res.json();
      setSubscription(json.subscription ?? null);
      setIsTrial(json.isTrial ?? false);
    } catch { setSubscription(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { refetch(); }, []);

  const isPaid   = !!subscription && subscription.plan_id !== "trial";
  const isActive = !!subscription;
  const daysLeft = subscription
    ? Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / 86_400_000)
    : 0;

  return { subscription, isTrial, isPaid, isActive, daysLeft, loading, refetch };
}