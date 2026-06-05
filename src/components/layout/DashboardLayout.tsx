"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Bell, Search, X, BookOpen, Zap, Play, BarChart2, Calendar, Users, Puzzle } from "lucide-react";
import type { UserRole } from "@/types";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  title?: string;
}

// ── Quick search links shown in the search modal ──
const SEARCH_LINKS = [
  { label: "Revision",     href: "/student/revision",  icon: BookOpen,  desc: "Revise chapters & PYQs" },
  { label: "Doubt Solver", href: "/student/doubts",    icon: Zap,       desc: "Ask AI a doubt" },
  { label: "Practice Test",href: "/student/tests",     icon: Play,      desc: "Start a mock test" },
  { label: "Analytics",   href: "/student/analytics",  icon: BarChart2, desc: "View your performance" },
  { label: "Schedule",    href: "/student/schedule",   icon: Calendar,  desc: "Today's study plan" },
  { label: "Community",   href: "/student/community",  icon: Users,     desc: "Connect with peers" },
  { label: "Crossword", href: "/student/crossword", icon: Puzzle, desc: "AI-generated crossword puzzles" },
];

// ── Static demo notifications ──
const NOTIFICATIONS = [
  { id: 1, title: "Test Reminder",        body: "Physics Mock Test starts in 30 min",   time: "Just now",   unread: true  },
  { id: 2, title: "Streak at Risk!",      body: "Study at least 1h today to keep streak", time: "1h ago",   unread: true  },
  { id: 3, title: "New PYQ Added",        body: "NEET 2024 Biology questions are live",  time: "3h ago",    unread: false },
  { id: 4, title: "Parent Viewed Report", body: "Your parent checked your weekly report", time: "Yesterday", unread: false },
];

export function DashboardLayout({ children, role, title }: DashboardLayoutProps) {
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bellOpen, setBellOpen]       = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const { setUser, setLoading } = useAuthStore();

  // ── Hydrate auth store with user profile from public.users ──
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) {
        setLoading(false);
        return;
      }
      try {
        const { data: profile } = await supabase
          .from("users")
          .select("id, role, full_name")
          .eq("id", authUser.id)
          .maybeSingle();

        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          phone: authUser.phone ?? null,
          full_name: profile?.full_name ?? authUser.user_metadata?.full_name ?? "",
          role: profile?.role ?? role,
        });
      } catch {
        // Fallback — use auth metadata only
        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          phone: authUser.phone ?? null,
          full_name: authUser.user_metadata?.full_name ?? "",
          role: role,
        });
      } finally {
        setLoading(false);
      }
    });
  }, [role, setUser, setLoading]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredLinks = SEARCH_LINKS.filter(l =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} />

      <div className="lg:pl-[var(--sidebar-width)]">
        {/* ── Header ── */}
        <header className="sticky top-0 z-20 h-[var(--header-height)] bg-background/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 lg:hidden" />
            {title && <h1 className="font-display font-bold text-lg">{title}</h1>}
          </div>

          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => { setSearchOpen(true); setBellOpen(false); }}
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Bell button */}
            <div className="relative">
              <button
                onClick={() => { setBellOpen(prev => !prev); setSearchOpen(false); }}
                className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              {/* ── Notifications dropdown ── */}
              {bellOpen && (
                <>
                  {/* backdrop */}
                  <div className="fixed inset-0 z-30" onClick={() => setBellOpen(false)} />
                  <div className="absolute right-0 top-10 z-40 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <span className="font-semibold text-sm">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                            Mark all read
                          </button>
                        )}
                        <button onClick={() => setBellOpen(false)}>
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-border">
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 flex gap-3 ${n.unread ? "bg-primary/5" : ""}`}>
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? "bg-primary" : "bg-transparent"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {notifications.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-6">No notifications</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6 min-h-[calc(100vh-var(--header-height))]">
          {children}
        </main>
      </div>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search pages, features…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {/* Results */}
            <div className="p-2 max-h-72 overflow-y-auto">
              {filteredLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No results found</p>
              ) : (
                filteredLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <link.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{link.label}</p>
                      <p className="text-xs text-muted-foreground">{link.desc}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Esc</kbd> to close</p>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
