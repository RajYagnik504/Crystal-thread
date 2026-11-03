'use client';

import { useState } from 'react';
import { getProductImage, formatPrice } from '@/lib/utils';
import products from '@/data/products.json';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  fabric: string;
  sizes: string[];
  color: string;
  ageGroup?: string;
}

export default function GarmentSelectorStrip({
  selectedGarment,
  onSelectGarment,
  selectedSize,
  onSelectSize,
}: {
  selectedGarment: ProductItem;
  onSelectGarment: (item: ProductItem, category: 'men' | 'kids') => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
}) {
  const [tab, setTab] = useState<'men' | 'kids'>('men');

  const items = tab === 'men' ? products.men : products.kids;

  return (
    <div className="w-full">
      {/* Thread hanger anchor: A subtle hanging crystal thread */}
      <div className="relative flex justify-center items-center h-10 mb-4 overflow-visible">
        <svg className="w-48 h-10 overflow-visible" viewBox="0 0 200 40">
          <line x1="100" y1="0" x2="100" y2="30" stroke="#BFD3E6" strokeWidth="1.2" className="thread-glow" />
          <circle cx="100" cy="30" r="2.5" fill="#BFD3E6" />
          <polygon points="100,26 103,30 100,34 97,30" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
        <div className="flex gap-6">
          <button
            onClick={() => setTab('men')}
            className={`text-caption pb-1.5 transition-all cursor-pointer ${
              tab === 'men'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Men&rsquo;s Garments
          </button>
          <button
            onClick={() => setTab('kids')}
            className={`text-caption pb-1.5 transition-all cursor-pointer ${
              tab === 'kids'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Kids&rsquo; Pieces
          </button>
        </div>

        <span className="text-[11px] text-zinc-500 hidden sm:inline">
          {items.length} atelier designs
        </span>
      </div>

      {/* Horizontal scrollable strip of garments */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
        {items.map((item) => {
          const isSelected = selectedGarment.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => {
                onSelectGarment(item as ProductItem, tab);
                if (item.sizes && item.sizes.length > 0) {
                  onSelectSize(item.sizes[0]);
                }
              }}
              className={`flex-none w-[140px] sm:w-[160px] p-2.5 cursor-pointer transition-all duration-300 border snap-start rounded-xs ${
                isSelected
                  ? 'border-white bg-[#1A1A22] shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-[1.02]'
                  : 'border-white/10 bg-[#111116] hover:border-white/30'
              }`}
            >
              <div className="aspect-[3/4] overflow-hidden mb-2 bg-[#16161C] flex items-center justify-center relative border border-white/[0.06] rounded-2xs">
                <img
                  src={getProductImage(item.id)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC]" />
                )}
              </div>
              <p className="text-[12px] font-medium truncate text-white mb-0.5">{item.name}</p>
              <p className="text-[11px] text-[#BFD3E6]">{formatPrice(item.price)}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Garment Controls: Size & Fabric Highlights */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-caption text-zinc-400">Size:</span>
          <div className="inline-flex gap-2">
            {selectedGarment.sizes.map((s) => (
              <button
                key={s}
                onClick={() => onSelectSize(s)}
                className={`text-[12px] min-w-[38px] h-9 px-2.5 flex items-center justify-center border transition-all cursor-pointer rounded-xs ${
                  selectedSize === s
                    ? 'border-white bg-white text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                    : 'border-white/15 bg-white/[0.04] text-zinc-300 hover:border-white/40 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[12px] text-[#BFD3E6] font-serif tracking-wide">
          {selectedGarment.fabric}
        </div>
      </div>
    </div>
  );
}
