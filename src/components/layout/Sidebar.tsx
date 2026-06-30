// src/components/layout/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, BookOpen, Brain,
  BarChart3, Calendar, Bell, Settings, LogOut,
  ChevronLeft, Users, FileQuestion,
  ClipboardList, Menu, X, MessageCircle, Trophy, Puzzle, GitBranch, FolderDown
} from "lucide-react";
import { cn } from "@/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  student: [
    { href: "/student/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
    { href: "/student/schedule",   label: "Schedule",     icon: Calendar },
    { href: "/student/tests",      label: "Tests",        icon: ClipboardList },
    { href: "/student/revision",   label: "Revision",     icon: BookOpen },
    { href: "/student/resources",  label: "Resources",    icon: FolderDown },
    { href: "/student/doubts",     label: "Doubt Solver", icon: Brain },
    { href: "/student/community",  label: "Community",    icon: MessageCircle },
    { href: "/student/ranking",    label: "My Ranking",   icon: Trophy },
    { href: "/student/analytics",  label: "Analytics",    icon: BarChart3 },
    { href: "/student/crossword",  label: "Crossword",    icon: Puzzle },
    { href: "/student/mindmap", label: "Mind Map", icon: GitBranch },
  ],
  parent: [
    { href: "/parent/dashboard",   label: "Dashboard",    icon: LayoutDashboard },
    { href: "/parent/reports",     label: "Reports",      icon: BarChart3 },
    { href: "/parent/alerts",      label: "Alerts",       icon: Bell },
    { href: "/parent/link",        label: "Link Student", icon: Users },
  ],
  admin: [
    { href: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
    { href: "/admin/users",        label: "Users",        icon: Users },
    { href: "/admin/questions",    label: "Questions",    icon: FileQuestion },
    { href: "/admin/tests",        label: "Tests",        icon: ClipboardList },
    { href: "/admin/syllabus",     label: "Syllabus",     icon: BookOpen },
  ],
};

const SETTINGS_HREF: Partial<Record<UserRole, string>> = {
  student: "/student/settings",
};

const PLAN_LABELS: Record<string, string> = {
  lifetime: "Lifetime ✨",
};

const PLAN_COLORS: Record<string, string> = {
  lifetime: "bg-emerald-500/20 text-emerald-400",
};

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, reset } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);

  const navItems = NAV_ITEMS[role] ?? [];
  const settingsHref = SETTINGS_HREF[role];

  // Fetch current subscription plan
  // FIX: select both expires_at and current_period_end — use whichever is set
  useEffect(() => {
    if (role !== "student") return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) return;
      try {
        const { data } = await supabase
          .from("subscriptions")
          .select("plan_id, status, current_period_end, expires_at")
          .eq("user_id", authUser.id)
          .maybeSingle();

        // Accept either expiry column — handles both old and new rows
        const expiry = data?.current_period_end || data?.expires_at;

        if (data?.status === "active" && expiry && new Date(expiry) > new Date()) {
          setPlanId(data.plan_id);
        } else {
          setPlanId(null);
        }
      } catch {
        setPlanId(null);
      }
    });
  }, [role]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    reset();
    router.push("/");
  }

  const planLabel = planId ? (PLAN_LABELS[planId] ?? planId) : null;
  const planColor = planId ? (PLAN_COLORS[planId] ?? "bg-orange-500/20 text-orange-400") : null;

  const SidebarContent = (
    <div className="flex flex-col h-full">

      {/* ── Logo ─────────────────────────────────────────────── */}
      <div className={cn(
        "flex items-center border-b border-border",
        collapsed ? "justify-center p-3" : "gap-2 px-3 py-3"
      )}>
        <div style={{ width: "36px", height: "36px", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo.png"
            alt="VS"
            style={{ width: "36px", height: "36px", objectFit: "contain", display: "block" }}
          />
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <p style={{ fontWeight: 700, fontSize: "14px", lineHeight: "1.2", whiteSpace: "nowrap" }}>
              <span style={{ color: "var(--foreground)" }}>vidhya</span>
              <span style={{ color: "#f59e0b" }}>saathi</span>
            </p>
            <p style={{ fontSize: "10px", color: "var(--muted-foreground)", textTransform: "capitalize" }}>
              {role} Portal
            </p>
          </div>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ───────────────────────────────────────────── */}
      <div className="border-t border-border p-3 space-y-1">
        {settingsHref && (
          <Link
            href={settingsHref}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
              collapsed && "justify-center px-2"
            )}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && user && (
          <div className="flex items-center gap-2 px-3 py-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
                {user.full_name?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{user.full_name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email ?? user.phone}</p>
              {/* Plan badge */}
              {planLabel ? (
                <span className={cn(
                  "inline-block mt-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                  planColor
                )}>
                  {planLabel}
                </span>
              ) : (
                <a href="/pricing" className="inline-block mt-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors">
                  Get Access ₹499
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-background border border-border shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        "lg:hidden fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button type="button" onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 rounded-md hover:bg-accent">
          <X className="h-4 w-4" />
        </button>
        {SidebarContent}
      </aside>

      <aside className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-[var(--sidebar-width)]"
      )}>
        {SidebarContent}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors"
        >
          <ChevronLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>
    </>
  );
}
