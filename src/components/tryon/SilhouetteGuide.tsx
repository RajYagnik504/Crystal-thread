'use client';

export default function SilhouetteGuide({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 300 500"
        className="w-full h-full max-h-[460px] opacity-25"
        fill="none"
      >
        <defs>
          <filter id="silhouette-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Faint Thread-Drawn Human Silhouette Guide */}
        {/* Head */}
        <ellipse
          cx="150"
          cy="80"
          rx="32"
          ry="40"
          stroke="#111111"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Neck */}
        <path
          d="M 140 120 L 140 135 M 160 120 L 160 135"
          stroke="#111111"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Shoulders & Torso */}
        <path
          d="M 140 135 C 120 138, 85 150, 75 180 L 90 270 L 110 270 L 115 190 L 135 190 L 130 360 L 145 360 L 150 250 L 155 360 L 170 360 L 165 190 L 185 190 L 190 270 L 210 270 L 225 180 C 215 150, 180 138, 160 135"
          stroke="#111111"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        {/* Subtle Crystal Alignment Crosshair */}
        <circle cx="150" cy="140" r="3" fill="#BFD3E6" filter="url(#silhouette-glow)" />
        <line x1="140" y1="140" x2="160" y2="140" stroke="#BFD3E6" strokeWidth="0.75" />
        <line x1="150" y1="130" x2="150" y2="150" stroke="#BFD3E6" strokeWidth="0.75" />
      </svg>
    </div>
  );
}
