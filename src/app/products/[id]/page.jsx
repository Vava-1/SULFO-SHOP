'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingCart, Heart, Star, Minus, Plus, Check, ArrowLeft, Package, Truck, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ProductCard';

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-gold fill-gold' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => {
        setProduct(d.product);
        setLoading(false);
        if (d.product) {
          fetch(`/api/products?category=${encodeURIComponent(d.product.category)}`)
            .then(r => r.json())
            .then(rd => setRelated((rd.products || []).filter(p => p.id !== id).slice(0, 4)));
          const w = JSON.parse(localStorage.getItem('sulfo_wishlist') || '[]');
          setWished(w.includes(id));
        }
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: qty });
    toast({ message: `${product.name} added to cart!` });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWish = () => {
    const w = JSON.parse(localStorage.getItem('sulfo_wishlist') || '[]');
    const updated = wished ? w.filter(i => i !== id) : [...w, id];
    localStorage.setItem('sulfo_wishlist', JSON.stringify(updated));
    setWished(!wished);
    toast({ type: wished ? 'info' : 'success', message: wished ? 'Removed from wishlist' : 'Added to wishlist ❤️' });
  };

  const fmt = n => n.toLocaleString() + ' RWF';

  if (loading) return (
    <div className="section py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="shimmer rounded-3xl aspect-square" />
        <div className="space-y-4">
          {[80, 60, 40, 100, 60, 80].map((w, i) => (
            <div key={i} className={`shimmer h-5 rounded`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="section py-24 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="font-display text-2xl font-bold mb-4">Product not found</h2>
      <Link href="/products" className="btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Products</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.image];

  return (
    <div>
      <div className="section py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">{product.category}</Link>
          <span>/</span>
          <span className="text-navy font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image gallery */}
          <div className="space-y-3 lg:sticky lg:top-24">
            <div className="relative rounded-3xl overflow-hidden bg-gray-50 aspect-square">
              <Image src={images[imgIdx] || product.image} alt={product.name} fill className="object-cover" unoptimized />
              {product.tag && (
                <span className={`product-tag tag-${product.tag} text-xs`}>{product.tag}</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <span className="badge badge-green mb-3">{product.brand}</span>
            <h1 className="font-display text-3xl font-bold text-navy mb-2 leading-tight">{product.name}</h1>
            {product.weight && <p className="text-gray-500 text-sm mb-3">Size: {product.weight}</p>}

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <Stars rating={product.rating || 4} />
              <span className="text-sm font-semibold text-navy">{(product.rating || 4.0).toFixed(1)}</span>
              <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-primary">{fmt(product.price)}</p>
              {product.price >= 10000 && (
                <p className="text-sm text-green-600 mt-1 font-medium">✓ Eligible for free delivery</p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="mb-6 space-y-2">
                {product.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-navy">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}

            {/* Stock status */}
            <div className="mb-6">
              {product.stock > 20 ? (
                <span className="badge badge-green">✓ In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="badge badge-gold">⚠ Only {product.stock} left!</span>
              ) : (
                <span className="badge badge-red">✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity + CTA */}
            {product.stock > 0 && (
              <div className="flex gap-3 items-center mb-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-navy">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${added ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary-light'}`}>
                  {added ? (<><Check className="w-4 h-4" /> Added to Cart!</>) : (<><ShoppingCart className="w-4 h-4" /> Add to Cart — {fmt(product.price * qty)}</>)}
                </button>
              </div>
            )}

            <button onClick={toggleWish} className="btn-outline w-full flex items-center justify-center gap-2 mb-6">
              <Heart className={`w-4 h-4 ${wished ? 'fill-red-500 text-red-500' : ''}`} />
              {wished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Delivery info */}
            <div className="bg-surface rounded-2xl border border-gray-100 p-4 space-y-3">
              {[
                { icon: Truck,   text: 'Free delivery on orders over 30,000 RWF' },
                { icon: Package, text: 'Standard delivery 1–3 business days in Kigali' },
                { icon: Shield,  text: '100% authentic Sulfo Rwanda products' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Category & Brand tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="badge badge-green hover:bg-green-soft">{product.category}</Link>
              <Link href={`/products?brand=${encodeURIComponent(product.brand)}`} className="badge badge-blue hover:bg-blue-100">Brand: {product.brand}</Link>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="section-title mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
