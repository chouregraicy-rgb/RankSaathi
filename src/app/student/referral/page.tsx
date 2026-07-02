"use client";
// src/app/student/referral/page.tsx

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/client";
import { Gift, Copy, Check, Share2, IndianRupee, Users, Clock } from "lucide-react";

interface Referral {
  id:               string;
  referee_user_id:  string;
  status:           string;
  reward_amount:    number;
  discount_given:   number;
  created_at:       string;
  paid_at:          string | null;
}

export default function ReferralPage() {
  const [inviteCode, setInviteCode]   = useState<string | null>(null);
  const [referrals, setReferrals]     = useState<Referral[]>([]);
  const [copied, setCopied]           = useState(false);
  const [loading, setLoading]         = useState(true);
  const [userId, setUserId]           = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Fetch invite code
      const res = await fetch(`/api/student/invite-code?userId=${user.id}`);
      const data = await res.json();
      setInviteCode(data.invite_code ?? null);

      // Fetch referrals
      const { data: refs } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", user.id)
        .order("created_at", { ascending: false });
      setReferrals(refs ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const shareUrl  = `https://vidhyasaathi.online/?ref=${inviteCode}`;
  const shareText = `🎯 I'm using VidyaSaathi for NEET/JEE prep — AI doubt solver, mock tests & 114 FREE PDFs!\n\nUse my code *${inviteCode}* and get ₹50 off:\n${shareUrl}`;

  const totalEarned  = referrals.filter(r => r.status === "paid").reduce((s, r) => s + r.reward_amount, 0);
  const totalPending = referrals.filter(r => r.status === "pending_payout").reduce((s, r) => s + r.reward_amount, 0);

  async function copyCode() {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  }

  if (loading) {
    return (
      <DashboardLayout role="student" title="Refer & Earn">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="Refer & Earn">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Hero card */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Refer & Earn ₹50</h2>
              <p className="text-orange-100 text-sm">Your friend gets ₹50 off too</p>
            </div>
          </div>
          <p className="text-sm text-orange-100 mb-5">
            Share your code with classmates. Every time a friend pays using your code,
            you earn ₹50 directly to your UPI — and they pay only ₹449 instead of ₹499.
          </p>

          {/* Invite code display */}
          <div className="bg-white/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-100 mb-1">Your Referral Code</p>
              <p className="font-mono font-bold text-2xl tracking-widest">{inviteCode ?? "Loading..."}</p>
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 bg-white text-orange-500 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-orange-50 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share on WhatsApp
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(shareText)}
            className="flex items-center justify-center gap-2 border border-border bg-card hover:bg-accent font-semibold py-3 rounded-xl transition-all"
          >
            <Copy className="w-4 h-4" />
            Copy Message
          </button>
        </div>

        {/* Earnings summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="font-bold text-2xl">{referrals.length}</p>
            <p className="text-xs text-muted-foreground">Total Referrals</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <IndianRupee className="w-5 h-5 mx-auto mb-2 text-green-500" />
            <p className="font-bold text-2xl text-green-500">₹{totalEarned}</p>
            <p className="text-xs text-muted-foreground">Paid Out</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-orange-500" />
            <p className="font-bold text-2xl text-orange-500">₹{totalPending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-semibold">How it works</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <p>Share your code with a friend who wants to crack NEET/JEE</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <p>They enter your code at checkout and pay ₹449 instead of ₹499</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <p>You receive ₹50 directly to your UPI within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Referral history */}
        {referrals.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold">Referral History</h3>
            </div>
            <div className="divide-y divide-border">
              {referrals.map((ref, i) => (
                <div key={ref.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Friend #{i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ref.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{ref.reward_amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ref.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : ref.status === "pending_payout"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {ref.status === "paid" ? "Paid" : ref.status === "pending_payout" ? "Pending" : ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {referrals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No referrals yet — share your code with your batch!
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
