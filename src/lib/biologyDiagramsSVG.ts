// src/lib/biologyDiagramsSVG.ts
// Hand-coded NCERT-accurate SVG diagrams for all Biology chapters
// No AI generation needed — always loads instantly, always correct

export interface SVGDiagram {
  title: string;
  svg: string;
  neetFacts: string[];
}

const DIAGRAMS: Record<string, SVGDiagram> = {

"Cell — The Unit of Life": {
  title: "Animal Cell — Cross Section",
  neetFacts: [
    "Animal cells have centrioles; plant cells do not",
    "Lysosome = 'suicide bag' (contains hydrolytic enzymes)",
    "Mitochondria has its own DNA — semi-autonomous organelle",
  ],
  svg: `<svg viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<text x="340" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">Animal Cell — Cross Section</text>
<ellipse cx="310" cy="270" rx="210" ry="185" fill="#e8f5e9" stroke="#2e7d32" stroke-width="3"/>
<ellipse cx="295" cy="265" rx="72" ry="60" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
<ellipse cx="285" cy="258" rx="22" ry="18" fill="#1565c0" stroke="#0d47a1" stroke-width="1.5"/>
<text x="285" y="262" text-anchor="middle" font-size="8" fill="white" font-weight="bold">Nucleolus</text>
<ellipse cx="435" cy="195" rx="32" ry="18" fill="#ffe0b2" stroke="#e65100" stroke-width="2"/>
<path d="M420 192 Q435 186 450 192" fill="none" stroke="#e65100" stroke-width="1.2"/>
<path d="M420 198 Q435 204 450 198" fill="none" stroke="#e65100" stroke-width="1.2"/>
<path d="M165 210 Q195 204 201 210 Q195 216 165 216Z" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.2"/>
<path d="M162 222 Q195 216 202 222 Q195 228 162 228Z" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.2"/>
<path d="M165 234 Q195 228 201 234 Q195 240 165 240Z" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.2"/>
<path d="M168 246 Q194 240 200 246 Q194 252 168 252Z" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.2"/>
<path d="M340 340 Q355 330 370 340 Q385 350 400 340 Q415 330 430 340" fill="none" stroke="#8d6e63" stroke-width="2.5"/>
<circle cx="351" cy="336" r="3" fill="#8d6e63"/><circle cx="363" cy="345" r="3" fill="#8d6e63"/>
<circle cx="377" cy="337" r="3" fill="#8d6e63"/><circle cx="390" cy="346" r="3" fill="#8d6e63"/>
<circle cx="404" cy="337" r="3" fill="#8d6e63"/><circle cx="418" cy="344" r="3" fill="#8d6e63"/>
<circle cx="215" cy="340" r="18" fill="#ffcdd2" stroke="#c62828" stroke-width="1.8"/>
<text x="215" y="344" text-anchor="middle" font-size="8" fill="#b71c1c" font-weight="bold">Lyso</text>
<rect x="370" y="148" width="12" height="22" rx="3" fill="#b2dfdb" stroke="#00695c" stroke-width="1.5"/>
<rect x="386" y="148" width="22" height="12" rx="3" fill="#b2dfdb" stroke="#00695c" stroke-width="1.5"/>
<ellipse cx="252" cy="355" rx="20" ry="14" fill="#e3f2fd" stroke="#0277bd" stroke-width="1.5"/>
<circle cx="360" cy="220" r="4" fill="#f9a825"/>
<circle cx="375" cy="235" r="4" fill="#f9a825"/>
<circle cx="345" cy="240" r="4" fill="#f9a825"/>
<line x1="500" y1="108" x2="488" y2="92" stroke="#2e7d32" stroke-width="1.2"/>
<text x="502" y="108" font-size="10" fill="#2e7d32" font-weight="bold">Cell Membrane</text>
<line x1="235" y1="222" x2="200" y2="175" stroke="#1565c0" stroke-width="1.2"/>
<text x="118" y="172" font-size="10" fill="#1565c0" font-weight="bold">Nucleus</text>
<line x1="452" y1="188" x2="488" y2="165" stroke="#e65100" stroke-width="1.2"/>
<text x="490" y="163" font-size="10" fill="#e65100" font-weight="bold">Mitochondria</text>
<text x="490" y="176" font-size="9" fill="#e65100">(power house)</text>
<line x1="163" y1="228" x2="88" y2="228" stroke="#6a1b9a" stroke-width="1.2"/>
<text x="8" y="222" font-size="10" fill="#6a1b9a" font-weight="bold">Golgi</text>
<text x="8" y="236" font-size="10" fill="#6a1b9a" font-weight="bold">Apparatus</text>
<line x1="400" y1="342" x2="440" y2="385" stroke="#4e342e" stroke-width="1.2"/>
<text x="442" y="385" font-size="10" fill="#4e342e" font-weight="bold">Rough ER</text>
<text x="442" y="398" font-size="9" fill="#4e342e">(+ ribosomes)</text>
<line x1="215" y1="358" x2="185" y2="400" stroke="#c62828" stroke-width="1.2"/>
<text x="112" y="410" font-size="10" fill="#c62828" font-weight="bold">Lysosome</text>
<line x1="390" y1="150" x2="428" y2="115" stroke="#00695c" stroke-width="1.2"/>
<text x="430" y="113" font-size="10" fill="#00695c" font-weight="bold">Centrioles</text>
<line x1="362" y1="228" x2="340" y2="268" stroke="#f57f17" stroke-width="1.2"/>
<text x="272" y="292" font-size="9" fill="#f57f17" font-weight="bold">Free Ribosomes</text>
<line x1="252" y1="368" x2="228" y2="400" stroke="#0277bd" stroke-width="1.2"/>
<text x="155" y="415" font-size="10" fill="#0277bd" font-weight="bold">Vacuole</text>
<text x="420" y="308" font-size="10" fill="#33691e" font-style="italic">Cytoplasm</text>
<rect x="20" y="458" width="640" height="48" rx="8" fill="#fffde7" stroke="#f9a825" stroke-width="1.5"/>
<text x="340" y="475" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Facts</text>
<text x="340" y="490" text-anchor="middle" font-size="9" fill="#bf360c">Animal cells: centrioles present, large vacuoles absent · Lysosome = suicide bag · Mitochondria = powerhouse of cell</text>
<text x="340" y="503" text-anchor="middle" font-size="9" fill="#bf360c">Golgi = post office of cell · Rough ER has ribosomes, Smooth ER does not</text>
</svg>`,
},

"Body Fluids & Circulation": {
  title: "Human Heart — Internal Structure",
  neetFacts: [
    "Left ventricle has thickest wall (pumps to systemic circulation)",
    "Tricuspid valve = 3 cusps (right side); Bicuspid/Mitral = 2 cusps (left side)",
    "SA node = pacemaker of heart (generates 72 impulses/min)",
  ],
  svg: `<svg viewBox="0 0 680 530" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<text x="340" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">Human Heart — Internal Structure</text>
<path d="M340 80 C280 60 200 80 190 140 C180 190 195 230 230 265 C265 300 310 330 340 420 C370 330 415 300 450 265 C485 230 500 190 490 140 C480 80 400 60 340 80Z" fill="#ffcdd2" stroke="#c62828" stroke-width="2.5"/>
<line x1="340" y1="140" x2="340" y2="410" stroke="#c62828" stroke-width="2" stroke-dasharray="4 2"/>
<path d="M210 195 Q270 185 340 195 Q270 185 210 195" fill="#ef9a9a" stroke="#c62828" stroke-width="1"/>
<path d="M340 195 Q410 185 470 195 Q410 185 340 195" fill="#ef9a9a" stroke="#c62828" stroke-width="1"/>
<text x="262" y="175" text-anchor="middle" font-size="11" fill="#b71c1c" font-weight="bold">Right Atrium</text>
<text x="418" y="175" text-anchor="middle" font-size="11" fill="#b71c1c" font-weight="bold">Left Atrium</text>
<text x="252" y="320" text-anchor="middle" font-size="11" fill="#b71c1c" font-weight="bold">Right</text>
<text x="252" y="335" text-anchor="middle" font-size="11" fill="#b71c1c" font-weight="bold">Ventricle</text>
<text x="428" y="310" text-anchor="middle" font-size="11" fill="#b71c1c" font-weight="bold">Left</text>
<text x="428" y="325" text-anchor="middle" font-size="11" fill="#b71c1c" font-weight="bold">Ventricle</text>
<path d="M275 215 Q310 228 340 215 Q310 228 275 215" fill="#ef5350" stroke="#c62828" stroke-width="2"/>
<text x="307" y="238" text-anchor="middle" font-size="8" fill="#7f0000">Tricuspid</text>
<path d="M340 215 Q370 228 405 215 Q370 228 340 215" fill="#ef5350" stroke="#c62828" stroke-width="2"/>
<text x="372" y="238" text-anchor="middle" font-size="8" fill="#7f0000">Bicuspid</text>
<path d="M260 90 Q260 60 265 45" fill="none" stroke="#1565c0" stroke-width="6" stroke-linecap="round"/>
<path d="M265 45 Q268 32 275 32 Q290 32 290 45 L290 75" fill="none" stroke="#1565c0" stroke-width="5" stroke-linecap="round"/>
<text x="195" y="44" font-size="9" fill="#1565c0" font-weight="bold">Pulmonary</text>
<text x="195" y="56" font-size="9" fill="#1565c0" font-weight="bold">Artery</text>
<path d="M390 85 Q400 58 408 45" fill="none" stroke="#ef5350" stroke-width="7" stroke-linecap="round"/>
<path d="M408 45 Q414 30 425 30 Q440 30 440 45 L440 78" fill="none" stroke="#ef5350" stroke-width="6" stroke-linecap="round"/>
<text x="448" y="44" font-size="9" fill="#c62828" font-weight="bold">Aorta</text>
<path d="M210 155 Q190 150 175 155 L175 230 Q175 240 185 240 L210 240" fill="none" stroke="#1565c0" stroke-width="5" stroke-linecap="round"/>
<text x="128" y="200" font-size="9" fill="#1565c0" font-weight="bold">Superior</text>
<text x="128" y="212" font-size="9" fill="#1565c0" font-weight="bold">Vena Cava</text>
<path d="M460 175 Q490 170 500 178 L500 240 Q500 252 488 252 L460 252" fill="none" stroke="#ef9a9a" stroke-width="4" stroke-linecap="round"/>
<text x="502" y="195" font-size="9" fill="#c62828" font-weight="bold">Pulmonary</text>
<text x="502" y="207" font-size="9" fill="#c62828" font-weight="bold">Veins</text>
<path d="M278 330 L262 375 L296 375Z" fill="#ef5350" stroke="#c62828" stroke-width="1"/>
<path d="M402 330 L386 375 L420 375Z" fill="#ef5350" stroke="#c62828" stroke-width="1"/>
<text x="272" y="390" text-anchor="middle" font-size="8" fill="#7f0000">Semilunar</text>
<text x="402" y="390" text-anchor="middle" font-size="8" fill="#7f0000">Semilunar</text>
<text x="85" y="145" font-size="10" fill="#b71c1c" font-weight="bold">RA = deoxygenated</text>
<text x="85" y="158" font-size="10" fill="#b71c1c">blood from body</text>
<text x="490" y="140" font-size="10" fill="#c62828" font-weight="bold">LA = oxygenated</text>
<text x="490" y="153" font-size="10" fill="#c62828">blood from lungs</text>
<rect x="20" y="458" width="640" height="55" rx="8" fill="#fffde7" stroke="#f9a825" stroke-width="1.5"/>
<text x="340" y="475" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Facts</text>
<text x="340" y="490" text-anchor="middle" font-size="9" fill="#bf360c">Left ventricle wall is thickest · Tricuspid (3 cusps) on right, Bicuspid/Mitral (2 cusps) on left</text>
<text x="340" y="503" text-anchor="middle" font-size="9" fill="#bf360c">SA node = pacemaker · AV node delays impulse · Bundle of His → Purkinje fibres</text>
</svg>`,
},

"Excretory Products & Elimination": {
  title: "Nephron — Functional Unit of Kidney",
  neetFacts: [
    "Filtration at glomerulus (Bowman's capsule), Reabsorption in PCT, Secretion in DCT",
    "Loop of Henle maintains concentration gradient in medulla",
    "~180L filtered/day; only 1.5L excreted as urine",
  ],
  svg: `<svg viewBox="0 0 680 530" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<text x="340" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">Nephron — Functional Unit of Kidney</text>
<rect x="20" y="40" width="640" height="20" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1"/>
<text x="340" y="54" text-anchor="middle" font-size="9" fill="#1565c0" font-weight="bold">CORTEX</text>
<rect x="20" y="240" width="640" height="185" rx="6" fill="#fce4ec" stroke="#880e4f" stroke-width="1" fill-opacity="0.3"/>
<text x="340" y="258" text-anchor="middle" font-size="9" fill="#880e4f" font-weight="bold">MEDULLA</text>
<circle cx="180" cy="110" r="42" fill="#c8e6c9" stroke="#2e7d32" stroke-width="2"/>
<circle cx="180" cy="110" r="28" fill="#ffcc80" stroke="#e65100" stroke-width="2"/>
<circle cx="180" cy="110" r="16" fill="#ef9a9a" stroke="#c62828" stroke-width="1.5"/>
<text x="180" y="114" text-anchor="middle" font-size="8" fill="#7f0000" font-weight="bold">Glom.</text>
<path d="M152 90 Q132 75 118 80" fill="none" stroke="#ef5350" stroke-width="3" stroke-linecap="round"/>
<text x="72" y="78" font-size="9" fill="#c62828" font-weight="bold">Afferent</text>
<text x="72" y="90" font-size="9" fill="#c62828" font-weight="bold">Arteriole</text>
<path d="M155 128 Q135 138 122 132" fill="none" stroke="#1565c0" stroke-width="2.5" stroke-linecap="round"/>
<text x="72" y="135" font-size="9" fill="#1565c0" font-weight="bold">Efferent</text>
<text x="72" y="147" font-size="9" fill="#1565c0" font-weight="bold">Arteriole</text>
<path d="M222 100 Q265 85 300 100 Q335 115 360 100 Q385 85 405 100 Q430 115 445 105 Q452 100 452 110" fill="none" stroke="#ff8f00" stroke-width="4" stroke-linecap="round"/>
<text x="345" y="78" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">Proximal Convoluted</text>
<text x="345" y="90" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">Tubule (PCT)</text>
<path d="M452 110 L452 245 Q452 285 438 310" fill="none" stroke="#7b1fa2" stroke-width="4" stroke-linecap="round"/>
<path d="M438 310 Q410 340 380 340 Q350 340 322 310" fill="none" stroke="#7b1fa2" stroke-width="4" stroke-linecap="round"/>
<path d="M322 310 Q308 285 308 245 L308 170" fill="none" stroke="#9c27b0" stroke-width="4" stroke-linecap="round"/>
<text x="510" y="265" font-size="10" fill="#6a1b9a" font-weight="bold">Loop of</text>
<text x="510" y="278" font-size="10" fill="#6a1b9a" font-weight="bold">Henle</text>
<text x="222" y="265" font-size="9" fill="#7b1fa2">Desc. limb</text>
<text x="448" y="265" font-size="9" fill="#7b1fa2">Asc. limb</text>
<path d="M308 170 Q288 155 268 160 Q248 165 228 150 Q208 135 208 150 Q208 165 228 155 Q248 145 268 155 Q288 165 308 175" fill="none" stroke="#0277bd" stroke-width="4" stroke-linecap="round"/>
<text x="258" y="135" text-anchor="middle" font-size="10" fill="#01579b" font-weight="bold">Distal Convoluted</text>
<text x="258" y="148" text-anchor="middle" font-size="10" fill="#01579b" font-weight="bold">Tubule (DCT)</text>
<path d="M210 153 L210 410" fill="none" stroke="#2e7d32" stroke-width="5" stroke-linecap="round"/>
<path d="M208 410 L208 420" fill="none" stroke="#2e7d32" stroke-width="5" stroke-linecap="round"/>
<text x="148" y="420" font-size="10" fill="#1b5e20" font-weight="bold">Collecting</text>
<text x="148" y="433" font-size="10" fill="#1b5e20" font-weight="bold">Duct</text>
<rect x="80" y="370" width="55" height="35" rx="6" fill="#fffde7" stroke="#f57f17" stroke-width="1.5"/>
<text x="107" y="385" text-anchor="middle" font-size="8" fill="#e65100" font-weight="bold">Filtration</text>
<text x="107" y="397" text-anchor="middle" font-size="8" fill="#e65100">glomerulus</text>
<rect x="340" y="80" width="60" height="35" rx="6" fill="#fff3e0" stroke="#ff8f00" stroke-width="1.5"/>
<text x="370" y="95" text-anchor="middle" font-size="8" fill="#e65100" font-weight="bold">Reabsorb.</text>
<text x="370" y="107" text-anchor="middle" font-size="8" fill="#e65100">65% here</text>
<rect x="130" y="132" width="55" height="35" rx="6" fill="#e8eaf6" stroke="#3949ab" stroke-width="1.5"/>
<text x="157" y="147" text-anchor="middle" font-size="8" fill="#283593" font-weight="bold">Secretion</text>
<text x="157" y="159" text-anchor="middle" font-size="8" fill="#283593">H⁺, K⁺, NH₃</text>
<rect x="20" y="458" width="640" height="58" rx="8" fill="#fffde7" stroke="#f9a825" stroke-width="1.5"/>
<text x="340" y="476" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Facts</text>
<text x="340" y="491" text-anchor="middle" font-size="9" fill="#bf360c">PCT: reabsorbs 65% glucose, Na⁺, water · Loop of Henle: concentrates urine · DCT: secretion of H⁺, K⁺</text>
<text x="340" y="506" text-anchor="middle" font-size="9" fill="#bf360c">GFR = 180L/day · Urine output = 1.5L/day · Juxtaglomerular apparatus controls GFR</text>
</svg>`,
},

"Breathing & Exchange of Gases": {
  title: "Human Respiratory System",
  neetFacts: [
    "Alveoli = site of gas exchange (O₂ in, CO₂ out) — surface area ~80m²",
    "Tidal volume = 500mL; Vital capacity = 4600mL",
    "Respiratory rate = 12-16 breaths/min at rest",
  ],
  svg: `<svg viewBox="0 0 680 530" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<text x="340" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">Human Respiratory System</text>
<rect x="285" y="35" width="70" height="40" rx="10" fill="#ffccbc" stroke="#bf360c" stroke-width="2"/>
<text x="320" y="60" text-anchor="middle" font-size="9" fill="#bf360c" font-weight="bold">Nasal Cavity</text>
<rect x="300" y="75" width="40" height="30" rx="6" fill="#ffccbc" stroke="#bf360c" stroke-width="1.5"/>
<text x="320" y="94" text-anchor="middle" font-size="8" fill="#bf360c">Pharynx</text>
<rect x="302" y="105" width="36" height="28" rx="5" fill="#ffab91" stroke="#bf360c" stroke-width="1.5"/>
<text x="320" y="123" text-anchor="middle" font-size="8" fill="#7f0000">Larynx</text>
<rect x="306" y="133" width="28" height="70" rx="6" fill="#b3e5fc" stroke="#0277bd" stroke-width="2.5"/>
<line x1="310" y1="140" x2="330" y2="140" stroke="#0277bd" stroke-width="1.5"/>
<line x1="310" y1="150" x2="330" y2="150" stroke="#0277bd" stroke-width="1.5"/>
<line x1="310" y1="160" x2="330" y2="160" stroke="#0277bd" stroke-width="1.5"/>
<line x1="310" y1="170" x2="330" y2="170" stroke="#0277bd" stroke-width="1.5"/>
<line x1="310" y1="180" x2="330" y2="180" stroke="#0277bd" stroke-width="1.5"/>
<line x1="310" y1="190" x2="330" y2="190" stroke="#0277bd" stroke-width="1.5"/>
<text x="320" y="215" text-anchor="middle" font-size="9" fill="#01579b" font-weight="bold">Trachea</text>
<path d="M306 203 Q260 210 220 230" fill="none" stroke="#4fc3f7" stroke-width="4" stroke-linecap="round"/>
<path d="M334 203 Q380 210 420 230" fill="none" stroke="#4fc3f7" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="190" cy="320" rx="105" ry="125" fill="#ffcdd2" stroke="#e53935" stroke-width="2" fill-opacity="0.7"/>
<ellipse cx="455" cy="320" rx="90" ry="125" fill="#ffcdd2" stroke="#e53935" stroke-width="2" fill-opacity="0.7"/>
<path d="M220 230 Q205 260 200 280" fill="none" stroke="#29b6f6" stroke-width="3" stroke-linecap="round"/>
<path d="M200 280 Q190 300 185 320" fill="none" stroke="#81d4fa" stroke-width="2" stroke-linecap="round"/>
<path d="M185 320 Q175 335 172 350 Q165 360 160 360 Q175 360 175 375 Q175 360 190 360 Q205 360 200 375" fill="none" stroke="#b3e5fc" stroke-width="1.5" stroke-linecap="round"/>
<path d="M420 230 Q435 260 440 280" fill="none" stroke="#29b6f6" stroke-width="3" stroke-linecap="round"/>
<path d="M440 280 Q450 300 455 320" fill="none" stroke="#81d4fa" stroke-width="2" stroke-linecap="round"/>
<path d="M455 320 Q465 335 468 350 Q475 360 480 360 Q465 360 465 375 Q465 360 450 360 Q435 360 440 375" fill="none" stroke="#b3e5fc" stroke-width="1.5" stroke-linecap="round"/>
<text x="190" y="325" text-anchor="middle" font-size="10" fill="#b71c1c" font-weight="bold">Left Lung</text>
<text x="455" y="320" text-anchor="middle" font-size="10" fill="#b71c1c" font-weight="bold">Right Lung</text>
<text x="455" y="335" text-anchor="middle" font-size="9" fill="#b71c1c">(3 lobes)</text>
<text x="190" y="340" text-anchor="middle" font-size="9" fill="#b71c1c">(2 lobes)</text>
<ellipse cx="130" cy="365" rx="18" ry="14" fill="#fff9c4" stroke="#f9a825" stroke-width="1.5"/>
<ellipse cx="115" cy="375" rx="14" ry="11" fill="#fff9c4" stroke="#f9a825" stroke-width="1.5"/>
<ellipse cx="148" cy="378" rx="14" ry="11" fill="#fff9c4" stroke="#f9a825" stroke-width="1.5"/>
<text x="75" y="400" font-size="9" fill="#e65100" font-weight="bold">Alveoli</text>
<text x="75" y="412" font-size="8" fill="#e65100">(gas exchange)</text>
<line x1="108" y1="375" x2="88" y2="395" stroke="#e65100" stroke-width="1.2"/>
<rect x="230" y="440" width="220" height="22" rx="5" fill="#b0bec5" stroke="#546e7a" stroke-width="1.5"/>
<text x="340" y="456" text-anchor="middle" font-size="10" fill="#263238" font-weight="bold">Diaphragm</text>
<line x1="86" y1="53" x2="116" y2="55" stroke="#bf360c" stroke-width="1.2"/>
<text x="20" y="56" font-size="9" fill="#bf360c" font-weight="bold">Nasal</text>
<text x="20" y="68" font-size="9" fill="#bf360c" font-weight="bold">Cavity</text>
<line x1="302" y1="115" x2="268" y2="115" stroke="#7f0000" stroke-width="1.2"/>
<text x="195" y="118" font-size="9" fill="#7f0000" font-weight="bold">Larynx</text>
<text x="195" y="130" font-size="8" fill="#7f0000">(vocal cords)</text>
<line x1="306" y1="165" x2="272" y2="165" stroke="#0277bd" stroke-width="1.2"/>
<text x="195" y="168" font-size="9" fill="#0277bd" font-weight="bold">Trachea</text>
<text x="195" y="180" font-size="8" fill="#0277bd">(C-rings)</text>
<line x1="420" y1="235" x2="460" y2="218" stroke="#0288d1" stroke-width="1.2"/>
<text x="462" y="220" font-size="9" fill="#0288d1" font-weight="bold">Bronchus</text>
<rect x="20" y="464" width="640" height="52" rx="8" fill="#fffde7" stroke="#f9a825" stroke-width="1.5"/>
<text x="340" y="480" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Facts</text>
<text x="340" y="496" text-anchor="middle" font-size="9" fill="#bf360c">Alveolar surface area ≈ 80m² · Right lung: 3 lobes; Left lung: 2 lobes (cardiac notch)</text>
<text x="340" y="509" text-anchor="middle" font-size="9" fill="#bf360c">Tidal volume = 500mL · Vital capacity = 4600mL · Residual volume = 1200mL (always remains)</text>
</svg>`,
},

"Neural Control & Coordination": {
  title: "Human Eye — Cross Section",
  neetFacts: [
    "Yellow spot (Fovea centralis) = point of sharpest vision (only cones)",
    "Blind spot (Optic disc) = no photoreceptors, where optic nerve exits",
    "Rods: dim light vision (rhodopsin) · Cones: colour vision (iodopsin)",
  ],
  svg: `<svg viewBox="0 0 680 530" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<text x="340" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">Human Eye — Cross Section</text>
<ellipse cx="300" cy="255" rx="185" ry="170" fill="#e3f2fd" stroke="#1565c0" stroke-width="2.5"/>
<ellipse cx="300" cy="255" rx="178" ry="163" fill="none" stroke="#0d47a1" stroke-width="1" opacity="0.5"/>
<ellipse cx="300" cy="255" rx="162" ry="148" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
<ellipse cx="300" cy="255" rx="148" ry="135" fill="#1a237e" stroke="#283593" stroke-width="1.5"/>
<path d="M140 215 Q115 255 140 295 Q162 255 140 215Z" fill="#b3e5fc" stroke="#0277bd" stroke-width="2"/>
<ellipse cx="240" cy="255" rx="52" ry="62" fill="#e8eaf6" stroke="#3949ab" stroke-width="2"/>
<ellipse cx="242" cy="255" rx="32" ry="38" fill="#263238" stroke="#455a64" stroke-width="1"/>
<ellipse cx="248" cy="249" rx="10" ry="8" fill="white" opacity="0.3"/>
<rect x="460" y="180" width="18" height="150" rx="5" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
<circle cx="469" cy="245" r="8" fill="#ef6c00"/>
<text x="469" y="249" text-anchor="middle" font-size="6" fill="white" font-weight="bold">Y</text>
<circle cx="469" cy="275" r="6" fill="#bdbdbd"/>
<text x="469" y="279" text-anchor="middle" font-size="6" fill="white">B</text>
<path d="M478 255 Q510 255 530 255" fill="none" stroke="#455a64" stroke-width="5" stroke-linecap="round"/>
<path d="M530 255 Q545 255 555 265 Q565 275 575 270" fill="none" stroke="#455a64" stroke-width="4" stroke-linecap="round"/>
<line x1="120" y1="255" x2="80" y2="255" stroke="#546e7a" stroke-width="1.2"/>
<text x="10" y="252" font-size="9" fill="#37474f" font-weight="bold">Cornea</text>
<line x1="135" y1="230" x2="90" y2="210" stroke="#0277bd" stroke-width="1.2"/>
<text x="10" y="208" font-size="9" fill="#0277bd" font-weight="bold">Aqueous</text>
<text x="10" y="220" font-size="9" fill="#0277bd" font-weight="bold">Humour</text>
<line x1="240" y1="200" x2="215" y2="165" stroke="#3949ab" stroke-width="1.2"/>
<text x="155" y="163" font-size="9" fill="#3949ab" font-weight="bold">Lens</text>
<line x1="220" y1="255" x2="185" y2="255" stroke="#263238" stroke-width="1.2"/>
<text x="100" y="258" font-size="9" fill="#263238" font-weight="bold">Pupil / Iris</text>
<line x1="142" y1="295" x2="108" y2="315" stroke="#37474f" stroke-width="1.2"/>
<text x="10" y="318" font-size="9" fill="#37474f" font-weight="bold">Ciliary</text>
<text x="10" y="330" font-size="9" fill="#37474f" font-weight="bold">Body</text>
<line x1="300" y1="110" x2="300" y2="75" stroke="#2e7d32" stroke-width="1.2"/>
<text x="255" y="70" font-size="9" fill="#2e7d32" font-weight="bold">Choroid</text>
<line x1="138" y1="255" x2="108" y2="255" stroke="#1565c0" stroke-width="1.2"/>
<text x="10" y="272" font-size="9" fill="#1565c0" font-weight="bold">Sclera</text>
<line x1="460" y1="180" x2="498" y2="145" stroke="#f57f17" stroke-width="1.2"/>
<text x="500" y="143" font-size="9" fill="#e65100" font-weight="bold">Yellow Spot</text>
<text x="500" y="155" font-size="8" fill="#e65100">(Fovea — cones only)</text>
<line x1="469" y1="275" x2="505" y2="305" stroke="#757575" stroke-width="1.2"/>
<text x="507" y="305" font-size="9" fill="#424242" font-weight="bold">Blind Spot</text>
<text x="507" y="318" font-size="8" fill="#424242">(no receptors)</text>
<line x1="550" y1="258" x2="590" y2="240" stroke="#455a64" stroke-width="1.2"/>
<text x="592" y="240" font-size="9" fill="#37474f" font-weight="bold">Optic Nerve</text>
<line x1="300" y1="390" x2="300" y2="420" stroke="#1a237e" stroke-width="1.2"/>
<text x="230" y="438" font-size="9" fill="#1a237e" font-weight="bold">Vitreous Humour</text>
<line x1="460" y1="328" x2="498" y2="358" stroke="#0d47a1" stroke-width="1.2"/>
<text x="500" y="358" font-size="9" fill="#0d47a1" font-weight="bold">Retina</text>
<text x="500" y="370" font-size="8" fill="#0d47a1">(rods + cones)</text>
<rect x="20" y="464" width="640" height="52" rx="8" fill="#fffde7" stroke="#f9a825" stroke-width="1.5"/>
<text x="340" y="480" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Facts</text>
<text x="340" y="496" text-anchor="middle" font-size="9" fill="#bf360c">Rods: scotopic (dim light) vision, rhodopsin pigment · Cones: photopic (colour) vision, iodopsin pigment</text>
<text x="340" y="509" text-anchor="middle" font-size="9" fill="#bf360c">Fovea centralis = sharpest vision (only cones) · Optic disc = blind spot (no photoreceptors)</text>
</svg>`,
},

"Molecular Basis of Inheritance": {
  title: "DNA Double Helix & Replication",
  neetFacts: [
    "A-T: 2 hydrogen bonds; G-C: 3 hydrogen bonds (Chargaff's rule: A=T, G=C)",
    "DNA replication is semi-conservative (proven by Meselson & Stahl, 1958)",
    "Template strand (3'→5') read by polymerase; new strand grows 5'→3'",
  ],
  svg: `<svg viewBox="0 0 680 530" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<text x="340" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">DNA Structure — Double Helix</text>
<path d="M180 50 C160 80 200 110 180 140 C160 170 200 200 180 230 C160 260 200 290 180 320 C160 350 200 380 180 410" fill="none" stroke="#1565c0" stroke-width="6" stroke-linecap="round"/>
<path d="M260 50 C280 80 240 110 260 140 C280 170 240 200 260 230 C280 260 240 290 260 320 C280 350 240 380 260 410" fill="none" stroke="#c62828" stroke-width="6" stroke-linecap="round"/>
<line x1="190" y1="80" x2="250" y2="80" stroke="#2e7d32" stroke-width="3"/>
<text x="220" y="75" text-anchor="middle" font-size="8" fill="#1b5e20">A — T</text>
<text x="220" y="87" text-anchor="middle" font-size="7" fill="#388e3c">2 H-bonds</text>
<line x1="185" y1="120" x2="255" y2="120" stroke="#7b1fa2" stroke-width="3"/>
<text x="220" y="115" text-anchor="middle" font-size="8" fill="#4a148c">G ≡ C</text>
<text x="220" y="127" text-anchor="middle" font-size="7" fill="#6a1b9a">3 H-bonds</text>
<line x1="190" y1="160" x2="250" y2="160" stroke="#2e7d32" stroke-width="3"/>
<text x="220" y="155" text-anchor="middle" font-size="8" fill="#1b5e20">T — A</text>
<line x1="185" y1="200" x2="255" y2="200" stroke="#7b1fa2" stroke-width="3"/>
<text x="220" y="195" text-anchor="middle" font-size="8" fill="#4a148c">C ≡ G</text>
<line x1="190" y1="240" x2="250" y2="240" stroke="#2e7d32" stroke-width="3"/>
<text x="220" y="235" text-anchor="middle" font-size="8" fill="#1b5e20">A — T</text>
<line x1="185" y1="280" x2="255" y2="280" stroke="#7b1fa2" stroke-width="3"/>
<text x="220" y="275" text-anchor="middle" font-size="8" fill="#4a148c">G ≡ C</text>
<line x1="190" y1="320" x2="250" y2="320" stroke="#2e7d32" stroke-width="3"/>
<text x="220" y="315" text-anchor="middle" font-size="8" fill="#1b5e20">T — A</text>
<line x1="185" y1="360" x2="255" y2="360" stroke="#7b1fa2" stroke-width="3"/>
<text x="220" y="355" text-anchor="middle" font-size="8" fill="#4a148c">C ≡ G</text>
<line x1="190" y1="400" x2="250" y2="400" stroke="#2e7d32" stroke-width="3"/>
<text x="220" y="395" text-anchor="middle" font-size="8" fill="#1b5e20">A — T</text>
<text x="100" y="45" text-anchor="middle" font-size="9" fill="#1565c0" font-weight="bold">5' end</text>
<text x="100" y="420" text-anchor="middle" font-size="9" fill="#1565c0" font-weight="bold">3' end</text>
<text x="340" y="45" text-anchor="middle" font-size="9" fill="#c62828" font-weight="bold">3' end</text>
<text x="340" y="420" text-anchor="middle" font-size="9" fill="#c62828" font-weight="bold">5' end</text>
<text x="100" y="230" font-size="9" fill="#1565c0" font-weight="bold">Sugar-</text>
<text x="100" y="243" font-size="9" fill="#1565c0" font-weight="bold">Phosphate</text>
<text x="100" y="256" font-size="9" fill="#1565c0" font-weight="bold">Backbone</text>
<line x1="140" y1="248" x2="168" y2="230" stroke="#1565c0" stroke-width="1.2"/>
<text x="345" y="230" font-size="9" fill="#c62828" font-weight="bold">Sugar-</text>
<text x="345" y="243" font-size="9" fill="#c62828" font-weight="bold">Phosphate</text>
<text x="345" y="256" font-size="9" fill="#c62828" font-weight="bold">Backbone</text>
<line x1="344" y1="248" x2="268" y2="230" stroke="#c62828" stroke-width="1.2"/>
<rect x="410" y="50" width="250" height="370" rx="10" fill="#f5f5f5" stroke="#90a4ae" stroke-width="1.5"/>
<text x="535" y="72" text-anchor="middle" font-size="11" fill="#37474f" font-weight="bold">Nucleotide Structure</text>
<rect x="480" y="85" width="60" height="22" rx="5" fill="#ffcc80" stroke="#e65100" stroke-width="1.5"/>
<text x="510" y="100" text-anchor="middle" font-size="9" fill="#bf360c" font-weight="bold">Phosphate</text>
<rect x="480" y="115" width="60" height="22" rx="5" fill="#b3e5fc" stroke="#0277bd" stroke-width="1.5"/>
<text x="510" y="130" text-anchor="middle" font-size="9" fill="#01579b" font-weight="bold">Deoxyribose</text>
<rect x="480" y="145" width="60" height="22" rx="5" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
<text x="510" y="160" text-anchor="middle" font-size="9" fill="#1b5e20" font-weight="bold">Nitrogenous</text>
<text x="510" y="172" text-anchor="middle" font-size="8" fill="#1b5e20">Base (A/T/G/C)</text>
<text x="535" y="205" text-anchor="middle" font-size="10" fill="#37474f" font-weight="bold">Purines (double ring)</text>
<text x="535" y="220" text-anchor="middle" font-size="9" fill="#6a1b9a">Adenine (A), Guanine (G)</text>
<text x="535" y="242" text-anchor="middle" font-size="10" fill="#37474f" font-weight="bold">Pyrimidines (single ring)</text>
<text x="535" y="257" text-anchor="middle" font-size="9" fill="#1b5e20">Thymine (T), Cytosine (C)</text>
<text x="535" y="280" text-anchor="middle" font-size="10" fill="#37474f" font-weight="bold">Base Pairing</text>
<text x="535" y="296" text-anchor="middle" font-size="9" fill="#37474f">A = T (2 hydrogen bonds)</text>
<text x="535" y="310" text-anchor="middle" font-size="9" fill="#37474f">G ≡ C (3 hydrogen bonds)</text>
<text x="535" y="332" text-anchor="middle" font-size="10" fill="#37474f" font-weight="bold">Chargaff's Rule</text>
<text x="535" y="348" text-anchor="middle" font-size="9" fill="#37474f">% A = % T</text>
<text x="535" y="362" text-anchor="middle" font-size="9" fill="#37474f">% G = % C</text>
<text x="535" y="378" text-anchor="middle" font-size="9" fill="#37474f">A+G = T+C (purines=pyrimidines)</text>
<text x="535" y="398" text-anchor="middle" font-size="9" fill="#546e7a">Helix diameter: 2nm</text>
<text x="535" y="412" text-anchor="middle" font-size="9" fill="#546e7a">Pitch: 3.4nm (10 bp/turn)</text>
<rect x="20" y="464" width="640" height="52" rx="8" fill="#fffde7" stroke="#f9a825" stroke-width="1.5"/>
<text x="340" y="480" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Facts</text>
<text x="340" y="496" text-anchor="middle" font-size="9" fill="#bf360c">Semi-conservative replication (Meselson &amp; Stahl, 1958) · DNA Pol III adds nucleotides 5'→3'</text>
<text x="340" y="509" text-anchor="middle" font-size="9" fill="#bf360c">Helicase unwinds · Primase adds RNA primer · Leading strand continuous, lagging strand discontinuous (Okazaki fragments)</text>
</svg>`,
},

"Photosynthesis": {
  title: "Chloroplast Structure",
  neetFacts: [
    "Light reactions: thylakoid membrane (PS I & PS II, ATP synthesis)",
    "Dark reactions (Calvin cycle): stroma (CO₂ fixation, RUBISCO enzyme)",
    "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
  ],
  svg: `<svg viewBox="0 0 680 530" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<text x="340" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">Chloroplast — Internal Structure</text>
<ellipse cx="310" cy="250" rx="248" ry="155" fill="#e8f5e9" stroke="#2e7d32" stroke-width="3"/>
<ellipse cx="310" cy="250" rx="235" ry="143" fill="none" stroke="#388e3c" stroke-width="1.5" stroke-dasharray="6 3"/>
<text x="90" y="135" font-size="9" fill="#1b5e20" font-weight="bold">Outer Membrane</text>
<line x1="148" y1="132" x2="162" y2="130" stroke="#1b5e20" stroke-width="1.2"/>
<text x="90" y="152" font-size="9" fill="#388e3c" font-weight="bold">Inner Membrane</text>
<line x1="148" y1="149" x2="162" y2="148" stroke="#388e3c" stroke-width="1.2"/>
<text x="310" y="268" text-anchor="middle" font-size="10" fill="#1b5e20" font-style="italic" font-weight="bold">Stroma</text>
<text x="310" y="283" text-anchor="middle" font-size="9" fill="#2e7d32">(Calvin cycle / Dark reactions)</text>
<rect x="162" y="168" width="60" height="88" rx="5" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1.5"/>
<line x1="162" y1="184" x2="222" y2="184" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="162" y1="200" x2="222" y2="200" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="162" y1="216" x2="222" y2="216" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="162" y1="232" x2="222" y2="232" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="162" y1="248" x2="222" y2="248" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<text x="192" y="268" text-anchor="middle" font-size="8" fill="#1b5e20" font-weight="bold">Granum 1</text>
<rect x="262" y="155" width="60" height="112" rx="5" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1.5"/>
<line x1="262" y1="173" x2="322" y2="173" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="262" y1="191" x2="322" y2="191" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="262" y1="209" x2="322" y2="209" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="262" y1="227" x2="322" y2="227" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="262" y1="245" x2="322" y2="245" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="262" y1="263" x2="322" y2="263" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<text x="292" y="278" text-anchor="middle" font-size="8" fill="#1b5e20" font-weight="bold">Granum 2</text>
<rect x="365" y="172" width="60" height="96" rx="5" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1.5"/>
<line x1="365" y1="188" x2="425" y2="188" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="365" y1="206" x2="425" y2="206" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="365" y1="224" x2="425" y2="224" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="365" y1="242" x2="425" y2="242" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<line x1="365" y1="260" x2="425" y2="260" stroke="#4caf50" stroke-width="8" stroke-opacity="0.6"/>
<text x="395" y="278" text-anchor="middle" font-size="8" fill="#1b5e20" font-weight="bold">Granum 3</text>
<path d="M222 220 Q242 220 262 209" fill="none" stroke="#2e7d32" stroke-width="1.8" stroke-dasharray="3 2"/>
<path d="M322 220 Q342 220 365 224" fill="none" stroke="#2e7d32" stroke-width="1.8" stroke-dasharray="3 2"/>
<text x="242" y="215" font-size="8" fill="#388e3c">Stroma</text>
<text x="242" y="226" font-size="8" fill="#388e3c">Lamella</text>
<ellipse cx="460" cy="220" rx="25" ry="18" fill="#fff9c4" stroke="#f9a825" stroke-width="1.5"/>
<text x="460" y="224" text-anchor="middle" font-size="7" fill="#e65100" font-weight="bold">Starch</text>
<line x1="485" y1="215" x2="510" y2="200" stroke="#f9a825" stroke-width="1.2"/>
<text x="512" y="198" font-size="9" fill="#e65100" font-weight="bold">Starch Grain</text>
<rect x="20" y="365" width="310" height="72" rx="8" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
<text x="175" y="382" text-anchor="middle" font-size="10" fill="#0d47a1" font-weight="bold">Light Reactions (Thylakoid)</text>
<text x="175" y="397" text-anchor="middle" font-size="9" fill="#1565c0">H₂O → O₂ + [H] (photolysis)</text>
<text x="175" y="411" text-anchor="middle" font-size="9" fill="#1565c0">ADP+Pi → ATP (photophosphorylation)</text>
<text x="175" y="425" text-anchor="middle" font-size="9" fill="#1565c0">NADP⁺ → NADPH (PS I)</text>
<rect x="350" y="365" width="310" height="72" rx="8" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
<text x="505" y="382" text-anchor="middle" font-size="10" fill="#1b5e20" font-weight="bold">Dark Reactions / Calvin Cycle (Stroma)</text>
<text x="505" y="397" text-anchor="middle" font-size="9" fill="#2e7d32">CO₂ + RuBP → 2 × 3-PGA (RUBISCO)</text>
<text x="505" y="411" text-anchor="middle" font-size="9" fill="#2e7d32">3-PGA → G3P (uses ATP + NADPH)</text>
<text x="505" y="425" text-anchor="middle" font-size="9" fill="#2e7d32">G3P → Glucose (C₆H₁₂O₆)</text>
<rect x="20" y="452" width="640" height="52" rx="8" fill="#fffde7" stroke="#f9a825" stroke-width="1.5"/>
<text x="340" y="468" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Facts</text>
<text x="340" y="484" text-anchor="middle" font-size="9" fill="#bf360c">PS II: water photolysis, O₂ release · PS I: NADPH production · Both in thylakoid membrane</text>
<text x="340" y="497" text-anchor="middle" font-size="9" fill="#bf360c">RUBISCO: most abundant enzyme on earth · C3 plants: Calvin cycle only · C4: Hatch-Slack pathway</text>
</svg>`,
},

"Structural Organisation in Animals": {
  title: "Neuron — Structure",
  neetFacts: [
    "Unipolar: 1 process (sensory neurons in embryo) · Bipolar: 2 processes · Multipolar: many dendrites",
    "Myelin sheath (Schwann cells) speeds up nerve impulse conduction",
    "Nodes of Ranvier = gaps in myelin sheath — site of saltatory conduction",
  ],
  svg: `<svg viewBox="0 0 680 530" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<text x="340" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">Multipolar Neuron — Structure</text>
<path d="M90 180 Q110 150 130 165 Q115 185 90 180Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
<path d="M85 215 Q95 188 118 198 Q110 220 85 215Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
<path d="M95 250 Q112 228 130 240 Q120 262 95 250Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
<path d="M105 280 Q125 265 138 278 Q128 295 105 280Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
<path d="M100 160 Q128 148 140 162 Q132 178 100 160Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
<ellipse cx="185" cy="220" rx="58" ry="55" fill="#bbdefb" stroke="#1565c0" stroke-width="2.5"/>
<ellipse cx="182" cy="218" rx="22" ry="20" fill="#1565c0" stroke="#0d47a1" stroke-width="1.5"/>
<text x="182" y="222" text-anchor="middle" font-size="8" fill="white" font-weight="bold">Nucleus</text>
<text x="185" y="285" text-anchor="middle" font-size="9" fill="#0d47a1" font-weight="bold">Cell Body (Soma)</text>
<path d="M240 215 Q265 212 280 215" fill="none" stroke="#7b1fa2" stroke-width="4" stroke-linecap="round"/>
<rect x="280" y="208" width="52" height="14" rx="6" fill="#e1bee7" stroke="#6a1b9a" stroke-width="1.5"/>
<text x="306" y="219" text-anchor="middle" font-size="8" fill="#4a148c" font-weight="bold">Axon Hillock</text>
<line x1="332" y1="215" x2="560" y2="215" stroke="#7b1fa2" stroke-width="5" stroke-linecap="round"/>
<rect x="340" y="197" width="38" height="36" rx="12" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.5" opacity="0.85"/>
<rect x="388" y="197" width="38" height="36" rx="12" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.5" opacity="0.85"/>
<rect x="436" y="197" width="38" height="36" rx="12" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.5" opacity="0.85"/>
<rect x="484" y="197" width="38" height="36" rx="12" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.5" opacity="0.85"/>
<text x="359" y="218" text-anchor="middle" font-size="7" fill="#4a148c">Schwann</text>
<text x="359" y="228" text-anchor="middle" font-size="7" fill="#4a148c">Cell</text>
<line x1="378" y1="215" x2="388" y2="215" stroke="#555" stroke-width="2.5"/>
<line x1="426" y1="215" x2="436" y2="215" stroke="#555" stroke-width="2.5"/>
<line x1="474" y1="215" x2="484" y2="215" stroke="#555" stroke-width="2.5"/>
<text x="383" y="195" text-anchor="middle" font-size="8" fill="#333">Node of</text>
<text x="383" y="205" text-anchor="middle" font-size="8" fill="#333">Ranvier</text>
<line x1="383" y1="208" x2="383" y2="214" stroke="#333" stroke-width="1"/>
<path d="M560 215 Q575 215 580 210 L610 190 Q620 185 618 200 Q605 205 595 215" fill="none" stroke="#7b1fa2" stroke-width="3" stroke-linecap="round"/>
<path d="M560 215 Q575 215 580 220 L610 240 Q620 245 618 230 Q605 225 595 215" fill="none" stroke="#7b1fa2" stroke-width="3" stroke-linecap="round"/>
<circle cx="620" cy="192" r="10" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.5"/>
<circle cx="620" cy="238" r="10" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1.5"/>
<text x="645" y="196" font-size="8" fill="#6a1b9a" font-weight="bold">Synaptic</text>
<text x="645" y="208" font-size="8" fill="#6a1b9a" font-weight="bold">Knobs</text>
<line x1="130" y1="170" x2="95" y2="148" stroke="#2e7d32" stroke-width="1.2"/>
<text x="10" y="148" font-size="9" fill="#2e7d32" font-weight="bold">Dendrites</text>
<text x="10" y="160" font-size="8" fill="#2e7d32">(receive impulse)</text>
<line x1="182" y1="164" x2="182" y2="128" stroke="#1565c0" stroke-width="1.2"/>
<text x="140" y="124" font-size="9" fill="#1565c0" font-weight="bold">Nissl Bodies</text>
<text x="140" y="136" font-size="8" fill="#1565c0">(rough ER — protein synthesis)</text>
<line x1="306" y1="208" x2="306" y2="172" stroke="#4a148c" stroke-width="1.2"/>
<text x="265" y="168" font-size="9" fill="#4a148c" font-weight="bold">Axon Hillock</text>
<line x1="430" y1="233" x2="430" y2="268" stroke="#6a1b9a" stroke-width="1.2"/>
<text x="360" y="280" font-size="9" fill="#6a1b9a" font-weight="bold">Myelin Sheath</text>
<text x="360" y="292" font-size="8" fill="#6a1b9a">(Schwann cells — insulation)</text>
<line x1="440" y1="258" x2="440" y2="278" stroke="#1b5e20" stroke-width="1.2"/>
<rect x="20" y="318" width="640" height="75" rx="8" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="1.5"/>
<text x="340" y="337" text-anchor="middle" font-size="10" fill="#4a148c" font-weight="bold">Synapse — Impulse Transmission</text>
<circle cx="100" cy="372" r="12" fill="#e1bee7" stroke="#6a1b9a" stroke-width="1.5"/>
<circle cx="100" cy="372" r="5" fill="#ce93d8"/>
<text x="100" y="376" text-anchor="middle" font-size="6" fill="white">NT</text>
<text x="100" y="392" text-anchor="middle" font-size="8" fill="#4a148c">Vesicle</text>
<rect x="150" y="355" width="100" height="8" rx="3" fill="#ce93d8" stroke="#6a1b9a" stroke-width="1"/>
<text x="200" y="375" text-anchor="middle" font-size="8" fill="#4a148c">Pre-synaptic</text>
<text x="200" y="386" text-anchor="middle" font-size="8" fill="#4a148c">membrane</text>
<rect x="150" y="375" width="100" height="5" rx="2" fill="#b0bec5" stroke="#546e7a" stroke-width="1"/>
<text x="200" y="353" text-anchor="middle" font-size="8" fill="#37474f">Synaptic cleft (20nm)</text>
<rect x="150" y="382" width="100" height="8" rx="3" fill="#b3e5fc" stroke="#0277bd" stroke-width="1"/>
<text x="200" y="397" text-anchor="middle" font-size="8" fill="#01579b">Post-synaptic membrane</text>
<text x="400" y="365" text-anchor="middle" font-size="9" fill="#4a148c">Neurotransmitters (NT): Acetylcholine,</text>
<text x="400" y="378" text-anchor="middle" font-size="9" fill="#4a148c">Dopamine, Serotonin, GABA</text>
<text x="400" y="391" text-anchor="middle" font-size="9" fill="#4a148c">NT binds receptor → Na⁺ influx → depolarization</text>
<rect x="20" y="452" width="640" height="52" rx="8" fill="#fffde7" stroke="#f9a825" stroke-width="1.5"/>
<text x="340" y="468" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Facts</text>
<text x="340" y="484" text-anchor="middle" font-size="9" fill="#bf360c">Resting potential: -70mV (K⁺ out, Na⁺ in) · Action potential: depolarization (+40mV) then repolarization</text>
<text x="340" y="497" text-anchor="middle" font-size="9" fill="#bf360c">Saltatory conduction (jumping across nodes) is faster · Myelinated neurons conduct faster than unmyelinated</text>
</svg>`,
},

};

