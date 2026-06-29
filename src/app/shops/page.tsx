'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, ChevronDown, X } from 'lucide-react';
import ShopCard from '@/components/ShopCard';

const allShops = [
  { id: 1, name: 'AutoParts Tbilisi', location: 'Tbilisi', rating: 4.8, reviewCount: 312, productCount: 1840, categories: ['Engine', 'Body', 'Electrical'], verified: true, coverColor: 'gradient-teal' },
  { id: 2, name: 'GermanParts Pro', location: 'Rustavi', rating: 4.6, reviewCount: 187, productCount: 920, categories: ['BMW', 'Audi', 'VW'], verified: true, coverColor: 'bg-teal-dark' },
  { id: 3, name: 'BrakeMaster Georgia', location: 'Kutaisi', rating: 4.9, reviewCount: 441, productCount: 620, categories: ['Brakes', 'Suspension', 'Wheels'], verified: true, coverColor: 'bg-teal' },
  { id: 4, name: 'ElectroParts GE', location: 'Tbilisi', rating: 4.5, reviewCount: 98, productCount: 380, categories: ['Electrical', 'Sensors', 'ECU'], verified: false, coverColor: 'gradient-yellow' },
  { id: 5, name: 'LuxAuto Parts', location: 'Tbilisi', rating: 4.7, reviewCount: 203, productCount: 740, categories: ['Mercedes', 'BMW', 'Lexus'], verified: true, coverColor: 'bg-teal-dark' },
  { id: 6, name: 'CheapParts GE', location: 'Batumi', rating: 4.2, reviewCount: 156, productCount: 2100, categories: ['Budget', 'Universal', 'Filters'], verified: false, coverColor: 'bg-teal' },
  { id: 7, name: 'FordSpecialist GE', location: 'Gori', rating: 4.4, reviewCount: 74, productCount: 310, categories: ['Ford', 'Opel', 'Chevrolet'], verified: true, coverColor: 'gradient-teal' },
  { id: 8, name: 'JapanAuto Tbilisi', location: 'Tbilisi', rating: 4.8, reviewCount: 289, productCount: 1120, categories: ['Toyota', 'Honda', 'Nissan'], verified: true, coverColor: 'bg-teal-dark' },
  { id: 9, name: 'TruckParts Pro', location: 'Rustavi', rating: 4.3, reviewCount: 62, productCount: 450, categories: ['Trucks', 'Commercial', 'Heavy'], verified: false, coverColor: 'bg-teal' },
  { id: 10, name: 'OEM Direct Georgia', location: 'Tbilisi', rating: 4.9, reviewCount: 518, productCount: 3400, categories: ['OEM', 'Original', 'All Brands'], verified: true, coverColor: 'gradient-teal' },
  { id: 11, name: 'SportsParts GE', location: 'Kutaisi', rating: 4.5, reviewCount: 113, productCount: 560, categories: ['Sport', 'Performance', 'Tuning'], verified: true, coverColor: 'bg-teal-dark' },
  { id: 12, name: 'BudgetAuto Tbilisi', location: 'Tbilisi', rating: 3.9, reviewCount: 241, productCount: 1650, categories: ['Budget', 'Aftermarket', 'Used'], verified: false, coverColor: 'gradient-yellow' },
];

const locations = ['All Cities', 'Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori'];
const sortOptions = ['Top Rated', 'Most Reviews', 'Most Products', 'Newest'];
const categoryFilters = ['All', 'Engine', 'Brakes', 'Body', 'Electrical', 'Suspension', 'OEM', 'Budget'];

export default function ShopsPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All Cities');
  const [sortBy, setSortBy] = useState('Top Rated');
  const [activeCat, setActiveCat] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allShops
    .filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== 'All Cities' && s.location !== city) return false;
      if (activeCat !== 'All' && !s.categories.some((c) => c.toLowerCase().includes(activeCat.toLowerCase()))) return false;
      if (verifiedOnly && !s.verified) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Top Rated') return b.rating - a.rating;
      if (sortBy === 'Most Reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'Most Products') return b.productCount - a.productCount;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="gradient-teal py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white mb-2">Browse Shops</h1>
          <p className="text-white/70">{allShops.length} verified shops and dealers across Georgia</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filter bar */}
        <div className="bg-white rounded-2xl p-4 card-shadow mb-6 border border-teal-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search shops..." className="input-base pl-9" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select value={city} onChange={(e) => setCity(e.target.value)} className="input-base pl-8 pr-8 bg-white appearance-none w-full sm:w-40">
                {locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-base pr-8 bg-white appearance-none w-full sm:w-44">
                {sortOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg text-sm font-semibold transition-colors ${showFilters ? 'border-teal text-teal bg-teal/5' : 'border-teal-border text-muted hover:border-teal hover:text-teal'}`}>
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-teal-border flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-10 h-6 rounded-full transition-colors ${verifiedOnly ? 'bg-teal' : 'bg-[#e2e8f0]'} relative cursor-pointer`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-medium text-dark">Verified only</span>
              </label>
            </div>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categoryFilters.map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCat === cat ? 'bg-teal text-white' : 'bg-white text-muted hover:text-dark border border-teal-border hover:border-teal'}`}>
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted mb-5">
          Showing <strong className="text-dark">{filtered.length}</strong> shops
          {search && <> matching &ldquo;<strong className="text-dark">{search}</strong>&rdquo;</>}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((s) => <ShopCard key={s.id} shop={s} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-dark mb-2">No shops found</h3>
            <p className="text-muted text-sm">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setCity('All Cities'); setActiveCat('All'); setVerifiedOnly(false); }} className="mt-4 btn-teal">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
