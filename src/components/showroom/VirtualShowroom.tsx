'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { formatPrice, getPricingMeta } from '@/lib/utils';

export interface ShowroomGarment {
  id: string;
  slug: string;
  name: string;
  category: 'men' | 'kids';
  subCategory: string;
  price: number;
  fabric: string;
  description: string;
  color: string;
  garmentImg: string;
  modelImg: string;
  sizes: string[];
  pos: [number, number, number];
  scale: number;
}

const SHOWROOM_ITEMS: ShowroomGarment[] = [
  {
    id: 'men-linen-shirt',
    slug: 'men-linen-shirt',
    name: 'Riviera Linen Shirt',
    category: 'men',
    subCategory: 'Shirts',
    price: 3490,
    fabric: '100% European Flax Linen, 150 gsm',
    description: 'Camp collar, washed Italian flax, mother-of-pearl buttons. Generous through the chest with an untucked drape.',
    color: 'Crisp Off-White',
    garmentImg: '/images/men-linen-shirt.jpg',
    modelImg: '/images/model-men-linen-shirt.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    pos: [-5.5, -0.65, -0.1],
    scale: 1.25,
  },
  {
    id: 'men-cotton-tee',
    slug: 'men-cotton-tee',
    name: 'Breeze Crew Tee',
    category: 'men',
    subCategory: 'Tees',
    price: 1290,
    fabric: '100% Supima Cotton, 180 gsm',
    description: 'Ring-spun Supima cotton, enzyme-washed for a broken-in feel from day one. Rolled hems that never bunch.',
    color: 'Pale Sky Blue',
    garmentImg: '/images/men-cotton-tee.jpg',
    modelImg: '/images/lookbook-men-1.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    pos: [-3.3, -0.65, 0.05],
    scale: 1.25,
  },
  {
    id: 'men-linen-kurta',
    slug: 'men-linen-kurta',
    name: 'Jaipur Linen Kurta',
    category: 'men',
    subCategory: 'Kurtas',
    price: 2990,
    fabric: '100% Handloom Linen, 140 gsm',
    description: 'Hand-finished mandarin collar with a single-needle run stitch. Pure breathability in peak heat.',
    color: 'Warm Ivory',
    garmentImg: '/images/men-linen-kurta.jpg',
    modelImg: '/images/model-men-linen-kurta.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    pos: [-1.1, -0.65, 0.2],
    scale: 1.35,
  },
  {
    id: 'men-bomber-jacket',
    slug: 'men-bomber-jacket',
    name: 'Stone Bomber Jacket',
    category: 'men',
    subCategory: 'Jackets',
    price: 5490,
    fabric: 'Garment-Dyed Cotton-Linen Twill, 220 gsm',
    description: 'Two-way brass zip, brushed cotton lining, ribbed cuffs. The ultimate summer-to-autumn outer layer.',
    color: 'Sand Stone',
    garmentImg: '/images/men-bomber-jacket.jpg',
    modelImg: '/images/model-men-bomber-jacket.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    pos: [1.1, -0.80, 0.15],
    scale: 1.2,
  },
  {
    id: 'kids-cotton-frock',
    slug: 'kids-cotton-frock',
    name: 'Petal Cotton Frock',
    category: 'kids',
    subCategory: 'Dresses',
    price: 1490,
    fabric: '100% GOTS Organic Cotton, 140 gsm',
    description: 'Tagless collar, flat French seams that never scratch sensitive skin, and a generous let-down hem.',
    color: 'Soft Cloud White',
    garmentImg: '/images/kids-cotton-frock.jpg',
    modelImg: '/images/model-kids-frock.jpg',
    sizes: ['2Y', '3Y', '4Y', '5Y'],
    pos: [3.3, -0.8, -0.05],
    scale: 1.15,
  },
  {
    id: 'kids-hoodie',
    slug: 'kids-hoodie',
    name: 'Cloud Kids Hoodie',
    category: 'kids',
    subCategory: 'Tops',
    price: 1790,
    fabric: '100% Cotton French Terry, 280 gsm',
    description: 'Smooth jersey lining, easy YKK zip for small fingers, pre-shrunk for effortless machine washing.',
    color: 'Oatmeal Cream',
    garmentImg: '/images/kids-hoodie.jpg',
    modelImg: '/images/model-kids-hoodie.jpg',
    sizes: ['5Y', '6Y', '7Y', '8Y'],
    pos: [5.5, -0.65, -0.15],
    scale: 1.15,
  },
];

