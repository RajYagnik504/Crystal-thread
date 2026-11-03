'use client';

import { useEffect, useRef, useState } from 'react';

export default function StitchRevealCanvas({
  beforeImage,
  afterImage,
  onRevealComplete,
}: {
  beforeImage: string;
  afterImage: string;
  onRevealComplete?: () => void;
}) {
  const [complete, setComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgBefore = new Image();
    const imgAfter = new Image();
    let loadedCount = 0;

    const onImageLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        startStitchAnimation();
      }
    };

    imgBefore.onload = onImageLoaded;
    imgAfter.onload = onImageLoaded;
    imgBefore.src = beforeImage;
    imgAfter.src = afterImage;

    const startStitchAnimation = () => {
      let progress = 0;
      const w = canvas.width;
      const h = canvas.height;

      const stitch = () => {
        progress += 0.012; // Complete reveal in ~1.4s

        ctx.clearRect(0, 0, w, h);

        // 1. Draw base photo
        ctx.drawImage(imgBefore, 0, 0, w, h);

        // 2. Draw revealed result via progressive path mask
        ctx.save();
        ctx.beginPath();

        // Stitched garment contour mask (starts at collar, rolls down shoulders to hem)
        const currentY = h * 0.15 + (h * 0.75) * Math.min(progress, 1);
        ctx.moveTo(w * 0.5, h * 0.15); // Collar point
        ctx.bezierCurveTo(
          w * 0.2, h * 0.2,
          w * 0.05, currentY * 0.7,
          w * 0.05, currentY
        );
        ctx.lineTo(w * 0.95, currentY);
        ctx.bezierCurveTo(
          w * 0.95, currentY * 0.7,
          w * 0.8, h * 0.2,
          w * 0.5, h * 0.15
        );
        ctx.closePath();
        ctx.clip();

        // Draw new outfit inside mask
        ctx.drawImage(imgAfter, 0, 0, w, h);
        ctx.restore();

        // 3. Draw active luminous crystal thread following the leading stitch line
        const threadY = currentY;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(w * 0.05, threadY);
        for (let x = w * 0.05; x <= w * 0.95; x += 10) {
          const wave = Math.sin(x * 0.05 + progress * 15) * 4;
          ctx.lineTo(x, threadY + wave);
        }
        ctx.strokeStyle = '#BFD3E6';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(191, 211, 230, 0.9)';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Stitches along leading edge
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        for (let x = w * 0.08; x < w * 0.92; x += 24) {
          ctx.fillRect(x, threadY - 1, 8, 2);
        }
        ctx.restore();

        if (progress < 1.05) {
          animRef.current = requestAnimationFrame(stitch);
        } else {
          setComplete(true);
          if (onRevealComplete) onRevealComplete();
        }
      };

      animRef.current = requestAnimationFrame(stitch);
    };

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [beforeImage, afterImage, onRevealComplete]);

  return (
    <div className="relative w-full aspect-[3/4] max-h-[580px] bg-ink/[0.03] overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={750}
        height={1000}
        className="w-full h-full object-cover"
      />
      {!complete && (
        <div className="absolute top-4 right-4 bg-[var(--bg)]/80 backdrop-blur-sm px-3 py-1 border border-ink/10 text-[10px] tracking-widest uppercase text-ink/60">
          Stitching Garment
        </div>
      )}
    </div>
  );
}
