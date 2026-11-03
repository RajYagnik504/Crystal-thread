'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return;

    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };

      const el = e.target as HTMLElement;
      const interactive = el.closest('[data-cursor]');
      if (interactive) {
        const lbl = (interactive as HTMLElement).dataset.cursor || 'View';
        setLabel(lbl);
        setHovering(true);
      } else if (el.closest('a, button, [role="button"]')) {
        setLabel('');
        setHovering(true);
      } else {
        setLabel('');
        setHovering(false);
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }
      if (labelRef.current) {
        labelRef.current.style.left = `${pos.current.x}px`;
        labelRef.current.style.top = `${pos.current.y + 40}px`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`ct-cursor ${hovering ? 'hovering' : ''}`}
      />
      <div
        ref={labelRef}
        className={`ct-cursor-label ${label ? 'visible' : ''}`}
      >
        {label}
      </div>
    </>
  );
}
