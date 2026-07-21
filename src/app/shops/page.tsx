'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, ChevronDown, X } from 'lucide-react';
import ShopCard from '@/components/ShopCard';
import { shopsApi } from '@/lib/api';
import { toShopCard } from '@/lib/mappers';
import { useLanguage } from '@/context/LanguageContext';

const locations = ['All Cities', 'Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi'];

export default function ShopsPage() {
  const { t } = useLanguage();
  const sortOptions = [
    { value: 'ranking', label: t('shopsPage.sortTopRanked') },
    { value: 'reviews', label: t('shopsPage.sortMostReviews') },
    { value: 'newest', label: t('shopsPage.sortNewest') },
  ];
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All Cities');
  const [sortBy, setSortBy] = useState('ranking');
  const [activeCat, setActiveCat] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const query: Record<string, string> = { sort: sortBy === 'newest' ? 'newest' : 'ranking' };
    if (city !== 'All Cities') query.city = city;
    shopsApi.list(query)
      .then(setShops)
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  }, [city, sortBy]);

  const categoryFilters = useMemo(() => {
    const set = new Set<string>();
    shops.forEach((s) => (s.categories || []).forEach((c: any) => set.add(c.name)));
    return ['All', ...Array.from(set)];
  }, [shops]);

  const cards = shops.map(toShopCard);

  const filtered = cards
    .filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeCat !== 'All' && !s.categories.some((c: string) => c.toLowerCase().includes(activeCat.toLowerCase()))) return false;
      if (verifiedOnly && !s.verified) return false;
      return true;
    })
    .sort((a, b) => (sortBy === 'reviews' ? b.reviewCount - a.reviewCount : 0));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="gradient-teal py-12">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white mb-2">{t('footer.browseShops')}</h1>
          <p className="text-white/70">{shops.length} {t('shopsPage.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filter bar */}
        <div className="bg-white rounded-2xl p-4 card-shadow mb-6 border border-teal-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('shopsPage.searchPlaceholder')} className="input-base pl-9" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select value={city} onChange={(e) => setCity(e.target.value)} className="input-base pl-8 pr-8 bg-white appearance-none w-full sm:w-40">
                {locations.map((l) => <option key={l} value={l}>{l === 'All Cities' ? t('shopsPage.allCities') : l}</option>)}
              </select>
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-base pr-8 bg-white appearance-none w-full sm:w-44">
                {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg text-sm font-semibold transition-colors ${showFilters ? 'border-teal text-teal bg-teal/5' : 'border-teal-border text-muted hover:border-teal hover:text-teal'}`}>
              <SlidersHorizontal size={15} />
              {t('partsPage.filters')}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-teal-border flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-10 h-6 rounded-full transition-colors ${verifiedOnly ? 'bg-teal' : 'bg-cream-dark'} relative cursor-pointer`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-medium text-dark">{t('shopsPage.trustedOnly')}</span>
              </label>
            </div>
          )}
        </div>

        {/* Category pills */}
        {categoryFilters.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {categoryFilters.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCat === cat ? 'bg-teal text-white' : 'bg-white text-muted hover:text-dark border border-teal-border hover:border-teal'}`}>
                {cat === 'All' ? t('common.all') : cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-8 h-8 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mb-5">
              {t('shopsPage.showingPrefix')} <strong className="text-dark">{filtered.length}</strong> {t('shopsPage.showingSuffix')}
              {search && <> {t('shopsPage.matchingLabel')} &ldquo;<strong className="text-dark">{search}</strong>&rdquo;</>}
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((s) => <ShopCard key={s.id} shop={s} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-dark mb-2">{t('shopsPage.noShopsFound')}</h3>
                <p className="text-muted text-sm">{t('shopsPage.tryAdjustingSearch')}</p>
                <button onClick={() => { setSearch(''); setCity('All Cities'); setActiveCat('All'); setVerifiedOnly(false); }} className="mt-4 btn-teal">
                  {t('partsPage.resetFilters')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
