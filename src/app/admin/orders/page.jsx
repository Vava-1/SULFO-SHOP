'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, LayoutDashboard, ShoppingBag, Eye, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled'];
const STATUS_COLORS = {
  pending:'text-orange-600 bg-orange-50 border-orange-200',
  confirmed:'text-blue-600 bg-blue-50 border-blue-200',
  processing:'text-purple-600 bg-purple-50 border-purple-200',
  shipped:'text-indigo-600 bg-indigo-50 border-indigo-200',
  delivered:'text-green-600 bg-green-50 border-green-200',
  cancelled:'text-red-600 bg-red-50 border-red-200',
};

export default function AdminOrdersPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) { router.push('/auth/login'); return; }
    if (user?.role === 'admin') {
      fetch('/api/admin/orders').then(r => r.json()).then(d => { setOrders(d.orders || []); setLoading(false); });
    }
  }, [user, authLoading]);

  const updateStatus = async (id, status) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast({ message: `Order ${id} marked as ${status}` });
    }
  };

  const fmt = n => Number(n).toLocaleString() + ' RWF';
  const fmtDate = d => new Date(d).toLocaleDateString('en-RW', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-navy flex-shrink-0 flex flex-col py-6 px-4 hidden lg:flex">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm font-display">S</span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">SULFO Admin</p>
            <p className="text-[10px] text-white/40">Control Panel</p>
          </div>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { href:'/admin',          icon:LayoutDashboard, label:'Dashboard' },
            { href:'/admin/products', icon:Package,         label:'Products' },
            { href:'/admin/orders',   icon:ShoppingBag,     label:'Orders' },
            { href:'/',               icon:Eye,             label:'View Store' },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`admin-nav-link ${href === '/admin/orders' ? 'active' : ''}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <button onClick={logout} className="admin-nav-link w-full text-left text-red-400">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-navy">Orders</h1>
              <p className="text-sm text-gray-500">{orders.length} total orders</p>
            </div>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${filter === s ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}>
                {s || 'All'} {s && `(${orders.filter(o => o.status === s).length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="shimmer h-20 rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(order => (
                <div key={order.id} className="card overflow-hidden">
                  <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 text-left">
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="font-mono font-medium text-navy text-xs">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Customer</p>
                        <p className="font-medium text-navy">{order.shippingAddress?.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="font-bold text-primary">{fmt(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Date</p>
                        <p className="text-gray-600 text-xs">{fmtDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`badge text-xs border ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {expanded === order.id && (
                    <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
                      {/* Items */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Items</p>
                        <div className="space-y-1">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm bg-white rounded-xl px-3 py-2">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">{fmt(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery & payment */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-3 text-sm">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Delivery Address</p>
                          <p className="text-navy">{order.shippingAddress?.name}</p>
                          <p className="text-gray-600">{order.shippingAddress?.address}</p>
                          <p className="text-gray-600">{order.shippingAddress?.phone}</p>
                        </div>
                        <div className="bg-white rounded-xl p-3 text-sm">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Payment</p>
                          <p className="text-navy font-medium capitalize">{order.paymentMethod}</p>
                          {order.shippingAddress?.momoNumber && <p className="text-gray-600">{order.shippingAddress.momoNumber}</p>}
                        </div>
                      </div>

                      {/* Status update */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUSES.map(s => (
                            <button key={s} onClick={() => updateStatus(order.id, s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                                ${order.status === s ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 hover:border-primary hover:text-primary'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
