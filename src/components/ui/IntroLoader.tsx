'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'drawing' | 'letters' | 'lifting' | 'done'>('drawing');
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setDone(true);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Phase 1: Draw thread (0ms -> 450ms)
    const t1 = setTimeout(() => {
      setPhase('letters');
    }, 450);

    // Phase 2: Stagger letters (450ms -> 1100ms)
    const t2 = setTimeout(() => {
      setPhase('lifting');
    }, 1150);

    // Phase 3: Curtain lift & completion (1150ms -> 1600ms)
    const t3 = setTimeout(() => {
      setPhase('done');
      finish();
    }, 1650);

    // Failsafe in case of background tab throttling
    const failsafe = setTimeout(() => {
      finish();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(failsafe);
    };
  }, [finish]);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-[10002] bg-[#070709] flex flex-col items-center justify-center pointer-events-none select-none transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === 'lifting' || phase === 'done'
          ? 'opacity-0 -translate-y-8 pointer-events-none'
          : 'opacity-100 translate-y-0'
      }`}
      style={{ willChange: 'opacity, transform' }}
    >
      <div className="w-[min(90vw,480px)] h-[150px] flex items-center justify-center">
        <svg
          viewBox="0 0 460 140"
          className="w-full h-full max-h-[140px] overflow-visible"
          fill="none"
        >
          <defs>
            <linearGradient id="intro-thread-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#BFD3E6" />
            </linearGradient>
          </defs>

          {/* Monogram C Thread Loop traversing into glowing crystal thread */}
          <path
            d="M 52 42 C 36 28, 18 42, 18 66 C 18 90, 40 104, 56 88 C 66 78, 60 66, 48 70 L 64 70 C 100 30, 160 109, 230 70 C 300 32, 360 104, 420 70"
            stroke="url(#intro-thread-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: phase === 'drawing' ? 600 : 0,
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              filter: 'drop-shadow(0 0 8px rgba(125,211,252,0.6))',
              willChange: 'stroke-dashoffset',
            }}
          />

          {/* Faceted Crystal Gem at knot */}
          <g
            transform="translate(420, 70)"
            className={`transition-all duration-300 ${
              phase !== 'drawing' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{ transformOrigin: '420px 70px' }}
          >
            <polygon points="0,-7 6,0 0,7 -6,0" fill="#BFD3E6" />
            <polygon points="0,-7 0,7 6,0" fill="#FFFFFF" opacity="0.95" />
            <polygon points="0,-7 0,7 -6,0" fill="#7DD3FC" opacity="0.85" />
          </g>

          {/* Wordmark stitched in clean modern bold typography */}
          <g id="intro-wordmark">
            {'CRYSTAL THREAD'.split('').map((char, i) => (
              <text
                key={i}
                x={70 + i * 26}
                y={112}
                fill="#FFFFFF"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="22"
                fontWeight="800"
                letterSpacing="0.16em"
                style={{
                  opacity: phase !== 'drawing' ? 1 : 0,
                  transform: phase !== 'drawing' ? 'translateY(0)' : 'translateY(6px)',
                  transition: `opacity 0.25s ease ${i * 24}ms, transform 0.25s ease ${i * 24}ms`,
                  willChange: 'opacity, transform',
                }}
              >
                {char}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <div
        className={`flex items-center gap-2 mt-3 text-[10px] tracking-[0.24em] uppercase text-zinc-400 font-bold transition-opacity duration-300 ${
          phase !== 'drawing' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC] animate-pulse" />
        <span>Atelier 2026 Collection</span>
      </div>
    </div>
  );
}
