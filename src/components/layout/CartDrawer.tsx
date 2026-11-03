'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Demo items
  const [items] = useState<CartItem[]>([]);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <div className={`cart-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="h-full flex flex-col p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-caption">Your Bag</h3>
            <button
              onClick={onClose}
              className="text-[11px] tracking-[0.14em] uppercase text-ink/50 hover:text-ink transition-colors"
            >
              Close
            </button>
          </div>

          <div className="hairline mb-8" />

          {/* Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-body text-ink/40 mb-2">Nothing here yet.</p>
                <p className="text-[13px] text-ink/25">
                  Browse our collections and find something you love.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id + item.size} className="flex gap-4">
                    <div className="w-20 h-24 bg-ink/5 rounded-sm overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium">{item.name}</p>
                      <p className="text-[11px] text-ink/40 mt-1">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                      <p className="text-[13px] mt-2">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="mt-8">
              <div className="hairline mb-6" />
              <div className="flex justify-between mb-6">
                <span className="text-caption">Total</span>
                <span className="text-[15px] font-medium">{formatPrice(total)}</span>
              </div>
              <button className="btn-primary w-full">
                <span>Checkout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
