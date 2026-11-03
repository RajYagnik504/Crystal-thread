'use client';

import Link from 'next/link';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] mt-auto relative z-10 text-white overflow-hidden">
      <Container className="pt-20 md:pt-28 pb-16 md:pb-24">
        {/* Big Wordmark & Baseline Thread Section */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-display text-[clamp(2.8rem,7.5vw,6.5rem)] text-white/[0.06] select-none leading-none tracking-tight font-light">
            Crystal Thread
          </h2>

          {/* Decorative Luminous Crystal Thread Line running strictly below the wordmark baseline */}
          <div className="relative w-full h-4 mt-4 overflow-visible pointer-events-none z-0">
            <svg className="w-full h-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 20">
              <path
                d="M 0 10 Q 300 4, 600 12 T 1180 10"
                stroke="#BFD3E6"
                strokeWidth="1.25"
                fill="none"
                className="thread-glow"
              />
              <polygon points="1180,7 1185,10 1180,13 1175,10" fill="#BFD3E6" />
            </svg>
          </div>
        </div>

        {/* Link Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 mb-16 relative z-10">
          {/* Col 1: Brand philosophy & Store Trust */}
          <div className="md:col-span-1 space-y-4">
            <p className="text-[14px] text-zinc-300 leading-relaxed max-w-[280px]">
              Clothes that feel as good as they look. Built from honest natural fibers,
              cut with care, stitched to last.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-full">
                <span className="text-amber-400 text-xs">★★★★★</span>
                <span className="text-xs font-bold text-white">4.6</span>
                <span className="text-[10px] text-zinc-400 font-medium">(11 reviews)</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 font-sans leading-normal">
                📍 Auraiya Store: Sateshwar, Tilak Nagar, UP – 206122
              </p>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <p className="text-caption text-zinc-500 mb-4 tracking-[0.2em]">Shop</p>
            <div className="flex flex-col gap-3">
              <Link href="/men" className="text-[13px] text-zinc-300 hover:text-white transition-colors">
                Men&rsquo;s Collection
              </Link>
              <Link href="/kids" className="text-[13px] text-zinc-300 hover:text-white transition-colors">
                Kids&rsquo; Pieces
              </Link>
              <Link href="/try-on" className="text-[13px] text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC]" />
                Virtual Try-On
              </Link>
              <Link href="/lookbook" className="text-[13px] text-zinc-300 hover:text-white transition-colors">
                Autumn &rsquo;26 Lookbook
              </Link>
            </div>
          </div>

          {/* Col 3: Company */}
          <div>
            <p className="text-caption text-zinc-500 mb-4 tracking-[0.2em]">Atelier</p>
            <div className="flex flex-col gap-3">
              <Link href="/about" className="text-[13px] text-zinc-300 hover:text-white transition-colors">
                Our Thread
              </Link>
              <Link href="/contact" className="text-[13px] text-zinc-300 hover:text-white transition-colors">
                Contact & Studio
              </Link>
              <Link href="/about#sizing" className="text-[13px] text-zinc-300 hover:text-white transition-colors">
                Size & Fit Guide
              </Link>
              <span className="text-[13px] text-zinc-500">
                Shipping & Returns
              </span>
            </div>
          </div>

          {/* Col 4: Connect & Direct Store Line */}
          <div>
            <p className="text-caption text-zinc-500 mb-4 tracking-[0.2em]">Store &amp; Inquiries</p>
            <div className="flex flex-col gap-2.5">
              <a
                href="tel:9389005539"
                className="text-[14px] font-bold text-white hover:text-[#7DD3FC] transition-colors flex items-center gap-2"
              >
                <span>📞</span>
                <span>93890 05539</span>
              </a>
              <a
                href="https://wa.me/919389005539"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <span>💬 WhatsApp Concierge</span>
              </a>
              <a href="mailto:hello@crystalthread.in" className="text-[13px] text-zinc-400 hover:text-white transition-colors">
                hello@crystalthread.in
              </a>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Sateshwar, Tilak Nagar,<br />
                Auraiya, UP – 206122
              </p>
              <span className="text-[11px] text-zinc-500">
                Mon – Sat, 10:00 – 20:00 IST
              </span>
            </div>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="hairline mb-8" />

        {/* Bottom Legal Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[12px] text-zinc-400">
          <div className="flex flex-wrap items-center gap-6">
            <span>© 2026 Crystal Thread. All rights reserved.</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin" className="text-zinc-500 hover:text-[#7DD3FC] transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              <span>Atelier Admin</span>
            </Link>
          </div>
          <span className="text-zinc-600 text-[11px] tracking-wider uppercase">
            Designed with one thread, many stitches.
          </span>
        </div>
      </Container>
    </footer>
  );
}