export function getDiagram(chapter: string): SVGDiagram | null {
  if (DIAGRAMS[chapter]) return DIAGRAMS[chapter];
  const ch = chapter.toLowerCase();
  if (ch.includes("cell") && !ch.includes("cycle")) return DIAGRAMS["Cell — The Unit of Life"];
  if (ch.includes("heart") || ch.includes("circulation") || ch.includes("body fluid")) return DIAGRAMS["Body Fluids & Circulation"];
  if (ch.includes("kidney") || ch.includes("nephron") || ch.includes("excret")) return DIAGRAMS["Excretory Products & Elimination"];
  if (ch.includes("lung") || ch.includes("breath") || ch.includes("respirat")) return DIAGRAMS["Breathing & Exchange of Gases"];
  if (ch.includes("eye") || ch.includes("neural") || ch.includes("neuron") && ch.includes("coord")) return DIAGRAMS["Neural Control & Coordination"];
  if (ch.includes("dna") || ch.includes("molecular") || ch.includes("inherit")) return DIAGRAMS["Molecular Basis of Inheritance"];
  if (ch.includes("photosynthesis") || ch.includes("chloroplast")) return DIAGRAMS["Photosynthesis"];
  if (ch.includes("neuron") || ch.includes("structural organ")) return DIAGRAMS["Structural Organisation in Animals"];
  return null;
}

export default DIAGRAMS;
