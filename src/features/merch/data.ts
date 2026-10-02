// Jude Safaris and Adventures - Executive Nganya & Safari Luxury Merch Catalog

export interface MerchProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceKES: number;
  priceUSD: number;
  category: "Apparel" | "Gear" | "Accessories" | "Collectibles";
  rating: number;
  reviewsCount: number;
  images: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
  featured?: boolean;
  badge?: string;
  details: string[];
}

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    id: "jude-nganya-bomber",
    name: "Executive Nganya VIP Bomber Jacket",
    tagline: "High-octane Nairobi street luxury meets rugged safari endurance",
    description:
      "Crafted with heavy-gauge water-repellent shell fabric, custom brass hardware, and gold metallic embroidery celebrating Kenya's legendary Nganya van culture. Lined with silky Kenyan Kikoy weave for temperature regulation on cool savannah dawns.",
    priceKES: 14500,
    priceUSD: 115,
    category: "Apparel",
    rating: 4.9,
    reviewsCount: 38,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Obsidian Gold", hex: "#121212" },
      { name: "Savannah Olive", hex: "#3b4d3c" },
    ],
    inStock: true,
    featured: true,
    badge: "Flagship Edition",
    details: [
      "High-density embroidery with Jude Safaris coat of arms",
      "Thermal Kikoy inner lining for 10°C to 28°C comfort",
      "Interior storm zip pocket for passport and phone",
      "Limited batch production — individually numbered labels",
    ],
  },
  {
    id: "jude-safari-duffel",
    name: "Savannah Waxed Canvas Expedition Duffel",
    tagline: "Hand-finished Kenyan leather with 55L load capacity",
    description:
      "Engineered to withstand the rugged dust of Samburu and the damp riverbanks of the Mara. Features heavy 18oz Scottish waxed cotton, veg-tanned Kenyan saddle leather straps, solid brass studs, and a dedicated ventilated footwear compartment.",
    priceKES: 18500,
    priceUSD: 145,
    category: "Gear",
    rating: 5.0,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
    ],
    colors: [
      { name: "Safari Ochre", hex: "#a45a2a" },
      { name: "Midnight Charcoal", hex: "#1c1d1f" },
    ],
    inStock: true,
    featured: true,
    badge: "Bestseller",
    details: [
      "Waterproof 18oz paraffin-waxed duck canvas",
      "Full-grain local leather handles tested to 45kg load",
      "TSA-compliant carry-on dimensions (55 x 30 x 28 cm)",
      "Brass luggage tag with customizable Jude laser engraving",
    ],
  },
  {
    id: "jude-thermal-tumbler",
    name: "Nganya Soundwave 750ml Vacuum Tumbler",
    tagline: "Keeps drinks ice-cold for 36 hrs or steaming for 16 hrs",
    description:
      "Double-walled pro-grade 18/8 stainless steel flask finished in matte textured powder coat. Laser-etched with the iconic Jude Nganya frequency soundwave pattern and Kenyan shield. Ergonomic handle and leakproof magnetic lid.",
    priceKES: 4500,
    priceUSD: 35,
    category: "Accessories",
    rating: 4.8,
    reviewsCount: 64,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    ],
    colors: [
      { name: "Matte Obsidian", hex: "#171717" },
      { name: "Sunset Copper", hex: "#b45309" },
      { name: "Mara Emerald", hex: "#065f46" },
    ],
    inStock: true,
    featured: true,
    badge: "Essential",
    details: [
      "TempLock™ triple-layer vacuum insulation",
      "Cup-holder friendly base designed for executive van consoles",
      "BPA-free tritan spout with spill-lock lever",
      "Dishwasher safe textured exterior",
    ],
  },
  {
    id: "jude-vintage-tour-tee",
    name: "Nairobi to Mara Heavyweight Tour Tee",
    tagline: "240 GSM organic cotton with vintage halftone van graphic",
    description:
      "A tribute to the thrilling highway sprint from Nairobi's neon cityscape down through the Great Rift Valley escarpment into the open Mara. Boxy streetwear fit, drop shoulders, and soft garment-dyed finish.",
    priceKES: 3800,
    priceUSD: 30,
    category: "Apparel",
    rating: 4.7,
    reviewsCount: 29,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Vintage Bone", hex: "#e5e0d8" },
      { name: "Pitch Black", hex: "#111111" },
    ],
    inStock: true,
    featured: false,
    details: [
      "100% GOTS certified carded cotton",
      "Pre-shrunk vintage wash with distressed collar ribbing",
      "Water-based discharge screenprint that breathes",
      "Designed in Nairobi by indigenous graphic artists",
    ],
  },
  {
    id: "jude-kikoy-bucket-hat",
    name: "Rift Valley Kikoy-Lined Safari Bucket Hat",
    tagline: "UPF 50+ sun defense with authentic Swahili coastal weave",
    description:
      "Engineered for open-roof game drives under the equatorial sun. Wide protective brim with memory wire shape-retention, brass ventilation grommets, and an adjustable chin cord with wooden bead toggle.",
    priceKES: 3200,
    priceUSD: 25,
    category: "Accessories",
    rating: 4.9,
    reviewsCount: 51,
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["M (57cm)", "L (59cm)", "XL (61cm)"],
    colors: [
      { name: "Dune Sand", hex: "#d4b996" },
      { name: "Forest Moss", hex: "#2e3b2e" },
    ],
    inStock: true,
    featured: false,
    details: [
      "UPF 50+ UV protective ripstop cotton",
      "Moisture-wicking internal sweatband",
      "Concealed hidden crown pocket for cash / memory cards",
      "Foldable and packable into duffel pocket",
    ],
  },
  {
    id: "jude-samburu-keyfob",
    name: "Samburu Artisan Beaded Titanium Key Fob",
    tagline: "Handcrafted in Samburu County supporting maternal health",
    description:
      "Every single fob is individually hand-beaded by women artisans from the Samburu Wildlife Conservancies using traditional geometric clan motifs. Joined to an aerospace-grade matte grey titanium carabiner.",
    priceKES: 1800,
    priceUSD: 15,
    category: "Collectibles",
    rating: 5.0,
    reviewsCount: 88,
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
    ],
    colors: [
      { name: "Fire & Earth", hex: "#b91c1c" },
      { name: "Savannah Sky", hex: "#0284c7" },
    ],
    inStock: true,
    featured: false,
    badge: "Direct Impact",
    details: [
      "100% of beadwork profits returned to Samburu artisan cooperatives",
      "Authentic glass micro-beads on heavy nylon sinew",
      "Grade 5 titanium spring snap gate",
      "Includes engraved authenticity certificate card",
    ],
  },
  {
    id: "jude-bass-dust-hoodie",
    name: "'Bass & Dust' Luxury Heavyweight Hoodie",
    tagline: "460 GSM brushed French terry for chilly crater mornings",
    description:
      "Dedicated to our legendary sound-engineered safari vans roaring across the savannah. Heavyweight loopback fleece, double-layered hood without drawstrings for clean aesthetic, and high-density screenprint on back.",
    priceKES: 8900,
    priceUSD: 70,
    category: "Apparel",
    rating: 4.8,
    reviewsCount: 22,
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Deep Savannah Green", hex: "#16382b" },
      { name: "Charcoal Ash", hex: "#22252a" },
    ],
    inStock: true,
    featured: false,
    details: [
      "460 GSM heavyweight French terry cotton",
      "Ribbed side panels for unrestricted motion",
      "Embossed Jude crest on left wrist",
      "Reinforced pouch pocket with hidden zip compartment",
    ],
  },
];

export const MERCH_CATEGORIES = ["All", "Apparel", "Gear", "Accessories", "Collectibles"] as const;