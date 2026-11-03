'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';

interface TryOnPiece {
  id: string;
  name: string;
  category: string;
  price: number;
  slug: string;
  beforeImg: string;
  afterImg: string;
  fabric: string;
}

const TRYON_PIECES: TryOnPiece[] = [
  {
    id: 'men-linen-shirt',
    name: 'Riviera Linen Shirt',
    category: 'Men’s Atelier',
    price: 3490,
    slug: 'men-linen-shirt',
    beforeImg: '/images/model-men-before.jpg',
    afterImg: '/images/model-men-linen-shirt.jpg',
    fabric: '100% European Flax Linen',
  },
  {
    id: 'female-linen-shirt',
    name: 'Riviera Women’s Fit',
    category: 'Women’s Atelier',
    price: 3490,
    slug: 'men-linen-shirt',
    beforeImg: '/images/model-female-before.jpg',
    afterImg: '/images/model-female-linen-shirt.jpg',
    fabric: '100% European Flax Linen',
  },
  {
    id: 'men-linen-kurta',
    name: 'Jaipur Linen Kurta',
    category: 'Men’s Atelier',
    price: 2990,
    slug: 'men-linen-kurta',
    beforeImg: '/images/model-men-before.jpg',
    afterImg: '/images/model-men-linen-kurta.jpg',
    fabric: '100% Handloom Linen',
  },
];

