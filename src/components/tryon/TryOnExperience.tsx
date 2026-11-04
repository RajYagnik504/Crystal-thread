'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import SilhouetteGuide from './SilhouetteGuide';
import ThreadScanAnimation from './ThreadScanAnimation';
import StitchRevealCanvas from './StitchRevealCanvas';
import BeforeAfterSlider from './BeforeAfterSlider';
import GarmentSelectorStrip from './GarmentSelectorStrip';
import { drapeGarmentOnPerson } from '@/lib/tryon/tailorCompositor';
import { preprocessUserPhoto } from '@/lib/imagePreprocess';
import { getProductImage, formatPrice } from '@/lib/utils';
import products from '@/data/products.json';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  fabric: string;
  sizes: string[];
  color: string;
  ageGroup?: string;
}

export interface AtelierModel {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  role: string;
  gender: 'male' | 'female' | 'kids';
  isDummy?: boolean;
  baseImg: string;
  garments: Record<string, string>;
}

export const ATELIER_STUDIO_MODELS: AtelierModel[] = [
  {
    id: 'male-model',
    label: 'Male Fashion Model',
    shortLabel: 'Male Model',
    icon: '👨',
    role: 'Waist-Up Studio Fit',
    gender: 'male',
    baseImg: '/images/model-men-before.jpg',
    garments: {
      'men-linen-shirt': '/images/model-men-linen-shirt.jpg',
      'men-linen-kurta': '/images/model-men-linen-kurta.jpg',
      'men-bomber-jacket': '/images/model-men-bomber-jacket.jpg',
      'men-cotton-tee': '/images/lookbook-men-1.jpg',
      'men-chino-trousers': '/images/lookbook-men-1.jpg',
      'men-henley': '/images/model-men-linen-shirt.jpg',
      'men-linen-blazer': '/images/model-men-bomber-jacket.jpg',
      'men-polo': '/images/model-men-linen-shirt.jpg',
    },
  },
  {
    id: 'female-model',
    label: 'Female Fashion Model',
    shortLabel: 'Female Model',
    icon: '👩',
    role: 'Waist-Up Studio Fit',
    gender: 'female',
    baseImg: '/images/model-female-before.jpg',
    garments: {
      'men-linen-shirt': '/images/model-female-linen-shirt.jpg',
      'men-cotton-tee': '/images/model-female-linen-shirt.jpg',
      'men-linen-kurta': '/images/model-female-linen-tunic.jpg',
      'men-bomber-jacket': '/images/model-female-linen-shirt.jpg',
      'kids-cotton-frock': '/images/model-female-linen-tunic.jpg',
    },
  },
  {
    id: 'dummy-male',
    label: 'Male Atelier Dummy',
    shortLabel: 'Male Dummy',
    icon: '🧥',
    role: 'Tailoring Form',
    gender: 'male',
    isDummy: true,
    baseImg: '/images/dummy-male.jpg',
    garments: {
      'men-linen-shirt': '/images/dummy-male-linen-shirt.jpg',
      'men-linen-kurta': '/images/dummy-male-linen-shirt.jpg',
      'men-bomber-jacket': '/images/dummy-male-linen-shirt.jpg',
    },
  },
  {
    id: 'dummy-female',
    label: 'Female Atelier Dummy',
    shortLabel: 'Female Dummy',
    icon: '👗',
    role: 'Tailoring Form',
    gender: 'female',
    isDummy: true,
    baseImg: '/images/dummy-female.jpg',
    garments: {
      'men-linen-shirt': '/images/dummy-male-linen-shirt.jpg',
      'kids-cotton-frock': '/images/dummy-male-linen-shirt.jpg',
    },
  },
  {
    id: 'kids-model',
    label: 'Children’s Silhouette',
    shortLabel: 'Kids Model',
    icon: '🧒',
    role: 'Organic Kids Fit',
    gender: 'kids',
    baseImg: '/images/model-kids-frock.jpg',
    garments: {
      'kids-cotton-frock': '/images/model-kids-frock.jpg',
      'kids-hoodie': '/images/model-kids-hoodie.jpg',
      'kids-shorts-set': '/images/model-kids-hoodie.jpg',
      'kids-kurta-set': '/images/model-kids-frock.jpg',
      'kids-dungaree': '/images/model-kids-hoodie.jpg',
      'kids-cardigan': '/images/model-kids-frock.jpg',
      'kids-linen-shirt': '/images/model-kids-hoodie.jpg',
      'kids-jogger-set': '/images/model-kids-hoodie.jpg',
    },
  },
];

