'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

function Stars({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-gold fill-gold' : 'text-gray-300'}`} />
      ))}
      {count !== undefined && <span className="text-xs text-gray-500 ml-1">({count})</span>}
    </div>
  );
}

const TAG_LABELS = {
  bestseller: 'Best Seller',
  premium: 'Premium',
  natural: 'Natural',
  value: 'Value',
  eco: 'Eco',
  baby: 'Baby Safe',
  'family-size': 'Family Size',
  heritage: 'Since 1962',
  essential: 'Essential',
  medical: 'Medical',
  antibacterial: 'Anti-bacterial',
  bulk: 'Bulk',
  new: 'New',
};

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(() => {
    try {
      const w = JSON.parse(localStorage.getItem('sulfo_wishlist') || '[]');
      return w.includes(product.id);
    } catch { return false; }
  });
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    setAdding(true);
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, brand: product.brand });
    toast({ message: `${product.name} added to cart!` });
    setTimeout(() => setAdding(false), 600);
  };

  const toggleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const w = JSON.parse(localStorage.getItem('sulfo_wishlist') || '[]');
    const updated = wished ? w.filter(id => id !== product.id) : [...w, product.id];
    localStorage.setItem('sulfo_wishlist', JSON.stringify(updated));
    setWished(!wished);
    toast({ type: wished ? 'info' : 'success', message: wished ? 'Removed from wishlist' : 'Added to wishlist ❤️' });
  };

  const fmt = (n) => n.toLocaleString() + ' RWF';
  const inStock = product.stock > 0;

  return (
    <Link href={`/products/${product.id}`} className="card group flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square product-img-wrap">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />

        {/* Tag */}
        {product.tag && (
          <span className={`product-tag tag-${product.tag}`}>
            {TAG_LABELS[product.tag] || product.tag}
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge badge-gray text-xs font-bold">Out of Stock</span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button onClick={toggleWish}
            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors">
            <Heart className={`w-4 h-4 ${wished ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
          <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <Eye className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-sm font-semibold text-navy leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.weight && <p className="text-xs text-gray-400">{product.weight}</p>}

        <Stars rating={product.rating || 4} count={product.reviewCount} />

        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="font-bold text-primary text-base">{fmt(product.price)}</p>
          <button
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
              ${inStock
                ? 'bg-primary text-white hover:bg-primary-light active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {adding ? 'Added!' : 'Add'}
          </button>
        </div>

        {product.stock < 10 && product.stock > 0 && (
          <p className="text-[11px] text-orange-500 font-medium">Only {product.stock} left!</p>
        )}
      </div>
    </Link>
  );
}

export { Stars };
