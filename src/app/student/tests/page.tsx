// src/app/student/tests/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Clock, Target, Play, Trophy, Search, BarChart2,
  Sparkles, Loader2, CheckCircle2, XCircle, AlertTriangle,
  Lightbulb, ArrowLeft, ArrowRight, CheckSquare, RefreshCw,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/utils";

const CHAPTER_TESTS = [
  { id:"ph-01",subject:"Physics",chapter:"Physical World",questions:10,duration:15,difficulty:"easy",exam:"NEET/JEE"},
  { id:"ph-02",subject:"Physics",chapter:"Units & Measurements",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-03",subject:"Physics",chapter:"Motion in a Straight Line",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-04",subject:"Physics",chapter:"Motion in a Plane",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-05",subject:"Physics",chapter:"Newton's Laws of Motion",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-06",subject:"Physics",chapter:"Friction",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-07",subject:"Physics",chapter:"Circular Motion",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-08",subject:"Physics",chapter:"Work & Energy",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-09",subject:"Physics",chapter:"Power & Collisions",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-10",subject:"Physics",chapter:"Centre of Mass",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-11",subject:"Physics",chapter:"Rotational Motion & Torque",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-12",subject:"Physics",chapter:"Moment of Inertia",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-13",subject:"Physics",chapter:"Gravitation & Kepler's Laws",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-14",subject:"Physics",chapter:"Satellites & Escape Velocity",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-15",subject:"Physics",chapter:"Elasticity",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-16",subject:"Physics",chapter:"Fluid Mechanics",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-17",subject:"Physics",chapter:"Surface Tension & Viscosity",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-18",subject:"Physics",chapter:"Thermal Properties of Matter",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-19",subject:"Physics",chapter:"Thermodynamics Laws",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-20",subject:"Physics",chapter:"Kinetic Theory of Gases",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-21",subject:"Physics",chapter:"Simple Harmonic Motion",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-22",subject:"Physics",chapter:"Waves & Sound",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-23",subject:"Physics",chapter:"Doppler Effect",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-24",subject:"Physics",chapter:"Electric Charges & Coulomb's Law",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-25",subject:"Physics",chapter:"Electric Field & Potential",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-26",subject:"Physics",chapter:"Gauss's Law",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-27",subject:"Physics",chapter:"Capacitors",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-28",subject:"Physics",chapter:"Ohm's Law & Resistance",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-29",subject:"Physics",chapter:"Kirchhoff's Laws",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-30",subject:"Physics",chapter:"Wheatstone Bridge",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-31",subject:"Physics",chapter:"Magnetic Force on Current",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-32",subject:"Physics",chapter:"Biot-Savart & Ampere's Law",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-33",subject:"Physics",chapter:"Magnetism & Matter",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-34",subject:"Physics",chapter:"Faraday's Laws & EMF",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-35",subject:"Physics",chapter:"AC Circuits & LCR",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ph-36",subject:"Physics",chapter:"Transformers",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-37",subject:"Physics",chapter:"Ray Optics & Mirrors",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-38",subject:"Physics",chapter:"Refraction & Lenses",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-39",subject:"Physics",chapter:"Wave Optics & Interference",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-40",subject:"Physics",chapter:"Diffraction & Polarisation",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-41",subject:"Physics",chapter:"Dual Nature of Radiation",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-42",subject:"Physics",chapter:"Atoms & Nuclei",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ph-43",subject:"Physics",chapter:"Radioactivity",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ph-44",subject:"Physics",chapter:"Semiconductors & Devices",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-01",subject:"Chemistry",chapter:"Mole Concept & Stoichiometry",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-02",subject:"Chemistry",chapter:"Atomic Structure",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-03",subject:"Chemistry",chapter:"Chemical Bonding & Hybridisation",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-04",subject:"Chemistry",chapter:"Gaseous State",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-05",subject:"Chemistry",chapter:"Liquid & Solid State",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-06",subject:"Chemistry",chapter:"Thermodynamics",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-07",subject:"Chemistry",chapter:"Chemical Equilibrium",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-08",subject:"Chemistry",chapter:"Ionic Equilibrium",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-09",subject:"Chemistry",chapter:"Redox Reactions",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-10",subject:"Chemistry",chapter:"Electrochemistry",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-11",subject:"Chemistry",chapter:"Chemical Kinetics",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-12",subject:"Chemistry",chapter:"Hydrogen & s-Block",questions:10,duration:15,difficulty:"easy",exam:"NEET/JEE"},
  { id:"ch-13",subject:"Chemistry",chapter:"p-Block: Group 13 & 14",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-14",subject:"Chemistry",chapter:"p-Block: Group 15, 16 & 17",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-15",subject:"Chemistry",chapter:"p-Block: Noble Gases (Group 18)",questions:10,duration:15,difficulty:"easy",exam:"NEET/JEE"},
  { id:"ch-16",subject:"Chemistry",chapter:"d & f Block Elements",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-17",subject:"Chemistry",chapter:"Coordination Compounds",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-18",subject:"Chemistry",chapter:"Basic Organic Chemistry",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-19",subject:"Chemistry",chapter:"Hydrocarbons",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-20",subject:"Chemistry",chapter:"Haloalkanes & Haloarenes",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-21",subject:"Chemistry",chapter:"Alcohols, Phenols & Ethers",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-22",subject:"Chemistry",chapter:"Aldehydes & Ketones",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-23",subject:"Chemistry",chapter:"Carboxylic Acids & Derivatives",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-24",subject:"Chemistry",chapter:"Amines",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-25",subject:"Chemistry",chapter:"Biomolecules & Polymers",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"ch-26",subject:"Chemistry",chapter:"Chemistry in Everyday Life",questions:10,duration:15,difficulty:"easy",exam:"NEET/JEE"},
  { id:"ch-27",subject:"Chemistry",chapter:"Solutions & Colligative Properties",questions:10,duration:15,difficulty:"hard",exam:"NEET/JEE"},
  { id:"ch-28",subject:"Chemistry",chapter:"Surface Chemistry",questions:10,duration:15,difficulty:"medium",exam:"NEET/JEE"},
  { id:"bi-01",subject:"Biology",chapter:"The Living World",questions:10,duration:15,difficulty:"easy",exam:"NEET"},
  { id:"bi-02",subject:"Biology",chapter:"Biological Classification",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-03",subject:"Biology",chapter:"Plant Kingdom",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-04",subject:"Biology",chapter:"Animal Kingdom",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-05",subject:"Biology",chapter:"Morphology of Flowering Plants",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-06",subject:"Biology",chapter:"Anatomy of Flowering Plants",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-07",subject:"Biology",chapter:"Structural Organisation in Animals",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-08",subject:"Biology",chapter:"Cell: The Unit of Life",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-09",subject:"Biology",chapter:"Biomolecules",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-10",subject:"Biology",chapter:"Cell Cycle & Cell Division",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-11",subject:"Biology",chapter:"Transport in Plants",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-12",subject:"Biology",chapter:"Mineral Nutrition",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-13",subject:"Biology",chapter:"Photosynthesis",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-14",subject:"Biology",chapter:"Respiration in Plants",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-15",subject:"Biology",chapter:"Plant Growth & Development",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-16",subject:"Biology",chapter:"Digestion & Absorption",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-17",subject:"Biology",chapter:"Breathing & Exchange of Gases",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-18",subject:"Biology",chapter:"Body Fluids & Circulation",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-19",subject:"Biology",chapter:"Excretory Products & Elimination",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-20",subject:"Biology",chapter:"Locomotion & Movement",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-21",subject:"Biology",chapter:"Neural Control & Coordination",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-22",subject:"Biology",chapter:"Chemical Coordination",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-23",subject:"Biology",chapter:"Reproduction in Organisms",questions:10,duration:15,difficulty:"easy",exam:"NEET"},
  { id:"bi-24",subject:"Biology",chapter:"Sexual Reproduction in Plants",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-25",subject:"Biology",chapter:"Human Reproduction",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-26",subject:"Biology",chapter:"Reproductive Health",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-27",subject:"Biology",chapter:"Principles of Inheritance",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-28",subject:"Biology",chapter:"Molecular Basis of Inheritance",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-29",subject:"Biology",chapter:"Evolution",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-30",subject:"Biology",chapter:"Human Health & Disease",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-31",subject:"Biology",chapter:"Microbes in Human Welfare",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-32",subject:"Biology",chapter:"Biotechnology: Principles",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-33",subject:"Biology",chapter:"Biotechnology & Its Applications",questions:10,duration:15,difficulty:"hard",exam:"NEET"},
  { id:"bi-34",subject:"Biology",chapter:"Organisms & Populations",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-35",subject:"Biology",chapter:"Ecosystem",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-36",subject:"Biology",chapter:"Biodiversity & Conservation",questions:10,duration:15,difficulty:"medium",exam:"NEET"},
  { id:"bi-37",subject:"Biology",chapter:"Environmental Issues",questions:10,duration:15,difficulty:"easy",exam:"NEET"},
  { id:"ma-01",subject:"Mathematics",chapter:"Sets, Relations & Functions",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-02",subject:"Mathematics",chapter:"Complex Numbers",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-03",subject:"Mathematics",chapter:"Sequences & Series",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-04",subject:"Mathematics",chapter:"Quadratic Equations",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-05",subject:"Mathematics",chapter:"Permutations & Combinations",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-06",subject:"Mathematics",chapter:"Binomial Theorem",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-07",subject:"Mathematics",chapter:"Mathematical Induction",questions:10,duration:15,difficulty:"easy",exam:"JEE"},
  { id:"ma-08",subject:"Mathematics",chapter:"Trigonometric Functions",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-09",subject:"Mathematics",chapter:"Inverse Trigonometric Functions",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-10",subject:"Mathematics",chapter:"Heights & Distances",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-11",subject:"Mathematics",chapter:"Straight Lines",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-12",subject:"Mathematics",chapter:"Circles",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-13",subject:"Mathematics",chapter:"Parabola",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-14",subject:"Mathematics",chapter:"Ellipse",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-15",subject:"Mathematics",chapter:"Hyperbola",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-16",subject:"Mathematics",chapter:"Limits & Continuity",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-17",subject:"Mathematics",chapter:"Differentiation",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-18",subject:"Mathematics",chapter:"Applications of Derivatives",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-19",subject:"Mathematics",chapter:"Integral Calculus",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-20",subject:"Mathematics",chapter:"Definite Integrals & Area",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-21",subject:"Mathematics",chapter:"Differential Equations",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-22",subject:"Mathematics",chapter:"Vectors",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-23",subject:"Mathematics",chapter:"3D Geometry",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-24",subject:"Mathematics",chapter:"Statistics & Measures",questions:10,duration:15,difficulty:"easy",exam:"JEE"},
  { id:"ma-25",subject:"Mathematics",chapter:"Probability",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-26",subject:"Mathematics",chapter:"Bayes Theorem & Distributions",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-27",subject:"Mathematics",chapter:"Matrices",questions:10,duration:15,difficulty:"medium",exam:"JEE"},
  { id:"ma-28",subject:"Mathematics",chapter:"Determinants",questions:10,duration:15,difficulty:"hard",exam:"JEE"},
  { id:"ma-29",subject:"Mathematics",chapter:"Linear Programming",questions:10,duration:15,difficulty:"easy",exam:"JEE"},
];

const MOCK_TESTS = [
  { id:"mock-neet-01",title:"NEET Full Mock Test — 1",exam:"NEET",questions:180,duration:200,subjects:"Physics + Chemistry + Biology"},
  { id:"mock-neet-02",title:"NEET Full Mock Test — 2",exam:"NEET",questions:180,duration:200,subjects:"Physics + Chemistry + Biology"},
  { id:"mock-neet-03",title:"NEET Full Mock Test — 3",exam:"NEET",questions:180,duration:200,subjects:"Physics + Chemistry + Biology"},
  { id:"mock-jee-01", title:"JEE Main Full Mock Test — 1",exam:"JEE Main",questions:90,duration:180,subjects:"Physics + Chemistry + Mathematics"},
  { id:"mock-jee-02", title:"JEE Main Full Mock Test — 2",exam:"JEE Main",questions:90,duration:180,subjects:"Physics + Chemistry + Mathematics"},
  { id:"mock-jee-03", title:"JEE Main Full Mock Test — 3",exam:"JEE Main",questions:90,duration:180,subjects:"Physics + Chemistry + Mathematics"},
  { id:"mock-jadv-01",title:"JEE Advanced Full Mock — 1",exam:"JEE Advanced",questions:60,duration:180,subjects:"Physics + Chemistry + Mathematics"},
  { id:"mock-jadv-02",title:"JEE Advanced Full Mock — 2",exam:"JEE Advanced",questions:60,duration:180,subjects:"Physics + Chemistry + Mathematics"},
  { id:"mock-neet-py1",title:"NEET 2024 PYQ Pattern Mock",exam:"NEET",questions:180,duration:200,subjects:"Physics + Chemistry + Biology"},
  { id:"mock-jee-py1", title:"JEE Main 2024 PYQ Pattern Mock",exam:"JEE Main",questions:90,duration:180,subjects:"Physics + Chemistry + Mathematics"},
];

const SUBJECT_COLORS: Record<string,string> = {
  Physics:"bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Chemistry:"bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  Biology:"bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Mathematics:"bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
};

const DIFF_COLORS = {easy:"success",medium:"warning",hard:"destructive"} as const;

interface Question {
  id: number;
  subject?: string;
  question: string;
  options: {A:string;B:string;C:string;D:string};
  correct: string;
  correctAnswer?: number;
  explanation: string;
}

type Stage = "list" | "generating" | "attempt" | "result";

export default function TestsPage() {
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [diffFilter, setDiffFilter]       = useState("All");
  const [search, setSearch]               = useState("");

  // Active test state
  const [stage, setStage]         = useState<Stage>("list");
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ]   = useState(0);
  const [answers, setAnswers]     = useState<Record<number,string>>({});

  // Generate panel state
  const [showGenChapter, setShowGenChapter] = useState(false);
  const [showGenMock, setShowGenMock]       = useState(false);
  const [genSubject, setGenSubject]         = useState("Physics");
  const [genChapter, setGenChapter]         = useState("");
  const [genQCount, setGenQCount]           = useState(10);
  const [genExam, setGenExam]               = useState("NEET");
  const [genMockQ, setGenMockQ]             = useState(30);

  const subjects = ["All","Physics","Chemistry","Biology","Mathematics"];
  const diffs    = ["All","easy","medium","hard"];

  const filteredTests = CHAPTER_TESTS.filter((t) => {
    const ms = subjectFilter==="All"||t.subject===subjectFilter;
    const md = diffFilter==="All"||t.difficulty===diffFilter;
    const mq = t.chapter.toLowerCase().includes(search.toLowerCase());
    return ms&&md&&mq;
  });

  // chapters for selected subject in generator
  const subjectChapters = CHAPTER_TESTS.filter((t)=>t.subject===genSubject).map((t)=>t.chapter);

  async function startTest(params:{type:"chapter"|"mock";chapter?:string;subject?:string;exam?:string;questionCount:number;title:string}) {
    setStage("generating");
    setTestTitle(params.title);
    setAnswers({});
    setCurrentQ(0);
    try {
      const res  = await fetch("/api/ai/generate-test",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({type:params.type,chapter:params.chapter,subject:params.subject,exam:params.exam,questionCount:params.questionCount}),
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      const normalized = data.questions.map((q: any, i: number) => ({
        ...q,
        id: q.id ?? i + 1,
        question: q.question ?? q.question_text ?? "",
        options: q.options ?? { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
        correct: q.correct ?? ["A","B","C","D"][q.correctAnswer ?? 0],
      }));
      setQuestions(normalized);
      setStage("attempt");
    } catch {
      setStage("list");
      alert("Could not generate test. Please try again.");
    }
  }

  const correct = questions.filter((q)=>answers[q.id]===q.correct).length;
  const wrong   = questions.filter((q)=>answers[q.id]&&answers[q.id]!==q.correct).length;
  const skipped = questions.filter((q)=>!answers[q.id]).length;
  const pct     = questions.length>0?Math.round((correct/questions.length)*100):0;

  // ── GENERATING SCREEN ──
  if(stage==="generating") return (
    <DashboardLayout role="student" title="Tests">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        <h2 className="font-display font-bold text-xl">Generating Your Test</h2>
        <p className="text-muted-foreground text-sm">{testTitle}</p>
        <p className="text-xs text-muted-foreground">This takes 15-20 seconds...</p>
      </div>
    </DashboardLayout>
  );

  // ── ATTEMPT SCREEN ──
  if(stage==="attempt"&&questions.length>0) {
    const q = questions[currentQ];
    return (
      <DashboardLayout role="student" title={testTitle}>
        <div className="max-w-3xl space-y-4">
          {/* Header */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-display font-bold text-sm">{testTitle}</p>
              <span className="text-xs text-muted-foreground">{Object.keys(answers).length}/{questions.length} answered</span>
            </div>
            <Progress value={(Object.keys(answers).length/questions.length)*100} className="h-1.5"/>
          </div>

          {/* Question pills */}
          <div className="bg-card rounded-xl border p-3 flex flex-wrap gap-1 max-h-28 overflow-y-auto">
            {questions.map((_q,i)=>(
              <button key={_q.id} onClick={()=>setCurrentQ(i)}
                className={cn("w-7 h-7 rounded-lg text-xs font-bold transition-all flex-shrink-0",
                  currentQ===i?"bg-primary text-primary-foreground":
                  answers[_q.id]?"bg-green-100 dark:bg-green-900/30 text-green-700":"bg-muted text-muted-foreground hover:bg-accent")}>
                {i+1}
              </button>
            ))}
          </div>

          {/* Question */}
          <div className="bg-card rounded-xl border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">Q{currentQ+1} of {questions.length}</span>
              {q.subject && <Badge variant="outline" className="text-xs">{q.subject}</Badge>}
            </div>
            <p className="text-sm font-medium leading-relaxed">{q.question}</p>
            <div className="space-y-2">
              {(["A","B","C","D"] as const).map((opt)=>(
                <button key={opt} onClick={()=>setAnswers(prev=>({...prev,[q.id]:opt}))}
                  className={cn("w-full flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-all",
                    answers[q.id]===opt?"border-primary bg-primary/10 font-medium":"border-border hover:border-primary/50 hover:bg-muted/50")}>
                  <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    answers[q.id]===opt?"bg-primary text-primary-foreground":"bg-muted")}>
                    {opt}
                  </span>
                  <span className="mt-0.5">{Array.isArray(q.options) ? q.options[["A","B","C","D"].indexOf(opt)] : (q.options as any)[opt]}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" onClick={()=>setCurrentQ(Math.max(0,currentQ-1))} disabled={currentQ===0}>
                <ArrowLeft className="h-4 w-4 mr-1"/>Previous
              </Button>
              {currentQ<questions.length-1?(
                <Button size="sm" onClick={()=>setCurrentQ(currentQ+1)}>
                  Next<ArrowRight className="h-4 w-4 ml-1"/>
                </Button>
              ):(
                <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1" onClick={()=>setStage("result")}>
                  <CheckSquare className="h-4 w-4"/>Submit All
                </Button>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── RESULT SCREEN ──
  if(stage==="result"&&questions.length>0) return (
    <DashboardLayout role="student" title="Test Result">
      <div className="max-w-3xl space-y-4">
        {/* Score */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-5 text-white text-center">
          <Trophy className="h-10 w-10 mx-auto mb-2 text-brand-200"/>
          <p className="text-5xl font-display font-bold">{pct}%</p>
          <p className="text-brand-200 text-sm mt-1">{testTitle}</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 rounded-xl p-2"><p className="text-xl font-bold text-green-300">{correct}</p><p className="text-xs text-brand-200">Correct</p></div>
            <div className="bg-white/10 rounded-xl p-2"><p className="text-xl font-bold text-red-300">{wrong}</p><p className="text-xs text-brand-200">Wrong</p></div>
            <div className="bg-white/10 rounded-xl p-2"><p className="text-xl font-bold text-brand-200">{skipped}</p><p className="text-xs text-brand-200">Skipped</p></div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-1" onClick={()=>setStage("list")}>
            <ArrowLeft className="h-4 w-4"/>Back to Tests
          </Button>
          <Button className="flex-1 gap-1" onClick={()=>startTest({type:"chapter",chapter:questions[0]?.subject,subject:questions[0]?.subject,questionCount:questions.length,title:testTitle})}>
            <RefreshCw className="h-4 w-4"/>Generate New Test
          </Button>
        </div>

        {/* All Q&A */}
        <p className="font-display font-bold">All Questions — Review</p>
        <div className="space-y-3">
          {questions.map((q,i)=>{
            const sa=answers[q.id];
            const ok=sa===q.correct;
            const wr=sa&&!ok;
            return(
              <div key={q.id} className={cn("rounded-xl border p-4 space-y-3",
                ok?"border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20":
                wr?"border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20":"border-border bg-muted/30")}>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-muted-foreground flex-shrink-0 mt-0.5">Q{i+1}.</span>
                  <p className="text-sm font-medium flex-1 leading-relaxed">{q.question}</p>
                  {ok&&<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0"/>}
                  {wr&&<XCircle className="h-5 w-5 text-red-500 flex-shrink-0"/>}
                  {!sa&&<AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0"/>}
                </div>
                <div className="grid gap-1">
                  {(["A","B","C","D"] as const).map((opt)=>(
                    <div key={opt} className={cn("flex items-start gap-2 px-3 py-1.5 rounded-lg text-xs",
                      opt===q.correct?"bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-semibold":
                      opt===sa&&wr?"bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200":"text-muted-foreground")}>
                      <span className="font-bold flex-shrink-0">{opt}.</span>
                      <span className="flex-1">{Array.isArray(q.options) ? q.options[["A","B","C","D"].indexOf(opt)] : (q.options as any)[opt]}</span>
                      {opt===q.correct&&<CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0"/>}
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500"/>
                    <span className="text-xs font-semibold">Explanation</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );

  // ── MAIN LIST ──
  return (
    <DashboardLayout role="student" title="Tests">
      <div className="space-y-5 max-w-5xl">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-display font-bold text-brand-600">{CHAPTER_TESTS.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Chapter Tests</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-display font-bold text-green-600">{MOCK_TESTS.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Full Mock Tests</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-display font-bold text-purple-600">∞</p>
            <p className="text-xs text-muted-foreground mt-0.5">Generate Unlimited</p>
          </div>
        </div>

        <Tabs defaultValue="chapter">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="chapter">Chapter</TabsTrigger>
            <TabsTrigger value="mock">Full Mock</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* ── CHAPTER TESTS ── */}
          <TabsContent value="chapter" className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <input type="text" placeholder="Search chapter..." value={search} onChange={(e)=>setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"/>
              </div>
              <div className="flex gap-1 flex-wrap">
                {subjects.map((s)=>(
                  <button key={s} onClick={()=>setSubjectFilter(s)}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      subjectFilter===s?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-accent")}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {diffs.map((d)=>(
                  <button key={d} onClick={()=>setDiffFilter(d)}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize",
                      diffFilter===d?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-accent")}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{filteredTests.length} tests found</p>
            <div className="space-y-2">
              {filteredTests.map((test)=>(
                <div key={test.id} className="bg-card rounded-xl border p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                  <div className={cn("px-2 py-1 rounded-lg text-xs font-bold border flex-shrink-0",SUBJECT_COLORS[test.subject])}>
                    {test.subject.slice(0,4)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{test.chapter}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3"/>{test.questions} Qs</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/>{test.duration} min</span>
                      <Badge variant={DIFF_COLORS[test.difficulty as keyof typeof DIFF_COLORS]} className="text-xs capitalize">{test.difficulty}</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="gap-1 flex-shrink-0"
                    onClick={()=>startTest({type:"chapter",chapter:test.chapter,subject:test.subject,questionCount:test.questions,title:`${test.chapter} — Test`})}>
                    <Play className="h-3.5 w-3.5"/>Start
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── MOCK TESTS ── */}
          <TabsContent value="mock" className="mt-4 space-y-3">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-sm text-amber-800 dark:text-amber-200">
              Full Mock Tests simulate actual exam conditions. Complete in one sitting.
            </div>
            {MOCK_TESTS.map((test)=>(
              <div key={test.id} className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-5 w-5 text-white"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      <Badge variant="outline" className="text-xs">{test.exam}</Badge>
                      <Badge variant="destructive" className="text-xs">Full Mock</Badge>
                    </div>
                    <p className="font-semibold text-sm">{test.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{test.subjects}</p>
                    <div className="flex gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3"/>{test.questions} Questions</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/>{test.duration} min</span>
                    </div>
                  </div>
                  <Button size="sm" className="gap-1 flex-shrink-0"
                    onClick={()=>startTest({type:"mock",exam:test.exam,questionCount:Math.min(test.questions,30),title:test.title})}>
                    <Play className="h-3.5 w-3.5"/>Start
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* ── GENERATE TEST ── */}
          <TabsContent value="generate" className="mt-4 space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-brand-50 dark:from-purple-950/30 dark:to-brand-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-purple-500"/>
                <p className="font-semibold text-sm">Generate Unlimited Tests</p>
              </div>
              <p className="text-xs text-muted-foreground">Already solved all questions? Generate a brand new test with fresh questions anytime.</p>
            </div>

            {/* Generate Chapter Test */}
            <div className="bg-card rounded-xl border overflow-hidden">
              <button onClick={()=>setShowGenChapter(!showGenChapter)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400"/>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Generate Chapter Test</p>
                    <p className="text-xs text-muted-foreground">Fresh questions for any chapter</p>
                  </div>
                </div>
                {showGenChapter?<ChevronUp className="h-5 w-5 text-muted-foreground"/>:<ChevronDown className="h-5 w-5 text-muted-foreground"/>}
              </button>

              {showGenChapter&&(
                <div className="p-4 border-t border-border space-y-3">
                  {/* Subject */}
                  <div>
                    <p className="text-xs font-medium mb-1.5">Subject</p>
                    <div className="flex flex-wrap gap-1">
                      {["Physics","Chemistry","Biology","Mathematics"].map((s)=>(
                        <button key={s} onClick={()=>{setGenSubject(s);setGenChapter("");}}
                          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            genSubject===s?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-accent")}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chapter */}
                  <div>
                    <p className="text-xs font-medium mb-1.5">Chapter</p>
                    <select value={genChapter} onChange={(e)=>setGenChapter(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select a chapter...</option>
                      {subjectChapters.map((c)=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Question count */}
                  <div>
                    <p className="text-xs font-medium mb-1.5">Number of Questions: {genQCount}</p>
                    <div className="flex gap-1 flex-wrap">
                      {[10,20,30,50].map((n)=>(
                        <button key={n} onClick={()=>setGenQCount(n)}
                          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            genQCount===n?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-accent")}>
                          {n} Questions
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full gap-2" disabled={!genChapter}
                    onClick={()=>startTest({type:"chapter",chapter:genChapter,subject:genSubject,questionCount:genQCount,title:`${genChapter} — Generated Test`})}>
                    <Sparkles className="h-4 w-4"/>Generate {genQCount} Questions for {genChapter||"selected chapter"}
                  </Button>
                </div>
              )}
            </div>

            {/* Generate Mock Test */}
            <div className="bg-card rounded-xl border overflow-hidden">
              <button onClick={()=>setShowGenMock(!showGenMock)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-green-600 dark:text-green-400"/>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Generate Full Mock Test</p>
                    <p className="text-xs text-muted-foreground">Fresh full-length mock for NEET or JEE</p>
                  </div>
                </div>
                {showGenMock?<ChevronUp className="h-5 w-5 text-muted-foreground"/>:<ChevronDown className="h-5 w-5 text-muted-foreground"/>}
              </button>

              {showGenMock&&(
                <div className="p-4 border-t border-border space-y-3">
                  {/* Exam */}
                  <div>
                    <p className="text-xs font-medium mb-1.5">Exam</p>
                    <div className="flex flex-wrap gap-1">
                      {["NEET","JEE Main","JEE Advanced"].map((e)=>(
                        <button key={e} onClick={()=>setGenExam(e)}
                          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            genExam===e?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-accent")}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question count */}
                  <div>
                    <p className="text-xs font-medium mb-1.5">Number of Questions: {genMockQ}</p>
                    <div className="flex gap-1 flex-wrap">
                      {[30,60,90].map((n)=>(
                        <button key={n} onClick={()=>setGenMockQ(n)}
                          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            genMockQ===n?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-accent")}>
                          {n} Questions
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Note: Full 180/90 question mocks take longer to generate</p>
                  </div>

                  <Button className="w-full gap-2 bg-green-600 hover:bg-green-700"
                    onClick={()=>startTest({type:"mock",exam:genExam,questionCount:genMockQ,title:`${genExam} Generated Mock Test`})}>
                    <Sparkles className="h-4 w-4"/>Generate {genExam} Mock — {genMockQ} Questions
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── HISTORY ── */}
          <TabsContent value="history" className="mt-4">
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BarChart2 className="h-12 w-12 mb-3 opacity-30"/>
              <p className="font-medium">No tests attempted yet</p>
              <p className="text-xs mt-1">Start a chapter test or full mock to see your history</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
