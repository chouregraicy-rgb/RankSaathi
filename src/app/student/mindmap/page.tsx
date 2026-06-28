// src/app/student/mindmap/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loader2, BookOpen, Zap, FlaskConical, Calculator, Lightbulb, Star, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
// biology diagrams handled inline
import { cn } from "@/utils";

// ── SYLLABUS ─────────────────────────────────────────────────────────────────
const SYLLABUS: Record<string, string[]> = {
  Physics: [
    "Physical World & Units", "Motion in a Straight Line", "Motion in a Plane",
    "Laws of Motion", "Work, Energy & Power", "System of Particles & Rotational Motion",
    "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids",
    "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory of Gases",
    "Oscillations", "Waves", "Electric Charges & Fields", "Electrostatic Potential",
    "Current Electricity", "Moving Charges & Magnetism", "Magnetism & Matter",
    "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves",
    "Ray Optics", "Wave Optics", "Dual Nature of Matter", "Atoms", "Nuclei",
    "Semiconductor Electronics",
  ],
  Chemistry: [
    "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements",
    "Chemical Bonding & Molecular Structure", "States of Matter", "Thermodynamics",
    "Equilibrium", "Redox Reactions", "Hydrogen", "s-Block Elements",
    "p-Block Elements (Group 13-14)", "Organic Chemistry — Basic Principles",
    "Hydrocarbons", "Environmental Chemistry", "Solid State", "Solutions",
    "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "d and f Block Elements",
    "Coordination Compounds", "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers",
    "Aldehydes, Ketones & Acids", "Amines", "Biomolecules", "Polymers",
  ],
  Biology: [
    "The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom",
    "Morphology of Flowering Plants", "Anatomy of Flowering Plants",
    "Structural Organisation in Animals", "Cell — The Unit of Life",
    "Biomolecules", "Cell Cycle & Cell Division", "Transport in Plants",
    "Mineral Nutrition", "Photosynthesis", "Respiration in Plants",
    "Plant Growth & Development", "Digestion & Absorption",
    "Breathing & Exchange of Gases", "Body Fluids & Circulation",
    "Excretory Products & Elimination", "Locomotion & Movement",
    "Neural Control & Coordination", "Chemical Coordination", "Reproduction in Organisms",
    "Sexual Reproduction in Flowering Plants", "Human Reproduction",
    "Reproductive Health", "Principles of Inheritance", "Molecular Basis of Inheritance",
    "Evolution", "Human Health & Disease", "Microbes in Human Welfare",
    "Biotechnology — Principles & Processes", "Biotechnology & Its Applications",
    "Organisms & Populations", "Ecosystem", "Biodiversity",
  ],
  Mathematics: [
    "Sets & Functions", "Trigonometric Functions", "Complex Numbers",
    "Linear Inequalities", "Permutations & Combinations", "Binomial Theorem",
    "Sequences & Series", "Straight Lines", "Conic Sections",
    "3D Geometry — Intro", "Limits & Derivatives", "Mathematical Reasoning",
    "Statistics", "Probability", "Relations & Functions", "Inverse Trigonometry",
    "Matrices", "Determinants", "Continuity & Differentiability",
    "Application of Derivatives", "Integrals", "Application of Integrals",
    "Differential Equations", "Vector Algebra", "3D Geometry",
    "Linear Programming", "Probability (Advanced)",
  ],
};

const SUBJECT_META = {
  Physics:     { icon: Zap,          color: "#3b82f6", badge: "bg-blue-500/20 text-blue-300" },
  Chemistry:   { icon: FlaskConical, color: "#f59e0b", badge: "bg-amber-500/20 text-amber-300" },
  Biology:     { icon: BookOpen,     color: "#10b981", badge: "bg-emerald-500/20 text-emerald-300" },
  Mathematics: { icon: Calculator,   color: "#8b5cf6", badge: "bg-violet-500/20 text-violet-300" },
};

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface MindMapNode {
  id: string;
  label: string;
  type: "root" | "concept" | "subtopic";
  formula?: string | null;
  note?: string;
  children: MindMapNode[];
  _collapsed?: boolean;
}

