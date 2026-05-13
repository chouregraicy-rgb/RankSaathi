// src/app/admin/questions/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/useToast";
import { Search, Plus, Upload, FileQuestion, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/utils";
import type { ExamType, Subject, DifficultyLevel, QuestionType } from "@/types";

const MOCK_QUESTIONS = [
  { id: "q1", subject: "Physics", chapter: "Electrostatics", type: "mcq", difficulty: "medium", source: "JEE 2023" },
  { id: "q2", subject: "Chemistry", chapter: "Organic", type: "mcq", difficulty: "hard", source: "NEET 2022" },
  { id: "q3", subject: "Biology", chapter: "Genetics", type: "assertion_reason", difficulty: "medium", source: "NEET 2024" },
  { id: "q4", subject: "Mathematics", chapter: "Calculus", type: "integer", difficulty: "hard", source: "JEE 2022" },
  { id: "q5", subject: "Physics", chapter: "Mechanics", type: "mcq", difficulty: "easy", source: "JEE 2023" },
];

const DIFF_COLORS = { easy: "success", medium: "warning", hard: "destructive" } as const;
const TYPE_LABELS = { mcq: "MCQ", integer: "Integer", assertion_reason: "Assertion-Reason", match_the_following: "Match" };

export default function AdminQuestionsPage() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);

  // Add question form state
  const [form, setForm] = useState({
    subject: "Physics" as Subject,
    exam_type: ["NEET"] as ExamType[],
    type: "mcq" as QuestionType,
    difficulty: "medium" as DifficultyLevel,
    question_text: "",
    option_a: "", option_b: "", option_c: "", option_d: "",
    correct_answer: "A",
    explanation: "",
    source: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.question_text.trim()) {
      toast({ title: "Question text required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.from("questions").insert({
        ...form,
        tags: [],
        created_at: new Date().toISOString(),
      });
      toast({ title: "Question added!", variant: "success" as any });
      setIsAdding(false);
      setForm({ ...form, question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", explanation: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const filtered = MOCK_QUESTIONS.filter((q) =>
    (subjectFilter === "all" || q.subject === subjectFilter) &&
    (q.chapter.toLowerCase().includes(search.toLowerCase()) || q.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout role="admin" title="Questions">
      <div className="space-y-5 max-w-5xl">
        <Tabs defaultValue="list">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list">Question Bank</TabsTrigger>
              <TabsTrigger value="add">Add Question</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" /> Bulk Import
              </Button>
            </div>
          </div>

          {/* Question list */}
          <TabsContent value="list" className="mt-4 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search questions..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {["Physics", "Chemistry", "Biology", "Mathematics"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {filtered.map((q) => (
                  <div key={q.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                    <FileQuestion className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <Badge variant="outline" className="text-xs">{q.subject}</Badge>
                        <Badge variant="secondary" className="text-xs">{q.chapter}</Badge>
                        <Badge variant={DIFF_COLORS[q.difficulty as keyof typeof DIFF_COLORS]} className="text-xs capitalize">{q.difficulty}</Badge>
                        <Badge variant="info" className="text-xs">{TYPE_LABELS[q.type as keyof typeof TYPE_LABELS]}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Source: {q.source}</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add question form */}
          <TabsContent value="add" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Add New Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs">Subject</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v as Subject })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Physics", "Chemistry", "Biology", "Mathematics"].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as QuestionType })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">MCQ</SelectItem>
                        <SelectItem value="integer">Integer</SelectItem>
                        <SelectItem value="assertion_reason">Assertion-Reason</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Difficulty</Label>
                    <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v as DifficultyLevel })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Source (optional)</Label>
                    <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="JEE 2023 Paper 1" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Question Text</Label>
                  <textarea
                    value={form.question_text}
                    onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                    className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none mt-1"
                    placeholder="Type the question here..."
                  />
                </div>

                {form.type !== "integer" && (
                  <div className="grid md:grid-cols-2 gap-3">
                    {(["a", "b", "c", "d"] as const).map((opt) => (
                      <div key={opt}>
                        <Label className="text-xs">Option {opt.toUpperCase()}</Label>
                        <Input
                          value={form[`option_${opt}` as keyof typeof form] as string}
                          onChange={(e) => setForm({ ...form, [`option_${opt}`]: e.target.value })}
                          placeholder={`Option ${opt.toUpperCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Correct Answer</Label>
                    {form.type === "integer" ? (
                      <Input
                        value={form.correct_answer}
                        onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
                        placeholder="Enter integer"
                        type="number"
                      />
                    ) : (
                      <Select value={form.correct_answer} onValueChange={(v) => setForm({ ...form, correct_answer: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["A", "B", "C", "D"].map((o) => <SelectItem key={o} value={o}>Option {o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Explanation</Label>
                  <textarea
                    value={form.explanation}
                    onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                    className="w-full min-h-[80px] p-3 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none mt-1"
                    placeholder="Explain the correct answer..."
                  />
                </div>

                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Save Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
