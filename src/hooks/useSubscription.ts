"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [info, setInfo] = useState<SubscriptionInfo>({ subscribed: false, status: "loading" });

  const fetchStatus = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/razorpay/subscription-status?user_id=${(session.user as any).id}`);
      const data = await res.json();
      setInfo({ ...data, status: data.status || "none" });
    } catch {
      setInfo({ subscribed: false, status: "none" });
    }
  }, [session?.user?.id]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  return { ...info, refresh: fetchStatus };
}
