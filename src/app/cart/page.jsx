'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const COUPONS = { 'SULFO10': 0.10, 'WELCOME15': 0.15, 'RWANDA20': 0.20 };

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const fmt = n => n.toLocaleString() + ' RWF';
  const delivery = total >= 30000 ? 0 : 3000;
  const discount = appliedCoupon ? Math.round(total * COUPONS[appliedCoupon]) : 0;
  const grandTotal = total - discount + delivery;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try SULFO10, WELCOME15, or RWANDA20');
      setAppliedCoupon(null);
    }
  };

  if (cart.length === 0) return (
    <div className="section py-24 text-center">
      <div className="w-24 h-24 bg-green-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-12 h-12 text-primary/30" />
      </div>
      <h2 className="font-display text-2xl font-bold text-navy mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Add some quality Sulfo products to get started</p>
      <Link href="/products" className="btn-primary inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Browse Products
      </Link>
    </div>
  );

  return (
    <div className="section py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Shopping Cart <span className="text-gray-400 text-xl font-normal">({count} items)</span></h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-primary mb-1">{item.brand}</p>
                <Link href={`/products/${item.id}`} className="text-sm font-semibold text-navy hover:text-primary transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-primary font-bold text-base mt-1">{item.price.toLocaleString()} RWF</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden mb-1">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-navy text-right">{fmt(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}

          <Link href="/products" className="flex items-center gap-2 text-sm text-primary font-medium mt-2 hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gold" />
              <h3 className="font-semibold text-sm text-navy">Coupon Code</h3>
            </div>
            <div className="flex gap-2">
              <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                placeholder="Enter code…" className="input flex-1 text-sm py-2" />
              <button onClick={applyCoupon} className="btn-primary py-2 px-4 text-sm">Apply</button>
            </div>
            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
            {appliedCoupon && <p className="text-xs text-green-600 mt-2 font-medium">✓ {appliedCoupon} applied — {(COUPONS[appliedCoupon] * 100).toFixed(0)}% off!</p>}
            <p className="text-xs text-gray-400 mt-2">Try: SULFO10 · WELCOME15 · RWANDA20</p>
          </div>

          {/* Summary */}
          <div className="card p-5">
            <h3 className="font-semibold text-navy mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({count} items)</span>
                <span className="font-medium">{fmt(total)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon})</span>
                  <span className="font-medium">−{fmt(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className={`font-medium ${delivery === 0 ? 'text-green-600' : ''}`}>{delivery === 0 ? 'FREE' : fmt(delivery)}</span>
              </div>
              {total < 30000 && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                  Add {fmt(30000 - total)} more for free delivery!
                </p>
              )}
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between font-bold text-navy text-base">
                <span>Total</span>
                <span className="text-primary">{fmt(grandTotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full mt-5 flex items-center justify-center gap-2 py-3.5">
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-xs text-gray-400">Secure checkout</span>
              <div className="flex gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">MTN MoMo</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Card</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Cash</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
