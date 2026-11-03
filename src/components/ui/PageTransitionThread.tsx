'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransitionThread() {
  const pathname = usePathname();
  const threadRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!threadRef.current || !glintRef.current) return;

    const el = threadRef.current;
    const glint = glintRef.current;

    // Reset
    el.style.transition = 'none';
    el.style.transform = 'scaleX(0)';
    el.style.opacity = '1';
    glint.style.transition = 'none';
    glint.style.transform = 'translateX(0)';
    glint.style.opacity = '1';

    // Trigger animation
    requestAnimationFrame(() => {
      el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'scaleX(1)';
      glint.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      glint.style.transform = 'translateX(100vw)';

      setTimeout(() => {
        el.style.transition = 'opacity 0.35s ease';
        el.style.opacity = '0';
        glint.style.transition = 'opacity 0.25s ease';
        glint.style.opacity = '0';
      }, 650);
    });
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[10005] pointer-events-none">
      <div
        ref={threadRef}
        className="w-full h-[2px] bg-[#BFD3E6] origin-left shadow-[0_0_8px_rgba(191,211,230,0.8),0_0_20px_rgba(191,211,230,0.4)]"
        style={{ transform: 'scaleX(0)', opacity: 0 }}
      />
      <div
        ref={glintRef}
        className="absolute top-[-2px] left-[-6px] w-[6px] h-[6px] bg-white rounded-full shadow-[0_0_6px_#fff,0_0_12px_#BFD3E6]"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
