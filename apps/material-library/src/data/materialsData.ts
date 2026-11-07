export interface MaterialDef {
  id: string;
  name: string;
  category: 'Metals' | 'Fabrics' | 'Gemstones & Glass' | 'Car Paint & Finishes' | 'Plastics & Ceramics';
  description: string;
  color: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  ior?: number;
  sheen?: number;
  sheenColor?: string;
  sheenRoughness?: number;
  attenuationColor?: string;
  attenuationDistance?: number;
  normalMapUrl?: string;
  normalStrength?: number;
  normalRepeat?: [number, number];
  diffuseMapUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
}

export const CATEGORIES = [
  'All',
  'Metals',
  'Fabrics',
  'Gemstones & Glass',
  'Car Paint & Finishes',
  'Plastics & Ceramics'
] as const;

export const MATERIALS_LIBRARY: MaterialDef[] = [
  // ================= METALS =================
  {
    id: 'metal-gold-24k',
    name: '24K Pure Gold',
    category: 'Metals',
    description: 'Ultra-luxurious pure bullion gold with mirror-like specular highlights.',
    color: '#FFD700',
    roughness: 0.12,
    metalness: 1.0,
    tags: ['luxury', 'yellow gold', 'precious', 'jewelry']
  },
  {
    id: 'metal-rose-gold',
    name: '18K Rose Gold',
    category: 'Metals',
    description: 'Warm, pink-tinged alloy with rich copper undertones and high reflectivity.',
    color: '#B76E79',
    roughness: 0.18,
    metalness: 0.95,
    tags: ['jewelry', 'copper alloy', 'luxury', 'rose']
  },
  {
    id: 'metal-platinum',
    name: 'Polished Platinum',
    category: 'Metals',
    description: 'Dense, brilliant cool-white precious metal with crisp environment reflections.',
    color: '#E5E4E2',
    roughness: 0.08,
    metalness: 0.98,
    tags: ['precious', 'white metal', 'high-end', 'jewelry']
  },
  {
    id: 'metal-chrome',
    name: 'Polished Chrome',
    category: 'Metals',
    description: 'Flawless optical mirror chrome finish reflecting complete surroundings.',
    color: '#F4F5F7',
    roughness: 0.04,
    metalness: 1.0,
    tags: ['automotive', 'mirror', 'industrial', 'chrome']
  },
  {
    id: 'metal-brushed-aluminum',
    name: 'Brushed Aluminum',
    category: 'Metals',
    description: 'Modern consumer electronic matte aluminum with anisotropic diffusion.',
    color: '#D1D5DB',
    roughness: 0.42,
    metalness: 0.88,
    tags: ['tech', 'anodized', 'silver', 'matte']
  },
  {
    id: 'metal-titanium-burnt',
    name: 'Burnt Anodized Titanium',
    category: 'Metals',
    description: 'High-performance heat-treated aerospace titanium with iridescent blue/purple sheen.',
    color: '#6366F1',
    roughness: 0.25,
    metalness: 0.95,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    tags: ['aerospace', 'heat-treated', 'iridescent', 'racing']
  },
  {
    id: 'metal-brass',
    name: 'Brushed Brass',
    category: 'Metals',
    description: 'Classic architectural satin brass with subtle micro-grain warmth.',
    color: '#D4AF37',
    roughness: 0.35,
    metalness: 0.92,
    tags: ['interior', 'vintage', 'warm', 'hardware']
  },
  {
    id: 'metal-copper-hammered',
    name: 'Hammered Copper',
    category: 'Metals',
    description: 'Radiant reddish-orange copper with organic surface character.',
    color: '#C86D51',
    roughness: 0.28,
    metalness: 0.94,
    tags: ['craft', 'warm', 'orange', 'cookware']
  },
  {
    id: 'metal-gunmetal',
    name: 'Stealth Gunmetal',
    category: 'Metals',
    description: 'Deep tungsten-grey metallic finish used in tactical and horology designs.',
    color: '#374151',
    roughness: 0.22,
    metalness: 0.92,
    tags: ['stealth', 'dark', 'tactical', 'watches']
  },
  {
    id: 'metal-bronze-antique',
    name: 'Antique Bronze',
    category: 'Metals',
    description: 'Weathered sculptural bronze with aged patina and deep reflections.',
    color: '#6E4720',
    roughness: 0.55,
    metalness: 0.82,
    tags: ['sculpture', 'vintage', 'patina', 'classic']
  },

  // ================= FABRICS & LEATHERS (Curated PBR) =================
  {
    id: 'fabric-denim-cowboy',
    name: 'Heavy Twill Cowboy Denim',
    category: 'Fabrics',
    description: '5.2oz rugged indigo denim with distinct diagonal twill weave and micro-fuzz.',
    color: '#2B4162',
    roughness: 0.85,
    metalness: 0.0,
    sheen: 0.6,
    sheenColor: '#4A6984',
    sheenRoughness: 0.5,
    normalMapUrl: '/fabric_library/curated_normals/02_Cowboy_10_3h4zmw_normal.jpg',
    thumbnailUrl: '/fabric_library/curated_thumbnails/02_Cowboy_10_3h4zmw_thumb.png',
    diffuseMapUrl: '/fabric_library/curated_textures/02_Cowboy_10_baseColor.jpg',
    normalStrength: 0.75,
    normalRepeat: [12, 12],
    tags: ['denim', 'cotton', 'twill', 'indigo', 'apparel']
  },
  {
    id: 'fabric-merino-wool',
    name: 'Merino Wool Knit',
    category: 'Fabrics',
    description: 'Soft brushed knit wool with pronounced sheen rim highlights and diffuse body.',
    color: '#E5E7EB',
    roughness: 0.92,
    metalness: 0.0,
    sheen: 0.9,
    sheenColor: '#FFFFFF',
    sheenRoughness: 0.6,
    normalMapUrl: '/fabric_library/curated_normals/01_Blended_fabric_3_0rmynp_normal.jpg',
    thumbnailUrl: '/fabric_library/curated_thumbnails/01_Blended_fabric_3_0rmynp_thumb.png',
    diffuseMapUrl: '/fabric_library/curated_textures/01_Blended_fabric_3_baseColor.jpg',
    normalStrength: 0.65,
    normalRepeat: [10, 10],
    tags: ['wool', 'knit', 'winter', 'soft', 'cozy']
  },
  {
    id: 'fabric-italian-leather',
    name: 'Full-Grain Italian Leather',
    category: 'Fabrics',
    description: 'Supple aniline dyed calfskin with authentic pebble grain and natural luster.',
    color: '#4A2810',
    roughness: 0.48,
    metalness: 0.05,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35,
    normalMapUrl: '/fabric_library/normals/Leather_material_10_m4ksjr_normal.jpg',
    thumbnailUrl: '/fabric_library/thumbnails/Leather_material_10_m4ksjr_thumb.png',
    normalStrength: 0.8,
    normalRepeat: [14, 14],
    tags: ['leather', 'upholstery', 'luxury', 'bags', 'shoes']
  },
  {
    id: 'fabric-black-perforated-leather',
    name: 'Perforated Sport Leather',
    category: 'Fabrics',
    description: 'Automotive grade perforated black leather with breathable micro-dots.',
    color: '#18181B',
    roughness: 0.52,
    metalness: 0.08,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3,
    normalMapUrl: '/fabric_library/normals/Leather_material_2_g6327z_normal.jpg',
    thumbnailUrl: '/fabric_library/thumbnails/Leather_material_2_g6327z_thumb.png',
    normalStrength: 0.9,
    normalRepeat: [16, 16],
    tags: ['automotive', 'sports', 'black leather', 'steering']
  },
  {
    id: 'fabric-silk-satin',
    name: 'Crimson Silk Satin',
    category: 'Fabrics',
    description: 'High-thread count mulberry silk with liquid anisotropic sheen and draped reflections.',
    color: '#991B1B',
    roughness: 0.28,
    metalness: 0.1,
    sheen: 1.0,
    sheenColor: '#DC2626',
    sheenRoughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    tags: ['silk', 'satin', 'crimson', 'luxurious', 'couture']
  },
  {
    id: 'fabric-athletic-mesh',
    name: 'High-Tech Athletic Mesh',
    category: 'Fabrics',
    description: 'Engineered breathable honeycomb mesh designed for performance running gear.',
    color: '#06B6D4',
    roughness: 0.72,
    metalness: 0.0,
    sheen: 0.45,
    sheenColor: '#67E8F9',
    sheenRoughness: 0.4,
    normalRepeat: [20, 20],
    tags: ['sportswear', 'mesh', 'cyan', 'athletic', 'sneakers']
  },
  {
    id: 'fabric-royal-velvet',
    name: 'Midnight Royal Velvet',
    category: 'Fabrics',
    description: 'Deep pile velour with dramatic grazing angle sheen and rich dark core.',
    color: '#1E1B4B',
    roughness: 0.9,
    metalness: 0.0,
    sheen: 1.0,
    sheenColor: '#818CF8',
    sheenRoughness: 0.3,
    tags: ['velvet', 'royal', 'theater', 'drapes', 'indigo']
  },

  // ================= GEMSTONES & GLASS =================
  {
    id: 'gem-diamond-pure',
    name: 'VVS1 Brilliant Diamond',
    category: 'Gemstones & Glass',
    description: 'Flawless optical diamond refractive dispersion with IOR 2.42 and total internal reflection.',
    color: '#FFFFFF',
    roughness: 0.0,
    metalness: 0.0,
    transmission: 0.98,
    ior: 2.417,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    attenuationColor: '#F0F9FF',
    attenuationDistance: 1.2,
    tags: ['diamond', 'dispersion', 'brilliant', 'gemstone', 'jewelry']
  },
  {
    id: 'gem-ruby-pigeon-blood',
    name: "Pigeon Blood Ruby",
    category: 'Gemstones & Glass',
    description: 'Intense crimson red corundum gemstone with internal fluorescence and high refractive index.',
    color: '#9F1239',
    roughness: 0.02,
    metalness: 0.0,
    transmission: 0.92,
    ior: 1.77,
    attenuationColor: '#881337',
    attenuationDistance: 0.8,
    clearcoat: 1.0,
    tags: ['ruby', 'corundum', 'crimson', 'gem', 'precious']
  },
  {
    id: 'gem-colombian-emerald',
    name: 'Colombian Emerald',
    category: 'Gemstones & Glass',
    description: 'Vivid green beryl crystal with glowing internal clarity and subtle silk inclusions.',
    color: '#065F46',
    roughness: 0.03,
    metalness: 0.0,
    transmission: 0.90,
    ior: 1.58,
    attenuationColor: '#047857',
    attenuationDistance: 0.7,
    clearcoat: 1.0,
    tags: ['emerald', 'green', 'beryl', 'gemstone']
  },
  {
    id: 'gem-sapphire-kashmir',
    name: 'Kashmir Royal Sapphire',
    category: 'Gemstones & Glass',
    description: 'Velvety cornflower blue sapphire with deep saturation and brilliant facets.',
    color: '#1E3A8A',
    roughness: 0.02,
    metalness: 0.0,
    transmission: 0.94,
    ior: 1.76,
    attenuationColor: '#1D4ED8',
    attenuationDistance: 0.8,
    clearcoat: 1.0,
    tags: ['sapphire', 'blue', 'corundum', 'gemstone']
  },
  {
    id: 'glass-frosted-architectural',
    name: 'Frosted Architectural Glass',
    category: 'Gemstones & Glass',
    description: 'Sandblasted translucency diffusing background light with soft satin glow.',
    color: '#E0F2FE',
    roughness: 0.45,
    metalness: 0.0,
    transmission: 0.88,
    ior: 1.52,
    attenuationDistance: 1.5,
    tags: ['glass', 'frosted', 'diffuse', 'interior', 'privacy']
  },
  {
    id: 'glass-tinted-smoke',
    name: 'Tinted Smoke Glass',
    category: 'Gemstones & Glass',
    description: 'Sophisticated architectural grey tinted glass with crisp exterior reflections.',
    color: '#27272A',
    roughness: 0.05,
    metalness: 0.0,
    transmission: 0.75,
    ior: 1.54,
    clearcoat: 1.0,
    attenuationColor: '#18181B',
    attenuationDistance: 0.9,
    tags: ['smoke', 'tinted', 'modern', 'architecture']
  },
  {
    id: 'stone-black-obsidian',
    name: 'Mirror Obsidian Glass',
    category: 'Gemstones & Glass',
    description: 'Natural volcanic vitreous rock with glass luster and razor-sharp reflections.',
    color: '#09090B',
    roughness: 0.06,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    tags: ['volcanic', 'obsidian', 'black glass', 'sharp']
  },

  // ================= CAR PAINT & FINISHES =================
  {
    id: 'car-rosso-corsa-clearcoat',
    name: 'Rosso Corsa Multi-Coat',
    category: 'Car Paint & Finishes',
    description: 'Iconic Italian supercar red featuring an ultra-gloss dual clearcoat glaze over metallic flake.',
    color: '#DC2626',
    roughness: 0.15,
    metalness: 0.70,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    tags: ['automotive', 'ferrari', 'supercar', 'glossy', 'red']
  },
  {
    id: 'car-british-racing-green',
    name: 'British Racing Green Pearl',
    category: 'Car Paint & Finishes',
    description: 'Heritage motorsport deep forest green with golden mica pearl highlights.',
    color: '#064E3B',
    roughness: 0.22,
    metalness: 0.78,
    clearcoat: 0.95,
    clearcoatRoughness: 0.05,
    tags: ['racing', 'green', 'heritage', 'pearl', 'metallic']
  },
  {
    id: 'car-carbon-fiber-gloss',
    name: '2x2 Twill Carbon Fiber',
    category: 'Car Paint & Finishes',
    description: 'Motorsport composite carbon weave submerged beneath an optical resin clearcoat.',
    color: '#1C1917',
    roughness: 0.35,
    metalness: 0.3,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    normalRepeat: [18, 18],
    tags: ['carbon fiber', 'motorsport', 'supercar', 'composite']
  },
  {
    id: 'car-matte-frozen-grey',
    name: 'Frozen Matte Gunmetal',
    category: 'Car Paint & Finishes',
    description: 'Factory satin-matte finish diffusing specular reflections for a stealth aesthetic.',
    color: '#4B5563',
    roughness: 0.58,
    metalness: 0.65,
    clearcoat: 0.15,
    clearcoatRoughness: 0.5,
    tags: ['matte', 'frozen', 'stealth', 'bmw', 'automotive']
  },
  {
    id: 'car-electric-cyber-blue',
    name: 'Electric Ion Blue Metallic',
    category: 'Car Paint & Finishes',
    description: 'High-contrast cyan-blue flake finish with radiant specular hot spots.',
    color: '#0284C7',
    roughness: 0.18,
    metalness: 0.82,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    tags: ['electric', 'ev', 'cyan', 'metallic', 'modern']
  },

  // ================= PLASTICS & CERAMICS =================
  {
    id: 'plastic-white-porcelain',
    name: 'Glossy White Porcelain',
    category: 'Plastics & Ceramics',
    description: 'Vitreous fired ceramic with smooth glaze, high subsurface brightness and soft falloff.',
    color: '#FAFAFA',
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.05,
    tags: ['ceramic', 'porcelain', 'white', 'clean', 'interior']
  },
  {
    id: 'plastic-matte-soft-touch',
    name: 'Soft-Touch Black Polymer',
    category: 'Plastics & Ceramics',
    description: 'Velvety matte rubberized plastic coating common on premium consumer hardware.',
    color: '#1E293B',
    roughness: 0.75,
    metalness: 0.02,
    sheen: 0.3,
    sheenRoughness: 0.7,
    tags: ['matte', 'gadget', 'rubber', 'ergonomic', 'polymer']
  },
  {
    id: 'stone-emerald-jade',
    name: 'Imperial Translucent Jade',
    category: 'Plastics & Ceramics',
    description: 'Polished gemstone nephrite with waxy sheen and subsurface green glow.',
    color: '#10B981',
    roughness: 0.22,
    metalness: 0.05,
    transmission: 0.35,
    ior: 1.61,
    attenuationColor: '#059669',
    attenuationDistance: 1.1,
    clearcoat: 0.6,
    tags: ['jade', 'mineral', 'stone', 'asian', 'waxy']
  },
  {
    id: 'stone-carrara-marble',
    name: 'Carrara Statuario Marble',
    category: 'Plastics & Ceramics',
    description: 'Polished Italian architectural marble with milky depth and soft reflectivity.',
    color: '#F8FAFC',
    roughness: 0.24,
    metalness: 0.05,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    tags: ['marble', 'stone', 'luxury', 'architecture', 'white']
  }
];
