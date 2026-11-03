'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import BrandLogo from '@/components/ui/BrandLogo';

export default function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/men', label: 'Men' },
    { href: '/kids', label: 'Kids' },
    { href: '/try-on', label: 'AI Virtual Try-On', isSpecial: true },
    { href: '/lookbook', label: 'Lookbook' },
    { href: '/about', label: 'Our Thread' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[9990] transition-all duration-300">
      {/* ── Top Announcement Banner ── */}
      <div className="bg-[#040405] text-[#A1A1AA] py-1.5 px-3 text-center text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase flex items-center justify-center gap-2 sm:gap-3.5 border-b border-white/[0.05] overflow-x-auto scrollbar-none whitespace-nowrap">
        <span className="text-[#BFD3E6] animate-pulse">✦</span>
        <span className="text-white font-bold">New 2026 Drops</span>
        <span className="text-white/20">•</span>
        <span className="hidden sm:inline">Store: Sateshwar, Auraiya (UP)</span>
        <span className="hidden sm:inline text-white/20">•</span>
        <a
          href="tel:9389005539"
          className="text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>📞</span>
          <span className="text-white">93890 05539</span>
        </a>
        <span className="text-white/20">•</span>
        <span className="text-amber-400 font-bold flex items-center gap-1">
          <span>★</span>
          <span className="text-white">4.6</span>
          <span className="text-zinc-400 text-[9px] font-normal">(11 Reviews)</span>
        </span>
        <span className="text-white/20 hidden md:inline">•</span>
        <span className="text-[#7DD3FC] font-bold hidden md:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC]" />
          <span>Virtual Trial Room</span>
        </span>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'py-3 backdrop-blur-xl bg-[#070709]/90 shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-b border-white/[0.08]'
            : 'py-3.5 md:py-5 bg-[#070709]/80 backdrop-blur-md border-b border-white/[0.04]'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 flex items-center justify-between">
          {/* Brand Logo on the left */}
          <Link href="/" className="flex items-center">
            <BrandLogo />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map(({ href, label, isSpecial }) => (
              <Link
                key={href}
                href={href}
                className={`text-[11px] tracking-[0.18em] uppercase font-medium transition-all duration-300 flex items-center gap-2 ${
                  isSpecial
                    ? 'text-white font-semibold px-3.5 py-1.5 bg-white/[0.06] border border-[#BFD3E6]/60 shadow-[0_0_15px_rgba(191,211,230,0.15)] hover:bg-[#BFD3E6] hover:text-[#070709] hover:border-[#BFD3E6] rounded-full'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {isSpecial && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC] animate-ping" />
                )}
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions on the far right */}
          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
            <Link
              href="/admin"
              className="hidden xl:flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-zinc-400 hover:text-white font-medium px-2.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all"
              title="Atelier Product & Kids Inventory Management"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span>Admin</span>
            </Link>

            <Link
              href="/try-on"
              className="hidden lg:flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-zinc-400 hover:text-white font-medium px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] animate-pulse" />
              <span>Fitting Room</span>
            </Link>

            <button
              onClick={onCartOpen}
              className="group flex items-center gap-2.5 px-4 py-1.5 border border-white/20 hover:border-white rounded-full text-[11px] tracking-[0.16em] uppercase font-medium text-white transition-all bg-white/[0.04] hover:bg-white hover:text-black cursor-pointer shadow-sm"
              aria-label="View shopping bag"
            >
              <span>Bag</span>
              <span className="w-4 h-4 rounded-full bg-[#BFD3E6] text-[#070709] text-[9px] font-bold flex items-center justify-center transition-colors">
                0
              </span>
            </button>

            {/* Mobile hamburger menu */}
            <button
              className="md:hidden flex flex-col justify-center gap-1.5 p-2 w-8 h-8 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span
                className={`w-5 h-0.5 bg-white transition-transform duration-300 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[4px]' : ''
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white transition-transform duration-300 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[4px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#0C0C0F] border-b border-white/10 px-6 py-6 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-4">
            {navLinks.map(({ href, label, isSpecial }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-[13px] uppercase tracking-[0.16em] py-2.5 border-b border-white/[0.06] flex items-center justify-between ${
                  isSpecial ? 'font-semibold text-[#BFD3E6]' : 'text-zinc-300 hover:text-white'
                }`}
              >
                <span>{label}</span>
                {isSpecial && (
                  <span className="text-[9px] bg-[#BFD3E6]/20 border border-[#BFD3E6]/40 px-2 py-0.5 text-[#BFD3E6] tracking-widest rounded-full">
                    AI LIVE
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
