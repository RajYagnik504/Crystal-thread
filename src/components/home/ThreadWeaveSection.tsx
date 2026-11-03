'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';

interface WeaveGarment {
  id: string;
  name: string;
  category: string;
  price: number;
  slug: string;
  img: string;
  fabric: string;
  gsm: string;
  tag: string;
  accent: string;
}

interface WeaveCategory {
  id: 'kids' | 'women' | 'men';
  label: string;
  shortLabel: string;
  icon: string;
  subheading: string;
  fabricStory: string;
  garments: WeaveGarment[];
}

const WEAVE_CATEGORIES: WeaveCategory[] = [
  {
    id: 'kids',
    label: '01 / Kids Organic Wear',
    shortLabel: 'Kids Edit',
    icon: '🧒',
    subheading: 'Gentle on skin. 100% GOTS Certified Organic Cottons.',
    fabricStory: 'Hypoallergenic European weaves with zero scratchy tags and expandable hems.',
    garments: [
      {
        id: 'kids-cotton-frock',
        name: 'Petal Cotton Frock',
        category: 'Girls Dress',
        price: 1490,
        slug: 'kids-cotton-frock',
        img: '/images/model-kids-frock.jpg',
        fabric: '100% GOTS Organic Cotton',
        gsm: '140 gsm',
        tag: 'Skin-Friendly Soft Weave',
        accent: '#93C5FD',
      },
      {
        id: 'kids-hoodie',
        name: 'Cloud Organic Hoodie',
        category: 'Unisex Knit',
        price: 1790,
        slug: 'kids-hoodie',
        img: '/images/model-kids-hoodie.jpg',
        fabric: 'Brushed Organic French Terry',
        gsm: '280 gsm',
        tag: 'Cozy Thermal Airflow',
        accent: '#FDE68A',
      },
      {
        id: 'kids-shorts-set',
        name: 'Sky Linen Playsuit',
        category: 'Everyday Set',
        price: 1290,
        slug: 'kids-shorts-set',
        img: '/images/kids-shorts-set.jpg',
        fabric: '100% Breathable Poplin',
        gsm: '160 gsm',
        tag: 'Non-Chafing Flat Seams',
        accent: '#A7F3D0',
      },
    ],
  },
  {
    id: 'women',
    label: '02 / Women’s Atelier',
    shortLabel: 'Women’s Edit',
    icon: '👩',
    subheading: 'Weightless silhouettes. Pure French & Belgian Flax.',
    fabricStory: 'Pre-washed for instant softness. Naturally breathable with relaxed studio drape.',
    garments: [
      {
        id: 'women-linen-shirt',
        name: 'Riviera Linen Shirt',
        category: 'Relaxed Fit',
        price: 3490,
        slug: 'men-linen-shirt',
        img: '/images/model-female-linen-shirt.jpg',
        fabric: '100% Pure European Flax',
        gsm: '150 gsm',
        tag: 'Relaxed Shoulder Drop',
        accent: '#BFD3E6',
      },
      {
        id: 'women-linen-tunic',
        name: 'Oatmeal Linen Tunic',
        category: 'Studio Atelier',
        price: 3290,
        slug: 'men-linen-kurta',
        img: '/images/model-female-linen-tunic.jpg',
        fabric: 'Natural Unbleached Flax',
        gsm: '165 gsm',
        tag: 'Cooling Sun-Protection Weave',
        accent: '#FED7AA',
      },
      {
        id: 'women-mannequin-fit',
        name: 'Draped Linen Dress',
        category: 'Tailoring Form',
        price: 3890,
        slug: 'men-linen-shirt',
        img: '/images/dummy-female.jpg',
        fabric: 'Hand-Loomed Flax Weave',
        gsm: '175 gsm',
        tag: 'Tailored Waist Silhouette',
        accent: '#DDD6FE',
      },
    ],
  },
  {
    id: 'men',
    label: '03 / Men’s Tailoring',
    shortLabel: 'Men’s Edit',
    icon: '👨',
    subheading: 'Built for daily posture. Long-staple Supima & handloom linen.',
    fabricStory: 'Clean collar rolls and double-stitched durability for years of repeat wear.',
    garments: [
      {
        id: 'men-linen-shirt',
        name: 'Riviera Camp Shirt',
        category: 'Men’s Signature',
        price: 3490,
        slug: 'men-linen-shirt',
        img: '/images/model-men-linen-shirt.jpg',
        fabric: '100% Normandy Flax',
        gsm: '150 gsm',
        tag: 'Mother-of-Pearl Buttons',
        accent: '#BFD3E6',
      },
      {
        id: 'men-linen-kurta',
        name: 'Jaipur Handloom Kurta',
        category: 'Festive Everyday',
        price: 2990,
        slug: 'men-linen-kurta',
        img: '/images/model-men-linen-kurta.jpg',
        fabric: 'Handloom Slub Linen',
        gsm: '140 gsm',
        tag: 'Mandarin Collar Structure',
        accent: '#FDE047',
      },
      {
        id: 'men-bomber-jacket',
        name: 'Stone Linen Bomber',
        category: 'Light Outerwear',
        price: 5490,
        slug: 'men-bomber-jacket',
        img: '/images/model-men-bomber-jacket-aligned.jpg',
        fabric: 'Cotton-Linen Twill',
        gsm: '220 gsm',
        tag: 'Reinforced Metal YKK Zip',
        accent: '#94A3B8',
      },
    ],
  },
];

