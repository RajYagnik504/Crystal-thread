'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomCursor from '@/components/ui/CustomCursor';
import Container from '@/components/layout/Container';
import Link from 'next/link';
import { getProductImage, formatPrice } from '@/lib/utils';
import products from '@/data/products.json';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  const allProducts = [...products.men, ...products.kids];
  const product = allProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const isMen = products.men.some((p) => p.slug === slug);
  const relatedSource = isMen ? products.men : products.kids;
  const related = relatedSource.filter((p) => p.slug !== slug).slice(0, 4);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = (e.clientX - dragStart) * 0.5;
    setRotationAngle((prev) => prev + delta);
    setDragStart(e.clientX);
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      setDragStart(e.touches[0].clientX);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const delta = (e.touches[0].clientX - dragStart) * 0.5;
    setRotationAngle((prev) => prev + delta);
    setDragStart(e.touches[0].clientX);
  };
  const handleTouchEnd = () => setIsDragging(false);

  return (
    <>
      <CustomCursor />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-32 md:pt-40 pb-24 bg-[#070709] text-white min-h-screen">
        <Container>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-zinc-500 mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={isMen ? '/men' : '/kids'} className="hover:text-white transition-colors">
              {isMen ? 'Men' : 'Kids'}
            </Link>
            <span>/</span>
            <span className="text-[#BFD3E6]">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            {/* Image gallery */}
            <div className="md:col-span-7">
              {/* Main image with rotate interaction */}
              <div
                className="aspect-[3/4] bg-[#121217] border border-white/10 rounded-xs overflow-hidden mb-4 relative select-none cursor-grab active:cursor-grabbing shadow-2xl"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                data-cursor="Rotate"
              >
                <img
                  src={getProductImage(product.id)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-100"
                  style={{
                    transform: `perspective(1000px) rotateY(${rotationAngle}deg)`,
                  }}
                  draggable={false}
                />
                <div className="absolute bottom-4 right-4 text-[9px] tracking-[0.18em] uppercase text-zinc-500 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
                  Drag to rotate
                </div>
              </div>
            </div>

            {/* Product info */}
            <div className="md:col-span-5">
              <div className="sticky top-36">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#BFD3E6] font-semibold mb-2">
                  {product.category}
                </p>
                <h1 className="text-display text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 text-white font-light tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xl font-serif text-[#BFD3E6] mb-8">
                  {formatPrice(product.price)}
                </p>

                <div className="hairline mb-8" />

                <p className="text-body text-zinc-400 mb-8 font-sans leading-relaxed">{product.description}</p>

                {/* Size selector */}
                <div className="mb-8">
                  <p className="text-caption text-zinc-400 mb-3 tracking-[0.18em]">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center text-[12px] border transition-all duration-300 cursor-pointer rounded-xs ${
                          selectedSize === size
                            ? 'border-white bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                            : 'border-white/15 bg-white/[0.04] text-zinc-300 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3 mb-8">
                  <button
                    className="w-full py-4 bg-white text-black text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all cursor-pointer shadow-xl text-center"
                    onClick={() => setCartOpen(true)}
                  >
                    <span>Add to bag</span>
                  </button>

                  <Link
                    href={`/try-on?garment=${product.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 border border-[#BFD3E6]/60 hover:bg-[#BFD3E6] hover:text-black bg-[#BFD3E6]/10 text-[11px] tracking-[0.18em] uppercase font-semibold text-white transition-all shadow-md rounded-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC] animate-ping" />
                    <span>Try It On With AI ✦</span>
                  </Link>
                </div>

                <div className="hairline mb-8" />

                {/* Fabric & care */}
                <div className="space-y-5">
                  <div>
                    <p className="text-caption text-zinc-500 mb-1 tracking-wider">Fabric</p>
                    <p className="text-[13px] text-zinc-300">{product.fabric}</p>
                  </div>
                  <div>
                    <p className="text-caption text-zinc-500 mb-1 tracking-wider">Care</p>
                    <p className="text-[13px] text-zinc-300">{product.care}</p>
                  </div>
                  <div>
                    <p className="text-caption text-zinc-500 mb-1 tracking-wider">Colour</p>
                    <p className="text-[13px] text-zinc-300">{product.color}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          <div className="mt-24 md:mt-36">
            <div className="hairline mb-12" />
            <h2 className="text-display text-[clamp(1.5rem,3vw,2.2rem)] mb-10 text-white font-light tracking-tight">
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="group block bg-[#111116] border border-white/10 hover:border-white/30 p-3 rounded-xs transition-all shadow-lg"
                  data-cursor="View"
                >
                  <div className="aspect-[3/4] bg-[#16161C] overflow-hidden mb-3 rounded-2xs">
                    <img
                      src={getProductImage(item.id)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[13px] font-normal text-white truncate mb-1 group-hover:text-[#BFD3E6] transition-colors">{item.name}</p>
                  <p className="text-[12px] text-[#BFD3E6] font-semibold">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
