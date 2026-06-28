// src/lib/biologyDiagrams.ts
// All images hosted on Supabase biology-diagrams bucket

export interface DiagramData {
  title: string;
  description: string;
  labels: string[];
  imageUrl?: string;
  svg?: string;
  credit?: string;
}

const BASE = "https://jrdpxdalwvmcffmfqajk.supabase.co/storage/v1/object/public/biology-diagrams";

const REAL_IMAGES: Record<string, DiagramData> = {

  "Cell — The Unit of Life": {
    title: "Animal Cell Structure",
    description: "Eukaryotic animal cell showing all major organelles",
    labels: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Ribosomes", "Cytoplasm", "Centrioles", "Cell Membrane", "Endoplasmic Reticulum"],
    imageUrl: BASE + "/Animal_Cell.jpg",
  },
  "Cell Cycle & Cell Division": {
    title: "Animal Cell Cycle",
    description: "Stages of mitosis and meiosis in animal cells",
    labels: ["Prophase", "Metaphase", "Anaphase", "Telophase", "Interphase", "Cytokinesis"],
    imageUrl: BASE + "/Animal_cell_cycle-en.svg",
  },
  "Structural Organisation in Animals": {
    title: "Neuron Structure",
    description: "Complete multipolar neuron with all labeled parts",
    labels: ["Dendrites", "Cell Body", "Nucleus", "Axon", "Myelin Sheath", "Node of Ranvier", "Synaptic Knob"],
    imageUrl: BASE + "/Neuron.png",
  },
  "Human Health & Disease": {
    title: "Antibody Structure",
    description: "Y-shaped immunoglobulin showing antigen binding sites",
    labels: ["Heavy Chain", "Light Chain", "Antigen Binding Site", "Fc Region", "Disulfide Bond", "Variable Region"],
    imageUrl: BASE + "/Antibody.svg.png",
  },
  "Ecosystem": {
    title: "Aquatic Food Web",
    description: "Energy flow through trophic levels in an aquatic ecosystem",
    labels: ["Producers", "Primary Consumers", "Secondary Consumers", "Tertiary Consumers", "Decomposers"],
    imageUrl: BASE + "/Aquatic_food_web.jpg",
  },
  "Biological Classification": {
    title: "Five Kingdom Classification",
    description: "Whittaker's Five Kingdom system",
    labels: ["Monera", "Protista", "Fungi", "Plantae", "Animalia"],
    imageUrl: BASE + "/Biological_classification.png",
  },
  "Body Fluids & Circulation": {
    title: "Human Heart — Internal Structure",
    description: "Four-chambered heart showing chambers, valves and vessels",
    labels: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle", "Aorta", "Pulmonary Artery", "Tricuspid Valve", "Bicuspid Valve"],
    imageUrl: BASE + "/human_heart.svg.png",
  },
  "Photosynthesis": {
    title: "Chloroplast Structure",
    description: "Cross-section showing thylakoid, grana and stroma",
    labels: ["Outer Membrane", "Inner Membrane", "Thylakoid", "Grana", "Stroma", "Stroma Lamellae"],
    imageUrl: BASE + "/Chloroplast.png",
  },
  "Digestion & Absorption": {
    title: "Human Digestive System",
    description: "Complete alimentary canal from mouth to rectum",
    labels: ["Mouth", "Oesophagus", "Stomach", "Small Intestine", "Large Intestine", "Liver", "Pancreas", "Rectum"],
    imageUrl: BASE + "/Digestive.svg.png",
  },
  "Sexual Reproduction in Flowering Plants": {
    title: "Mature Flower Structure",
    description: "Complete flower parts for sexual reproduction",
    labels: ["Stamen", "Pistil", "Pollen", "Ovule", "Fertilization", "Endosperm", "Embryo"],
    imageUrl: BASE + "/Mature_flower.svg.png",
  },
  "Principles of Inheritance": {
    title: "Punnett Square — Mendel",
    description: "Monohybrid and dihybrid cross showing Mendel's laws",
    labels: ["Dominant", "Recessive", "Homozygous", "Heterozygous", "F1", "F2", "3:1 ratio"],
    imageUrl: BASE + "/Punnett_square_mendel_flowers.svg.png",
  },
};

