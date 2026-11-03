'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomCursor from '@/components/ui/CustomCursor';
import Container from '@/components/layout/Container';
import { getProductImage } from '@/lib/utils';

const LOOKBOOK_SECTIONS = [
  {
    num: '01',
    title: 'Morning light',
    subtitle: 'Men\'s linen — the fabric that wakes up slowly.',
    image: 'lookbook-men-1',
    text: 'Golden hour on the terrace. The linen shirt catches every fold differently. It\'s the kind of fabric that photographs differently every time because it\'s never quite the same twice.',
  },
  {
    num: '02',
    title: 'The details',
    subtitle: 'Where the stitching tells the story.',
    image: 'lookbook-men-2',
    text: 'Mother-of-pearl buttons, hand-rolled hems, pick stitches along the lapel. These aren\'t design choices — they\'re craft choices. The difference between a garment that lasts one season and one that lasts five.',
  },
  {
    num: '03',
    title: 'Clean lines',
    subtitle: 'Outerwear that doesn\'t try too hard.',
    image: 'lookbook-men-3',
    text: 'The bomber, unzipped, against stone. Garment-dyed so the colour has depth, not flatness. The ribbed collar sits close without choking. It\'s the jacket you wear over everything.',
  },
  {
    num: '04',
    title: 'Small things',
    subtitle: 'For the ones who grow too fast.',
    image: 'lookbook-kids-1',
    text: 'Kids\' clothes need to keep up. That means reinforced knees, elastic that doesn\'t go slack, and fabric that gets softer with every wash instead of falling apart.',
  },
  {
    num: '05',
    title: 'Laid out',
    subtitle: 'A wardrobe in miniature.',
    image: 'lookbook-kids-2',
    text: 'Frock, cardigan, sandals. All in the same cream-to-white family. The kind of set that works for a birthday party and a beach afternoon without looking costume-y.',
  },
  {
    num: '06',
    title: 'The thread',
    subtitle: 'Where every garment starts.',
    image: 'lookbook-craft',
    text: 'Needle, thread, fabric. Before there\'s a pattern or a size label, there\'s this moment: the first stitch. Every Crystal Thread piece begins with a single needle pulling through cloth.',
  },
];

export default function LookbookPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <CustomCursor />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-32 md:pt-40 pb-24 bg-[#070709] text-white min-h-screen">
        {/* Header */}
        <Container className="mb-20">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#BFD3E6] font-semibold mb-3">
            07 / Autumn Lookbook
          </p>
          <h1 className="text-display text-[clamp(3rem,8vw,6rem)] mb-6 text-white leading-[1.02] font-light tracking-tight">
            Autumn<br />&rsquo;26
          </h1>
          <p className="text-body text-zinc-400 max-w-[420px]">
            Twelve looks shot in natural morning light. No retouching on the
            fabric — what you see is what it actually looks like.
          </p>
        </Container>

        {/* Sections */}
        {LOOKBOOK_SECTIONS.map((section, idx) => (
          <section key={section.num} className="mb-0">
            <div className={`grid grid-cols-1 md:grid-cols-12 min-h-[80vh] ${
              idx % 2 === 0 ? '' : 'md:direction-rtl'
            }`}>
              {/* Image */}
              <div className={`md:col-span-7 ${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
                <div className="h-[60vh] md:h-full bg-[#121216] overflow-hidden sticky top-0" data-cursor="View">
                  <img
                    src={getProductImage(section.image)}
                    alt={section.subtitle}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text */}
              <div className={`md:col-span-5 ${idx % 2 !== 0 ? 'md:order-1' : ''} flex items-center bg-[#09090D]`}>
                <div className="px-6 md:px-16 py-16 md:py-24 max-w-[480px]">
                  <p className="text-2xl font-serif text-[#BFD3E6] font-light mb-4">{section.num}</p>
                  <h2 className="text-display text-[clamp(1.5rem,3vw,2.5rem)] mb-3 text-white font-light">
                    {section.title}
                  </h2>
                  <p className="text-caption text-zinc-500 mb-6 tracking-[0.18em]">{section.subtitle}</p>
                  <p className="text-body text-zinc-400 leading-relaxed font-sans">
                    {section.text}
                  </p>
                </div>
              </div>
            </div>

            {idx < LOOKBOOK_SECTIONS.length - 1 && (
              <Container><div className="hairline" /></Container>
            )}
          </section>
        ))}
      </main>

      <Footer />
    </>
  );
}
