// src/app/admin/syllabus/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ChevronDown, ChevronRight, Plus, Edit } from "lucide-react";
import { cn, SUBJECT_COLORS } from "@/utils";

const SYLLABUS = {
  NEET: {
    Physics: [
      {
        unit: "Physical World & Measurement",
        chapters: ["Physical World", "Units & Measurements"],
        weightage: 5,
      },
      {
        unit: "Kinematics",
        chapters: ["Motion in Straight Line", "Motion in Plane"],
        weightage: 8,
      },
      {
        unit: "Laws of Motion",
        chapters: ["Newton's Laws", "Friction", "Circular Motion"],
        weightage: 10,
      },
      {
        unit: "Electrostatics",
        chapters: ["Electric Charges", "Gauss's Law", "Capacitors"],
        weightage: 12,
      },
    ],
    Chemistry: [
      {
        unit: "Some Basic Concepts",
        chapters: ["Mole Concept", "Stoichiometry"],
        weightage: 5,
      },
      {
        unit: "Structure of Atom",
        chapters: ["Atomic Models", "Quantum Numbers", "Electronic Configuration"],
        weightage: 8,
      },
      {
        unit: "Chemical Bonding",
        chapters: ["VSEPR", "Hybridization", "MOT"],
        weightage: 10,
      },
    ],
    Biology: [
      {
        unit: "Diversity of Living Organisms",
        chapters: ["Kingdom Classification", "Plant Kingdom", "Animal Kingdom"],
        weightage: 14,
      },
      {
        unit: "Structural Organization",
        chapters: ["Cell Biology", "Cell Division"],
        weightage: 10,
      },
      {
        unit: "Genetics & Evolution",
        chapters: ["Heredity & Variation", "Molecular Basis", "Evolution"],
        weightage: 18,
      },
    ],
  },
};

export default function AdminSyllabusPage() {
  const [selectedExam, setSelectedExam] = useState("NEET");
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  function toggleUnit(unit: string) {
    setExpandedUnits((prev) => ({ ...prev, [unit]: !prev[unit] }));
  }

  const examSyllabus = (SYLLABUS as any)[selectedExam] ?? {};
  const subjectData = examSyllabus[selectedSubject] ?? [];

  return (
    <DashboardLayout role="admin" title="Syllabus">
      <div className="space-y-5 max-w-4xl">

        {/* Filters */}
        <div className="flex gap-3 items-center">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEET">NEET UG</SelectItem>
              <SelectItem value="JEE_MAIN">JEE Main</SelectItem>
              <SelectItem value="JEE_ADVANCED">JEE Advanced</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            {Object.keys(examSyllabus).map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                  selectedSubject === subject
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent"
                )}
              >
                {subject}
              </button>
            ))}
          </div>

          <Button size="sm" className="gap-2 ml-auto">
            <Plus className="h-4 w-4" /> Add Unit
          </Button>
        </div>

        {/* Syllabus list */}
        <div className="space-y-3">
          {subjectData.map((unit: any, i: number) => (
            <Card key={i}>
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleUnit(unit.unit)}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: SUBJECT_COLORS[selectedSubject] ?? "#2b7fff" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{unit.unit}</p>
                  <p className="text-xs text-muted-foreground">
                    {unit.chapters.length} chapters · {unit.weightage}% weightage
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {unit.weightage}%
                </Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                {expandedUnits[unit.unit] ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {expandedUnits[unit.unit] && (
                <div className="border-t border-border px-4 pb-3 pt-2">
                  <div className="space-y-1">
                    {unit.chapters.map((chapter: string, j: number) => (
                      <div key={j} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/40 group">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm flex-1">{chapter}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="gap-1 text-xs ml-5 mt-1">
                      <Plus className="h-3 w-3" /> Add Chapter
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
