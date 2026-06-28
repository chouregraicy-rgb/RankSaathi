// src/app/student/resources/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { Lock, Download, BookOpen, Zap, Star, ChevronRight, Check } from "lucide-react";

declare global { interface Window { Razorpay: any; } }

// ── Google Drive — Single NEET folder (publicly shared) ──────────────────────
const NEET_FOLDER_URL = "https://drive.google.com/drive/folders/1Ruhr6UeoBbAZCozpKlpHsL2zuyCsm7JN";

const PDF_RESOURCES = [
  {
    subject: "Biology",
    color: "#10b981",
    icon: "🧬",
    description: "Class 11 & 12 complete notes, handbook, question bank",
    files: [
      { name: "Biology Class XI — Complete Notes (35MB)",        tag: "Class 11" },
      { name: "Biology Class XII — Complete Notes (19.8MB)",     tag: "Class 12" },
      { name: "Biology Handbook — Quick Reference (2.6MB)",      tag: "Handbook" },
      { name: "NEET Biology — Question Bank",                    tag: "Q-Bank"   },
      { name: "NEET Ultra Quick Revision — Each Chapter 1 Page", tag: "Revision" },
      { name: "NEET Quick Revision — Important Topics & Formula",tag: "Formula"  },
    ],
  },
  {
    subject: "Chemistry",
    color: "#f59e0b",
    icon: "⚗️",
    description: "Class 11 & 12 complete notes with NEET revision material",
    files: [
      { name: "Chemistry Class XI — Complete Notes",             tag: "Class 11" },
      { name: "Chemistry Class XII — Complete Notes",            tag: "Class 12" },
      { name: "NEET Chemistry — Quick Revision",                 tag: "Revision" },
    ],
  },
  {
    subject: "Physics",
    color: "#3b82f6",
    icon: "⚡",
    description: "Class 11 & 12 complete notes with NEET revision material",
    files: [
      { name: "Physics Class XI — Complete Notes",               tag: "Class 11" },
      { name: "Physics Class XII — Complete Notes",              tag: "Class 12" },
      { name: "NEET Physics — Quick Revision",                   tag: "Revision" },
    ],
  },
];

