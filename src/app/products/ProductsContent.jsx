'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = ['Laundry Soap','Toilet Soap','Petroleum Jelly','Body Wash','Lotion & Cream','Hair Care','Hand & Hygiene','Household Cleaning','Drinking Water','Glycerine'];
const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
  { value: 'rating',     label: 'Best Rated' },
];

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState(searchParams.get('search') || '');
  const [category, setCategory]   = useState(searchParams.get('category') || '');
  const [sort, setSort]           = useState('default');
  const [inStock, setInStock]     = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax]   = useState(20000);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (query)    list = list.filter(p => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
    if (category) list = list.filter(p => p.category === category);
    if (inStock)  list = list.filter(p => p.stock > 0);
    list = list.filter(p => p.price <= priceMax);
    switch (sort) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'name-asc':   list.sort((a,b) => a.name.localeCompare(b.name)); break;
      case 'rating':     list.sort((a,b) => (b.rating||0) - (a.rating||0)); break;
    }
    return list;
  }, [products, query, category, inStock, sort, priceMax]);

  const clearFilters = () => { setQuery(''); setCategory(''); setInStock(false); setPriceMax(20000); setSort('default'); };
  const hasFilters   = query || category || inStock || priceMax < 20000;

  const Skeleton = () => (
    <div className="card overflow-hidden">
      <div className="shimmer aspect-square" />
      <div className="p-4 space-y-2">
        <div className="shimmer h-3 w-16 rounded" />
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-3 w-24 rounded" />
        <div className="flex justify-between items-center mt-2">
          <div className="shimmer h-5 w-20 rounded" />
          <div className="shimmer h-8 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="section py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-1">All Products</h1>
        <p className="text-gray-500 text-sm">{loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}</p>
      </div>

      {/* Search + controls bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products…"
            className="input pl-10"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category select */}
        <div className="relative">
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="input pr-9 appearance-none cursor-pointer min-w-[160px]">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="input pr-9 appearance-none cursor-pointer min-w-[180px]">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter toggle */}
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:border-primary hover:text-primary bg-white'}`}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && <span className="w-2 h-2 bg-gold rounded-full" />}
        </button>

        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 px-3">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Expanded filters panel */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCategory('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!category ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:border-primary'}`}>All</button>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c === category ? '' : c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${category === c ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:border-primary'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Max Price: {priceMax.toLocaleString()} RWF</label>
            <input type="range" min={500} max={20000} step={500} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>500</span><span>20,000 RWF</span></div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Availability</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="accent-primary w-4 h-4" />
              <span className="text-sm">In stock only</span>
            </label>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {category && <span className="badge badge-green">{category} <button onClick={() => setCategory('')}><X className="w-3 h-3 ml-1" /></button></span>}
          {query && <span className="badge badge-blue">"{query}" <button onClick={() => setQuery('')}><X className="w-3 h-3 ml-1" /></button></span>}
          {inStock && <span className="badge badge-green">In Stock <button onClick={() => setInStock(false)}><X className="w-3 h-3 ml-1" /></button></span>}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-display text-xl font-bold text-navy mb-2">No products found</p>
          <p className="text-gray-500 text-sm mb-6">Try a different search term or clear your filters</p>
          <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

    </div>
  );
}
