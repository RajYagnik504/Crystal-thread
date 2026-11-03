'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[10005] pointer-events-none bg-transparent">
      <div
        className="h-full bg-[#BFD3E6] transition-transform duration-75 ease-out origin-left shadow-[0_0_8px_rgba(191,211,230,0.8)]"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    </div>
  );
}
