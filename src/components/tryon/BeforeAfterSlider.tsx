'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  className = '',
}: {
  beforeImage: string;
  afterImage: string;
  className?: string;
}) {
  const [sliderPos, setSliderPos] = useState(35); // Start at 35% so tailored drape is prominently visible
  const [isDragging, setIsDragging] = useState(false);
  const [threadRipple, setThreadRipple] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const updateW = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
    };
    updateW();
    window.addEventListener('resize', updateW);
    return () => window.removeEventListener('resize', updateW);
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
    // Induce ripple based on motion
    setThreadRipple((prev) => Math.min(15, prev + 2.5));
  }, []);

  // Mouse drag handlers
  const handleMouseDown = () => setIsDragging(true);

  // Dampen ripple over time
  useEffect(() => {
    const loop = () => {
      setThreadRipple((r) => (r > 0.05 ? r * 0.9 : 0));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };
    const handleMouseUp = () => setIsDragging(false);

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      updatePosition(e.touches[0].clientX);
    };
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[3/4] max-h-[580px] bg-ink/[0.03] overflow-hidden select-none cursor-ew-resize ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      data-cursor="Compare"
    >
      {/* 1. Underlying: After Image (with garment) */}
      <img
        src={afterImage}
        alt="After fitting"
        className="absolute inset-0 w-full h-full object-cover object-top"
        draggable={false}
      />

      {/* 2. Overlying: Before Image (clipped to slider position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImage}
          alt="Original photograph"
          className="absolute inset-0 h-full object-cover object-top max-w-none"
          style={{
            width: containerWidth > 0 ? `${containerWidth}px` : (containerRef.current ? `${containerRef.current.clientWidth}px` : '100%'),
            minWidth: containerWidth > 0 ? `${containerWidth}px` : '100%',
            height: '100%',
          }}
          draggable={false}
        />
      </div>

      {/* 3. The Thread Divider with travelling wave and crystal handle */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        {/* Luminous crystal thread line with ripple */}
        <svg
          className="h-full w-10 overflow-visible"
          style={{ transform: 'translateX(-50%)' }}
          preserveAspectRatio="none"
          viewBox="0 0 40 1000"
        >
          <path
            d={`M 20 0 
                Q ${20 + threadRipple * 1.5} 250, 20 500 
                Q ${20 - threadRipple * 1.5} 750, 20 1000`}
            stroke="#BFD3E6"
            strokeWidth="1.75"
            fill="none"
            className="thread-glow"
          />
        </svg>

        {/* Center Faceted Crystal Pull Knot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
          <div className="w-5 h-5 rotate-45 bg-[#BFD3E6] border border-white shadow-[0_0_12px_rgba(191,211,230,0.8)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
            <div className="w-2 h-2 bg-white rotate-45" />
          </div>
        </div>
      </div>

      {/* Discreet labels */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase text-white/70 border border-white/15 pointer-events-none shadow-lg">
        Original Photo
      </div>
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase text-accent border border-accent/40 pointer-events-none shadow-lg font-medium">
        Crystal Drape ✦
      </div>
    </div>
  );
}
