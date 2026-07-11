'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Package, ChevronLeft, Search, X, EyeOff } from 'lucide-react';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';
import { shopsApi, partsApi, getUser, resolveUploadUrl } from '@/lib/api';
import { toProductCard } from '@/lib/mappers';

export default function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = getUser();

  const [shop, setShop] = useState<any>(null);
  const [parts, setParts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCondition, setActiveCondition] = useState('All');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      shopsApi.get(Number(id)),
      partsApi.byShop(Number(id)).catch(() => []),
      shopsApi.reviews(Number(id)).catch(() => []),
    ])
      .then(([sh, prts, revs]) => { setShop(sh); setParts(prts); setReviews(revs); })
      .catch(() => setShop(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && shop && user.id === shop.seller_id;
  const shopCategories = useMemo(() => ['All', ...(shop?.categories || []).map((c: any) => c.name)], [shop]);

  const products = parts.map(toProductCard);
  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (activeCondition !== 'All' && p.condition !== activeCondition.toLowerCase()) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-teal-border border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted">
        <Package size={40} className="opacity-30" />
        <p className="font-bold text-dark">Shop not found</p>
        <Link href="/shops" className="btn-teal">Back to Shops</Link>
      </div>
    );
  }

  if (!shop.is_active && !isOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted px-4 text-center">
        <EyeOff size={40} className="opacity-30" />
        <h1 className="font-black text-dark text-xl">This shop is currently unavailable</h1>
        <p className="text-sm max-w-sm">The seller has temporarily disabled this shop. Check back later or browse other shops.</p>
        <Link href="/shops" className="btn-teal">Back to Shops</Link>
      </div>
    );
  }

  const cover = shop.cover_image ? resolveUploadUrl(shop.cover_image) : '';

  return (
    <div className="min-h-screen bg-white">
      {/* Cover */}
      <div className="gradient-teal h-48 relative overflow-hidden">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={shop.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#fff_0px,#fff_1px,transparent_1px,transparent_10px)]" />
        <div className="absolute top-4 left-4">
          <Link href="/shops" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors">
            <ChevronLeft size={16} /> Back to Shops
          </Link>
        </div>
        {!shop.is_active && isOwner && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
            <EyeOff size={14} /> Disabled — only visible to you
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
                    <StarRating rating={Number(shop.rating_avg || 0)} />
                    <span className="text-sm text-muted">({shop.reviews_count || 0} reviews)</span>
                    <span className="flex items-center gap-1 text-sm text-muted"><Package size={13} />{parts.length} products</span>
                  </div>
                </div>
                <Link href="/request" className="btn-primary">Request a Part</Link>
              </div>
              {shop.description && <p className="text-muted text-sm mt-3 leading-relaxed">{shop.description}</p>}
              <div className="flex flex-wrap gap-4 mt-4">
                {shop.city && <span className="flex items-center gap-1.5 text-sm text-muted"><MapPin size={13} className="text-teal" />{shop.city}</span>}
                {shop.phone && <span className="flex items-center gap-1.5 text-sm text-muted"><Phone size={13} className="text-teal" />{shop.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 pb-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {shopCategories.length > 1 && (
              <div className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-1">
                  {shopCategories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat ? 'bg-teal text-white font-bold' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Condition</h3>
              <div className="space-y-1">
                {['All', 'New', 'Used'].map((cond) => (
                  <button key={cond} onClick={() => setActiveCondition(cond)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCondition === cond ? 'bg-teal text-white font-bold' : 'text-muted hover:bg-teal-wash hover:text-dark'}`}>
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 card-shadow border border-teal-border">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Recent Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-muted">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 6).map((r) => (
                    <div key={r.id} className="border-b border-teal-border last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-dark">{r.customer?.name || 'Customer'}</span>
                        <span className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <StarRating rating={r.rating} size={11} showNumber={false} />
                      {r.comment && <p className="text-xs text-muted mt-1.5 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
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
