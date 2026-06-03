"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type SubscriptionStatus = "none" | "active" | "expired" | "loading";

export interface SubscriptionInfo {
  subscribed: boolean;
  status: SubscriptionStatus;
  plan_id?: string;
  plan_type?: string;
  days_left?: number;
  current_period_end?: string;
}

export function useSubscription() {
  const [userId, setUserId] = useState<string | null>(null);
  const [info, setInfo] = useState<SubscriptionInfo>({ subscribed: false, status: "loading" });

  // Get current user from Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const fetchStatus = useCallback(async () => {
    if (!userId) {
      setInfo({ subscribed: false, status: "none" });
      return;
    }
    try {
      const res = await fetch(`/api/razorpay/subscription-status?user_id=${userId}`);
      const data = await res.json();
      setInfo({ ...data, status: data.status || "none" });
    } catch {
      setInfo({ subscribed: false, status: "none" });
    }
  }, [userId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { ...info, refresh: fetchStatus };
}
