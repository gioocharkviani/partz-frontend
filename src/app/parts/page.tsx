'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, ShoppingCart, MapPin, Star, Filter } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Part {
  id: number;
  name: string;
  price: number;
  condition: 'new' | 'used';
  category: string;
  brand: string;
  shop: string;
  shopId: number;
  city: string;
  rating: number;
  image: string;
  description: string;
  partNumber?: string;
  year?: string;
}

const PART_IMAGES: Record<string, string> = {
  Engine: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
  Electrical: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  Brakes: 'https://images.unsplash.com/photo-1600861194802-a2b11076bc51?w=600&q=80',
  Body: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
  Suspension: 'https://images.unsplash.com/photo-1617469767941-7c4dcda70af8?w=600&q=80',
  Exhaust: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
  Cooling: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80',
  Interior: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&q=80',
};

const PARTS: Part[] = [
  { id: 1, name: 'BMW N52 Engine Block', price: 1850, condition: 'used', category: 'Engine', brand: 'BMW', shop: 'AutoParts Tbilisi', shopId: 1, city: 'Tbilisi', rating: 4.8, image: PART_IMAGES.Engine, description: 'Excellent condition N52 engine block from 2007 BMW 3 Series. Low mileage, no leaks.', partNumber: 'N52B25A', year: '2006-2010' },
  { id: 2, name: 'Mercedes W204 Alternator', price: 280, condition: 'used', category: 'Electrical', brand: 'Mercedes', shop: 'Parts Galaxy', shopId: 2, city: 'Batumi', rating: 4.6, image: PART_IMAGES.Electrical, description: 'OEM alternator from C-Class W204. Tested and fully working.', partNumber: 'A0141540802', year: '2007-2014' },
  { id: 3, name: 'Toyota Camry Brake Kit', price: 120, condition: 'new', category: 'Brakes', brand: 'Toyota', shop: 'OEM King', shopId: 3, city: 'Tbilisi', rating: 4.9, image: PART_IMAGES.Brakes, description: 'Complete front brake kit — pads and rotors. New OEM Toyota parts.', partNumber: 'TK-CAM-BK001', year: '2012-2017' },
  { id: 4, name: 'Audi A4 Front Bumper', price: 340, condition: 'used', category: 'Body', brand: 'Audi', shop: 'AutoParts Tbilisi', shopId: 1, city: 'Tbilisi', rating: 4.5, image: PART_IMAGES.Body, description: 'Original Audi A4 B8 front bumper. Minor paint scuffs, no cracks.', partNumber: '8K0807437', year: '2008-2012' },
  { id: 5, name: 'Honda Civic Shock Absorber', price: 95, condition: 'new', category: 'Suspension', brand: 'Honda', shop: 'Parts Galaxy', shopId: 2, city: 'Batumi', rating: 4.7, image: PART_IMAGES.Suspension, description: 'Front shock absorber for Honda Civic 9th generation. KYB brand.', partNumber: 'KYB-343416', year: '2011-2015' },
  { id: 6, name: 'VW Golf Exhaust Manifold', price: 190, condition: 'used', category: 'Exhaust', brand: 'Volkswagen', shop: 'GeoMotors', shopId: 4, city: 'Kutaisi', rating: 4.4, image: PART_IMAGES.Exhaust, description: 'Cast iron exhaust manifold from Golf V 1.6. Good condition, no cracks.', partNumber: '036253033S', year: '2003-2008' },
  { id: 7, name: 'BMW Radiator E90', price: 210, condition: 'new', category: 'Cooling', brand: 'BMW', shop: 'OEM King', shopId: 3, city: 'Tbilisi', rating: 5.0, image: PART_IMAGES.Cooling, description: 'Aftermarket aluminum radiator for BMW 3 Series E90. Fits perfectly.', partNumber: '17117521023', year: '2005-2011' },
  { id: 8, name: 'Mercedes Leather Seat Set', price: 650, condition: 'used', category: 'Interior', brand: 'Mercedes', shop: 'AutoParts Tbilisi', shopId: 1, city: 'Tbilisi', rating: 4.3, image: PART_IMAGES.Interior, description: 'Front and rear leather seats from E-Class W212. Black leather, very good condition.', year: '2009-2015' },
  { id: 9, name: 'Toyota Land Cruiser Starter Motor', price: 175, condition: 'used', category: 'Electrical', brand: 'Toyota', shop: 'GeoMotors', shopId: 4, city: 'Kutaisi', rating: 4.6, image: PART_IMAGES.Electrical, description: 'Original starter motor for LC100. Fully tested, starts on first crank.', partNumber: '28100-66020', year: '1998-2007' },
  { id: 10, name: 'Audi A6 Air Filter', price: 35, condition: 'new', category: 'Engine', brand: 'Audi', shop: 'Parts Galaxy', shopId: 2, city: 'Batumi', rating: 4.8, image: PART_IMAGES.Engine, description: 'Genuine Mahle air filter for Audi A6 C6 2.0 TDI.', partNumber: 'LX1804', year: '2004-2011' },
  { id: 11, name: 'Honda Accord Caliper Set', price: 155, condition: 'new', category: 'Brakes', brand: 'Honda', shop: 'OEM King', shopId: 3, city: 'Tbilisi', rating: 4.7, image: PART_IMAGES.Brakes, description: 'Remanufactured front brake calipers. Includes brackets and hardware.', year: '2008-2012' },
  { id: 12, name: 'BMW M3 Carbon Spoiler', price: 420, condition: 'used', category: 'Body', brand: 'BMW', shop: 'AutoParts Tbilisi', shopId: 1, city: 'Tbilisi', rating: 4.9, image: PART_IMAGES.Body, description: 'Genuine carbon fiber trunk spoiler from E92 M3. Perfect condition.', year: '2008-2013' },
];

