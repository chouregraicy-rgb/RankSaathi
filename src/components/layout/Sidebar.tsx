// src/components/layout/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, BookOpen, Brain,
  BarChart3, Calendar, Bell, Settings, LogOut,
  ChevronLeft, Users, FileQuestion,
  ClipboardList, Menu, X, MessageCircle, Trophy, Puzzle
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
    { href: "/student/doubts",     label: "Doubt Solver", icon: Brain },
    { href: "/student/community",  label: "Community",    icon: MessageCircle },
    { href: "/student/ranking",    label: "My Ranking",   icon: Trophy },
    { href: "/student/analytics",  label: "Analytics",    icon: BarChart3 },
    { href: "/student/crossword",  label: "Crossword",    icon: Puzzle },
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

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, reset } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = NAV_ITEMS[role] ?? [];
  const settingsHref = SETTINGS_HREF[role];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    reset();
    router.push("/");
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">

      {/* ── Logo ─────────────────────────────────────────────── */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-4 border-b border-border",
        collapsed && "justify-center"
      )}>
        {/* Use plain <img> tag — no Next.js Image sizing issues */}
        <img
          src="/logo/logo.png"
          alt="VidyaSaathi"
          style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }}
        />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight">
              <span className="text-foreground">vidhya</span>
              <span className="text-amber-500">saathi</span>
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">{role} Portal</p>
          </div>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-background border border-border shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        "lg:hidden fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button type="button" onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 rounded-md hover:bg-accent">
          <X className="h-4 w-4" />
        </button>
        {SidebarContent}
      </aside>

      {/* Desktop sidebar */}
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
