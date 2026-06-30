import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
export const metadata = { title: 'About Sulfo Rwanda' };
export default function AboutPage() {
  return (
    <div>
      <section className="hero-gradient text-white py-20">
        <div className="section text-center max-w-3xl mx-auto">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="font-display text-4xl font-bold mb-5">Innovation in Commerce Since 1962</h1>
          <p className="text-white/70 text-lg">From a single factory in Kigali to Rwanda's most trusted household brand.</p>
        </div>
      </section>
      <section className="section py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden h-80">
          <Image src="https://sulforwanda.com/wp-content/uploads/2024/01/about-us-1.jpg" alt="Sulfo factory" fill className="object-cover" unoptimized />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-navy mb-4">Founded with Purpose</h2>
          <p className="text-gray-600 leading-relaxed mb-4">Sulfo Rwanda Industries was founded in 1962 by Mr. Tajdin H. Jaffer and Khatun Jaffer with a mission to manufacture quality, affordable products for every Rwandan household.</p>
          <p className="text-gray-600 leading-relaxed mb-6">Today, under MD Dharmarajan Hariharan, Sulfo produces 150+ products across personal care, home care, and beverages — serving Rwanda and East Africa.</p>
          <div className="grid grid-cols-2 gap-4">
            {[['1962','Year Founded'],['150+','Products'],['3','Sales regions'],['4','ISO Certifications']].map(([n,l]) => (
              <div key={l} className="bg-surface rounded-xl p-4"><p className="font-display text-2xl font-bold text-primary">{n}</p><p className="text-sm text-gray-500">{l}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section id="certifications" className="bg-surface-alt py-16">
        <div className="section text-center mb-10"><h2 className="section-title">ISO Certified Excellence</h2></div>
        <div className="section grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[['ISO 9001','Quality Management','🏆'],['ISO 14001','Environmental Mgmt','🌿'],['ISO 45001','Health & Safety','🛡️'],['ISO 22000','Food Safety — NIL','💧']].map(([code,name,icon]) => (
            <div key={code} className="card p-6 text-center"><span className="text-3xl mb-3 block">{icon}</span><p className="font-bold text-primary text-lg">{code}</p><p className="text-sm text-gray-600 mt-1">{name}</p></div>
          ))}
        </div>
      </section>
      <section className="section py-16 text-center">
        <h2 className="section-title mb-4">Experience Sulfo Quality</h2>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2 text-base py-4 px-8">Shop All Products <ArrowRight className="w-4 h-4" /></Link>
      </section>
    </div>
  );
}
