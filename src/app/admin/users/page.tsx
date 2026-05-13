// src/app/admin/users/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, MoreHorizontal, GraduationCap, Users } from "lucide-react";
import { formatDate } from "@/utils";

const MOCK_USERS = [
  { id: "1", name: "Priya Sharma",   email: "priya@example.com",   role: "student", exam: ["NEET"],             city: "Indore",   joined: "2026-05-08", active: true  },
  { id: "2", name: "Rahul Gupta",    email: "rahul@example.com",   role: "student", exam: ["JEE_MAIN"],        city: "Delhi",    joined: "2026-05-08", active: true  },
  { id: "3", name: "Mrs. Agarwal",   email: "agarwal@example.com", role: "parent",  exam: [],                  city: "Bhopal",   joined: "2026-05-08", active: true  },
  { id: "4", name: "Anjali Verma",   email: "anjali@example.com",  role: "student", exam: ["NEET","JEE_MAIN"], city: "Mumbai",   joined: "2026-05-07", active: true  },
  { id: "5", name: "Rohit Kumar",    email: "rohit@example.com",   role: "student", exam: ["JEE_ADVANCED"],    city: "Pune",     joined: "2026-05-07", active: false },
  { id: "6", name: "Mr. Sharma",     email: "sharma@example.com",  role: "parent",  exam: [],                  city: "Jaipur",   joined: "2026-05-06", active: true  },
  { id: "7", name: "Neha Patel",     email: "neha@example.com",    role: "student", exam: ["NEET"],            city: "Ahmedabad",joined: "2026-05-05", active: true  },
];

const EXAM_LABELS: Record<string, string> = {
  NEET: "NEET", JEE_MAIN: "JEE Main", JEE_ADVANCED: "JEE Adv",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = MOCK_USERS.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout role="admin" title="Users">
      <div className="space-y-5 max-w-5xl">

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="parent">Parents</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" /> Invite User
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{filtered.length} users found</span>
          <span>{filtered.filter((u) => u.role === "student").length} students</span>
          <span>{filtered.filter((u) => u.role === "parent").length} parents</span>
        </div>

        {/* User list */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {filtered.map((user) => (
              <div key={user.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm flex-shrink-0">
                  {user.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    {!user.active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>

                <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                  {user.exam.map((e) => (
                    <Badge key={e} variant="outline" className="text-xs">{EXAM_LABELS[e]}</Badge>
                  ))}
                </div>

                <Badge
                  variant={user.role === "student" ? "default" : "secondary"}
                  className="text-xs capitalize flex-shrink-0"
                >
                  {user.role === "student" ? (
                    <GraduationCap className="h-3 w-3 mr-1" />
                  ) : (
                    <Users className="h-3 w-3 mr-1" />
                  )}
                  {user.role}
                </Badge>

                <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">
                  {formatDate(user.joined)}
                </span>

                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-10 text-center text-muted-foreground text-sm">
                No users found matching your search
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
