// src/app/student/community/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, Plus, LogIn, Copy, CheckCircle2, BookOpen,
  MessageCircle, Target, Clock, Crown, Send,
  Hash, Flame, Trophy, ChevronRight, X, Loader2,
} from "lucide-react";
import { cn } from "@/utils";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface DbMessage {
  id: string;
  text: string;
  type: "text" | "doubt" | "achievement";
  created_at: string;
  sender_id: string;
  users: { full_name: string } | { full_name: string }[] | null;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  time: string;
  type: "text" | "doubt" | "achievement";
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "member";
  online: boolean;
}

interface Community {
  id: string;
  name: string;
  code: string;
  exam: string;
  description: string;
  target_date: string | null;
  created_by: string;
  created_at: string;
  members: Member[];
  messages: Message[];
}

// ── HELPERS ─────────────────────────────────────────────────────────────────
function avatarChar(name: string): string {
  return (name || "?")[0].toUpperCase();
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function daysUntilExam(dateStr: string | null): number {
  if (!dateStr) return 0;
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000));
}

function dbMessageToMessage(m: DbMessage): Message {
  const rawUsers = m.users;
  const name = Array.isArray(rawUsers)
    ? (rawUsers[0]?.full_name || "Unknown")
    : (rawUsers?.full_name || "Unknown");
  return {
    id:           m.id,
    senderId:     m.sender_id,
    senderName:   name,
    senderAvatar: avatarChar(name),
    text:         m.text,
    time:         formatTime(m.created_at),
    type:         m.type,
  };
}

