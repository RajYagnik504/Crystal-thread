'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    setDone(true);
    onComplete();
  }, [onComplete]);

  const animate = useCallback(async () => {
    if (!svgRef.current || !overlayRef.current) return;

    const threadPath = svgRef.current.querySelector('#intro-thread') as SVGPathElement;
    const wordmark = svgRef.current.querySelector('#intro-wordmark') as SVGGElement;
    const glint = svgRef.current.querySelector('#intro-glint') as SVGCircleElement;

    if (!threadPath || !wordmark || !glint) {
      finish();
      return;
    }

    const threadLength = threadPath.getTotalLength();
    threadPath.style.strokeDasharray = `${threadLength}`;
    threadPath.style.strokeDashoffset = `${threadLength}`;

    // Letters start hidden
    const letters = wordmark.querySelectorAll('text');
    letters.forEach((l) => {
      (l as SVGTextElement).style.opacity = '0';
      (l as SVGTextElement).style.transform = 'translateY(4px)';
    });
    glint.style.opacity = '0';

    // Phase 1: Draw the luminous crystal thread (0 → 550ms)
    await animateValue(0, threadLength, 550, (v) => {
      threadPath.style.strokeDashoffset = `${threadLength - v}`;
    });

    // Phase 2: Faceted glint sweep along the thread (550 → 850ms)
    glint.style.opacity = '1';
    await animateValue(0, 1, 300, (t) => {
      const point = threadPath.getPointAtLength(t * threadLength);
      glint.setAttribute('cx', `${point.x}`);
      glint.setAttribute('cy', `${point.y}`);
    });
    glint.style.opacity = '0';

    // Phase 3: Stitch letters sequentially in clean modern bold typography (850 → 1250ms)
    for (let i = 0; i < letters.length; i++) {
      await new Promise((r) => setTimeout(r, 28));
      const el = letters[i] as SVGTextElement;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0px)';
      el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }

    // Phase 4: Brief hold, then luxury curtain lift (1250 → 1750ms)
    await new Promise((r) => setTimeout(r, 260));

    if (overlayRef.current) {
      overlayRef.current.style.transition = 'clip-path 0.65s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.65s ease';
      overlayRef.current.style.clipPath = 'inset(0 0 100% 0)';
      overlayRef.current.style.opacity = '0';
    }

    await new Promise((r) => setTimeout(r, 650));
    finish();
  }, [finish]);

  useEffect(() => {
    // Failsafe in case of background tab throttling
    const failsafe = setTimeout(() => {
      finish();
    }, 2800);

    const timer = setTimeout(animate, 30);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, [animate, finish]);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10002] bg-[#070709] flex flex-col items-center justify-center pointer-events-none select-none"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <div className="w-[min(92vw,500px)] h-[170px] flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox="0 0 460 160"
          className="w-full h-full max-h-[160px] overflow-visible"
          fill="none"
        >
          <defs>
            <filter id="intro-crystal-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="intro-thread-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#BFD3E6" />
            </linearGradient>
          </defs>

          {/* Monogram C Thread Loop traversing into glowing crystal thread */}
          <path
            id="intro-thread"
            d="M 52 48 C 36 34, 18 48, 18 72 C 18 96, 40 110, 56 94 C 66 84, 60 72, 48 76 L 64 76 C 100 36, 160 115, 230 76 C 300 38, 360 110, 420 76"
            stroke="url(#intro-thread-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            filter="drop-shadow(0 0 8px rgba(125,211,252,0.8)) drop-shadow(0 0 20px rgba(191,211,230,0.4))"
          />

          {/* Faceted Crystal Gem at knot */}
          <g transform="translate(420, 76)">
            <polygon
              points="0,-7 6,0 0,7 -6,0"
              fill="#BFD3E6"
              filter="url(#intro-crystal-glow)"
            />
            <polygon points="0,-7 0,7 6,0" fill="#FFFFFF" opacity="0.95" />
            <polygon points="0,-7 0,7 -6,0" fill="#7DD3FC" opacity="0.85" />
          </g>

          {/* Glint circle travelling along thread */}
          <circle
            id="intro-glint"
            r="4.5"
            fill="#FFFFFF"
            opacity="0"
            filter="drop-shadow(0 0 8px #FFFFFF)"
          />

          {/* Wordmark stitched in clean modern bold typography */}
          <g id="intro-wordmark">
            {'CRYSTAL THREAD'.split('').map((char, i) => (
              <text
                key={i}
                x={70 + i * 26}
                y={118}
                fill="#FFFFFF"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="22"
                fontWeight="800"
                letterSpacing="0.16em"
                opacity="0"
              >
                {char}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <div className="flex items-center gap-2 mt-4 text-[10px] tracking-[0.24em] uppercase text-zinc-500 font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC] animate-ping" />
        <span>Atelier 2026 Collection</span>
      </div>
    </div>
  );
}

function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (v: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      onUpdate(from + (to - from) * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}
