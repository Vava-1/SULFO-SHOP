'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle, Clock, CheckCircle, LayoutDashboard, Settings, LogOut, BarChart3, Plus, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-navy mb-0.5">{value}</p>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) { router.push('/auth/login'); return; }
    if (user?.role === 'admin') {
      Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/orders').then(r => r.json()),
      ]).then(([s, o]) => {
        setStats(s.stats);
        setOrders((o.orders || []).slice(0, 5));
        setLoading(false);
      });
    }
  }, [user, authLoading]);

  const fmt = n => Number(n || 0).toLocaleString() + ' RWF';

  const STATUS_COLORS = { pending:'text-orange-500 bg-orange-50', confirmed:'text-blue-600 bg-blue-50', processing:'text-purple-600 bg-purple-50', shipped:'text-indigo-600 bg-indigo-50', delivered:'text-green-600 bg-green-50', cancelled:'text-red-500 bg-red-50' };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
            { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/admin/products', icon: Package,         label: 'Products' },
            { href: '/admin/orders',   icon: ShoppingBag,     label: 'Orders' },
            { href: '/',               icon: Eye,             label: 'View Store' },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="admin-nav-link">
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4 space-y-1">
          <div className="px-4 py-2">
            <p className="text-xs text-white/40">Signed in as</p>
            <p className="text-sm text-white font-medium truncate">{user?.name}</p>
          </div>
          <button onClick={logout} className="admin-nav-link w-full text-left text-red-400 hover:text-red-300">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-navy">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/products" className="btn-outline flex items-center gap-2 text-sm py-2">
                <Plus className="w-4 h-4" /> Add Product
              </Link>
              <Link href="/admin/orders" className="btn-primary flex items-center gap-2 text-sm py-2">
                <ShoppingBag className="w-4 h-4" /> Manage Orders
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Package}     label="Total Products" value={stats?.totalProducts || 0}    sub={`${stats?.categories || 0} categories`} color="bg-primary" />
            <StatCard icon={ShoppingBag} label="Total Orders"   value={stats?.totalOrders || 0}     sub={`${stats?.pendingOrders || 0} pending`} color="bg-gold" />
            <StatCard icon={Users}       label="Customers"      value={stats?.totalUsers || 0}       sub="Registered users" color="bg-blue-600" />
            <StatCard icon={TrendingUp}  label="Revenue"        value={fmt(stats?.revenue)}          sub="All-time total" color="bg-purple-600" />
          </div>

          {/* Alert cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {(stats?.pendingOrders || 0) > 0 && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-orange-800">{stats.pendingOrders} Pending Orders</p>
                  <p className="text-xs text-orange-600">Require your attention</p>
                </div>
                <Link href="/admin/orders" className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-800">View →</Link>
              </div>
            )}
            {(stats?.lowStock || 0) > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-red-800">{stats.lowStock} Low Stock Products</p>
                  <p className="text-xs text-red-600">Less than 10 units remaining</p>
                </div>
                <Link href="/admin/products" className="ml-auto text-xs font-semibold text-red-600 hover:text-red-800">Review →</Link>
              </div>
            )}
          </div>

          {/* Recent orders */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-navy">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline">View all →</Link>
            </div>
            {orders.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-xs text-gray-600">{order.id}</td>
                        <td className="py-3 px-3 font-medium text-navy">{order.shippingAddress?.name || '—'}</td>
                        <td className="py-3 px-3 text-gray-500">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                        <td className="py-3 px-3 font-semibold text-primary text-right">{fmt(order.total)}</td>
                        <td className="py-3 px-3">
                          <span className={`badge text-xs ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
