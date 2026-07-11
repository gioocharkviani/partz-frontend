'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, ChevronDown, MapPin, Star, Filter, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { partsApi, shopsApi, resolveUploadUrl } from '@/lib/api';

const CITIES = ['All', 'Tbilisi', 'Rustavi', 'Kutaisi', 'Batumi', 'Gori', 'Zugdidi', 'Poti', 'Telavi'];
const CONDITIONS = ['All', 'new', 'used'];

function PartsContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('featured');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    shopsApi.brands().then(setBrands).catch(() => []);
    shopsApi.categories().then(setCategories).catch(() => []);
  }, []);

  /* Prefill category from ?category=Name coming from the homepage category tiles */
  useEffect(() => {
    const catName = searchParams.get('category');
    if (catName && categories.length) {
      const match = categories.find((c) => c.name.toLowerCase().includes(catName.toLowerCase()));
      if (match) setSelectedCategoryId(String(match.id));
    }
  }, [searchParams, categories]);

  const fetchParts = useCallback(() => {
    setLoading(true);
    const query: Record<string, string | number> = {};
    if (search) query.q = search;
    if (selectedBrandId) query.brand_id = selectedBrandId;
    if (selectedCategoryId) query.category_id = selectedCategoryId;
    if (selectedCondition !== 'All') query.condition = selectedCondition;
    if (selectedCity !== 'All') query.city = selectedCity;
    if (maxPrice < 2000) query.max_price = maxPrice;

    partsApi.search(query)
      .then((res) => {
        let list = res;
        if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
        else if (sortBy === 'rating') list = [...list].sort((a, b) => Number(b.shop?.rating_avg || 0) - Number(a.shop?.rating_avg || 0));
        setParts(list);
      })
      .catch(() => setParts([]))
      .finally(() => setLoading(false));
  }, [search, selectedBrandId, selectedCategoryId, selectedCondition, selectedCity, maxPrice, sortBy]);

  useEffect(() => {
    const id = setTimeout(fetchParts, 300);
    return () => clearTimeout(id);
  }, [fetchParts]);

  const handleAddToCart = async (partId: number) => {
    await addToCart(partId);
    setAddedId(partId);
    setTimeout(() => setAddedId(null), 1500);
  };

  const activeFilters = [
    selectedCategoryId && categories.find((c) => String(c.id) === selectedCategoryId)?.name,
    selectedBrandId && brands.find((b) => String(b.id) === selectedBrandId)?.name,
    selectedCondition !== 'All' && selectedCondition,
    selectedCity !== 'All' && selectedCity,
    maxPrice < 2000 && `≤ ₾${maxPrice}`,
  ].filter(Boolean) as string[];

  const resetFilters = () => {
    setSelectedCategoryId('');
    setSelectedBrandId('');
    setSelectedCondition('All');
    setSelectedCity('All');
    setMaxPrice(2000);
  };

  const topCategories = categories.filter((c) => !c.parent_id);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-black text-dark uppercase tracking-wider mb-3">Category</h3>
        <div className="space-y-1">
          <button onClick={() => setSelectedCategoryId('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${!selectedCategoryId ? 'bg-teal text-white' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
            All
          </button>
          {topCategories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategoryId(String(cat.id))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategoryId === String(cat.id) ? 'bg-teal text-white' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black text-dark uppercase tracking-wider mb-3">Brand</h3>
        <div className="space-y-1 max-h-56 overflow-y-auto">
          <button onClick={() => setSelectedBrandId('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${!selectedBrandId ? 'bg-teal text-white' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
            All
          </button>
          {brands.map((brand) => (
            <button key={brand.id} onClick={() => setSelectedBrandId(String(brand.id))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedBrandId === String(brand.id) ? 'bg-teal text-white' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black text-dark uppercase tracking-wider mb-3">Condition</h3>
        <div className="flex gap-2">
          {CONDITIONS.map((c) => (
            <button key={c} onClick={() => setSelectedCondition(c)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all capitalize ${selectedCondition === c ? 'bg-teal border-teal text-white' : 'border-teal-border text-muted hover:border-teal'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black text-dark uppercase tracking-wider mb-3">City</h3>
        <div className="space-y-1">
          {CITIES.map((city) => (
            <button key={city} onClick={() => setSelectedCity(city)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCity === city ? 'bg-teal text-white' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
              {city}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black text-dark uppercase tracking-wider mb-3">Max Price: ₾{maxPrice}</h3>
        <input type="range" min={50} max={2000} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-teal" />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>₾50</span><span>₾2000</span>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <button onClick={resetFilters} className="w-full py-2.5 rounded-xl border-2 border-teal-border text-sm font-bold text-muted hover:border-teal hover:text-teal transition-colors flex items-center justify-center gap-2">
          <X size={14} /> Reset Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-teal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-black text-dark mb-1">Car Parts</h1>
          <p className="text-muted text-sm">Find genuine parts from verified Georgian sellers</p>
          <div className="mt-5 flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search parts, brands, models…"
                className="input-base pl-10 w-full" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="input-base pl-3 pr-8 bg-white appearance-none">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated Shops</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-teal-border text-sm font-bold text-muted hover:border-teal hover:text-teal transition-colors">
              <Filter size={15} /> Filters
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 bg-teal text-white text-xs rounded-full flex items-center justify-center">{activeFilters.length}</span>
              )}
            </button>
          </div>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeFilters.map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal/10 border border-teal/20 text-teal text-xs font-bold rounded-full">
                  {f}
                </span>
              ))}
              <button onClick={resetFilters} className="text-xs text-muted hover:text-dark underline">clear all</button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-teal-border p-5 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <span className="w-8 h-8 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-sm text-muted mb-5 font-semibold">{parts.length} parts found</p>
                {parts.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-teal-wash border-2 border-teal-border flex items-center justify-center mx-auto mb-4">
                      <Search size={28} className="text-muted" />
                    </div>
                    <h3 className="font-black text-dark text-lg mb-2">No parts found</h3>
                    <p className="text-muted text-sm mb-4">Try adjusting your filters</p>
                    <button onClick={resetFilters} className="btn-teal">Reset Filters</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {parts.map((part) => (
                      <PartCard key={part.id} part={part}
                        justAdded={addedId === part.id}
                        onAddToCart={() => handleAddToCart(part.id)} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto p-5 lg:hidden">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-dark text-lg flex items-center gap-2"><SlidersHorizontal size={18} /> Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-teal-wash rounded-lg">
                <X size={18} />
              </button>
            </div>
            <FilterPanel />
          </div>
        </>
      )}
    </div>
  );
}

function PartCard({ part, justAdded, onAddToCart }: { part: any; justAdded: boolean; onAddToCart: () => void }) {
  const img = part.images?.[0] ? resolveUploadUrl(part.images[0]) : '';
  return (
    <div className="bg-white rounded-2xl border border-teal-border overflow-hidden card-shadow group hover:-translate-y-0.5 transition-all duration-200">
      <Link href={`/parts/${part.id}`} className="block">
        <div className="h-48 overflow-hidden relative bg-teal-wash flex items-center justify-center">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={part.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <span className="text-3xl">🔧</span>
          )}
          <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${part.condition === 'new' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
            {part.condition === 'new' ? 'NEW' : 'USED'}
          </span>
          {part.category?.name && (
            <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 text-dark shadow-sm">
              {part.category.name}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/parts/${part.id}`}>
          <h3 className="font-black text-dark text-sm leading-tight mb-1 group-hover:text-teal transition-colors line-clamp-2">{part.name}</h3>
        </Link>
        <p className="text-xs text-muted mb-3 line-clamp-2">{part.description}</p>

        <div className="flex items-center gap-3 mb-3 text-xs text-muted flex-wrap">
          {part.shop?.rating_avg != null && (
            <span className="flex items-center gap-1"><Star size={10} className="fill-yellow text-yellow" />{Number(part.shop.rating_avg).toFixed(1)}</span>
          )}
          {part.shop?.city && <span className="flex items-center gap-1"><MapPin size={10} />{part.shop.city}</span>}
          {part.brand?.name && <span className="text-teal font-semibold">{part.brand.name}</span>}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-black text-dark">₾{Number(part.price).toLocaleString()}</div>
            <div className="text-xs text-muted">{part.shop?.name}</div>
          </div>
          <button onClick={onAddToCart}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-bold text-white bg-teal rounded-xl hover:bg-teal-dark transition-colors">
            {justAdded ? <Check size={15} /> : <ShoppingCart size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PartsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="w-8 h-8 border-2 border-teal-border border-t-teal rounded-full animate-spin" /></div>}>
      <PartsContent />
    </Suspense>
  );
}