// ── COMPONENT ───────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Current user
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; avatar: string } | null>(null);

  // Communities list
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  // Active community / chat
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [activeTab, setActiveTab]             = useState("chat");
  const [messages, setMessages]               = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createExam, setCreateExam] = useState("NEET");
  const [createDesc, setCreateDesc] = useState("");
  const [creating, setCreating]     = useState(false);
  const [newCode, setNewCode]       = useState("");

  // Join form
  const [showJoin, setShowJoin]   = useState(false);
  const [joinCode, setJoinCode]   = useState("");
  const [joining, setJoining]     = useState(false);
  const [joinError, setJoinError] = useState("");

  // Send message
  const [message, setMessage]       = useState("");
  const [sending, setSending]       = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [msgType, setMsgType]       = useState<"text" | "doubt" | "achievement">("text");

  // ── Load current user ──────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      // Fetch full_name from public.users
      supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          const name = data?.full_name || user.email?.split("@")[0] || "You";
          setCurrentUser({ id: user.id, name, avatar: avatarChar(name) });
        });
    });
  }, []);

  // ── Load my communities ────────────────────────────────────────────────────
  const loadCommunities = useCallback(async () => {
    if (!currentUser) return;
    setLoadingCommunities(true);
    try {
      // Communities the user is a member of
      const { data: memberRows } = await supabase
        .from("community_members")
        .select("community_id, role")
        .eq("user_id", currentUser.id);

      if (!memberRows?.length) { setMyCommunities([]); return; }

      const ids = memberRows.map((r) => r.community_id);
      const roleMap: Record<string, string> = {};
      memberRows.forEach((r) => { roleMap[r.community_id] = r.role; });

      // Fetch community details
      const { data: comms } = await supabase
        .from("communities")
        .select("*")
        .in("id", ids)
        .order("created_at", { ascending: false });

      if (!comms) return;

      // Fetch members for each community
      const communityList: Community[] = await Promise.all(
        comms.map(async (c) => {
          const { data: members } = await supabase
            .from("community_members")
            .select("user_id, role, users:user_id(full_name)")
            .eq("community_id", c.id);

          const memberList: Member[] = (members || []).map((m: any) => {
            const rawUsers = m.users;
  const name = Array.isArray(rawUsers)
    ? (rawUsers[0]?.full_name || "Unknown")
    : (rawUsers?.full_name || "Unknown");
            return {
              id:     m.user_id,
              name,
              avatar: avatarChar(name),
              role:   m.role,
              online: false,   // realtime presence can be added later
            };
          });

          // Fetch last message for preview
          const { data: lastMsgs } = await supabase
            .from("community_messages")
            .select("id, text, type, created_at, sender_id, users:sender_id(full_name)")
            .eq("community_id", c.id)
            .order("created_at", { ascending: false })
            .limit(1);

          const lastMsg = lastMsgs?.[0] ? [dbMessageToMessage(lastMsgs[0])] : [];

          return { ...c, members: memberList, messages: lastMsg };
        })
      );

      setMyCommunities(communityList);
    } finally {
      setLoadingCommunities(false);
    }
  }, [currentUser]);

  useEffect(() => { loadCommunities(); }, [loadCommunities]);

  // ── Load messages when entering a community ────────────────────────────────
  const loadMessages = useCallback(async (communityId: string) => {
    setLoadingMessages(true);
    const res = await fetch(`/api/community/messages?communityId=${communityId}`);
    const json = await res.json();
    setMessages((json.messages || []).map(dbMessageToMessage));
    setLoadingMessages(false);
  }, []);

  useEffect(() => {
    if (!activeCommunity) return;
    loadMessages(activeCommunity.id);

    // Realtime subscription for new messages
    const channel = supabase
      .channel(`community_${activeCommunity.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages", filter: `community_id=eq.${activeCommunity.id}` },
        async (payload) => {
          // Fetch sender name
          const { data: userData } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", payload.new.sender_id)
            .maybeSingle();
          const name = userData?.full_name || "Unknown";
          const newMsg: Message = {
            id:           payload.new.id,
            senderId:     payload.new.sender_id,
            senderName:   name,
            senderAvatar: avatarChar(name),
            text:         payload.new.text,
            time:         formatTime(payload.new.created_at),
            type:         payload.new.type,
          };
          // Only add if not from current user (current user's msg added optimistically)
          if (payload.new.sender_id !== currentUser?.id) {
            setMessages((prev) => {
              if (prev.find((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeCommunity?.id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Create community ───────────────────────────────────────────────────────
  async function handleCreate() {
    if (!createName.trim() || !currentUser) return;
    setCreating(true);
    try {
      const res  = await fetch("/api/community/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: createName, exam: createExam, description: createDesc, userId: currentUser.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setNewCode(json.community.code);
      setShowCreate(false);
      setCreateName(""); setCreateDesc("");
      await loadCommunities();

      // Open the new community
      const newComm: Community = {
        ...json.community,
        members:  [{ id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: "admin", online: true }],
        messages: [],
      };
      setActiveCommunity(newComm);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }

  // ── Join community ─────────────────────────────────────────────────────────
  async function handleJoin() {
    if (!joinCode.trim() || !currentUser) return;
    setJoining(true); setJoinError("");
    try {
      const res  = await fetch("/api/community/join", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code: joinCode, userId: currentUser.id }),
      });
      const json = await res.json();
      if (!res.ok) { setJoinError(json.error); return; }

      setShowJoin(false); setJoinCode("");
      await loadCommunities();

      const joinedComm: Community = {
        ...json.community,
        members:  [],
        messages: [],
      };
      setActiveCommunity(joinedComm);
    } catch (err: any) {
      setJoinError(err.message);
    } finally {
      setJoining(false);
    }
  }

  // ── Send message ───────────────────────────────────────────────────────────
  async function handleSendMessage() {
    if (!message.trim() || !activeCommunity || !currentUser || sending) return;
    setSending(true);

    // Optimistic update
    const optimisticMsg: Message = {
      id:           `opt_${Date.now()}`,
      senderId:     currentUser.id,
      senderName:   currentUser.name,
      senderAvatar: currentUser.avatar,
      text:         message.trim(),
      time:         new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      type:         msgType,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    const sentText = message.trim();
    setMessage("");
    setMsgType("text");

    try {
      const res  = await fetch("/api/community/messages", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          communityId: activeCommunity.id,
          senderId:    currentUser.id,
          text:        sentText,
          type:        msgType,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      // Replace optimistic msg with real DB id
      setMessages((prev) =>
        prev.map((m) => m.id === optimisticMsg.id ? dbMessageToMessage(json.message) : m)
      );
    } catch {
      // Remove optimistic msg on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  // ── COMMUNITY DETAIL VIEW ──────────────────────────────────────────────────
  if (activeCommunity) {
    const community = myCommunities.find((c) => c.id === activeCommunity.id) ?? activeCommunity;

    return (
      <DashboardLayout role="student" title={community.name}>
        <div className="max-w-4xl mx-auto space-y-4">

          {/* Header */}
          <div className="flex items-center gap-3">
            <button onClick={() => { setActiveCommunity(null); setMessages([]); }} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-lg">{community.name}</h2>
                <Badge variant="outline" className="text-xs">{community.exam}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {community.members.length} members
                {community.target_date ? ` · ${daysUntilExam(community.target_date)} days to exam` : ""}
              </p>
            </div>
            <button
              onClick={() => copyCode(community.code)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border hover:bg-accent transition-colors"
            >
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm font-bold tracking-wider">{community.code}</span>
              {codeCopied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="members">Members ({community.members.length})</TabsTrigger>
            </TabsList>

            {/* ── CHAT ── */}
            <TabsContent value="chat" className="mt-3">
              <div className="bg-card rounded-xl border overflow-hidden flex flex-col" style={{ height: "50vh" }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <MessageCircle className="h-10 w-10 mb-2 opacity-30" />
                      <p className="text-sm">No messages yet. Say hello! 👋</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === currentUser?.id;
                      return (
                        <div key={msg.id} className={cn("flex gap-2.5", isMe && "flex-row-reverse")}>
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white",
                            isMe ? "bg-primary" : "bg-gradient-to-br from-purple-500 to-brand-500"
                          )}>
                            {msg.senderAvatar}
                          </div>
                          <div className={cn("max-w-[70%] space-y-1", isMe && "items-end flex flex-col")}>
                            {!isMe && <p className="text-xs text-muted-foreground font-medium">{msg.senderName}</p>}
                            <div className={cn(
                              "px-3 py-2 rounded-2xl text-sm",
                              isMe
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : msg.type === "doubt"
                                ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-tl-sm"
                                : msg.type === "achievement"
                                ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-tl-sm"
                                : "bg-muted rounded-tl-sm"
                            )}>
                              {msg.type === "doubt" && !isMe && (
                                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" /> Doubt
                                </p>
                              )}
                              {msg.type === "achievement" && !isMe && (
                                <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                                  <Trophy className="h-3 w-3" /> Achievement
                                </p>
                              )}
                              <p className="leading-relaxed">{msg.text}</p>
                            </div>
                            <p className={cn("text-[10px] text-muted-foreground", isMe && "text-right")}>{msg.time}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message type selector + input */}
                <div className="border-t border-border p-3 space-y-2">
                  <div className="flex gap-1.5">
                    {(["text", "doubt", "achievement"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setMsgType(t)}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium border transition-all",
                          msgType === t
                            ? t === "doubt"       ? "bg-amber-100 border-amber-400 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : t === "achievement" ? "bg-green-100 border-green-400 text-green-700 dark:bg-green-950 dark:text-green-300"
                              : "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {t === "doubt" ? "🤔 Doubt" : t === "achievement" ? "🏆 Achievement" : "💬 Message"}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        msgType === "doubt"       ? "Ask your doubt..."
                        : msgType === "achievement" ? "Share your achievement..."
                        : "Type a message..."
                      }
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={!message.trim() || sending}>
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── MEMBERS ── */}
            <TabsContent value="members" className="mt-3">
              <div className="space-y-2">
                {community.members.map((member) => (
                  <div key={member.id} className="bg-card rounded-xl border p-3 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center text-white font-bold text-sm">
                        {member.avatar}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{member.name}</p>
                        {member.role === "admin" && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                        {member.id === currentUser?.id && <Badge variant="outline" className="text-xs">You</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    );
  }

  // ── MAIN LIST VIEW ─────────────────────────────────────────────────────────
  return (
    <DashboardLayout role="student" title="Study Community">
      <div className="max-w-4xl space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg">Study Communities</h2>
            <p className="text-sm text-muted-foreground">Study together, grow together</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setShowJoin(true)}>
            <LogIn className="h-4 w-4" /> Join with Code
          </Button>
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Create Community
          </Button>
        </div>

        {/* New code banner after creation */}
        {newCode && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">Community created!</p>
              <p className="text-xs text-green-700 dark:text-green-300">Share this code with friends:</p>
            </div>
            <button
              onClick={() => copyCode(newCode)}
              className="flex items-center gap-2 bg-white dark:bg-black/20 px-3 py-2 rounded-lg border border-green-300 dark:border-green-700 font-mono font-bold tracking-wider text-green-700 dark:text-green-300 hover:bg-green-100 transition-colors"
            >
              {newCode}
              {codeCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <button onClick={() => setNewCode("")}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        )}

        {/* My Communities */}
        {loadingCommunities ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : myCommunities.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">My Communities ({myCommunities.length})</p>
            {myCommunities.map((community) => {
              const lastMsg = community.messages[0];
              return (
                <div
                  key={community.id}
                  className="bg-card rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setActiveCommunity(community)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0">
                      {community.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-semibold">{community.name}</h3>
                        <Badge variant="outline" className="text-xs">{community.exam}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{community.description}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />{community.members.length} members
                        </span>
                        {community.target_date && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Target className="h-3 w-3" />{daysUntilExam(community.target_date)}d to exam
                          </span>
                        )}
                      </div>
                      {lastMsg && (
                        <p className="text-xs text-muted-foreground mt-1.5 truncate">
                          <span className="font-medium">
                            {lastMsg.senderId === currentUser?.id ? "You" : lastMsg.senderName}:
                          </span>{" "}
                          {lastMsg.text}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyCode(community.code); }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted hover:bg-accent transition-colors"
                      >
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-xs font-bold">{community.code}</span>
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      </button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">No communities yet</p>
            <p className="text-xs mt-1">Create one or join with a code</p>
          </div>
        )}

        {/* How it works */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">How Study Communities Work</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Plus,     title: "Create",  desc: "Create a community for your exam. Get a unique 8-character code." },
              { icon: LogIn,    title: "Invite",  desc: "Share the code with friends. They join instantly using the code." },
              { icon: BookOpen, title: "Study",   desc: "Chat, share doubts, celebrate achievements, and track progress." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mx-auto">
                    <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ── CREATE MODAL ── */}
        {showCreate && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl border shadow-xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg">Create Study Community</h3>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-accent">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Community Name</Label>
                  <Input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="e.g. NEET 2026 Warriors" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Target Exam</Label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {["NEET", "JEE Main", "JEE Advanced"].map((exam) => (
                      <button key={exam} onClick={() => setCreateExam(exam)}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          createExam === exam ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent")}>
                        {exam}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Description (optional)</Label>
                  <Input value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} placeholder="What's your group about?" className="mt-1" />
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground">
                  A unique 8-character invite code will be generated automatically.
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button className="flex-1 gap-2" onClick={handleCreate} disabled={creating || !createName.trim()}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Create
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── JOIN MODAL ── */}
        {showJoin && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl border shadow-xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg">Join a Community</h3>
                <button onClick={() => { setShowJoin(false); setJoinCode(""); setJoinError(""); }} className="p-1 rounded-lg hover:bg-accent">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Invite Code</Label>
                  <Input
                    value={joinCode}
                    onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(""); }}
                    placeholder="Enter 8-character code e.g. NEET2026"
                    className="mt-1 font-mono tracking-widest text-center text-lg uppercase"
                    maxLength={10}
                  />
                  {joinError && <p className="text-xs text-destructive mt-1">{joinError}</p>}
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground">
                  Ask your friend for the invite code. It looks like: <span className="font-mono font-bold">NEET2026</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setShowJoin(false); setJoinCode(""); setJoinError(""); }}>Cancel</Button>
                <Button className="flex-1 gap-2" onClick={handleJoin} disabled={joining || joinCode.length < 6}>
                  {joining ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                  Join
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