const CATEGORIES = ['All', 'Engine', 'Electrical', 'Brakes', 'Body', 'Suspension', 'Exhaust', 'Cooling', 'Interior'];
const BRANDS = ['All', 'BMW', 'Mercedes', 'Toyota', 'Audi', 'Honda', 'Volkswagen'];
const CONDITIONS = ['All', 'new', 'used'];
const CITIES = ['All', 'Tbilisi', 'Batumi', 'Kutaisi'];

export default function PartsPage() {
  const { addToCart, items } = useCart();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('featured');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const filtered = useMemo(() => {
    let list = PARTS.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
      if (selectedCondition !== 'All' && p.condition !== selectedCondition) return false;
      if (selectedCity !== 'All' && p.city !== selectedCity) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, selectedCategory, selectedBrand, selectedCondition, selectedCity, maxPrice, sortBy]);

  const handleAddToCart = (part: Part) => {
    addToCart({ id: part.id, name: part.name, price: part.price, shop: part.shop, condition: part.condition, image: part.image });
    setAddedIds((prev) => [...prev, part.id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== part.id)), 1500);
  };

  const isInCart = (id: number) => items.some((i) => i.id === id);
  const justAdded = (id: number) => addedIds.includes(id);

  const activeFilters = [
    selectedCategory !== 'All' && selectedCategory,
    selectedBrand !== 'All' && selectedBrand,
    selectedCondition !== 'All' && selectedCondition,
    selectedCity !== 'All' && selectedCity,
    maxPrice < 2000 && `≤ ₾${maxPrice}`,
  ].filter(Boolean) as string[];

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedCondition('All');
    setSelectedCity('All');
    setMaxPrice(2000);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-black text-dark uppercase tracking-wider mb-3">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategory === cat ? 'bg-teal text-white' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black text-dark uppercase tracking-wider mb-3">Brand</h3>
        <div className="space-y-1">
          {BRANDS.map((brand) => (
            <button key={brand} onClick={() => setSelectedBrand(brand)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedBrand === brand ? 'bg-teal text-white' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
              {brand}
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
                <option value="rating">Top Rated</option>
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
            <p className="text-sm text-muted mb-5 font-semibold">{filtered.length} parts found</p>
            {filtered.length === 0 ? (
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
                {filtered.map((part) => (
                  <PartCard key={part.id} part={part}
                    inCart={isInCart(part.id)}
                    justAdded={justAdded(part.id)}
                    onAddToCart={() => handleAddToCart(part)} />
                ))}
              </div>
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

function PartCard({ part, inCart, justAdded, onAddToCart }: {
  part: Part; inCart: boolean; justAdded: boolean; onAddToCart: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-teal-border overflow-hidden card-shadow group hover:-translate-y-0.5 transition-all duration-200">
      <a href={`/parts/${part.id}`} className="block">
        <div className="h-48 overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={part.image} alt={part.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${part.condition === 'new' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
            {part.condition === 'new' ? 'NEW' : 'USED'}
          </span>
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 text-dark shadow-sm">
            {part.category}
          </span>
        </div>
      </a>
      <div className="p-4">
        <a href={`/parts/${part.id}`}>
          <h3 className="font-black text-dark text-sm leading-tight mb-1 group-hover:text-teal transition-colors line-clamp-2">{part.name}</h3>
        </a>
        <p className="text-xs text-muted mb-3 line-clamp-2">{part.description}</p>

        <div className="flex items-center gap-3 mb-3 text-xs text-muted">
          <span className="flex items-center gap-1"><Star size={10} className="fill-yellow text-yellow" />{part.rating}</span>
          <span className="flex items-center gap-1"><MapPin size={10} />{part.city}</span>
          <span className="text-teal font-semibold hover:underline cursor-pointer">{part.brand}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-black text-dark">₾{part.price.toLocaleString()}</div>
            <div className="text-xs text-muted">{part.shop}</div>
          </div>
          <button onClick={onAddToCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${justAdded ? 'bg-emerald-500 text-white' : inCart ? 'bg-teal-wash border-2 border-teal text-teal' : 'bg-teal text-white hover:bg-teal-dark'}`}>
            <ShoppingCart size={13} />
            {justAdded ? 'Added!' : inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
