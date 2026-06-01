// src/components/auth/auth-provider.tsx
"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, reset } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id:         u.id,
          email:      u.email ?? "",
          role:       (u.user_metadata?.role as any) ?? "student",
          full_name:  u.user_metadata?.full_name ?? "",
          avatar_url: u.user_metadata?.avatar_url ?? null,
          phone:      u.phone ?? null,
          created_at: u.created_at,
        });
      } else {
        reset();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const role = (u.user_metadata?.role as any) ?? "student";
        setUser({
          id:         u.id,
          email:      u.email ?? "",
          role,
          full_name:  u.user_metadata?.full_name ?? "",
          avatar_url: u.user_metadata?.avatar_url ?? null,
          phone:      u.phone ?? null,
          created_at: u.created_at,
        });
        // Redirect to dashboard after login
        if (_event === "SIGNED_IN") {
          window.location.href = `/${role}/dashboard`;
        }
      } else {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
