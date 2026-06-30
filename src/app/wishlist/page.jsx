'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('sulfo_wishlist') || '[]');
    if (!ids.length) { setLoading(false); return; }
    fetch('/api/products').then(r => r.json()).then(d => {
      setProducts((d.products || []).filter(p => ids.includes(p.id)));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="section py-10"><div className="shimmer h-48 rounded-2xl" /></div>;

  return (
    <div className="section py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <h1 className="section-title">My Wishlist</h1>
        <span className="badge badge-gray">{products.length} items</span>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-navy mb-2">Wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save products you love by clicking the heart icon</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
