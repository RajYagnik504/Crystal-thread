'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomCursor from '@/components/ui/CustomCursor';
import Container from '@/components/layout/Container';

export default function CartPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <CustomCursor />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-32 md:pt-40 pb-24 bg-[#070709] text-white min-h-screen">
        <Container>
          <div className="max-w-[800px]">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#BFD3E6] font-semibold mb-3">
              Shopping Bag
            </p>
            <h1 className="text-display text-[clamp(2.4rem,4.5vw,3.8rem)] mb-10 text-white font-light tracking-tight">
              Your Atelier Bag
            </h1>

            <div className="hairline mb-12" />

            {/* Empty state */}
            <div className="text-center py-20 bg-[#101015] border border-white/10 rounded-xs shadow-xl p-8">
              <p className="text-display text-[clamp(1.5rem,3vw,2.2rem)] text-zinc-500 mb-4 font-light">
                Your bag is currently empty.
              </p>
              <p className="text-body text-zinc-400 mb-10 max-w-[360px] mx-auto font-sans">
                Browse our collections or experience how European linen and Supima cotton drape on your silhouette in our AI Fitting Room.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/men"
                  className="px-6 py-3 bg-white text-black text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-[#BFD3E6] transition-all shadow-md"
                >
                  <span>Shop Men</span>
                </Link>
                <Link
                  href="/kids"
                  className="px-6 py-3 bg-white text-black text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-[#BFD3E6] transition-all shadow-md"
                >
                  <span>Shop Kids</span>
                </Link>
                <Link
                  href="/try-on"
                  className="px-6 py-3 bg-white/[0.06] border border-[#BFD3E6]/60 text-white text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-[#BFD3E6] hover:text-black transition-all"
                >
                  <span>Virtual Try-On ✦</span>
                </Link>
              </div>
            </div>

            <div className="hairline mt-12" />

            {/* Order summary / policies */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-caption text-zinc-400 mb-2 tracking-[0.2em]">Complimentary Delivery</p>
                <p className="text-[13px] text-zinc-400 leading-relaxed font-sans">
                  Free express shipping across India on all orders. Each garment arrives folded in breathable atelier muslin bags.
                </p>
              </div>
              <div>
                <p className="text-caption text-zinc-400 mb-2 tracking-[0.2em]">14-Day Complimentary Exchange</p>
                <p className="text-[13px] text-zinc-400 leading-relaxed font-sans">
                  Complimentary home pickup for fit exchanges and returns. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
