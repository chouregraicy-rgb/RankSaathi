// src/app/parent/link/page.tsx
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Link2, CheckCircle2, XCircle, Loader2, ArrowRight,
  GraduationCap, Users, ShieldCheck,
} from "lucide-react";
import { cn } from "@/utils";
import { createClient } from "@/lib/supabase/client";

function LinkStudentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefillCode = searchParams.get("code") ?? "";

  const [code, setCode] = useState(prefillCode.toUpperCase());
  const [stage, setStage] = useState<"init" | "input" | "loading" | "success" | "error" | "wrong_role">("init");
  const [errorMsg, setErrorMsg] = useState("");
  const [student, setStudent] = useState<{ name: string; email: string } | null>(null);
  const [parentUserId, setParentUserId] = useState<string | null>(null);

  // ✅ On mount: check auth + role
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in → go to login
        router.replace("/");
        return;
      }

      // ✅ Check role from public.users
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role ?? user.user_metadata?.role ?? "student";

      if (role !== "parent") {
        // Logged in as student — show wrong role message
        setStage("wrong_role");
        return;
      }

      setParentUserId(user.id);
      setStage("input");
    };
    init();
  }, []);

  // Auto-submit if code was prefilled
  useEffect(() => {
    if (prefillCode.length === 8 && parentUserId && stage === "input") {
      handleVerify();
    }
  }, [parentUserId, stage]);

  async function handleVerify() {
    const cleanCode = code.trim().replace(/\s/g, "");
    if (cleanCode.length !== 8) {
      setErrorMsg("Invite code must be exactly 8 characters.");
      setStage("error");
      return;
    }
    if (!parentUserId) {
      setErrorMsg("Not logged in as parent.");
      setStage("error");
      return;
    }
    setStage("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/parent/link-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentUserId, inviteCode: cleanCode }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStage("error");
        return;
      }
      setStudent(data.student);
      setStage("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStage("error");
    }
  }

  function handleCodeInput(val: string) {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    setCode(clean);
    if (stage === "error") {
      setStage("input");
      setErrorMsg("");
    }
  }

  const displayCode = code.length > 4 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;

  // Loading while checking auth
  if (stage === "init") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ✅ Wrong role — logged in as student
  if (stage === "wrong_role") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <XCircle className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold font-display">Wrong Account</h1>
          <p className="text-sm text-muted-foreground">
            You are logged in as a <strong>student</strong>. This page is for parents only.
          </p>
          <p className="text-sm text-muted-foreground">
            Please logout and login with your <strong>parent account</strong>.
          </p>
          <Button
            className="w-full gap-2"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.replace("/");
            }}
          >
            Logout & Switch to Parent Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Link2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display">Link Your Child</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 8-character invite code from your child&apos;s VidyaSaathi settings to start monitoring their progress.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">

            {/* Input */}
            {(stage === "input" || stage === "error") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Student Invite Code
                  </label>
                  <input
                    type="text"
                    value={displayCode}
                    onChange={(e) => handleCodeInput(e.target.value.replace(/\s/g, ""))}
                    placeholder="XXXX XXXX"
                    maxLength={9}
                    className={cn(
                      "w-full text-center font-mono text-2xl font-bold tracking-[0.3em] py-4 px-3",
                      "rounded-xl border bg-muted/40 outline-none transition-all",
                      "focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20",
                      stage === "error" ? "border-red-500 text-red-500" : "border-border"
                    )}
                    autoFocus
                    autoCapitalize="characters"
                    spellCheck={false}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  />
                  {stage === "error" && (
                    <div className="flex items-center gap-1.5 text-xs text-red-500">
                      <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errorMsg}
                    </div>
                  )}
                </div>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleVerify}
                  disabled={code.replace(/\s/g, "").length !== 8}
                >
                  Verify &amp; Link <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Loading */}
            {stage === "loading" && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Verifying invite code…</p>
              </div>
            )}

            {/* Success */}
            {stage === "success" && student && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Linked Successfully!</h3>
                    <p className="text-sm text-muted-foreground mt-1">You are now connected to</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-4 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                </div>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => router.push("/parent/dashboard")}
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {(stage === "input" || stage === "error") && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { icon: GraduationCap, label: "Study Hours" },
                { icon: Users, label: "Test Scores" },
                { icon: ShieldCheck, label: "Location" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-muted/40 rounded-xl p-3 border border-border">
                  <Icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              Code found in child&apos;s app → <strong>Settings → Parent Link</strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ParentLinkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LinkStudentContent />
    </Suspense>
  );
}