interface MindMapData {
  chapter: string;
  subject: string;
  color: string;
  nodes: MindMapNode;
  diagram?: { title: string; description: string; labels: string[] };
  keyFormulas: { label: string; formula: string; unit?: string }[];
  mnemonics: string[];
  neetWeightage: string;
  importantTopics: string[];
}

// ── BIOLOGY DIAGRAM ───────────────────────────────────────────────────────────
// Direct Supabase image map — no API call needed
const BASE = "https://jrdpxdalwvmcffmfqajk.supabase.co/storage/v1/object/public/biology-diagrams";
const BIO_IMAGES: Record<string, { url: string; title: string; labels: string[] }> = {
  "Cell — The Unit of Life":                  { url: BASE+"/Animal_Cell.jpg",                      title: "Animal Cell Structure",         labels: ["Nucleus","Mitochondria","Golgi Apparatus","ER","Cell Membrane","Centrioles"] },
  "Cell Cycle & Cell Division":               { url: BASE+"/Animal_cell_cycle-en.svg",             title: "Animal Cell Cycle",             labels: ["Prophase","Metaphase","Anaphase","Telophase","Interphase"] },
  "Structural Organisation in Animals":       { url: BASE+"/Neuron.png",                           title: "Neuron Structure",              labels: ["Dendrites","Cell Body","Axon","Myelin Sheath","Node of Ranvier","Synaptic Knob"] },
  "Human Health & Disease":                   { url: BASE+"/Antibody.svg.png",                     title: "Antibody Structure",            labels: ["Heavy Chain","Light Chain","Antigen Binding Site","Fc Region"] },
  "Ecosystem":                                { url: BASE+"/Aquatic_food_web.jpg",                 title: "Aquatic Food Web",              labels: ["Producers","Primary Consumers","Secondary Consumers","Decomposers"] },
  "Biological Classification":                { url: BASE+"/Biological_classification.png",         title: "Five Kingdom Classification",   labels: ["Monera","Protista","Fungi","Plantae","Animalia"] },
  "Body Fluids & Circulation":                { url: BASE+"/human_heart.svg.png",                  title: "Human Heart",                   labels: ["Right Atrium","Left Atrium","Right Ventricle","Left Ventricle","Aorta","Tricuspid","Bicuspid"] },
  "Photosynthesis":                           { url: BASE+"/Chloroplast.png",                      title: "Chloroplast Structure",         labels: ["Outer Membrane","Thylakoid","Grana","Stroma","Stroma Lamellae"] },
  "Digestion & Absorption":                   { url: BASE+"/Digestive.svg.png",                    title: "Human Digestive System",        labels: ["Mouth","Oesophagus","Stomach","Small Intestine","Liver","Pancreas"] },
  "Principles of Inheritance":                { url: BASE+"/Punnett_square_mendel_flowers.svg.png",title: "Punnett Square",                labels: ["Dominant","Recessive","F1","F2","3:1 Ratio","Homozygous","Heterozygous"] },
  "Molecular Basis of Inheritance":           { url: BASE+"/DNA.svg.png",                          title: "DNA Double Helix",              labels: ["Adenine-Thymine","Guanine-Cytosine","Phosphate","Deoxyribose","Hydrogen Bonds"] },
  "Chemical Coordination":                    { url: BASE+"/endocrine_system.jpg",                 title: "Human Endocrine System",        labels: ["Hypothalamus","Pituitary","Thyroid","Adrenal","Pancreas","Gonads"] },
  "Neural Control & Coordination":            { url: BASE+"/Three_Main_Layers_of_the_Eye.png",     title: "Human Eye — Layers",            labels: ["Sclera","Choroid","Retina","Cornea","Lens","Iris","Optic Nerve","Fovea"] },
  "Morphology of Flowering Plants":           { url: BASE+"/Mature_flower.svg.png",                title: "Mature Flower Structure",       labels: ["Sepal","Petal","Stamen","Pistil","Ovary","Stigma","Style"] },
  "Sexual Reproduction in Flowering Plants":  { url: BASE+"/Mature_flower.svg.png",                title: "Flower — Sexual Reproduction",  labels: ["Stamen","Pistil","Pollen","Ovule","Fertilization","Endosperm"] },
  "Mineral Nutrition":                        { url: BASE+"/Nitrogen_Cycle.svg.png",               title: "Nitrogen Cycle",                labels: ["Nitrogen Fixation","Nitrification","Denitrification","Ammonification"] },
  "Transport in Plants":                      { url: BASE+"/Osmosis_diagram.svg.png",              title: "Osmosis Diagram",               labels: ["Hypotonic","Hypertonic","Isotonic","Water Potential","Semi-permeable Membrane"] },
  "Evolution":                                { url: BASE+"/Phylogenetic.svg.png",                 title: "Phylogenetic Tree",             labels: ["Common Ancestor","Divergence","Speciation","Clade","Branch Point"] },
  "Anatomy of Flowering Plants":              { url: BASE+"/Plant_cell_structure.png",             title: "Plant Cell Structure",          labels: ["Cell Wall","Chloroplast","Central Vacuole","Nucleus","Plasmodesmata"] },
  "Biotechnology — Principles & Processes":   { url: BASE+"/Plasmid.svg.png",                      title: "Plasmid / Recombinant DNA",     labels: ["Origin of Replication","Antibiotic Resistance","Restriction Site","Insert Gene"] },
  "Biotechnology & Its Applications":         { url: BASE+"/plasmid.svg (2).png",                  title: "Recombinant DNA Applications",  labels: ["Gene of Interest","Vector","Host Cell","Selectable Marker"] },
  "Locomotion & Movement":                    { url: BASE+"/Sarcomere.svg.png",                    title: "Sarcomere Structure",           labels: ["Z-line","A-band","I-band","H-zone","Actin","Myosin","M-line"] },
  "Breathing & Exchange of Gases":            { url: BASE+"/Respiratory_system.svg.png",           title: "Human Respiratory System",      labels: ["Nasal Cavity","Trachea","Bronchus","Bronchioles","Alveoli","Diaphragm"] },
  "Organisms & Populations":                  { url: BASE+"/TrophicWeb.jpg",                       title: "Trophic Web",                   labels: ["Producers","Herbivores","Carnivores","Omnivores","Decomposers"] },
  "Excretory Products & Elimination":         { url: BASE+"/kindey.png.png",                       title: "Human Kidney",                  labels: ["Cortex","Medulla","Renal Pelvis","Ureter","Pyramid","Nephron"] },
};

