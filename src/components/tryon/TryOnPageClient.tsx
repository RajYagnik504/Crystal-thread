'use client';

import { useState, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomCursor from '@/components/ui/CustomCursor';
import Container from '@/components/layout/Container';
import TryOnExperience from './TryOnExperience';

export default function TryOnPageClient() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <CustomCursor />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pb-24 min-h-screen bg-[#070709] text-white" style={{ paddingTop: '160px' }}>
        <Suspense
          fallback={
            <Container className="py-20 text-center">
              <p className="text-caption text-ink/40 animate-pulse">Loading Studio Atelier...</p>
            </Container>
          }
        >
          <TryOnExperience onOpenCart={() => setCartOpen(true)} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
