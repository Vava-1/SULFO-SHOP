'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, CreditCard, Smartphone, Banknote, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const PAYMENT_METHODS = [
  { id: 'momo',  label: 'MTN Mobile Money', icon: Smartphone, desc: 'Pay via MTN MoMo — instant & secure' },
  { id: 'card',  label: 'Visa / Mastercard', icon: CreditCard, desc: 'Pay by debit or credit card' },
  { id: 'cash',  label: 'Cash on Delivery',  icon: Banknote,   desc: 'Pay in cash when your order arrives' },
];

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', city: 'Kigali', district: '', momoNumber: '' });
  const [payment, setPayment] = useState('momo');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState('');

  const fmt = n => n.toLocaleString() + ' RWF';
  const delivery = total >= 30000 ? 0 : 3000;
  const grandTotal = total + delivery;

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleOrder = async () => {
    if (!user) { toast({ type: 'error', message: 'Please sign in to place an order' }); router.push('/auth/login'); return; }
    if (!form.name || !form.phone || !form.address) { toast({ type: 'error', message: 'Please fill all required fields' }); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total: grandTotal, shippingAddress: form, paymentMethod: payment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      setOrderId(data.order.id);
      setDone(true);
    } catch (e) {
      toast({ type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !done) return (
    <div className="section py-24 text-center">
      <p className="text-5xl mb-4">🛒</p>
      <h2 className="font-display text-2xl font-bold mb-4">Your cart is empty</h2>
      <Link href="/products" className="btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Shop Products</Link>
    </div>
  );

  if (done) return (
    <div className="section py-24">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-green-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-navy mb-3">Order Confirmed! 🎉</h1>
        <p className="text-gray-600 mb-2">Thank you, <strong>{form.name}</strong>! Your order has been received.</p>
        <p className="text-sm text-gray-500 mb-6">Order ID: <strong className="text-primary">{orderId}</strong></p>
        <div className="bg-surface rounded-2xl border p-5 text-left mb-6 text-sm space-y-2">
          <p><strong>Delivery to:</strong> {form.address}, {form.city}</p>
          <p><strong>Contact:</strong> {form.phone}</p>
          <p><strong>Payment:</strong> {PAYMENT_METHODS.find(m => m.id === payment)?.label}</p>
          <p><strong>Estimated:</strong> 1–3 business days</p>
        </div>
        <div className="flex gap-3">
          <Link href="/orders" className="btn-primary flex-1">View My Orders</Link>
          <Link href="/products" className="btn-outline flex-1">Shop More</Link>
        </div>
      </div>
    </div>
  );

  const steps = ['Shipping', 'Payment', 'Review'];

  return (
    <div className="section py-10">
      {/* Back */}
      <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="section-title mb-8">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button onClick={() => i < step && setStep(i + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${step === i + 1 ? 'bg-primary text-white shadow-md' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </button>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-primary' : 'text-gray-500'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px w-12 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form area */}
        <div className="lg:col-span-2">

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-navy">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name *</label>
                  <input value={form.name} onChange={e => setF('name', e.target.value)} className="input" placeholder="e.g. Jean Pierre" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone Number *</label>
                  <input value={form.phone} onChange={e => setF('phone', e.target.value)} className="input" placeholder="+250 7XX XXX XXX" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
                  <input value={form.email} onChange={e => setF('email', e.target.value)} className="input" type="email" placeholder="your@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Delivery Address *</label>
                  <input value={form.address} onChange={e => setF('address', e.target.value)} className="input" placeholder="Street, Sector, Cell" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">City</label>
                  <input value={form.city} onChange={e => setF('city', e.target.value)} className="input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">District</label>
                  <select value={form.district} onChange={e => setF('district', e.target.value)} className="input">
                    <option value="">Select…</option>
                    {['Kicukiro','Nyarugenge','Gasabo','Musanze','Rubavu','Rusizi','Huye','Muhanga'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!form.name || !form.phone || !form.address}
                className="btn-primary w-full mt-2 disabled:opacity-50">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-navy">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(m => {
                  const Icon = m.icon;
                  return (
                    <label key={m.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === m.id ? 'border-primary bg-green-muted' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-primary" />
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-navy">{m.label}</p>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {payment === 'momo' && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">MTN MoMo Number</label>
                  <input value={form.momoNumber} onChange={e => setF('momoNumber', e.target.value)} className="input" placeholder="+250 7XX XXX XXX" />
                  <p className="text-xs text-gray-500 mt-1">You will receive a payment prompt on this number</p>
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-navy">Review Your Order</h2>
              <div className="bg-surface rounded-xl p-4 text-sm space-y-1">
                <p><strong>Name:</strong> {form.name}</p>
                <p><strong>Phone:</strong> {form.phone}</p>
                <p><strong>Address:</strong> {form.address}, {form.district}, {form.city}</p>
                <p><strong>Payment:</strong> {PAYMENT_METHODS.find(m => m.id === payment)?.label}</p>
              </div>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                    <p className="flex-1 text-sm text-navy">{item.name} × {item.quantity}</p>
                    <p className="text-sm font-semibold">{fmt(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(2)} className="btn-outline flex-1">← Back</button>
                <button onClick={handleOrder} disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</> : 'Place Order →'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="card p-5 h-fit">
          <h3 className="font-semibold text-navy mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm mb-4">
            {cart.slice(0, 3).map(item => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600 truncate flex-1 mr-2">{item.name} ×{item.quantity}</span>
                <span className="font-medium flex-shrink-0">{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
            {cart.length > 3 && <p className="text-xs text-gray-400">+{cart.length - 3} more items</p>}
          </div>
          <div className="h-px bg-gray-100 mb-3" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{fmt(total)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : fmt(delivery)}</span></div>
          </div>
          <div className="h-px bg-gray-100 my-3" />
          <div className="flex justify-between font-bold text-navy">
            <span>Total</span><span className="text-primary text-lg">{fmt(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
