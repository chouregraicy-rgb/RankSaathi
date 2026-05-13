// src/app/student/community/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, Plus, LogIn, Copy, CheckCircle2, BookOpen,
  MessageCircle, Target, Clock, Crown, User, Send,
  Hash, Flame, Trophy, ChevronRight, X, Loader2,
} from "lucide-react";
import { cn } from "@/utils";

// ── TYPES ──────────────────────────────────────────────
interface Member {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "member";
  studyHoursToday: number;
  streak: number;
  online: boolean;
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

interface Community {
  id: string;
  name: string;
  code: string;
  exam: string;
  members: Member[];
  messages: Message[];
  targetDate: string;
  description: string;
  createdBy: string;
}

// ── MOCK DATA ──────────────────────────────────────────
const MOCK_COMMUNITIES: Community[] = [
  {
    id: "c1",
    name: "NEET 2026 Warriors",
    code: "NEET2026",
    exam: "NEET",
    description: "Serious NEET aspirants only. Daily targets, doubts, and motivation!",
    targetDate: "2026-05-03",
    createdBy: "Priya S.",
    members: [
      { id:"m1", name:"Priya S.",   avatar:"P", role:"admin",  studyHoursToday:8,  streak:14, online:true  },
      { id:"m2", name:"Rahul G.",   avatar:"R", role:"member", studyHoursToday:6,  streak:7,  online:true  },
      { id:"m3", name:"Anjali V.",  avatar:"A", role:"member", studyHoursToday:5,  streak:21, online:false },
      { id:"m4", name:"Kiran M.",   avatar:"K", role:"member", studyHoursToday:7,  streak:5,  online:true  },
      { id:"m5", name:"Sneha T.",   avatar:"S", role:"member", studyHoursToday:4,  streak:3,  online:false },
    ],
    messages: [
      { id:"msg1", senderId:"m1", senderName:"Priya S.",  senderAvatar:"P", text:"Good morning everyone! Today's target: Complete Genetics chapter 🎯", time:"8:00 AM",  type:"text" },
      { id:"msg2", senderId:"m2", senderName:"Rahul G.",  senderAvatar:"R", text:"Done with Mole Concept! Scored 90% in the practice test 🎉", time:"10:30 AM", type:"achievement" },
      { id:"msg3", senderId:"m4", senderName:"Kiran M.",  senderAvatar:"K", text:"Can someone explain the difference between mitosis and meiosis? I keep confusing them", time:"11:15 AM", type:"doubt" },
      { id:"msg4", senderId:"m1", senderName:"Priya S.",  senderAvatar:"P", text:"Mitosis produces 2 identical diploid cells (for growth/repair), Meiosis produces 4 haploid cells (for reproduction). Key: MEIOSIS = Making Eggs/sperm In Our Special Stage", time:"11:20 AM", type:"text" },
      { id:"msg5", senderId:"m3", senderName:"Anjali V.", senderAvatar:"A", text:"Completed 6 hours today! Photosynthesis notes done ✅", time:"2:00 PM",  type:"achievement" },
      { id:"msg6", senderId:"m2", senderName:"Rahul G.",  senderAvatar:"R", text:"Quick question — is Assertion-Reason type asked in NEET or only JEE?", time:"3:45 PM",  type:"doubt" },
    ],
  },
];

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function CommunityPage() {
  const [myCommunities, setMyCommunities]   = useState<Community[]>(MOCK_COMMUNITIES);
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [activeTab, setActiveTab]           = useState("chat");

  // Create form
  const [showCreate, setShowCreate]   = useState(false);
  const [createName, setCreateName]   = useState("");
  const [createExam, setCreateExam]   = useState("NEET");
  const [createDesc, setCreateDesc]   = useState("");
  const [creating, setCreating]       = useState(false);
  const [newCode, setNewCode]         = useState("");

  // Join form
  const [showJoin, setShowJoin]   = useState(false);
  const [joinCode, setJoinCode]   = useState("");
  const [joining, setJoining]     = useState(false);
  const [joinError, setJoinError] = useState("");

  // Chat
  const [message, setMessage]   = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  // Current user (mock)
  const currentUser = { id: "me", name: "You", avatar: "Y" };

  function handleCreate() {
    if (!createName.trim()) return;
    setCreating(true);
    setTimeout(() => {
      const code = generateCode();
      const newCommunity: Community = {
        id: `c${Date.now()}`,
        name: createName,
        code,
        exam: createExam,
        description: createDesc,
        targetDate: "2026-05-03",
        createdBy: currentUser.name,
        members: [{ id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: "admin", studyHoursToday: 0, streak: 0, online: true }],
        messages: [
          { id:"sys1", senderId:"system", senderName:"System", senderAvatar:"S", text:`${currentUser.name} created this community. Share code ${code} with friends to invite them!`, time:"Just now", type:"text" }
        ],
      };
      setMyCommunities((prev) => [...prev, newCommunity]);
      setNewCode(code);
      setCreating(false);
      setShowCreate(false);
      setActiveCommunity(newCommunity);
      setCreateName("");
      setCreateDesc("");
    }, 1500);
  }

  function handleJoin() {
    if (!joinCode.trim()) return;
    setJoining(true);
    setJoinError("");
    setTimeout(() => {
      // Check if code matches any community
      const found = myCommunities.find((c) => c.code === joinCode.toUpperCase().trim());
      if (found) {
        setJoinError("You are already a member of this community!");
        setJoining(false);
        return;
      }
      // Simulate finding a community
      if (joinCode.length >= 6) {
        const joined: Community = {
          id: `c${Date.now()}`,
          name: "JEE 2026 Crushers",
          code: joinCode.toUpperCase(),
          exam: "JEE Main",
          description: "JEE Main aspirants studying together",
          targetDate: "2026-01-22",
          createdBy: "Admin",
          members: [
            { id:"j1", name:"Arjun P.", avatar:"A", role:"admin",  studyHoursToday:7, streak:10, online:true  },
            { id:"j2", name:"Neha R.",  avatar:"N", role:"member", studyHoursToday:5, streak:6,  online:false },
            { id:currentUser.id, name:currentUser.name, avatar:currentUser.avatar, role:"member", studyHoursToday:0, streak:0, online:true },
          ],
          messages: [
            { id:"jm1", senderId:"j1", senderName:"Arjun P.", senderAvatar:"A", text:"Welcome to JEE 2026 Crushers! Let's crack it together 💪", time:"9:00 AM", type:"text" },
          ],
        };
        setMyCommunities((prev) => [...prev, joined]);
        setActiveCommunity(joined);
        setShowJoin(false);
        setJoinCode("");
      } else {
        setJoinError("Invalid code. Please check and try again.");
      }
      setJoining(false);
    }, 1500);
  }

  function handleSendMessage() {
    if (!message.trim() || !activeCommunity) return;
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: message,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };
    setMyCommunities((prev) =>
      prev.map((c) => c.id === activeCommunity.id ? { ...c, messages: [...c.messages, newMsg] } : c)
    );
    setActiveCommunity((prev) => prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev);
    setMessage("");
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  const daysUntilExam = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // ── COMMUNITY DETAIL VIEW ──
  if (activeCommunity) {
    const community = myCommunities.find((c) => c.id === activeCommunity.id) ?? activeCommunity;
    const onlineCount = community.members.filter((m) => m.online).length;
    const topStudier = [...community.members].sort((a, b) => b.studyHoursToday - a.studyHoursToday)[0];

    return (
      <DashboardLayout role="student" title={community.name}>
        <div className="max-w-4xl space-y-4">

          {/* Header */}
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveCommunity(null)} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-lg">{community.name}</h2>
                <Badge variant="outline" className="text-xs">{community.exam}</Badge>
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  {onlineCount} online
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{community.members.length} members · {daysUntilExam(community.targetDate)} days to exam</p>
            </div>
            {/* Code display */}
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
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            {/* ── CHAT ── */}
            <TabsContent value="chat" className="mt-3">
              <div className="bg-card rounded-xl border overflow-hidden flex flex-col" style={{ height: "60vh" }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {community.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    const isSystem = msg.senderId === "system";
                    if (isSystem) return (
                      <div key={msg.id} className="text-center">
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{msg.text}</span>
                      </div>
                    );
                    return (
                      <div key={msg.id} className={cn("flex gap-2.5", isMe && "flex-row-reverse")}>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white",
                          isMe ? "bg-primary" : "bg-gradient-to-br from-purple-500 to-brand-500"
                        )}>
                          {msg.senderAvatar}
                        </div>
                        <div className={cn("max-w-[70%] space-y-1", isMe && "items-end")}>
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
                  })}
                </div>

