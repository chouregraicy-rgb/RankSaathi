// src/app/auth/page.tsx
export const dynamic = "force-dynamic";

// Redirect to home — auth is handled on the landing page
import { redirect } from "next/navigation";

export default function AuthPage() {
  redirect("/");
}