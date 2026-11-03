'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';
import Container from '@/components/layout/Container';
import { formatPrice } from '@/lib/utils';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  ageGroup?: string;
  price: number;
  currency: string;
  description: string;
  fabric: string;
  care: string;
  sizes: string[];
  color: string;
  images: string[];
  heroImage: string;
}

const KIDS_PRESET_IMAGES = [
  { label: 'Petal Cotton Frock', url: '/images/kids-cotton-frock.jpg' },
  { label: 'Cloud French Terry Hoodie', url: '/images/kids-hoodie.jpg' },
  { label: 'Sky Poplin Shorts Set', url: '/images/kids-shorts-set.jpg' },
  { label: 'Little Nawab Muslin Kurta', url: '/images/kids-kurta-set.jpg' },
  { label: 'Organic Cotton Dungaree', url: '/images/kids-dungaree.jpg' },
];

const KIDS_CATEGORIES = ['Dresses', 'Tops', 'Sets', 'Ethnic', 'Bottoms', 'Knitwear'];
const AGE_GROUPS = ['2-4', '5-8', '9-12'];
const AVAILABLE_SIZES = ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9Y', '10Y', '12Y'];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'add-kids' | 'inventory'>('add-kids');
  const [inventorySection, setInventorySection] = useState<'kids' | 'men'>('kids');

  // Products state from API
  const [kidsProducts, setKidsProducts] = useState<ProductItem[]>([]);
  const [menProducts, setMenProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dresses');
  const [ageGroup, setAgeGroup] = useState('2-4');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('Soft Ivory');
  const [fabric, setFabric] = useState('100% GOTS Organic Cotton, 160 gsm');
  const [description, setDescription] = useState('');
  const [care, setCare] = useState('Machine wash gentle cold. Air dry in shade.');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['2Y', '3Y', '4Y']);
  const [selectedImage, setSelectedImage] = useState(KIDS_PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load products on mount
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/products');
      const json = await res.json();
      if (json.success && json.data) {
        setKidsProducts(json.data.kids || []);
        setMenProducts(json.data.men || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSizeToggle = (sz: string) => {
    if (selectedSizes.includes(sz)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== sz));
      }
    } else {
      setSelectedSizes([...selectedSizes, sz]);
    }
  };

  const handleAddKidsProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      triggerToast('Please provide a product title and price');
      return;
    }

    try {
      setIsSubmitting(true);
      const finalImg = customImageUrl.trim() ? customImageUrl.trim() : selectedImage;

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          ageGroup,
          price: Number(price),
          color,
          fabric,
          description,
          care,
          sizes: selectedSizes,
          imageUrl: finalImg,
          targetSection: 'kids',
        }),
      });

      const json = await res.json();
      if (json.success) {
        triggerToast(`✦ ${name} published live to Kids Collection!`);
        // Reset form
        setName('');
        setPrice('');
        setDescription('');
        setCustomImageUrl('');
        await loadProducts();
        setActiveTab('inventory');
        setInventorySection('kids');
      } else {
        triggerToast(json.error || 'Failed to save product');
      }
    } catch (err: unknown) {
      triggerToast(err instanceof Error ? err.message : 'Error adding product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, section: 'kids' | 'men') => {
    if (!confirm('Are you sure you want to remove this piece from the atelier?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}&section=${section}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        triggerToast('Product removed from catalog');
        await loadProducts();
      }
    } catch {
      triggerToast('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans">
      {/* ── Admin Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-[#0B0B0F]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <BrandLogo size="sm" showWordmark={false} />
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm tracking-wider uppercase text-white">
              Crystal Thread Atelier Admin
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#7DD3FC]/10 text-[#7DD3FC] border border-[#7DD3FC]/30 text-[9px] font-bold tracking-widest uppercase">
              Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/kids"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <span>View Kids Storefront ↗</span>
          </Link>
          <Link
            href="/try-on"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <span>Live Try-On Room ↗</span>
          </Link>
          <Link
            href="/"
            className="px-3 py-1.5 bg-white text-black text-[10px] font-bold tracking-[0.14em] uppercase hover:bg-[#BFD3E6] transition-all rounded-xs"
          >
            ← Storefront
          </Link>
        </div>
      </header>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-white text-black px-5 py-3 rounded-xs shadow-[0_0_30px_rgba(255,255,255,0.4)] text-xs font-bold tracking-wider uppercase flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="py-8 md:py-12">
        <Container>
          {/* ── Dashboard Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#101015] border border-white/10 p-5 rounded-xs">
              <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold mb-1">
                Total Atelier Pieces
              </p>
              <p className="text-3xl font-display font-bold text-white">
                {kidsProducts.length + menProducts.length}
              </p>
            </div>
            <div className="bg-[#101015] border border-[#7DD3FC]/30 p-5 rounded-xs">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#7DD3FC] font-bold">
                  Kids Collection
                </p>
                <span className="w-2 h-2 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC]" />
              </div>
              <p className="text-3xl font-display font-bold text-white">{kidsProducts.length}</p>
            </div>
            <div className="bg-[#101015] border border-white/10 p-5 rounded-xs">
              <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold mb-1">
                Men's Collection
              </p>
              <p className="text-3xl font-display font-bold text-white">{menProducts.length}</p>
            </div>
            <div className="bg-[#101015] border border-white/10 p-5 rounded-xs">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#BFD3E6] font-bold mb-1">
                Virtual Try-On Enabled
              </p>
              <p className="text-3xl font-display font-bold text-[#BFD3E6]">100%</p>
            </div>
          </div>

          {/* ── Navigation Tabs ── */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-8">
            <button
              onClick={() => setActiveTab('add-kids')}
              className={`px-5 py-2.5 rounded-xs text-[11px] font-bold tracking-[0.16em] uppercase transition-all cursor-pointer ${
                activeTab === 'add-kids'
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              ✦ Add New Kids Product
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-5 py-2.5 rounded-xs text-[11px] font-bold tracking-[0.16em] uppercase transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              All Products Inventory ({kidsProducts.length + menProducts.length})
            </button>
          </div>

          {/* ── TAB 1: ADD KIDS PRODUCT FORM ── */}
          {activeTab === 'add-kids' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form on the left */}
              <div className="lg:col-span-8 bg-[#101015] border border-white/10 p-6 sm:p-8 rounded-xs">
                <div className="mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-xl font-display font-bold uppercase text-white tracking-tight">
                    Add New Children’s Piece
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Newly added garments appear instantly in the Kids Atelier and Virtual Trial Room.
                  </p>
                </div>

                <form onSubmit={handleAddKidsProduct} className="space-y-6">
                  {/* Product Title */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                      Product Title / Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Skyline Linen Dungaree, Breeze Muslin Frock..."
                      className="w-full bg-[#181820] border border-white/15 px-4 py-3 rounded-xs text-sm text-white focus:outline-none focus:border-[#7DD3FC] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#181820] border border-white/15 px-4 py-3 rounded-xs text-sm text-white focus:outline-none focus:border-[#7DD3FC]"
                      >
                        {KIDS_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Age Group */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                        Age Group
                      </label>
                      <select
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className="w-full bg-[#181820] border border-white/15 px-4 py-3 rounded-xs text-sm text-white focus:outline-none focus:border-[#7DD3FC]"
                      >
                        {AGE_GROUPS.map((ag) => (
                          <option key={ag} value={ag}>
                            Ages {ag} Yrs
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                        Price (₹ INR) *
                      </label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 1690"
                        className="w-full bg-[#181820] border border-white/15 px-4 py-3 rounded-xs text-sm text-white focus:outline-none focus:border-[#7DD3FC]"
                      >
                      </input>
                    </div>
                  </div>

                  {/* Fabric & Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                        Fabric Composition
                      </label>
                      <input
                        type="text"
                        value={fabric}
                        onChange={(e) => setFabric(e.target.value)}
                        placeholder="e.g. 100% GOTS Organic Cotton, 160 gsm"
                        className="w-full bg-[#181820] border border-white/15 px-4 py-3 rounded-xs text-sm text-white focus:outline-none focus:border-[#7DD3FC]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                        Color / Palette
                      </label>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="e.g. Soft Ivory, Sage Green, Sky Blue"
                        className="w-full bg-[#181820] border border-white/15 px-4 py-3 rounded-xs text-sm text-white focus:outline-none focus:border-[#7DD3FC]"
                      />
                    </div>
                  </div>

                  {/* Sizes Available */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                      Available Sizes (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SIZES.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleSizeToggle(sz)}
                          className={`px-3 py-1.5 border text-xs font-mono transition-all cursor-pointer rounded-xs ${
                            selectedSizes.includes(sz)
                              ? 'bg-white text-black border-white font-bold'
                              : 'bg-white/[0.04] border-white/15 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Garment Image Selection */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                      Studio Garment Photography
                    </label>
                    <p className="text-xs text-zinc-400 mb-3">
                      Choose from our verified atelier studio photography presets or enter custom URL:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                      {KIDS_PRESET_IMAGES.map((img) => (
                        <div
                          key={img.url}
                          onClick={() => {
                            setSelectedImage(img.url);
                            setCustomImageUrl('');
                          }}
                          className={`aspect-[3/4] bg-[#141418] border p-1 rounded-xs cursor-pointer overflow-hidden transition-all relative ${
                            selectedImage === img.url && !customImageUrl
                              ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-102'
                              : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1 text-[8px] text-center uppercase tracking-wider truncate">
                            {img.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2">
                      <input
                        type="text"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="Or paste custom image URL / path (e.g. /images/new-piece.jpg)"
                        className="w-full bg-[#181820] border border-white/15 px-4 py-2.5 rounded-xs text-xs text-white focus:outline-none focus:border-[#7DD3FC]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-300 font-bold mb-2">
                      Craftsmanship & Comfort Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Tagless collar, smooth flat seams, and generous let-down hem for growing children..."
                      className="w-full bg-[#181820] border border-white/15 p-4 rounded-xs text-sm text-white focus:outline-none focus:border-[#7DD3FC]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-xs text-zinc-500">
                      Product will immediately appear in `/kids` and AI Fitting Studio.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.18em] uppercase hover:bg-[#BFD3E6] transition-all shadow-xl disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Publishing...' : '✦ Publish to Kids Collection'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Card on the right */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#101015] border border-white/10 p-5 rounded-xs">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#7DD3FC]">
                      ✦ Live Storefront Preview
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase">Ages {ageGroup} Yrs</span>
                  </div>

                  <div className="aspect-[3/4] bg-[#141418] border border-white/10 relative overflow-hidden mb-4">
                    <img
                      src={customImageUrl.trim() ? customImageUrl : selectedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/80 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-white border border-white/15">
                      Ages {ageGroup} Yrs
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-[#7DD3FC]/15 text-[#7DD3FC] px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border border-[#7DD3FC]/40 backdrop-blur-md">
                      ✦ AI Try-On Ready
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
                    {name || 'New Kids Product Title'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{fabric}</p>

                  <div className="mt-3 flex items-baseline justify-between pt-3 border-t border-white/10">
                    <span className="text-base font-bold text-white">
                      {price ? formatPrice(Number(price)) : '₹0'}
                    </span>
                    <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-mono">
                      {selectedSizes.join(' • ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: INVENTORY MANAGEMENT ── */}
          {activeTab === 'inventory' && (
            <div className="bg-[#101015] border border-white/10 p-6 sm:p-8 rounded-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-display font-bold uppercase text-white tracking-tight">
                    Atelier Product Catalog
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage prices, active garments, and virtual try-on items.
                  </p>
                </div>

                {/* Section filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setInventorySection('kids')}
                    className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-xs transition-all cursor-pointer ${
                      inventorySection === 'kids'
                        ? 'bg-white text-black'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
                    }`}
                  >
                    Kids Collection ({kidsProducts.length})
                  </button>
                  <button
                    onClick={() => setInventorySection('men')}
                    className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-xs transition-all cursor-pointer ${
                      inventorySection === 'men'
                        ? 'bg-white text-black'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
                    }`}
                  >
                    Men's Collection ({menProducts.length})
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-zinc-500 text-xs uppercase tracking-widest">
                  Loading atelier catalog...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(inventorySection === 'kids' ? kidsProducts : menProducts).map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-[#141418] border border-white/10 p-4 rounded-xs flex gap-4 items-center group hover:border-white/30 transition-all"
                    >
                      <div className="w-20 h-24 bg-black border border-white/10 flex-shrink-0 overflow-hidden relative">
                        <img
                          src={prod.images?.[0] || prod.heroImage || '/images/kids-cotton-frock.jpg'}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider text-[#7DD3FC] font-bold truncate">
                            {prod.category}
                          </span>
                          {prod.ageGroup && (
                            <span className="text-[9px] text-zinc-500 uppercase font-mono">
                              {prod.ageGroup} Yrs
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white truncate uppercase">{prod.name}</h4>
                        <p className="text-xs font-bold text-zinc-300 mt-1">{formatPrice(prod.price)}</p>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">{prod.fabric}</p>

                        <div className="mt-3 flex items-center gap-3">
                          <Link
                            href={inventorySection === 'kids' ? `/kids` : `/men`}
                            target="_blank"
                            className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-wider"
                          >
                            View Live ↗
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, inventorySection)}
                            className="text-[10px] text-red-400 hover:text-red-300 uppercase tracking-wider cursor-pointer ml-auto"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
