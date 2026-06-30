'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, Save, Loader2, Package, LayoutDashboard, ShoppingBag, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

const CATS = ['Laundry Soap','Toilet Soap','Petroleum Jelly','Body Wash','Lotion & Cream','Hair Care','Hand & Hygiene','Household Cleaning','Drinking Water','Glycerine'];
const EMPTY = { name:'', brand:'', category:'Laundry Soap', price:'', stock:'', weight:'', description:'', image:'', tag:'' };

export default function AdminProductsPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) { router.push('/auth/login'); return; }
    if (user?.role === 'admin') loadProducts();
  }, [user, authLoading]);

  const loadProducts = () => {
    fetch('/api/admin/products').then(r => r.json()).then(d => { setProducts(d.products || []); setLoading(false); });
  };

  const startEdit = (p) => { setForm({ ...p, price: String(p.price), stock: String(p.stock) }); setEditId(p.id); setShowForm(true); };
  const startAdd  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const cancel    = () => { setShowForm(false); setForm(EMPTY); setEditId(null); };

  const save = async () => {
    if (!form.name || !form.price || !form.stock) { toast({ type:'error', message:'Name, price & stock are required' }); return; }
    setSaving(true);
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    const url = editId ? `/api/products/${editId}` : '/api/admin/products';
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if (res.ok) { toast({ message: editId ? 'Product updated!' : 'Product added!' }); cancel(); loadProducts(); }
    else { const d = await res.json(); toast({ type:'error', message: d.error }); }
    setSaving(false);
  };

  const del = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/products/${id}`, { method:'DELETE' });
    if (res.ok) { toast({ message:'Product deleted' }); loadProducts(); }
  };

  const fmt = n => Number(n).toLocaleString() + ' RWF';
  const filtered = products.filter(p => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(search.toLowerCase()));

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
            <Link key={href} href={href} className={`admin-nav-link ${href === '/admin/products' ? 'active' : ''}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <button onClick={logout} className="admin-nav-link w-full text-left text-red-400">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-navy">Products</h1>
              <p className="text-sm text-gray-500">{products.length} products in catalog</p>
            </div>
            <button onClick={startAdd} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="input mb-4 max-w-sm" />

          {/* Form modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-navy">{editId ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={cancel}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                  {[
                    { k:'name',        l:'Product Name *',   type:'text' },
                    { k:'brand',       l:'Brand *',          type:'text' },
                    { k:'price',       l:'Price (RWF) *',    type:'number' },
                    { k:'stock',       l:'Stock Qty *',      type:'number' },
                    { k:'weight',      l:'Weight/Size',      type:'text' },
                    { k:'image',       l:'Image URL',        type:'url'  },
                  ].map(({ k, l, type }) => (
                    <div key={k}>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{l}</label>
                      <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                        type={type} className="input" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Tag</label>
                    <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className="input">
                      {['','bestseller','premium','natural','value','eco','baby','family-size','heritage','new'].map(t => <option key={t} value={t}>{t || 'None'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="input resize-none" rows={3} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={cancel} className="btn-outline flex-1">Cancel</button>
                    <button onClick={save} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving…' : 'Save Product'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Product','Category','Price','Stock','Tag','Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />}
                          </div>
                          <div>
                            <p className="font-medium text-navy text-sm line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{p.category}</td>
                      <td className="py-3 px-4 font-semibold text-primary">{fmt(p.price)}</td>
                      <td className="py-3 px-4">
                        <span className={`badge text-xs ${p.stock < 10 ? 'badge-red' : p.stock < 30 ? 'badge-gold' : 'badge-green'}`}>{p.stock}</span>
                      </td>
                      <td className="py-3 px-4">
                        {p.tag && <span className="badge badge-blue text-xs">{p.tag}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => del(p.id, p.name)} className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
