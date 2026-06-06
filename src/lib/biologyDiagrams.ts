// src/lib/biologyDiagrams.ts
// Pre-drawn realistic SVG diagrams for top NEET Biology chapters

export interface DiagramData {
  title: string;
  svg: string;
  labels: string[];
  description: string;
}

// Wikimedia image URLs for real biology diagrams
export const WIKIMEDIA_DIAGRAMS: Record<string, { title: string; url: string; description: string; labels: string[]; credit: string }> = {

  "Cell — The Unit of Life": {
    title: "Animal Cell Structure",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Animal_Cell.svg/1200px-Animal_Cell.svg.png",
    description: "Detailed animal cell showing all major organelles as per NCERT Biology",
    labels: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum", "Cell Membrane", "Ribosome", "Lysosome", "Cytoplasm"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Photosynthesis": {
    title: "Chloroplast Structure",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Simple_diagram_of_a_chloroplast.svg/1200px-Simple_diagram_of_a_chloroplast.svg.png",
    description: "Cross-section of chloroplast showing thylakoid, grana, stroma and double membrane",
    labels: ["Outer Membrane", "Inner Membrane", "Thylakoid", "Grana", "Stroma", "Stroma Lamellae"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Biomolecules": {
    title: "Mitochondria Structure",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mitochondrion_structure.svg/1200px-Mitochondrion_structure.svg.png",
    description: "Cross-section of mitochondria showing cristae, matrix, inner and outer membranes",
    labels: ["Outer Membrane", "Inner Membrane", "Cristae", "Matrix", "Intermembrane Space", "Ribosome", "DNA"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Body Fluids & Circulation": {
    title: "Human Heart — Internal Structure",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg/1200px-Diagram_of_the_human_heart_%28cropped%29.svg.png",
    description: "Four-chambered human heart showing atria, ventricles, valves and major blood vessels",
    labels: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle", "Aorta", "Pulmonary Artery", "Tricuspid Valve", "Bicuspid Valve"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Excretory Products & Elimination": {
    title: "Human Kidney — Longitudinal Section",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kidney_section.jpg/800px-Kidney_section.jpg",
    description: "Longitudinal section of human kidney showing cortex, medulla, pelvis and ureter",
    labels: ["Cortex", "Medulla", "Renal Pelvis", "Ureter", "Pyramid", "Renal Artery", "Renal Vein"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Neural Control & Coordination": {
    title: "Structure of the Human Eye",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Schematic_diagram_of_the_human_eye_en.svg/1200px-Schematic_diagram_of_the_human_eye_en.svg.png",
    description: "Cross-section of human eye showing cornea, lens, retina, optic nerve and chambers",
    labels: ["Cornea", "Lens", "Retina", "Optic Nerve", "Iris", "Pupil", "Vitreous Humour", "Sclera"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Anatomy of Flowering Plants": {
    title: "T.S. of Dicot Stem",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Dicot_stem_labeled.svg/800px-Dicot_stem_labeled.svg.png",
    description: "Transverse section of dicot stem showing epidermis, cortex, vascular bundles and pith",
    labels: ["Epidermis", "Cortex", "Endodermis", "Pericycle", "Xylem", "Phloem", "Pith"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Digestion & Absorption": {
    title: "Human Digestive System",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_en.svg/800px-Digestive_system_diagram_en.svg.png",
    description: "Complete human alimentary canal from mouth to rectum with accessory glands",
    labels: ["Mouth", "Oesophagus", "Stomach", "Small Intestine", "Large Intestine", "Liver", "Pancreas", "Rectum"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Breathing & Exchange of Gases": {
    title: "Human Respiratory System",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Respiratory_system_complete_en.svg/800px-Respiratory_system_complete_en.svg.png",
    description: "Human lungs, trachea, bronchi, bronchioles and alveoli structure",
    labels: ["Nasal Cavity", "Trachea", "Bronchus", "Bronchioles", "Alveoli", "Diaphragm", "Left Lung", "Right Lung"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Molecular Basis of Inheritance": {
    title: "DNA Double Helix",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/DNA_Structure%2BKey%2BLabelled.pn_NoBB.png/800px-DNA_Structure%2BKey%2BLabelled.pn_NoBB.png",
    description: "Watson-Crick DNA double helix model showing base pairs and sugar-phosphate backbone",
    labels: ["Adenine-Thymine", "Guanine-Cytosine", "Phosphate Group", "Deoxyribose Sugar", "Hydrogen Bonds", "Major Groove", "Minor Groove"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Structural Organisation in Animals": {
    title: "Earthworm — External & Internal Structure",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Earthworm_anatomy.svg/1200px-Earthworm_anatomy.svg.png",
    description: "Longitudinal section of earthworm showing segments, setae, and internal organs",
    labels: ["Mouth", "Pharynx", "Oesophagus", "Crop", "Gizzard", "Intestine", "Setae", "Clitellum"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Locomotion & Movement": {
    title: "Human Skeletal System",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Human_skeleton_front_en.svg/600px-Human_skeleton_front_en.svg.png",
    description: "Human skeleton showing major bones, joints and skeletal structure",
    labels: ["Skull", "Vertebral Column", "Rib Cage", "Femur", "Tibia", "Humerus", "Radius", "Ulna"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Human Reproduction": {
    title: "Female Reproductive System",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Scheme_female_reproductive_system-en.svg/800px-Scheme_female_reproductive_system-en.svg.png",
    description: "Female reproductive organs showing ovary, fallopian tube, uterus and vagina",
    labels: ["Ovary", "Fallopian Tube", "Uterus", "Cervix", "Vagina", "Endometrium", "Follicle"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },

  "Principles of Inheritance": {
    title: "Monohybrid Cross — Mendel's Experiment",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mendelian_inheritance_-_pea_colour.svg/800px-Mendelian_inheritance_-_pea_colour.svg.png",
    description: "Punnett square showing monohybrid cross and 3:1 phenotypic ratio",
    labels: ["Dominant Allele", "Recessive Allele", "F1 Generation", "F2 Generation", "Phenotype Ratio", "Genotype"],
    credit: "Wikimedia Commons (CC BY-SA)",
  },
};

export const BIOLOGY_DIAGRAMS: Record<string, DiagramData> = {

  // ── CELL ─────────────────────────────────────────────────────────────────
  "Cell — The Unit of Life": {
    title: "Animal Cell — Internal Structure",
    description: "Cross-section of a typical animal cell showing major organelles",
    labels: ["Nucleus", "Mitochondria", "Golgi Body", "Ribosome", "Cell Membrane", "Cytoplasm"],
    svg: `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Cell membrane -->
  <ellipse cx="250" cy="195" rx="220" ry="170" fill="#e8f5e9" stroke="#2e7d32" stroke-width="4"/>
  <!-- Cytoplasm label bg -->
  <text x="80" y="310" font-size="11" fill="#388e3c" font-style="italic">Cytoplasm</text>
  <!-- Nucleus -->
  <ellipse cx="240" cy="185" rx="70" ry="58" fill="#bbdefb" stroke="#1565c0" stroke-width="3"/>
  <ellipse cx="240" cy="185" rx="70" ry="58" fill="none" stroke="#1e88e5" stroke-width="1.5" stroke-dasharray="5,3"/>
  <!-- Nucleolus -->
  <circle cx="248" cy="180" r="18" fill="#1565c0" opacity="0.7"/>
  <text x="234" y="184" font-size="9" fill="white" font-weight="bold">Nucleolus</text>
  <!-- Nucleus label -->
  <line x1="310" y1="155" x2="360" y2="130" stroke="#1565c0" stroke-width="1.2"/>
  <text x="362" y="127" font-size="11" fill="#1565c0" font-weight="bold">Nucleus</text>
  <!-- Nuclear pore dots -->
  <circle cx="174" cy="172" r="3" fill="#1565c0"/>
  <circle cx="180" cy="220" r="3" fill="#1565c0"/>
  <circle cx="305" cy="168" r="3" fill="#1565c0"/>
  <circle cx="298" cy="215" r="3" fill="#1565c0"/>
  <text x="142" y="235" font-size="9" fill="#1565c0">Nuclear pores</text>
  <!-- Mitochondria -->
  <ellipse cx="130" cy="130" rx="38" ry="22" fill="#fff9c4" stroke="#f57f17" stroke-width="2"/>
  <path d="M108,130 Q120,118 132,130 Q144,142 156,130" fill="none" stroke="#f57f17" stroke-width="1.5"/>
  <path d="M110,136 Q122,124 134,136 Q146,148 158,136" fill="none" stroke="#f57f17" stroke-width="1"/>
  <line x1="130" y1="108" x2="100" y2="80" stroke="#f57f17" stroke-width="1.2"/>
  <text x="52" y="77" font-size="11" fill="#f57f17" font-weight="bold">Mitochondria</text>
  <!-- Golgi apparatus -->
  <g transform="translate(340,230)">
    <path d="M-40,0 Q-10,-12 20,0" fill="none" stroke="#7b1fa2" stroke-width="3"/>
    <path d="M-35,10 Q-5,-2 25,10" fill="none" stroke="#7b1fa2" stroke-width="3"/>
    <path d="M-30,20 Q0,8 30,20" fill="none" stroke="#7b1fa2" stroke-width="3"/>
    <path d="M-25,30 Q5,18 35,30" fill="none" stroke="#7b1fa2" stroke-width="3"/>
    <!-- vesicles -->
    <circle cx="28" cy="5" r="7" fill="#ce93d8" stroke="#7b1fa2"/>
    <circle cx="33" cy="18" r="6" fill="#ce93d8" stroke="#7b1fa2"/>
  </g>
  <line x1="340" y1="225" x2="390" y2="200" stroke="#7b1fa2" stroke-width="1.2"/>
  <text x="392" y="197" font-size="11" fill="#7b1fa2" font-weight="bold">Golgi Body</text>
  <!-- ER rough -->
  <path d="M160,250 Q175,240 190,255 Q205,270 220,255 Q235,240 250,255" fill="none" stroke="#00695c" stroke-width="2.5"/>
  <circle cx="165" cy="248" r="3" fill="#00695c"/>
  <circle cx="180" cy="242" r="3" fill="#00695c"/>
  <circle cx="195" cy="254" r="3" fill="#00695c"/>
  <circle cx="210" cy="268" r="3" fill="#00695c"/>
  <circle cx="225" cy="254" r="3" fill="#00695c"/>
  <line x1="200" y1="270" x2="165" y2="300" stroke="#00695c" stroke-width="1.2"/>
  <text x="90" y="314" font-size="11" fill="#00695c" font-weight="bold">Rough ER</text>
  <!-- Ribosomes (dots) -->
  <circle cx="350" cy="155" r="4" fill="#c62828"/>
  <circle cx="360" cy="148" r="4" fill="#c62828"/>
  <circle cx="355" cy="162" r="4" fill="#c62828"/>
  <circle cx="365" cy="155" r="4" fill="#c62828"/>
  <line x1="358" y1="145" x2="380" y2="120" stroke="#c62828" stroke-width="1.2"/>
  <text x="382" y="117" font-size="11" fill="#c62828" font-weight="bold">Ribosomes</text>
  <!-- Lysosome -->
  <circle cx="150" cy="250" r="18" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
  <text x="143" y="254" font-size="9" fill="#c62828">Lyso</text>
  <!-- Cell membrane label -->
  <line x1="460" y1="195" x2="472" y2="195" stroke="#2e7d32" stroke-width="1.2"/>
  <text x="392" y="310" font-size="11" fill="#2e7d32" font-weight="bold">Cell Membrane</text>
  <!-- Centriole -->
  <rect x="270" y="260" width="22" height="10" rx="3" fill="#ff8f00" stroke="#e65100"/>
  <rect x="276" y="268" width="10" height="22" rx="3" fill="#ff8f00" stroke="#e65100"/>
  <line x1="281" y1="285" x2="260" y2="310" stroke="#e65100" stroke-width="1.2"/>
  <text x="200" y="325" font-size="11" fill="#e65100" font-weight="bold">Centriole</text>
</svg>`,
  },

  // ── NEURON ───────────────────────────────────────────────────────────────
  "Neural Control & Coordination": {
    title: "Structure of a Neuron",
    description: "Multipolar neuron showing dendrites, cell body, axon, and myelin sheath",
    labels: ["Dendrites", "Cell Body", "Nucleus", "Axon", "Myelin Sheath", "Node of Ranvier", "Axon Terminal"],
    svg: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Dendrites -->
  <path d="M60,140 Q80,110 95,140" fill="none" stroke="#1565c0" stroke-width="3"/>
  <path d="M60,140 Q75,170 95,140" fill="none" stroke="#1565c0" stroke-width="3"/>
  <path d="M40,140 Q60,95 95,140" fill="none" stroke="#1565c0" stroke-width="2.5"/>
  <path d="M40,140 Q55,185 95,140" fill="none" stroke="#1565c0" stroke-width="2.5"/>
  <path d="M25,140 Q50,80 95,140" fill="none" stroke="#1565c0" stroke-width="2"/>
  <path d="M25,140 Q45,200 95,140" fill="none" stroke="#1565c0" stroke-width="2"/>
  <!-- dendrite tips -->
  <circle cx="60" cy="118" r="5" fill="#1565c0"/>
  <circle cx="60" cy="162" r="5" fill="#1565c0"/>
  <circle cx="40" cy="100" r="5" fill="#1565c0"/>
  <circle cx="38" cy="180" r="5" fill="#1565c0"/>
  <circle cx="22" cy="85" r="5" fill="#1565c0"/>
  <circle cx="20" cy="195" r="5" fill="#1565c0"/>
  <text x="8" y="68" font-size="12" fill="#1565c0" font-weight="bold">Dendrites</text>
  <!-- Cell body (soma) -->
  <circle cx="130" cy="140" r="42" fill="#fff9c4" stroke="#f57f17" stroke-width="3"/>
  <!-- Nucleus inside cell body -->
  <circle cx="130" cy="140" r="18" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
  <circle cx="130" cy="140" r="7" fill="#1565c0" opacity="0.6"/>
  <text x="108" y="174" font-size="10" fill="#f57f17" font-weight="bold">Cell Body</text>
  <text x="118" y="144" font-size="9" fill="#1565c0">Nucleus</text>
  <!-- Axon hillock -->
  <path d="M170,140 Q185,140 190,140" fill="none" stroke="#2e7d32" stroke-width="5"/>
  <!-- Axon -->
  <line x1="190" y1="140" x2="530" y2="140" stroke="#2e7d32" stroke-width="4"/>
  <!-- Myelin sheath segments -->
  <rect x="200" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
  <rect x="252" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
  <rect x="304" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
  <rect x="356" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
  <rect x="408" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
  <rect x="460" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
  <!-- Nodes of Ranvier -->
  <line x1="245" y1="133" x2="245" y2="147" stroke="#c62828" stroke-width="2.5"/>
  <line x1="297" y1="133" x2="297" y2="147" stroke="#c62828" stroke-width="2.5"/>
  <line x1="349" y1="133" x2="349" y2="147" stroke="#c62828" stroke-width="2.5"/>
  <line x1="401" y1="133" x2="401" y2="147" stroke="#c62828" stroke-width="2.5"/>
  <line x1="453" y1="133" x2="453" y2="147" stroke="#c62828" stroke-width="2.5"/>
  <!-- Labels -->
  <line x1="322" y1="128" x2="322" y2="95" stroke="#2e7d32" stroke-width="1.2"/>
  <text x="280" y="91" font-size="12" fill="#2e7d32" font-weight="bold">Myelin Sheath</text>
  <line x1="349" y1="148" x2="349" y2="185" stroke="#c62828" stroke-width="1.2"/>
  <text x="295" y="200" font-size="11" fill="#c62828" font-weight="bold">Node of Ranvier</text>
  <!-- Axon terminals -->
  <path d="M530,140 Q545,120 555,110" fill="none" stroke="#7b1fa2" stroke-width="3"/>
  <path d="M530,140 Q545,135 555,130" fill="none" stroke="#7b1fa2" stroke-width="3"/>
  <path d="M530,140 Q545,148 555,155" fill="none" stroke="#7b1fa2" stroke-width="3"/>
  <path d="M530,140 Q545,160 555,170" fill="none" stroke="#7b1fa2" stroke-width="3"/>
  <circle cx="558" cy="108" r="6" fill="#7b1fa2"/>
  <circle cx="558" cy="128" r="6" fill="#7b1fa2"/>
  <circle cx="558" cy="153" r="6" fill="#7b1fa2"/>
  <circle cx="558" cy="172" r="6" fill="#7b1fa2"/>
  <text x="545" y="200" font-size="11" fill="#7b1fa2" font-weight="bold">Terminals</text>
  <!-- Axon label -->
  <text x="330" y="165" font-size="12" fill="#2e7d32" font-weight="bold">Axon</text>
</svg>`,
  },

  // ── HEART ────────────────────────────────────────────────────────────────
  "Body Fluids & Circulation": {
    title: "Internal Structure of the Human Heart",
    description: "Four-chambered human heart showing valves, vessels, and blood flow direction",
    labels: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle", "Aorta", "Pulmonary Artery", "Tricuspid Valve", "Bicuspid Valve"],
    svg: `<svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Heart outline -->
  <path d="M250,370 Q130,280 100,200 Q70,120 130,90 Q185,65 220,110 Q235,130 250,150 Q265,130 280,110 Q315,65 370,90 Q430,120 400,200 Q370,280 250,370Z"
    fill="#ffcdd2" stroke="#c62828" stroke-width="3"/>
  <!-- Septum -->
  <line x1="250" y1="155" x2="248" y2="355" stroke="#c62828" stroke-width="3"/>
  <!-- RA label -->
  <text x="115" y="200" font-size="11" fill="#1565c0" font-weight="bold">Right</text>
  <text x="112" y="215" font-size="11" fill="#1565c0" font-weight="bold">Atrium</text>
  <!-- LA label -->
  <text x="335" y="200" font-size="11" fill="#c62828" font-weight="bold">Left</text>
  <text x="330" y="215" font-size="11" fill="#c62828" font-weight="bold">Atrium</text>
  <!-- RV label -->
  <text x="118" y="300" font-size="11" fill="#1565c0" font-weight="bold">Right</text>
  <text x="108" y="315" font-size="11" fill="#1565c0" font-weight="bold">Ventricle</text>
  <!-- LV label -->
  <text x="332" y="300" font-size="11" fill="#c62828" font-weight="bold">Left</text>
  <text x="322" y="315" font-size="11" fill="#c62828" font-weight="bold">Ventricle</text>
  <!-- AV valves -->
  <path d="M200,240 Q225,230 250,245 Q225,255 200,245Z" fill="#f57f17" stroke="#e65100" stroke-width="1.5"/>
  <text x="148" y="260" font-size="9" fill="#e65100">Tricuspid</text>
  <path d="M250,240 Q275,230 300,245 Q275,255 250,245Z" fill="#f57f17" stroke="#e65100" stroke-width="1.5"/>
  <text x="308" y="260" font-size="9" fill="#e65100">Bicuspid</text>
  <!-- Aorta -->
  <path d="M280,95 Q290,50 310,35 Q340,20 360,40" fill="none" stroke="#c62828" stroke-width="10" stroke-linecap="round"/>
  <text x="330" y="28" font-size="11" fill="#c62828" font-weight="bold">Aorta</text>
  <!-- Pulmonary artery -->
  <path d="M220,95 Q210,50 190,35 Q165,20 145,40" fill="none" stroke="#1565c0" stroke-width="10" stroke-linecap="round"/>
  <text x="100" y="28" font-size="11" fill="#1565c0" font-weight="bold">Pulm. Artery</text>
  <!-- SVC -->
  <rect x="155" y="35" width="22" height="55" rx="10" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
  <text x="130" y="30" font-size="9" fill="#1565c0">SVC</text>
  <!-- IVC -->
  <rect x="155" y="355" width="22" height="40" rx="10" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
  <text x="130" y="400" font-size="9" fill="#1565c0">IVC</text>
  <!-- Pulmonary veins -->
  <rect x="323" y="35" width="22" height="55" rx="10" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
  <text x="318" y="30" font-size="9" fill="#c62828">Pulm. Veins</text>
  <!-- Chordae tendineae -->
  <line x1="220" y1="248" x2="210" y2="300" stroke="#795548" stroke-width="1.5"/>
  <line x1="240" y1="248" x2="235" y2="305" stroke="#795548" stroke-width="1.5"/>
  <line x1="260" y1="248" x2="265" y2="305" stroke="#795548" stroke-width="1.5"/>
  <line x1="280" y1="248" x2="290" y2="300" stroke="#795548" stroke-width="1.5"/>
  <text x="350" y="360" font-size="9" fill="#795548">Chordae tendineae</text>
</svg>`,
  },

  // ── KIDNEY ───────────────────────────────────────────────────────────────
  "Excretory Products & Elimination": {
    title: "Structure of the Human Kidney (Section)",
    description: "Longitudinal section showing cortex, medulla, pelvis, and nephron position",
    labels: ["Cortex", "Medulla", "Renal Pelvis", "Ureter", "Pyramid", "Nephron", "Renal Artery", "Renal Vein"],
    svg: `<svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Kidney outline -->
  <path d="M240,20 Q340,20 380,90 Q420,160 380,240 Q340,320 240,340 Q180,340 150,310 Q90,270 90,180 Q90,100 150,60 Q180,35 240,20Z"
    fill="#fff3e0" stroke="#e65100" stroke-width="3"/>
  <!-- Medulla (inner region) -->
  <path d="M240,60 Q310,65 340,120 Q370,175 340,235 Q310,290 240,300 Q200,298 180,275 Q140,235 145,180 Q148,125 180,90 Q205,68 240,60Z"
    fill="#ffe0b2" stroke="#ef6c00" stroke-width="2"/>
  <!-- Renal pyramids -->
  <path d="M210,100 Q240,130 270,100 Q255,175 240,185 Q225,175 210,100Z" fill="#ff8a65" stroke="#e64a19" stroke-width="1.5" opacity="0.8"/>
  <path d="M165,145 Q200,165 190,200 Q175,225 160,215 Q140,195 145,170 Q148,150 165,145Z" fill="#ff8a65" stroke="#e64a19" stroke-width="1.5" opacity="0.8"/>
  <path d="M315,145 Q300,165 310,200 Q320,225 340,215 Q358,195 355,170 Q348,150 315,145Z" fill="#ff8a65" stroke="#e64a19" stroke-width="1.5" opacity="0.8"/>
  <path d="M195,240 Q230,255 265,240 Q260,290 240,300 Q220,290 195,240Z" fill="#ff8a65" stroke="#e64a19" stroke-width="1.5" opacity="0.8"/>
  <!-- Renal pelvis -->
  <path d="M185,160 Q210,150 240,155 Q270,150 295,160 Q310,175 300,195 Q280,220 240,225 Q200,220 180,195 Q170,175 185,160Z"
    fill="#fffde7" stroke="#f9a825" stroke-width="2"/>
  <!-- Ureter -->
  <path d="M235,225 Q230,270 228,340" fill="none" stroke="#f9a825" stroke-width="8" stroke-linecap="round"/>
  <!-- Renal artery -->
  <path d="M90,160 Q120,160 185,165" fill="none" stroke="#c62828" stroke-width="8" stroke-linecap="round"/>
  <text x="25" y="155" font-size="11" fill="#c62828" font-weight="bold">Renal</text>
  <text x="25" y="170" font-size="11" fill="#c62828" font-weight="bold">Artery</text>
  <!-- Renal vein -->
  <path d="M90,185 Q120,185 180,180" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
  <text x="25" y="198" font-size="11" fill="#1565c0" font-weight="bold">Renal Vein</text>
  <!-- Labels -->
  <line x1="145" y1="85" x2="100" y2="60" stroke="#e65100" stroke-width="1"/>
  <text x="58" y="56" font-size="11" fill="#e65100" font-weight="bold">Cortex</text>
  <line x1="195" y1="120" x2="155" y2="100" stroke="#ef6c00" stroke-width="1"/>
  <text x="100" y="97" font-size="11" fill="#ef6c00" font-weight="bold">Medulla</text>
  <line x1="240" y1="200" x2="310" y2="230" stroke="#f9a825" stroke-width="1"/>
  <text x="312" y="234" font-size="11" fill="#f9a825" font-weight="bold">Renal Pelvis</text>
  <line x1="230" y1="290" x2="310" y2="310" stroke="#f9a825" stroke-width="1"/>
  <text x="312" y="314" font-size="11" fill="#f9a825" font-weight="bold">Ureter</text>
  <line x1="240" y1="185" x2="310" y2="185" stroke="#e64a19" stroke-width="1"/>
  <text x="312" y="189" font-size="11" fill="#e64a19" font-weight="bold">Pyramid</text>
</svg>`,
  },

  // ── CHLOROPLAST ──────────────────────────────────────────────────────────
  "Photosynthesis": {
    title: "Structure of Chloroplast",
    description: "Cross-section of chloroplast showing thylakoid, grana, stroma, and envelope",
    labels: ["Outer Membrane", "Inner Membrane", "Stroma", "Thylakoid", "Grana", "Stroma Lamellae", "Ribosome"],
    svg: `<svg viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Outer envelope -->
  <ellipse cx="260" cy="160" rx="230" ry="130" fill="#e8f5e9" stroke="#2e7d32" stroke-width="4"/>
  <!-- Inner envelope -->
  <ellipse cx="260" cy="160" rx="215" ry="115" fill="#c8e6c9" stroke="#388e3c" stroke-width="2.5"/>
  <!-- Stroma (label) -->
  <text x="70" y="95" font-size="11" fill="#1b5e20" font-style="italic">Stroma</text>
  <!-- Grana stacks - stack 1 -->
  <g transform="translate(150,150)">
    <rect x="-22" y="-45" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="-28" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="-11" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="6" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="23" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
  </g>
  <!-- Grana stacks - stack 2 -->
  <g transform="translate(260,145)">
    <rect x="-22" y="-38" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="-21" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="-4" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="13" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="30" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="47" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
  </g>
  <!-- Grana stacks - stack 3 -->
  <g transform="translate(370,155)">
    <rect x="-22" y="-32" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="-15" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="2" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
    <rect x="-22" y="19" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
  </g>
  <!-- Stroma lamellae connecting grana -->
  <path d="M172,150 Q216,130 238,140" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
  <path d="M172,165 Q216,180 238,170" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
  <path d="M282,148 Q326,132 348,142" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
  <path d="M282,163 Q326,178 348,168" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
  <!-- Labels -->
  <line x1="150" y1="105" x2="120" y2="70" stroke="#2e7d32" stroke-width="1"/>
  <text x="55" y="66" font-size="11" fill="#2e7d32" font-weight="bold">Grana</text>
  <line x1="210" y1="155" x2="185" y2="220" stroke="#388e3c" stroke-width="1"/>
  <text x="115" y="238" font-size="11" fill="#388e3c" font-weight="bold">Stroma Lamellae</text>
  <line x1="45" y1="160" x2="35" y2="160" stroke="#2e7d32" stroke-width="1"/>
  <text x="2" y="148" font-size="10" fill="#2e7d32" font-weight="bold">Outer</text>
  <text x="2" y="162" font-size="10" fill="#2e7d32" font-weight="bold">Membrane</text>
  <line x1="260" y1="50" x2="260" y2="30" stroke="#1b5e20" stroke-width="1"/>
  <text x="215" y="26" font-size="11" fill="#1b5e20" font-weight="bold">Thylakoid Disc</text>
  <!-- Ribosomes -->
  <circle cx="100" cy="170" r="4" fill="#f57f17"/>
  <circle cx="115" cy="165" r="4" fill="#f57f17"/>
  <circle cx="108" cy="180" r="4" fill="#f57f17"/>
  <text x="60" y="200" font-size="10" fill="#f57f17">Ribosomes</text>
</svg>`,
  },

  // ── DICOT STEM ───────────────────────────────────────────────────────────
  "Anatomy of Flowering Plants": {
    title: "T.S. of Dicot Stem (Sunflower)",
    description: "Transverse section showing epidermis, cortex, vascular bundles, and pith",
    labels: ["Epidermis", "Cortex", "Endodermis", "Pericycle", "Xylem", "Phloem", "Pith", "Vascular Bundle"],
    svg: `<svg viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Pith (center) -->
  <circle cx="230" cy="230" r="72" fill="#fff9c4" stroke="#f9a825" stroke-width="2"/>
  <text x="204" y="234" font-size="12" fill="#f9a825" font-weight="bold">Pith</text>
  <!-- Endodermis ring -->
  <circle cx="230" cy="230" r="128" fill="none" stroke="#7b1fa2" stroke-width="3" stroke-dasharray="6,3"/>
  <!-- Cortex -->
  <circle cx="230" cy="230" r="155" fill="#c8e6c9" stroke="#388e3c" stroke-width="2.5" opacity="0.5"/>
  <!-- Hypodermis / Epidermis -->
  <circle cx="230" cy="230" r="178" fill="none" stroke="#2e7d32" stroke-width="6"/>
  <!-- Vascular bundles (6 arranged in circle) -->
  <g id="vb">
    <!-- Phloem (outer, small) -->
    <ellipse cx="230" cy="120" rx="18" ry="12" fill="#ffcc80" stroke="#ef6c00" stroke-width="2"/>
    <!-- Xylem (inner, larger) -->
    <ellipse cx="230" cy="142" rx="20" ry="14" fill="#ef9a9a" stroke="#c62828" stroke-width="2"/>
  </g>
  <!-- Rotate copies of vascular bundle -->
  <use href="#vb" transform="rotate(60 230 230)"/>
  <use href="#vb" transform="rotate(120 230 230)"/>
  <use href="#vb" transform="rotate(180 230 230)"/>
  <use href="#vb" transform="rotate(240 230 230)"/>
  <use href="#vb" transform="rotate(300 230 230)"/>
  <!-- Pericycle -->
  <circle cx="230" cy="230" r="108" fill="none" stroke="#795548" stroke-width="3"/>
  <!-- Cortex parenchyma cells (dots) -->
  <circle cx="175" cy="175" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
  <circle cx="195" cy="165" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
  <circle cx="165" cy="198" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
  <circle cx="285" cy="175" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
  <circle cx="265" cy="165" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
  <circle cx="295" cy="198" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
  <!-- Labels with lines -->
  <line x1="230" y1="52" x2="230" y2="20" stroke="#2e7d32" stroke-width="1.2"/>
  <text x="175" y="16" font-size="11" fill="#2e7d32" font-weight="bold">Epidermis</text>
  <line x1="290" y1="82" x2="340" y2="55" stroke="#388e3c" stroke-width="1.2"/>
  <text x="342" y="52" font-size="11" fill="#388e3c" font-weight="bold">Cortex</text>
  <line x1="336" y1="158" x2="395" y2="145" stroke="#7b1fa2" stroke-width="1.2"/>
  <text x="397" y="142" font-size="11" fill="#7b1fa2" font-weight="bold">Endodermis</text>
  <line x1="330" y1="180" x2="395" y2="180" stroke="#795548" stroke-width="1.2"/>
  <text x="397" y="184" font-size="11" fill="#795548" font-weight="bold">Pericycle</text>
  <line x1="248" y1="120" x2="310" y2="85" stroke="#ef6c00" stroke-width="1.2"/>
  <text x="312" y="82" font-size="11" fill="#ef6c00" font-weight="bold">Phloem</text>
  <line x1="250" y1="142" x2="310" y2="110" stroke="#c62828" stroke-width="1.2"/>
  <text x="312" y="107" font-size="11" fill="#c62828" font-weight="bold">Xylem</text>
  <line x1="165" y1="230" x2="30" y2="230" stroke="#f9a825" stroke-width="1.2"/>
  <text x="5" y="234" font-size="11" fill="#f9a825" font-weight="bold">Pith</text>
</svg>`,
  },

  // ── MITOCHONDRIA ─────────────────────────────────────────────────────────
  "Biomolecules": {
    title: "Structure of Mitochondria",
    description: "Cross-section showing outer membrane, inner membrane, cristae, and matrix",
    labels: ["Outer Membrane", "Inner Membrane", "Cristae", "Matrix", "Ribosome", "DNA", "Intermembrane Space"],
    svg: `<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Outer membrane -->
  <ellipse cx="250" cy="150" rx="220" ry="120" fill="#fff8e1" stroke="#f57f17" stroke-width="4"/>
  <!-- Inner membrane (wavy) -->
  <ellipse cx="250" cy="150" rx="195" ry="98" fill="#fff3e0" stroke="#ff8f00" stroke-width="2.5"/>
  <!-- Matrix -->
  <ellipse cx="250" cy="150" rx="185" ry="88" fill="#ffe0b2" opacity="0.6"/>
  <!-- Cristae (infoldings) -->
  <path d="M80,130 Q110,90 110,150 Q110,200 80,170" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
  <path d="M150,70 Q150,110 190,110 Q230,110 230,70" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
  <path d="M270,70 Q270,110 310,110 Q350,110 350,70" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
  <path d="M420,130 Q390,90 390,150 Q390,200 420,170" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
  <path d="M150,230 Q150,190 190,190 Q230,190 230,230" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
  <path d="M270,230 Q270,190 310,190 Q350,190 350,230" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
  <!-- Ribosomes in matrix -->
  <circle cx="200" cy="145" r="5" fill="#c62828"/>
  <circle cx="215" cy="155" r="5" fill="#c62828"/>
  <circle cx="250" cy="140" r="5" fill="#c62828"/>
  <circle cx="280" cy="155" r="5" fill="#c62828"/>
  <circle cx="300" cy="145" r="5" fill="#c62828"/>
  <!-- mtDNA -->
  <ellipse cx="250" cy="165" rx="25" ry="12" fill="none" stroke="#1565c0" stroke-width="2.5" stroke-dasharray="4,2"/>
  <text x="232" y="169" font-size="9" fill="#1565c0" font-weight="bold">mt-DNA</text>
  <!-- Labels -->
  <line x1="250" y1="30" x2="250" y2="10" stroke="#f57f17" stroke-width="1.2"/>
  <text x="160" y="8" font-size="11" fill="#f57f17" font-weight="bold">Outer Membrane</text>
  <line x1="250" y1="52" x2="320" y2="20" stroke="#ff8f00" stroke-width="1.2"/>
  <text x="322" y="17" font-size="11" fill="#ff8f00" font-weight="bold">Inner Membrane</text>
  <line x1="155" y1="120" x2="95" y2="90" stroke="#f57f17" stroke-width="1.2"/>
  <text x="20" y="87" font-size="11" fill="#f57f17" font-weight="bold">Cristae</text>
  <line x1="250" y1="145" x2="180" y2="250" stroke="#e65100" stroke-width="1.2"/>
  <text x="130" y="265" font-size="11" fill="#e65100" font-weight="bold">Matrix</text>
  <line x1="265" y1="150" x2="360" y2="250" stroke="#c62828" stroke-width="1.2"/>
  <text x="362" y="265" font-size="11" fill="#c62828" font-weight="bold">Ribosomes</text>
  <line x1="250" y1="270" x2="250" y2="290" stroke="#f57f17" stroke-width="1.2"/>
  <text x="140" y="300" font-size="11" fill="#f57f17">Intermembrane Space</text>
</svg>`,
  },

  // ── DIGESTIVE SYSTEM ─────────────────────────────────────────────────────
  "Digestion & Absorption": {
    title: "Human Alimentary Canal",
    description: "Schematic diagram of the human digestive system showing organs and glands",
    labels: ["Mouth & Teeth", "Oesophagus", "Stomach", "Small Intestine", "Large Intestine", "Liver", "Pancreas", "Rectum"],
    svg: `<svg viewBox="0 0 460 520" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Mouth -->
  <ellipse cx="230" cy="35" rx="38" ry="20" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
  <text x="207" y="39" font-size="10" fill="#c62828" font-weight="bold">Mouth</text>
  <!-- Teeth indication -->
  <rect x="198" y="25" width="8" height="8" rx="2" fill="white" stroke="#c62828" stroke-width="1"/>
  <rect x="210" y="25" width="8" height="8" rx="2" fill="white" stroke="#c62828" stroke-width="1"/>
  <rect x="248" y="25" width="8" height="8" rx="2" fill="white" stroke="#c62828" stroke-width="1"/>
  <rect x="260" y="25" width="8" height="8" rx="2" fill="white" stroke="#c62828" stroke-width="1"/>
  <!-- Oesophagus -->
  <rect x="218" y="55" width="24" height="70" rx="10" fill="#ef9a9a" stroke="#c62828" stroke-width="2"/>
  <line x1="230" y1="55" x2="230" y2="125" stroke="#c62828" stroke-width="1" stroke-dasharray="3,2"/>
  <!-- Label oesophagus -->
  <line x1="242" y1="90" x2="310" y2="80" stroke="#c62828" stroke-width="1"/>
  <text x="312" y="78" font-size="10" fill="#c62828" font-weight="bold">Oesophagus</text>
  <!-- Stomach -->
  <path d="M200,125 Q160,135 155,165 Q148,200 165,225 Q185,248 220,250 Q255,252 268,235 Q285,215 282,185 Q278,155 260,135 Q242,122 200,125Z"
    fill="#ffccbc" stroke="#e64a19" stroke-width="2.5"/>
  <text x="192" y="195" font-size="10" fill="#e64a19" font-weight="bold">Stomach</text>
  <!-- Rugae lines in stomach -->
  <path d="M168,165 Q195,158 225,165" fill="none" stroke="#e64a19" stroke-width="1" opacity="0.5"/>
  <path d="M163,185 Q193,178 226,185" fill="none" stroke="#e64a19" stroke-width="1" opacity="0.5"/>
  <path d="M165,205 Q196,198 228,205" fill="none" stroke="#e64a19" stroke-width="1" opacity="0.5"/>
  <!-- Small intestine (coiled) -->
  <path d="M245,245 Q290,250 295,275 Q300,305 270,315 Q240,325 220,310 Q195,295 200,268 Q205,248 230,248"
    fill="none" stroke="#ff7043" stroke-width="12" stroke-linecap="round"/>
  <path d="M200,268 Q185,280 188,308 Q192,335 220,342 Q250,348 270,335 Q295,318 292,290"
    fill="none" stroke="#ff8a65" stroke-width="11" stroke-linecap="round"/>
  <path d="M292,310 Q305,330 295,358 Q282,380 255,385 Q228,388 212,372 Q195,355 200,330"
    fill="none" stroke="#ff7043" stroke-width="12" stroke-linecap="round"/>
  <text x="222" y="302" font-size="9" fill="white" font-weight="bold">Small</text>
  <text x="218" y="314" font-size="9" fill="white" font-weight="bold">Intestine</text>
  <!-- Large intestine -->
  <path d="M200,390 Q170,395 155,420 Q148,445 165,465 Q188,482 220,480 Q255,478 285,465 Q310,448 315,420 Q318,395 295,385 Q270,375 245,385"
    fill="none" stroke="#8d6e63" stroke-width="16" stroke-linecap="round"/>
  <text x="198" y="440" font-size="9" fill="white" font-weight="bold">Large Intestine</text>
  <!-- Rectum -->
  <rect x="218" y="475" width="24" height="35" rx="10" fill="#a1887f" stroke="#6d4c41" stroke-width="2"/>
  <text x="250" y="498" font-size="9" fill="#6d4c41" font-weight="bold">Rectum</text>
  <!-- Liver -->
  <path d="M300,130 Q355,128 375,155 Q390,178 378,205 Q362,228 330,228 Q305,225 295,205 Q285,182 300,155Z"
    fill="#ef9a9a" stroke="#b71c1c" stroke-width="2"/>
  <text x="320" y="182" font-size="10" fill="#b71c1c" font-weight="bold">Liver</text>
  <!-- Gall bladder -->
  <ellipse cx="358" cy="230" rx="18" ry="12" fill="#c5e1a5" stroke="#558b2f" stroke-width="1.5"/>
  <text x="340" y="248" font-size="8" fill="#558b2f">Gall Bladder</text>
  <!-- Pancreas -->
  <path d="M145,230 Q175,222 210,228 Q195,245 165,252 Q145,250 145,230Z"
    fill="#ffe0b2" stroke="#e65100" stroke-width="2"/>
  <text x="145" y="243" font-size="9" fill="#e65100" font-weight="bold">Pancreas</text>
  <!-- Bile duct -->
  <line x1="330" y1="228" x2="282" y2="250" stroke="#558b2f" stroke-width="2"/>
  <!-- Pancreatic duct -->
  <line x1="195" y1="240" x2="252" y2="252" stroke="#e65100" stroke-width="2"/>
  <!-- Labels left -->
  <line x1="155" y1="175" x2="90" y2="155" stroke="#e64a19" stroke-width="1"/>
  <text x="20" y="152" font-size="10" fill="#e64a19" font-weight="bold">Stomach</text>
</svg>`,
  },

  // ── BREATHING ────────────────────────────────────────────────────────────
  "Breathing & Exchange of Gases": {
    title: "Human Respiratory System",
    description: "Lungs, trachea, bronchi and alveoli structure",
    labels: ["Nasal Cavity", "Trachea", "Bronchus", "Bronchioles", "Alveoli", "Diaphragm", "Right Lung", "Left Lung"],
    svg: `<svg viewBox="0 0 460 420" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Nasal cavity -->
  <path d="M195,20 Q230,15 265,20 Q270,35 265,50 Q230,55 195,50 Q190,35 195,20Z" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
  <text x="198" y="38" font-size="9" fill="#c62828" font-weight="bold">Nasal Cavity</text>
  <!-- Pharynx/larynx -->
  <rect x="215" y="55" width="30" height="30" rx="8" fill="#ef9a9a" stroke="#c62828" stroke-width="1.5"/>
  <text x="200" y="62" font-size="8" fill="#c62828">Larynx</text>
  <!-- Trachea -->
  <rect x="220" y="85" width="20" height="55" rx="8" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
  <!-- Tracheal rings -->
  <line x1="220" y1="98" x2="240" y2="98" stroke="#1565c0" stroke-width="2"/>
  <line x1="220" y1="110" x2="240" y2="110" stroke="#1565c0" stroke-width="2"/>
  <line x1="220" y1="122" x2="240" y2="122" stroke="#1565c0" stroke-width="2"/>
  <line x1="220" y1="134" x2="240" y2="134" stroke="#1565c0" stroke-width="2"/>
  <text x="245" y="115" font-size="10" fill="#1565c0" font-weight="bold">Trachea</text>
  <!-- Left bronchus -->
  <path d="M220,140 Q185,145 160,160" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
  <!-- Right bronchus -->
  <path d="M240,140 Q275,145 300,160" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
  <!-- Left lung -->
  <path d="M80,160 Q60,185 62,230 Q65,280 90,320 Q115,355 155,360 Q190,362 210,340 Q228,318 225,280 Q222,240 210,205 Q195,170 175,160 Q140,150 80,160Z"
    fill="#ffcdd2" stroke="#e57373" stroke-width="2.5" opacity="0.85"/>
  <text x="118" y="270" font-size="12" fill="#c62828" font-weight="bold">Left</text>
  <text x="115" y="285" font-size="12" fill="#c62828" font-weight="bold">Lung</text>
  <!-- Right lung -->
  <path d="M380,160 Q400,185 398,230 Q395,280 370,320 Q345,355 305,360 Q270,362 250,340 Q232,318 235,280 Q238,240 250,205 Q265,170 285,160 Q320,150 380,160Z"
    fill="#ffcdd2" stroke="#e57373" stroke-width="2.5" opacity="0.85"/>
  <text x="300" y="270" font-size="12" fill="#c62828" font-weight="bold">Right</text>
  <text x="300" y="285" font-size="12" fill="#c62828" font-weight="bold">Lung</text>
  <!-- Bronchioles in lungs -->
  <path d="M160,165 Q148,200 142,240 Q138,270 145,300" fill="none" stroke="#ef9a9a" stroke-width="3"/>
  <path d="M160,165 Q162,210 158,250 Q155,278 160,308" fill="none" stroke="#ef9a9a" stroke-width="2.5"/>
  <path d="M160,165 Q175,200 175,240 Q174,272 168,305" fill="none" stroke="#ef9a9a" stroke-width="2.5"/>
  <path d="M300,165 Q310,200 315,240 Q318,270 312,300" fill="none" stroke="#ef9a9a" stroke-width="3"/>
  <path d="M300,165 Q296,210 298,250 Q300,278 296,308" fill="none" stroke="#ef9a9a" stroke-width="2.5"/>
  <path d="M300,165 Q285,200 283,240 Q282,272 288,305" fill="none" stroke="#ef9a9a" stroke-width="2.5"/>
  <!-- Alveoli cluster -->
  <circle cx="145" cy="310" r="12" fill="#ffebee" stroke="#e57373" stroke-width="1.5"/>
  <circle cx="165" cy="318" r="12" fill="#ffebee" stroke="#e57373" stroke-width="1.5"/>
  <circle cx="155" cy="328" r="12" fill="#ffebee" stroke="#e57373" stroke-width="1.5"/>
  <text x="92" y="342" font-size="9" fill="#c62828" font-weight="bold">Alveoli</text>
  <!-- Diaphragm -->
  <path d="M60,375 Q150,360 230,365 Q310,360 400,375 Q390,390 230,385 Q70,390 60,375Z"
    fill="#a5d6a7" stroke="#388e3c" stroke-width="2"/>
  <text x="190" y="383" font-size="10" fill="#1b5e20" font-weight="bold">Diaphragm</text>
  <!-- Labels -->
  <line x1="80" y1="190" x2="40" y2="175" stroke="#e57373" stroke-width="1"/>
  <text x="2" y="172" font-size="10" fill="#c62828" font-weight="bold">Left Lung</text>
</svg>`,
  },

  // ── HUMAN EYE ────────────────────────────────────────────────────────────
  "Neural Control — Eye" : {
    title: "Structure of the Human Eye",
    description: "Cross-section of human eye showing cornea, lens, retina and optic nerve",
    labels: ["Cornea", "Lens", "Retina", "Optic Nerve", "Iris", "Pupil", "Vitreous Humour", "Sclera"],
    svg: `<svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Sclera (white of eye) -->
  <ellipse cx="210" cy="190" rx="175" ry="155" fill="white" stroke="#bdbdbd" stroke-width="4"/>
  <!-- Choroid (dark layer) -->
  <ellipse cx="210" cy="190" rx="162" ry="142" fill="#3e2723" opacity="0.7"/>
  <!-- Vitreous humour -->
  <ellipse cx="218" cy="193" rx="140" ry="122" fill="#e3f2fd" stroke="none"/>
  <!-- Retina -->
  <ellipse cx="210" cy="190" rx="155" ry="135" fill="none" stroke="#ff8a65" stroke-width="6"/>
  <!-- Cornea (front transparent dome) -->
  <path d="M38,150 Q10,190 38,230" fill="none" stroke="#90caf9" stroke-width="10" stroke-linecap="round"/>
  <path d="M38,150 Q52,190 38,230" fill="#e3f2fd" stroke="#90caf9" stroke-width="3" opacity="0.5"/>
  <!-- Aqueous humour -->
  <path d="M38,160 Q65,190 38,220" fill="#e3f2fd" opacity="0.6"/>
  <!-- Iris -->
  <circle cx="95" cy="190" r="52" fill="#5c4033" stroke="#3e2723" stroke-width="3"/>
  <circle cx="95" cy="190" r="52" fill="none" stroke="#795548" stroke-width="1" stroke-dasharray="4,3"/>
  <!-- Pupil -->
  <circle cx="95" cy="190" r="22" fill="black"/>
  <!-- Lens -->
  <ellipse cx="130" cy="190" rx="28" ry="48" fill="#e1f5fe" stroke="#0288d1" stroke-width="2.5" opacity="0.85"/>
  <text x="112" y="194" font-size="9" fill="#0288d1" font-weight="bold">Lens</text>
  <!-- Ciliary body -->
  <path d="M85,142 Q98,120 120,138" fill="none" stroke="#5d4037" stroke-width="5"/>
  <path d="M85,238 Q98,260 120,242" fill="none" stroke="#5d4037" stroke-width="5"/>
  <!-- Suspensory ligaments -->
  <line x1="100" y1="145" x2="120" y2="152" stroke="#795548" stroke-width="1.5"/>
  <line x1="100" y1="155" x2="122" y2="162" stroke="#795548" stroke-width="1.5"/>
  <line x1="100" y1="225" x2="122" y2="218" stroke="#795548" stroke-width="1.5"/>
  <line x1="100" y1="235" x2="120" y2="228" stroke="#795548" stroke-width="1.5"/>
  <!-- Fovea centralis (yellow spot) -->
  <circle cx="295" cy="190" r="10" fill="#fdd835" stroke="#f9a825" stroke-width="2"/>
  <text x="298" y="175" font-size="8" fill="#f9a825" font-weight="bold">Fovea</text>
  <!-- Blind spot -->
  <circle cx="355" cy="195" r="10" fill="#bdbdbd" stroke="#9e9e9e" stroke-width="2"/>
  <text x="340" y="218" font-size="8" fill="#757575">Blind Spot</text>
  <!-- Optic nerve -->
  <rect x="375" y="178" width="80" height="25" rx="12" fill="#ffd54f" stroke="#f9a825" stroke-width="2"/>
  <text x="382" y="194" font-size="10" fill="#e65100" font-weight="bold">Optic Nerve</text>
  <!-- Labels -->
  <line x1="38" y1="175" x2="15" y2="140" stroke="#90caf9" stroke-width="1"/>
  <text x="2" y="136" font-size="10" fill="#1565c0" font-weight="bold">Cornea</text>
  <line x1="95" y1="138" x2="80" y2="100" stroke="#795548" stroke-width="1"/>
  <text x="52" y="96" font-size="10" fill="#5d4037" font-weight="bold">Iris</text>
  <line x1="95" y1="168" x2="75" y2="140" stroke="#000" stroke-width="1"/>
  <text x="38" y="136" font-size="10" fill="black" font-weight="bold">Pupil</text>
  <line x1="210" y1="55" x2="210" y2="30" stroke="#ff8a65" stroke-width="1"/>
  <text x="170" y="26" font-size="10" fill="#e64a19" font-weight="bold">Retina</text>
  <line x1="50" y1="190" x2="25" y2="190" stroke="#bdbdbd" stroke-width="1"/>
  <text x="2" y="194" font-size="9" fill="#757575" font-weight="bold">Sclera</text>
  <line x1="210" y1="330" x2="210" y2="355" stroke="#1565c0" stroke-width="1"/>
  <text x="145" y="368" font-size="10" fill="#0d47a1" font-weight="bold">Vitreous Humour</text>
</svg>`,
  },

  // ── DNA ──────────────────────────────────────────────────────────────────
  "Molecular Basis of Inheritance": {
    title: "DNA Double Helix Structure",
    description: "Watson-Crick model showing base pairs, sugar-phosphate backbone and major/minor grooves",
    labels: ["Phosphate Group", "Deoxyribose Sugar", "Adenine-Thymine", "Guanine-Cytosine", "Major Groove", "Minor Groove", "Hydrogen Bonds"],
    svg: `<svg viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Left backbone -->
  <path d="M120,20 Q80,60 120,100 Q160,140 120,180 Q80,220 120,260 Q160,300 120,340 Q80,380 120,420 Q160,460 120,480"
    fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
  <!-- Right backbone -->
  <path d="M280,20 Q320,60 280,100 Q240,140 280,180 Q320,220 280,260 Q240,300 280,340 Q320,380 280,420 Q240,460 280,480"
    fill="none" stroke="#c62828" stroke-width="8" stroke-linecap="round"/>
  <!-- Base pairs - Adenine-Thymine (blue-green) -->
  <rect x="130" y="58" width="40" height="12" rx="4" fill="#1565c0"/>
  <rect x="230" y="58" width="40" height="12" rx="4" fill="#2e7d32"/>
  <line x1="170" y1="64" x2="230" y2="64" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="192" y="56" font-size="8" fill="#1565c0">A</text>
  <text x="218" y="56" font-size="8" fill="#2e7d32">T</text>
  <!-- G-C pair -->
  <rect x="145" y="108" width="40" height="12" rx="4" fill="#7b1fa2"/>
  <rect x="215" y="108" width="40" height="12" rx="4" fill="#e65100"/>
  <line x1="185" y1="114" x2="215" y2="114" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="196" y="106" font-size="8" fill="#7b1fa2">G</text>
  <text x="210" y="106" font-size="8" fill="#e65100">C</text>
  <!-- T-A pair -->
  <rect x="130" y="158" width="40" height="12" rx="4" fill="#2e7d32"/>
  <rect x="230" y="158" width="40" height="12" rx="4" fill="#1565c0"/>
  <line x1="170" y1="164" x2="230" y2="164" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="192" y="156" font-size="8" fill="#2e7d32">T</text>
  <text x="218" y="156" font-size="8" fill="#1565c0">A</text>
  <!-- C-G pair -->
  <rect x="145" y="208" width="40" height="12" rx="4" fill="#e65100"/>
  <rect x="215" y="208" width="40" height="12" rx="4" fill="#7b1fa2"/>
  <line x1="185" y1="214" x2="215" y2="214" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="196" y="206" font-size="8" fill="#e65100">C</text>
  <text x="210" y="206" font-size="8" fill="#7b1fa2">G</text>
  <!-- A-T pair -->
  <rect x="130" y="258" width="40" height="12" rx="4" fill="#1565c0"/>
  <rect x="230" y="258" width="40" height="12" rx="4" fill="#2e7d32"/>
  <line x1="170" y1="264" x2="230" y2="264" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="192" y="256" font-size="8" fill="#1565c0">A</text>
  <text x="218" y="256" font-size="8" fill="#2e7d32">T</text>
  <!-- G-C pair -->
  <rect x="145" y="308" width="40" height="12" rx="4" fill="#7b1fa2"/>
  <rect x="215" y="308" width="40" height="12" rx="4" fill="#e65100"/>
  <line x1="185" y1="314" x2="215" y2="314" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="196" y="306" font-size="8" fill="#7b1fa2">G</text>
  <text x="210" y="306" font-size="8" fill="#e65100">C</text>
  <!-- A-T pair -->
  <rect x="130" y="358" width="40" height="12" rx="4" fill="#2e7d32"/>
  <rect x="230" y="358" width="40" height="12" rx="4" fill="#1565c0"/>
  <line x1="170" y1="364" x2="230" y2="364" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="192" y="356" font-size="8" fill="#2e7d32">T</text>
  <text x="218" y="356" font-size="8" fill="#1565c0">A</text>
  <!-- C-G -->
  <rect x="145" y="408" width="40" height="12" rx="4" fill="#e65100"/>
  <rect x="215" y="408" width="40" height="12" rx="4" fill="#7b1fa2"/>
  <line x1="185" y1="414" x2="215" y2="414" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="196" y="406" font-size="8" fill="#e65100">C</text>
  <text x="210" y="406" font-size="8" fill="#7b1fa2">G</text>
  <!-- Labels -->
  <line x1="120" y1="40" x2="60" y2="25" stroke="#1565c0" stroke-width="1"/>
  <text x="2" y="22" font-size="10" fill="#1565c0" font-weight="bold">Phosphate</text>
  <text x="2" y="34" font-size="10" fill="#1565c0" font-weight="bold">backbone</text>
  <line x1="280" y1="40" x2="340" y2="25" stroke="#c62828" stroke-width="1"/>
  <text x="342" y="22" font-size="10" fill="#c62828" font-weight="bold">Sugar</text>
  <text x="342" y="34" font-size="10" fill="#c62828" font-weight="bold">backbone</text>
  <line x1="200" y1="64" x2="350" y2="80" stroke="#ffd54f" stroke-width="1"/>
  <text x="352" y="84" font-size="9" fill="#f9a825" font-weight="bold">H-bonds</text>
  <!-- Major groove arrow -->
  <text x="10" y="140" font-size="9" fill="#388e3c" font-weight="bold">Major</text>
  <text x="10" y="152" font-size="9" fill="#388e3c" font-weight="bold">Groove</text>
  <text x="10" y="240" font-size="9" fill="#0288d1" font-weight="bold">Minor</text>
  <text x="10" y="252" font-size="9" fill="#0288d1" font-weight="bold">Groove</text>
  <!-- Legend -->
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

// Convert Wikimedia data to DiagramData format with image tag
function wikimediaToSvg(w: typeof WIKIMEDIA_DIAGRAMS[string]): DiagramData {
  return {
    title: w.title,
    description: w.description,
    labels: w.labels,
    svg: `<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg">
  <image href="${w.url}" x="0" y="0" width="600" height="400" preserveAspectRatio="xMidYMid meet"/>
  <text x="2" y="418" font-size="8" fill="#999" font-family="Arial">${w.credit}</text>
</svg>`,
  };
}

// Map chapter keywords to diagram keys
export function findDiagram(chapter: string): DiagramData | null {
  // Check Wikimedia first (real images)
  if (WIKIMEDIA_DIAGRAMS[chapter]) return wikimediaToSvg(WIKIMEDIA_DIAGRAMS[chapter]);

  // Keyword match for Wikimedia
  const ch = chapter.toLowerCase();
  const wikiMatch = Object.entries(WIKIMEDIA_DIAGRAMS).find(([key]) => {
    const k = key.toLowerCase();
    return ch.includes(k.substring(0, 8)) || k.includes(ch.substring(0, 8));
  });
  if (wikiMatch) return wikimediaToSvg(wikiMatch[1]);

  // Exact match SVG fallback
  if (BIOLOGY_DIAGRAMS[chapter]) return BIOLOGY_DIAGRAMS[chapter];

  // Keyword matching
  
  if (ch.includes("cell") && !ch.includes("cell cycle")) return BIOLOGY_DIAGRAMS["Cell — The Unit of Life"];
  if (ch.includes("neural") || ch.includes("neuron") || ch.includes("nervous") || ch.includes("eye") || ch.includes("ear")) return BIOLOGY_DIAGRAMS["Neural Control & Coordination"];
  if (ch.includes("circulation") || ch.includes("heart") || ch.includes("blood")) return BIOLOGY_DIAGRAMS["Body Fluids & Circulation"];
  if (ch.includes("excret") || ch.includes("kidney") || ch.includes("nephron")) return BIOLOGY_DIAGRAMS["Excretory Products & Elimination"];
  if (ch.includes("photosynthesis") || ch.includes("chloroplast")) return BIOLOGY_DIAGRAMS["Photosynthesis"];
  if (ch.includes("anatomy") && ch.includes("plant") || ch.includes("dicot") || ch.includes("monocot")) return BIOLOGY_DIAGRAMS["Anatomy of Flowering Plants"];
  if (ch.includes("biomolecule") || ch.includes("mitochondria")) return BIOLOGY_DIAGRAMS["Biomolecules"];
  if (ch.includes("digest") || ch.includes("absorpt") || ch.includes("alimentary")) return BIOLOGY_DIAGRAMS["Digestion & Absorption"];
  if (ch.includes("breath") || ch.includes("lung") || ch.includes("respirat") || ch.includes("alveol")) return BIOLOGY_DIAGRAMS["Breathing & Exchange of Gases"];
  if (ch.includes("dna") || ch.includes("molecular") || ch.includes("inheritance") || ch.includes("gene")) return BIOLOGY_DIAGRAMS["Molecular Basis of Inheritance"];

  return null;
}