export default function ThreadWeaveSection({ onAddToCart }: { onAddToCart?: () => void }) {
  const [activeTab, setActiveTab] = useState<'kids' | 'women' | 'men'>('kids');
  const [threadOffset, setThreadOffset] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Smooth undulating crystal thread shimmer animation
  useEffect(() => {
    let animId: number;
    let t = 0;
    const animate = () => {
      t += 0.04;
      setThreadOffset(Math.sin(t) * 8);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const currentCategory = WEAVE_CATEGORIES.find((c) => c.id === activeTab) || WEAVE_CATEGORIES[0];

  return (
    <section
      ref={sectionRef}
      id="fabric-weave-story"
      className="relative bg-[#08080C] py-20 md:py-28 border-y border-white/[0.08] overflow-hidden"
    >
      {/* Background ambient thread glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#7DD3FC]/[0.025] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#BFD3E6]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <Container>
        {/* Header & Flow Story */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/[0.05] border border-white/15 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC] animate-ping" />
              <span className="text-[10px] font-extrabold tracking-[0.24em] uppercase text-[#BFD3E6]">
                ✦ The Weaving Thread • Kids → Women → Men
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-[1.08] tracking-tight uppercase">
              Woven From Honest Threads.<br />
              <span className="text-[#7DD3FC]">Crafted For Every Generation.</span>
            </h2>
            <p className="mt-3 text-[14px] text-zinc-300 max-w-xl font-sans">
              Follow the luminous crystal thread as it stitches through our organic children’s weaves, flowing into relaxed women’s linen drapes, and structured men’s tailoring.
            </p>
          </div>

          {/* Interactive Category Selector Pills */}
          <div className="flex items-center gap-2 bg-[#121218] p-1.5 border border-white/15 rounded-full shadow-xl overflow-x-auto scrollbar-none self-start lg:self-end">
            {WEAVE_CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-[1.02]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.shortLabel}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── INTERACTIVE CRYSTAL THREAD CONNECTING LINE ── */}
        <div className="relative mb-10 overflow-visible pointer-events-none">
          <svg
            className="w-full h-12 overflow-visible"
            viewBox="0 0 1200 48"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Luminous weaving thread wave */}
            <path
              d={`M 0 24 
                  C 200 ${24 + threadOffset * 1.5}, 400 ${24 - threadOffset * 1.5}, 600 24 
                  C 800 ${24 + threadOffset * 1.5}, 1000 ${24 - threadOffset * 1.5}, 1200 24`}
              stroke="#BFD3E6"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              className="thread-glow opacity-80"
            />
            {/* Thread Stitch Knot Markers at each card anchor */}
            <circle cx="200" cy="24" r="3.5" fill="#7DD3FC" className="shadow-[0_0_10px_#7DD3FC]" />
            <circle cx="600" cy="24" r="3.5" fill="#7DD3FC" className="shadow-[0_0_10px_#7DD3FC]" />
            <circle cx="1000" cy="24" r="3.5" fill="#7DD3FC" className="shadow-[0_0_10px_#7DD3FC]" />
          </svg>

          {/* Active Category Story Callout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 px-2 mt-1 gap-2">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-pulse" />
              <span>{currentCategory.subheading}</span>
            </span>
            <span className="text-[#BFD3E6] tracking-wide font-sans">
              {currentCategory.fabricStory}
            </span>
          </div>
        </div>

        {/* ── GARMENT SHOWCASE CARDS (Kids / Women / Men) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {currentCategory.garments.map((g, idx) => (
            <div
              key={g.id}
              className="group relative bg-[#111117] border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Garment Image Frame */}
              <div className="relative aspect-[3/4] w-full bg-[#16161E] overflow-hidden">
                <img
                  src={g.img}
                  alt={g.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Fabric Badge */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-white border border-white/15 shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.accent }} />
                  <span>{g.gsm}</span>
                </div>

                {/* Tag */}
                <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase font-semibold tracking-wider text-zinc-300 border border-white/10">
                  {g.tag}
                </div>

                {/* Quick Try-On Overlay button on hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                  <Link
                    href={`/try-on?garment=${g.slug}&step=3`}
                    className="w-full py-2.5 px-4 bg-white text-black hover:bg-[#7DD3FC] text-xs font-extrabold uppercase tracking-widest rounded-full transition-all text-center shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>Try In Trial Room</span>
                    <span>✦</span>
                  </Link>
                </div>
              </div>

              {/* Garment Details & Price */}
              <div className="p-5 flex flex-col justify-between flex-1 border-t border-white/10">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="uppercase tracking-widest">{g.category}</span>
                    <span className="text-[#BFD3E6] font-medium">{g.fabric}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-[#7DD3FC] transition-colors uppercase">
                    {g.name}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <p className="text-xl font-extrabold text-white">
                    ₹{g.price.toLocaleString('en-IN')}
                  </p>

                  <button
                    onClick={onAddToCart}
                    className="px-4 py-2 bg-white/[0.06] hover:bg-white hover:text-black text-white text-xs font-bold tracking-wider uppercase rounded-full border border-white/15 transition-all cursor-pointer"
                  >
                    Add To Bag +
                  </button>
                </div>
              </div>

              {/* Subtle top crystal stitch accent line */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#7DD3FC] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Bottom Weave Step Progression Indicator */}
        <div className="mt-12 p-4 bg-[#101015] border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#7DD3FC]">
              Collection Sequence:
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${activeTab === 'kids' ? 'text-white underline' : 'text-zinc-500'}`}>
                1. Kids Organic
              </span>
              <span className="text-zinc-600">→</span>
              <span className={`text-xs font-bold ${activeTab === 'women' ? 'text-white underline' : 'text-zinc-500'}`}>
                2. Women’s Atelier
              </span>
              <span className="text-zinc-600">→</span>
              <span className={`text-xs font-bold ${activeTab === 'men' ? 'text-white underline' : 'text-zinc-500'}`}>
                3. Men’s Tailoring
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === 'kids') setActiveTab('women');
                else if (activeTab === 'women') setActiveTab('men');
                else setActiveTab('kids');
              }}
              className="px-4 py-2 bg-white/[0.08] hover:bg-white text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded-full border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Next Weave</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
