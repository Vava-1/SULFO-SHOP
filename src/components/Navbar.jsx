'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, Heart, ChevronDown, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['Laundry Soap','Toilet Soap','Petroleum Jelly','Body Wash','Lotion & Cream','Hair Care','Hand & Hygiene','Household Cleaning','Drinking Water','Glycerine'];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { count, cart } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const catRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-2 px-4 text-center">
        🇷🇼 Made in Rwanda since 1962 &nbsp;•&nbsp; Free delivery on orders over 30,000 RWF &nbsp;•&nbsp; ISO 9001 | ISO 22000 Certified
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}`}>
        <div className="section">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm font-display">S</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-bold text-navy text-lg leading-none">SULFO</p>
                <p className="text-[10px] text-primary font-medium tracking-widest uppercase">Rwanda</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              <Link href="/" className={`btn-ghost ${pathname === '/' ? 'text-primary bg-green-muted' : ''}`}>Home</Link>

              {/* Categories dropdown */}
              <div className="relative" ref={catRef}>
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className={`btn-ghost flex items-center gap-1.5 ${pathname.startsWith('/products') ? 'text-primary' : ''}`}
                >
                  Products <ChevronDown className={`w-4 h-4 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                </button>
                {catOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-hover border border-gray-100 p-2 z-50">
                    <Link href="/products" onClick={() => setCatOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-green-muted text-sm font-semibold text-primary mb-1">
                      View All Products →
                    </Link>
                    <div className="h-px bg-gray-100 mb-1" />
                    {CATEGORIES.map(cat => (
                      <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}
                        onClick={() => setCatOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-green-muted text-sm text-navy hover:text-primary transition-colors">
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/products?tag=bestseller" className={`btn-ghost ${pathname === '/bestsellers' ? 'text-primary' : ''}`}>Best Sellers</Link>
              <Link href="/about" className="btn-ghost">About Us</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">

              {/* Search */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="btn-ghost p-2">
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="btn-ghost p-2 hidden sm:flex">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('openCart'))}
                className="relative btn-ghost p-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>

              {/* User menu */}
              <div className="relative hidden sm:block" ref={userRef}>
                <button onClick={() => setUserOpen(!userOpen)} className="btn-ghost p-2 flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${user ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {user ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-hover border border-gray-100 p-2 z-50">
                    {user ? (
                      <>
                        <div className="px-3 py-2 mb-1">
                          <p className="font-semibold text-navy text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="h-px bg-gray-100 mb-1" />
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-muted text-sm text-primary font-medium">
                            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <Link href="/orders" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-muted text-sm">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        <button onClick={() => { setUserOpen(false); logout(); }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-sm text-red-600 w-full">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" onClick={() => setUserOpen(false)}
                          className="block px-3 py-2 rounded-xl hover:bg-green-muted text-sm font-medium">Sign In</Link>
                        <Link href="/auth/register" onClick={() => setUserOpen(false)}
                          className="block px-3 py-2 rounded-xl hover:bg-green-muted text-sm">Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button onClick={() => setOpen(!open)} className="lg:hidden btn-ghost p-2">
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar expansion */}
          {searchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products — e.g. Claire soap, NIL water…"
                  className="input flex-1"
                />
                <button type="submit" className="btn-primary px-5">Search</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="btn-ghost px-3">
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            <Link href="/" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Home</Link>
            <Link href="/products" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-primary">All Products</Link>
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`} onClick={() => setOpen(false)}
                className="block py-2 pl-4 text-sm text-gray-600">
                {cat}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <Link href="/wishlist" onClick={() => setOpen(false)} className="block py-2 text-sm">Wishlist</Link>
            <Link href="/orders" onClick={() => setOpen(false)} className="block py-2 text-sm">My Orders</Link>
            {user ? (
              <button onClick={() => { setOpen(false); logout(); }} className="block py-2 text-sm text-red-600">Sign Out</button>
            ) : (
              <Link href="/auth/login" onClick={() => setOpen(false)} className="block py-2 text-sm text-primary font-medium">Sign In</Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