// Keyword-based lookup
export function findDiagram(chapter: string): DiagramData | null {
  if (REAL_IMAGES[chapter]) return REAL_IMAGES[chapter];

  const ch = chapter.toLowerCase();
  if (ch.includes("cell") && ch.includes("unit")) return REAL_IMAGES["Cell — The Unit of Life"];
  if (ch.includes("cell cycle") || ch.includes("cell division") || ch.includes("mitosis") || ch.includes("meiosis")) return REAL_IMAGES["Cell Cycle & Cell Division"];
  if (ch.includes("structural organ") || ch.includes("neuron") || ch.includes("earthworm")) return REAL_IMAGES["Structural Organisation in Animals"];
  if (ch.includes("health") && ch.includes("disease")) return REAL_IMAGES["Human Health & Disease"];
  if (ch.includes("ecosystem") || ch.includes("food web") || ch.includes("food chain")) return REAL_IMAGES["Ecosystem"];
  if (ch.includes("biological class") || ch.includes("five kingdom")) return REAL_IMAGES["Biological Classification"];
  if (ch.includes("circulation") || ch.includes("heart") || ch.includes("body fluid")) return REAL_IMAGES["Body Fluids & Circulation"];
  if (ch.includes("photosynthesis") || ch.includes("chloroplast")) return REAL_IMAGES["Photosynthesis"];
  if (ch.includes("digest") || ch.includes("absorpt") || ch.includes("alimentary")) return REAL_IMAGES["Digestion & Absorption"];
  if (ch.includes("inherit") && ch.includes("principle")) return REAL_IMAGES["Principles of Inheritance"];
  if (ch.includes("molecular") || ch.includes("dna") || ch.includes("double helix")) return REAL_IMAGES["Molecular Basis of Inheritance"];
  if (ch.includes("chemical coord") || ch.includes("endocrine") || ch.includes("hormone")) return REAL_IMAGES["Chemical Coordination"];
  if (ch.includes("neural") || ch.includes("eye") || ch.includes("ear")) return REAL_IMAGES["Neural Control & Coordination"];
  if (ch.includes("morphology") || ch.includes("flower") && ch.includes("plant")) return REAL_IMAGES["Morphology of Flowering Plants"];
  if (ch.includes("mineral") || ch.includes("nitrogen") || ch.includes("nutrition")) return REAL_IMAGES["Mineral Nutrition"];
  if (ch.includes("transport") && ch.includes("plant")) return REAL_IMAGES["Transport in Plants"];
  if (ch.includes("evolution") || ch.includes("darwin") || ch.includes("natural selection")) return REAL_IMAGES["Evolution"];
  if (ch.includes("anatomy") || ch.includes("plant cell") || ch.includes("dicot") || ch.includes("monocot")) return REAL_IMAGES["Anatomy of Flowering Plants"];
  if (ch.includes("biotechnology") && ch.includes("principle")) return REAL_IMAGES["Biotechnology — Principles & Processes"];
  if (ch.includes("locomotion") || ch.includes("movement") || ch.includes("muscle") || ch.includes("sarcomere")) return REAL_IMAGES["Locomotion & Movement"];
  if (ch.includes("breath") || ch.includes("lung") || ch.includes("respirat") || ch.includes("alveol")) return REAL_IMAGES["Breathing & Exchange of Gases"];
  if (ch.includes("organism") && ch.includes("population")) return REAL_IMAGES["Organisms & Populations"];
  if (ch.includes("excret") || ch.includes("kidney") || ch.includes("nephron")) return REAL_IMAGES["Excretory Products & Elimination"];
  if (ch.includes("biotechnology") && ch.includes("applic")) return REAL_IMAGES["Biotechnology & Its Applications"];
  if (ch.includes("sexual reprod") || ch.includes("flower") && ch.includes("reprod")) return REAL_IMAGES["Sexual Reproduction in Flowering Plants"];

  return null;
}

export default REAL_IMAGES;
