'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomCursor from '@/components/ui/CustomCursor';
import Container from '@/components/layout/Container';
import { getProductImage } from '@/lib/utils';

export default function AboutPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <CustomCursor />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-32 md:pt-40 pb-24 bg-[#070709] text-white min-h-screen">
        {/* Header */}
        <Container as="section" className="mb-24 md:mb-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-2">
              <p className="text-[10px] tracking-[0.24em] uppercase text-[#BFD3E6] font-semibold">Our Thread</p>
            </div>
            <div className="md:col-span-7">
              <h1 className="text-display text-[clamp(2.5rem,6vw,5rem)] mb-8 text-white leading-[1.02] font-light tracking-tight">
                We started with<br />a single question.
              </h1>
              <p className="text-display text-[clamp(1.2rem,2vw,1.6rem)] text-zinc-400 font-light">
                Why does most clothing feel the same?
              </p>
            </div>
          </div>
        </Container>

        {/* Thread visual spine */}
        <div className="relative">
          {/* Vertical thread */}
          <div className="hidden md:block absolute left-[calc(50%-600px)] top-0 bottom-0 w-px">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="0" y2="100%" stroke="#BFD3E6" strokeWidth="1" className="thread-glow" />
            </svg>
          </div>

          {/* Story blocks */}
          <Container className="space-y-24 md:space-y-40">
            {/* Block 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-2">
                <p className="text-2xl font-serif text-[#BFD3E6] font-light">01</p>
              </div>
              <div className="md:col-span-5">
                <h2 className="text-display text-[clamp(1.5rem,3vw,2.2rem)] mb-6 text-white font-light">
                  The problem with<br />&ldquo;fast fashion&rdquo;
                </h2>
                <p className="text-body text-zinc-400 mb-4 font-sans">
                  Not the speed — the sameness. Walk into any store and you'll find
                  the same polyester blend, the same overworked fit, the same pilling
                  after three washes. The clothes aren't bad — they're just not
                  thoughtful.
                </p>
                <p className="text-body text-zinc-400 font-sans">
                  We wanted to make the kind of clothes you notice when you put them
                  on. Not because of a logo, but because the cotton feels different.
                  The shoulder sits differently. The seam lies flat against your skin
                  instead of digging in.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="aspect-[4/5] bg-[#121217] overflow-hidden border border-white/10 rounded-xs shadow-xl">
                  <img
                    src={getProductImage('lookbook-men-2')}
                    alt="Close-up of fabric stitching detail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="hairline" />

            {/* Block 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-2">
                <p className="text-2xl font-serif text-[#BFD3E6] font-light">02</p>
              </div>
              <div className="md:col-span-5 md:order-3">
                <h2 className="text-display text-[clamp(1.5rem,3vw,2.2rem)] mb-6 text-white font-light">
                  What we do<br />differently
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-[13px] font-medium text-white mb-1">We visit the mills</p>
                    <p className="text-[13px] text-zinc-400">
                      Not a swatch card — the actual floor where the fabric is woven. We touch every
                      bolt before we commit.
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white mb-1">We cut each size separately</p>
                    <p className="text-[13px] text-zinc-400">
                      Most brands grade up from one pattern. We draft each size from scratch
                      because a 34 waist isn't just a wider 30.
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white mb-1">We finish by hand</p>
                    <p className="text-[13px] text-zinc-400">
                      Buttonholes, collar points, pocket edges. The bits you look at up close.
                      These take three times longer — and it shows.
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white mb-1">We test to destruction</p>
                    <p className="text-[13px] text-zinc-400">
                      Every piece is washed 20 times, stretched, rubbed, and scored before
                      we approve it. If it doesn't improve with wear, it doesn't ship.
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="aspect-[4/5] bg-[#121217] overflow-hidden border border-white/10 rounded-xs shadow-xl">
                  <img
                    src={getProductImage('lookbook-men-3')}
                    alt="Man wearing Crystal Thread bomber jacket"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="hairline" />

            {/* Block 3 — Kids */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-2">
                <p className="text-2xl font-serif text-[#BFD3E6] font-light">03</p>
              </div>
              <div className="md:col-span-5">
                <h2 className="text-display text-[clamp(1.5rem,3vw,2.2rem)] mb-6 text-white font-light">
                  Why we make<br />kids&rsquo; clothes too
                </h2>
                <p className="text-body text-zinc-400 mb-4 font-sans">
                  Because children deserve the same quality. Not miniaturised
                  adult fashion — clothing designed for how kids actually move.
                  Wider armholes. Longer hems with hidden allowance for growth.
                  Elastic that doesn't go slack.
                </p>
                <p className="text-body text-zinc-400 font-sans">
                  Every kids' piece uses GOTS-certified organic cotton. The tags
                  are printed, not sewn, because no child should have a scratchy
                  label at the back of their neck.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-[#121217] overflow-hidden border border-white/10 rounded-xs">
                    <img
                      src={getProductImage('kids-cotton-frock')}
                      alt="Cotton frock for kids"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="aspect-square bg-[#121217] overflow-hidden border border-white/10 rounded-xs">
                    <img
                      src={getProductImage('kids-hoodie')}
                      alt="Kids hoodie"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="hairline" />

            {/* Block 4 — The name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-2">
                <p className="text-2xl font-serif text-[#BFD3E6] font-light">04</p>
              </div>
              <div className="md:col-span-8">
                <h2 className="text-display text-[clamp(1.5rem,3vw,2.2rem)] mb-6 text-white font-light">
                  Why &ldquo;Crystal Thread&rdquo;
                </h2>
                <p className="text-body text-zinc-400 mb-4 font-sans">
                  A crystal is clear — you can see through it. A thread connects.
                  Put them together and you get our promise: transparency in how
                  we make things, and a single line of craft running through
                  every garment.
                </p>
                <p className="text-body text-zinc-400 font-sans">
                  The thread in our logo isn't decoration. It's a reminder that
                  every piece starts and ends with a single strand of yarn,
                  stitched with intent.
                </p>
              </div>
            </div>
          </Container>
        </div>
      </main>

      <Footer />
    </>
  );
}
