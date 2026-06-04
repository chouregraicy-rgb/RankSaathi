// src/components/auth/auth-provider.tsx
"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, reset } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
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

    // Listen for auth changes — only update store, NO redirect here
    // Redirects are handled by the login page itself
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
