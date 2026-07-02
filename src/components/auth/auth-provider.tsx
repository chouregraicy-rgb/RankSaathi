// src/components/auth/auth-provider.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { pixelLead } from "@/components/MetaPixel";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, reset } = useAuthStore();
  const supabase = createClient();
  const router = useRouter();

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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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

        // Handle post-auth redirect on SIGNED_IN event
        if (event === "SIGNED_IN") {
          // Fire Meta Pixel Lead event on every new signup/login
          // (helps Meta's algorithm find more people likely to sign up)
          try { pixelLead(u.email); } catch {}

          try {
            const redirect = sessionStorage.getItem("vs_post_auth");
            if (redirect) {
              sessionStorage.removeItem("vs_post_auth");
              router.push(redirect);
              return;
            }
          } catch {}
          // Default redirect based on role
          const role = (u.user_metadata?.role as string) ?? "student";
          if (role === "parent") {
            router.push("/parent/dashboard");
          } else {
            router.push("/student/dashboard");
          }
        }
      } else {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
