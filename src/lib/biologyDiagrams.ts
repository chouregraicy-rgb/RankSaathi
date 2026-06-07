// src/lib/biologyDiagrams.ts
// Biology diagrams — Wikimedia real images (primary) + hand-crafted SVG fallbacks

export interface DiagramData {
  title: string;
  svg: string;
  labels: string[];
  description: string;
  imageUrl?: string;
  credit?: string;
}

// Proxy helper — bypasses Wikimedia hotlink protection via our API route
const W = (url: string) => `/api/imgproxy?url=${encodeURIComponent(url)}`;

// ── WIKIMEDIA REAL IMAGES (primary) ───────────────────────────────────────────
const WIKIMEDIA: Record<string, DiagramData> = {
  "Cell — The Unit of Life": {
    title: "Animal Cell Structure",
    description: "Detailed animal cell showing all major organelles as per NCERT Biology",
    labels: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum", "Cell Membrane", "Ribosome", "Lysosome"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Animal_Cell.svg/1200px-Animal_Cell.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Photosynthesis": {
    title: "Chloroplast Structure",
    description: "Cross-section of chloroplast showing thylakoid, grana, stroma and double membrane",
    labels: ["Outer Membrane", "Inner Membrane", "Thylakoid", "Grana", "Stroma", "Stroma Lamellae"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Simple_diagram_of_a_chloroplast.svg/1200px-Simple_diagram_of_a_chloroplast.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Biomolecules": {
    title: "Mitochondria Structure",
    description: "Cross-section of mitochondria showing cristae, matrix, inner and outer membranes",
    labels: ["Outer Membrane", "Inner Membrane", "Cristae", "Matrix", "Intermembrane Space", "DNA"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mitochondrion_structure.svg/1200px-Mitochondrion_structure.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Body Fluids & Circulation": {
    title: "Human Heart — Internal Structure",
    description: "Four-chambered human heart showing atria, ventricles, valves and major blood vessels",
    labels: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle", "Aorta", "Pulmonary Artery", "Tricuspid Valve", "Bicuspid Valve"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg/1200px-Diagram_of_the_human_heart_%28cropped%29.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Excretory Products & Elimination": {
    title: "Human Kidney — Longitudinal Section",
    description: "Longitudinal section of human kidney showing cortex, medulla, pelvis and ureter",
    labels: ["Cortex", "Medulla", "Renal Pelvis", "Ureter", "Pyramid", "Renal Artery", "Renal Vein"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kidney_section.jpg/800px-Kidney_section.jpg"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Neural Control & Coordination": {
    title: "Structure of the Human Eye",
    description: "Cross-section of human eye showing cornea, lens, retina, optic nerve and chambers",
    labels: ["Cornea", "Lens", "Retina", "Optic Nerve", "Iris", "Pupil", "Vitreous Humour", "Sclera"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Schematic_diagram_of_the_human_eye_en.svg/1200px-Schematic_diagram_of_the_human_eye_en.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Anatomy of Flowering Plants": {
    title: "T.S. of Dicot Stem",
    description: "Transverse section of dicot stem showing epidermis, cortex, vascular bundles and pith",
    labels: ["Epidermis", "Cortex", "Endodermis", "Pericycle", "Xylem", "Phloem", "Pith"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Dicot_stem_labeled.svg/800px-Dicot_stem_labeled.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Digestion & Absorption": {
    title: "Human Digestive System",
    description: "Complete human alimentary canal from mouth to rectum with accessory glands",
    labels: ["Mouth", "Oesophagus", "Stomach", "Small Intestine", "Large Intestine", "Liver", "Pancreas", "Rectum"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_en.svg/800px-Digestive_system_diagram_en.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Breathing & Exchange of Gases": {
    title: "Human Respiratory System",
    description: "Human lungs, trachea, bronchi, bronchioles and alveoli structure",
    labels: ["Nasal Cavity", "Trachea", "Bronchus", "Bronchioles", "Alveoli", "Diaphragm", "Left Lung", "Right Lung"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Respiratory_system_complete_en.svg/800px-Respiratory_system_complete_en.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Molecular Basis of Inheritance": {
    title: "DNA Double Helix",
    description: "Watson-Crick DNA double helix model showing base pairs and sugar-phosphate backbone",
    labels: ["Adenine-Thymine", "Guanine-Cytosine", "Phosphate Group", "Deoxyribose Sugar", "Hydrogen Bonds", "Major Groove"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/DNA_Structure%2BKey%2BLabelled.pn_NoBB.png/800px-DNA_Structure%2BKey%2BLabelled.pn_NoBB.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Locomotion & Movement": {
    title: "Human Skeletal System",
    description: "Human skeleton showing major bones, joints and skeletal structure",
    labels: ["Skull", "Vertebral Column", "Rib Cage", "Femur", "Tibia", "Humerus", "Radius", "Ulna"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Human_skeleton_front_en.svg/600px-Human_skeleton_front_en.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Human Reproduction": {
    title: "Female Reproductive System",
    description: "Female reproductive organs showing ovary, fallopian tube, uterus and vagina",
    labels: ["Ovary", "Fallopian Tube", "Uterus", "Cervix", "Vagina", "Endometrium", "Follicle"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Scheme_female_reproductive_system-en.svg/800px-Scheme_female_reproductive_system-en.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
  "Principles of Inheritance": {
    title: "Monohybrid Cross — Mendel's Experiment",
    description: "Punnett square showing monohybrid cross and 3:1 phenotypic ratio",
    labels: ["Dominant Allele", "Recessive Allele", "F1 Generation", "F2 Generation", "Phenotype Ratio", "Genotype"],
    imageUrl: W("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mendelian_inheritance_-_pea_colour.svg/800px-Mendelian_inheritance_-_pea_colour.svg.png"),
    credit: "Wikimedia Commons (CC BY-SA)", svg: "",
  },
};

// ── SVG FALLBACKS (shown if Wikimedia image fails to load) ────────────────────
const SVG_FALLBACKS: Record<string, DiagramData> = {

  "Cell — The Unit of Life": {
    title: "Animal Cell — Internal Structure",
    description: "Cross-section of a typical animal cell showing major organelles",
    labels: ["Nucleus", "Mitochondria", "Golgi Body", "Ribosome", "Cell Membrane", "Cytoplasm"],
    svg: `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<ellipse cx="250" cy="195" rx="220" ry="170" fill="#e8f5e9" stroke="#2e7d32" stroke-width="4"/>
<ellipse cx="240" cy="185" rx="70" ry="58" fill="#bbdefb" stroke="#1565c0" stroke-width="3"/>
<ellipse cx="240" cy="185" rx="70" ry="58" fill="none" stroke="#1e88e5" stroke-width="1.5" stroke-dasharray="5,3"/>
<circle cx="248" cy="180" r="18" fill="#1565c0" opacity="0.7"/>
<text x="234" y="184" font-size="9" fill="white" font-weight="bold">Nucleolus</text>
<line x1="310" y1="155" x2="360" y2="130" stroke="#1565c0" stroke-width="1.2"/>
<text x="362" y="127" font-size="11" fill="#1565c0" font-weight="bold">Nucleus</text>
<ellipse cx="130" cy="130" rx="38" ry="22" fill="#fff9c4" stroke="#f57f17" stroke-width="2"/>
<path d="M108,130 Q120,118 132,130 Q144,142 156,130" fill="none" stroke="#f57f17" stroke-width="1.5"/>
<text x="52" y="77" font-size="11" fill="#f57f17" font-weight="bold">Mitochondria</text>
<g transform="translate(340,230)">
<path d="M-40,0 Q-10,-12 20,0" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M-35,10 Q-5,-2 25,10" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M-30,20 Q0,8 30,20" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<circle cx="28" cy="5" r="7" fill="#ce93d8" stroke="#7b1fa2"/>
</g>
<text x="392" y="197" font-size="11" fill="#7b1fa2" font-weight="bold">Golgi Body</text>
<path d="M160,250 Q175,240 190,255 Q205,270 220,255 Q235,240 250,255" fill="none" stroke="#00695c" stroke-width="2.5"/>
<text x="90" y="314" font-size="11" fill="#00695c" font-weight="bold">Rough ER</text>
<circle cx="350" cy="155" r="4" fill="#c62828"/>
<circle cx="360" cy="148" r="4" fill="#c62828"/>
<circle cx="355" cy="162" r="4" fill="#c62828"/>
<text x="382" y="117" font-size="11" fill="#c62828" font-weight="bold">Ribosomes</text>
<text x="392" y="310" font-size="11" fill="#2e7d32" font-weight="bold">Cell Membrane</text>
</svg>`,
  },

  "Neural Control & Coordination": {
    title: "Structure of a Neuron",
    description: "Multipolar neuron showing dendrites, cell body, axon, and myelin sheath",
    labels: ["Dendrites", "Cell Body", "Nucleus", "Axon", "Myelin Sheath", "Node of Ranvier", "Axon Terminal"],
    svg: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<path d="M60,140 Q80,110 95,140" fill="none" stroke="#1565c0" stroke-width="3"/>
<path d="M60,140 Q75,170 95,140" fill="none" stroke="#1565c0" stroke-width="3"/>
<path d="M40,140 Q60,95 95,140" fill="none" stroke="#1565c0" stroke-width="2.5"/>
<path d="M25,140 Q50,80 95,140" fill="none" stroke="#1565c0" stroke-width="2"/>
<circle cx="60" cy="118" r="5" fill="#1565c0"/>
<circle cx="38" cy="100" r="5" fill="#1565c0"/>
<text x="8" y="68" font-size="12" fill="#1565c0" font-weight="bold">Dendrites</text>
<circle cx="130" cy="140" r="42" fill="#fff9c4" stroke="#f57f17" stroke-width="3"/>
<circle cx="130" cy="140" r="18" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
<circle cx="130" cy="140" r="7" fill="#1565c0" opacity="0.6"/>
<text x="108" y="174" font-size="10" fill="#f57f17" font-weight="bold">Cell Body</text>
<line x1="190" y1="140" x2="530" y2="140" stroke="#2e7d32" stroke-width="4"/>
<rect x="200" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="252" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="304" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="356" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="408" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<line x1="245" y1="133" x2="245" y2="147" stroke="#c62828" stroke-width="2.5"/>
<line x1="297" y1="133" x2="297" y2="147" stroke="#c62828" stroke-width="2.5"/>
<line x1="349" y1="133" x2="349" y2="147" stroke="#c62828" stroke-width="2.5"/>
<line x1="401" y1="133" x2="401" y2="147" stroke="#c62828" stroke-width="2.5"/>
<text x="280" y="91" font-size="12" fill="#2e7d32" font-weight="bold">Myelin Sheath</text>
<text x="295" y="200" font-size="11" fill="#c62828" font-weight="bold">Node of Ranvier</text>
<path d="M530,140 Q545,120 555,110" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M530,140 Q545,160 555,170" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<circle cx="558" cy="108" r="6" fill="#7b1fa2"/>
<circle cx="558" cy="172" r="6" fill="#7b1fa2"/>
<text x="545" y="200" font-size="11" fill="#7b1fa2" font-weight="bold">Terminals</text>
</svg>`,
  },

  "Body Fluids & Circulation": {
    title: "Internal Structure of the Human Heart",
    description: "Four-chambered human heart showing valves, vessels, and blood flow direction",
    labels: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle", "Aorta", "Pulmonary Artery", "Tricuspid Valve", "Bicuspid Valve"],
    svg: `<svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<path d="M250,370 Q130,280 100,200 Q70,120 130,90 Q185,65 220,110 Q235,130 250,150 Q265,130 280,110 Q315,65 370,90 Q430,120 400,200 Q370,280 250,370Z" fill="#ffcdd2" stroke="#c62828" stroke-width="3"/>
<line x1="250" y1="155" x2="248" y2="355" stroke="#c62828" stroke-width="3"/>
<text x="112" y="215" font-size="11" fill="#1565c0" font-weight="bold">Right Atrium</text>
<text x="330" y="215" font-size="11" fill="#c62828" font-weight="bold">Left Atrium</text>
<text x="108" y="315" font-size="11" fill="#1565c0" font-weight="bold">Right Ventricle</text>
<text x="322" y="315" font-size="11" fill="#c62828" font-weight="bold">Left Ventricle</text>
<path d="M200,240 Q225,230 250,245 Q225,255 200,245Z" fill="#f57f17" stroke="#e65100" stroke-width="1.5"/>
<path d="M250,240 Q275,230 300,245 Q275,255 250,245Z" fill="#f57f17" stroke="#e65100" stroke-width="1.5"/>
<path d="M280,95 Q290,50 310,35 Q340,20 360,40" fill="none" stroke="#c62828" stroke-width="10" stroke-linecap="round"/>
<text x="330" y="28" font-size="11" fill="#c62828" font-weight="bold">Aorta</text>
<path d="M220,95 Q210,50 190,35 Q165,20 145,40" fill="none" stroke="#1565c0" stroke-width="10" stroke-linecap="round"/>
<text x="100" y="28" font-size="11" fill="#1565c0" font-weight="bold">Pulm. Artery</text>
</svg>`,
  },

  "Excretory Products & Elimination": {
    title: "Human Kidney — Longitudinal Section",
    description: "Longitudinal section showing cortex, medulla, pelvis, and nephron position",
    labels: ["Cortex", "Medulla", "Renal Pelvis", "Ureter", "Pyramid", "Nephron", "Renal Artery", "Renal Vein"],
    svg: `<svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<path d="M240,20 Q340,20 380,90 Q420,160 380,240 Q340,320 240,340 Q180,340 150,310 Q90,270 90,180 Q90,100 150,60 Q180,35 240,20Z" fill="#fff3e0" stroke="#e65100" stroke-width="3"/>
<path d="M240,60 Q310,65 340,120 Q370,175 340,235 Q310,290 240,300 Q200,298 180,275 Q140,235 145,180 Q148,125 180,90 Q205,68 240,60Z" fill="#ffe0b2" stroke="#ef6c00" stroke-width="2"/>
<path d="M210,100 Q240,130 270,100 Q255,175 240,185 Q225,175 210,100Z" fill="#ff8a65" stroke="#e64a19" stroke-width="1.5" opacity="0.8"/>
<path d="M185,160 Q210,150 240,155 Q270,150 295,160 Q310,175 300,195 Q280,220 240,225 Q200,220 180,195 Q170,175 185,160Z" fill="#fffde7" stroke="#f9a825" stroke-width="2"/>
<path d="M235,225 Q230,270 228,340" fill="none" stroke="#f9a825" stroke-width="8" stroke-linecap="round"/>
<path d="M90,160 Q120,160 185,165" fill="none" stroke="#c62828" stroke-width="8" stroke-linecap="round"/>
<path d="M90,185 Q120,185 180,180" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
<text x="58" y="56" font-size="11" fill="#e65100" font-weight="bold">Cortex</text>
<text x="100" y="97" font-size="11" fill="#ef6c00" font-weight="bold">Medulla</text>
<text x="312" y="234" font-size="11" fill="#f9a825" font-weight="bold">Renal Pelvis</text>
<text x="312" y="314" font-size="11" fill="#f9a825" font-weight="bold">Ureter</text>
<text x="25" y="155" font-size="11" fill="#c62828" font-weight="bold">Renal Artery</text>
<text x="25" y="198" font-size="11" fill="#1565c0" font-weight="bold">Renal Vein</text>
</svg>`,
  },

  "Photosynthesis": {
    title: "Structure of Chloroplast",
    description: "Cross-section of chloroplast showing thylakoid, grana, stroma, and envelope",
    labels: ["Outer Membrane", "Inner Membrane", "Stroma", "Thylakoid", "Grana", "Stroma Lamellae"],
    svg: `<svg viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<ellipse cx="260" cy="160" rx="230" ry="130" fill="#e8f5e9" stroke="#2e7d32" stroke-width="4"/>
<ellipse cx="260" cy="160" rx="215" ry="115" fill="#c8e6c9" stroke="#388e3c" stroke-width="2.5"/>
<g transform="translate(150,150)">
<rect x="-22" y="-45" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="-28" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="-11" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="6" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="23" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
</g>
<g transform="translate(260,145)">
<rect x="-22" y="-38" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="-21" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="-4" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="13" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="30" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
</g>
<g transform="translate(370,155)">
<rect x="-22" y="-32" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="-15" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="2" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="19" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
</g>
<path d="M172,150 Q216,130 238,140" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
<path d="M282,148 Q326,132 348,142" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
<text x="55" y="66" font-size="11" fill="#2e7d32" font-weight="bold">Grana</text>
<text x="115" y="238" font-size="11" fill="#388e3c" font-weight="bold">Stroma Lamellae</text>
<text x="2" y="148" font-size="10" fill="#2e7d32" font-weight="bold">Outer Membrane</text>
<text x="215" y="26" font-size="11" fill="#1b5e20" font-weight="bold">Thylakoid Disc</text>
<text x="70" y="95" font-size="11" fill="#1b5e20" font-style="italic">Stroma</text>
</svg>`,
  },

  "Anatomy of Flowering Plants": {
    title: "T.S. of Dicot Stem (Sunflower)",
    description: "Transverse section showing epidermis, cortex, vascular bundles, and pith",
    labels: ["Epidermis", "Cortex", "Endodermis", "Pericycle", "Xylem", "Phloem", "Pith", "Vascular Bundle"],
    svg: `<svg viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<circle cx="230" cy="230" r="72" fill="#fff9c4" stroke="#f9a825" stroke-width="2"/>
<text x="204" y="234" font-size="12" fill="#f9a825" font-weight="bold">Pith</text>
<circle cx="230" cy="230" r="128" fill="none" stroke="#7b1fa2" stroke-width="3" stroke-dasharray="6,3"/>
<circle cx="230" cy="230" r="155" fill="#c8e6c9" stroke="#388e3c" stroke-width="2.5" opacity="0.5"/>
<circle cx="230" cy="230" r="178" fill="none" stroke="#2e7d32" stroke-width="6"/>
<g id="vb2">
<ellipse cx="230" cy="120" rx="18" ry="12" fill="#ffcc80" stroke="#ef6c00" stroke-width="2"/>
<ellipse cx="230" cy="142" rx="20" ry="14" fill="#ef9a9a" stroke="#c62828" stroke-width="2"/>
</g>
<use href="#vb2" transform="rotate(60 230 230)"/>
<use href="#vb2" transform="rotate(120 230 230)"/>
<use href="#vb2" transform="rotate(180 230 230)"/>
<use href="#vb2" transform="rotate(240 230 230)"/>
<use href="#vb2" transform="rotate(300 230 230)"/>
<circle cx="230" cy="230" r="108" fill="none" stroke="#795548" stroke-width="3"/>
<text x="175" y="16" font-size="11" fill="#2e7d32" font-weight="bold">Epidermis</text>
<text x="342" y="52" font-size="11" fill="#388e3c" font-weight="bold">Cortex</text>
<text x="397" y="142" font-size="11" fill="#7b1fa2" font-weight="bold">Endodermis</text>
<text x="397" y="184" font-size="11" fill="#795548" font-weight="bold">Pericycle</text>
<text x="312" y="82" font-size="11" fill="#ef6c00" font-weight="bold">Phloem</text>
<text x="312" y="107" font-size="11" fill="#c62828" font-weight="bold">Xylem</text>
</svg>`,
  },

  "Biomolecules": {
    title: "Structure of Mitochondria",
    description: "Cross-section showing outer membrane, inner membrane, cristae, and matrix",
    labels: ["Outer Membrane", "Inner Membrane", "Cristae", "Matrix", "Ribosome", "DNA", "Intermembrane Space"],
    svg: `<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<ellipse cx="250" cy="150" rx="220" ry="120" fill="#fff8e1" stroke="#f57f17" stroke-width="4"/>
<ellipse cx="250" cy="150" rx="195" ry="98" fill="#fff3e0" stroke="#ff8f00" stroke-width="2.5"/>
<ellipse cx="250" cy="150" rx="185" ry="88" fill="#ffe0b2" opacity="0.6"/>
<path d="M80,130 Q110,90 110,150 Q110,200 80,170" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
<path d="M150,70 Q150,110 190,110 Q230,110 230,70" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
<path d="M270,70 Q270,110 310,110 Q350,110 350,70" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
<path d="M420,130 Q390,90 390,150 Q390,200 420,170" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
<circle cx="200" cy="145" r="5" fill="#c62828"/>
<circle cx="215" cy="155" r="5" fill="#c62828"/>
<circle cx="250" cy="140" r="5" fill="#c62828"/>
<circle cx="280" cy="155" r="5" fill="#c62828"/>
<ellipse cx="250" cy="165" rx="25" ry="12" fill="none" stroke="#1565c0" stroke-width="2.5" stroke-dasharray="4,2"/>
<text x="232" y="169" font-size="9" fill="#1565c0" font-weight="bold">mt-DNA</text>
<text x="160" y="8" font-size="11" fill="#f57f17" font-weight="bold">Outer Membrane</text>
<text x="322" y="17" font-size="11" fill="#ff8f00" font-weight="bold">Inner Membrane</text>
<text x="20" y="87" font-size="11" fill="#f57f17" font-weight="bold">Cristae</text>
<text x="130" y="265" font-size="11" fill="#e65100" font-weight="bold">Matrix</text>
<text x="362" y="265" font-size="11" fill="#c62828" font-weight="bold">Ribosomes</text>
</svg>`,
  },

  "Digestion & Absorption": {
    title: "Human Alimentary Canal",
    description: "Schematic diagram of the human digestive system",
    labels: ["Mouth", "Oesophagus", "Stomach", "Small Intestine", "Large Intestine", "Liver", "Pancreas", "Rectum"],
    svg: `<svg viewBox="0 0 460 520" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<ellipse cx="230" cy="35" rx="38" ry="20" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
<text x="207" y="39" font-size="10" fill="#c62828" font-weight="bold">Mouth</text>
<rect x="218" y="55" width="24" height="70" rx="10" fill="#ef9a9a" stroke="#c62828" stroke-width="2"/>
<text x="312" y="78" font-size="10" fill="#c62828" font-weight="bold">Oesophagus</text>
<path d="M200,125 Q160,135 155,165 Q148,200 165,225 Q185,248 220,250 Q255,252 268,235 Q285,215 282,185 Q278,155 260,135 Q242,122 200,125Z" fill="#ffccbc" stroke="#e64a19" stroke-width="2.5"/>
<text x="192" y="195" font-size="10" fill="#e64a19" font-weight="bold">Stomach</text>
<path d="M245,245 Q290,250 295,275 Q300,305 270,315 Q240,325 220,310 Q195,295 200,268 Q205,248 230,248" fill="none" stroke="#ff7043" stroke-width="12" stroke-linecap="round"/>
<path d="M200,268 Q185,280 188,308 Q192,335 220,342 Q250,348 270,335 Q295,318 292,290" fill="none" stroke="#ff8a65" stroke-width="11" stroke-linecap="round"/>
<text x="222" y="302" font-size="9" fill="white" font-weight="bold">Small Intestine</text>
<path d="M200,390 Q170,395 155,420 Q148,445 165,465 Q188,482 220,480 Q255,478 285,465 Q310,448 315,420 Q318,395 295,385 Q270,375 245,385" fill="none" stroke="#8d6e63" stroke-width="16" stroke-linecap="round"/>
<text x="198" y="440" font-size="9" fill="white" font-weight="bold">Large Intestine</text>
<rect x="218" y="475" width="24" height="35" rx="10" fill="#a1887f" stroke="#6d4c41" stroke-width="2"/>
<path d="M300,130 Q355,128 375,155 Q390,178 378,205 Q362,228 330,228 Q305,225 295,205 Q285,182 300,155Z" fill="#ef9a9a" stroke="#b71c1c" stroke-width="2"/>
<text x="320" y="182" font-size="10" fill="#b71c1c" font-weight="bold">Liver</text>
<path d="M145,230 Q175,222 210,228 Q195,245 165,252 Q145,250 145,230Z" fill="#ffe0b2" stroke="#e65100" stroke-width="2"/>
<text x="145" y="243" font-size="9" fill="#e65100" font-weight="bold">Pancreas</text>
<text x="250" y="498" font-size="9" fill="#6d4c41" font-weight="bold">Rectum</text>
</svg>`,
  },

  "Breathing & Exchange of Gases": {
    title: "Human Respiratory System",
    description: "Lungs, trachea, bronchi and alveoli structure",
    labels: ["Nasal Cavity", "Trachea", "Bronchus", "Bronchioles", "Alveoli", "Diaphragm", "Right Lung", "Left Lung"],
    svg: `<svg viewBox="0 0 460 420" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<path d="M195,20 Q230,15 265,20 Q270,35 265,50 Q230,55 195,50 Q190,35 195,20Z" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
<text x="198" y="38" font-size="9" fill="#c62828" font-weight="bold">Nasal Cavity</text>
<rect x="215" y="55" width="30" height="30" rx="8" fill="#ef9a9a" stroke="#c62828" stroke-width="1.5"/>
<rect x="220" y="85" width="20" height="55" rx="8" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
<line x1="220" y1="98" x2="240" y2="98" stroke="#1565c0" stroke-width="2"/>
<line x1="220" y1="110" x2="240" y2="110" stroke="#1565c0" stroke-width="2"/>
<line x1="220" y1="122" x2="240" y2="122" stroke="#1565c0" stroke-width="2"/>
<text x="245" y="115" font-size="10" fill="#1565c0" font-weight="bold">Trachea</text>
<path d="M220,140 Q185,145 160,160" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
<path d="M240,140 Q275,145 300,160" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
<path d="M80,160 Q60,185 62,230 Q65,280 90,320 Q115,355 155,360 Q190,362 210,340 Q228,318 225,280 Q222,240 210,205 Q195,170 175,160 Q140,150 80,160Z" fill="#ffcdd2" stroke="#e57373" stroke-width="2.5" opacity="0.85"/>
<text x="118" y="270" font-size="12" fill="#c62828" font-weight="bold">Left Lung</text>
<path d="M380,160 Q400,185 398,230 Q395,280 370,320 Q345,355 305,360 Q270,362 250,340 Q232,318 235,280 Q238,240 250,205 Q265,170 285,160 Q320,150 380,160Z" fill="#ffcdd2" stroke="#e57373" stroke-width="2.5" opacity="0.85"/>
<text x="300" y="270" font-size="12" fill="#c62828" font-weight="bold">Right Lung</text>
<circle cx="145" cy="310" r="12" fill="#ffebee" stroke="#e57373" stroke-width="1.5"/>
<circle cx="165" cy="318" r="12" fill="#ffebee" stroke="#e57373" stroke-width="1.5"/>
<text x="92" y="342" font-size="9" fill="#c62828" font-weight="bold">Alveoli</text>
<path d="M60,375 Q150,360 230,365 Q310,360 400,375 Q390,390 230,385 Q70,390 60,375Z" fill="#a5d6a7" stroke="#388e3c" stroke-width="2"/>
<text x="190" y="383" font-size="10" fill="#1b5e20" font-weight="bold">Diaphragm</text>
</svg>`,
  },

  "Molecular Basis of Inheritance": {
    title: "DNA Double Helix Structure",
    description: "Watson-Crick model showing base pairs, sugar-phosphate backbone",
    labels: ["Phosphate Group", "Deoxyribose Sugar", "Adenine-Thymine", "Guanine-Cytosine", "Major Groove", "Minor Groove"],
    svg: `<svg viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<path d="M120,20 Q80,60 120,100 Q160,140 120,180 Q80,220 120,260 Q160,300 120,340 Q80,380 120,420 Q160,460 120,480" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
<path d="M280,20 Q320,60 280,100 Q240,140 280,180 Q320,220 280,260 Q240,300 280,340 Q320,380 280,420 Q240,460 280,480" fill="none" stroke="#c62828" stroke-width="8" stroke-linecap="round"/>
<rect x="130" y="58" width="40" height="12" rx="4" fill="#1565c0"/>
<rect x="230" y="58" width="40" height="12" rx="4" fill="#2e7d32"/>
<line x1="170" y1="64" x2="230" y2="64" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="145" y="108" width="40" height="12" rx="4" fill="#7b1fa2"/>
<rect x="215" y="108" width="40" height="12" rx="4" fill="#e65100"/>
<line x1="185" y1="114" x2="215" y2="114" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="130" y="158" width="40" height="12" rx="4" fill="#2e7d32"/>
<rect x="230" y="158" width="40" height="12" rx="4" fill="#1565c0"/>
<line x1="170" y1="164" x2="230" y2="164" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="145" y="208" width="40" height="12" rx="4" fill="#e65100"/>
<rect x="215" y="208" width="40" height="12" rx="4" fill="#7b1fa2"/>
<line x1="185" y1="214" x2="215" y2="214" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="130" y="258" width="40" height="12" rx="4" fill="#1565c0"/>
<rect x="230" y="258" width="40" height="12" rx="4" fill="#2e7d32"/>
<line x1="170" y1="264" x2="230" y2="264" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<text x="2" y="22" font-size="10" fill="#1565c0" font-weight="bold">Phosphate backbone</text>
<text x="342" y="22" font-size="10" fill="#c62828" font-weight="bold">Sugar backbone</text>
<text x="352" y="84" font-size="9" fill="#f9a825" font-weight="bold">H-bonds</text>
<rect x="310" y="200" width="12" height="8" rx="2" fill="#1565c0"/>
<text x="325" y="208" font-size="8" fill="#1565c0">A - Adenine</text>
<rect x="310" y="215" width="12" height="8" rx="2" fill="#2e7d32"/>
<text x="325" y="223" font-size="8" fill="#2e7d32">T - Thymine</text>
<rect x="310" y="230" width="12" height="8" rx="2" fill="#7b1fa2"/>
<text x="325" y="238" font-size="8" fill="#7b1fa2">G - Guanine</text>
<rect x="310" y="245" width="12" height="8" rx="2" fill="#e65100"/>
<text x="325" y="253" font-size="8" fill="#e65100">C - Cytosine</text>
</svg>`,
  },
};

// ── MAIN LOOKUP FUNCTION ──────────────────────────────────────────────────────
export function findDiagram(chapter: string): DiagramData | null {
  // 1. Exact Wikimedia match
  if (WIKIMEDIA[chapter]) return WIKIMEDIA[chapter];

  // 2. Keyword match → Wikimedia
  const ch = chapter.toLowerCase();
  if (ch.includes("cell") && !ch.includes("cell cycle")) return WIKIMEDIA["Cell — The Unit of Life"];
  if (ch.includes("neural") || ch.includes("neuron") || ch.includes("eye") || ch.includes("ear")) return WIKIMEDIA["Neural Control & Coordination"];
  if (ch.includes("circulation") || ch.includes("heart") || ch.includes("blood")) return WIKIMEDIA["Body Fluids & Circulation"];
  if (ch.includes("excret") || ch.includes("kidney") || ch.includes("nephron")) return WIKIMEDIA["Excretory Products & Elimination"];
  if (ch.includes("photosynthesis") || ch.includes("chloroplast")) return WIKIMEDIA["Photosynthesis"];
  if (ch.includes("anatomy") || ch.includes("dicot") || ch.includes("monocot")) return WIKIMEDIA["Anatomy of Flowering Plants"];
  if (ch.includes("biomolecule") || ch.includes("mitochondria")) return WIKIMEDIA["Biomolecules"];
  if (ch.includes("digest") || ch.includes("absorpt") || ch.includes("alimentary")) return WIKIMEDIA["Digestion & Absorption"];
  if (ch.includes("breath") || ch.includes("lung") || ch.includes("respirat") || ch.includes("alveol")) return WIKIMEDIA["Breathing & Exchange of Gases"];
  if (ch.includes("molecular") && ch.includes("inherit") || ch.includes("dna") || ch.includes("double helix")) return WIKIMEDIA["Molecular Basis of Inheritance"];
  if (ch.includes("locomot") || ch.includes("movement") || ch.includes("skeleton")) return WIKIMEDIA["Locomotion & Movement"];
  if (ch.includes("human reprod") || (ch.includes("reprod") && ch.includes("human"))) return WIKIMEDIA["Human Reproduction"];
  if (ch.includes("principle") && ch.includes("inherit") || ch.includes("mendel")) return WIKIMEDIA["Principles of Inheritance"];

  // 3. SVG fallback
  if (SVG_FALLBACKS[chapter]) return SVG_FALLBACKS[chapter];

  // 4. Keyword match → SVG fallback
  if (ch.includes("neural") || ch.includes("neuron")) return SVG_FALLBACKS["Neural Control & Coordination"];
  if (ch.includes("heart") || ch.includes("circulation")) return SVG_FALLBACKS["Body Fluids & Circulation"];

  return null;
}