// src/lib/biologyDiagrams.ts
// Pre-drawn realistic SVG diagrams for top NEET Biology chapters

export interface DiagramData {
  title: string;
  svg: string;
  labels: string[];
  description: string;
}

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

};

// Map chapter keywords to diagram keys
export function findDiagram(chapter: string): DiagramData | null {
  // Exact match first
  if (BIOLOGY_DIAGRAMS[chapter]) return BIOLOGY_DIAGRAMS[chapter];

  // Keyword matching
  const ch = chapter.toLowerCase();
  if (ch.includes("cell") && !ch.includes("cell cycle")) return BIOLOGY_DIAGRAMS["Cell — The Unit of Life"];
  if (ch.includes("neural") || ch.includes("neuron") || ch.includes("nervous")) return BIOLOGY_DIAGRAMS["Neural Control & Coordination"];
  if (ch.includes("circulation") || ch.includes("heart") || ch.includes("blood")) return BIOLOGY_DIAGRAMS["Body Fluids & Circulation"];
  if (ch.includes("excret") || ch.includes("kidney") || ch.includes("nephron")) return BIOLOGY_DIAGRAMS["Excretory Products & Elimination"];
  if (ch.includes("photosynthesis") || ch.includes("chloroplast")) return BIOLOGY_DIAGRAMS["Photosynthesis"];
  if (ch.includes("anatomy") && ch.includes("plant") || ch.includes("dicot") || ch.includes("monocot")) return BIOLOGY_DIAGRAMS["Anatomy of Flowering Plants"];
  if (ch.includes("biomolecule") || ch.includes("mitochondria")) return BIOLOGY_DIAGRAMS["Biomolecules"];

  return null;
}