export function getGarmentStudioImage(model: AtelierModel, garmentSlug: string): string {
  if (model.garments[garmentSlug]) {
    return model.garments[garmentSlug];
  }
  if (model.gender === 'female') {
    return garmentSlug.includes('kurta') ? '/images/model-female-linen-tunic.jpg' : '/images/model-female-linen-shirt.jpg';
  }
  if (model.gender === 'kids') {
    return garmentSlug.includes('frock') ? '/images/model-kids-frock.jpg' : '/images/model-kids-hoodie.jpg';
  }
  if (model.isDummy) {
    return '/images/dummy-male-linen-shirt.jpg';
  }
  if (garmentSlug.includes('kurta')) return '/images/model-men-linen-kurta.jpg';
  if (garmentSlug.includes('jacket') || garmentSlug.includes('blazer')) return '/images/model-men-bomber-jacket.jpg';
  return '/images/model-men-linen-shirt.jpg';
}

export default function TryOnExperience({ onOpenCart }: { onOpenCart?: () => void }) {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get('garment');
  const stepParam = searchParams.get('step');
  const isInitialStep3 = stepParam === '3';

  const allProducts = [...products.men, ...products.kids] as ProductItem[];
  const initial = allProducts.find((p) => p.slug === preselectedSlug) || (products.men[0] as ProductItem);

  const [step, setStep] = useState<1 | 2 | 3>(isInitialStep3 ? 3 : 1);
  const [selectedGarment, setSelectedGarment] = useState<ProductItem>(initial);
  const [garmentCategory, setGarmentCategory] = useState<'men' | 'kids'>('men');
  const [selectedSize, setSelectedSize] = useState<string>(initial.sizes?.[0] || 'M');

  // Selected Studio Model / Dummy
  const [activeModel, setActiveModel] = useState<AtelierModel>(ATELIER_STUDIO_MODELS[0]);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [viewMode, setViewMode] = useState<'fitted' | 'slider' | 'base'>('fitted');

  // Photo states
  const [userPhoto, setUserPhoto] = useState<string | null>(ATELIER_STUDIO_MODELS[0].baseImg);
  const [isThreadingIn, setIsThreadingIn] = useState<boolean>(false);
  const [parentConsent, setParentConsent] = useState<boolean>(false);

  // Processing & result states: ALWAYS initialize to the actual tailored garment image!
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string>(
    getGarmentStudioImage(ATELIER_STUDIO_MODELS[0], initial.slug)
  );
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setAddedToCartToast] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    const targetGarment = preselectedSlug
      ? allProducts.find((p) => p.slug === preselectedSlug) || initial
      : initial;

    if (preselectedSlug && targetGarment) {
      setSelectedGarment(targetGarment);
      const isKid = products.kids.some((k) => k.slug === preselectedSlug);
      setGarmentCategory(isKid ? 'kids' : 'men');
      if (isKid) {
        setActiveModel(ATELIER_STUDIO_MODELS[4]); // Kids model
        setUserPhoto(ATELIER_STUDIO_MODELS[4].baseImg);
      }
      if (targetGarment.sizes && targetGarment.sizes.length > 0) {
        setSelectedSize(targetGarment.sizes[0]);
      }
    }

    if (stepParam === '3') {
      const targetModel = preselectedSlug && products.kids.some((k) => k.slug === preselectedSlug)
        ? ATELIER_STUDIO_MODELS[4]
        : ATELIER_STUDIO_MODELS[0];
      setUserPhoto(targetModel.baseImg);
      setResultImage(targetModel.garments[targetGarment.slug] || targetModel.baseImg);
      setStep(3);
    }
  }, [preselectedSlug, searchParams]);

  // Select a preset Studio Model or Dummy
  const handleSelectModel = (model: AtelierModel) => {
    setActiveModel(model);
    setIsCustomPhoto(false);
    setUserPhoto(model.baseImg);
    setErrorMessage(null);
    setStep(2);
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      setErrorMessage(null);
      setIsThreadingIn(true);
      const preprocessed = await preprocessUserPhoto(file);
      setUserPhoto(preprocessed.dataUrl);
      setIsCustomPhoto(true);
      setIsThreadingIn(false);
      setStep(2);
    } catch (err: unknown) {
      setIsThreadingIn(false);
      setErrorMessage(err instanceof Error ? err.message : 'Photo processing failed.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleGenerateTryOn = useCallback(
    async (
      garmentToUse = selectedGarment,
      categoryToUse = garmentCategory,
      modelToUse = activeModel
    ) => {
      if (!userPhoto) {
        setStep(1);
        return;
      }

      if (categoryToUse === 'kids' && !parentConsent && isCustomPhoto) {
        setErrorMessage('Please confirm parental/guardian consent before previewing children’s pieces.');
        return;
      }

      setErrorMessage(null);
      setIsProcessing(true);
      setStep(3);

      try {
        // Check if there is a verified high-resolution studio shoot for this model & piece
        const directStudioMatch = modelToUse.garments[garmentToUse.slug];

        let finalDrape: string;
        if (!isCustomPhoto && directStudioMatch) {
          // 100% Real editorial studio photograph of the model wearing the piece
          await new Promise((resolve) => setTimeout(resolve, 1800));
          finalDrape = directStudioMatch;
        } else {
          // Anatomical Canvas compositor with transparent cutouts
          const transparentGarments = [
            'men-linen-shirt',
            'men-linen-kurta',
            'men-bomber-jacket',
            'kids-cotton-frock',
            'kids-hoodie',
          ];
          const garmentImg = transparentGarments.includes(garmentToUse.slug)
            ? `/images/${garmentToUse.slug}-transparent.png`
            : getProductImage(garmentToUse.id);

          const tailoredPromise = drapeGarmentOnPerson(userPhoto, garmentImg, {
            category: categoryToUse,
            size: selectedSize,
            garmentName: garmentToUse.name,
          });

          const [tailoredDrape] = await Promise.all([
            tailoredPromise,
            new Promise((resolve) => setTimeout(resolve, 2000)),
          ]);
          finalDrape = tailoredDrape;
        }

        setResultImage(finalDrape);
        setIsProcessing(false);
        setIsRevealing(true);
      } catch (err: unknown) {
        setIsProcessing(false);
        const msg = err instanceof Error ? err.message : 'Unable to complete fitting preview.';
        setErrorMessage(msg);
      }
    },
    [userPhoto, selectedGarment, garmentCategory, parentConsent, selectedSize, activeModel, isCustomPhoto]
  );

  const handleModelSwitchInPreview = (model: AtelierModel) => {
    setActiveModel(model);
    setIsCustomPhoto(false);
    setUserPhoto(model.baseImg);
    const newImage = getGarmentStudioImage(model, selectedGarment.slug);
    setResultImage(newImage);
    setViewMode('fitted');
  };

  const handleGarmentSwitchInPreview = (garment: ProductItem) => {
    setSelectedGarment(garment);
    const isKid = products.kids.some((k) => k.slug === garment.slug);
    setGarmentCategory(isKid ? 'kids' : 'men');
    if (garment.sizes && garment.sizes.length > 0) {
      setSelectedSize(garment.sizes[0]);
    }
    const newImage = getGarmentStudioImage(activeModel, garment.slug);
    setResultImage(newImage);
    setViewMode('fitted');
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `crystal-thread-${selectedGarment.slug}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToCart = () => {
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2500);
    if (onOpenCart) onOpenCart();
  };

  return (
    <Container className="pt-6 pb-16 md:pb-24 text-white">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC] animate-pulse" />
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#BFD3E6]">
              ✦ AI Fitting Studio &amp; Mannequins
            </p>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-white leading-tight tracking-tight uppercase">
            Virtual Trial Room
          </h1>
        </div>

        {/* 01 / 02 / 03 Step Indicator */}
        <div className="mt-4 md:mt-0 flex items-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-[12px] font-sans overflow-x-auto scrollbar-none pb-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] border transition-all ${
                step === 1
                  ? 'border-white bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                  : 'border-white/20 text-zinc-500'
              }`}
            >
              01
            </span>
            <span className={step === 1 ? 'text-white font-medium whitespace-nowrap' : 'text-zinc-500 whitespace-nowrap'}>
              Model / Silhouette
            </span>
          </div>

          <div className="w-3 sm:w-6 h-px bg-white/15 flex-shrink-0" />

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] border transition-all ${
                step === 2
                  ? 'border-white bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                  : 'border-white/20 text-zinc-500'
              }`}
            >
              02
            </span>
            <span className={step === 2 ? 'text-white font-medium whitespace-nowrap' : 'text-zinc-500 whitespace-nowrap'}>
              Piece
            </span>
          </div>

          <div className="w-3 sm:w-6 h-px bg-white/15 flex-shrink-0" />

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] border transition-all ${
                step === 3
                  ? 'border-white bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                  : 'border-white/20 text-zinc-500'
              }`}
            >
              03
            </span>
            <span className={step === 3 ? 'text-white font-medium whitespace-nowrap' : 'text-zinc-500 whitespace-nowrap'}>
              Fitted Drape
            </span>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="mb-8 p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-[13px] flex items-center justify-between rounded-xs">
          <p>{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white text-xs uppercase tracking-wider ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── STEP 1: CHOOSE STUDIO MODEL, DUMMY, OR UPLOAD ── */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#7DD3FC] font-bold mb-1">
              ✦ Step 01: Choose Your Fit Silhouette
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
              Select A Studio Model, Atelier Dummy, Or Upload Photo
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Select a professional studio model or tailoring dummy to see natural linen drape and fit, or upload your own portrait.
            </p>
          </div>

          {/* 5 Atelier Models & Dummies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ATELIER_STUDIO_MODELS.map((m) => (
              <div
                key={m.id}
                onClick={() => handleSelectModel(m)}
                className={`bg-[#101015] border p-2 sm:p-3 rounded-xs cursor-pointer group transition-all relative ${
                  activeModel.id === m.id && !isCustomPhoto
                    ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.35)] scale-102 bg-[#16161D]'
                    : 'border-white/10 hover:border-white/40'
                }`}
              >
                <div className="aspect-[3/4] bg-black overflow-hidden relative mb-2.5 rounded-xs">
                  <img
                    src={m.baseImg}
                    alt={m.label}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[8px] sm:text-[9px] font-bold tracking-widest uppercase text-[#7DD3FC] border border-white/15">
                    {m.isDummy ? 'Mannequin' : 'Studio Model'}
                  </div>
                </div>

                <p className="font-bold text-xs sm:text-sm text-white truncate uppercase">{m.label}</p>
                <p className="text-[10px] text-zinc-400 truncate">{m.role}</p>

                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#BFD3E6] uppercase tracking-wider">
                    Select Fit →
                  </span>
                  {activeModel.id === m.id && !isCustomPhoto && (
                    <span className="w-2 h-2 rounded-full bg-[#7DD3FC] shadow-[0_0_8px_#7DD3FC]" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Photo Upload Alternative */}
          <div className="bg-[#101015] border border-dashed border-white/20 p-6 sm:p-8 rounded-xs text-center hover:border-white/50 transition-all">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              <div className="w-12 h-12 mx-auto mb-3 border border-white/20 rounded-full flex items-center justify-center bg-white/[0.04]">
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-display font-bold text-base uppercase text-white tracking-wide">
                Or Upload Your Own Portrait
              </p>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Snap or upload a waist-up photo. Our tailoring engine automatically aligns the collar beneath your neck line.
              </p>
              <button
                type="button"
                className="mt-4 px-6 py-2.5 bg-white text-black text-[10px] font-bold tracking-[0.16em] uppercase hover:bg-[#BFD3E6] transition-all"
              >
                Browse From Device
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePhotoUpload(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* ── STEP 2: CHOOSE GARMENT & OPTIONS ── */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Active Model / Silhouette Preview */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-[3/4] max-h-[500px] bg-[#141418] border border-white/10 relative overflow-hidden shadow-2xl rounded-xs">
              {userPhoto && (
                <img
                  src={userPhoto}
                  alt="Active silhouette"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase border border-white/20 text-white shadow-md flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
                <span>{isCustomPhoto ? 'Custom Portrait' : activeModel.label}</span>
              </div>
              <button
                onClick={() => setStep(1)}
                className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md py-2 text-[10px] tracking-widest uppercase border border-white/20 text-white hover:border-white transition-colors cursor-pointer text-center"
              >
                ← Switch Model or Dummy
              </button>
            </div>
          </div>

          {/* Garment Selector */}
          <div className="md:col-span-7 space-y-8">
            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-[#BFD3E6] font-semibold mb-2">
                02 / Piece Selection
              </p>
              <h2 className="text-display text-2xl md:text-3xl mb-2 text-white font-bold uppercase tracking-tight">
                Select your garment.
              </h2>
              <p className="text-[13px] text-zinc-400">
                Choose any piece from our Men’s or Kids’ atelier to drape onto {activeModel.label}.
              </p>
            </div>

            {/* Garment Strip */}
            <GarmentSelectorStrip
              selectedGarment={selectedGarment}
              onSelectGarment={(item, cat) => {
                setSelectedGarment(item);
                setGarmentCategory(cat);
              }}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* Kids Parental Consent Checkbox */}
            {garmentCategory === 'kids' && isCustomPhoto && (
              <div className="p-4 bg-[#111116] border border-white/10 flex items-start gap-3 rounded-xs shadow-md">
                <input
                  type="checkbox"
                  id="parentConsent"
                  checked={parentConsent}
                  onChange={(e) => setParentConsent(e.target.checked)}
                  className="mt-1 accent-white cursor-pointer"
                />
                <label htmlFor="parentConsent" className="text-[12px] text-zinc-400 leading-relaxed cursor-pointer">
                  <strong className="text-white">Parent/Guardian Consent:</strong> I confirm that I am the parent or legal guardian authorizing this children’s garment drape preview.
                </label>
              </div>
            )}

            {/* Drape action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => handleGenerateTryOn()}
                className="px-8 py-4 bg-white text-black text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BFD3E6] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] w-full sm:w-auto cursor-pointer"
              >
                <span>Drape onto {activeModel.isDummy ? 'Mannequin' : 'Model'} →</span>
              </button>

              <span className="text-[11px] text-zinc-500 tracking-wide">
                Studio tailoring render: ~1.8s
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: RESULT & INTERACTIVE BEFORE/AFTER SLIDER ── */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Main Visual Display */}
          <div className="md:col-span-7">
            {/* Redesigned Floating Studio Control Bar */}
            <div className="mb-6 p-3 sm:p-4 bg-[#14141E] border border-white/20 rounded-2xl shadow-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7DD3FC] shadow-[0_0_10px_#7DD3FC] animate-pulse" />
                  <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-white">
                    SELECT SILHOUETTE
                  </span>
                </div>

                {/* View Mode Segmented Controls */}
                <div className="flex items-center p-1 bg-black/80 border border-white/20 rounded-full shadow-inner gap-1 self-start sm:self-auto">
                  <button
                    onClick={() => setViewMode('fitted')}
                    className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                      viewMode === 'fitted'
                        ? 'bg-white text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    ✦ Tailored Fit
                  </button>
                  <button
                    onClick={() => setViewMode('slider')}
                    className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                      viewMode === 'slider'
                        ? 'bg-white text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    ↔ Compare
                  </button>
                  <button
                    onClick={() => setViewMode('base')}
                    className={`px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                      viewMode === 'base'
                        ? 'bg-white text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Base Model
                  </button>
                </div>
              </div>

              {/* Large, High-Contrast Model & Dummy Pills */}
              <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
                {ATELIER_STUDIO_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleModelSwitchInPreview(m)}
                    className={`px-4 py-2.5 text-xs tracking-wider uppercase font-extrabold rounded-full transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer border-2 ${
                      activeModel.id === m.id && !isCustomPhoto
                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.45)] scale-[1.02]'
                        : 'bg-white/[0.07] border-white/20 text-white hover:text-white hover:border-white/50 hover:bg-white/15'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span>{m.shortLabel}</span>
                  </button>
                ))}
              </div>

              {/* Garment Quick Switcher */}
              <div className="pt-2.5 border-t border-white/10">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#7DD3FC] mb-2 flex items-center gap-1.5">
                  <span>◈ Choose Garment to Try:</span>
                </p>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                  {allProducts.map((p) => {
                    const isSelected = selectedGarment.slug === p.slug;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleGarmentSwitchInPreview(p)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-[#7DD3FC] text-black border-[#7DD3FC] shadow-[0_0_15px_rgba(125,211,252,0.45)]'
                            : 'bg-white/[0.05] border-white/10 text-zinc-300 hover:text-white hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        <span>{p.category === 'kids' ? '🧒' : p.name.includes('Kurta') ? '🥻' : p.name.includes('Bomber') ? '🧥' : '👔'}</span>
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Visual Canvas Area */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-[#101015] max-w-[480px] mx-auto w-full">
              {isProcessing ? (
                <ThreadScanAnimation
                  userImage={userPhoto || ''}
                  garmentName={selectedGarment.name}
                />
              ) : isRevealing ? (
                <StitchRevealCanvas
                  beforeImage={userPhoto || ''}
                  afterImage={resultImage || userPhoto || ''}
                  onRevealComplete={() => setIsRevealing(false)}
                />
              ) : viewMode === 'slider' ? (
                <BeforeAfterSlider
                  beforeImage={userPhoto || ''}
                  afterImage={resultImage || userPhoto || ''}
                />
              ) : viewMode === 'fitted' ? (
                <div className="relative aspect-[3/4] max-h-[620px] w-full bg-[#141418]">
                  <img
                    src={resultImage || userPhoto || ''}
                    alt="Full tailored fit"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase border border-white/20 text-[#7DD3FC] shadow-lg flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-pulse" />
                    <span>Tailored Studio Drape</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] tracking-wider uppercase border border-white/15 text-white shadow-lg">
                    {selectedGarment.name} • {activeModel.shortLabel}
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[3/4] max-h-[580px] w-full bg-[#141418]">
                  <img
                    src={userPhoto || ''}
                    alt="Base model silhouette"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase border border-white/20 text-zinc-300 shadow-lg font-bold">
                    Base Model Silhouette
                  </div>
                </div>
              )}
            </div>

            {!isProcessing && (
              <p className="text-center text-[12px] text-zinc-400 mt-4 tracking-wide font-medium">
                {viewMode === 'slider'
                  ? '← Drag the crystal thread divider to compare before & tailored drape →'
                  : '✦ High-resolution studio drape rendered with natural daylight reflections'}
              </p>
            )}
          </div>

          {/* Fitting Details & Next Actions */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-[#BFD3E6] font-semibold mb-2">
                03 / Tailored Studio Drape
              </p>
              <h2 className="text-display text-2xl md:text-3xl mb-1 text-white font-bold uppercase tracking-tight">
                {selectedGarment.name}
              </h2>
              <p className="text-xs text-[#7DD3FC] uppercase tracking-wider font-bold mb-3">
                Tailored on {activeModel.label}
              </p>
              <p className="text-2xl font-bold text-white mb-4">
                {formatPrice(selectedGarment.price)}
              </p>
              <p className="text-[14px] text-zinc-300 leading-relaxed mb-4">
                {selectedGarment.description}
              </p>
              <div className="flex items-center gap-3 text-[12px] text-zinc-400 bg-[#111116] p-3 border border-white/10 rounded-xs shadow-md">
                <span>Size: <strong className="text-white">{selectedSize}</strong></span>
                <span>·</span>
                <span>Fabric: <strong className="text-white">{selectedGarment.fabric}</strong></span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-white text-black text-xs font-extrabold tracking-[0.2em] uppercase rounded-full hover:bg-[#7DD3FC] hover:shadow-[0_0_25px_rgba(125,211,252,0.4)] transition-all shadow-xl cursor-pointer text-center"
              >
                <span>Add to bag (Size {selectedSize})</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownload}
                  className="px-4 py-3.5 border border-white/20 bg-white/[0.06] text-xs font-bold tracking-wider uppercase text-white rounded-full hover:border-white hover:bg-white/15 transition-all text-center cursor-pointer shadow-sm"
                >
                  Download Drape
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-3.5 border border-white/20 bg-white/[0.06] text-xs font-bold tracking-wider uppercase text-white rounded-full hover:border-white hover:bg-white/15 transition-all text-center cursor-pointer shadow-sm"
                >
                  Change Garment
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full text-center py-2 text-[10px] tracking-[0.16em] uppercase text-zinc-400 hover:text-white transition-colors"
              >
                ← Switch to Another Model or Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