export default function HomeTryOnSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);

  const piece = TRYON_PIECES[selectedIdx];

  const handlePointerMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <section id="home-tryon" className="bg-[#0A0A0E] py-24 md:py-36 border-y border-white/[0.08] relative overflow-hidden">
      {/* Background ambient crystal glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#BFD3E6]/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── Left Column: Editorial Copy & High-Fashion Shopping Highlights ── */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/[0.06] border border-white/15 rounded-full shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC] animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-[0.24em] uppercase text-[#BFD3E6]">
                ✦ ATELIER TRIAL ROOM
              </span>
            </div>

            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-[1.08] tracking-tight uppercase">
                See How It Drapes.<br />
                <span className="text-[#7DD3FC]">Before You Decide.</span>
              </h2>
              <p className="mt-4 text-[14px] md:text-[15px] text-zinc-300 leading-relaxed font-sans font-normal max-w-xl">
                Experience natural linen rolls, true collar stiffness, and relaxed shoulder drape on our studio models or atelier mannequins before ordering.
              </p>
            </div>

            {/* High-Fashion Highlights */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl hover:border-white/20 transition-all">
                <span className="text-[#7DD3FC] text-sm mt-0.5 font-bold">◈</span>
                <div>
                  <p className="text-[12px] font-bold text-white tracking-wider uppercase font-sans">
                    Zero Guesswork Fit
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-sans leading-normal">
                    Collar width, chest ease, and sleeve drop calibrated to real human anatomy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl hover:border-white/20 transition-all">
                <span className="text-[#7DD3FC] text-sm mt-0.5 font-bold">◈</span>
                <div>
                  <p className="text-[12px] font-bold text-white tracking-wider uppercase font-sans">
                    Pure European Linen &amp; Supima
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-sans leading-normal">
                    Inspect realistic daylight reflections, textile weave, and natural fabric fall.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl hover:border-white/20 transition-all">
                <span className="text-[#7DD3FC] text-sm mt-0.5 font-bold">◈</span>
                <div>
                  <p className="text-[12px] font-bold text-white tracking-wider uppercase font-sans">
                    Atelier Models &amp; Dummies
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-sans leading-normal">
                    Switch seamlessly between male, female, and mannequin silhouettes with one tap.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs with prominent luxury pill styling */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                href={`/try-on?garment=${piece.slug}&step=3`}
                className="px-8 py-4 bg-white text-black text-xs font-extrabold tracking-[0.2em] uppercase rounded-full hover:bg-[#7DD3FC] hover:shadow-[0_0_25px_rgba(125,211,252,0.45)] transition-all flex items-center gap-2 group shadow-lg"
              >
                <span>Launch Trial Room</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/try-on"
                className="px-7 py-4 bg-white/[0.06] hover:bg-white/15 text-white border border-white/20 text-xs font-bold tracking-[0.16em] uppercase rounded-full transition-all"
              >
                Choose Model / Dummy ✦
              </Link>
            </div>
          </div>

          {/* ── Right Column: Interactive Before/After Crystal Thread Slider ── */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Garment Switcher Strip above slider */}
            <div className="w-full max-w-[560px] mb-4 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1">
              <div className="flex gap-2 flex-nowrap">
                {TRYON_PIECES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`text-[11px] tracking-wider uppercase px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap font-bold ${
                      selectedIdx === idx
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.35)]'
                        : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7DD3FC] hidden sm:inline whitespace-nowrap">
                ✦ Live AI Drape
              </span>
            </div>

            {/* Interactive Slider Container */}
            <div
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={(e) => {
                if (isDragging) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  handlePointerMove(e.clientX, rect);
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  handlePointerMove(e.touches[0].clientX, rect);
                }
              }}
              className="relative w-full max-w-[560px] aspect-[3/4] bg-[#141418] border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden select-none cursor-ew-resize group rounded-2xl"
            >
              {/* After Layer (Full Width Background: Tailored Garment) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={piece.afterImg}
                  alt="Tailored model drape"
                  className="w-full h-full object-cover object-top"
                />
                {/* Floating "After" Label */}
                <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md border border-white/15 text-white px-3.5 py-1.5 rounded-full text-[9px] font-bold tracking-[0.18em] uppercase shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-pulse" />
                  <span>Tailored Drape</span>
                </div>
              </div>

              {/* Before Layer (Clipped to slider position: Base Silhouette) */}
              <div
                className="absolute inset-0 h-full overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="relative w-full h-full" style={{ width: '560px' }}>
                  <img
                    src={piece.beforeImg}
                    alt="Natural model silhouette before try-on"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle crystal stitch guide contour */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <path
                      d="M 190 140 Q 280 180, 370 140 L 370 420 L 190 420 Z"
                      fill="none"
                      stroke="#BFD3E6"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  </svg>
                  {/* Floating "Before" Label */}
                  <div className="absolute top-4 left-4 bg-[#070709]/85 text-zinc-300 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-[9px] font-bold tracking-[0.18em] uppercase shadow-md">
                    Base Model
                  </div>
                </div>
              </div>

              {/* ── Draggable Luminous Crystal Thread Divider Line ── */}
              <div
                className="absolute inset-y-0 w-0.5 bg-[#BFD3E6] shadow-[0_0_15px_#BFD3E6] pointer-events-none z-20 flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                {/* Draggable Crystal Thread Knot Bead */}
                <div className="w-9 h-9 -ml-[18px] bg-[#070709] border-2 border-[#BFD3E6] rounded-full shadow-[0_0_15px_rgba(191,211,230,0.6)] flex items-center justify-center text-white text-[12px] pointer-events-auto cursor-ew-resize group-hover:scale-110 transition-transform">
                  <span className="text-[#BFD3E6] font-bold select-none">↔</span>
                </div>
              </div>

              {/* Bottom Info Strip inside the card */}
              <div className="absolute bottom-0 inset-x-0 bg-[#0B0B0F]/90 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#BFD3E6] font-semibold">
                    {piece.category} • {piece.fabric}
                  </p>
                  <p className="text-sm font-serif font-light text-white">
                    {piece.name} — ₹{piece.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <Link
                  href={`/try-on?garment=${piece.slug}&step=3`}
                  className="px-4 py-2 bg-white text-black text-[10px] tracking-wider uppercase font-extrabold rounded-full hover:bg-[#7DD3FC] transition-colors shadow-md"
                >
                  Try On Me ✦
                </Link>
              </div>
            </div>

            {/* Instruction footnote below slider */}
            <p className="mt-3 text-[11px] text-zinc-400 tracking-wider uppercase text-center flex items-center gap-1.5">
              <span>Drag the crystal thread left and right to inspect the tailored stitch line</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
