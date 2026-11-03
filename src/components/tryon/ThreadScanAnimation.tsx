'use client';

import { useEffect, useRef, useState } from 'react';

const STATUS_MESSAGES = [
  'Finding the shoulder line',
  'Measuring the natural drape',
  'Tracing the silhouette contour',
  'Aligning the weave and fold',
  'Stitching the seams with crystal thread',
];

export default function ThreadScanAnimation({
  userImage,
  garmentName,
}: {
  userImage: string;
  garmentName: string;
}) {
  const [statusIndex, setStatusIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Rotate calm status lines
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // Luminous thread wave scanner
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanProgress = 0; // 0 to 1
    let scanDirection = 1;
    let time = 0;

    const render = () => {
      time += 0.03;
      scanProgress += 0.007 * scanDirection;

      if (scanProgress >= 0.98) scanDirection = -1;
      else if (scanProgress <= 0.02) scanDirection = 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const scanY = scanProgress * h;

      // 1. Draw horizontal scanning thread with wave ripple
      ctx.beginPath();
      ctx.moveTo(0, scanY);

      for (let x = 0; x <= w; x += 4) {
        // Wave deformation
        const wave = Math.sin(x * 0.04 + time * 3) * 6;
        ctx.lineTo(x, scanY + wave);
      }

      ctx.strokeStyle = '#BFD3E6';
      ctx.lineWidth = 1.75;
      ctx.shadowColor = 'rgba(191, 211, 230, 0.8)';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Secondary soft aura
      ctx.strokeStyle = 'rgba(191, 211, 230, 0.25)';
      ctx.lineWidth = 6;
      ctx.shadowBlur = 20;
      ctx.stroke();

      // 2. Stitch marks along the sides of the scan
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#BFD3E6';

      for (let y = 40; y < scanY; y += 22) {
        // Left stitches
        const leftX = w * 0.2 + Math.sin(y * 0.05) * 8;
        ctx.fillRect(leftX - 3, y - 1, 6, 2);

        // Right stitches
        const rightX = w * 0.8 - Math.sin(y * 0.05) * 8;
        ctx.fillRect(rightX - 3, y - 1, 6, 2);
      }

      // 3. Faceted crystal travelling glint along the thread line
      const glintX = ((Math.sin(time * 2) + 1) / 2) * (w * 0.6) + w * 0.2;
      const glintY = scanY + Math.sin(glintX * 0.04 + time * 3) * 6;

      ctx.save();
      ctx.translate(glintX, glintY);
      ctx.rotate(time);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.lineTo(5, 0);
      ctx.lineTo(0, 5);
      ctx.lineTo(-5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] max-h-[580px] bg-ink/[0.03] overflow-hidden select-none"
    >
      {/* User photo beneath */}
      <img
        src={userImage}
        alt="Scanning preview"
        className="w-full h-full object-cover filter brightness-[0.96] contrast-[0.98]"
      />

      {/* Canvas scanning thread */}
      <canvas
        ref={canvasRef}
        width={600}
        height={800}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Floating calm editorial caption */}
      <div className="absolute bottom-6 inset-x-6 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="bg-[#121216]/95 backdrop-blur-md px-6 py-3.5 border border-white/15 shadow-2xl max-w-sm">
          <p className="text-caption text-accent/80 mb-1">Fitting {garmentName}</p>
          <p className="font-serif text-lg text-white transition-opacity duration-300">
            {STATUS_MESSAGES[statusIndex]}...
          </p>
        </div>
      </div>
    </div>
  );
}
