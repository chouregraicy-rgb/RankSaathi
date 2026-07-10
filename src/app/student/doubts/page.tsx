// src/app/student/doubts/page.tsx
"use client";
import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/useToast";
import {
  Brain, Upload, Loader2, ImageIcon,
  Lightbulb, BookOpen, ChevronDown, ChevronUp, X, Sparkles,
} from "lucide-react";
import { cn } from "@/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import type { Subject } from "@/types";

// Phase 1: Voice components
import { VoiceInput, type VoiceLanguage } from "@/components/doubt/VoiceInput";
import { TTSPlayer } from "@/components/doubt/TTSPlayer";
import { LanguageToggle } from "@/components/doubt/LanguageToggle";

interface DoubtResult {
  stepwise: string;
  simplified: string;
  relatedConcepts: string[];
  similarQuestions: string[];
}

const SUBJECTS: Subject[] = ["Physics", "Chemistry", "Biology", "Mathematics"];

export default function DoubtSolverPage() {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [question, setQuestion]             = useState("");
  const [subject, setSubject]               = useState<Subject | "">("");
  const [imageFile, setImageFile]           = useState<File | null>(null);
  const [imagePreview, setImagePreview]     = useState<string | null>(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [result, setResult]                 = useState<DoubtResult | null>(null);
  const [showSimplified, setShowSimplified] = useState(false);
  const [voiceLang, setVoiceLang]           = useState<VoiceLanguage>("en-IN");
  const [interimText, setInterimText]       = useState("");
  const [isSpeaking, setIsSpeaking]         = useState(false);

  function handleTranscript(text: string) {
    setInterimText("");
    setQuestion(prev => prev ? `${prev} ${text}` : text);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB image allowed", variant: "destructive" });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!question.trim() && !imageFile) {
      toast({ title: "Question required", description: "Type your doubt, speak it, or upload an image", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setInterimText("");
    try {
      let imageBase64: string | undefined;
      if (imageFile) {
        const buffer = await imageFile.arrayBuffer();
        imageBase64 = Buffer.from(buffer).toString("base64");
      }
      const response = await fetch("/api/ai/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim() || "Solve this problem",
          subject: subject || undefined,
          imageBase64,
          language: voiceLang,   // ← send selected language so AI responds in Hindi/English
        }),
      });
      if (!response.ok) throw new Error("AI service unavailable");
      const data = await response.json();
      setResult(data);
      if (user) {
        const supabase = createClient();
        await supabase.from("doubt_sessions").insert({
          student_id: user.id,
          question_text: question.trim(),
          subject: subject || null,
          ai_response: data.stepwise,
          related_concepts: data.relatedConcepts ?? [],
        });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout role="student" title="AI Doubt Solver">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl">AI Doubt Solver</h1>
              <p className="text-sm text-muted-foreground">
                Type, speak, or upload a photo — get step-by-step solutions
              </p>
            </div>
          </div>
          <LanguageToggle value={voiceLang} onChange={setVoiceLang} />
        </div>

        {/* Input card */}
        <Card>
          <CardContent className="pt-5 space-y-4">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[150px]">
                <Label className="text-xs mb-1">Subject (optional)</Label>
                <Select value={subject} onValueChange={(v) => setSubject(v as Subject)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1">Your Doubt</Label>
              <div className="relative">
                <textarea
                  value={question + (interimText ? ` ${interimText}` : "")}
                  onChange={(e) => { setQuestion(e.target.value); setInterimText(""); }}
                  placeholder="Type your question here, or tap the mic to speak..."
                  className={cn(
                    "w-full min-h-[120px] p-3 pr-16 text-sm rounded-lg border border-input bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "placeholder:text-muted-foreground resize-none transition-colors",
                    interimText && "border-orange-300 bg-orange-50/30 dark:bg-orange-950/10"
                  )}
                />
                <div className="absolute top-2 right-2">
                  <VoiceInput
                    onTranscript={handleTranscript}
                    onInterimTranscript={setInterimText}
                    language={voiceLang}
                    disabled={isLoading}
                  />
                </div>
                {interimText && (
                  <p className="absolute bottom-2 left-3 text-[10px] text-orange-500 font-medium animate-pulse">
                    Listening...
                  </p>
                )}
              </div>
            </div>

            <div>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Question preview" className="max-h-48 rounded-lg border object-contain" />
                  <button onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  className={cn("border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer", "hover:border-primary/50 hover:bg-primary/5 transition-colors")}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload question image</p>
                      <p className="text-xs text-muted-foreground">Handwritten notes, textbook photos (Max 5MB)</p>
                    </div>
                    <Button variant="outline" size="sm" type="button" className="gap-2">
                      <Upload className="h-4 w-4" /> Choose Image
                    </Button>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </div>

            <Button className="w-full gap-2" size="lg" onClick={handleSubmit}
              disabled={isLoading || (!question.trim() && !imageFile)}>
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Solving your doubt...</>
              ) : (
                <><Sparkles className="h-4 w-4" />Solve My Doubt</>
              )}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Brain className="h-3 w-3 text-amber-500 animate-pulse" />
                </div>
                <span className="text-sm text-muted-foreground">AI is analysing your question...</span>
              </div>
              {[80, 60, 90, 50].map((w, i) => (
                <div key={i} className="h-3 rounded-full bg-muted shimmer" style={{ width: `${w}%` }} />
              ))}
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-4">
            <Card className="border-brand-200 dark:border-brand-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <CardTitle className="text-base font-display">Step-by-Step Solution</CardTitle>
                  </div>
                  <TTSPlayer text={result.stepwise} language={voiceLang} onSpeakingChange={setIsSpeaking} />
                </div>
                {isSpeaking && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/20 rounded-lg px-3 py-2 border border-orange-200 dark:border-orange-800">
                    <span className="flex gap-[3px] items-end h-3">
                      {[1,3,2,4,2].map((h, i) => (
                        <span key={i} className="w-[3px] rounded-full bg-orange-500 inline-block"
                          style={{ height: `${h * 3}px`, animation: `soundBar 0.8s ${i * 0.12}s ease-in-out infinite alternate` }} />
                      ))}
                    </span>
                    <span className="font-medium">AI Tutor is speaking...</span>
                    <style>{`@keyframes soundBar { from { transform: scaleY(0.4); } to { transform: scaleY(1.2); } }`}</style>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans bg-muted/50 p-4 rounded-lg">
                    {result.stepwise}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 cursor-pointer" onClick={() => setShowSimplified(!showSimplified)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <CardTitle className="text-base font-display">Plain Language Explanation</CardTitle>
                  </div>
                  {showSimplified ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </CardHeader>
              {showSimplified && (
                <CardContent>
                  <p className="text-sm leading-relaxed">{result.simplified}</p>
                </CardContent>
              )}
            </Card>

            {result.relatedConcepts.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <CardTitle className="text-base font-display">Related Concepts to Revise</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.relatedConcepts.map((concept, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1 px-3">{concept}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result.similarQuestions.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Try These Similar Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 list-decimal list-inside">
                    {result.similarQuestions.map((q, i) => (
                      <li key={i} className="text-sm text-muted-foreground leading-relaxed">{q}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            <Button variant="outline" className="w-full gap-2"
              onClick={() => { setQuestion(""); setResult(null); setImagePreview(null); setImageFile(null); setInterimText(""); }}>
              <Brain className="h-4 w-4" /> Ask Another Doubt
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