                {/* Message input */}
                <div className="border-t border-border p-3 flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message, share a doubt, or celebrate..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
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
                      {member.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{member.name}</p>
                        {member.role === "admin" && (
                          <Crown className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        {member.id === currentUser.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="flex gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />{member.studyHoursToday}h today
                        </span>
                        <span className="text-xs text-orange-500 flex items-center gap-1">
                          <Flame className="h-3 w-3" />{member.streak} day streak
                        </span>
                      </div>
                    </div>
                    <span className={cn("text-xs font-medium", member.online ? "text-green-500" : "text-muted-foreground")}>
                      {member.online ? "Online" : "Offline"}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── LEADERBOARD ── */}
            <TabsContent value="leaderboard" className="mt-3">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">Ranked by study hours today</p>
                {[...community.members]
                  .sort((a, b) => b.studyHoursToday - a.studyHoursToday)
                  .map((member, i) => (
                    <div key={member.id} className={cn(
                      "bg-card rounded-xl border p-3 flex items-center gap-3",
                      i === 0 && "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20"
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                        i === 0 ? "bg-amber-400 text-white" :
                        i === 1 ? "bg-gray-400 text-white" :
                        i === 2 ? "bg-orange-400 text-white" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium">{member.name}</p>
                          {member.role === "admin" && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                          {member.id === currentUser.id && <Badge variant="outline" className="text-xs">You</Badge>}
                        </div>
                        <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(member.studyHoursToday / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold">{member.studyHoursToday}h</p>
                        <p className="text-xs text-orange-500 flex items-center gap-0.5">
                          <Flame className="h-3 w-3" />{member.streak}d
                        </p>
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

  // ── MAIN LIST VIEW ──
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

        {/* New code display after creation */}
        {newCode && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">Community created!</p>
              <p className="text-xs text-green-700 dark:text-green-300">Share this code with friends to invite them:</p>
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
        {myCommunities.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">My Communities ({myCommunities.length})</p>
            {myCommunities.map((community) => {
              const onlineCount = community.members.filter((m) => m.online).length;
              const lastMsg = community.messages[community.messages.length - 1];
              return (
                <div
                  key={community.id}
                  className="bg-card rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setActiveCommunity(community)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0">
                      {community.name[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-semibold">{community.name}</h3>
                        <Badge variant="outline" className="text-xs">{community.exam}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{community.description}</p>

                      {/* Stats row */}
                      <div className="flex gap-3 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />{community.members.length} members
                        </span>
                        <span className="text-xs text-green-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{onlineCount} online
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Target className="h-3 w-3" />{daysUntilExam(community.targetDate)}d to exam
                        </span>
                      </div>

                      {/* Last message */}
                      {lastMsg && (
                        <p className="text-xs text-muted-foreground mt-1.5 truncate">
                          <span className="font-medium">{lastMsg.senderName === currentUser.name ? "You" : lastMsg.senderName}:</span>{" "}
                          {lastMsg.text}
                        </p>
                      )}
                    </div>

                    {/* Code badge */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyCode(community.code); }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted hover:bg-accent transition-colors"
                        title="Copy invite code"
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
              { icon: Plus,     title: "Create",  desc: "Create a community for your exam. Get a unique 8-character code."        },
              { icon: LogIn,    title: "Invite",  desc: "Share the code with friends. They join instantly using the code."        },
              { icon: BookOpen, title: "Study",   desc: "Chat, share doubts, celebrate achievements, and track each other's progress." },
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
                  A unique 8-character invite code will be generated automatically. Share it with friends to let them join.
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
