// src/app/admin/dashboard/page.tsx
"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileQuestion, ClipboardList, BookOpen, TrendingUp, AlertCircle, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

const SIGNUP_DATA = [
  { date: "May 3", students: 12, parents: 5 },
  { date: "May 4", students: 18, parents: 8 },
  { date: "May 5", students: 14, parents: 4 },
  { date: "May 6", students: 22, parents: 9 },
  { date: "May 7", students: 16, parents: 6 },
  { date: "May 8", students: 30, parents: 12 },
  { date: "May 9", students: 25, parents: 10 },
];

const RECENT_USERS = [
  { name: "Priya Sharma",   role: "student", exam: "NEET",     joined: "2 min ago"  },
  { name: "Rahul Gupta",    role: "student", exam: "JEE Main", joined: "8 min ago"  },
  { name: "Mrs. Agarwal",   role: "parent",  exam: "—",        joined: "15 min ago" },
  { name: "Anjali Verma",   role: "student", exam: "NEET",     joined: "22 min ago" },
  { name: "Rohit Kumar",    role: "student", exam: "JEE Adv",  joined: "30 min ago" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      <div className="space-y-5 max-w-5xl">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students"   value="2,847" icon={Users}         color="blue"   trend={{ value: 12, label: "this week" }}  />
          <StatCard title="Total Parents"    value="1,203" icon={Users}         color="green"                                             />
          <StatCard title="Total Questions"  value="14,320" icon={FileQuestion} color="purple" trend={{ value: 8, label: "added today" }} />
          <StatCard title="Active Tests"     value="48"    icon={ClipboardList} color="orange"                                            />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/questions">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Questions</Button>
          </Link>
          <Link href="/admin/tests">
            <Button variant="outline" className="gap-2"><ClipboardList className="h-4 w-4" /> Create Test</Button>
          </Link>
          <Link href="/admin/syllabus">
            <Button variant="outline" className="gap-2"><BookOpen className="h-4 w-4" /> Manage Syllabus</Button>
          </Link>
        </div>

        {/* Signup chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">New Registrations — Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SIGNUP_DATA} margin={{ left: -25, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="students" fill="#2b7fff" radius={[3, 3, 0, 0]} name="Students" />
                <Bar dataKey="parents"  fill="#00f5a0" radius={[3, 3, 0, 0]} name="Parents"  />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent users */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display">Recent Registrations</CardTitle>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {RECENT_USERS.map((user, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm flex-shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.joined}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {user.exam !== "—" && (
                      <Badge variant="outline" className="text-xs">{user.exam}</Badge>
                    )}
                    <Badge
                      variant={user.role === "student" ? "default" : "secondary"}
                      className="text-xs capitalize"
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
