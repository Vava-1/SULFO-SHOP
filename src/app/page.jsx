import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, Award, Leaf } from 'lucide-react';
import { getAllProducts } from '@/lib/db';
import { CATEGORIES } from '@/lib/products-data';
import ProductCard from '@/components/ProductCard';

export const metadata = { title: 'Sulfo Rwanda Quality Products Since 1962' };

const HERO_IMGS = [
  'https://sulforwanda.com/wp-content/uploads/2024/01/About-us-top-image-2.jpg',
  'https://sulforwanda.com/wp-content/uploads/2023/12/IMG001.jpg',
];

const BRANDS = [
  { name: 'CLAIRE', color: '#E8D5F5', text: '#6B21A8', desc: 'Beauty & Skin Care' },
  { name: 'NIL', color: '#DBEAFE', text: '#1D4ED8', desc: 'Pure Spring Water' },
  { name: 'SANTÉ', color: '#D1FAE5', text: '#065F46', desc: 'Health & Hygiene' },
  { name: 'VAGUE', color: '#FEF3C7', text: '#92400E', desc: 'Body Wash' },
  { name: 'SAFARI', color: '#FEE2E2', text: '#991B1B', desc: 'Laundry Soap' },
  { name: 'BLACK PEARL', color: '#F3F4F6', text: '#1F2937', desc: 'Hair Care' },
];

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const featured   = allProducts.filter(p => p.tag === 'bestseller').slice(0, 4);
  const newArr     = allProducts.slice(-4);

  return (
    <div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="hero-gradient text-white relative overflow-hidden min-h-[560px] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full border-[80px] border-white" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-[60px] border-white" />
        </div>

        <div className="section relative z-10 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              🇷🇼 Made in Rwanda Since 1962
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Crafting Quality<br />
              <span className="text-gold">Experiences</span><br />
              for Every Home
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              From powerful laundry soaps to premium skin care Sulfo Rwanda has been
              a trusted household name for over 60 years. ISO certified. Proudly Rwandan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-gold flex items-center gap-2 text-base py-3.5 px-7">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="border border-white/30 text-white px-7 py-3.5 rounded-xl text-base font-medium hover:bg-white/10 transition-all">
                Our Story
              </Link>
            </div>
            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
              {[['60+','Years of excellence'],['150+','Quality products'],['3','Rwanda regions']].map(([n,l]) => (
                <div key={n}>
                  <p className="font-display text-2xl font-bold text-gold">{n}</p>
                  <p className="text-xs text-white/50 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero product image */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="w-[420px] h-[420px] rounded-3xl overflow-hidden shadow-2xl relative">
              <Image src={HERO_IMGS[0]} alt="Sulfo Rwanda products" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-6 left-0 bg-white text-navy rounded-2xl px-5 py-3 shadow-xl">
              <p className="text-xs text-gray-500">ISO Certified</p>
              <p className="font-bold text-sm">9001 · 14001 · 22000</p>
            </div>
            <div className="absolute top-6 right-0 bg-gold text-white rounded-2xl px-4 py-2 shadow-xl">
              <p className="text-xs font-bold">FREE DELIVERY</p>
              <p className="text-[10px] opacity-80">Orders over 30,000 RWF</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST PILLARS ─────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="section py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck,       title: 'Free Delivery',        sub: 'On orders over 30,000 RWF' },
              { icon: ShieldCheck, title: 'ISO Certified Quality', sub: '9001 · 14001 · 45001 · 22000' },
              { icon: Award,       title: 'Since 1962',           sub: '60+ years of excellence' },
              { icon: Leaf,        title: 'Made in Rwanda',       sub: 'Locally produced with care' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 bg-green-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{title}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ───────────────────────────────────── */}
      <section className="section py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Shop by Category</p>
            <h2 className="section-title">Everything Your Home Needs</h2>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-primary hover:shadow-card transition-all duration-200">
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <p className="text-xs font-semibold text-navy group-hover:text-primary transition-colors leading-snug">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ──────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section pb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-gold text-xs font-bold uppercase tracking-widest mb-2">🔥 Top Picks</p>
              <h2 className="section-title">Best Sellers</h2>
            </div>
            <Link href="/products?tag=bestseller" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── BRANDS STRIP ──────────────────────────────────────── */}
      <section className="bg-surface-alt py-16">
        <div className="section">
          <div className="text-center mb-10">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Our Brand Family</p>
            <h2 className="section-title">Trusted Names, Quality You Know</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BRANDS.map(b => (
              <Link key={b.name} href={`/products?brand=${encodeURIComponent(b.name)}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:shadow-card transition-all"
                style={{ background: b.color }}>
                <p className="font-display font-bold text-base" style={{ color: b.text }}>{b.name}</p>
                <p className="text-[10px] font-medium opacity-70" style={{ color: b.text }}>{b.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ──────────────────────────────────────── */}
      <section className="section py-16">
        <div className="relative bg-primary rounded-3xl overflow-hidden p-8 md:p-12 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-[50px] border-gold" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full border-[40px] border-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="badge badge-gold mb-3">Free Delivery Offer</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">Order Over 30,000 RWF</h3>
              <p className="text-white/70">Get free delivery anywhere in Kigali. Stock up on your Sulfo favourites and save.</p>
            </div>
            <Link href="/products" className="btn-gold flex-shrink-0 flex items-center gap-2 text-base py-3.5 px-8">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────────────── */}
      <section className="section pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">✨ Fresh In</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArr.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── ABOUT TEASER ──────────────────────────────────────── */}
      <section className="bg-navy text-white py-20">
        <div className="section grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden h-72 lg:h-96">
            <Image src="https://sulforwanda.com/wp-content/uploads/2024/01/about-us-2.jpg" alt="Sulfo factory" fill className="object-cover" unoptimized />
          </div>
          <div>
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="font-display text-3xl font-bold mb-5 leading-snug">
              Innovation in Commerce<br />since 1962
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Founded by Tajdin H. Jaffer and Khatun Jaffer, Sulfo Rwanda Industries has grown from a single factory
              to a nationally recognised manufacturer of over 150 quality products from laundry soap to ISO-certified spring water.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              Today, under MD Dharmarajan Hariharan, Sulfo continues to invest in sustainable production,
              international certification, and empowering Rwandan communities.
            </p>
            <Link href="/about" className="btn-gold inline-flex items-center gap-2">
              Read Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
