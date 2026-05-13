// src/app/admin/tests/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Plus, Users, Clock, Target, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const TESTS = [
  { id: "t1", title: "Physics — Electrostatics Full", type: "chapter", exam: "JEE Main", questions: 30, duration: 45, attempts: 124, published: true  },
  { id: "t2", title: "NEET Biology — Genetics",       type: "chapter", exam: "NEET",     questions: 45, duration: 60, attempts: 89,  published: true  },
  { id: "t3", title: "Full Mock — NEET 2026",         type: "full_mock",exam: "NEET",    questions: 180,duration: 200,attempts: 212, published: true  },
  { id: "t4", title: "JEE Main Full Mock — May",      type: "full_mock",exam: "JEE Main",questions: 90, duration: 180,attempts: 156, published: true  },
  { id: "t5", title: "Chemistry — Organic (Draft)",   type: "chapter", exam: "NEET",     questions: 25, duration: 40, attempts: 0,   published: false },
  { id: "t6", title: "JEE Advanced — Mock 1",        type: "full_mock",exam: "JEE Adv", questions: 60, duration: 180,attempts: 45,  published: false },
];

const TYPE_COLORS = {
  chapter:   "info",
  full_mock: "default",
  topic:     "secondary",
  adaptive:  "warning",
} as const;

export default function AdminTestsPage() {
  const [filter, setFilter] = useState("all");
  const [tests, setTests] = useState(TESTS);

  function togglePublish(id: string) {
    setTests((prev) => prev.map((t) => t.id === id ? { ...t, published: !t.published } : t));
  }

  const filtered = tests.filter((t) => filter === "all" || t.exam.toLowerCase().replace(" ", "_") === filter);

  return (
    <DashboardLayout role="admin" title="Tests">
      <div className="space-y-5 max-w-5xl">

        {/* Header actions */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              <SelectItem value="neet">NEET</SelectItem>
              <SelectItem value="jee_main">JEE Main</SelectItem>
              <SelectItem value="jee_adv">JEE Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2 ml-auto">
            <Plus className="h-4 w-4" /> Create Test
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-card rounded-xl border p-3">
            <p className="text-2xl font-display font-bold">{tests.filter((t) => t.published).length}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </div>
          <div className="bg-card rounded-xl border p-3">
            <p className="text-2xl font-display font-bold">{tests.filter((t) => !t.published).length}</p>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </div>
          <div className="bg-card rounded-xl border p-3">
            <p className="text-2xl font-display font-bold">{tests.reduce((a, t) => a + t.attempts, 0)}</p>
            <p className="text-xs text-muted-foreground">Total Attempts</p>
          </div>
        </div>

        {/* Test list */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {filtered.map((test) => (
              <div key={test.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <Badge variant={TYPE_COLORS[test.type as keyof typeof TYPE_COLORS]} className="text-xs capitalize">
                      {test.type.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{test.exam}</Badge>
                    {!test.published && <Badge variant="secondary" className="text-xs">Draft</Badge>}
                  </div>
                  <p className="text-sm font-medium truncate">{test.title}</p>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" /> {test.questions} Qs
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {test.duration}m
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> {test.attempts} attempts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${test.published ? "text-green-500" : "text-muted-foreground"}`}
                    onClick={() => togglePublish(test.id)}
                    title={test.published ? "Unpublish" : "Publish"}
                  >
                    {test.published ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
