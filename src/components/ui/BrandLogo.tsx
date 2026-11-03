'use client';

import { useRef, useState } from 'react';

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  monogramOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({
  className = '',
  showWordmark = true,
  monogramOnly = false,
  size = 'md',
}: BrandLogoProps) {
  const [animating, setAnimating] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const glintRef = useRef<SVGCircleElement>(null);

  const handleHover = () => {
    if (animating || !pathRef.current) return;
    setAnimating(true);

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Fast unravel (draw out) then re-stitch (draw in)
    path.style.transition = 'none';
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = '0';

    requestAnimationFrame(() => {
      // Unravel
      path.style.transition = 'stroke-dashoffset 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      path.style.strokeDashoffset = `${length}`;

      setTimeout(() => {
        // Re-stitch
        path.style.transition = 'stroke-dashoffset 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        path.style.strokeDashoffset = '0';

        // Trigger glint sweep
        if (glintRef.current) {
          glintRef.current.style.transition = 'opacity 0.2s, transform 0.45s ease-out';
          glintRef.current.style.opacity = '1';
          glintRef.current.style.transform = 'translate(28px, -18px)';
          setTimeout(() => {
            if (glintRef.current) {
              glintRef.current.style.opacity = '0';
              glintRef.current.style.transform = 'translate(0, 0)';
            }
          }, 450);
        }

        setTimeout(() => setAnimating(false), 500);
      }, 350);
    });
  };

  const scale = size === 'sm' ? 'h-5 sm:h-6' : size === 'lg' ? 'h-8 sm:h-10' : 'h-5 sm:h-7';

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-3 cursor-pointer select-none group ${className}`}
      onMouseEnter={handleHover}
    >
      <svg
        viewBox="0 0 54 44"
        className={`${scale} w-auto overflow-visible`}
        fill="none"
      >
        <defs>
          <filter id="crystal-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* The Monogram: C formed by an open thread loop in luminous white */}
        <path
          ref={pathRef}
          d="M 42 10 C 35 4, 18 4, 12 14 C 6 24, 12 36, 26 38 C 36 39, 44 32, 44 26 C 44 21, 38 18, 32 20"
          stroke="#FFFFFF"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="transition-colors duration-300 group-hover:stroke-[#BFD3E6]"
        />

        {/* Needle-eye knot thread line */}
        <path
          d="M 32 20 L 40 20"
          stroke="#BFD3E6"
          strokeWidth="1.2"
          strokeLinecap="round"
          filter="url(#crystal-glow)"
        />

        {/* Faceted Crystal at the knot/needle-eye */}
        <g transform="translate(42, 20)">
          <polygon
            points="0,-5 4,0 0,5 -4,0"
            fill="#BFD3E6"
            className="transition-transform duration-300 group-hover:scale-125"
            filter="drop-shadow(0 0 6px rgba(191,211,230,0.8))"
          />
          <polygon
            points="0,-5 0,5 4,0"
            fill="#EAF1F8"
            opacity="0.95"
          />
          <polygon
            points="0,-5 0,5 -4,0"
            fill="#93B8DC"
            opacity="0.8"
          />
          {/* Glint point */}
          <circle
            ref={glintRef}
            cx="0"
            cy="0"
            r="2"
            fill="#FFFFFF"
            opacity="0"
            filter="drop-shadow(0 0 4px #FFFFFF)"
          />
        </g>
      </svg>

      {showWordmark && !monogramOnly && (
        <span
          className="font-display font-extrabold text-[13px] sm:text-base md:text-lg tracking-[0.12em] sm:tracking-[0.16em] text-white uppercase group-hover:text-[#BFD3E6] transition-colors whitespace-nowrap"
        >
          Crystal Thread
        </span>
      )}
    </div>
  );
}
