import Link from 'next/link';
import { Car, Phone, Mail, MapPin, Globe2, MessageCircle, Rss } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#1a0e00' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
                <Car size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">
                partz<span className="text-white/90">.ge</span>
              </span>
            </Link>
            <p className="text-white/65 text-sm leading-relaxed mb-5">
              Georgia's largest car parts marketplace. Verified shops, live requests, fast delivery.
            </p>
            <div className="flex gap-2.5">
              {[Globe2, MessageCircle, Rss].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-5">Platform</h4>
            <ul className="space-y-3">
              {[
                { href: '/shops', label: 'Browse Shops' },
                { href: '/parts', label: 'Find Parts' },
                { href: '/request', label: 'Submit Request' },
                { href: '/auth/register?role=shop', label: 'Open a Shop' },
                { href: '/auth/register?role=Seller', label: 'Become Seller' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white/90 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-5">Categories</h4>
            <ul className="space-y-3">
              {['Engine Parts', 'Brakes & Suspension', 'Body & Exterior', 'Electrical', 'Transmission', 'Filters & Fluids', 'Tyres & Wheels'].map((cat) => (
                <li key={cat}>
                  <Link href={`/parts?category=${encodeURIComponent(cat)}`} className="text-sm text-white/60 hover:text-white/90 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={14} className="text-white/90 mt-0.5 shrink-0" />
                Tbilisi, Georgia
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={14} className="text-white/90 shrink-0" />
                +995 555 000 000
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={14} className="text-white/90 shrink-0" />
                info@partz.ge
              </li>
            </ul>
            <div className="mt-5 p-3.5 bg-white/10 rounded-xl">
              <p className="text-xs text-white/40 mb-0.5">Working hours</p>
              <p className="text-sm text-white font-semibold">Monâ€“Sat: 10:00 â€“ 19:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">Â© 2025 partz.ge â€” All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} href="#" className="text-xs text-white/40 hover:text-white/90 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


