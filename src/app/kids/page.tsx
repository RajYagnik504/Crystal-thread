'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomCursor from '@/components/ui/CustomCursor';
import Container from '@/components/layout/Container';
import { getModelImage, formatPrice, getPricingMeta } from '@/lib/utils';
import products from '@/data/products.json';

const AGE_GROUPS = ['All', '2-4', '5-8', '9-12'];

export default function KidsPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeAge, setActiveAge] = useState('All');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const filtered = activeAge === 'All'
    ? products.kids
    : products.kids.filter((p) => p.ageGroup === activeAge);

  return (
    <>
      <CustomCursor />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pb-24 bg-[#070709] text-white min-h-screen" style={{ paddingTop: '160px' }}>
        {/* Header */}
        <Container className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC] animate-pulse" />
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#BFD3E6]">
              ✦ Kids&rsquo; Collection
            </p>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-[1.08] tracking-tight uppercase">
            Made For Play.<br />
            <span className="text-[#7DD3FC]">Built To Last.</span>
          </h1>
          <p className="font-sans text-zinc-300 max-w-[520px] leading-relaxed text-[14px] sm:text-[15px]">
            100% GOTS organic cotton, pre-shrunk, tag-free at the collar,
            and reinforced with smooth flat seams that never scratch sensitive skin.
          </p>
        </Container>

        {/* Comfort highlights */}
        <Container className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111116] p-4 sm:p-6 border border-white/10 rounded-xs shadow-md">
            {[
              { label: 'GOTS Organic', detail: 'Certified pure cotton' },
              { label: 'Tag-free Collar', detail: 'Zero skin scratching' },
              { label: 'Flat French Seams', detail: 'Anti-chafe construction' },
              { label: 'Grow-With-Me Hems', detail: 'Extendable length' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-white">{item.label}</span>
                <span className="text-[11px] text-zinc-400 mt-0.5">{item.detail}</span>
              </div>
            ))}
          </div>
        </Container>

        {/* Age Group filter pills */}
        <Container className="mb-10">
          <div className="flex overflow-x-auto scrollbar-none gap-2 pb-1.5 flex-nowrap">
            {AGE_GROUPS.map((age) => (
              <button
                key={age}
                onClick={() => setActiveAge(age)}
                className={`text-[11px] tracking-[0.16em] uppercase px-4 py-2 border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeAge === age
                    ? 'border-white bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                    : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {age === 'All' ? 'All Kids' : `Ages ${age} Yrs`}
              </button>
            ))}
          </div>
        </Container>

        {/* Product grid */}
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
            {filtered.map((product) => {
              const pricing = getPricingMeta(product.price);
              const isHovered = hoveredCardId === product.id;

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredCardId(product.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className="group bg-[#111116] border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-xs overflow-hidden"
                >
                  <div>
                    {/* Child Model Photo */}
                    <div className="relative aspect-[3/4] bg-[#16161C] overflow-hidden border-b border-white/[0.06]">
                      <img
                        src={getModelImage(product.id)}
                        alt={`${product.name} worn by child model`}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isHovered ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
                        }`}
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="px-2.5 py-0.5 bg-black/80 backdrop-blur-md text-[9px] font-semibold uppercase tracking-wider text-white border border-white/10 shadow-sm">
                          Ages {product.ageGroup} Yrs
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-600/90 text-white text-[9px] font-semibold uppercase tracking-wider shadow-sm">
                          {pricing.discountPercent}% OFF
                        </span>
                      </div>

                      {/* Child Fit Tag */}
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/10 backdrop-blur-md text-[9px] tracking-widest uppercase text-white font-medium border border-white/10">
                        Child Fit
                      </span>

                      {/* Quick AI Try-On Button Overlay */}
                      <Link
                        href={`/try-on?garment=${product.slug}`}
                        className="absolute bottom-3 inset-x-3 py-2.5 bg-black/85 hover:bg-white hover:text-black text-white backdrop-blur-md text-[10px] font-semibold tracking-[0.18em] uppercase text-center transition-all shadow-lg flex items-center justify-center gap-1.5 border border-white/20"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-ping" />
                        <span>AI Virtual Try-On ✦</span>
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1.5 text-[11px] mb-1.5">
                        <span className="text-amber-400">★★★★★</span>
                        <span className="font-semibold text-white text-[11px]">4.9</span>
                        <span className="text-zinc-500 text-[10px]">(80+ parents)</span>
                      </div>

                      <h3 className="text-[14px] font-normal text-white mb-1 group-hover:text-[#BFD3E6] transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-zinc-400 line-clamp-1 mb-3">
                        {product.fabric}
                      </p>

                      {/* Pricing Row */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-[12px] text-zinc-500 line-through">
                          {formatPrice(pricing.mrp)}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400">
                          {pricing.discountPercent}% OFF
                        </span>
                      </div>

                      {/* Size Selector Strip */}
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/[0.06]">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 mr-1">Sizes:</span>
                        {product.sizes.map((sz) => (
                          <span
                            key={sz}
                            className="text-[10px] px-1.5 py-0.5 border border-white/10 text-zinc-300 font-mono hover:border-white hover:text-white transition-colors cursor-pointer"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Direct Action */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => setCartOpen(true)}
                      className="w-full py-2.5 bg-white/[0.04] hover:bg-white hover:text-black text-zinc-300 hover:font-bold text-[10px] font-semibold tracking-[0.18em] uppercase border border-white/10 hover:border-white transition-all cursor-pointer"
                    >
                      Add To Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