const TOTAL_FILES = PDF_RESOURCES.reduce((acc, s) => acc + s.files.length, 0);

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function ResourcesPage() {
  const router = useRouter();
  const [user, setUser]           = useState<any>(null);
  const [hasPDF, setHasPDF]       = useState(false);
  const [hasApp, setHasApp]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [paying, setPaying]       = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [activeTab, setActiveTab] = useState("Biology");

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/signin"); return; }
      setUser(user);

      // PDFs included with app subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();
      setHasApp(!!sub);
      setHasPDF(!!sub); // PDFs auto-unlocked for all paid users

      setLoading(false);
    }
    init();
  }, []);

  async function handlePurchase(planId: "pdf_only" | "bundle") {
    if (!user) return;
    setPaying(true);
    setError("");

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId, user_id: user.id }),
      });
      const orderData = await res.json();
      if (!res.ok) { setError(orderData.error || "Failed"); setPaying(false); return; }

      const loaded = await loadRazorpay();
      if (!loaded) { setError("Payment gateway failed to load"); setPaying(false); return; }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: "INR",
        name: "VidyaSaathi",
        description: planId === "bundle" ? "App + PDF Bundle" : "NEET PDF Pack",
        order_id: orderData.order_id,
        prefill: { name: user.user_metadata?.full_name || "", email: user.email || "" },
        theme: { color: "#10b981" },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, user_id: user.id, plan_id: planId }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setHasPDF(true);
            if (planId === "bundle") setHasApp(true);
            setSuccess("✅ Purchase successful! All PDFs are now unlocked.");
          } else {
            setError("Payment received but activation failed. Contact support.");
          }
          setPaying(false);
        },
      };
      new window.Razorpay(options).open();
    } catch (err: any) {
      setError(err.message);
      setPaying(false);
    }
  }

  if (loading) return (
    <DashboardLayout role="student" title="Study Resources">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"/>
      </div>
    </DashboardLayout>
  );

  const currentSubject = PDF_RESOURCES.find(s => s.subject === activeTab)!;

  return (
    <DashboardLayout role="student" title="Study Resources">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">📚 NEET Study Resources</h1>
          <p className="text-white/50 text-sm">Complete study material for NEET — Biology, Chemistry & Physics</p>
        </div>

        {/* Status messages */}
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 text-sm font-medium">{success}</div>}

        {/* Unlocked banner */}
        {hasPDF && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-400"/>
            </div>
            <div>
              <p className="text-emerald-400 font-semibold text-sm">PDF Pack Unlocked ✅</p>
              <p className="text-emerald-400/60 text-xs">All {TOTAL_FILES} files available for download</p>
            </div>
          </div>
        )}

        {/* Upgrade prompt — shown only if not subscribed */}
        {!hasPDF && (
          <div className="relative bg-gradient-to-br from-[#111118] to-[#0d1a12] border border-emerald-500/30 rounded-2xl p-6 ring-1 ring-emerald-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Star className="w-3 h-3"/> INCLUDED WITH APP — ₹499 LIFETIME
              </span>
            </div>
            <div className="text-center mt-3 mb-5">
              <p className="text-white font-bold text-lg">Unlock Everything with VidyaSaathi</p>
              <p className="text-white/50 text-sm mt-1">One payment. All PDFs + Full App. Forever.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                "114 NEET PDF files",
                "Biology, Chemistry, Physics",
                "Class 11 + Class 12",
                "Question Banks",
                "Quick Revision Notes",
                "AI Doubt Solver",
                "Mock Tests (NEET + JEE)",
                "Interactive Mind Maps",
                "Performance Analytics",
                "Parent Dashboard",
                "Lifetime Updates",
                "No renewals ever",
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"/>
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <Zap className="w-4 h-4 inline mr-2"/>
              Get Lifetime Access — ₹499
            </button>
            <p className="text-center text-xs text-white/30 mt-2">One-time · No subscription · Instant access</p>
          </div>
        )}

        {/* Subject tabs */}
        <div className="flex gap-2">
          {PDF_RESOURCES.map(s => (
            <button
              key={s.subject}
              onClick={() => setActiveTab(s.subject)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === s.subject
                  ? "text-white"
                  : "bg-white/5 text-white/50 hover:text-white"
              }`}
              style={activeTab === s.subject ? { backgroundColor: s.color + "30", color: s.color, border: `1px solid ${s.color}50` } : {}}
            >
              {s.icon} {s.subject}
            </button>
          ))}
        </div>

        {/* File list */}
        <div className="space-y-3">
          {currentSubject.files.map((file, i) => (
            <div key={i} className="bg-[#111118] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: currentSubject.color + "20" }}>
                  <BookOpen className="w-5 h-5" style={{ color: currentSubject.color }}/>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{file.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block"
                    style={{ backgroundColor: currentSubject.color + "20", color: currentSubject.color }}>
                    {file.tag}
                  </span>
                </div>
              </div>

              {hasPDF ? (
                <a
                  href={NEET_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                  style={{ backgroundColor: currentSubject.color }}
                >
                  <Download className="w-3.5 h-3.5"/>
                  Open in Drive
                </a>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/30 bg-white/5">
                  <Lock className="w-3.5 h-3.5"/>
                  Locked
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {!hasPDF && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 text-center space-y-3">
            <p className="text-white font-semibold">📚 {TOTAL_FILES} files waiting for you</p>
            <p className="text-white/40 text-sm">Get the app at ₹499 and unlock everything instantly</p>
            <button
              onClick={() => router.push("/pricing")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm"
            >
              <Zap className="w-4 h-4"/>
              Get Lifetime Access — ₹499
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
