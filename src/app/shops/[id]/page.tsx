'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, CheckCircle, Package, ChevronLeft, Search, X } from 'lucide-react';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';

const shop = {
  id: 1,
  name: 'AutoParts Tbilisi',
  description: "One of Tbilisi's largest auto parts suppliers. We stock OEM and aftermarket parts for all major European and Japanese vehicles. 15+ years of experience.",
  location: 'Tbilisi, Isani District',
  phone: '+995 555 123 456',
  hours: 'Mon–Sat 09:00–19:00',
  rating: 4.8,
  reviewCount: 312,
  productCount: 1840,
  verified: true,
  categories: ['Engine', 'Body & Exterior', 'Electrical', 'Suspension', 'Brakes', 'Transmission'],
  coverColor: 'gradient-teal',
};

const products = [
  { id: 1, name: 'BMW E46 Front Bumper OEM', price: 320, shop: 'AutoParts Tbilisi', category: 'Body & Exterior', compatibility: 'BMW 3 Series E46 1998-2005', image: '', condition: 'used' as const },
  { id: 2, name: 'Bosch Alternator 120A', price: 185, shop: 'AutoParts Tbilisi', category: 'Electrical', compatibility: 'Universal 12V', image: '', condition: 'new' as const },
  { id: 3, name: 'Mercedes W211 Headlight R', price: 240, shop: 'AutoParts Tbilisi', category: 'Lighting', compatibility: 'Mercedes E-Class W211', image: '', condition: 'refurbished' as const },
  { id: 4, name: 'VW Golf 5 Gearbox ECU', price: 150, shop: 'AutoParts Tbilisi', category: 'Electrical', compatibility: 'VW Golf V 2003-2008', image: '', condition: 'used' as const },
  { id: 5, name: 'Audi A4 B7 Rear Axle', price: 110, shop: 'AutoParts Tbilisi', category: 'Suspension', compatibility: 'Audi A4 B7 2004-2008', image: '', condition: 'used' as const },
  { id: 6, name: 'BMW E90 Xenon Ballast', price: 85, shop: 'AutoParts Tbilisi', category: 'Electrical', compatibility: 'BMW 3 Series E90 2005-2011', image: '', condition: 'refurbished' as const },
  { id: 7, name: 'Opel Astra Engine Mount', price: 45, shop: 'AutoParts Tbilisi', category: 'Engine', compatibility: 'Opel Astra H 2004-2009', image: '', condition: 'new' as const },
  { id: 8, name: 'Ford Focus Timing Belt', price: 68, shop: 'AutoParts Tbilisi', category: 'Engine', compatibility: 'Ford Focus 2.0 2004-2011', image: '', condition: 'new' as const },
];

const reviews = [
  { author: 'Giorgi M.', rating: 5, text: 'Great service, fast shipping. Part arrived in perfect condition.', date: '2 days ago' },
  { author: 'Nino K.', rating: 4, text: 'Good quality parts at reasonable prices. Will shop again.', date: '1 week ago' },
  { author: 'David B.', rating: 5, text: 'Found a rare part for my BMW here. Staff was very helpful.', date: '2 weeks ago' },
];

const SHOP_CATEGORIES = ['All', ...shop.categories];
const CONDITIONS = ['All', 'New', 'Used', 'Refurbished'];

export default function ShopDetailPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCondition, setActiveCondition] = useState('All');

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (activeCondition !== 'All' && p.condition !== activeCondition.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Cover */}
      <div className={`${shop.coverColor} h-48 relative`}>
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#fff_0px,#fff_1px,transparent_1px,transparent_10px)]" />
        <div className="absolute top-4 left-4">
          <Link href="/shops" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors">
            <ChevronLeft size={16} /> Back to Shops
          </Link>
        </div>
        {shop.verified && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
            <CheckCircle size={14} className="fill-white" /> Verified Shop
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shop header */}
        <div className="bg-white rounded-2xl -mt-8 relative z-10 p-6 mb-8 card-shadow border border-teal-border">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-16 h-16 rounded-xl gradient-teal flex items-center justify-center text-white text-2xl font-black shrink-0">
              {shop.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-dark">{shop.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-1.5">
                    <StarRating rating={shop.rating} />
                    <span className="text-sm text-muted">({shop.reviewCount} reviews)</span>
                    <span className="flex items-center gap-1 text-sm text-muted"><Package size={13} />{shop.productCount} products</span>
                  </div>
                </div>
                <Link href="/request" className="btn-primary">Request a Part</Link>
              </div>
              <p className="text-muted text-sm mt-3 leading-relaxed">{shop.description}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <span className="flex items-center gap-1.5 text-sm text-muted"><MapPin size={13} className="text-teal" />{shop.location}</span>
                <span className="flex items-center gap-1.5 text-sm text-muted"><Phone size={13} className="text-teal" />{shop.phone}</span>
                <span className="flex items-center gap-1.5 text-sm text-muted"><Clock size={13} className="text-teal" />{shop.hours}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 pb-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Categories</h3>
              <div className="space-y-1">
                {SHOP_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat ? 'bg-teal text-white font-bold' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Condition</h3>
              <div className="space-y-1">
                {CONDITIONS.map((cond) => (
                  <button key={cond} onClick={() => setActiveCondition(cond)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCondition === cond ? 'bg-teal text-white font-bold' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="border-b border-teal-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-dark">{r.author}</span>
                      <span className="text-xs text-muted">{r.date}</span>
                    </div>
                    <StarRating rating={r.rating} size={11} showNumber={false} />
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 card-shadow mb-5 border border-teal-border">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products in this shop..." className="input-base pl-9" />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-muted mb-4">
              <strong className="text-dark">{filtered.length}</strong> products
              {activeCategory !== 'All' && <> in <strong className="text-dark">{activeCategory}</strong></>}
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center card-shadow border border-teal-border">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-bold text-dark mb-1">No products found</h3>
                <p className="text-sm text-muted">Try a different category or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
