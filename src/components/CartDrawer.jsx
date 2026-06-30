'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, removeFromCart, updateQty, total, count } = useCart();

  useEffect(() => {
    const open = () => setIsOpen(true);
    document.addEventListener('openCart', open);
    return () => document.removeEventListener('openCart', open);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const fmt = (n) => `${n.toLocaleString()} RWF`;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`cart-drawer flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-navy text-lg">Your Cart</h2>
            {count > 0 && (
              <span className="badge badge-green">{count} item{count !== 1 ? 's' : ''}</span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-20 h-20 bg-green-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-primary/40" />
              </div>
              <div>
                <p className="font-display font-semibold text-navy text-lg">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-1">Add products to get started</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn-primary mt-2">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-2xl">
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy line-clamp-2 leading-snug">{item.name}</p>
                    <p className="text-xs text-primary font-medium mt-0.5">{fmt(item.price)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="qty-btn text-sm">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="qty-btn text-sm">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove + subtotal */}
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-sm font-bold text-navy">{fmt(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-3 bg-white">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span className="font-medium">{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery</span><span className="font-medium text-primary">{total >= 30000 ? 'FREE' : 'Calculated at checkout'}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between font-bold text-navy">
              <span>Total</span><span className="text-primary text-lg">{fmt(total)}</span>
            </div>
            <Link href="/checkout" onClick={() => setIsOpen(false)}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/cart" onClick={() => setIsOpen(false)}
              className="btn-ghost w-full text-center text-sm py-2">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
