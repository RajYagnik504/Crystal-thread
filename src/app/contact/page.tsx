'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomCursor from '@/components/ui/CustomCursor';
import Container from '@/components/layout/Container';

export default function ContactPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <CustomCursor />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-32 md:pt-40 pb-24 bg-[#070709] text-white min-h-screen">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20">
            {/* Left — Info */}
            <div className="md:col-span-5">
              <p className="text-[10px] tracking-[0.24em] uppercase text-[#BFD3E6] font-semibold mb-3">
                Contact &amp; Studio
              </p>
              <h1 className="text-display text-[clamp(2.5rem,5vw,4rem)] mb-8 text-white leading-[1.02] font-light tracking-tight">
                Get in<br />touch.
              </h1>
              <p className="text-body text-zinc-400 mb-8 max-w-[360px]">
                Questions about sizing, fabric, orders, or custom tailored fittings?
                Visit our physical store or reach us directly on phone / WhatsApp.
              </p>

              {/* Verified Store Rating Card */}
              <div className="mb-8 p-4 bg-[#121218] border border-white/15 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-base font-extrabold text-white">4.6</span>
                    <span className="text-xs text-zinc-400">/ 5.0</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium">11 Verified Google Reviews</p>
                  <p className="text-[10px] text-[#7DD3FC] uppercase tracking-wider font-bold mt-0.5">✦ Google Verified Store</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-lg">
                  📍
                </div>
              </div>

              <div className="space-y-7">
                <div>
                  <p className="text-caption text-zinc-500 mb-1.5 tracking-[0.2em]">Phone &amp; WhatsApp</p>
                  <div className="flex flex-col gap-1">
                    <a
                      href="tel:9389005539"
                      className="text-lg font-bold text-white hover:text-[#7DD3FC] transition-colors flex items-center gap-2"
                    >
                      <span>📞</span>
                      <span>+91 93890 05539</span>
                    </a>
                    <a
                      href="https://wa.me/919389005539"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                    >
                      <span>💬 Chat with Atelier Concierge on WhatsApp →</span>
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-caption text-zinc-500 mb-1.5 tracking-[0.2em]">Physical Store &amp; Atelier</p>
                  <p className="text-[15px] text-zinc-200 leading-relaxed font-sans font-medium">
                    Crystal Thread Atelier<br />
                    Sateshwar, Tilak Nagar<br />
                    Auraiya, Uttar Pradesh – 206122<br />
                    India
                  </p>
                  <a
                    href="https://maps.google.com/?q=Sateshwar,+Tilak+Nagar,+Auraiya,+Uttar+Pradesh+206122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#7DD3FC] hover:underline uppercase tracking-wider"
                  >
                    <span>View on Google Maps →</span>
                  </a>
                </div>

                <div>
                  <p className="text-caption text-zinc-500 mb-1.5 tracking-[0.2em]">Email</p>
                  <a
                    href="mailto:hello@crystalthread.in"
                    className="text-[14px] text-zinc-300 hover:text-white transition-colors"
                  >
                    hello@crystalthread.in
                  </a>
                </div>

                <div>
                  <p className="text-caption text-zinc-500 mb-1.5 tracking-[0.2em]">Store Hours</p>
                  <p className="text-[14px] text-zinc-300">
                    Mon – Sat: 10:00 AM – 8:00 PM IST<br />
                    Sunday: By Atelier Appointment
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="md:col-span-7 md:pt-16">
              <form
                className="space-y-8 bg-[#111116] p-8 md:p-10 border border-white/10 rounded-xs shadow-2xl"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for contacting Crystal Thread. We will respond within 24 hours.');
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-caption text-zinc-400 mb-2 block tracking-wider">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/15 text-[14px] text-white outline-none focus:border-[#BFD3E6] transition-colors rounded-xs"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-caption text-zinc-400 mb-2 block tracking-wider">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/15 text-[14px] text-white outline-none focus:border-[#BFD3E6] transition-colors rounded-xs"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-caption text-zinc-400 mb-2 block tracking-wider">Subject</label>
                  <select
                    className="w-full px-4 py-3 bg-[#16161C] border border-white/15 text-[14px] text-zinc-300 outline-none focus:border-[#BFD3E6] transition-colors rounded-xs"
                  >
                    <option>General inquiry</option>
                    <option>Sizing &amp; Tailoring Consultation</option>
                    <option>AI Virtual Try-On Feedback</option>
                    <option>Order Status</option>
                    <option>Private Atelier Appointment</option>
                  </select>
                </div>

                <div>
                  <label className="text-caption text-zinc-400 mb-2 block tracking-wider">Message</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/15 text-[14px] text-white outline-none focus:border-[#BFD3E6] transition-colors rounded-xs resize-none"
                    placeholder="Tell us what you need..."
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-black text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#BFD3E6] transition-all cursor-pointer shadow-lg"
                >
                  <span>Send Message →</span>
                </button>
              </form>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