function getBioImage(chapter: string) {
  return BIO_IMAGES[chapter] || null;
}

function BiologyDiagram({ chapter, fallback, color }: {
  chapter: string;
  fallback?: MindMapData["diagram"];
  color: string;
}) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [chapter]);

  const img = getBioImage(chapter);

  if (img && !imgError) return (
    <div className="rounded-2xl border border-emerald-500/20 bg-white p-4 space-y-3">
      <p className="text-sm font-semibold text-emerald-700">📊 {img.title}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.title}
        className="w-full max-h-[520px] object-contain rounded-xl bg-white"
        onError={() => setImgError(true)}
      />
      <div className="flex flex-wrap gap-1.5">
        {img.labels.map((l) => (
          <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">{l}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center text-emerald-400/50 text-sm">
      No diagram available for this chapter yet.
    </div>
  );
}

// ── FORMULA CARD ──────────────────────────────────────────────────────────────
function FormulaCard({ label, formula, unit }: { label: string; formula: string; unit?: string }) {
  return (
    <div className="bg-[#0f0f1a] border border-blue-500/20 rounded-xl p-3 space-y-1.5">
      <p className="text-xs text-blue-400 font-semibold">{label}</p>
      <div className="font-mono text-sm text-white bg-blue-500/10 rounded-lg px-3 py-2 text-center tracking-wide">
        {formula}
      </div>
      {unit && <p className="text-xs text-muted-foreground text-center">Unit: {unit}</p>}
    </div>
  );
}

// ── INTERACTIVE MIND MAP ──────────────────────────────────────────────────────
function MindMapCanvas({ data, color }: { data: MindMapNode; color: string }) {
  const [nodes, setNodes] = useState<MindMapNode>(data);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => { setNodes(data); setZoom(1); setPan({ x: 0, y: 0 }); }, [data]);

  const toggleNode = (id: string) => {
    const toggle = (node: MindMapNode): MindMapNode => ({
      ...node,
      _collapsed: node.id === id ? !node._collapsed : node._collapsed,
      children: node.children.map(toggle),
    });
    setNodes((prev) => toggle(prev));
  };

  interface PositionedNode extends MindMapNode { x: number; y: number; depth: number; children: PositionedNode[]; }

  const positionNodes = useCallback((node: MindMapNode, depth = 0, index = 0, total = 1): PositionedNode => {
    const W = 160;
    const angle = total > 1 ? (index / (total - 1) - 0.5) * Math.PI * 1.0 : 0;
    const r = depth * W;
    const x = depth === 0 ? 0 : Math.cos(angle) * r;
    const y = depth === 0 ? 0 : Math.sin(angle) * r;
    const visibleChildren = node._collapsed ? [] : node.children;
    return {
      ...node, x, y, depth,
      children: visibleChildren.map((child, i) =>
        positionNodes(child, depth + 1, i, visibleChildren.length)
      ) as PositionedNode[],
    };
  }, []);

  const flattenNodes = (node: PositionedNode, parentX = 0, parentY = 0): { node: PositionedNode; absX: number; absY: number }[] => {
    const absX = node.depth === 0 ? node.x : parentX + node.x;
    const absY = node.depth === 0 ? node.y : parentY + node.y;
    return [
      { node, absX, absY },
      ...node.children.flatMap((child) => flattenNodes(child as PositionedNode, absX, absY)),
    ];
  };

  const positioned = positionNodes(nodes);
  const flat = flattenNodes(positioned);

  const nodeW = (type: string) => type === "root" ? 130 : type === "concept" ? 110 : 95;
  const nodeH = (type: string) => type === "root" ? 44 : 36;

  const onMouseDown = (e: React.MouseEvent) => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan(prev => ({ x: prev.x + e.clientX - lastPos.current.x, y: prev.y + e.clientY - lastPos.current.y }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { isDragging.current = false; };

  // Get parent positions for edge drawing
  const edgeData = flat.slice(1).map(({ node, absX, absY }) => {
    const parentFlat = flat.find(f => {
      const pNode = f.node as PositionedNode;
      return pNode.children?.some((c: any) => c.id === node.id);
    });
    return { node, absX, absY, parentX: parentFlat?.absX ?? 0, parentY: parentFlat?.absY ?? 0 };
  });

  return (
    <div className="relative w-full h-[520px] bg-[#0a0a12] rounded-2xl border border-white/5 overflow-hidden select-none">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <ZoomIn className="h-4 w-4" />
        </button>
        <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <ZoomOut className="h-4 w-4" />
        </button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <p className="absolute bottom-3 left-3 text-xs text-white/20 z-10">Click nodes to expand/collapse · Drag to pan</p>

      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.06"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGrad)"/>

        <g transform={`translate(${380 + pan.x}, ${260 + pan.y}) scale(${zoom})`}>
          {/* Edges */}
          {edgeData.map(({ node, absX, absY, parentX, parentY }) => (
            <line
              key={`edge_${node.id}`}
              x1={parentX} y1={parentY}
              x2={absX} y2={absY}
              stroke={color}
              strokeOpacity={node.depth === 1 ? 0.4 : 0.2}
              strokeWidth={node.depth === 1 ? 2 : 1}
              strokeDasharray={node.depth > 1 ? "4 3" : "none"}
            />
          ))}

          {/* Nodes */}
          {flat.map(({ node, absX, absY }) => {
            const w = nodeW(node.type);
            const h = nodeH(node.type);
            const hasKids = node.children.length > 0;
            return (
              <g
                key={node.id}
                transform={`translate(${absX}, ${absY})`}
                onClick={() => hasKids && toggleNode(node.id)}
                style={{ cursor: hasKids ? "pointer" : "default" }}
              >
                {node.type === "root" && (
                  <ellipse cx={0} cy={0} rx={w * 0.65} ry={h * 0.9} fill={color} opacity={0.12}/>
                )}
                <rect
                  x={-w / 2} y={-h / 2} width={w} height={h}
                  rx={node.type === "root" ? 12 : node.type === "concept" ? 10 : 8}
                  fill={node.type === "root" ? color : node.type === "concept" ? "#1a1a2e" : "#111118"}
                  stroke={color}
                  strokeOpacity={node.type === "root" ? 1 : node.type === "concept" ? 0.5 : 0.2}
                  strokeWidth={node.type === "root" ? 2 : 1}
                />
                <foreignObject x={-w / 2 + 5} y={-h / 2 + 3} width={w - 10} height={h - 6}>
                  <div
                    style={{
                      fontSize: node.type === "root" ? "11px" : "10px",
                      fontWeight: node.type === "root" ? 700 : node.type === "concept" ? 600 : 400,
                      color: node.type === "root" ? "#fff" : node.type === "concept" ? "#e2e8f0" : "#94a3b8",
                      lineHeight: 1.25,
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      wordBreak: "break-word",
                    }}
                  >
                    {node.label}
                  </div>
                </foreignObject>
                {node._collapsed && (
                  <circle cx={w / 2 - 5} cy={-h / 2 + 5} r={4} fill={color} opacity={0.8}/>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function MindMapPage() {
  const [subject, setSubject] = useState<keyof typeof SYLLABUS>("Physics");
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mindmap, setMindmap] = useState<MindMapData | null>(null);
  const [activePanel, setActivePanel] = useState<"map" | "formulas" | "diagram" | "mnemonics">("map");

  const meta = SUBJECT_META[subject];
  const Icon = meta.icon;

  const generate = async () => {
    if (!chapter) return;
    setLoading(true);
    setError("");
    setMindmap(null);
    try {
      const res = await fetch("/api/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, chapter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMindmap(data.mindmap);
      setActivePanel("map");
    } catch (e: any) {
      setError(e.message || "Failed to generate mind map");
    } finally {
      setLoading(false);
    }
  };

  const weightageColor =
    mindmap?.neetWeightage === "High" ? "text-red-400 bg-red-500/10 border-red-500/20" :
    mindmap?.neetWeightage === "Medium" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
    "text-green-400 bg-green-500/10 border-green-500/20";

  const isBiology = subject === "Biology";
  const showDiagramTab = isBiology;
  const showFormulasTab = (subject === "Physics" || subject === "Mathematics") && mindmap && mindmap.keyFormulas.length > 0;

  const tabs = [
    { id: "map", label: "Mind Map", show: !!mindmap },
    { id: "formulas", label: "Formulas", show: !!showFormulasTab },
    { id: "diagram", label: "Diagram", show: !!showDiagramTab },
    { id: "mnemonics", label: "Mnemonics", show: !!mindmap },
  ].filter(t => t.show);

  return (
    <DashboardLayout role="student" title="Mind Maps">
      <div className="max-w-5xl space-y-5">

        {/* Selector card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-white/5 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: meta.color + "20" }}>
              <Icon className="h-5 w-5" style={{ color: meta.color }} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Interactive Mind Maps</h2>
              <p className="text-xs text-white/40">AI-generated · Click nodes to expand · Realistic diagrams</p>
            </div>
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {(Object.keys(SYLLABUS) as (keyof typeof SYLLABUS)[]).map((s) => {
              const m = SUBJECT_META[s];
              const SI = m.icon;
              return (
                <button
                  key={s}
                  onClick={() => { setSubject(s); setChapter(""); setMindmap(null); setError(""); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
                  style={subject === s
                    ? { borderColor: m.color, backgroundColor: m.color + "15", color: m.color }
                    : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                  }
                >
                  <SI className="h-3.5 w-3.5" />
                  {s}
                </button>
              );
            })}
          </div>

          {/* Chapter + Generate */}
          <div className="flex gap-3">
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="" disabled className="bg-[#1a1a2e]">Select a chapter...</option>
              {SYLLABUS[subject].map((ch) => (
                <option key={ch} value={ch} className="bg-[#1a1a2e]">{ch}</option>
              ))}
            </select>
            <button
              onClick={generate}
              disabled={!chapter || loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all flex items-center gap-2 flex-shrink-0"
              style={{ backgroundColor: meta.color }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: meta.color }} />
            <div className="text-center">
              <p className="text-white/60 text-sm font-medium">AI is mapping {chapter}...</p>
              <p className="text-white/30 text-xs mt-1">Building nodes, formulas and diagrams</p>
            </div>
          </div>
        )}

        {/* Results */}
        {mindmap && !loading && (
          <div className="space-y-4">

            {/* Chapter header */}
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <h3 className="font-bold text-white text-lg">{mindmap.chapter}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-semibold", weightageColor)}>
                    {mindmap.neetWeightage} Weightage
                  </span>
                  {mindmap.importantTopics.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel tabs */}
            {tabs.length > 0 && (
              <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePanel(tab.id as typeof activePanel)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={activePanel === tab.id
                      ? { backgroundColor: meta.color + "30", color: meta.color }
                      : { color: "rgba(255,255,255,0.4)" }
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Mind Map */}
            {activePanel === "map" && (
              <MindMapCanvas data={mindmap.nodes} color={meta.color} />
            )}

            {/* Formulas */}
            {activePanel === "formulas" && showFormulasTab && (
              <div className="space-y-3">
                <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Key Formulas — {mindmap.chapter}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mindmap.keyFormulas.map((f, i) => (
                    <FormulaCard key={i} label={f.label} formula={f.formula} unit={f.unit} />
                  ))}
                </div>
              </div>
            )}

            {/* Biology Diagram */}
            {activePanel === "diagram" && isBiology && (
              <BiologyDiagram chapter={mindmap?.chapter ?? chapter} fallback={mindmap?.diagram} color={meta.color} />
            )}

            {/* Mnemonics */}
            {activePanel === "mnemonics" && (
              <div className="space-y-3">
                <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Memory Tricks — {mindmap.chapter}</p>
                {mindmap.mnemonics.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-6">No mnemonics generated for this chapter.</p>
                ) : (
                  mindmap.mnemonics.map((m, i) => (
                    <div key={i} className="flex gap-3 bg-[#0f0f1a] border border-white/5 rounded-xl p-4">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: meta.color + "20" }}>
                        <Lightbulb className="h-3.5 w-3.5" style={{ color: meta.color }} />
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{m}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Important topics */}
            <div className="bg-[#0a0a12] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-white/30 font-semibold uppercase tracking-wider mb-3">
                <Star className="inline h-3 w-3 mr-1" />Important for {isBiology ? "NEET" : "NEET/JEE"}
              </p>
              <div className="flex flex-wrap gap-2">
                {mindmap.importantTopics.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full border text-white/60 border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!mindmap && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: meta.color + "15" }}>
              <Icon className="h-8 w-8" style={{ color: meta.color }} />
            </div>
            <div>
              <p className="text-white/50 font-medium">Select a chapter to generate its mind map</p>
              <p className="text-white/25 text-sm mt-1">
                {isBiology
                  ? "AI mind map + realistic anatomical diagrams + mnemonics"
                  : "AI mind map + formulas + memory tricks"}
              </p>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}