export default function VirtualShowroom({
  onAddToCart,
}: {
  onAddToCart?: (item: ShowroomGarment, size: string) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | 'men' | 'kids'>('all');
  const [hoveredGarment, setHoveredGarment] = useState<ShowroomGarment | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<ShowroomGarment | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [showDrawer, setShowDrawer] = useState(false);

  // Animation & Three.js state refs
  const mousePos = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const meshList = useRef<THREE.Mesh[]>([]);
  const springList = useRef<{
    angleY: number;
    velY: number;
    targetY: number;
    angleX: number;
    velX: number;
    targetX: number;
    spin360Progress: number;
    isSpinning360: boolean;
  }[]>([]);

  // Open drawer when garment clicked
  const handleOpenDrawer = useCallback((item: ShowroomGarment) => {
    setSelectedGarment(item);
    setSelectedSize(item.sizes[0] || 'M');
    setShowDrawer(true);
  }, []);

  // Trigger exactly one 360 spin for a specific garment
  const handleSpin360 = useCallback((idx: number) => {
    const sp = springList.current[idx];
    if (sp && !sp.isSpinning360) {
      sp.isSpinning360 = true;
      sp.spin360Progress = 0;
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // ── Three.js Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070709);
    scene.fog = new THREE.FogExp2(0x070709, 0.045);

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 54 : 45,
      width / height,
      0.1,
      100
    );
    camera.position.set(0, isMobile ? -0.2 : 0.0, isMobile ? 12.0 : 8.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Remove any leftover canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // ── Dramatic Dark Luxury Atelier Lighting ──
    const ambientLight = new THREE.AmbientLight(0x22222a, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbfd3e6, 1.8);
    rimLight.position.set(-5, 4, -3);
    scene.add(rimLight);

    const bottomLight = new THREE.PointLight(0x7dd3fc, 1.2, 14);
    bottomLight.position.set(0, -3, 3);
    scene.add(bottomLight);

    // ── Luminous Overhead Crystal Thread in 3D (Safely elevated above all garments) ──
    const curvePoints: THREE.Vector3[] = [];
    const threadSegments = 180;
    const xMin = -9.2;
    const xMax = 9.2;

    for (let i = 0; i < threadSegments; i++) {
      const t = i / (threadSegments - 1);
      const x = xMin + t * (xMax - xMin);
      // Delicate overhead suspension arc gracefully spanning above the garments
      const y = 1.35 + Math.sin(t * Math.PI) * 0.18;
      const z = -0.15;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const threadCurve = new THREE.CatmullRomCurve3(curvePoints);

    // Ultra-delicate luminous filament (fine jewellery silk wire, never a thick pipe)
    const tubeGeo = new THREE.TubeGeometry(threadCurve, 180, 0.004, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mainThread = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(mainThread);

    // Soft subtle ice-blue ambient halo
    const glowGeo = new THREE.TubeGeometry(threadCurve, 180, 0.014, 8, false);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.35,
    });
    const glowThread = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowThread);

    // Subtle glint crystal bead geometry
    const beadGeo = new THREE.OctahedronGeometry(0.032, 0);
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xbfd3e6,
      emissiveIntensity: 0.5,
    });

    // ── Garments in 3D: Tactile Cursor-Flow Rotation + Crystal Sheen ──
    const textureLoader = new THREE.TextureLoader();
    const meshes: THREE.Mesh[] = [];
    const springs: {
      angleY: number;
      velY: number;
      targetY: number;
      angleX: number;
      velX: number;
      targetX: number;
      spin360Progress: number;
      isSpinning360: boolean;
    }[] = [];

    const clothVertex = `
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave = sin(pos.y * 3.5 + uTime * 2.0) * 0.025 * uIntensity;
        wave += cos(pos.x * 2.5 + uTime * 1.5) * 0.015 * uIntensity;
        pos.z += wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const clothFragment = `
      uniform sampler2D uTexture;
      uniform float uHover;
      uniform float uTime;
      varying vec2 vUv;

      float roundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }

      void main() {
        vec2 p = vUv - 0.5;
        float d = roundedBox(p, vec2(0.47, 0.47), 0.035);
        if (d > 0.0) discard;

        vec4 tex = texture2D(uTexture, vUv);
        
        // Hairline card border
        float border = 1.0 - smoothstep(0.0, 0.007, abs(d));
        vec3 borderColor = mix(vec3(0.18, 0.20, 0.25), vec3(0.75, 0.85, 0.98), uHover);
        
        vec3 col = tex.rgb;

        // Subtle luminous crystal thread sheen sweep on hover
        if (uHover > 0.01) {
          float sheenPos = fract(uTime * 0.4);
          float sheen = smoothstep(0.0, 0.12, 0.12 - abs(vUv.x - sheenPos)) * uHover * 0.22;
          col += vec3(0.75, 0.88, 1.0) * sheen;
          col += vec3(0.03, 0.05, 0.08) * uHover;
        }

        col = mix(col, borderColor, border * 0.95);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    SHOWROOM_ITEMS.forEach((item, idx) => {
      springs.push({
        angleY: 0,
        velY: 0,
        targetY: 0,
        angleX: 0,
        velX: 0,
        targetX: 0,
        spin360Progress: 0,
        isSpinning360: false,
      });

      const tex = textureLoader.load(item.garmentImg);
      tex.colorSpace = THREE.SRGBColorSpace;

      const aspect = 3 / 4;
      const w = 1.62 * item.scale;
      const h = w / aspect;
      const planeGeo = new THREE.PlaneGeometry(w, h, 24, 28);

      const mat = new THREE.ShaderMaterial({
        vertexShader: clothVertex,
        fragmentShader: clothFragment,
        uniforms: {
          uTexture: { value: tex },
          uTime: { value: 0 },
          uIntensity: { value: 0.6 },
          uHover: { value: 0.0 },
        },
        transparent: true,
        alphaTest: 0.05,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.position.set(item.pos[0], item.pos[1], item.pos[2]);
      mesh.userData = { item, idx, initialY: item.pos[1], initialX: item.pos[0] };
      scene.add(mesh);
      meshes.push(mesh);

      // Fine glowing thread connecting overhead curve to garment top
      const tNorm = (item.pos[0] - xMin) / (xMax - xMin);
      const threadPt = threadCurve.getPoint(Math.max(0, Math.min(1, tNorm)));
      const cardTopY = item.pos[1] + h * 0.485;
      const hangPts = [
        threadPt,
        new THREE.Vector3(item.pos[0], cardTopY, item.pos[2]),
      ];
      const hangGeo = new THREE.BufferGeometry().setFromPoints(hangPts);
      const hangMat = new THREE.LineBasicMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.55,
      });
      const hangLine = new THREE.Line(hangGeo, hangMat);
      scene.add(hangLine);

      // Delicate faceted crystal bead at overhead rail suspension knot
      const hookBead = new THREE.Mesh(beadGeo, beadMat);
      hookBead.position.copy(threadPt);
      scene.add(hookBead);
    });

    meshList.current = meshes;
    springList.current = springs;

    // ── Mouse & Touch Raycasting & Interactive Flow ──
    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(-999, -999);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const currentY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mousePos.current.x = currentX;
      mousePos.current.y = currentY;
      mouseNorm.x = currentX;
      mouseNorm.y = currentY;
    };

    const onPointerLeave = () => {
      mouseNorm.x = -999;
      mouseNorm.y = -999;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNorm, camera);
      const visibleMeshes = meshes.filter((m) => m.visible);
      const intersects = raycaster.intersectObjects(visibleMeshes);

      if (intersects.length > 0) {
        const clicked = intersects[0].object.userData.item as ShowroomGarment;
        if (clicked) handleOpenDrawer(clicked);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const t = e.touches[0];
      const rect = container.getBoundingClientRect();
      const currentX = ((t.clientX - rect.left) / rect.width) * 2 - 1;
      const currentY = -((t.clientY - rect.top) / rect.height) * 2 + 1;

      mousePos.current.x = currentX;
      mousePos.current.y = currentY;
      mouseNorm.x = currentX;
      mouseNorm.y = currentY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches[0]) {
        const t = e.changedTouches[0];
        const rect = container.getBoundingClientRect();
        mouseNorm.x = ((t.clientX - rect.left) / rect.width) * 2 - 1;
        mouseNorm.y = -((t.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseNorm, camera);
        const visibleMeshes = meshes.filter((m) => m.visible);
        const intersects = raycaster.intersectObjects(visibleMeshes);
        if (intersects.length > 0) {
          const clicked = intersects[0].object.userData.item as ShowroomGarment;
          if (clicked) handleOpenDrawer(clicked);
        }
      }
    };

    window.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mouseleave', onPointerLeave);
    container.addEventListener('click', onClick);
    container.addEventListener('touchstart', onTouchMove, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // ── 60 FPS Render Loop: Controlled Cursor Flow (No Over-rotation) ──
    let animId = 0;

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;

      // Smooth subtle camera easing with cursor
      camera.position.x += (mousePos.current.x * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (mousePos.current.y * 0.3 + (isMobile ? -0.2 : 0.0) - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Raycast hover check
      raycaster.setFromCamera(mouseNorm, camera);
      const visibleMeshes = meshes.filter((m) => m.visible);
      const intersects = raycaster.intersectObjects(visibleMeshes);
      let hoveredItem: ShowroomGarment | null = null;

      if (intersects.length > 0) {
        hoveredItem = intersects[0].object.userData.item as ShowroomGarment;
      }
      setHoveredGarment(hoveredItem);

      meshes.forEach((mesh, idx) => {
        const spring = springs[idx];
        const isHovered = hoveredItem && hoveredItem.id === mesh.userData.item.id;
        const mat = mesh.material as THREE.ShaderMaterial;

        mat.uniforms.uTime.value = time;

        if (spring.isSpinning360) {
          // Exactly ONE controlled 360 spin (0 -> 2pi) on user request
          spring.spin360Progress += 0.04;
          if (spring.spin360Progress >= 1.0) {
            spring.isSpinning360 = false;
            spring.spin360Progress = 0;
            spring.angleY = 0;
            spring.targetY = 0;
          } else {
            // Smooth ease in-out cubic
            const p = spring.spin360Progress;
            const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            spring.angleY = eased * Math.PI * 2;
          }
          mesh.rotation.y = spring.angleY;
        } else if (isHovered) {
          // Cursor-Flow Tilt: Follow cursor position across card (bounded within ±28 degrees)
          // NEVER automatically spins continuously past 360 degrees!
          const cardProj = mesh.position.clone().project(camera);
          const deltaX = Math.max(-1.0, Math.min(1.0, (mouseNorm.x - cardProj.x) * 3.5));
          const deltaY = Math.max(-1.0, Math.min(1.0, (mouseNorm.y - cardProj.y) * 3.5));

          // Target rotation smoothly follows the cursor flow
          spring.targetY = deltaX * 0.48; // Max ~27 degrees
          spring.targetX = -deltaY * 0.18; // Max ~10 degrees

          // Spring physics to glide smoothly with cursor
          spring.velY += (spring.targetY - spring.angleY) * 0.14;
          spring.velY *= 0.78;
          spring.angleY += spring.velY;

          spring.velX += (spring.targetX - spring.angleX) * 0.14;
          spring.velX *= 0.78;
          spring.angleX += spring.velX;

          mat.uniforms.uIntensity.value = 1.4;
          mat.uniforms.uHover.value = Math.min(1.0, mat.uniforms.uHover.value + 0.08);

          mesh.rotation.y = spring.angleY;
          mesh.rotation.x = spring.angleX;
        } else {
          // Smoothly return to front facing angle (0.00) when cursor leaves
          spring.targetY = 0;
          spring.targetX = 0;

          spring.velY += (spring.targetY - spring.angleY) * 0.12;
          spring.velY *= 0.82;
          spring.angleY += spring.velY;

          spring.velX += (spring.targetX - spring.angleX) * 0.12;
          spring.velX *= 0.82;
          spring.angleX += spring.velX;

          mat.uniforms.uIntensity.value = 0.6;
          mat.uniforms.uHover.value = Math.max(0.0, mat.uniforms.uHover.value - 0.05);

          // Micro idle breeze sway (less than 1 degree)
          const idleSway = Math.sin(time * 0.9 + idx * 1.4) * 0.015;
          mesh.rotation.y = spring.angleY + idleSway;
          mesh.rotation.x = spring.angleX;
        }

        // Gentle vertical breathing along the thread
        mesh.position.y = mesh.userData.initialY + Math.sin(time * 0.8 + idx * 1.8) * 0.025;
      });

      // Subtle crystal thread shimmer
      mainThread.rotation.y = Math.sin(time * 0.2) * 0.025;
      glowThread.rotation.y = Math.sin(time * 0.2) * 0.025;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mob = w < 768;
      camera.aspect = w / h;
      camera.fov = mob ? 54 : 45;
      camera.position.set(0, mob ? -0.2 : 0.0, mob ? 12.0 : 8.4);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mouseleave', onPointerLeave);
      container.removeEventListener('click', onClick);
      container.removeEventListener('touchstart', onTouchMove);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [handleOpenDrawer]);

  // Filter 3D visibility based on tab
  useEffect(() => {
    meshList.current.forEach((mesh) => {
      const item = mesh.userData.item as ShowroomGarment;
      if (filter === 'all' || item.category === filter) {
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  }, [filter]);

  return (
    <div className="relative w-full h-[90vh] max-h-[880px] min-h-[680px] bg-[#070709] overflow-hidden select-none">
      {/* ── Three.js 3D Virtual Showroom Canvas ── */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer" />

      {/* ── Top HUD Controls: Contemporary Fashion Header & Filter Tabs ── */}
      <div className="absolute top-20 sm:top-24 md:top-28 inset-x-0 z-20 pointer-events-none px-4">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 bg-[#101015]/90 border border-white/10 rounded-full mb-2 backdrop-blur-md shadow-lg pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC] animate-pulse" />
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-[#BFD3E6]">
              ✦ 3D Interactive Showroom
            </span>
          </div>

          {/* Heading in Modern Bold Sans */}
          <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-4xl lg:text-[2.75rem] text-white tracking-tight uppercase leading-[1.05] drop-shadow-md">
            Pure Fabric. Perfect Fit.
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-[11px] sm:text-xs md:text-sm text-zinc-300 mt-1 sm:mt-2 max-w-[340px] sm:max-w-xl font-normal leading-relaxed drop-shadow">
            Move your cursor across any piece to inspect the drape in 3D. Click to view on real model.
          </p>

          {/* Category Switcher Tabs */}
          <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-[#121217]/90 backdrop-blur-xl p-1 sm:p-1.5 border border-white/10 shadow-2xl rounded-full">
            {(['all', 'men', 'kids'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-[9px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.16em] uppercase font-bold px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.35)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All (6)' : tab === 'men' ? 'Men (4)' : 'Kids (2)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live Hover Garment Tooltip / Card floating in 3D ── */}
      {hoveredGarment && !showDrawer && (
        <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-auto bg-[#101015]/95 backdrop-blur-xl border border-white/15 px-4 sm:px-6 py-3 sm:py-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-4 sm:gap-6 animate-fadeIn transition-all rounded-xs max-w-[92vw]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-[#BFD3E6] font-bold truncate">
                {hoveredGarment.category === 'men' ? "Men's Collection" : "Kids' Collection"}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate">{hoveredGarment.color}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {hoveredGarment.name}
            </p>
            <p className="text-[12px] sm:text-[13px] font-bold text-[#BFD3E6]">
              {formatPrice(hoveredGarment.price)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                const idx = SHOWROOM_ITEMS.findIndex((i) => i.id === hoveredGarment.id);
                if (idx !== -1) handleSpin360(idx);
              }}
              className="px-3 py-2 bg-white/[0.08] hover:bg-white hover:text-black border border-white/15 text-white text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase transition-all cursor-pointer whitespace-nowrap"
              title="Perform a complete 360 degree spin"
            >
              Spin 360° ✦
            </button>
            <button
              onClick={() => handleOpenDrawer(hoveredGarment)}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-white text-black text-[9px] sm:text-[10px] font-bold tracking-[0.16em] uppercase hover:bg-[#BFD3E6] transition-all cursor-pointer shadow-lg flex items-center gap-1 whitespace-nowrap"
            >
              <span>View On Model →</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom HUD Footnote: 3D Interaction Guide ── */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-10 pointer-events-none flex justify-center px-4">
        <div className="bg-[#121217]/85 backdrop-blur-md border border-white/10 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.16em] uppercase font-semibold text-zinc-300 shadow-xl flex items-center gap-2 max-w-[92vw]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC] animate-pulse flex-shrink-0" />
          <span className="truncate">Move cursor over clothes to tilt 3D • Tap to view on model</span>
        </div>
      </div>

      {/* ── Slide-Out Atelier Garment & AI Model Drawer ── */}
      {showDrawer && selectedGarment && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
          {/* Backdrop click close */}
          <div className="flex-1" onClick={() => setShowDrawer(false)} />

          {/* Drawer Content */}
          <div className="w-full max-w-[500px] h-full bg-[#0D0D11] border-l border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-y-auto animate-slideLeft p-6 md:p-8 text-white">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#BFD3E6]">
                  {selectedGarment.category === 'men' ? 'Men’s Atelier' : 'Children’s Atelier'}
                </span>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors cursor-pointer text-sm"
                  aria-label="Close drawer"
                >
                  ✕
                </button>
              </div>

              {/* AI Model Photo Wearing the Garment */}
              <div className="mt-6 relative aspect-[3/4] bg-[#141418] border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src={selectedGarment.modelImg}
                  alt={`${selectedGarment.name} worn by model`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 text-[9px] font-semibold tracking-widest uppercase text-[#BFD3E6] border border-white/15 shadow-sm">
                  Model Fit Preview
                </div>
                <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1 text-[9px] font-semibold tracking-widest uppercase text-white border border-white/15">
                  {selectedGarment.color}
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-2xl font-display font-bold text-white tracking-tight uppercase">
                    {selectedGarment.name}
                  </h2>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white">
                      {formatPrice(selectedGarment.price)}
                    </span>
                    <span className="block text-[11px] text-zinc-500 line-through">
                      {formatPrice(getPricingMeta(selectedGarment.price).mrp)}
                    </span>
                  </div>
                </div>

                <p className="text-[12px] font-medium text-[#BFD3E6] tracking-wide mb-2">
                  {selectedGarment.fabric}
                </p>

                <p className="text-[13px] text-zinc-300 leading-relaxed font-sans mb-6">
                  {selectedGarment.description}
                </p>

                {/* Size Selector */}
                <div className="mb-6">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-semibold text-zinc-400 block mb-2">
                    Select Size:
                  </label>
                  <div className="flex gap-2">
                    {selectedGarment.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[44px] h-10 px-3 flex items-center justify-center border text-[12px] font-mono transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-white text-black border-white font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                            : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Link
                href={`/try-on?garment=${selectedGarment.slug}`}
                className="w-full py-3.5 bg-[#BFD3E6]/10 border border-[#BFD3E6]/50 hover:bg-[#BFD3E6] hover:text-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase transition-all shadow-[0_0_15px_rgba(191,211,230,0.15)] flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-ping" />
                <span>Try It On in AI Fit Room ✦</span>
              </Link>

              <button
                onClick={() => {
                  if (onAddToCart) onAddToCart(selectedGarment, selectedSize);
                  setShowDrawer(false);
                }}
                className="w-full py-4 bg-white text-black text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add To Bag — {formatPrice(selectedGarment.price)}</span>
              </button>

              <Link
                href={`/product/${selectedGarment.slug}`}
                className="block text-center text-[10px] tracking-[0.16em] uppercase text-zinc-500 hover:text-zinc-300 pt-1"
              >
                View Full Garment Dossier & Sizing Chart →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
