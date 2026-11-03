'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import * as THREE from 'three';

interface GarmentPiece {
  id: string;
  name: string;
  category: 'men' | 'kids';
  price: number;
  fabric: string;
  image: string;
  modelImage: string;
  slug: string;
  colorName: string;
}

const FEATURED_PIECES: GarmentPiece[] = [
  {
    id: 'men-linen-shirt',
    name: 'Riviera Linen Shirt',
    category: 'men',
    price: 3490,
    fabric: '100% European Flax Linen',
    image: '/images/men-linen-shirt.jpg',
    modelImage: '/images/model-men-linen-shirt.jpg',
    slug: 'men-linen-shirt',
    colorName: 'Crisp Off-White',
  },
  {
    id: 'men-linen-kurta',
    name: 'Jaipur Linen Kurta',
    category: 'men',
    price: 2990,
    fabric: '100% Handloom Linen',
    image: '/images/men-linen-kurta.jpg',
    modelImage: '/images/model-men-linen-kurta.jpg',
    slug: 'men-linen-kurta',
    colorName: 'Warm Ivory',
  },
  {
    id: 'men-bomber-jacket',
    name: 'Stone Bomber Jacket',
    category: 'men',
    price: 5490,
    fabric: 'Cotton-Linen Garment Dyed Twill',
    image: '/images/men-bomber-jacket.jpg',
    modelImage: '/images/model-men-bomber-jacket.jpg',
    slug: 'men-bomber-jacket',
    colorName: 'Sand Stone',
  },
  {
    id: 'kids-cotton-frock',
    name: 'Petal Cotton Frock',
    category: 'kids',
    price: 1490,
    fabric: '100% GOTS Organic Cotton',
    image: '/images/kids-cotton-frock.jpg',
    modelImage: '/images/model-kids-frock.jpg',
    slug: 'kids-cotton-frock',
    colorName: 'Soft Cloud White',
  },
  {
    id: 'kids-hoodie',
    name: 'Cloud Kids Hoodie',
    category: 'kids',
    price: 1790,
    fabric: 'French Terry Organic Cotton',
    image: '/images/kids-hoodie.jpg',
    modelImage: '/images/model-kids-hoodie.jpg',
    slug: 'kids-hoodie',
    colorName: 'Oatmeal Cream',
  },
];

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const activePiece = FEATURED_PIECES[activeIdx];

  // Drag & rotation physics refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const angularVelocity = useRef(0);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);

  // Initialize Three.js 3D Stage with rotating model & flowing crystal thread
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 650;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient & Studio Key Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 0.9);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbfd3e6, 0.8);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // ── Luminous 3D Crystal Thread Helix around the Model ──
    const threadPoints: THREE.Vector3[] = [];
    const helixTurns = 3.5;
    const helixHeight = 3.6;
    const helixRadius = 1.35;
    const pointsCount = 180;

    for (let i = 0; i < pointsCount; i++) {
      const p = i / (pointsCount - 1);
      const angle = p * Math.PI * 2 * helixTurns - Math.PI * 0.8;
      const x = Math.cos(angle) * helixRadius;
      const y = (p - 0.5) * helixHeight;
      const z = Math.sin(angle) * (helixRadius * 0.7);
      threadPoints.push(new THREE.Vector3(x, y, z));
    }

    const threadCurve = new THREE.CatmullRomCurve3(threadPoints);
    const tubeGeometry = new THREE.TubeGeometry(threadCurve, 140, 0.016, 8, false);
    const threadMaterial = new THREE.MeshBasicMaterial({
      color: 0x89b6dc,
      transparent: true,
      opacity: 0.95,
    });
    const threadMesh = new THREE.Mesh(tubeGeometry, threadMaterial);
    scene.add(threadMesh);

    // Glowing halo tube for crystal glint
    const glowTube = new THREE.TubeGeometry(threadCurve, 140, 0.045, 8, false);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xbfd3e6,
      transparent: true,
      opacity: 0.35,
    });
    const glowMesh = new THREE.Mesh(glowTube, glowMaterial);
    scene.add(glowMesh);

    // Sparkling faceted crystal beads along thread
    const beadGeo = new THREE.OctahedronGeometry(0.04, 0);
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xbfd3e6,
      emissiveIntensity: 0.4,
    });

    [0.15, 0.35, 0.55, 0.75, 0.9].forEach((t) => {
      const pt = threadCurve.getPoint(t);
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.position.copy(pt);
      scene.add(bead);
    });

    // ── 3D Model Display Board with Cloth Flutter Shader ──
    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    const clothVertex = `
      uniform float uTime;
      uniform float uFlutter;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave = sin(pos.y * 3.5 + uTime * 2.0) * 0.03 * uFlutter;
        wave += cos(pos.x * 2.5 + uTime * 1.5) * 0.02 * uFlutter;
        pos.z += wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const clothFragment = `
      uniform sampler2D uTexture;
      uniform float uHover;
      varying vec2 vUv;
      void main() {
        vec4 tex = texture2D(uTexture, vUv);
        // Subtle crystal shimmer on edge
        if (uHover > 0.01) {
          float rim = smoothstep(0.4, 0.95, abs(vUv.x - 0.5) * 2.0);
          tex.rgb = mix(tex.rgb, vec3(0.75, 0.85, 0.95), rim * uHover * 0.25);
        }
        gl_FragColor = tex;
      }
    `;

    // Plane geometry sized for 3:4 portrait model photography
    const boardGeo = new THREE.PlaneGeometry(2.0, 2.66, 24, 32);

    // Pre-load all textures and build materials
    const materials: THREE.ShaderMaterial[] = FEATURED_PIECES.map((piece) => {
      const tex = textureLoader.load(piece.modelImage);
      tex.colorSpace = THREE.SRGBColorSpace;
      return new THREE.ShaderMaterial({
        vertexShader: clothVertex,
        fragmentShader: clothFragment,
        uniforms: {
          uTexture: { value: tex },
          uTime: { value: 0 },
          uFlutter: { value: 1.0 },
          uHover: { value: 0.0 },
        },
        side: THREE.DoubleSide,
      });
    });
    materialsRef.current = materials;

    const modelBoard = new THREE.Mesh(boardGeo, materials[activeIdx]);
    modelBoard.position.set(0, 0, 0);
    scene.add(modelBoard);
    meshRef.current = modelBoard;

    // ── Mouse & Touch 360° Drag & Hover Controls ──
    let isHovered = false;

    const handlePointerDown = (clientX: number) => {
      isDragging.current = true;
      startX.current = clientX;
      angularVelocity.current = 0;
      setIsRotating(true);
    };

    const handlePointerMove = (clientX: number) => {
      if (isDragging.current) {
        const deltaX = clientX - startX.current;
        startX.current = clientX;
        // Direct tactile 360 degree rotation impulse
        const deltaRad = (deltaX / width) * Math.PI * 3.2;
        targetRotation.current += deltaRad;
        angularVelocity.current = deltaRad * 0.4;
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      setIsRotating(false);
    };

    // DOM event listeners on canvas container
    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX);
    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX);
      // Subtle hover rotation when just moving cursor over canvas
      if (!isDragging.current) {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetRotation.current += normX * 0.015;
      }
    };
    const onMouseUp = () => handlePointerUp();
    const onMouseEnter = () => {
      isHovered = true;
      if (modelBoard.material instanceof THREE.ShaderMaterial) {
        modelBoard.material.uniforms.uHover.value = 1.0;
      }
    };
    const onMouseLeave = () => {
      isHovered = false;
      isDragging.current = false;
      setIsRotating(false);
      if (modelBoard.material instanceof THREE.ShaderMaterial) {
        modelBoard.material.uniforms.uHover.value = 0.0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointerDown(e.touches[0].clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handlePointerUp();

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // ── Continuous Animation Loop with Fluid Inertia ──
    let animId = 0;
    let clockTime = 0;

    const animate = () => {
      clockTime += 0.016;

      // Apply inertia & damping
      if (!isDragging.current) {
        // Idle gentle float and continuous slow turntable rotate
        targetRotation.current += 0.003 + angularVelocity.current;
        angularVelocity.current *= 0.92;
      }

      // Smooth spring interpolation towards target rotation
      currentRotation.current += (targetRotation.current - currentRotation.current) * 0.12;
      modelBoard.rotation.y = currentRotation.current;

      // Subtle idle breathing sway on Y and Z
      modelBoard.position.y = Math.sin(clockTime * 1.4) * 0.04;
      modelBoard.rotation.z = Math.sin(clockTime * 0.8) * 0.015;

      // Rotate crystal thread helix slightly for luminous glint
      threadMesh.rotation.y = clockTime * 0.15;
      glowMesh.rotation.y = clockTime * 0.15;

      // Update shader uniforms
      if (modelBoard.material instanceof THREE.ShaderMaterial) {
        modelBoard.material.uniforms.uTime.value = clockTime;
        modelBoard.material.uniforms.uFlutter.value = isHovered || isDragging.current ? 1.8 : 0.8;
      }

      // Update UI degrees
      const deg = Math.round(((currentRotation.current % (Math.PI * 2)) / (Math.PI * 2)) * 360);
      setRotationAngle(deg >= 0 ? deg : 360 + deg);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Switch garment material when active piece changes
  const handleSelectPiece = useCallback((index: number) => {
    setActiveIdx(index);
    if (meshRef.current && materialsRef.current[index]) {
      meshRef.current.material = materialsRef.current[index];
    }
  }, []);

  return (
    <section className="relative w-full bg-[#F7F5F0] overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 border-b border-black/[0.06]">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ── Left Column: Editorial Headline, Luxury Value Props & Quick Actions ── */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8 z-10">
            {/* Atelier Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/10 rounded-full w-fit shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#BFD3E6]" />
              <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase text-ink">
                Summer &rsquo;26 Atelier Launch
              </span>
            </div>

            {/* Oversized Confident Editorial Headline */}
            <div>
              <h1 className="text-display text-[clamp(2.8rem,5.6vw,5.4rem)] text-ink leading-[0.98] tracking-tight">
                The Architecture<br />
                <span className="font-serif italic font-normal text-ink/80">of Linen.</span>
              </h1>
              <p className="mt-4 text-[13px] md:text-[14px] uppercase tracking-[0.18em] text-ink/60 font-medium">
                European Flax • Pure Handloom Silk • Single-Needle French Seams
              </p>
            </div>

            {/* Human Editorial Copy */}
            <p className="text-[15px] md:text-[16px] text-ink/75 max-w-[500px] leading-relaxed font-sans">
              Hand-drafted silhouettes for men and children. No fast drops, no polyester blends.
              Every shirt and kurta breathes effortlessly in peak Indian summer and softens with every wear.
            </p>

            {/* Primary Action Buttons (The Souled Store Benchmark + Atelier Cleanliness) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/men"
                className="px-8 py-4 bg-ink text-[#F7F5F0] text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-ink/85 transition-all shadow-md flex items-center gap-2 group"
              >
                <span>Shop Men&rsquo;s Edit</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/kids"
                className="px-8 py-4 bg-white border border-ink/20 hover:border-ink text-ink text-[11px] font-semibold tracking-[0.18em] uppercase transition-all shadow-2xs"
              >
                <span>Children&rsquo;s Atelier</span>
              </Link>

              <Link
                href={`/try-on?garment=${activePiece.slug}`}
                className="px-5 py-4 bg-[#EAF1F8] border border-[#BFD3E6] hover:border-ink text-ink text-[11px] font-semibold tracking-[0.16em] uppercase transition-all shadow-xs flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>AI Virtual Try-On ✦</span>
              </Link>
            </div>

            {/* Piece Quick Switcher Bar directly in Hero */}
            <div className="pt-4 border-t border-black/[0.06]">
              <p className="text-[10px] tracking-[0.18em] uppercase text-ink/50 font-medium mb-3">
                Featured Atelier Silhouettes (Click to inspect in 3D):
              </p>
              <div className="flex flex-wrap gap-2">
                {FEATURED_PIECES.map((piece, idx) => (
                  <button
                    key={piece.id}
                    onClick={() => handleSelectPiece(idx)}
                    className={`text-[11px] tracking-wider uppercase px-3.5 py-1.5 border transition-all cursor-pointer ${
                      activeIdx === idx
                        ? 'bg-ink text-[#F7F5F0] border-ink font-semibold shadow-xs'
                        : 'bg-white text-ink/70 border-black/10 hover:border-black/30 hover:text-ink'
                    }`}
                  >
                    {piece.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Proof Badges */}
            <div className="flex items-center gap-6 pt-2 text-[11px] text-ink/65 uppercase tracking-wider font-medium">
              <div className="flex items-center gap-1.5 text-amber-800">
                <span>★ ★ ★ ★ ★</span>
                <span className="text-ink font-semibold">4.9</span>
                <span className="text-ink/50">(2,400+ Reviews)</span>
              </div>
              <span className="text-ink/20">•</span>
              <div>Free Shipping Over ₹999</div>
              <span className="text-ink/20 hidden sm:inline">•</span>
              <div className="hidden sm:inline">15-Day Easy Returns</div>
            </div>
          </div>

          {/* ── Right Column: Interactive 3D Model Stage with 360° Cursor & Drag Rotation ── */}
          <div className="lg:col-span-6 flex flex-col items-center relative">
            {/* 3D Canvas Box */}
            <div
              className="relative w-full aspect-[4/5] max-w-[540px] bg-gradient-to-b from-white to-[#F2EFE9] border border-black/[0.08] rounded-xs shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none group"
              data-cursor="Rotate 360°"
            >
              {/* Three.js Container */}
              <div ref={containerRef} className="w-full h-full" />

              {/* Floating 360° Interaction Hint Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-black/10 px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase font-semibold text-ink shadow-xs flex items-center gap-2 pointer-events-none">
                <span className="animate-spin text-[#5B82A6]">↺</span>
                <span>360° Drag / Hover to Rotate</span>
                <span className="text-ink/40 font-mono">({rotationAngle}°)</span>
              </div>

              {/* AI Model Tag Pill */}
              <div className="absolute top-4 right-4 bg-ink/90 text-white backdrop-blur-md px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase font-semibold shadow-xs flex items-center gap-1.5 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>AI Fashion Model</span>
              </div>

              {/* Garment Information Strip at the Base of the Stage */}
              <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-black/10 p-4 md:p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] tracking-[0.18em] uppercase text-accent-dark font-semibold">
                      {activePiece.category === 'men' ? 'Men’s Edit' : 'Children’s Atelier'}
                    </span>
                    <span className="text-ink/30">•</span>
                    <span className="text-[11px] text-ink/60">{activePiece.colorName}</span>
                  </div>
                  <h3 className="text-base font-serif font-medium text-ink">
                    {activePiece.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-semibold text-ink">
                      ₹{activePiece.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-ink/40 line-through">
                      ₹{Math.round(activePiece.price * 1.35).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      26% OFF
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end gap-2">
                  <Link
                    href={`/try-on?garment=${activePiece.slug}`}
                    className="px-4 py-2 bg-ink text-white hover:bg-ink/80 text-[10px] font-semibold tracking-[0.16em] uppercase transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>Try On ✦</span>
                  </Link>
                  <Link
                    href={`/product/${activePiece.slug}`}
                    className="text-[10px] tracking-[0.14em] uppercase text-ink/60 hover:text-ink pb-0.5 border-b border-ink/20 hover:border-ink"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>

            {/* Instruction footnote below 3D stage */}
            <p className="mt-3 text-[11px] text-ink/40 tracking-wider uppercase text-center">
              Crystal Thread Atelier Engine • Drag left or right to inspect 360° drape
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
