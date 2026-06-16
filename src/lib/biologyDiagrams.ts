// src/lib/biologyDiagrams.ts
// Biology diagrams — Supabase hosted real images (primary) + full SVG fallbacks

export interface DiagramData {
  title: string;
  svg: string;
  labels: string[];
  description: string;
  imageUrl?: string;
  credit?: string;
}

const BASE = "https://jrdpxdalwvmcffmfqajk.supabase.co/storage/v1/object/public/biology-diagrams";

// ── REAL IMAGES: Supabase (primary) + Wikimedia Commons (CC BY-SA) ───────────
const WIKI = "https://upload.wikimedia.org/wikipedia/commons";
const REAL_IMAGES: Record<string, DiagramData> = {

  // ── Supabase hosted ──────────────────────────────────────────────────────────
  "Cell — The Unit of Life": {
    title: "Eukaryotic vs Prokaryotic Cell",
    description: "Comparison of eukaryotic and prokaryotic cell structure",
    labels: ["Nucleus", "Nucleolus", "Mitochondria", "Golgi Apparatus", "Ribosomes", "Cytoplasm", "Centrioles", "Cell Membrane"],
    imageUrl: BASE + "/Celltypes.png.png", credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Photosynthesis": {
    title: "Chloroplast Structure",
    description: "Cross-section of chloroplast showing thylakoid, grana and stroma",
    labels: ["Outer Membrane", "Inner Membrane", "Thylakoid", "Grana", "Stroma", "Stroma Lamellae"],
    imageUrl: BASE + "/chloroplast.png.svg", credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Digestion & Absorption": {
    title: "Human Digestive System",
    description: "Complete human alimentary canal from mouth to rectum with accessory glands",
    labels: ["Mouth", "Oesophagus", "Stomach", "Small Intestine", "Large Intestine", "Liver", "Pancreas", "Rectum"],
    imageUrl: BASE + "/digestion.png.svg", credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Molecular Basis of Inheritance": {
    title: "DNA Double Helix",
    description: "Watson-Crick DNA model showing base pairs and sugar-phosphate backbone",
    labels: ["Adenine-Thymine", "Guanine-Cytosine", "Phosphate Group", "Deoxyribose Sugar", "Hydrogen Bonds", "Major Groove"],
    imageUrl: BASE + "/dna.png.jpg", credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Neural Control & Coordination": {
    title: "Structure of the Human Eye",
    description: "Cross-section of human eye showing cornea, lens, retina and optic nerve",
    labels: ["Cornea", "Lens", "Retina", "Optic Nerve", "Iris", "Pupil", "Vitreous Humour", "Sclera"],
    imageUrl: BASE + "/eye.png.jpg", credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Body Fluids & Circulation": {
    title: "Human Heart — Internal Structure",
    description: "Four-chambered human heart showing atria, ventricles and valves",
    labels: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle", "Aorta", "Pulmonary Artery", "Tricuspid Valve", "Bicuspid Valve"],
    imageUrl: BASE + "/heart.png.svg", credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Excretory Products & Elimination": {
    title: "Human Kidney — Longitudinal Section",
    description: "Longitudinal section showing cortex, medulla, pelvis and ureter",
    labels: ["Cortex", "Medulla", "Renal Pelvis", "Ureter", "Pyramid", "Renal Artery", "Renal Vein"],
    imageUrl: BASE + "/kindey.png.png", credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Breathing & Exchange of Gases": {
    title: "Human Respiratory System",
    description: "Lungs, trachea, bronchi, bronchioles and alveoli structure",
    labels: ["Nasal Cavity", "Trachea", "Bronchus", "Bronchioles", "Alveoli", "Diaphragm", "Left Lung", "Right Lung"],
    imageUrl: BASE + "/lungs.png.jpg", credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Structural Organisation in Animals": {
    title: "Structure of a Neuron",
    description: "Multipolar neuron showing dendrites, cell body, axon and myelin sheath",
    labels: ["Dendrites", "Cell Body", "Nucleus", "Axon", "Myelin Sheath", "Node of Ranvier", "Axon Terminal"],
    imageUrl: BASE + "/neuron.png.png", credit: "Wikimedia (CC BY-SA)", svg: "",
  },

  // ── Wikimedia Commons images (CC BY-SA) ──────────────────────────────────────
  "The Living World": {
    title: "Biological Classification Hierarchy",
    description: "Taxonomic hierarchy from Kingdom to Species with examples",
    labels: ["Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"],
    imageUrl: WIKI + "/thumb/a/a5/Biological_classification_L_Pengo_vflip.svg/600px-Biological_classification_L_Pengo_vflip.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Biological Classification": {
    title: "Five Kingdom Classification",
    description: "Whittaker's Five Kingdom system — Monera, Protista, Fungi, Plantae, Animalia",
    labels: ["Monera", "Protista", "Fungi", "Plantae", "Animalia"],
    imageUrl: WIKI + "/thumb/8/8e/Eukaryota_diversity_2.jpg/800px-Eukaryota_diversity_2.jpg",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Plant Kingdom": {
    title: "Plant Kingdom Classification",
    description: "Major divisions from Algae to Angiosperms showing evolutionary progression",
    labels: ["Algae", "Bryophyta", "Pteridophyta", "Gymnosperms", "Angiosperms"],
    imageUrl: WIKI + "/thumb/4/49/Land_plant_phylogeny.svg/800px-Land_plant_phylogeny.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Animal Kingdom": {
    title: "Animal Kingdom Phylogenetic Tree",
    description: "Major animal phyla from Porifera to Chordata with key characteristics",
    labels: ["Porifera", "Cnidaria", "Platyhelminthes", "Annelida", "Arthropoda", "Mollusca", "Echinodermata", "Chordata"],
    imageUrl: WIKI + "/thumb/7/7d/Animal_diversity_October_2020.jpg/800px-Animal_diversity_October_2020.jpg",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Morphology of Flowering Plants": {
    title: "Parts of a Flowering Plant",
    description: "Complete diagram of a flowering plant showing root, stem, leaf, flower and fruit",
    labels: ["Root", "Stem", "Leaf", "Flower", "Fruit", "Seed", "Node", "Internode"],
    imageUrl: WIKI + "/thumb/4/4e/Mature_flower_diagram.svg/600px-Mature_flower_diagram.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Anatomy of Flowering Plants": {
    title: "Dicot vs Monocot Stem Cross Section",
    description: "Internal anatomy of dicot and monocot stem showing vascular bundles",
    labels: ["Epidermis", "Cortex", "Vascular Bundle", "Xylem", "Phloem", "Pith", "Endodermis"],
    imageUrl: WIKI + "/thumb/d/da/Stem_cross_section.jpg/800px-Stem_cross_section.jpg",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Biomolecules": {
    title: "Structure of DNA & Biomolecules",
    description: "Key biomolecules — carbohydrates, proteins, lipids and nucleic acids",
    labels: ["Glucose", "Amino Acid", "Fatty Acid", "Nucleotide", "Peptide Bond", "Glycosidic Bond"],
    imageUrl: WIKI + "/thumb/e/e4/DNA_chemical_structure.svg/600px-DNA_chemical_structure.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Cell Cycle & Cell Division": {
    title: "Mitosis & Meiosis",
    description: "Stages of mitosis and meiosis showing chromosome behavior",
    labels: ["Prophase", "Metaphase", "Anaphase", "Telophase", "Cytokinesis", "Interphase"],
    imageUrl: WIKI + "/thumb/2/2f/Animal_cell_cycle-en.svg/800px-Animal_cell_cycle-en.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Transport in Plants": {
    title: "Osmosis & Transport in Plants",
    description: "Water transport through root hair, xylem and transpiration pull",
    labels: ["Root Hair", "Cortex", "Xylem", "Phloem", "Stomata", "Osmosis", "Apoplast", "Symplast"],
    imageUrl: WIKI + "/thumb/9/96/Osmosis_diagram.svg/800px-Osmosis_diagram.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Mineral Nutrition": {
    title: "Nitrogen Fixation & Mineral Absorption",
    description: "Nitrogen cycle and mineral ion absorption by plant roots",
    labels: ["Nitrogen Fixation", "Nitrification", "Denitrification", "Ammonification", "Root Absorption"],
    imageUrl: WIKI + "/thumb/a/a8/Nitrogen_Cycle.svg/800px-Nitrogen_Cycle.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Respiration in Plants": {
    title: "Cellular Respiration Pathways",
    description: "Glycolysis, Krebs cycle and oxidative phosphorylation in plant cells",
    labels: ["Glycolysis", "Pyruvate", "Krebs Cycle", "ETC", "ATP", "NADH", "FADH2"],
    imageUrl: WIKI + "/thumb/3/30/Cellular_respiration.svg/800px-Cellular_respiration.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Plant Growth & Development": {
    title: "Plant Growth & Hormones",
    description: "Sigmoid growth curve and effect of plant hormones on growth",
    labels: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic Acid", "Ethylene", "Apical Dominance"],
    imageUrl: WIKI + "/thumb/7/7e/Auxin_and_phototropism.svg/600px-Auxin_and_phototropism.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Locomotion & Movement": {
    title: "Skeletal Muscle Structure",
    description: "Structure of skeletal muscle from organ to sarcomere level",
    labels: ["Muscle Fibre", "Myofibril", "Sarcomere", "Actin", "Myosin", "Z-line", "H-zone"],
    imageUrl: WIKI + "/thumb/5/52/Skeletal_muscle.jpg/800px-Skeletal_muscle.jpg",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Chemical Coordination": {
    title: "Human Endocrine System",
    description: "Major endocrine glands and their hormones",
    labels: ["Hypothalamus", "Pituitary", "Thyroid", "Adrenal", "Pancreas", "Gonads", "Pineal"],
    imageUrl: WIKI + "/thumb/1/18/Illu_endocrine_system.jpg/600px-Illu_endocrine_system.jpg",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Reproduction in Organisms": {
    title: "Types of Reproduction",
    description: "Asexual and sexual reproduction modes in organisms",
    labels: ["Binary Fission", "Budding", "Fragmentation", "Sporulation", "Sexual Reproduction"],
    imageUrl: WIKI + "/thumb/a/a7/Amoeba_binary_fission.svg/800px-Amoeba_binary_fission.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Sexual Reproduction in Flowering Plants": {
    title: "Flower Structure & Pollination",
    description: "Parts of a flower and double fertilization in angiosperms",
    labels: ["Stamen", "Pistil", "Pollen", "Ovule", "Fertilization", "Endosperm", "Embryo"],
    imageUrl: WIKI + "/thumb/4/4e/Mature_flower_diagram.svg/600px-Mature_flower_diagram.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Human Reproduction": {
    title: "Human Reproductive System",
    description: "Male and female reproductive organs with gametogenesis",
    labels: ["Testes", "Ovary", "Fallopian Tube", "Uterus", "Sperm", "Ovum", "Fertilization"],
    imageUrl: WIKI + "/thumb/5/5e/Spermatozoa_-_en.svg/800px-Spermatozoa_-_en.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Reproductive Health": {
    title: "Reproductive Health & Contraception",
    description: "Methods of contraception and STDs overview",
    labels: ["Contraception", "IUD", "Barrier Methods", "Hormonal", "STDs", "MTP"],
    imageUrl: WIKI + "/thumb/c/cd/Reproductive_system_diagram_-_female.png/600px-Reproductive_system_diagram_-_female.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Principles of Inheritance": {
    title: "Mendelian Genetics & Dihybrid Cross",
    description: "Monohybrid and dihybrid cross showing Mendel's laws",
    labels: ["Dominant", "Recessive", "Homozygous", "Heterozygous", "Phenotype", "Genotype", "F1", "F2"],
    imageUrl: WIKI + "/thumb/a/a2/Punnett_square_mendel_flowers.svg/600px-Punnett_square_mendel_flowers.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Evolution": {
    title: "Darwin's Theory & Natural Selection",
    description: "Tree of life and evidence of evolution from fossils to molecular biology",
    labels: ["Natural Selection", "Variation", "Fitness", "Adaptation", "Speciation", "Fossil Record"],
    imageUrl: WIKI + "/thumb/4/4b/Phylogenetic_tree.svg/800px-Phylogenetic_tree.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Human Health & Disease": {
    title: "Immune System & Diseases",
    description: "Human immune response, pathogens and common diseases",
    labels: ["Antigen", "Antibody", "B-cell", "T-cell", "Pathogen", "Immunity", "Vaccination"],
    imageUrl: WIKI + "/thumb/8/8e/Antibody.svg/600px-Antibody.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Microbes in Human Welfare": {
    title: "Biogas Plant & Sewage Treatment",
    description: "Biogas production process and sewage treatment stages",
    labels: ["Anaerobic Digester", "Methanogens", "Biogas", "Slurry", "Sewage Treatment", "Activated Sludge"],
    imageUrl: WIKI + "/thumb/f/f3/Biogas_plant_animation.gif/800px-Biogas_plant_animation.gif",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Biotechnology — Principles & Processes": {
    title: "Recombinant DNA Technology",
    description: "Gene cloning using restriction enzymes, vectors and host cells",
    labels: ["Restriction Enzyme", "Vector", "Plasmid", "Recombinant DNA", "Host Cell", "Cloning", "PCR"],
    imageUrl: WIKI + "/thumb/c/c0/Plasmid_%28english%29.svg/600px-Plasmid_%28english%29.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Biotechnology & Its Applications": {
    title: "Bt Cotton & Insulin Production",
    description: "Applications of biotechnology in agriculture and medicine",
    labels: ["Bt Toxin", "Transgenic Plants", "Insulin", "Gene Therapy", "ELISA", "DNA Fingerprinting"],
    imageUrl: WIKI + "/thumb/1/19/Genetic_engineering.svg/800px-Genetic_engineering.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Organisms & Populations": {
    title: "Population Growth Curves",
    description: "Logistic and exponential population growth with carrying capacity",
    labels: ["Biotic Potential", "Carrying Capacity", "Logistic Growth", "J-curve", "S-curve", "Natality", "Mortality"],
    imageUrl: WIKI + "/thumb/d/d9/Population_growth.svg/800px-Population_growth.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Ecosystem": {
    title: "Ecosystem Energy Flow",
    description: "Food chain, food web and energy flow through trophic levels",
    labels: ["Producer", "Primary Consumer", "Secondary Consumer", "Decomposer", "Energy Flow", "Biomass"],
    imageUrl: WIKI + "/thumb/f/f3/Aquatic_food_web.jpg/800px-Aquatic_food_web.jpg",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
  "Biodiversity": {
    title: "Biodiversity & Conservation",
    description: "Types of biodiversity, hotspots and conservation methods",
    labels: ["Species Diversity", "Genetic Diversity", "Ecosystem Diversity", "Hotspots", "In-situ", "Ex-situ"],
    imageUrl: WIKI + "/thumb/2/2c/Biodiversity_hotspots_WWF.svg/800px-Biodiversity_hotspots_WWF.svg.png",
    credit: "Wikimedia (CC BY-SA)", svg: "",
  },
};

// ── FULL SVG FALLBACKS (shown if real image fails) ────────────────────────────
const SVG_FALLBACKS: Record<string, DiagramData> = {

  "Animal Kingdom": {
    title: "Animal Kingdom — Classification Chart",
    description: "Major phyla of Kingdom Animalia with key characteristics",
    labels: ["Porifera", "Cnidaria", "Platyhelminthes", "Nematoda", "Annelida", "Arthropoda", "Mollusca", "Echinodermata", "Chordata"],
    svg: `<svg viewBox="0 0 620 480" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<!-- Title -->
<rect x="160" y="10" width="300" height="36" rx="10" fill="#1b5e20"/>
<text x="310" y="33" text-anchor="middle" font-size="14" fill="white" font-weight="bold">Kingdom Animalia</text>
<!-- Root line -->
<line x1="310" y1="46" x2="310" y2="70" stroke="#388e3c" stroke-width="2"/>
<!-- Two branches: Invertebrata / Vertebrata -->
<line x1="310" y1="70" x2="150" y2="70" stroke="#388e3c" stroke-width="2"/>
<line x1="310" y1="70" x2="490" y2="70" stroke="#388e3c" stroke-width="2"/>
<!-- Invertebrata box -->
<rect x="70" y="70" width="160" height="30" rx="8" fill="#2e7d32"/>
<text x="150" y="90" text-anchor="middle" font-size="12" fill="white" font-weight="bold">Invertebrata</text>
<!-- Vertebrata box -->
<rect x="410" y="70" width="160" height="30" rx="8" fill="#1565c0"/>
<text x="490" y="90" text-anchor="middle" font-size="12" fill="white" font-weight="bold">Vertebrata (Chordata)</text>

<!-- Invertebrate phyla lines -->
<line x1="150" y1="100" x2="150" y2="120" stroke="#388e3c" stroke-width="1.5"/>
<line x1="30" y1="120" x2="270" y2="120" stroke="#388e3c" stroke-width="1.5"/>
<!-- Phyla vertical lines -->
<line x1="30"  y1="120" x2="30"  y2="140" stroke="#388e3c" stroke-width="1.5"/>
<line x1="80"  y1="120" x2="80"  y2="140" stroke="#388e3c" stroke-width="1.5"/>
<line x1="130" y1="120" x2="130" y2="140" stroke="#388e3c" stroke-width="1.5"/>
<line x1="180" y1="120" x2="180" y2="140" stroke="#388e3c" stroke-width="1.5"/>
<line x1="230" y1="120" x2="230" y2="140" stroke="#388e3c" stroke-width="1.5"/>
<line x1="280" y1="120" x2="280" y2="140" stroke="#388e3c" stroke-width="1.5"/>
<line x1="330" y1="120" x2="330" y2="140" stroke="#388e3c" stroke-width="1.5"/>
<line x1="380" y1="120" x2="380" y2="140" stroke="#388e3c" stroke-width="1.5"/>

<!-- Phyla boxes row -->
<!-- Porifera -->
<rect x="2"   y="140" width="58" height="28" rx="6" fill="#66bb6a"/>
<text x="31"  y="158" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Porifera</text>
<!-- Cnidaria -->
<rect x="52"  y="140" width="58" height="28" rx="6" fill="#26a69a"/>
<text x="81"  y="158" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Cnidaria</text>
<!-- Platyhelminthes -->
<rect x="102" y="140" width="58" height="28" rx="6" fill="#ef5350"/>
<text x="131" y="153" text-anchor="middle" font-size="8" fill="white" font-weight="bold">Platy-</text>
<text x="131" y="163" text-anchor="middle" font-size="8" fill="white" font-weight="bold">helminthes</text>
<!-- Nematoda -->
<rect x="152" y="140" width="58" height="28" rx="6" fill="#ab47bc"/>
<text x="181" y="158" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Nematoda</text>
<!-- Annelida -->
<rect x="202" y="140" width="58" height="28" rx="6" fill="#ff7043"/>
<text x="231" y="158" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Annelida</text>
<!-- Arthropoda -->
<rect x="252" y="140" width="62" height="28" rx="6" fill="#f9a825"/>
<text x="283" y="158" text-anchor="middle" font-size="9" fill="#1a1a1a" font-weight="bold">Arthropoda</text>
<!-- Mollusca -->
<rect x="302" y="140" width="58" height="28" rx="6" fill="#0288d1"/>
<text x="331" y="158" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Mollusca</text>
<!-- Echinodermata -->
<rect x="352" y="140" width="60" height="28" rx="6" fill="#558b2f"/>
<text x="382" y="153" text-anchor="middle" font-size="8" fill="white" font-weight="bold">Echino-</text>
<text x="382" y="163" text-anchor="middle" font-size="8" fill="white" font-weight="bold">dermata</text>

<!-- Key features rows for each phylum -->
<!-- Porifera -->
<rect x="2" y="178" width="58" height="60" rx="4" fill="#e8f5e9" stroke="#66bb6a" stroke-width="1"/>
<text x="31" y="191" text-anchor="middle" font-size="7" fill="#1b5e20">Pores</text>
<text x="31" y="202" text-anchor="middle" font-size="7" fill="#1b5e20">No tissue</text>
<text x="31" y="213" text-anchor="middle" font-size="7" fill="#1b5e20">Spongilla</text>
<text x="31" y="224" text-anchor="middle" font-size="7" fill="#1b5e20">Sycon</text>
<text x="31" y="232" text-anchor="middle" font-size="8" fill="#388e3c" font-weight="bold">eg: Sponge</text>

<!-- Cnidaria -->
<rect x="52" y="178" width="58" height="60" rx="4" fill="#e0f2f1" stroke="#26a69a" stroke-width="1"/>
<text x="81" y="191" text-anchor="middle" font-size="7" fill="#004d40">Cnidoblasts</text>
<text x="81" y="202" text-anchor="middle" font-size="7" fill="#004d40">Radial sym</text>
<text x="81" y="213" text-anchor="middle" font-size="7" fill="#004d40">Diploblastic</text>
<text x="81" y="232" text-anchor="middle" font-size="8" fill="#00695c" font-weight="bold">eg: Hydra</text>

<!-- Platyhelminthes -->
<rect x="102" y="178" width="58" height="60" rx="4" fill="#ffebee" stroke="#ef5350" stroke-width="1"/>
<text x="131" y="191" text-anchor="middle" font-size="7" fill="#b71c1c">Flat body</text>
<text x="131" y="202" text-anchor="middle" font-size="7" fill="#b71c1c">Triploblastic</text>
<text x="131" y="213" text-anchor="middle" font-size="7" fill="#b71c1c">Acoelomate</text>
<text x="131" y="232" text-anchor="middle" font-size="8" fill="#c62828" font-weight="bold">eg: Tapeworm</text>

<!-- Nematoda -->
<rect x="152" y="178" width="58" height="60" rx="4" fill="#f3e5f5" stroke="#ab47bc" stroke-width="1"/>
<text x="181" y="191" text-anchor="middle" font-size="7" fill="#4a148c">Round body</text>
<text x="181" y="202" text-anchor="middle" font-size="7" fill="#4a148c">Pseudocoelom</text>
<text x="181" y="213" text-anchor="middle" font-size="7" fill="#4a148c">Parasitic</text>
<text x="181" y="232" text-anchor="middle" font-size="8" fill="#7b1fa2" font-weight="bold">eg: Ascaris</text>

<!-- Annelida -->
<rect x="202" y="178" width="58" height="60" rx="4" fill="#fbe9e7" stroke="#ff7043" stroke-width="1"/>
<text x="231" y="191" text-anchor="middle" font-size="7" fill="#bf360c">Segmented</text>
<text x="231" y="202" text-anchor="middle" font-size="7" fill="#bf360c">True coelom</text>
<text x="231" y="213" text-anchor="middle" font-size="7" fill="#bf360c">Setae</text>
<text x="231" y="232" text-anchor="middle" font-size="8" fill="#e64a19" font-weight="bold">eg: Earthworm</text>

<!-- Arthropoda -->
<rect x="252" y="178" width="62" height="60" rx="4" fill="#fff8e1" stroke="#f9a825" stroke-width="1"/>
<text x="283" y="191" text-anchor="middle" font-size="7" fill="#e65100">Jointed legs</text>
<text x="283" y="202" text-anchor="middle" font-size="7" fill="#e65100">Exoskeleton</text>
<text x="283" y="213" text-anchor="middle" font-size="7" fill="#e65100">Open circ.</text>
<text x="283" y="232" text-anchor="middle" font-size="8" fill="#ef6c00" font-weight="bold">eg: Cockroach</text>

<!-- Mollusca -->
<rect x="302" y="178" width="58" height="60" rx="4" fill="#e3f2fd" stroke="#0288d1" stroke-width="1"/>
<text x="331" y="191" text-anchor="middle" font-size="7" fill="#01579b">Soft body</text>
<text x="331" y="202" text-anchor="middle" font-size="7" fill="#01579b">Mantle</text>
<text x="331" y="213" text-anchor="middle" font-size="7" fill="#01579b">Shell present</text>
<text x="331" y="232" text-anchor="middle" font-size="8" fill="#0277bd" font-weight="bold">eg: Octopus</text>

<!-- Echinodermata -->
<rect x="352" y="178" width="60" height="60" rx="4" fill="#f1f8e9" stroke="#558b2f" stroke-width="1"/>
<text x="382" y="191" text-anchor="middle" font-size="7" fill="#33691e">Spiny skin</text>
<text x="382" y="202" text-anchor="middle" font-size="7" fill="#33691e">Water vasc.</text>
<text x="382" y="213" text-anchor="middle" font-size="7" fill="#33691e">Radial sym</text>
<text x="382" y="232" text-anchor="middle" font-size="8" fill="#558b2f" font-weight="bold">eg: Starfish</text>

<!-- Chordata column (Vertebrata) -->
<line x1="490" y1="100" x2="490" y2="260" stroke="#1565c0" stroke-width="1.5"/>
<!-- Classes -->
<line x1="490" y1="145" x2="530" y2="145" stroke="#1565c0" stroke-width="1.5"/>
<line x1="490" y1="185" x2="530" y2="185" stroke="#1565c0" stroke-width="1.5"/>
<line x1="490" y1="220" x2="530" y2="220" stroke="#1565c0" stroke-width="1.5"/>
<line x1="490" y1="255" x2="530" y2="255" stroke="#1565c0" stroke-width="1.5"/>
<line x1="490" y1="290" x2="530" y2="290" stroke="#1565c0" stroke-width="1.5"/>

<rect x="530" y="133" width="80" height="24" rx="6" fill="#1565c0"/>
<text x="570" y="149" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Pisces 🐟</text>
<text x="570" y="162" text-anchor="middle" font-size="8" fill="#90caf9">Cold-blooded, gills</text>

<rect x="530" y="172" width="80" height="24" rx="6" fill="#0288d1"/>
<text x="570" y="188" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Amphibia 🐸</text>
<text x="570" y="201" text-anchor="middle" font-size="8" fill="#b3e5fc">Dual life</text>

<rect x="530" y="208" width="80" height="24" rx="6" fill="#00838f"/>
<text x="570" y="224" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Reptilia 🦎</text>
<text x="570" y="237" text-anchor="middle" font-size="8" fill="#b2ebf2">Scales, dry skin</text>

<rect x="530" y="243" width="80" height="24" rx="6" fill="#6a1b9a"/>
<text x="570" y="259" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Aves 🐦</text>
<text x="570" y="272" text-anchor="middle" font-size="8" fill="#e1bee7">Feathers, warm</text>

<rect x="530" y="278" width="80" height="24" rx="6" fill="#4527a0"/>
<text x="570" y="294" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Mammalia 🦁</text>
<text x="570" y="307" text-anchor="middle" font-size="8" fill="#d1c4e9">Hair, mammary</text>

<!-- NEET tip box -->
<rect x="10" y="315" width="600" height="50" rx="8" fill="#fff3e0" stroke="#f57f17" stroke-width="1.5"/>
<text x="310" y="333" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Points</text>
<text x="310" y="348" text-anchor="middle" font-size="9" fill="#bf360c">Arthropoda = largest phylum · Notochord = defining feature of Chordata</text>
<text x="310" y="360" text-anchor="middle" font-size="9" fill="#bf360c">Protostomes: Annelida/Arthropoda/Mollusca · Deuterostomes: Echinodermata/Chordata</text>

<!-- Legend -->
<rect x="10" y="370" width="600" height="30" rx="6" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="1"/>
<text x="310" y="388" text-anchor="middle" font-size="9" fill="#424242">Symmetry: Porifera=Asymmetric · Cnidaria/Echinoderm=Radial · Rest=Bilateral</text>
</svg>`,
  },

  "Biological Classification": {
    title: "Five Kingdom Classification",
    description: "Whittaker's Five Kingdom system with key features",
    labels: ["Monera", "Protista", "Fungi", "Plantae", "Animalia"],
    svg: `<svg viewBox="0 0 580 400" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<rect x="200" y="8" width="180" height="34" rx="10" fill="#37474f"/>
<text x="290" y="30" text-anchor="middle" font-size="13" fill="white" font-weight="bold">5 Kingdom Classification</text>
<text x="290" y="44" text-anchor="middle" font-size="9" fill="#90a4ae">(R.H. Whittaker, 1969)</text>
<!-- Five kingdom boxes -->
<!-- Monera -->
<rect x="10" y="60" width="100" height="200" rx="10" fill="#e53935" opacity="0.9"/>
<text x="60" y="80" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Monera</text>
<line x1="20" y1="86" x2="100" y2="86" stroke="white" stroke-width="0.5" opacity="0.5"/>
<text x="60" y="100" text-anchor="middle" font-size="8" fill="white">Prokaryotic</text>
<text x="60" y="113" text-anchor="middle" font-size="8" fill="white">No nuclear</text>
<text x="60" y="126" text-anchor="middle" font-size="8" fill="white">membrane</text>
<text x="60" y="145" text-anchor="middle" font-size="8" fill="#ffcdd2">Unicellular</text>
<text x="60" y="158" text-anchor="middle" font-size="8" fill="#ffcdd2">Autotrophic/</text>
<text x="60" y="171" text-anchor="middle" font-size="8" fill="#ffcdd2">Heterotrophic</text>
<text x="60" y="192" text-anchor="middle" font-size="9" fill="white" font-weight="bold">eg:</text>
<text x="60" y="205" text-anchor="middle" font-size="8" fill="#ffebee">Bacteria</text>
<text x="60" y="218" text-anchor="middle" font-size="8" fill="#ffebee">Cyanobacteria</text>
<text x="60" y="231" text-anchor="middle" font-size="8" fill="#ffebee">Mycoplasma</text>
<!-- Protista -->
<rect x="120" y="60" width="100" height="200" rx="10" fill="#f57c00" opacity="0.9"/>
<text x="170" y="80" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Protista</text>
<line x1="130" y1="86" x2="210" y2="86" stroke="white" stroke-width="0.5" opacity="0.5"/>
<text x="170" y="100" text-anchor="middle" font-size="8" fill="white">Eukaryotic</text>
<text x="170" y="113" text-anchor="middle" font-size="8" fill="white">Unicellular</text>
<text x="170" y="126" text-anchor="middle" font-size="8" fill="white">Aquatic</text>
<text x="170" y="145" text-anchor="middle" font-size="8" fill="#ffe0b2">Autotrophic/</text>
<text x="170" y="158" text-anchor="middle" font-size="8" fill="#ffe0b2">Heterotrophic</text>
<text x="170" y="171" text-anchor="middle" font-size="8" fill="#ffe0b2">Both modes</text>
<text x="170" y="192" text-anchor="middle" font-size="9" fill="white" font-weight="bold">eg:</text>
<text x="170" y="205" text-anchor="middle" font-size="8" fill="#fff3e0">Amoeba</text>
<text x="170" y="218" text-anchor="middle" font-size="8" fill="#fff3e0">Euglena</text>
<text x="170" y="231" text-anchor="middle" font-size="8" fill="#fff3e0">Diatoms</text>
<!-- Fungi -->
<rect x="230" y="60" width="100" height="200" rx="10" fill="#7b1fa2" opacity="0.9"/>
<text x="280" y="80" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Fungi</text>
<line x1="240" y1="86" x2="320" y2="86" stroke="white" stroke-width="0.5" opacity="0.5"/>
<text x="280" y="100" text-anchor="middle" font-size="8" fill="white">Eukaryotic</text>
<text x="280" y="113" text-anchor="middle" font-size="8" fill="white">Heterotrophic</text>
<text x="280" y="126" text-anchor="middle" font-size="8" fill="white">Saprophytic</text>
<text x="280" y="145" text-anchor="middle" font-size="8" fill="#e1bee7">Cell wall:</text>
<text x="280" y="158" text-anchor="middle" font-size="8" fill="#e1bee7">Chitin</text>
<text x="280" y="171" text-anchor="middle" font-size="8" fill="#e1bee7">Hyphae/</text>
<text x="280" y="184" text-anchor="middle" font-size="8" fill="#e1bee7">Mycelium</text>
<text x="280" y="200" text-anchor="middle" font-size="9" fill="white" font-weight="bold">eg:</text>
<text x="280" y="213" text-anchor="middle" font-size="8" fill="#f3e5f5">Rhizopus</text>
<text x="280" y="226" text-anchor="middle" font-size="8" fill="#f3e5f5">Penicillium</text>
<text x="280" y="239" text-anchor="middle" font-size="8" fill="#f3e5f5">Mushroom</text>
<!-- Plantae -->
<rect x="340" y="60" width="100" height="200" rx="10" fill="#2e7d32" opacity="0.9"/>
<text x="390" y="80" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Plantae</text>
<line x1="350" y1="86" x2="430" y2="86" stroke="white" stroke-width="0.5" opacity="0.5"/>
<text x="390" y="100" text-anchor="middle" font-size="8" fill="white">Eukaryotic</text>
<text x="390" y="113" text-anchor="middle" font-size="8" fill="white">Autotrophic</text>
<text x="390" y="126" text-anchor="middle" font-size="8" fill="white">Multicellular</text>
<text x="390" y="145" text-anchor="middle" font-size="8" fill="#c8e6c9">Cell wall:</text>
<text x="390" y="158" text-anchor="middle" font-size="8" fill="#c8e6c9">Cellulose</text>
<text x="390" y="171" text-anchor="middle" font-size="8" fill="#c8e6c9">Chlorophyll</text>
<text x="390" y="184" text-anchor="middle" font-size="8" fill="#c8e6c9">present</text>
<text x="390" y="200" text-anchor="middle" font-size="9" fill="white" font-weight="bold">eg:</text>
<text x="390" y="213" text-anchor="middle" font-size="8" fill="#e8f5e9">Algae</text>
<text x="390" y="226" text-anchor="middle" font-size="8" fill="#e8f5e9">Bryophyta</text>
<text x="390" y="239" text-anchor="middle" font-size="8" fill="#e8f5e9">Angiosperms</text>
<!-- Animalia -->
<rect x="450" y="60" width="110" height="200" rx="10" fill="#1565c0" opacity="0.9"/>
<text x="505" y="80" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Animalia</text>
<line x1="460" y1="86" x2="550" y2="86" stroke="white" stroke-width="0.5" opacity="0.5"/>
<text x="505" y="100" text-anchor="middle" font-size="8" fill="white">Eukaryotic</text>
<text x="505" y="113" text-anchor="middle" font-size="8" fill="white">Heterotrophic</text>
<text x="505" y="126" text-anchor="middle" font-size="8" fill="white">Multicellular</text>
<text x="505" y="145" text-anchor="middle" font-size="8" fill="#bbdefb">No cell wall</text>
<text x="505" y="158" text-anchor="middle" font-size="8" fill="#bbdefb">No chlorophyll</text>
<text x="505" y="171" text-anchor="middle" font-size="8" fill="#bbdefb">Holotrophic</text>
<text x="505" y="184" text-anchor="middle" font-size="8" fill="#bbdefb">nutrition</text>
<text x="505" y="200" text-anchor="middle" font-size="9" fill="white" font-weight="bold">eg:</text>
<text x="505" y="213" text-anchor="middle" font-size="8" fill="#e3f2fd">Insects</text>
<text x="505" y="226" text-anchor="middle" font-size="8" fill="#e3f2fd">Fish, Birds</text>
<text x="505" y="239" text-anchor="middle" font-size="8" fill="#e3f2fd">Mammals</text>

<!-- Comparison row -->
<rect x="10" y="272" width="560" height="28" rx="6" fill="#eceff1" stroke="#90a4ae" stroke-width="1"/>
<text x="10" y="272" font-size="0"> </text>
<text x="60"  y="290" text-anchor="middle" font-size="8" fill="#b71c1c" font-weight="bold">No nucleus</text>
<text x="170" y="290" text-anchor="middle" font-size="8" fill="#e65100" font-weight="bold">Simple nucleus</text>
<text x="280" y="290" text-anchor="middle" font-size="8" fill="#6a1b9a" font-weight="bold">Chitin wall</text>
<text x="390" y="290" text-anchor="middle" font-size="8" fill="#1b5e20" font-weight="bold">Cellulose wall</text>
<text x="505" y="290" text-anchor="middle" font-size="8" fill="#0d47a1" font-weight="bold">No cell wall</text>

<!-- NEET tip -->
<rect x="10" y="310" width="560" height="40" rx="8" fill="#fff8e1" stroke="#fbc02d" stroke-width="1.5"/>
<text x="290" y="327" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key — Virus not included in 5 kingdoms (non-living outside host)</text>
<text x="290" y="343" text-anchor="middle" font-size="9" fill="#bf360c">Lichens = Fungi + Algae symbiosis · Mycoplasma = smallest living cell (no cell wall)</text>

<!-- Complexity arrow -->
<line x1="10" y1="360" x2="570" y2="360" stroke="#78909c" stroke-width="2" marker-end="url(#arrow)"/>
<text x="290" y="375" text-anchor="middle" font-size="9" fill="#546e7a">← Simple (Prokaryotic) ————————— Complexity increases ————————— Complex (Eukaryotic) →</text>
</svg>`,
  },

  "Plant Kingdom": {
    title: "Plant Kingdom — Classification",
    description: "Major divisions of Plant Kingdom from Algae to Angiosperms",
    labels: ["Algae (Thallophyta)", "Bryophyta", "Pteridophyta", "Gymnosperms", "Angiosperms"],
    svg: `<svg viewBox="0 0 580 420" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<rect x="190" y="8" width="200" height="32" rx="10" fill="#1b5e20"/>
<text x="290" y="29" text-anchor="middle" font-size="13" fill="white" font-weight="bold">Kingdom Plantae</text>
<!-- Arrow showing evolution -->
<line x1="60" y1="55" x2="540" y2="55" stroke="#388e3c" stroke-width="2"/>
<polygon points="540,50 550,55 540,60" fill="#388e3c"/>
<text x="290" y="52" text-anchor="middle" font-size="8" fill="#388e3c">Evolution (Simple → Complex)</text>
<!-- 5 Division boxes -->
<!-- Algae -->
<rect x="10" y="65" width="105" height="220" rx="10" fill="#0097a7"/>
<text x="62" y="84" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Algae</text>
<text x="62" y="96" text-anchor="middle" font-size="8" fill="#e0f7fa">(Thallophyta)</text>
<line x1="18" y1="101" x2="107" y2="101" stroke="white" stroke-width="0.5" opacity="0.4"/>
<text x="62" y="114" text-anchor="middle" font-size="8" fill="white">No true root/</text>
<text x="62" y="126" text-anchor="middle" font-size="8" fill="white">stem/leaf</text>
<text x="62" y="138" text-anchor="middle" font-size="8" fill="#e0f7fa">Aquatic</text>
<text x="62" y="150" text-anchor="middle" font-size="8" fill="#e0f7fa">Photosynthetic</text>
<text x="62" y="165" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Types:</text>
<text x="62" y="178" text-anchor="middle" font-size="8" fill="#b2ebf2">Chlorophyceae</text>
<text x="62" y="190" text-anchor="middle" font-size="8" fill="#b2ebf2">(Green)</text>
<text x="62" y="202" text-anchor="middle" font-size="8" fill="#b2ebf2">Phaeophyceae</text>
<text x="62" y="214" text-anchor="middle" font-size="8" fill="#b2ebf2">(Brown)</text>
<text x="62" y="226" text-anchor="middle" font-size="8" fill="#b2ebf2">Rhodophyceae</text>
<text x="62" y="238" text-anchor="middle" font-size="8" fill="#b2ebf2">(Red)</text>
<text x="62" y="255" text-anchor="middle" font-size="8" fill="white" font-weight="bold">eg: Ulva,</text>
<text x="62" y="267" text-anchor="middle" font-size="8" fill="white">Spirogyra</text>
<!-- Bryophyta -->
<rect x="123" y="65" width="105" height="220" rx="10" fill="#388e3c"/>
<text x="175" y="84" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Bryophyta</text>
<text x="175" y="96" text-anchor="middle" font-size="8" fill="#c8e6c9">Amphibians</text>
<line x1="131" y1="101" x2="220" y2="101" stroke="white" stroke-width="0.5" opacity="0.4"/>
<text x="175" y="114" text-anchor="middle" font-size="8" fill="white">No vascular</text>
<text x="175" y="126" text-anchor="middle" font-size="8" fill="white">tissue</text>
<text x="175" y="138" text-anchor="middle" font-size="8" fill="#c8e6c9">Rhizoids</text>
<text x="175" y="150" text-anchor="middle" font-size="8" fill="#c8e6c9">(not true roots)</text>
<text x="175" y="165" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Types:</text>
<text x="175" y="178" text-anchor="middle" font-size="8" fill="#a5d6a7">Liverworts</text>
<text x="175" y="190" text-anchor="middle" font-size="8" fill="#a5d6a7">Hornworts</text>
<text x="175" y="202" text-anchor="middle" font-size="8" fill="#a5d6a7">Mosses</text>
<text x="175" y="255" text-anchor="middle" font-size="8" fill="white" font-weight="bold">eg: Funaria,</text>
<text x="175" y="267" text-anchor="middle" font-size="8" fill="white">Marchantia</text>
<!-- Pteridophyta -->
<rect x="236" y="65" width="105" height="220" rx="10" fill="#558b2f"/>
<text x="288" y="84" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Pteridophyta</text>
<text x="288" y="96" text-anchor="middle" font-size="8" fill="#dcedc8">First vascular</text>
<line x1="244" y1="101" x2="333" y2="101" stroke="white" stroke-width="0.5" opacity="0.4"/>
<text x="288" y="114" text-anchor="middle" font-size="8" fill="white">True roots,</text>
<text x="288" y="126" text-anchor="middle" font-size="8" fill="white">stem, leaves</text>
<text x="288" y="138" text-anchor="middle" font-size="8" fill="#dcedc8">No seeds</text>
<text x="288" y="150" text-anchor="middle" font-size="8" fill="#dcedc8">Spores present</text>
<text x="288" y="165" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Types:</text>
<text x="288" y="178" text-anchor="middle" font-size="8" fill="#f0f4c3">Psilopsida</text>
<text x="288" y="190" text-anchor="middle" font-size="8" fill="#f0f4c3">Lycopsida</text>
<text x="288" y="202" text-anchor="middle" font-size="8" fill="#f0f4c3">Sphenopsida</text>
<text x="288" y="214" text-anchor="middle" font-size="8" fill="#f0f4c3">Pteropsida</text>
<text x="288" y="255" text-anchor="middle" font-size="8" fill="white" font-weight="bold">eg: Fern,</text>
<text x="288" y="267" text-anchor="middle" font-size="8" fill="white">Selaginella</text>
<!-- Gymnosperms -->
<rect x="349" y="65" width="105" height="220" rx="10" fill="#827717"/>
<text x="401" y="84" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Gymnosperms</text>
<text x="401" y="96" text-anchor="middle" font-size="8" fill="#f9fbe7">Naked seeds</text>
<line x1="357" y1="101" x2="446" y2="101" stroke="white" stroke-width="0.5" opacity="0.4"/>
<text x="401" y="114" text-anchor="middle" font-size="8" fill="white">Seeds not</text>
<text x="401" y="126" text-anchor="middle" font-size="8" fill="white">enclosed in fruit</text>
<text x="401" y="138" text-anchor="middle" font-size="8" fill="#f9fbe7">Perennial,</text>
<text x="401" y="150" text-anchor="middle" font-size="8" fill="#f9fbe7">evergreen</text>
<text x="401" y="165" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Cones:</text>
<text x="401" y="178" text-anchor="middle" font-size="8" fill="#f0f4c3">Male = Pollen</text>
<text x="401" y="190" text-anchor="middle" font-size="8" fill="#f0f4c3">Female = Ovule</text>
<text x="401" y="255" text-anchor="middle" font-size="8" fill="white" font-weight="bold">eg: Pinus,</text>
<text x="401" y="267" text-anchor="middle" font-size="8" fill="white">Cycas, Ginkgo</text>
<!-- Angiosperms -->
<rect x="462" y="65" width="108" height="220" rx="10" fill="#1b5e20"/>
<text x="516" y="84" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Angiosperms</text>
<text x="516" y="96" text-anchor="middle" font-size="8" fill="#c8e6c9">Enclosed seeds</text>
<line x1="470" y1="101" x2="562" y2="101" stroke="white" stroke-width="0.5" opacity="0.4"/>
<text x="516" y="114" text-anchor="middle" font-size="8" fill="white">Seeds enclosed</text>
<text x="516" y="126" text-anchor="middle" font-size="8" fill="white">in fruit (ovary)</text>
<text x="516" y="138" text-anchor="middle" font-size="8" fill="#c8e6c9">Flowers present</text>
<text x="516" y="150" text-anchor="middle" font-size="8" fill="#c8e6c9">Most evolved</text>
<text x="516" y="165" text-anchor="middle" font-size="9" fill="white" font-weight="bold">Types:</text>
<text x="516" y="178" text-anchor="middle" font-size="8" fill="#a5d6a7">Monocots</text>
<text x="516" y="190" text-anchor="middle" font-size="8" fill="#a5d6a7">(1 cotyledon)</text>
<text x="516" y="202" text-anchor="middle" font-size="8" fill="#a5d6a7">Dicots</text>
<text x="516" y="214" text-anchor="middle" font-size="8" fill="#a5d6a7">(2 cotyledons)</text>
<text x="516" y="255" text-anchor="middle" font-size="8" fill="white" font-weight="bold">eg: Mango,</text>
<text x="516" y="267" text-anchor="middle" font-size="8" fill="white">Wheat, Rose</text>

<!-- Vascular tissue indicator -->
<rect x="10" y="295" width="560" height="22" rx="6" fill="#e8eaf6" stroke="#5c6bc0" stroke-width="1"/>
<text x="62"  y="310" text-anchor="middle" font-size="8" fill="#880e4f">✗ No vascular</text>
<text x="175" y="310" text-anchor="middle" font-size="8" fill="#880e4f">✗ No vascular</text>
<text x="288" y="310" text-anchor="middle" font-size="8" fill="#1b5e20">✓ Vascular</text>
<text x="401" y="310" text-anchor="middle" font-size="8" fill="#1b5e20">✓ Vascular</text>
<text x="516" y="310" text-anchor="middle" font-size="8" fill="#1b5e20">✓ Vascular</text>

<!-- NEET tip -->
<rect x="10" y="325" width="560" height="40" rx="8" fill="#fff3e0" stroke="#f57f17" stroke-width="1.5"/>
<text x="290" y="342" text-anchor="middle" font-size="10" fill="#e65100" font-weight="bold">⭐ NEET Key Points</text>
<text x="290" y="358" text-anchor="middle" font-size="9" fill="#bf360c">Embryophyta = Bryophyta+Pteridophyta+Gymnosperms+Angiosperms · Cryptogams = no seeds</text>

<text x="290" y="390" text-anchor="middle" font-size="9" fill="#546e7a">Phanerogams (seed plants) = Gymnosperms + Angiosperms</text>
</svg>`,
  },

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
<circle cx="174" cy="172" r="3" fill="#1565c0"/>
<circle cx="180" cy="220" r="3" fill="#1565c0"/>
<circle cx="305" cy="168" r="3" fill="#1565c0"/>
<ellipse cx="130" cy="130" rx="38" ry="22" fill="#fff9c4" stroke="#f57f17" stroke-width="2"/>
<path d="M108,130 Q120,118 132,130 Q144,142 156,130" fill="none" stroke="#f57f17" stroke-width="1.5"/>
<line x1="130" y1="108" x2="100" y2="80" stroke="#f57f17" stroke-width="1.2"/>
<text x="52" y="77" font-size="11" fill="#f57f17" font-weight="bold">Mitochondria</text>
<g transform="translate(340,230)">
<path d="M-40,0 Q-10,-12 20,0" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M-35,10 Q-5,-2 25,10" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M-30,20 Q0,8 30,20" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M-25,30 Q5,18 35,30" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<circle cx="28" cy="5" r="7" fill="#ce93d8" stroke="#7b1fa2"/>
<circle cx="33" cy="18" r="6" fill="#ce93d8" stroke="#7b1fa2"/>
</g>
<line x1="340" y1="225" x2="390" y2="200" stroke="#7b1fa2" stroke-width="1.2"/>
<text x="392" y="197" font-size="11" fill="#7b1fa2" font-weight="bold">Golgi Body</text>
<path d="M160,250 Q175,240 190,255 Q205,270 220,255 Q235,240 250,255" fill="none" stroke="#00695c" stroke-width="2.5"/>
<circle cx="165" cy="248" r="3" fill="#00695c"/>
<circle cx="195" cy="254" r="3" fill="#00695c"/>
<line x1="200" y1="270" x2="165" y2="300" stroke="#00695c" stroke-width="1.2"/>
<text x="90" y="314" font-size="11" fill="#00695c" font-weight="bold">Rough ER</text>
<circle cx="350" cy="155" r="4" fill="#c62828"/>
<circle cx="360" cy="148" r="4" fill="#c62828"/>
<circle cx="355" cy="162" r="4" fill="#c62828"/>
<circle cx="365" cy="155" r="4" fill="#c62828"/>
<line x1="358" y1="145" x2="380" y2="120" stroke="#c62828" stroke-width="1.2"/>
<text x="382" y="117" font-size="11" fill="#c62828" font-weight="bold">Ribosomes</text>
<circle cx="150" cy="250" r="18" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
<text x="143" y="254" font-size="9" fill="#c62828">Lyso</text>
<text x="392" y="310" font-size="11" fill="#2e7d32" font-weight="bold">Cell Membrane</text>
<rect x="270" y="260" width="22" height="10" rx="3" fill="#ff8f00" stroke="#e65100"/>
<rect x="276" y="268" width="10" height="22" rx="3" fill="#ff8f00" stroke="#e65100"/>
<text x="200" y="325" font-size="11" fill="#e65100" font-weight="bold">Centriole</text>
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
<path d="M40,140 Q55,185 95,140" fill="none" stroke="#1565c0" stroke-width="2.5"/>
<path d="M25,140 Q50,80 95,140" fill="none" stroke="#1565c0" stroke-width="2"/>
<path d="M25,140 Q45,200 95,140" fill="none" stroke="#1565c0" stroke-width="2"/>
<circle cx="60" cy="118" r="5" fill="#1565c0"/>
<circle cx="60" cy="162" r="5" fill="#1565c0"/>
<circle cx="40" cy="100" r="5" fill="#1565c0"/>
<circle cx="38" cy="180" r="5" fill="#1565c0"/>
<circle cx="22" cy="85" r="5" fill="#1565c0"/>
<circle cx="20" cy="195" r="5" fill="#1565c0"/>
<text x="8" y="68" font-size="12" fill="#1565c0" font-weight="bold">Dendrites</text>
<circle cx="130" cy="140" r="42" fill="#fff9c4" stroke="#f57f17" stroke-width="3"/>
<circle cx="130" cy="140" r="18" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
<circle cx="130" cy="140" r="7" fill="#1565c0" opacity="0.6"/>
<text x="108" y="174" font-size="10" fill="#f57f17" font-weight="bold">Cell Body</text>
<text x="118" y="144" font-size="9" fill="#1565c0">Nucleus</text>
<path d="M170,140 Q185,140 190,140" fill="none" stroke="#2e7d32" stroke-width="5"/>
<line x1="190" y1="140" x2="530" y2="140" stroke="#2e7d32" stroke-width="4"/>
<rect x="200" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="252" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="304" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="356" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="408" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<rect x="460" y="128" width="40" height="24" rx="12" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" opacity="0.85"/>
<line x1="245" y1="133" x2="245" y2="147" stroke="#c62828" stroke-width="2.5"/>
<line x1="297" y1="133" x2="297" y2="147" stroke="#c62828" stroke-width="2.5"/>
<line x1="349" y1="133" x2="349" y2="147" stroke="#c62828" stroke-width="2.5"/>
<line x1="401" y1="133" x2="401" y2="147" stroke="#c62828" stroke-width="2.5"/>
<line x1="453" y1="133" x2="453" y2="147" stroke="#c62828" stroke-width="2.5"/>
<line x1="322" y1="128" x2="322" y2="95" stroke="#2e7d32" stroke-width="1.2"/>
<text x="280" y="91" font-size="12" fill="#2e7d32" font-weight="bold">Myelin Sheath</text>
<line x1="349" y1="148" x2="349" y2="185" stroke="#c62828" stroke-width="1.2"/>
<text x="295" y="200" font-size="11" fill="#c62828" font-weight="bold">Node of Ranvier</text>
<path d="M530,140 Q545,120 555,110" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M530,140 Q545,135 555,130" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M530,140 Q545,148 555,155" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<path d="M530,140 Q545,160 555,170" fill="none" stroke="#7b1fa2" stroke-width="3"/>
<circle cx="558" cy="108" r="6" fill="#7b1fa2"/>
<circle cx="558" cy="128" r="6" fill="#7b1fa2"/>
<circle cx="558" cy="153" r="6" fill="#7b1fa2"/>
<circle cx="558" cy="172" r="6" fill="#7b1fa2"/>
<text x="545" y="200" font-size="11" fill="#7b1fa2" font-weight="bold">Terminals</text>
<text x="330" y="165" font-size="12" fill="#2e7d32" font-weight="bold">Axon</text>
</svg>`,
  },

  "Body Fluids & Circulation": {
    title: "Internal Structure of the Human Heart",
    description: "Four-chambered human heart showing valves, vessels, and blood flow direction",
    labels: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle", "Aorta", "Pulmonary Artery", "Tricuspid Valve", "Bicuspid Valve"],
    svg: `<svg viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<path d="M250,370 Q130,280 100,200 Q70,120 130,90 Q185,65 220,110 Q235,130 250,150 Q265,130 280,110 Q315,65 370,90 Q430,120 400,200 Q370,280 250,370Z" fill="#ffcdd2" stroke="#c62828" stroke-width="3"/>
<line x1="250" y1="155" x2="248" y2="355" stroke="#c62828" stroke-width="3"/>
<text x="115" y="200" font-size="11" fill="#1565c0" font-weight="bold">Right</text>
<text x="112" y="215" font-size="11" fill="#1565c0" font-weight="bold">Atrium</text>
<text x="335" y="200" font-size="11" fill="#c62828" font-weight="bold">Left</text>
<text x="330" y="215" font-size="11" fill="#c62828" font-weight="bold">Atrium</text>
<text x="118" y="300" font-size="11" fill="#1565c0" font-weight="bold">Right</text>
<text x="108" y="315" font-size="11" fill="#1565c0" font-weight="bold">Ventricle</text>
<text x="332" y="300" font-size="11" fill="#c62828" font-weight="bold">Left</text>
<text x="322" y="315" font-size="11" fill="#c62828" font-weight="bold">Ventricle</text>
<path d="M200,240 Q225,230 250,245 Q225,255 200,245Z" fill="#f57f17" stroke="#e65100" stroke-width="1.5"/>
<text x="148" y="260" font-size="9" fill="#e65100">Tricuspid</text>
<path d="M250,240 Q275,230 300,245 Q275,255 250,245Z" fill="#f57f17" stroke="#e65100" stroke-width="1.5"/>
<text x="308" y="260" font-size="9" fill="#e65100">Bicuspid</text>
<path d="M280,95 Q290,50 310,35 Q340,20 360,40" fill="none" stroke="#c62828" stroke-width="10" stroke-linecap="round"/>
<text x="330" y="28" font-size="11" fill="#c62828" font-weight="bold">Aorta</text>
<path d="M220,95 Q210,50 190,35 Q165,20 145,40" fill="none" stroke="#1565c0" stroke-width="10" stroke-linecap="round"/>
<text x="100" y="28" font-size="11" fill="#1565c0" font-weight="bold">Pulm. Artery</text>
<rect x="155" y="35" width="22" height="55" rx="10" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
<text x="130" y="30" font-size="9" fill="#1565c0">SVC</text>
<rect x="155" y="355" width="22" height="40" rx="10" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
<text x="130" y="400" font-size="9" fill="#1565c0">IVC</text>
<rect x="323" y="35" width="22" height="55" rx="10" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
<text x="318" y="30" font-size="9" fill="#c62828">Pulm. Veins</text>
<line x1="220" y1="248" x2="210" y2="300" stroke="#795548" stroke-width="1.5"/>
<line x1="240" y1="248" x2="235" y2="305" stroke="#795548" stroke-width="1.5"/>
<line x1="260" y1="248" x2="265" y2="305" stroke="#795548" stroke-width="1.5"/>
<line x1="280" y1="248" x2="290" y2="300" stroke="#795548" stroke-width="1.5"/>
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
<path d="M165,145 Q200,165 190,200 Q175,225 160,215 Q140,195 145,170 Q148,150 165,145Z" fill="#ff8a65" stroke="#e64a19" stroke-width="1.5" opacity="0.8"/>
<path d="M315,145 Q300,165 310,200 Q320,225 340,215 Q358,195 355,170 Q348,150 315,145Z" fill="#ff8a65" stroke="#e64a19" stroke-width="1.5" opacity="0.8"/>
<path d="M195,240 Q230,255 265,240 Q260,290 240,300 Q220,290 195,240Z" fill="#ff8a65" stroke="#e64a19" stroke-width="1.5" opacity="0.8"/>
<path d="M185,160 Q210,150 240,155 Q270,150 295,160 Q310,175 300,195 Q280,220 240,225 Q200,220 180,195 Q170,175 185,160Z" fill="#fffde7" stroke="#f9a825" stroke-width="2"/>
<path d="M235,225 Q230,270 228,340" fill="none" stroke="#f9a825" stroke-width="8" stroke-linecap="round"/>
<path d="M90,160 Q120,160 185,165" fill="none" stroke="#c62828" stroke-width="8" stroke-linecap="round"/>
<path d="M90,185 Q120,185 180,180" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
<text x="25" y="155" font-size="11" fill="#c62828" font-weight="bold">Renal Artery</text>
<text x="25" y="198" font-size="11" fill="#1565c0" font-weight="bold">Renal Vein</text>
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

  "Photosynthesis": {
    title: "Structure of Chloroplast",
    description: "Cross-section of chloroplast showing thylakoid, grana, stroma, and envelope",
    labels: ["Outer Membrane", "Inner Membrane", "Stroma", "Thylakoid", "Grana", "Stroma Lamellae"],
    svg: `<svg viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<ellipse cx="260" cy="160" rx="230" ry="130" fill="#e8f5e9" stroke="#2e7d32" stroke-width="4"/>
<ellipse cx="260" cy="160" rx="215" ry="115" fill="#c8e6c9" stroke="#388e3c" stroke-width="2.5"/>
<text x="70" y="95" font-size="11" fill="#1b5e20" font-style="italic">Stroma</text>
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
<rect x="-22" y="47" width="44" height="14" rx="7" fill="#43a047" stroke="#2e7d32" stroke-width="1.5"/>
</g>
<g transform="translate(370,155)">
<rect x="-22" y="-32" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="-15" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="2" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
<rect x="-22" y="19" width="44" height="14" rx="7" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>
</g>
<path d="M172,150 Q216,130 238,140" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
<path d="M172,165 Q216,180 238,170" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
<path d="M282,148 Q326,132 348,142" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
<path d="M282,163 Q326,178 348,168" fill="none" stroke="#66bb6a" stroke-width="2.5"/>
<line x1="150" y1="105" x2="120" y2="70" stroke="#2e7d32" stroke-width="1"/>
<text x="55" y="66" font-size="11" fill="#2e7d32" font-weight="bold">Grana</text>
<line x1="210" y1="155" x2="185" y2="220" stroke="#388e3c" stroke-width="1"/>
<text x="115" y="238" font-size="11" fill="#388e3c" font-weight="bold">Stroma Lamellae</text>
<text x="2" y="148" font-size="10" fill="#2e7d32" font-weight="bold">Outer Membrane</text>
<line x1="260" y1="50" x2="260" y2="30" stroke="#1b5e20" stroke-width="1"/>
<text x="215" y="26" font-size="11" fill="#1b5e20" font-weight="bold">Thylakoid Disc</text>
<circle cx="100" cy="170" r="4" fill="#f57f17"/>
<circle cx="115" cy="165" r="4" fill="#f57f17"/>
<text x="60" y="200" font-size="10" fill="#f57f17">Ribosomes</text>
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
<g id="vb3">
<ellipse cx="230" cy="120" rx="18" ry="12" fill="#ffcc80" stroke="#ef6c00" stroke-width="2"/>
<ellipse cx="230" cy="142" rx="20" ry="14" fill="#ef9a9a" stroke="#c62828" stroke-width="2"/>
</g>
<use href="#vb3" transform="rotate(60 230 230)"/>
<use href="#vb3" transform="rotate(120 230 230)"/>
<use href="#vb3" transform="rotate(180 230 230)"/>
<use href="#vb3" transform="rotate(240 230 230)"/>
<use href="#vb3" transform="rotate(300 230 230)"/>
<circle cx="230" cy="230" r="108" fill="none" stroke="#795548" stroke-width="3"/>
<circle cx="175" cy="175" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
<circle cx="195" cy="165" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
<circle cx="285" cy="175" r="6" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
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
<path d="M150,230 Q150,190 190,190 Q230,190 230,230" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
<path d="M270,230 Q270,190 310,190 Q350,190 350,230" fill="#ffcc02" stroke="#f57f17" stroke-width="2.5" fill-opacity="0.4"/>
<circle cx="200" cy="145" r="5" fill="#c62828"/>
<circle cx="215" cy="155" r="5" fill="#c62828"/>
<circle cx="250" cy="140" r="5" fill="#c62828"/>
<circle cx="280" cy="155" r="5" fill="#c62828"/>
<circle cx="300" cy="145" r="5" fill="#c62828"/>
<ellipse cx="250" cy="165" rx="25" ry="12" fill="none" stroke="#1565c0" stroke-width="2.5" stroke-dasharray="4,2"/>
<text x="232" y="169" font-size="9" fill="#1565c0" font-weight="bold">mt-DNA</text>
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

  "Digestion & Absorption": {
    title: "Human Alimentary Canal",
    description: "Schematic diagram of the human digestive system showing organs and glands",
    labels: ["Mouth", "Oesophagus", "Stomach", "Small Intestine", "Large Intestine", "Liver", "Pancreas", "Rectum"],
    svg: `<svg viewBox="0 0 460 520" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<ellipse cx="230" cy="35" rx="38" ry="20" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>
<text x="207" y="39" font-size="10" fill="#c62828" font-weight="bold">Mouth</text>
<rect x="218" y="55" width="24" height="70" rx="10" fill="#ef9a9a" stroke="#c62828" stroke-width="2"/>
<line x1="242" y1="90" x2="310" y2="80" stroke="#c62828" stroke-width="1"/>
<text x="312" y="78" font-size="10" fill="#c62828" font-weight="bold">Oesophagus</text>
<path d="M200,125 Q160,135 155,165 Q148,200 165,225 Q185,248 220,250 Q255,252 268,235 Q285,215 282,185 Q278,155 260,135 Q242,122 200,125Z" fill="#ffccbc" stroke="#e64a19" stroke-width="2.5"/>
<text x="192" y="195" font-size="10" fill="#e64a19" font-weight="bold">Stomach</text>
<path d="M245,245 Q290,250 295,275 Q300,305 270,315 Q240,325 220,310 Q195,295 200,268 Q205,248 230,248" fill="none" stroke="#ff7043" stroke-width="12" stroke-linecap="round"/>
<path d="M200,268 Q185,280 188,308 Q192,335 220,342 Q250,348 270,335 Q295,318 292,290" fill="none" stroke="#ff8a65" stroke-width="11" stroke-linecap="round"/>
<path d="M292,310 Q305,330 295,358 Q282,380 255,385 Q228,388 212,372 Q195,355 200,330" fill="none" stroke="#ff7043" stroke-width="12" stroke-linecap="round"/>
<text x="222" y="302" font-size="9" fill="white" font-weight="bold">Small Intestine</text>
<path d="M200,390 Q170,395 155,420 Q148,445 165,465 Q188,482 220,480 Q255,478 285,465 Q310,448 315,420 Q318,395 295,385 Q270,375 245,385" fill="none" stroke="#8d6e63" stroke-width="16" stroke-linecap="round"/>
<text x="198" y="440" font-size="9" fill="white" font-weight="bold">Large Intestine</text>
<rect x="218" y="475" width="24" height="35" rx="10" fill="#a1887f" stroke="#6d4c41" stroke-width="2"/>
<text x="250" y="498" font-size="9" fill="#6d4c41" font-weight="bold">Rectum</text>
<path d="M300,130 Q355,128 375,155 Q390,178 378,205 Q362,228 330,228 Q305,225 295,205 Q285,182 300,155Z" fill="#ef9a9a" stroke="#b71c1c" stroke-width="2"/>
<text x="320" y="182" font-size="10" fill="#b71c1c" font-weight="bold">Liver</text>
<ellipse cx="358" cy="230" rx="18" ry="12" fill="#c5e1a5" stroke="#558b2f" stroke-width="1.5"/>
<text x="340" y="248" font-size="8" fill="#558b2f">Gall Bladder</text>
<path d="M145,230 Q175,222 210,228 Q195,245 165,252 Q145,250 145,230Z" fill="#ffe0b2" stroke="#e65100" stroke-width="2"/>
<text x="145" y="243" font-size="9" fill="#e65100" font-weight="bold">Pancreas</text>
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
<text x="200" y="62" font-size="8" fill="#c62828">Larynx</text>
<rect x="220" y="85" width="20" height="55" rx="8" fill="#bbdefb" stroke="#1565c0" stroke-width="2"/>
<line x1="220" y1="98" x2="240" y2="98" stroke="#1565c0" stroke-width="2"/>
<line x1="220" y1="110" x2="240" y2="110" stroke="#1565c0" stroke-width="2"/>
<line x1="220" y1="122" x2="240" y2="122" stroke="#1565c0" stroke-width="2"/>
<line x1="220" y1="134" x2="240" y2="134" stroke="#1565c0" stroke-width="2"/>
<text x="245" y="115" font-size="10" fill="#1565c0" font-weight="bold">Trachea</text>
<path d="M220,140 Q185,145 160,160" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
<path d="M240,140 Q275,145 300,160" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
<path d="M80,160 Q60,185 62,230 Q65,280 90,320 Q115,355 155,360 Q190,362 210,340 Q228,318 225,280 Q222,240 210,205 Q195,170 175,160 Q140,150 80,160Z" fill="#ffcdd2" stroke="#e57373" stroke-width="2.5" opacity="0.85"/>
<text x="118" y="270" font-size="12" fill="#c62828" font-weight="bold">Left Lung</text>
<path d="M380,160 Q400,185 398,230 Q395,280 370,320 Q345,355 305,360 Q270,362 250,340 Q232,318 235,280 Q238,240 250,205 Q265,170 285,160 Q320,150 380,160Z" fill="#ffcdd2" stroke="#e57373" stroke-width="2.5" opacity="0.85"/>
<text x="300" y="270" font-size="12" fill="#c62828" font-weight="bold">Right Lung</text>
<path d="M160,165 Q148,200 142,240 Q138,270 145,300" fill="none" stroke="#ef9a9a" stroke-width="3"/>
<path d="M160,165 Q175,200 175,240 Q174,272 168,305" fill="none" stroke="#ef9a9a" stroke-width="2.5"/>
<path d="M300,165 Q310,200 315,240 Q318,270 312,300" fill="none" stroke="#ef9a9a" stroke-width="3"/>
<circle cx="145" cy="310" r="12" fill="#ffebee" stroke="#e57373" stroke-width="1.5"/>
<circle cx="165" cy="318" r="12" fill="#ffebee" stroke="#e57373" stroke-width="1.5"/>
<circle cx="155" cy="328" r="12" fill="#ffebee" stroke="#e57373" stroke-width="1.5"/>
<text x="92" y="342" font-size="9" fill="#c62828" font-weight="bold">Alveoli</text>
<path d="M60,375 Q150,360 230,365 Q310,360 400,375 Q390,390 230,385 Q70,390 60,375Z" fill="#a5d6a7" stroke="#388e3c" stroke-width="2"/>
<text x="190" y="383" font-size="10" fill="#1b5e20" font-weight="bold">Diaphragm</text>
</svg>`,
  },

  "Molecular Basis of Inheritance": {
    title: "DNA Double Helix Structure",
    description: "Watson-Crick model showing base pairs, sugar-phosphate backbone and major/minor grooves",
    labels: ["Phosphate Group", "Deoxyribose Sugar", "Adenine-Thymine", "Guanine-Cytosine", "Major Groove", "Minor Groove", "Hydrogen Bonds"],
    svg: `<svg viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif">
<path d="M120,20 Q80,60 120,100 Q160,140 120,180 Q80,220 120,260 Q160,300 120,340 Q80,380 120,420 Q160,460 120,480" fill="none" stroke="#1565c0" stroke-width="8" stroke-linecap="round"/>
<path d="M280,20 Q320,60 280,100 Q240,140 280,180 Q320,220 280,260 Q240,300 280,340 Q320,380 280,420 Q240,460 280,480" fill="none" stroke="#c62828" stroke-width="8" stroke-linecap="round"/>
<rect x="130" y="58" width="40" height="12" rx="4" fill="#1565c0"/>
<rect x="230" y="58" width="40" height="12" rx="4" fill="#2e7d32"/>
<line x1="170" y1="64" x2="230" y2="64" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<text x="192" y="56" font-size="8" fill="#1565c0">A</text>
<text x="218" y="56" font-size="8" fill="#2e7d32">T</text>
<rect x="145" y="108" width="40" height="12" rx="4" fill="#7b1fa2"/>
<rect x="215" y="108" width="40" height="12" rx="4" fill="#e65100"/>
<line x1="185" y1="114" x2="215" y2="114" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<text x="196" y="106" font-size="8" fill="#7b1fa2">G</text>
<text x="210" y="106" font-size="8" fill="#e65100">C</text>
<rect x="130" y="158" width="40" height="12" rx="4" fill="#2e7d32"/>
<rect x="230" y="158" width="40" height="12" rx="4" fill="#1565c0"/>
<line x1="170" y1="164" x2="230" y2="164" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="145" y="208" width="40" height="12" rx="4" fill="#e65100"/>
<rect x="215" y="208" width="40" height="12" rx="4" fill="#7b1fa2"/>
<line x1="185" y1="214" x2="215" y2="214" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="130" y="258" width="40" height="12" rx="4" fill="#1565c0"/>
<rect x="230" y="258" width="40" height="12" rx="4" fill="#2e7d32"/>
<line x1="170" y1="264" x2="230" y2="264" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="145" y="308" width="40" height="12" rx="4" fill="#7b1fa2"/>
<rect x="215" y="308" width="40" height="12" rx="4" fill="#e65100"/>
<line x1="185" y1="314" x2="215" y2="314" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="130" y="358" width="40" height="12" rx="4" fill="#2e7d32"/>
<rect x="230" y="358" width="40" height="12" rx="4" fill="#1565c0"/>
<line x1="170" y1="364" x2="230" y2="364" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<rect x="145" y="408" width="40" height="12" rx="4" fill="#e65100"/>
<rect x="215" y="408" width="40" height="12" rx="4" fill="#7b1fa2"/>
<line x1="185" y1="414" x2="215" y2="414" stroke="#ffd54f" stroke-width="2" stroke-dasharray="4,2"/>
<text x="2" y="22" font-size="10" fill="#1565c0" font-weight="bold">Phosphate backbone</text>
<text x="342" y="22" font-size="10" fill="#c62828" font-weight="bold">Sugar backbone</text>
<line x1="200" y1="64" x2="350" y2="80" stroke="#ffd54f" stroke-width="1"/>
<text x="352" y="84" font-size="9" fill="#f9a825" font-weight="bold">H-bonds</text>
<text x="10" y="140" font-size="9" fill="#388e3c" font-weight="bold">Major Groove</text>
<text x="10" y="240" font-size="9" fill="#0288d1" font-weight="bold">Minor Groove</text>
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
  // 1. Exact real image match (Supabase + Wikimedia)
  if (REAL_IMAGES[chapter]) return REAL_IMAGES[chapter];

  // 2. Keyword → real image (fuzzy match)
  const ch = chapter.toLowerCase();
  if (ch.includes("living world") || ch.includes("taxonomy") || ch.includes("classification") && ch.includes("living")) return REAL_IMAGES["The Living World"];
  if (ch.includes("biological class") || ch.includes("five kingdom") || ch.includes("whittaker")) return REAL_IMAGES["Biological Classification"];
  if (ch.includes("plant kingdom") || ch.includes("bryophyt") || ch.includes("pteridophyt")) return REAL_IMAGES["Plant Kingdom"];
  if (ch.includes("animal kingdom") || ch.includes("phyla") || ch.includes("animalia")) return REAL_IMAGES["Animal Kingdom"];
  if (ch.includes("morphology") || ch.includes("flowering plant")) return REAL_IMAGES["Morphology of Flowering Plants"];
  if (ch.includes("anatomy") || ch.includes("dicot") || ch.includes("monocot")) return REAL_IMAGES["Anatomy of Flowering Plants"];
  if (ch.includes("structural organ") || ch.includes("earthworm")) return REAL_IMAGES["Structural Organisation in Animals"];
  if (ch.includes("cell cycle") || ch.includes("cell division") || ch.includes("mitosis") || ch.includes("meiosis")) return REAL_IMAGES["Cell Cycle & Cell Division"];
  if (ch.includes("cell") && !ch.includes("cell cycle")) return REAL_IMAGES["Cell — The Unit of Life"];
  if (ch.includes("biomolecule") || ch.includes("protein") || ch.includes("carbohydrate")) return REAL_IMAGES["Biomolecules"];
  if (ch.includes("transport") && ch.includes("plant")) return REAL_IMAGES["Transport in Plants"];
  if (ch.includes("mineral") || ch.includes("nitrogen") || ch.includes("nutrition")) return REAL_IMAGES["Mineral Nutrition"];
  if (ch.includes("photosynthesis") || ch.includes("chloroplast")) return REAL_IMAGES["Photosynthesis"];
  if (ch.includes("respiration") && ch.includes("plant")) return REAL_IMAGES["Respiration in Plants"];
  if (ch.includes("plant growth") || ch.includes("auxin") || ch.includes("gibberellin")) return REAL_IMAGES["Plant Growth & Development"];
  if (ch.includes("digest") || ch.includes("absorpt") || ch.includes("alimentary")) return REAL_IMAGES["Digestion & Absorption"];
  if (ch.includes("breath") || ch.includes("lung") || ch.includes("alveol")) return REAL_IMAGES["Breathing & Exchange of Gases"];
  if (ch.includes("circulation") || ch.includes("heart") || ch.includes("blood")) return REAL_IMAGES["Body Fluids & Circulation"];
  if (ch.includes("excret") || ch.includes("kidney") || ch.includes("nephron")) return REAL_IMAGES["Excretory Products & Elimination"];
  if (ch.includes("locomotion") || ch.includes("movement") || ch.includes("muscle") || ch.includes("skeletal")) return REAL_IMAGES["Locomotion & Movement"];
  if (ch.includes("neural") || ch.includes("neuron") || ch.includes("eye") || ch.includes("ear")) return REAL_IMAGES["Neural Control & Coordination"];
  if (ch.includes("chemical coord") || ch.includes("endocrine") || ch.includes("hormone")) return REAL_IMAGES["Chemical Coordination"];
  if (ch.includes("reproduction in org") || ch.includes("asexual")) return REAL_IMAGES["Reproduction in Organisms"];
  if (ch.includes("sexual reprod") && ch.includes("plant")) return REAL_IMAGES["Sexual Reproduction in Flowering Plants"];
  if (ch.includes("human reprod")) return REAL_IMAGES["Human Reproduction"];
  if (ch.includes("reproductive health") || ch.includes("contraception")) return REAL_IMAGES["Reproductive Health"];
  if (ch.includes("inheritance") || ch.includes("mendel") || ch.includes("genetics")) return REAL_IMAGES["Principles of Inheritance"];
  if (ch.includes("molecular") || ch.includes("dna") || ch.includes("double helix")) return REAL_IMAGES["Molecular Basis of Inheritance"];
  if (ch.includes("evolution") || ch.includes("darwin") || ch.includes("natural selection")) return REAL_IMAGES["Evolution"];
  if (ch.includes("health") && ch.includes("disease")) return REAL_IMAGES["Human Health & Disease"];
  if (ch.includes("microbe") || ch.includes("biogas") || ch.includes("sewage")) return REAL_IMAGES["Microbes in Human Welfare"];
  if (ch.includes("biotechnology") && ch.includes("principle")) return REAL_IMAGES["Biotechnology — Principles & Processes"];
  if (ch.includes("biotechnology") && ch.includes("applic")) return REAL_IMAGES["Biotechnology & Its Applications"];
  if (ch.includes("organism") && ch.includes("population")) return REAL_IMAGES["Organisms & Populations"];
  if (ch.includes("ecosystem") || ch.includes("food chain") || ch.includes("food web")) return REAL_IMAGES["Ecosystem"];
  if (ch.includes("biodiversity") || ch.includes("conservation")) return REAL_IMAGES["Biodiversity"];

  // 3. SVG fallbacks for complex diagrams
  if (SVG_FALLBACKS[chapter]) return SVG_FALLBACKS[chapter];

  return null;
}