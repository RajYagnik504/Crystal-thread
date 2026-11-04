'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomCursor from '@/components/ui/CustomCursor';
import IntroLoader from '@/components/ui/IntroLoader';
import Container, { Section } from '@/components/layout/Container';
import HomeTryOnSection from '@/components/home/HomeTryOnSection';
import ThreadWeaveSection from '@/components/home/ThreadWeaveSection';
import { getModelImage, formatPrice, getPricingMeta } from '@/lib/utils';
import products from '@/data/products.json';

const VirtualShowroom = dynamic(() => import('@/components/showroom/VirtualShowroom'), {
  ssr: false,
  loading: () => (
    <section className="w-full h-[90vh] min-h-[680px] bg-[#070709] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-[#7DD3FC] animate-ping" />
        <p className="text-[11px] tracking-[0.25em] uppercase text-zinc-400 font-medium">
          Entering 3D Crystal Atelier...
        </p>
      </div>
    </section>
  ),
});

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [kidsAgeFilter, setKidsAgeFilter] = useState<'All' | '2-4' | '5-8' | '9-12'>('All');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  const featuredMen = products.men.slice(0, 4);
  const filteredKids =
    kidsAgeFilter === 'All'
      ? products.kids.slice(0, 4)
      : products.kids.filter((k) => k.ageGroup === kidsAgeFilter).slice(0, 4);

  return (
    <>
      <CustomCursor />
      {!introComplete && <IntroLoader onComplete={handleIntroComplete} />}
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="overflow-x-hidden bg-[#070709] text-white">
        {/* ── 01. FULL INTERACTIVE 3D VIRTUAL SHOWROOM ── */}
        <VirtualShowroom onAddToCart={() => setCartOpen(true)} isIntroActive={!introComplete} />

        {/* ── 02. ANIMATED THREAD WEAVING COLLECTION (KIDS → WOMEN → MEN) ── */}
        <ThreadWeaveSection onAddToCart={() => setCartOpen(true)} />

        {/* ── 03. MEN'S SIGNATURES (AI MODELS WEARING CLOTHES) ── */}
        <Section id="men" className="bg-[#070709] py-20 md:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC] animate-pulse" />
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#BFD3E6]">
                  ✦ Men&rsquo;s Collection
                </p>
              </div>
              <h2 className="text-display text-[clamp(2.2rem,4.2vw,3.6rem)] text-white leading-tight tracking-tight font-extrabold">
                Built For Real Life
              </h2>
              <p className="text-zinc-400 font-sans max-w-[520px] mt-2 text-[14px]">
                Pure European linen, Supima cotton, and breathable kurtas tailored for all-day comfort.
              </p>
            </div>
            <Link
              href="/men"
              className="mt-4 sm:mt-0 text-[11px] tracking-[0.18em] uppercase font-bold text-zinc-300 hover:text-white transition-colors pb-1 border-b border-white/20 hover:border-white"
            >
              View All Men&rsquo;s Styles →
            </Link>
          </div>

          {/* Men's Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
            {featuredMen.map((product) => {
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
                    {/* Model Photo */}
                    <div className="relative aspect-[3/4] bg-[#16161C] overflow-hidden border-b border-white/[0.06]">
                      <img
                        src={getModelImage(product.id)}
                        alt={`${product.name} worn by model`}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isHovered ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
                        }`}
                        loading="lazy"
                      />

                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="px-2.5 py-0.5 bg-black/80 backdrop-blur-md text-[9px] font-semibold uppercase tracking-wider text-white border border-white/10 shadow-sm">
                          {product.category}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-600/90 text-white text-[9px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur-xs">
                          {pricing.discountPercent}% OFF
                        </span>
                      </div>

                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/10 backdrop-blur-md text-[9px] tracking-widest uppercase text-white font-medium border border-white/10">
                        Model Fit
                      </span>

                      <Link
                        href={`/try-on?garment=${product.slug}`}
                        className="absolute bottom-3 inset-x-3 py-2.5 bg-black/85 hover:bg-white hover:text-black text-white backdrop-blur-md text-[10px] font-semibold tracking-[0.18em] uppercase text-center transition-all shadow-lg flex items-center justify-center gap-1.5 border border-white/20"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-ping" />
                        <span>AI Virtual Try-On ✦</span>
                      </Link>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-[11px] mb-1.5">
                        <span className="text-amber-400">★★★★★</span>
                        <span className="font-semibold text-white text-[11px]">4.9</span>
                        <span className="text-zinc-500 text-[10px]">(140+ reviews)</span>
                      </div>

                      <h3 className="text-[14px] font-normal text-white mb-1 group-hover:text-[#BFD3E6] transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-zinc-400 line-clamp-1 mb-3">
                        {product.fabric}
                      </p>

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
        </Section>

        {/* ── 04. INTERACTIVE BEFORE/AFTER AI TRY-ON SHOWCASE ── */}
        <HomeTryOnSection />

        {/* ── 05. DEDICATED CHILDREN'S ATELIER SECTION ── */}
        <section id="kids" className="bg-[#0A0A0E] border-y border-white/[0.08] py-20 md:py-28 w-full">
          <Container>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-white/[0.05] border border-white/10 rounded-full mb-3 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC] animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#BFD3E6]">
                    ✦ Kids&rsquo; Collection
                  </span>
                </div>
                <h2 className="text-display text-[clamp(2.2rem,4.4vw,3.6rem)] text-white leading-tight font-extrabold tracking-tight">
                  Made For Play. Built To Last.
                </h2>
                <p className="text-zinc-400 font-sans max-w-[500px] mt-2 text-[14px]">
                  100% GOTS organic cotton, tagless necklines, and smooth flat seams that never scratch delicate skin.
                </p>
              </div>

              <div className="mt-6 lg:mt-0 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { title: 'Tag-Free Neck', desc: 'Zero itch' },
                  { title: 'Flat Seams', desc: 'No chafing' },
                  { title: '100% Organic', desc: 'GOTS certified' },
                  { title: 'Grow Hems', desc: 'Expandable' },
                ].map((b) => (
                  <div key={b.title} className="bg-[#111116] border border-white/10 p-3 text-center rounded-xs shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white">{b.title}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Tabs */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2 sm:gap-3">
                {(['All', '2-4', '5-8', '9-12'] as const).map((age) => (
                  <button
                    key={age}
                    onClick={() => setKidsAgeFilter(age)}
                    className={`text-[11px] tracking-wider uppercase px-4 py-2 border transition-all cursor-pointer ${
                      kidsAgeFilter === age
                        ? 'border-white bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                        : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {age === 'All' ? 'All Kids' : `Ages ${age} Yrs`}
                  </button>
                ))}
              </div>

              <Link
                href="/kids"
                className="text-[11px] tracking-[0.18em] uppercase font-semibold text-zinc-300 hover:text-white transition-colors pb-1 border-b border-white/20 hover:border-white"
              >
                View all 16 Kids styles →
              </Link>
            </div>

            {/* Kids Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
              {filteredKids.map((product) => {
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
                      <div className="relative aspect-[3/4] bg-[#16161C] overflow-hidden border-b border-white/[0.06]">
                        <img
                          src={getModelImage(product.id)}
                          alt={`${product.name} worn by child model`}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            isHovered ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
                          }`}
                          loading="lazy"
                        />

                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className="px-2.5 py-0.5 bg-black/80 backdrop-blur-md text-[9px] font-semibold uppercase tracking-wider text-white border border-white/10 shadow-sm">
                            Ages {product.ageGroup} Yrs
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-600/90 text-white text-[9px] font-semibold uppercase tracking-wider shadow-sm">
                            {pricing.discountPercent}% OFF
                          </span>
                        </div>

                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/10 backdrop-blur-md text-[9px] tracking-widest uppercase text-white font-medium border border-white/10">
                          Child Fit
                        </span>

                        <Link
                          href={`/try-on?garment=${product.slug}`}
                          className="absolute bottom-3 inset-x-3 py-2.5 bg-black/85 hover:bg-white hover:text-black text-white backdrop-blur-md text-[10px] font-semibold tracking-[0.18em] uppercase text-center transition-all shadow-lg flex items-center justify-center gap-1.5 border border-white/20"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-ping" />
                          <span>AI Virtual Try-On ✦</span>
                        </Link>
                      </div>

                      <div className="p-4">
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
        </section>

        {/* ── 06. PHYSICAL ATELIER & VERIFIED REVIEWS TRUST STRIP ── */}
        <section className="py-12 bg-[#09090D] border-t border-white/[0.08]">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Store Location */}
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center text-xl flex-shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#7DD3FC] font-extrabold">Visit Our Store</p>
                  <p className="text-xs text-white font-bold mt-0.5">Sateshwar, Tilak Nagar</p>
                  <p className="text-[11px] text-zinc-400 font-sans">Auraiya, Uttar Pradesh – 206122</p>
                </div>
              </div>

              {/* Direct Phone & WhatsApp */}
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center text-xl flex-shrink-0">
                  📞
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#7DD3FC] font-extrabold">Direct Atelier Line</p>
                  <a href="tel:9389005539" className="text-sm text-white font-extrabold hover:text-[#7DD3FC] transition-colors">
                    +91 93890 05539
                  </a>
                  <p className="text-[11px] text-emerald-400 font-sans">Instant WhatsApp &amp; Call Support</p>
                </div>
              </div>

              {/* Google Reviews & Rating */}
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center text-xl text-amber-400 flex-shrink-0">
                  ★
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 text-sm">★★★★★</span>
                    <span className="text-sm font-extrabold text-white">4.6 / 5.0</span>
                  </div>
                  <p className="text-xs text-white font-bold mt-0.5">11 Verified Reviews</p>
                  <p className="text-[11px] text-zinc-400 font-sans">Google Verified Fashion Atelier</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── 07. NEWSLETTER ATELIER MEMBERSHIP ── */}
        <section className="py-20 md:py-28 bg-[#070709] border-t border-white/[0.08]">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#BFD3E6] font-bold block mb-2">
                  ✦ Join The Club
                </span>
                <h2 className="text-display text-2xl md:text-3xl text-white font-extrabold tracking-tight">
                  Get 10% Off Your First Order
                </h2>
                <p className="text-[13px] text-zinc-400 mt-2 font-sans">
                  Be the first to know about new fabric drops, seasonal sales, and virtual fitting updates.
                </p>
              </div>

              <div className="lg:col-span-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Thank you for joining Crystal Thread.');
                  }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3.5 bg-white/[0.04] border border-white/15 focus:border-[#BFD3E6] focus:outline-none text-white text-[13px] placeholder:text-zinc-500 rounded-xs font-sans"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-white text-black text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-[#BFD3E6] transition-all cursor-pointer whitespace-nowrap"
                  >
                    Get 10% Off
                  </button>
                </form>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
