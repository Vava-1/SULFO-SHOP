import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, AtSign } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-white mt-20">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="section py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: 'ISO 9001 Certified', sub: 'Quality Management' },
              { icon: '🌿', title: 'ISO 14001', sub: 'Environmental Standard' },
              { icon: '💧', title: 'ISO 22000', sub: 'Food Safety — NIL Water' },
              { icon: '🇷🇼', title: 'Made in Rwanda', sub: 'Since 1962 · 60+ Years' },
            ].map(t => (
              <div key={t.title} className="flex items-center gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-white/50">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold font-display">S</span>
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-none">SULFO</p>
                <p className="text-[10px] text-primary font-medium tracking-widest">RWANDA INDUSTRIES</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Crafting quality home care and personal care products for Rwandan families since 1962. ISO certified excellence, proudly Made in Rwanda.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Globe,   href: 'https://www.facebook.com/profile.php?id=61560045512204' },
                { icon: AtSign,  href: 'https://www.instagram.com/sulfo_rwanda/' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-xl hover:bg-primary flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">Our Products</h4>
            <ul className="space-y-2.5">
              {['Laundry Soap','Toilet Soap','Petroleum Jelly','Body Wash','Lotion & Cream','Hair Care','Drinking Water (NIL)'].map(c => (
                <li key={c}>
                  <Link href={`/products?category=${encodeURIComponent(c)}`} className="text-sm text-white/55 hover:text-primary transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Sulfo', href: '/about' },
                { label: 'Our Story', href: '/about#story' },
                { label: 'Brands', href: '/brands' },
                { label: 'Certifications', href: '/about#certifications' },
                { label: 'Careers', href: '/careers' },
                { label: 'Admin', href: '/admin' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/55">#12 KN 82 St, B.P. 90<br />Kigali, Rwanda</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+250788305979" className="text-sm text-white/55 hover:text-primary transition-colors">+250 788 305 979</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+250252575457" className="text-sm text-white/55 hover:text-primary transition-colors">+250 252 575 457</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:info@sulfo.com" className="text-sm text-white/55 hover:text-primary transition-colors">info@sulfo.com</a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-white/50">Sales offices also in</p>
              <p className="text-xs text-white/70 font-medium mt-1">Rubavu · Rusizi · Kigali Centre</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {year} Sulfo Rwanda Industries Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Use</Link>
            <Link href="/returns" className="hover:text-white/70 transition-colors">Returns</Link>
          </div>
          <p>Built by <span className="text-primary font-medium">GIVA TECH</span></p>
        </div>
      </div>
    </footer>
  );
}
