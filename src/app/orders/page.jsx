'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, Truck, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG = {
  pending:    { icon: Clock,       color: 'text-orange-500', bg: 'bg-orange-50',  label: 'Pending' },
  confirmed:  { icon: CheckCircle, color: 'text-blue-600',   bg: 'bg-blue-50',    label: 'Confirmed' },
  processing: { icon: Package,     color: 'text-purple-600', bg: 'bg-purple-50',  label: 'Processing' },
  shipped:    { icon: Truck,       color: 'text-indigo-600', bg: 'bg-indigo-50',  label: 'Shipped' },
  delivered:  { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',   label: 'Delivered' },
  cancelled:  { icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50',     label: 'Cancelled' },
};

const STEPS = ['pending','confirmed','processing','shipped','delivered'];

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    if (user) {
      fetch('/api/orders')
        .then(r => r.json())
        .then(d => { setOrders(d.orders || []); setLoading(false); });
    }
  }, [user, authLoading]);

  const fmt = n => n?.toLocaleString() + ' RWF';
  const fmtDate = d => new Date(d).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' });

  if (authLoading || loading) return (
    <div className="section py-10 space-y-4">
      {[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="section py-10">
      <div className="mb-8">
        <h1 className="section-title mb-1">My Orders</h1>
        <p className="text-gray-500 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-green-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-primary/30" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Your order history will appear here</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const isOpen = selected === order.id;
            const stepIdx = STEPS.indexOf(order.status);

            return (
              <div key={order.id} className="card overflow-hidden">
                {/* Order header */}
                <button onClick={() => setSelected(isOpen ? null : order.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-navy text-sm">{order.id}</p>
                      <span className={`badge text-xs ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{fmtDate(order.createdAt)} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-primary">{fmt(order.total)}</p>
                    <p className="text-xs text-gray-400">{order.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* Order detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-4 space-y-4">
                    {/* Progress bar */}
                    {order.status !== 'cancelled' && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-3">Order Progress</p>
                        <div className="flex items-center gap-1">
                          {STEPS.map((s, i) => {
                            const done = i <= stepIdx;
                            return (
                              <div key={s} className="flex items-center gap-1 flex-1">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${done ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                  {done ? '✓' : i + 1}
                                </div>
                                <p className={`text-[9px] font-medium hidden sm:block ${done ? 'text-primary' : 'text-gray-400'}`}>{STATUS_CONFIG[s]?.label}</p>
                                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done && i < stepIdx ? 'bg-primary' : 'bg-gray-200'}`} />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Items Ordered</p>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-sm bg-gray-50 rounded-xl px-3 py-2">
                            <span className="text-navy">{item.name} × {item.quantity}</span>
                            <span className="font-medium">{fmt(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div className="bg-green-muted rounded-xl p-3 text-sm">
                      <p className="font-semibold text-primary mb-1">Delivery Address</p>
                      <p className="text-navy/70">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                      <p className="text-navy/70">Phone: {order.shippingAddress?.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
