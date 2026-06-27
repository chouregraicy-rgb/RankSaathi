// src/app/api/diagram/route.ts
import { NextRequest, NextResponse } from "next/server";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

async function callGroq(model: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 6000,
      temperature: 0.1,
    }),
  });
  if (!res.ok) throw new Error(`Groq ${model} error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// Chapter-specific diagram instructions for NEET accuracy
const CHAPTER_HINTS: Record<string, string> = {
  "Cell — The Unit of Life": "Draw a large animal cell cross-section showing: cell membrane (double layer), cytoplasm, large oval nucleus with nuclear membrane and nucleolus inside, mitochondria (bean-shaped with cristae inside), endoplasmic reticulum (rough with ribosomes, smooth without), golgi apparatus (stack of flattened sacs), lysosomes (small circles), ribosomes (tiny dots on RER and free), centrioles (2 perpendicular cylinders), vacuole. Use light green for cytoplasm, blue for nucleus, orange for mitochondria, purple for golgi.",
  "Photosynthesis": "Draw a chloroplast cross-section showing: outer membrane, inner membrane, intermembrane space, stroma (light green matrix), grana (stacks of thylakoids), thylakoid membrane, thylakoid lumen, stroma lamellae connecting grana, starch grains in stroma. Label: Light reactions in thylakoid, Dark reactions (Calvin cycle) in stroma. Add arrow showing CO2 entering and O2/Glucose leaving.",
  "Digestion & Absorption": "Draw the complete human alimentary canal as a vertical diagram showing: mouth/buccal cavity, salivary glands (parotid, submandibular, sublingual), pharynx, oesophagus, cardiac sphincter, stomach (J-shaped with gastric glands), pyloric sphincter, duodenum, jejunum, ileum, ileocaecal valve, caecum, appendix, ascending/transverse/descending colon, rectum, anal canal. Show liver and pancreas connected to duodenum by bile duct and pancreatic duct.",
  "Breathing & Exchange of Gases": "Draw the human respiratory system showing: nasal cavity, pharynx, larynx with vocal cords, trachea with C-shaped cartilage rings, bronchi branching into left and right lungs, bronchioles, alveolar ducts, alveoli (clusters of balloon-like sacs). Show diaphragm at bottom. Add inset showing alveolus with capillary network and gas exchange arrows (O2 in, CO2 out).",
  "Body Fluids & Circulation": "Draw a detailed human heart cross-section showing: right atrium, left atrium, right ventricle (thin wall), left ventricle (thick wall), interventricular septum, tricuspid valve (3 cusps between RA and RV), bicuspid/mitral valve (2 cusps between LA and LV), semilunar valves at aorta and pulmonary artery, superior vena cava, inferior vena cava, pulmonary veins (4), pulmonary artery, aorta, coronary arteries. Use blue for deoxygenated blood, red for oxygenated blood.",
  "Excretory Products & Elimination": "Draw a nephron (functional unit of kidney) showing: Bowman's capsule surrounding glomerulus, proximal convoluted tubule, descending limb of loop of Henle, ascending limb of loop of Henle, distal convoluted tubule, collecting duct. Show afferent arteriole entering and efferent arteriole leaving glomerulus. Label: filtration at glomerulus, reabsorption in PCT, secretion in DCT. Add small kidney outline showing cortex and medulla with nephron position.",
  "Neural Control & Coordination": "Draw a detailed human eye cross-section showing: sclera (white outer layer), choroid (dark middle layer), retina (inner layer with rods and cones), cornea (transparent front), iris (colored part with pupil hole), lens (biconvex), aqueous humor (front chamber), vitreous humor (back chamber), ciliary body and suspensory ligaments holding lens, optic nerve at back, blind spot (optic disc), yellow spot/fovea. Also draw ear structure: pinna, ear canal, tympanum, malleus/incus/stapes, cochlea, semicircular canals, Eustachian tube.",
  "Structural Organisation in Animals": "Draw a detailed multipolar neuron showing: dendrites (multiple branching at top), cell body/soma (large with nucleus inside), axon hillock (where axon begins), axon (long, covered by myelin sheath with gaps called Nodes of Ranvier), Schwann cells forming myelin, axon terminals/synaptic knobs at end. Add synapse diagram showing: pre-synaptic terminal, synaptic cleft, post-synaptic membrane, neurotransmitter vesicles, receptors.",
  "Molecular Basis of Inheritance": "Draw DNA double helix structure showing: two antiparallel sugar-phosphate backbone strands (3' to 5' and 5' to 3'), base pairs in middle (A-T connected by 2 hydrogen bonds, G-C by 3 hydrogen bonds), major groove and minor groove, nucleotide structure (phosphate + deoxyribose + base). Add replication fork showing: helicase unwinding, leading strand (continuous), lagging strand (Okazaki fragments), DNA polymerase, primase adding RNA primer.",
  "Animal Kingdom": "Draw a phylogenetic classification chart showing all major phyla with example organisms: Porifera (Sycon), Cnidaria (Hydra), Platyhelminthes (Tapeworm), Nematoda (Ascaris), Annelida (Earthworm with segmented body), Arthropoda (Cockroach with jointed legs), Mollusca (Snail with shell), Echinodermata (Starfish with spiny skin), Chordata (Fish, Frog, Lizard, Bird, Rabbit). Show evolutionary complexity increasing. Label key features of each phylum.",
  "Plant Kingdom": "Draw evolutionary progression of plant groups left to right: Algae (Spirogyra - spiral chloroplast), Bryophyta (Funaria - leafy gametophyte, capsule sporophyte), Pteridophyta (Fern - frond with sori), Gymnosperms (Pine - with male/female cones), Angiosperms (Flower with petals, sepals, stamens, pistil). Below each group show: vascular tissue present/absent, seeds present/absent, fruits present/absent, dominant generation.",
  "Biological Classification": "Draw Whittaker's 5 Kingdom classification as a branching tree: Monera (Bacteria - no nucleus), Protista (Amoeba - single cell eukaryote), Fungi (Mushroom - heterotroph, chitin wall), Plantae (Tree - autotroph, cellulose wall), Animalia (Lion - heterotroph, no wall). Show 2-kingdom to 5-kingdom evolution. Add Virus separately as non-living/living boundary.",
  "Microbes in Human Welfare": "Draw a biogas plant diagram showing: slurry inlet pipe, underground digester tank with anaerobic bacteria breaking down organic matter, gas holder dome collecting biogas (CH4 + CO2), outlet pipe for spent slurry (biomanure), gas pipe leading to flame/burner. Also draw sewage treatment: primary treatment (sedimentation), secondary treatment (activated sludge with microbes, aeration tank), tertiary treatment (chemical treatment, chlorination).",
  "Biotechnology — Principles & Processes": "Draw recombinant DNA technology steps: 1) Source DNA with gene of interest, restriction enzyme cutting at specific sites creating sticky ends, 2) Plasmid vector cut with same enzyme, 3) Gene inserted into plasmid using DNA ligase (recombinant plasmid), 4) Recombinant plasmid inserted into host bacterium (transformation), 5) Bacteria multiply producing copies of gene (cloning). Label: EcoRI cutting site, sticky ends, ori (origin of replication), antibiotic resistance gene as selectable marker.",
  "Human Reproduction": "Draw male reproductive system showing: testes in scrotum, seminiferous tubules (cross section showing spermatogenesis), epididymis, vas deferens, seminal vesicle, prostate gland, Cowper's gland, urethra, penis. Draw female reproductive system showing: ovaries with developing follicles (primary, secondary, Graafian, corpus luteum), fallopian tubes with fimbriae, uterus (fundus, body, cervix), vagina. Add spermatogenesis and oogenesis flowcharts.",
  "Principles of Inheritance": "Draw Mendel's dihybrid cross for seed color and shape: P generation (RRYY yellow round × rryy green wrinkled), F1 (all RrYy yellow round), F1 × F1 Punnett square (4×4 = 16 boxes), F2 ratio (9:3:3:1 - 9 yellow round:3 yellow wrinkled:3 green round:1 green wrinkled). Also show incomplete dominance cross (RR red × rr white → Rr pink in F1). Label: dominant, recessive, genotype, phenotype, homozygous, heterozygous.",
  "Evolution": "Draw Darwin's finches or evolutionary evidence diagram showing: common ancestor at top branching into different species, fossil record timeline showing progression, comparative anatomy (homologous organs: forelimbs of human, whale, bat, horse showing same bones), vestigial organs (appendix in humans). Show natural selection: original population with variation, environmental pressure selecting favorable traits, adapted population after generations.",
  "Human Health & Disease": "Draw immune system response showing: pathogen (bacteria/virus) entering body, innate immunity (neutrophils, macrophages engulfing pathogen), adaptive immunity (B-lymphocytes producing antibodies, T-lymphocytes - helper T, cytotoxic T, memory T and B cells). Draw antibody structure (Y-shaped, showing heavy chains, light chains, antigen-binding site, Fc region). Show vaccine mechanism: weakened antigen → memory cells → fast response on real infection.",
  "Ecosystem": "Draw ecosystem energy flow pyramid: producers (grass/plants - 1000 kcal), primary consumers (grasshoppers - 100 kcal), secondary consumers (frog - 10 kcal), tertiary consumers (snake - 1 kcal), apex predator (hawk - 0.1 kcal). Show 10% law (only 10% energy transferred). Also draw carbon cycle: photosynthesis (CO2 → organic carbon), respiration (organic carbon → CO2), decomposition, fossil fuels, combustion arrows.",
  "Biodiversity": "Draw a world map showing biodiversity hotspots highlighted (Western Ghats, Eastern Himalayas, Indo-Burma, Sundaland in India). Show species diversity graph (latitude vs species richness - more near equator). Draw pyramid of numbers vs pyramid of biomass. Show in-situ conservation (national park, wildlife sanctuary, biosphere reserve icons) and ex-situ conservation (zoo, botanical garden, seed bank, cryopreservation icons).",
};

function buildPrompt(chapter: string): string {
  const hint = CHAPTER_HINTS[chapter] || `Draw the main anatomical/biological structure from NCERT for "${chapter}" with all labeled parts important for NEET exam. Include at least 10 labeled parts with arrows.`;

  return `You are an expert SVG illustrator creating high-quality NCERT Biology diagrams for NEET students in India.

Create a DETAILED, ACCURATE, PROFESSIONAL labeled SVG diagram for: "${chapter}"

SPECIFIC DRAWING INSTRUCTIONS:
${hint}

SVG TECHNICAL RULES — FOLLOW EXACTLY:
1. Start with: <svg viewBox="0 0 700 560" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;font-family:Arial,sans-serif">
2. Use ONLY: rect, circle, ellipse, path, line, polygon, polyline, text, g, defs, linearGradient, stop, marker
3. NO foreignObject, NO script, NO CSS classes, NO external references
4. All colors as hex codes (#rrggbb) only
5. Every <text> must have: x=, y=, font-size=, fill=, font-family="Arial,sans-serif"
6. Make structures LARGE and REALISTIC (use path for organ shapes, not just circles)
7. Labels OUTSIDE structure with pointer lines — NO asterisks, NO markdown, plain text only
8. Label lines: <line x1="..." y1="..." x2="..." y2="..." stroke="#555555" stroke-width="1.2"/>

CRITICAL — TEXT LABELS MUST BE PLAIN:
- Write: <text>Nucleus</text> NOT <text>**Nucleus**</text>
- Write: <text>Mitochondria</text> NOT <text>**Mitochondria**</text>
- NEVER use **, *, _, or any markdown symbols inside SVG text tags
- Labels should be clean plain words only

QUALITY REQUIREMENTS:
- Title at top center: font-size="15" font-weight="bold" fill="#1a1a2e"
- Use realistic shapes: kidney bean for mitochondria, stack of discs for golgi, wavy lines for ER
- Use gradient fills (linearGradient) for 3D/realistic look
- Color code: cytoplasm=light green, nucleus=light blue, mitochondria=orange, golgi=purple
- Bottom yellow box (#fffde7) with border: 2-3 NEET key facts as plain text
- Minimum 10 labeled parts with pointer lines

Return ONLY raw SVG. Absolutely no markdown, no backticks, no explanation. Start directly with <svg`;
}


export async function POST(req: NextRequest) {
  try {
    const { chapter } = await req.json();
    if (!chapter) {
      return NextResponse.json({ error: "Chapter required" }, { status: 400 });
    }

    let svg = "";
    let lastError = "";

    for (const model of GROQ_MODELS) {
      try {
        const content = await callGroq(model, buildPrompt(chapter));
        const svgStart = content.indexOf("<svg");
        const svgEnd = content.lastIndexOf("</svg>");
        if (svgStart !== -1 && svgEnd !== -1) {
          svg = content.slice(svgStart, svgEnd + 6);
          const textCount = (svg.match(/<text/g) || []).length;
          if (textCount >= 6) break;
        }
      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    if (!svg) {
      return NextResponse.json(
        { error: lastError || "Could not generate diagram" },
        { status: 500 }
      );
    }

    svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
    svg = svg.replace(/on\w+="[^"]*"/gi, "");
    // Strip markdown asterisks that LLM sometimes adds inside SVG text
    svg = svg.replace(/\*\*([^*]+)\*\*/g, "$1");
    svg = svg.replace(/\*([^*]+)\*/g, "$1");
    svg = svg.replace(/__([^_]+)__/g, "$1");

    return NextResponse.json({ svg, chapter });
  } catch (err: any) {
    console.error("Diagram error:", err.message);
    return NextResponse.json({ error: "Failed to generate diagram" }, { status: 500 });
  }
}
